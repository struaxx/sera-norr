// ============================================
// SERA NORR Configurator API
// ============================================
// Endpoints: save-config, load-config, calculate-price, request-quote

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { z } from 'https://esm.sh/zod@3.23.8';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// ============================================
// Input Validation Schemas
// ============================================

const VALID_PRODUCT_TYPES = ['dining-table', 'coffee-table', 'side-table', 'console'] as const;
const VALID_SHAPES = ['rectangular', 'round', 'oval', 'square', 'organic'] as const;
const VALID_FINISHES = ['honed', 'polished', 'matte'] as const;
const VALID_EDGE_PROFILES = ['straight', 'beveled', 'rounded', 'bullnose'] as const;
const VALID_BASE_TYPES = ['modern', 'monolith', 'architectural'] as const;

// Stone validation: allow any string from the 82-stone library (validated by pattern)
const STONE_ID_PATTERN = /^[a-z0-9-]{2,50}$/;

const DimensionsSchema = z.object({
  length: z.number().min(30).max(500),      // 30cm - 500cm
  width: z.number().min(30).max(300),       // 30cm - 300cm
  height: z.number().min(30).max(120),      // 30cm - 120cm
  thickness: z.number().min(1).max(10),     // 1cm - 10cm (updated for 20mm/30mm)
  radius: z.number().min(30).max(200).optional(),
});

const ExtrasSchema = z.object({
  sealer: z.boolean().default(false),
  delivery: z.boolean().default(false),
  installation: z.boolean().default(false),
  sampleKit: z.boolean().default(false),
});

const ConfiguratorStateSchema = z.object({
  productType: z.enum(VALID_PRODUCT_TYPES),
  shape: z.enum(VALID_SHAPES),
  dimensions: DimensionsSchema,
  stone: z.string().regex(STONE_ID_PATTERN, 'Invalid stone ID format'), // Now accepts all 82 stones
  finish: z.enum(VALID_FINISHES),
  edgeProfile: z.enum(VALID_EDGE_PROFILES),
  baseType: z.enum(VALID_BASE_TYPES),
  extras: ExtrasSchema,
});

const ContactSchema = z.object({
  name: z.string().min(1).max(100).trim(),
  email: z.string().email().max(255).trim(),
  phone: z.string().max(30).trim().optional(),
  location: z.string().max(200).trim().optional(),
  notes: z.string().max(5000).trim().optional(),
});

const QuoteRequestSchema = z.object({
  buildCode: z.string().regex(/^SN-[A-Z0-9-]{5,50}$/, 'Invalid build code format'),
  configuration: ConfiguratorStateSchema,
  priceEstimate: z.object({
    min: z.number().min(0).max(1000000),
    max: z.number().min(0).max(1000000),
    total: z.number().min(0).max(1000000),
  }),
  contact: ContactSchema,
  inspirationItems: z.array(z.string().max(100)).max(20).optional(),
});

const BuildCodeSchema = z.string().regex(/^SN-[A-Z0-9-]{5,50}$/, 'Invalid build code format');

// Maximum request body size (100KB)
const MAX_BODY_SIZE = 100_000;

// ============================================
// Types
// ============================================

type ConfiguratorState = z.infer<typeof ConfiguratorStateSchema>;
type QuoteRequest = z.infer<typeof QuoteRequestSchema>;

// ============================================
// Pricing Engine (Server-side)
// ============================================

const STONE_MULTIPLIERS: Record<string, number> = {
  travertine: 1.0,
  calacattaViola: 2.5,
  verdeAlpi: 1.8,
  neroMarquina: 1.6,
  biancoCarrara: 1.4,
  emperadorDark: 1.7,
  custom: 2.0,
};

const FINISH_MULTIPLIERS: Record<string, number> = {
  honed: 1.0,
  polished: 1.15,
  matte: 1.0,
};

const EDGE_MULTIPLIERS: Record<string, number> = {
  straight: 1.0,
  beveled: 1.1,
  rounded: 1.15,
  bullnose: 1.25,
};

const BASE_MULTIPLIERS: Record<string, number> = {
  modern: 1.0,
  monolith: 1.8,
  architectural: 1.4,
};

const EXTRAS_PRICING = {
  sealer: 150,
  delivery: 295,
  installation: 195,
  sampleKit: 45,
};

