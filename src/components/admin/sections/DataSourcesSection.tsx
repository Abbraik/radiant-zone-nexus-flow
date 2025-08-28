import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Database, Plus, Activity, AlertCircle, CheckCircle } from 'lucide-react';
import { useDataSources } from '@/hooks/useDataSources';

export const DataSourcesSection: React.FC = () => {
  const { sources, healthStats, isLoading } = useDataSources();

  const formatLastSync = (isoString: string) => {
    const date = new Date(isoString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)} hours ago`;
    return `${Math.floor(diffMins / 1440)} days ago`;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'online':
        return <CheckCircle className="h-4 w-4 text-success" />;
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-warning" />;
      case 'offline':
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <Activity className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'online':
        return "bg-success/20 text-success border-success/30";
      case 'warning':
        return "bg-warning/20 text-warning border-warning/30";
      case 'offline':
        return "bg-destructive/20 text-destructive border-destructive/30";
      default:
        return "bg-muted/20 text-muted-foreground border-muted/30";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Data Sources</h2>
          <p className="text-sm text-foreground-muted">
            Manage data source connections and quality monitoring
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Data Source
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Source Health
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Sources</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge className="bg-success/20 text-success border-success/30">{healthStats.active}</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Quality Issues</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge variant="outline">{healthStats.warning}</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Offline</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge className="bg-destructive/20 text-destructive border-destructive/30">{healthStats.offline}</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="glass-secondary">
            <CardHeader>
              <CardTitle>Data Source Status</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {isLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-8 w-8 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                          <Skeleton className="h-3 w-48" />
                        </div>
                      </div>
                      <Skeleton className="h-5 w-16" />
                    </div>
                  ))
                ) : sources.length === 0 ? (
                  <p className="text-sm text-foreground-muted">No data sources configured</p>
                ) : (
                  sources.map((source) => (
                    <div key={source.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-background flex items-center justify-center border border-border">
                          {getStatusIcon(source.status)}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{source.name}</p>
                          <p className="text-xs text-foreground-muted">
                            Last sync: {formatLastSync(source.last_sync)} • Quality: {source.quality_score}%
                          </p>
                        </div>
                      </div>
                      <Badge className={getStatusBadge(source.status)}>
                        {source.status}
                      </Badge>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};