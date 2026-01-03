import { Layout } from '@/components/layout';
import { useAnalyticsDashboard } from '@/hooks/use-analytics-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { 
  BarChart3, 
  Users, 
  MousePointerClick, 
  TrendingUp,
  Target,
  Mail,
  RefreshCw
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Insights = () => {
  const { metrics, loading, error, refetch } = useAnalyticsDashboard(30);

  const formatNumber = (num: number) => {
    return new Intl.NumberFormat('nl-NL').format(num);
  };

  const getIntentColor = (level: string) => {
    switch (level) {
      case 'high': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-gray-400';
      default: return 'bg-gray-300';
    }
  };

  const calculateConversionRate = (from: number, to: number) => {
    if (from === 0) return '0%';
    return `${Math.round((to / from) * 100)}%`;
  };

  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-6 py-24">
          <div className="text-center">
            <h1 className="text-2xl font-display mb-4">Er ging iets mis</h1>
            <p className="text-muted-foreground mb-6">{error}</p>
            <Button onClick={refetch}>Probeer opnieuw</Button>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-6 py-24">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-display font-light tracking-wide">
              Customer Insights
            </h1>
            <p className="text-muted-foreground mt-2">
              Privacy-safe analytics • Laatste 30 dagen
            </p>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={refetch}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Vernieuwen
          </Button>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Sessies
              </CardTitle>
              <Users className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatNumber(metrics?.overview.totalSessions || 0)}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Events
              </CardTitle>
              <MousePointerClick className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <>
                  <div className="text-2xl font-bold">
                    {formatNumber(metrics?.overview.totalEvents || 0)}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Gem. {metrics?.overview.avgEventsPerSession || 0} per sessie
                  </p>
                </>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Profielen
              </CardTitle>
              <Target className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatNumber(metrics?.recentProfiles || 0)}
                </div>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Marketing Opt-ins
              </CardTitle>
              <Mail className="w-4 h-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              {loading ? (
                <Skeleton className="h-8 w-24" />
              ) : (
                <div className="text-2xl font-bold">
                  {formatNumber(metrics?.marketingOptIns || 0)}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Intent Distribution */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Intent Verdeling
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  {['high', 'medium', 'low'].map((level) => {
                    const count = metrics?.intentDistribution[level as keyof typeof metrics.intentDistribution] || 0;
                    const total = (metrics?.intentDistribution.high || 0) + 
                                  (metrics?.intentDistribution.medium || 0) + 
                                  (metrics?.intentDistribution.low || 0);
                    const percentage = total > 0 ? (count / total) * 100 : 0;
                    
                    return (
                      <div key={level}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="capitalize font-medium">
                            {level === 'high' ? 'Hoog' : level === 'medium' ? 'Midden' : 'Laag'}
                          </span>
                          <span className="text-muted-foreground">{count}</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div 
                            className={`h-full ${getIntentColor(level)} transition-all`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Conversion Funnel */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                Conversie Funnel
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-4">
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <span>Product Views</span>
                    <span className="font-bold">
                      {formatNumber(metrics?.conversionFunnel.productViews || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div>
                      <span>CTA Clicks</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({calculateConversionRate(
                          metrics?.conversionFunnel.productViews || 0,
                          metrics?.conversionFunnel.ctaClicks || 0
                        )})
                      </span>
                    </div>
                    <span className="font-bold">
                      {formatNumber(metrics?.conversionFunnel.ctaClicks || 0)}
                    </span>
                  </div>
                  <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg">
                    <div>
                      <span>Form Submits</span>
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({calculateConversionRate(
                          metrics?.conversionFunnel.ctaClicks || 0,
                          metrics?.conversionFunnel.formSubmits || 0
                        )})
                      </span>
                    </div>
                    <span className="font-bold">
                      {formatNumber(metrics?.conversionFunnel.formSubmits || 0)}
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Top Segments */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Top Segmenten</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : metrics?.topSegments.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nog geen segment data beschikbaar
                </p>
              ) : (
                <div className="space-y-3">
                  {metrics?.topSegments.slice(0, 8).map((segment, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm truncate flex-1">
                        {segment.name.replace(/_/g, ' ')}
                      </span>
                      <span className="text-sm font-medium ml-2">
                        {segment.count}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Top Sources */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Traffic Bronnen</CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <Skeleton key={i} className="h-6 w-full" />
                  ))}
                </div>
              ) : metrics?.topSources.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Nog geen bron data beschikbaar
                </p>
              ) : (
                <div className="space-y-3">
                  {metrics?.topSources.slice(0, 8).map((source, i) => (
                    <div key={i} className="flex items-center justify-between">
                      <span className="text-sm capitalize truncate flex-1">
                        {source.source}
                      </span>
                      <span className="text-sm font-medium ml-2">
                        {formatNumber(source.count)}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Privacy Notice */}
        <div className="mt-12 text-center text-sm text-muted-foreground">
          <p>
            Deze data is geanonimiseerd en bevat geen persoonlijke informatie.
            <br />
            Alleen geaggregeerde segmenten en intent scores worden getoond.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Insights;