const BASE_PRICE_PER_SQM = 2800;

function calculatePriceServer(config: ConfiguratorState) {
  const { dimensions, shape, stone, finish, edgeProfile, baseType, extras } = config;

  // Calculate surface area
  let surfaceArea: number;
  if (shape === 'round' && dimensions.radius) {
    surfaceArea = Math.PI * Math.pow(dimensions.radius / 100, 2);
  } else if (shape === 'oval') {
    surfaceArea = Math.PI * (dimensions.length / 200) * (dimensions.width / 200);
  } else {
    surfaceArea = (dimensions.length / 100) * (dimensions.width / 100);
  }

  const basePrice = surfaceArea * BASE_PRICE_PER_SQM;
  const stoneMultiplier = STONE_MULTIPLIERS[stone] ?? 1;
  const finishMultiplier = FINISH_MULTIPLIERS[finish] ?? 1;
  const edgeMultiplier = EDGE_MULTIPLIERS[edgeProfile] ?? 1;
  const baseMultiplier = BASE_MULTIPLIERS[baseType] ?? 1;
  const thicknessMultiplier = 1 + ((dimensions.thickness - 3) * 0.1);

  let extrasTotal = 0;
  if (extras.sealer) extrasTotal += EXTRAS_PRICING.sealer;
  if (extras.delivery) extrasTotal += EXTRAS_PRICING.delivery;
  if (extras.installation) extrasTotal += EXTRAS_PRICING.installation;
  if (extras.sampleKit) extrasTotal += EXTRAS_PRICING.sampleKit;

  const materialCost = basePrice * stoneMultiplier * finishMultiplier * thicknessMultiplier;
  const constructionCost = materialCost * edgeMultiplier * baseMultiplier;
  const totalEstimate = constructionCost + extrasTotal;

  const variance = 0.15;
  return {
    basePrice: Math.round(basePrice),
    totalEstimate: Math.round(totalEstimate / 100) * 100,
    priceRange: {
      min: Math.round(totalEstimate * (1 - variance) / 100) * 100,
      max: Math.round(totalEstimate * (1 + variance) / 100) * 100,
    },
    breakdown: {
      material: Math.round(materialCost),
      construction: Math.round(constructionCost - materialCost),
      extras: extrasTotal,
    },
  };
}

// ============================================
// Build Code Generator
// ============================================

function generateBuildCode(config: ConfiguratorState): string {
  const parts = [
    'SN',
    config.productType.substring(0, 2).toUpperCase(),
    config.shape.substring(0, 2).toUpperCase(),
    config.stone.substring(0, 3).toUpperCase(),
    config.dimensions.length,
    config.dimensions.width,
    Date.now().toString(36).slice(-4).toUpperCase(),
  ];
  return parts.join('-');
}

// ============================================
// Validation Error Response
// ============================================

function createValidationErrorResponse(error: z.ZodError) {
  const issues = error.issues.map(issue => ({
    path: issue.path.join('.'),
    message: issue.message,
  }));
  
  console.warn('Validation failed:', JSON.stringify(issues));
  
  return new Response(
    JSON.stringify({ 
      success: false, 
      error: 'Validation failed',
      issues,
    }),
    { 
      status: 400,
      headers: { 
        ...corsHeaders, 
        'Content-Type': 'application/json' 
      } 
    }
  );
}

// ============================================
// Request Handlers
// ============================================

async function handleSaveConfig(supabase: any, config: ConfiguratorState, sessionId?: string) {
  const buildCode = generateBuildCode(config);
  const priceEstimate = calculatePriceServer(config);

  const { data, error } = await supabase
    .from('configurator_drafts')
    .upsert({
      build_code: buildCode,
      session_id: sessionId,
      configuration: config,
      price_estimate: priceEstimate,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'build_code' })
    .select()
    .single();

  if (error) {
    console.error('Save config error:', error);
    return { success: false, error: error.message };
  }

  return { 
    success: true, 
    buildCode, 
    savedAt: data.updated_at,
    priceEstimate,
  };
}

