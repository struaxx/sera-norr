import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.89.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface DashboardMetrics {
  overview: {
    totalSessions: number;
    totalEvents: number;
    uniqueVisitors: number;
    avgEventsPerSession: number;
  };
  intentDistribution: {
    low: number;
    medium: number;
    high: number;
  };
  topSegments: Array<{
    name: string;
    count: number;
  }>;
  eventBreakdown: Array<{
    event_name: string;
    count: number;
  }>;
  topSources: Array<{
    source: string;
    count: number;
  }>;
  conversionFunnel: {
    productViews: number;
    ctaClicks: number;
    formSubmits: number;
  };
  recentProfiles: number;
  marketingOptIns: number;
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authentication: require service role key in Authorization header
    const authHeader = req.headers.get('authorization');
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
    const expectedAuth = `Bearer ${supabaseKey}`;

    if (!authHeader || authHeader !== expectedAuth) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL');
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Missing Supabase configuration');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Get time range from query params (default: last 30 days)
    const url = new URL(req.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    
    // Fetch all required data in parallel
    const [
      eventsResult,
      profilesResult,
      sessionsResult,
    ] = await Promise.all([
      // All events in time range
      supabase
        .from('analytics_events')
        .select('*')
        .gte('created_at', startDate.toISOString())
        .order('created_at', { ascending: false }),
      
      // All user profiles
      supabase
        .from('user_profiles')
        .select('*')
        .gte('first_identified_at', startDate.toISOString()),
      
      // Unique sessions
      supabase
        .from('analytics_events')
        .select('session_id')
        .gte('created_at', startDate.toISOString()),
    ]);
    
    const events = eventsResult.data || [];
    const profiles = profilesResult.data || [];
    const sessions = sessionsResult.data || [];
    
    // Calculate unique sessions
    const uniqueSessions = new Set(sessions.map(s => s.session_id));
    
    // Calculate event breakdown
    const eventCounts: Record<string, number> = {};
    events.forEach(e => {
      eventCounts[e.event_name] = (eventCounts[e.event_name] || 0) + 1;
    });
    
    const eventBreakdown = Object.entries(eventCounts)
      .map(([event_name, count]) => ({ event_name, count }))
      .sort((a, b) => b.count - a.count);
    
    // Calculate UTM source breakdown
    const sourceCounts: Record<string, number> = {};
    events.forEach(e => {
      const source = e.properties?.utm_source || 'direct';
      sourceCounts[source] = (sourceCounts[source] || 0) + 1;
    });
    
    const topSources = Object.entries(sourceCounts)
      .map(([source, count]) => ({ source, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Calculate intent distribution from profiles
    const intentDistribution = {
      low: profiles.filter(p => p.intent_level === 'low').length,
      medium: profiles.filter(p => p.intent_level === 'medium').length,
      high: profiles.filter(p => p.intent_level === 'high').length,
    };
    
    // Calculate top segments from interest tags
    const segmentCounts: Record<string, number> = {};
    profiles.forEach(p => {
      if (Array.isArray(p.interest_tags)) {
        p.interest_tags.forEach((tag: string) => {
          segmentCounts[tag] = (segmentCounts[tag] || 0) + 1;
        });
      }
    });
    
    const topSegments = Object.entries(segmentCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Calculate conversion funnel
    const conversionFunnel = {
      productViews: eventCounts['product_view'] || 0,
      ctaClicks: eventCounts['cta_click'] || 0,
      formSubmits: eventCounts['form_submit'] || 0,
    };
    
    // Marketing opt-ins
    const marketingOptIns = profiles.filter(p => p.marketing_opt_in).length;
    
    const metrics: DashboardMetrics = {
      overview: {
        totalSessions: uniqueSessions.size,
        totalEvents: events.length,
        uniqueVisitors: uniqueSessions.size, // Approximation
        avgEventsPerSession: uniqueSessions.size > 0 
          ? Math.round((events.length / uniqueSessions.size) * 10) / 10 
          : 0,
      },
      intentDistribution,
      topSegments,
      eventBreakdown,
      topSources,
      conversionFunnel,
      recentProfiles: profiles.length,
      marketingOptIns,
    };
    
    console.log('[analytics-dashboard] Metrics generated for', days, 'days');
    
    return new Response(
      JSON.stringify(metrics),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
    
  } catch (error) {
    console.error('[analytics-dashboard] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
