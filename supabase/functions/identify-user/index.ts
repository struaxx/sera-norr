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

    // Require a session_id so we can bind profile writes to the originating
    // session and prevent arbitrary profile pollution.
    if (!sessionId || !/^[a-zA-Z0-9_-]{8,50}$/.test(sessionId)) {
      return new Response(
        JSON.stringify({ error: 'Invalid session' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
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
    
    // Store in Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    
    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Prevent CRM poisoning: only allow updating an existing profile when
      // the request comes from the same originating session that created it.
      const { data: existing } = await supabase
        .from('user_profiles')
        .select('session_id')
        .eq('email', sanitizedEmail)
        .maybeSingle();

      if (existing && existing.session_id && existing.session_id !== sessionId) {
        console.warn('[identify-user] Session mismatch, refusing upsert for', sanitizedEmail);
        return new Response(
          JSON.stringify({ error: 'Forbidden' }),
          { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      // Upsert user profile
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          email: sanitizedEmail,
          session_id: sessionId,
          marketing_opt_in: Boolean(payload.marketing_opt_in),
          intent_level: intentLevel,
          intent_score: intentScore,
          last_viewed_product: lastViewedProduct,
          interest_tags: interestTags,
          last_updated_at: new Date().toISOString(),
        }, {
          onConflict: 'email',
        });
      
      if (profileError) {
        console.error('[identify-user] Profile error:', profileError);
      }
      
      // Also store in form_submissions for backward compatibility
      const { error: formError } = await supabase
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
      
      if (formError) {
        console.error('[identify-user] Form submission error:', formError);
      }
    }
    
    // Optional: Sync to Klaviyo if configured
    const klaviyoKey = Deno.env.get('KLAVIYO_API_KEY');
    const klaviyoListId = Deno.env.get('KLAVIYO_LIST_ID');
    
    if (klaviyoKey && payload.marketing_opt_in) {
      try {
        // Create/update Klaviyo profile
        const profileResponse = await fetch('https://a.klaviyo.com/api/profiles/', {
          method: 'POST',
          headers: {
            'Authorization': `Klaviyo-API-Key ${klaviyoKey}`,
            'Content-Type': 'application/json',
            'revision': '2024-02-15',
          },
          body: JSON.stringify({
            data: {
              type: 'profile',
              attributes: {
                email: sanitizedEmail,
                properties: {
                  intent_level: intentLevel,
                  intent_score: intentScore,
                  last_viewed_product: lastViewedProduct,
                  travertine_interest: payload.interests?.travertine || false,
                  viola_interest: payload.interests?.viola || false,
                  custom_interest: payload.interests?.custom || false,
                  size_interests: payload.interests?.sizes || [],
                  material_interests: payload.interests?.materials || [],
                },
              },
            },
          }),
        });
        
        if (profileResponse.ok && klaviyoListId) {
          const profileData = await profileResponse.json();
          const profileId = profileData.data?.id;
          
          if (profileId) {
            // Subscribe to list
            await fetch(`https://a.klaviyo.com/api/lists/${klaviyoListId}/relationships/profiles/`, {
              method: 'POST',
              headers: {
                'Authorization': `Klaviyo-API-Key ${klaviyoKey}`,
                'Content-Type': 'application/json',
                'revision': '2024-02-15',
              },
              body: JSON.stringify({
                data: [{ type: 'profile', id: profileId }],
              }),
            });
          }
        }
        
        console.log('[identify-user] Synced to Klaviyo');
      } catch (klaviyoError) {
        console.error('[identify-user] Klaviyo error:', klaviyoError);
      }
    } else if (!klaviyoKey) {
      console.log('[identify-user] Klaviyo not configured - skipping CRM sync');
    }
    
    console.log('[identify-user] Profile identified:', sanitizedEmail);
    
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
