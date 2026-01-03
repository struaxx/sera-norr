import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_API_VERSION = "2025-07";
const DEFAULT_SHOP_DOMAIN = "ygc1q1-4j.myshopify.com";

type StorefrontProxyRequest = {
  query: string;
  variables?: Record<string, unknown>;
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const token = Deno.env.get("SHOPIFY_STOREFRONT_ACCESS_TOKEN") || Deno.env.get("SHOPIFY_STOREFRONT_TOKEN");
  const shopDomain = Deno.env.get("SHOPIFY_STORE_DOMAIN") || DEFAULT_SHOP_DOMAIN;

  if (!token) {
    return new Response(JSON.stringify({ error: "Shopify token missing" }), {
      status: 500,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  let body: StorefrontProxyRequest | null = null;
  try {
    body = await req.json();
  } catch {
    // ignore
  }

  if (!body || typeof body.query !== "string" || body.query.trim().length === 0) {
    return new Response(JSON.stringify({ error: "Invalid request" }), {
      status: 400,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Basic abuse guard
  if (body.query.length > 50_000) {
    return new Response(JSON.stringify({ error: "Query too large" }), {
      status: 413,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  const url = `https://${shopDomain}/api/${SHOPIFY_API_VERSION}/graphql.json`;

  try {
    const resp = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-Shopify-Storefront-Access-Token": token,
      },
      body: JSON.stringify({
        query: body.query,
        variables: body.variables ?? {},
      }),
    });

    const contentType = resp.headers.get("content-type") || "application/json";
    const text = await resp.text();

    return new Response(text, {
      status: resp.status,
      headers: {
        "Content-Type": contentType,
        ...corsHeaders,
      },
    });
  } catch (error) {
    console.error("shopify-storefront proxy error:", error);
    return new Response(JSON.stringify({ error: "Upstream request failed" }), {
      status: 502,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }
});