async function handleLoadConfig(supabase: any, buildCode: string) {
  const { data, error } = await supabase
    .from('configurator_drafts')
    .select('*')
    .eq('build_code', buildCode)
    .single();

  if (error) {
    console.error('Load config error:', error);
    return { success: false, error: 'Configuratie niet gevonden' };
  }

  return {
    success: true,
    configuration: data.configuration,
    priceEstimate: data.price_estimate,
    savedAt: data.updated_at,
  };
}

async function handleCalculatePrice(config: ConfiguratorState) {
  const priceEstimate = calculatePriceServer(config);
  return {
    success: true,
    ...priceEstimate,
  };
}

async function handleRequestQuote(supabase: any, request: QuoteRequest) {
  console.log('Processing quote request:', request.buildCode);

  // Recalculate price server-side (don't trust client price)
  const serverPrice = calculatePriceServer(request.configuration);

  // Save to form_submissions
  const { error: formError } = await supabase
    .from('form_submissions')
    .insert({
      form_type: 'configurator-quote',
      email: request.contact.email,
      name: request.contact.name,
      phone: request.contact.phone,
      message: request.contact.notes,
      metadata: {
        buildCode: request.buildCode,
        configuration: request.configuration,
        priceEstimate: serverPrice, // Use server-calculated price
        inspirationItems: request.inspirationItems,
        location: request.contact.location,
      },
    });

  if (formError) {
    console.error('Form submission error:', formError);
    return { success: false, error: 'Aanvraag kon niet worden verwerkt' };
  }

  // Generate dossier reference
  const dossierRef = `DOS-${request.buildCode}-${Date.now().toString(36).toUpperCase()}`;

  console.log('Quote request saved, dossier ref:', dossierRef);

  return {
    success: true,
    dossierRef,
    message: 'Uw aanvraag is ontvangen. Wij nemen binnen 48 uur contact met u op.',
    estimatedResponse: '48 uur',
  };
}

// ============================================
// Main Handler
// ============================================

Deno.serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const action = url.searchParams.get('action');

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get session ID from headers
    const sessionId = req.headers.get('x-session-id');

    let result: any;

    switch (action) {
      case 'save': {
        // Check payload size
        const bodyText = await req.text();
        if (bodyText.length > MAX_BODY_SIZE) {
          return new Response(
            JSON.stringify({ success: false, error: 'Request too large' }),
            { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const body = JSON.parse(bodyText);
        
        // Validate configuration
        const parseResult = ConfiguratorStateSchema.safeParse(body.configuration);
        if (!parseResult.success) {
          return createValidationErrorResponse(parseResult.error);
        }
        
        result = await handleSaveConfig(supabase, parseResult.data, sessionId || undefined);
        break;
      }

      case 'load': {
        const buildCode = url.searchParams.get('buildCode');
        if (!buildCode) {
          result = { success: false, error: 'Build code is required' };
        } else {
          // Validate build code format
          const parseResult = BuildCodeSchema.safeParse(buildCode);
          if (!parseResult.success) {
            return createValidationErrorResponse(parseResult.error);
          }
          result = await handleLoadConfig(supabase, parseResult.data);
        }
        break;
      }

      case 'calculate': {
        // Check payload size
        const bodyText = await req.text();
        if (bodyText.length > MAX_BODY_SIZE) {
          return new Response(
            JSON.stringify({ success: false, error: 'Request too large' }),
            { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const body = JSON.parse(bodyText);
        
        // Validate configuration
        const parseResult = ConfiguratorStateSchema.safeParse(body.configuration);
        if (!parseResult.success) {
          return createValidationErrorResponse(parseResult.error);
        }
        
        result = await handleCalculatePrice(parseResult.data);
        break;
      }

      case 'quote': {
        // Check payload size
        const bodyText = await req.text();
        if (bodyText.length > MAX_BODY_SIZE) {
          return new Response(
            JSON.stringify({ success: false, error: 'Request too large' }),
            { status: 413, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
          );
        }
        
        const body = JSON.parse(bodyText);
        
        // Validate entire quote request
        const parseResult = QuoteRequestSchema.safeParse(body);
        if (!parseResult.success) {
          return createValidationErrorResponse(parseResult.error);
        }
        
        result = await handleRequestQuote(supabase, parseResult.data);
        break;
      }

      default:
        result = { 
          success: false, 
          error: 'Unknown action. Use: save, load, calculate, quote' 
        };
    }

    return new Response(
      JSON.stringify(result),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Configurator API error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
