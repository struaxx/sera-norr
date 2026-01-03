import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.89.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IdentifyPayload {
  email: string;
  marketing_opt_in: boolean;
  session_id: string;
  intentLevel: 'low' | 'medium' | 'high';
  intentScore: number;
  lastViewedProduct: string | null;
  interests: {
    travertine: boolean;
    viola: boolean;
    custom: boolean;
    sizes: string[];
    materials: string[];
  };
}

// Email validation regex
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: IdentifyPayload = await req.json();
    
    // Validate email
    if (!payload.email || !emailRegex.test(payload.email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Sanitize and validate data
    const sanitizedEmail = payload.email.toLowerCase().trim().slice(0, 255);
    const sessionId = String(payload.session_id || '').slice(0, 50);
    const intentLevel = ['low', 'medium', 'high'].includes(payload.intentLevel) 
      ? payload.intentLevel 
      : 'low';
    const intentScore = Math.min(Math.max(Number(payload.intentScore) || 0, 0), 100);
    const lastViewedProduct = payload.lastViewedProduct 
      ? String(payload.lastViewedProduct).slice(0, 100) 
      : null;
    
    // Build interest tags array
    const interestTags: string[] = [];
    
    if (payload.interests?.travertine) {
      interestTags.push('travertine_interest');
    }
    if (payload.interests?.viola) {
      interestTags.push('viola_interest');
    }
    if (payload.interests?.custom) {
      interestTags.push('custom_interest');
    }
    
    // Add size interests
    if (Array.isArray(payload.interests?.sizes)) {
      payload.interests.sizes.slice(0, 5).forEach((size) => {
        interestTags.push(`size_${String(size).slice(0, 20)}`);
      });
    }
    
    // Add material interests
    if (Array.isArray(payload.interests?.materials)) {
      payload.interests.materials.slice(0, 5).forEach((material) => {
        interestTags.push(`material_${String(material).slice(0, 30)}`);
      });
    }
    
    // Build profile data for CRM/email integration
    const profileData = {
      email: sanitizedEmail,
      session_id: sessionId,
      marketing_opt_in: Boolean(payload.marketing_opt_in),
      intent_level: intentLevel,
      intent_score: intentScore,
      last_viewed_product: lastViewedProduct,
      interest_tags: interestTags,
      identified_at: new Date().toISOString(),
    };
    
    console.log('[identify-user] Profile data:', profileData);
    
    // Here you would integrate with your email/CRM platform
    // Examples:
    // - Klaviyo: POST to /api/identify or /api/track
    // - Mailchimp: POST to /3.0/lists/{list_id}/members
    // - Customer.io: POST to /api/v1/customers/{identifier}
    
    // For now, we log the data and store in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      // Store identification in form_submissions with special form_type
      const { error } = await supabase
        .from('form_submissions')
        .insert({
          form_type: 'user_identification',
          email: sanitizedEmail,
          metadata: {
            session_id: sessionId,
            marketing_opt_in: Boolean(payload.marketing_opt_in),
            intent_level: intentLevel,
            intent_score: intentScore,
            last_viewed_product: lastViewedProduct,
            interest_tags: interestTags,
          },
        });
      
      if (error) {
        console.error('[identify-user] Database error:', error);
      }
    }
    
    return new Response(
      JSON.stringify({ 
        success: true,
        profile: {
          intent_level: intentLevel,
          interest_tags: interestTags.length,
        }
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('[identify-user] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
