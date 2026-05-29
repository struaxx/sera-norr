import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'customer_confirmation' | 'admin_notification' | 'both';
  buildCode: string;
  shareUrl: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerPostcode: string;
  configuration: Record<string, unknown>;
  priceEstimate: { vanafPrice: number };
  stoneName: string;
  shapeName: string;
  dimensionString: string;
  thicknessString: string;
  finishName: string;
  edgeName: string;
  baseName: string;
  customStoneRequest?: string;
  notes?: string;
  wantsCall?: boolean;
  leadTime: { min: number; max: number };
}

const ADMIN_EMAIL = "info@sera-norr.com";
const FROM_EMAIL = "SERA NORR <onboarding@resend.dev>";

const escapeHtml = (s: unknown): string =>
  String(s ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');

const safeUrl = (u: unknown): string => {
  const s = String(u ?? '');
  return /^https:\/\//i.test(s) ? escapeHtml(s) : '#';
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);

function buildCustomerHtml(body: EmailRequest): string {
  const name = escapeHtml(body.customerName);
  const shape = escapeHtml(body.shapeName);
  const stone = escapeHtml(body.stoneName);
  const dim = escapeHtml(body.dimensionString);
  const thick = escapeHtml(body.thicknessString);
  const finish = escapeHtml(body.finishName);
  const edge = escapeHtml(body.edgeName);
  const base = escapeHtml(body.baseName);
  const code = escapeHtml(body.buildCode);
  const custom = body.customStoneRequest ? escapeHtml(body.customStoneRequest) : '';
  const url = safeUrl(body.shareUrl);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>SERA NORR - Uw Project Dossier</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a1a;background:#f5f5f5;margin:0;padding:20px}
.c{max-width:600px;margin:0 auto;background:#fff}
.h{background:#1a1a1a;color:#fff;padding:30px;text-align:center}
.h h1{margin:0;font-size:24px;letter-spacing:.1em;font-weight:400}
.ct{padding:30px}
.code{font-family:monospace;font-size:14px;color:#666;margin-top:10px}
.specs{width:100%;border-collapse:collapse;margin:20px 0}
.specs td{padding:12px 0;border-bottom:1px solid #eee}
.specs td:first-child{color:#666}
.specs td:last-child{text-align:right;font-weight:500}
.pb{background:#f5f5f5;padding:20px;margin:20px 0}
.pl{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#666}
.pv{font-size:24px;font-weight:500;margin-top:5px}
.cta{text-align:center;margin:30px 0}
.cta a{display:inline-block;background:#1a1a1a;color:#fff;text-decoration:none;padding:15px 30px;font-size:14px}
.ft{text-align:center;padding:20px;color:#666;font-size:12px}
.tr{background:#1a1a1a;color:#fff;padding:15px;text-align:center;font-size:11px;letter-spacing:.05em}
</style></head><body>
<div class="c">
<div class="h"><h1>SERA NORR</h1><p style="margin:10px 0 0;font-size:12px;letter-spacing:.2em">PROJECT DOSSIER</p></div>
<div class="ct">
<p>Beste ${name},</p>
<p>Bedankt voor uw aanvraag. Hieronder vindt u een overzicht van uw project dossier.</p>
<p class="code">#${code}</p>
<h3 style="font-size:18px;margin-top:30px">${shape} - ${stone}</h3>
<table class="specs">
<tr><td>Vorm</td><td>${shape}</td></tr>
<tr><td>Afmetingen</td><td>${dim}</td></tr>
<tr><td>Bladdikte</td><td>${thick}</td></tr>
<tr><td>Steensoort</td><td>${stone}${custom ? ` (op aanvraag: ${custom})` : ''}</td></tr>
<tr><td>Afwerking</td><td>${finish}</td></tr>
<tr><td>Randprofiel</td><td>${edge}</td></tr>
<tr><td>Onderstel</td><td>${base}</td></tr>
<tr><td>Levertijd</td><td>${body.leadTime.min}-${body.leadTime.max} weken</td></tr>
</table>
<div class="pb">
<div class="pl">Vanaf</div>
<div class="pv">${formatPrice(body.priceEstimate.vanafPrice)}</div>
<p style="font-size:11px;color:#666;margin:10px 0 0">Definitieve prijs na persoonlijk voorstel</p>
</div>
<div class="cta"><a href="${url}">Bekijk uw ontwerp</a></div>
<p><strong>Wij nemen binnen 24 uur contact met u op</strong> om uw project te bespreken en een persoonlijk voorstel op te stellen.</p>
${body.wantsCall ? '<p>U heeft aangegeven interesse te hebben in een adviesgesprek. Wij plannen dit graag met u in.</p>' : ''}
<p style="color:#666;font-size:12px;margin-top:30px">Met vriendelijke groet,<br>Het SERA NORR team</p>
</div>
<div class="tr">Handgemaakt op bestelling &nbsp;.&nbsp; Ontworpen in NL &nbsp;.&nbsp; 2 jaar garantie</div>
<div class="ft"><p>info@sera-norr.com | sera-norr.com</p><p>Dit is een automatisch gegenereerd bericht.</p></div>
</div></body></html>`;
}

function buildAdminHtml(body: EmailRequest): string {
  const name = escapeHtml(body.customerName);
  const email = escapeHtml(body.customerEmail);
  const phone = escapeHtml(body.customerPhone);
  const postcode = escapeHtml(body.customerPostcode);
  const code = escapeHtml(body.buildCode);
  const shape = escapeHtml(body.shapeName);
  const stone = escapeHtml(body.stoneName);
  const dim = escapeHtml(body.dimensionString);
  const thick = escapeHtml(body.thicknessString);
  const finish = escapeHtml(body.finishName);
  const edge = escapeHtml(body.edgeName);
  const base = escapeHtml(body.baseName);
  const custom = body.customStoneRequest ? escapeHtml(body.customStoneRequest) : '';
  const notes = body.notes ? escapeHtml(body.notes) : '';
  const url = safeUrl(body.shareUrl);
  return `<!DOCTYPE html><html><head><meta charset="utf-8"><title>Nieuwe aanvraag - ${code}</title>
<style>
body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1a1a1a;padding:20px}
.alert{background:#fef3cd;border:1px solid #ffc107;padding:15px;margin-bottom:20px}
table{width:100%;border-collapse:collapse;margin:15px 0}
td,th{padding:10px;text-align:left;border-bottom:1px solid #ddd}
th{background:#f5f5f5;font-weight:500}
.cj{background:#f5f5f5;padding:15px;font-family:monospace;font-size:12px;overflow-x:auto;white-space:pre-wrap}
</style></head><body>
<h1>Nieuwe Configurator Aanvraag</h1>
${body.wantsCall ? '<div class="alert"><strong>Klant wil adviesgesprek plannen</strong></div>' : ''}
<h2>Klantgegevens</h2>
<table>
<tr><th>Naam</th><td>${name}</td></tr>
<tr><th>Email</th><td><a href="mailto:${email}">${email}</a></td></tr>
<tr><th>Telefoon</th><td><a href="tel:${phone}">${phone}</a></td></tr>
<tr><th>Postcode</th><td>${postcode}</td></tr>
</table>
<h2>Configuratie #${code}</h2>
<table>
<tr><th>Vorm</th><td>${shape}</td></tr>
<tr><th>Afmetingen</th><td>${dim}</td></tr>
<tr><th>Bladdikte</th><td>${thick}</td></tr>
<tr><th>Steensoort</th><td>${stone}</td></tr>
${custom ? `<tr><th>Custom steen</th><td><strong>${custom}</strong></td></tr>` : ''}
<tr><th>Afwerking</th><td>${finish}</td></tr>
<tr><th>Randprofiel</th><td>${edge}</td></tr>
<tr><th>Onderstel</th><td>${base}</td></tr>
<tr><th>Levertijd</th><td>${body.leadTime.min}-${body.leadTime.max} weken</td></tr>
<tr><th>Vanaf prijs</th><td><strong>${formatPrice(body.priceEstimate.vanafPrice)}</strong></td></tr>
</table>
${notes ? `<h2>Opmerkingen klant</h2><p>${notes}</p>` : ''}
<h2>Link naar ontwerp</h2>
<p><a href="${url}">${url}</a></p>
<h2>Volledige configuratie (JSON)</h2>
<div class="cj">${escapeHtml(JSON.stringify(body.configuration, null, 2))}</div>
</body></html>`;
}

async function sendEmail(apiKey: string, to: string, subject: string, html: string): Promise<{ success: boolean; error?: string }> {
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify({ from: FROM_EMAIL, to: [to], subject, html }),
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("[send-email] Resend error:", data);
    return { success: false, error: data?.message || "Resend API error" };
  }
  console.log("[send-email] Sent to", to, "id:", data.id);
  return { success: true };
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: EmailRequest = await req.json();
    console.log("[send-confirmation-email] Request:", { type: body.type, buildCode: body.buildCode, customerEmail: body.customerEmail });

    if (!body.buildCode || !body.customerEmail || !body.customerName) {
      return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // Basic input validation to prevent abuse
    const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const buildCodeRe = /^[A-Z0-9-]{5,80}$/i;
    if (!emailRe.test(body.customerEmail) || body.customerEmail.length > 255) {
      return new Response(JSON.stringify({ error: "Invalid email" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    if (!buildCodeRe.test(body.buildCode)) {
      return new Response(JSON.stringify({ error: "Invalid build code" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }
    if (body.shareUrl && !/^https:\/\//i.test(body.shareUrl)) {
      return new Response(JSON.stringify({ error: "Invalid share URL" }), { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    if (!resendApiKey) {
      console.error("[send-confirmation-email] RESEND_API_KEY not configured");
      return new Response(JSON.stringify({ error: "Email service not configured" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    // Log to database
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Bind email send to a real saved configuration: the buildCode must
    // exist in configurator_drafts. This prevents the endpoint from being
    // used as an open email relay for arbitrary recipients/content.
    const { data: draft, error: draftError } = await supabase
      .from("configurator_drafts")
      .select("build_code")
      .eq("build_code", body.buildCode)
      .maybeSingle();
    if (draftError || !draft) {
      console.warn("[send-confirmation-email] Unknown buildCode, refusing send:", body.buildCode);
      return new Response(JSON.stringify({ error: "Unknown build code" }), { status: 403, headers: { "Content-Type": "application/json", ...corsHeaders } });
    }

    await supabase.from("form_submissions").insert({
      form_type: 'configurator_email',
      email: body.customerEmail,
      name: body.customerName,
      phone: body.customerPhone,
      subject: `Configurator: ${body.buildCode}`,
      metadata: { buildCode: body.buildCode, shareUrl: body.shareUrl, configuration: body.configuration, priceEstimate: body.priceEstimate, customStoneRequest: body.customStoneRequest, wantsCall: body.wantsCall, emailType: body.type },
    });

    const results: { customer?: boolean; admin?: boolean } = {};

    // Send customer confirmation
    if (body.type === 'customer_confirmation' || body.type === 'both') {
      const r = await sendEmail(resendApiKey, body.customerEmail, `Uw SERA NORR Project Dossier #${body.buildCode}`, buildCustomerHtml(body));
      results.customer = r.success;
    }

    // Send admin notification
    if (body.type === 'admin_notification' || body.type === 'both') {
      const r = await sendEmail(resendApiKey, ADMIN_EMAIL, `🔔 Nieuwe aanvraag #${body.buildCode} — ${body.customerName}`, buildAdminHtml(body));
      results.admin = r.success;
    }

    return new Response(JSON.stringify({ success: true, results }), { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } });
  } catch (error) {
    console.error("[send-confirmation-email] Error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } });
  }
};

serve(handler);
