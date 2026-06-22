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

    // Send email notification to admin
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (resendApiKey) {
      try {
        const subjectMap: Record<string, string> = {
          'algemeen': 'Algemene vraag',
          'maatwerk': 'Maatwerk',
          'samenwerking': 'Samenwerking',
        };
        const subjectLabel = body.subject
          ? (subjectMap[body.subject] || body.subject)
          : (body.form_type === 'voorstel'
              ? 'Voorstel-aanvraag via configurator'
              : body.form_type === 'lookbook'
                ? 'Lookbook-aanvraag'
                : body.form_type === 'bespoke'
                  ? 'Maatwerk-aanvraag'
                  : 'Algemene vraag');

        const formTypeLabels: Record<string, string> = {
          contact: 'Contactformulier',
          voorstel: 'Voorstel-aanvraag (configurator)',
          lookbook: 'Lookbook-aanvraag',
          bespoke: 'Maatwerk-aanvraag',
        };
        const formTypeLabel = formTypeLabels[body.form_type] || body.form_type;

        const metadataRows = body.metadata && typeof body.metadata === 'object'
          ? Object.entries(body.metadata)
              .filter(([, v]) => v !== null && v !== undefined && v !== '')
              .map(([k, v]) => `<tr><th>${k}</th><td>${String(v).replace(/[<>]/g, '')}</td></tr>`)
              .join('')
          : '';

        const adminHtml = `<!DOCTYPE html><html><head><meta charset="utf-8">
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a1a;padding:20px}
table{width:100%;border-collapse:collapse;margin:15px 0}
td,th{padding:10px;text-align:left;border-bottom:1px solid #ddd}
th{background:#f5f5f5;font-weight:500;width:120px}
.msg{background:#f9f9f9;padding:20px;margin:15px 0;white-space:pre-wrap}
</style></head><body>
<h1>📩 Nieuw ${formTypeLabel}</h1>
<table>
<tr><th>Naam</th><td>${sanitizeString(body.name) || '— (niet opgegeven)'}</td></tr>
<tr><th>Email</th><td><a href="mailto:${body.email}">${body.email}</a></td></tr>
${body.phone ? `<tr><th>Telefoon</th><td>${sanitizeString(body.phone)}</td></tr>` : ''}
<tr><th>Onderwerp</th><td>${subjectLabel}</td></tr>
</table>
${metadataRows ? `<h2>Configuratie</h2><table>${metadataRows}</table>` : ''}
<h2>Bericht / notities</h2>
<div class="msg">${sanitizeString(body.message) || '— (geen notities toegevoegd door klant)'}</div>
<p style="color:#999;font-size:11px">Verzonden op ${new Date().toLocaleString('nl-NL', { timeZone: 'Europe/Amsterdam' })}</p>
</body></html>`;

        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendApiKey}` },
          body: JSON.stringify({
            from: "SERA NORR <onboarding@resend.dev>",
            to: ["info@sera-norr.com"],
            subject: `📩 ${formTypeLabel} — ${sanitizeString(body.name) || body.email}`,
            html: adminHtml,
          }),
        });
        const emailData = await emailRes.json();
        if (!emailRes.ok) {
          console.error("Resend error:", emailData);
        } else {
          console.log("Admin notification sent, id:", emailData.id);
        }
      } catch (emailError) {
        console.error("Failed to send admin notification:", emailError);
      }
    } else {
      console.warn("RESEND_API_KEY not configured, skipping email notification");
    }

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
