import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Bell, Plus, Eye, AlertTriangle } from 'lucide-react';
import { useWatchpointsData } from '@/hooks/useAdminData';

export const WatchpointsSection: React.FC = () => {
  const { watchpoints, recentFirings, isLoading } = useWatchpointsData();

  const armedCount = watchpoints.filter(w => w.status === 'armed').length;
  const disarmedCount = watchpoints.filter(w => w.status === 'disarmed').length;
  const recentTriggersCount = recentFirings.filter(f => 
    new Date(f.fired_at) > new Date(Date.now() - 24 * 60 * 60 * 1000)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Watchpoints & Triggers</h2>
          <p className="text-sm text-foreground-muted">
            Configure automated monitoring and response triggers
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Watchpoint
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Watchpoint Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Armed</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge className="bg-success/20 text-success border-success/30">{armedCount}</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Disarmed</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge variant="outline">{disarmedCount}</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Triggered (24h)</span>
                {isLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge className="bg-warning/20 text-warning border-warning/30">{recentTriggersCount}</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="glass-secondary">
            <CardHeader>
              <CardTitle>Active Watchpoints</CardTitle>
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
                ) : watchpoints.length === 0 ? (
                  <p className="text-sm text-foreground-muted">No watchpoints configured</p>
                ) : (
                  watchpoints.slice(0, 5).map((watchpoint) => (
                    <div key={watchpoint.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
                          watchpoint.status === 'armed' 
                            ? 'bg-success/20' 
                            : recentFirings.some(f => f.rule_id) 
                              ? 'bg-warning/20' 
                              : 'bg-muted/20'
                        }`}>
                          {watchpoint.status === 'armed' ? (
                            <Eye className="h-4 w-4 text-success" />
                          ) : (
                            <AlertTriangle className="h-4 w-4 text-warning" />
                          )}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{watchpoint.risk_channel || 'System Monitor'}</p>
                          <p className="text-xs text-foreground-muted">
                            EWS Probability: {(watchpoint.ews_prob * 100).toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <Badge className={
                        watchpoint.status === 'armed' 
                          ? "bg-success/20 text-success border-success/30"
                          : "bg-muted/20 text-muted-foreground border-muted/30"
                      }>
                        {watchpoint.status}
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