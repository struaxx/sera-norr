import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.89.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EventPayload {
  event_name: string;
  properties: {
    session_id: string;
    timestamp: string;
    page_url: string;
    referrer?: string;
    device_type?: string;
    [key: string]: unknown;
  };
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EventPayload = await req.json();
    
    // Validate required fields
    if (!payload.event_name || !payload.properties?.session_id) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: event_name, session_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Validate event name (whitelist of allowed events)
    const allowedEvents = [
      'page_view',
      'collection_view',
      'product_view',
      'material_interest',
      'size_range_interest',
      'cta_click',
      'lookbook_open',
      'lookbook_submit',
      'form_start',
      'form_submit',
      'topic_view',
      'faq_open',
    ];
    
    if (!allowedEvents.includes(payload.event_name)) {
      console.log(`[track-events] Invalid event name: ${payload.event_name}`);
      return new Response(
        JSON.stringify({ error: 'Invalid event name' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Sanitize base properties
    const sanitizedProperties: Record<string, unknown> = {
      timestamp: payload.properties.timestamp,
    };
    
    // Add event-specific properties (sanitized)
    switch (payload.event_name) {
      case 'page_view':
        sanitizedProperties.page_type = String(payload.properties.page_type || '').slice(0, 50);
        break;
      case 'collection_view':
        sanitizedProperties.collection_name = String(payload.properties.collection_name || '').slice(0, 50);
        break;
      case 'product_view':
        sanitizedProperties.product_id = String(payload.properties.product_id || '').slice(0, 50);
        sanitizedProperties.material = String(payload.properties.material || '').slice(0, 50);
        sanitizedProperties.shape = String(payload.properties.shape || '').slice(0, 50);
        sanitizedProperties.size_range = String(payload.properties.size_range || '').slice(0, 50);
        break;
      case 'material_interest':
        sanitizedProperties.material = String(payload.properties.material || '').slice(0, 50);
        break;
      case 'size_range_interest':
        sanitizedProperties.range = String(payload.properties.range || '').slice(0, 50);
        break;
      case 'cta_click':
        const ctaType = String(payload.properties.cta_type || '');
        sanitizedProperties.cta_type = ['proposal', 'consult', 'contact'].includes(ctaType) ? ctaType : 'unknown';
        break;
      case 'lookbook_open':
        sanitizedProperties.source = String(payload.properties.source || '').slice(0, 50);
        break;
      case 'lookbook_submit':
        sanitizedProperties.email_opt_in = Boolean(payload.properties.email_opt_in);
        sanitizedProperties.marketing_opt_in = Boolean(payload.properties.marketing_opt_in);
        break;
      case 'form_start':
      case 'form_submit':
        sanitizedProperties.form_type = String(payload.properties.form_type || '').slice(0, 50);
        break;
      case 'topic_view':
        const topic = String(payload.properties.topic || '');
        sanitizedProperties.topic = ['delivery', 'warranty', 'care'].includes(topic) ? topic : 'unknown';
        break;
      case 'faq_open':
        sanitizedProperties.topic = String(payload.properties.topic || '').slice(0, 100);
        break;
    }
    
    // UTM parameters (sanitized)
    ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'].forEach((key) => {
      if (payload.properties[key]) {
        sanitizedProperties[key] = String(payload.properties[key]).slice(0, 100);
      }
    });
    
    // Store event in database
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);
      
      const { error: dbError } = await supabase
        .from('analytics_events')
        .insert({
          event_name: payload.event_name,
          session_id: String(payload.properties.session_id).slice(0, 50),
          page_url: String(payload.properties.page_url || '').slice(0, 255),
          referrer: String(payload.properties.referrer || '').slice(0, 100),
          device_type: String(payload.properties.device_type || '').slice(0, 20),
          properties: sanitizedProperties,
        });
      
      if (dbError) {
        console.error('[track-events] Database error:', dbError);
      }
      
      // Optional: Forward to PostHog if configured
      const posthogKey = Deno.env.get('POSTHOG_API_KEY');
      if (posthogKey) {
        try {
          await fetch('https://eu.posthog.com/capture/', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              api_key: posthogKey,
              event: payload.event_name,
              distinct_id: payload.properties.session_id,
              properties: sanitizedProperties,
            }),
          });
          console.log('[track-events] Forwarded to PostHog');
        } catch (posthogError) {
          console.error('[track-events] PostHog error:', posthogError);
        }
      }
    }
    
    console.log('[track-events] Event stored:', payload.event_name);
    
    return new Response(
      JSON.stringify({ success: true }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('[track-events] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
