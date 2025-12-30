import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Validation schemas
const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
};

const validateString = (str: string | undefined, maxLength: number, required = false): boolean => {
  if (!str) return !required;
  return str.length <= maxLength;
};

const sanitizeString = (str: string | undefined): string | null => {
  if (!str) return null;
  // Remove HTML tags and trim
  return str.replace(/<[^>]*>/g, '').trim();
};

interface FormSubmission {
  form_type: 'contact' | 'voorstel' | 'lookbook' | 'bespoke';
  email: string;
  name?: string;
  phone?: string;
  subject?: string;
  message?: string;
  metadata?: Record<string, unknown>;
  honeypot?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: FormSubmission = await req.json();
    console.log("Received form submission:", { form_type: body.form_type, email: body.email });

    // Honeypot check - if filled, it's likely a bot
    if (body.honeypot && body.honeypot.length > 0) {
      console.log("Honeypot triggered - likely spam");
      // Return success to not alert the bot
      return new Response(JSON.stringify({ success: true }), {
        status: 200,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      });
    }

    // Validate form_type
    const validFormTypes = ['contact', 'voorstel', 'lookbook', 'bespoke'];
    if (!validFormTypes.includes(body.form_type)) {
      console.error("Invalid form type:", body.form_type);
      return new Response(
        JSON.stringify({ error: "Invalid form type" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate required email
    if (!body.email || !validateEmail(body.email)) {
      console.error("Invalid email:", body.email);
      return new Response(
        JSON.stringify({ error: "Invalid email address" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Validate string lengths
    if (!validateString(body.name, 100)) {
      return new Response(
        JSON.stringify({ error: "Name too long (max 100 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateString(body.phone, 50)) {
      return new Response(
        JSON.stringify({ error: "Phone too long (max 50 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateString(body.subject, 200)) {
      return new Response(
        JSON.stringify({ error: "Subject too long (max 200 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (!validateString(body.message, 5000)) {
      return new Response(
        JSON.stringify({ error: "Message too long (max 5000 characters)" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase client with service role for backend operations
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limiting: Check if email submitted in last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const { count, error: countError } = await supabase
      .from("form_submissions")
      .select("*", { count: "exact", head: true })
      .eq("email", body.email.toLowerCase())
      .eq("form_type", body.form_type)
      .gte("created_at", oneHourAgo);

    if (countError) {
      console.error("Rate limit check error:", countError);
    } else if (count && count >= 3) {
      console.log("Rate limit exceeded for:", body.email);
      return new Response(
        JSON.stringify({ error: "Too many submissions. Please try again later." }),
        { status: 429, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Get client info
    const ipAddress = req.headers.get("x-forwarded-for") || req.headers.get("cf-connecting-ip") || "unknown";
    const userAgent = req.headers.get("user-agent") || "unknown";

    // Insert submission
    const { data, error } = await supabase
      .from("form_submissions")
      .insert({
        form_type: body.form_type,
        email: body.email.toLowerCase().trim(),
        name: sanitizeString(body.name),
        phone: sanitizeString(body.phone),
        subject: sanitizeString(body.subject),
        message: sanitizeString(body.message),
        metadata: body.metadata || {},
        ip_address: ipAddress,
        user_agent: userAgent.substring(0, 500),
      })
      .select()
      .single();

    if (error) {
      console.error("Database insert error:", error);
      return new Response(
        JSON.stringify({ error: "Failed to submit form. Please try again." }),
        { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    console.log("Form submission saved:", data.id);

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("Error in submit-form function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
