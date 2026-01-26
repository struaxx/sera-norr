import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface EmailRequest {
  type: 'customer_confirmation' | 'admin_notification';
  buildCode: string;
  shareUrl: string;
  customerEmail: string;
  customerName: string;
  customerPhone: string;
  customerPostcode: string;
  configuration: Record<string, unknown>;
  priceEstimate: {
    vanafPrice: number;
  };
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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body: EmailRequest = await req.json();
    console.log("[send-confirmation-email] Request received:", { 
      type: body.type, 
      buildCode: body.buildCode,
      customerEmail: body.customerEmail 
    });

    // Validate required fields
    if (!body.buildCode || !body.customerEmail || !body.customerName) {
      return new Response(
        JSON.stringify({ error: "Missing required fields" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // For now, we'll log the email content and store it in the database
    // In production, this would integrate with Resend/SendGrid
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Format price
    const formatPrice = (price: number) => 
      new Intl.NumberFormat('nl-NL', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(price);

    // Build email content for customer
    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>SERA NORR - Uw Project Dossier</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; background-color: #f5f5f5; margin: 0; padding: 20px; }
    .container { max-width: 600px; margin: 0 auto; background: white; }
    .header { background: #1a1a1a; color: white; padding: 30px; text-align: center; }
    .header h1 { margin: 0; font-size: 24px; letter-spacing: 0.1em; font-weight: 400; }
    .content { padding: 30px; }
    .code { font-family: monospace; font-size: 14px; color: #666; margin-top: 10px; }
    .specs { width: 100%; border-collapse: collapse; margin: 20px 0; }
    .specs td { padding: 12px 0; border-bottom: 1px solid #eee; }
    .specs td:first-child { color: #666; }
    .specs td:last-child { text-align: right; font-weight: 500; }
    .price-box { background: #f5f5f5; padding: 20px; margin: 20px 0; }
    .price-label { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #666; }
    .price-value { font-size: 24px; font-weight: 500; margin-top: 5px; }
    .cta { text-align: center; margin: 30px 0; }
    .cta a { display: inline-block; background: #1a1a1a; color: white; text-decoration: none; padding: 15px 30px; font-size: 14px; }
    .footer { text-align: center; padding: 20px; color: #666; font-size: 12px; }
    .trust { background: #1a1a1a; color: white; padding: 15px; text-align: center; font-size: 11px; letter-spacing: 0.05em; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>SERA NORR</h1>
      <p style="margin: 10px 0 0; font-size: 12px; letter-spacing: 0.2em;">PROJECT DOSSIER</p>
    </div>
    
    <div class="content">
      <p>Beste ${body.customerName},</p>
      
      <p>Bedankt voor uw aanvraag. Hieronder vindt u een overzicht van uw project dossier.</p>
      
      <p class="code">#${body.buildCode}</p>
      
      <h3 style="font-size: 18px; margin-top: 30px;">${body.shapeName} — ${body.stoneName}</h3>
      
      <table class="specs">
        <tr><td>Vorm</td><td>${body.shapeName}</td></tr>
        <tr><td>Afmetingen</td><td>${body.dimensionString}</td></tr>
        <tr><td>Bladdikte</td><td>${body.thicknessString}</td></tr>
        <tr><td>Steensoort</td><td>${body.stoneName}${body.customStoneRequest ? ` (op aanvraag: ${body.customStoneRequest})` : ''}</td></tr>
        <tr><td>Afwerking</td><td>${body.finishName}</td></tr>
        <tr><td>Randprofiel</td><td>${body.edgeName}</td></tr>
        <tr><td>Onderstel</td><td>${body.baseName}</td></tr>
        <tr><td>Levertijd</td><td>${body.leadTime.min}-${body.leadTime.max} weken</td></tr>
      </table>
      
      <div class="price-box">
        <div class="price-label">Vanaf</div>
        <div class="price-value">${formatPrice(body.priceEstimate.vanafPrice)}</div>
        <p style="font-size: 11px; color: #666; margin: 10px 0 0;">Definitieve prijs na persoonlijk voorstel</p>
      </div>
      
      <div class="cta">
        <a href="${body.shareUrl}">Bekijk uw ontwerp</a>
      </div>
      
      <p><strong>Wij nemen binnen 24 uur contact met u op</strong> om uw project te bespreken en een persoonlijk voorstel op te stellen.</p>
      
      ${body.wantsCall ? '<p>📞 U heeft aangegeven interesse te hebben in een adviesgesprek. Wij plannen dit graag met u in.</p>' : ''}
      
      <p style="color: #666; font-size: 12px; margin-top: 30px;">
        Met vriendelijke groet,<br>
        Het SERA NORR team
      </p>
    </div>
    
    <div class="trust">
      Handgemaakt op bestelling &nbsp;&nbsp;•&nbsp;&nbsp; Ontworpen in NL &nbsp;&nbsp;•&nbsp;&nbsp; 2 jaar garantie
    </div>
    
    <div class="footer">
      <p>info@seranorr.com | sera-norr.com</p>
      <p>Dit is een automatisch gegenereerd bericht.</p>
    </div>
  </div>
</body>
</html>
    `;

    // Build admin notification email
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Nieuwe aanvraag - ${body.buildCode}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; padding: 20px; }
    .alert { background: #fef3cd; border: 1px solid #ffc107; padding: 15px; margin-bottom: 20px; }
    table { width: 100%; border-collapse: collapse; margin: 15px 0; }
    td, th { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
    th { background: #f5f5f5; font-weight: 500; }
    .config-json { background: #f5f5f5; padding: 15px; font-family: monospace; font-size: 12px; overflow-x: auto; white-space: pre-wrap; }
  </style>
</head>
<body>
  <h1>🔔 Nieuwe Configurator Aanvraag</h1>
  
  ${body.wantsCall ? '<div class="alert">📞 <strong>Klant wil adviesgesprek plannen</strong></div>' : ''}
  
  <h2>Klantgegevens</h2>
  <table>
    <tr><th>Naam</th><td>${body.customerName}</td></tr>
    <tr><th>Email</th><td><a href="mailto:${body.customerEmail}">${body.customerEmail}</a></td></tr>
    <tr><th>Telefoon</th><td><a href="tel:${body.customerPhone}">${body.customerPhone}</a></td></tr>
    <tr><th>Postcode</th><td>${body.customerPostcode}</td></tr>
  </table>
  
  <h2>Configuratie #${body.buildCode}</h2>
  <table>
    <tr><th>Vorm</th><td>${body.shapeName}</td></tr>
    <tr><th>Afmetingen</th><td>${body.dimensionString}</td></tr>
    <tr><th>Bladdikte</th><td>${body.thicknessString}</td></tr>
    <tr><th>Steensoort</th><td>${body.stoneName}</td></tr>
    ${body.customStoneRequest ? `<tr><th>Custom steen</th><td><strong>${body.customStoneRequest}</strong></td></tr>` : ''}
    <tr><th>Afwerking</th><td>${body.finishName}</td></tr>
    <tr><th>Randprofiel</th><td>${body.edgeName}</td></tr>
    <tr><th>Onderstel</th><td>${body.baseName}</td></tr>
    <tr><th>Levertijd</th><td>${body.leadTime.min}-${body.leadTime.max} weken</td></tr>
    <tr><th>Vanaf prijs</th><td><strong>${formatPrice(body.priceEstimate.vanafPrice)}</strong></td></tr>
  </table>
  
  ${body.notes ? `<h2>Opmerkingen klant</h2><p>${body.notes}</p>` : ''}
  
  <h2>Link naar ontwerp</h2>
  <p><a href="${body.shareUrl}">${body.shareUrl}</a></p>
  
  <h2>Volledige configuratie (JSON)</h2>
  <div class="config-json">${JSON.stringify(body.configuration, null, 2)}</div>
</body>
</html>
    `;

    // Store email log in database (for tracking purposes)
    const { error: logError } = await supabase
      .from("form_submissions")
      .insert({
        form_type: 'configurator_email',
        email: body.customerEmail,
        name: body.customerName,
        phone: body.customerPhone,
        subject: `Configurator: ${body.buildCode}`,
        metadata: {
          buildCode: body.buildCode,
          shareUrl: body.shareUrl,
          configuration: body.configuration,
          priceEstimate: body.priceEstimate,
          customStoneRequest: body.customStoneRequest,
          wantsCall: body.wantsCall,
          emailType: body.type,
          customerEmailHtml: body.type === 'customer_confirmation' ? customerEmailHtml : undefined,
          adminEmailHtml: body.type === 'admin_notification' ? adminEmailHtml : undefined,
        },
      });

    if (logError) {
      console.error("[send-confirmation-email] Database log error:", logError);
    }

    // Note: Resend integration would require adding RESEND_API_KEY secret
    // For now, emails are logged in the database for manual follow-up
    // To enable automatic emails, add RESEND_API_KEY secret and uncomment below
    
    console.log("[send-confirmation-email] Email content logged to database");
    console.log("[send-confirmation-email] Customer email preview:", {
      to: body.customerEmail,
      subject: `Uw SERA NORR Project Dossier #${body.buildCode}`,
    });

    return new Response(
      JSON.stringify({ 
        success: true, 
        emailLogged: true,
        message: "Email logged - add RESEND_API_KEY to enable sending",
      }),
      { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error) {
    console.error("[send-confirmation-email] Error:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);
