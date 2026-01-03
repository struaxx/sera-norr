import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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

export const useAnalyticsDashboard = (days: number = 30) => {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchMetrics = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const { data, error: fnError } = await supabase.functions.invoke('analytics-dashboard', {
        body: {},
      });
      
      if (fnError) {
        throw fnError;
      }
      
      setMetrics(data);
    } catch (err) {
      console.error('Failed to fetch analytics:', err);
      setError('Kon analytics niet laden');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMetrics();
  }, [days]);

  return { metrics, loading, error, refetch: fetchMetrics };
};
