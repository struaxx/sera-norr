import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const SHOPIFY_API_VERSION = "2025-07";
const DEFAULT_SHOP_DOMAIN = "ygc1q1-4j.myshopify.com";

// Rate limiting: 60 requests per minute per IP
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 60;
const requestCounts = new Map<string, { count: number; resetAt: number }>();

// Max query depth to prevent overly complex queries
const MAX_QUERY_DEPTH = 6;

type StorefrontProxyRequest = {
  query: string;
  variables?: Record<string, unknown>;
};

const checkRateLimit = (ip: string): boolean => {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetAt) {
    requestCounts.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }

  record.count++;
  return true;
};

const containsIntrospection = (query: string): boolean => {
  const lowerQuery = query.toLowerCase();
  return lowerQuery.includes("__schema") || lowerQuery.includes("__type");
};

const isMutation = (query: string): boolean => {
  return query.trim().toLowerCase().startsWith("mutation");
};

const getQueryDepth = (query: string): number => {
  return (query.match(/{/g) || []).length;
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

  // Rate limiting check
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";
  if (!checkRateLimit(ip)) {
    console.warn("Rate limit exceeded for IP:", ip.substring(0, 8) + "***");
    return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
      status: 429,
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

  // Block introspection queries
  if (containsIntrospection(body.query)) {
    console.warn("Introspection query blocked for IP:", ip.substring(0, 8) + "***");
    return new Response(JSON.stringify({ error: "Introspection queries are not allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Block mutations - only allow read operations
  if (isMutation(body.query)) {
    console.warn("Mutation blocked for IP:", ip.substring(0, 8) + "***");
    return new Response(JSON.stringify({ error: "Only query operations are allowed" }), {
      status: 403,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Query size limit
  if (body.query.length > 50_000) {
    return new Response(JSON.stringify({ error: "Query too large" }), {
      status: 413,
      headers: { "Content-Type": "application/json", ...corsHeaders },
    });
  }

  // Query complexity limit
  const depth = getQueryDepth(body.query);
  if (depth > MAX_QUERY_DEPTH) {
    console.warn("Query too complex (depth:", depth, ") for IP:", ip.substring(0, 8) + "***");
    return new Response(JSON.stringify({ error: "Query too complex" }), {
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
