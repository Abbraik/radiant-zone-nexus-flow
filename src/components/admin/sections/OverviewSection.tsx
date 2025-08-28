import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckCircle, Clock, AlertTriangle, Activity, 
  Users, Bell, FileText, TrendingUp 
} from 'lucide-react';
import { useOverviewStats } from '@/hooks/useAdminData';
import { Skeleton } from '@/components/ui/skeleton';

export const OverviewSection: React.FC = () => {
  const { data: stats, isLoading, error } = useOverviewStats();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Dashboard Overview</h2>
          <p className="text-sm text-foreground-muted">
            System health and key metrics at a glance
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="glass-secondary">
              <CardHeader className="pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-16" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Dashboard Overview</h2>
        </div>
        <Card className="glass-secondary border-destructive/20">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-4 w-4" />
              <span className="text-sm">Failed to load overview data</span>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Task counts by capacity
  const taskCounts = stats?.tasks.reduce((acc, task) => {
    acc[task.capacity] = (acc[task.capacity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>) || {};

  const totalActiveTasks = stats?.tasks.length || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Dashboard Overview</h2>
        <p className="text-sm text-foreground-muted">
          System health and key metrics at a glance
        </p>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Active Tasks */}
        <Card className="glass-secondary hover:glass-accent transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">
              Active Tasks
            </CardTitle>
            <Activity className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalActiveTasks}</div>
            <p className="text-xs text-foreground-muted">
              Across all capacities
            </p>
            <div className="flex flex-wrap gap-1 mt-2">
              {Object.entries(taskCounts).map(([capacity, count]) => (
                <Badge key={capacity} variant="outline" className="text-xs">
                  {capacity}: {count}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Active Watchpoints */}
        <Card className="glass-secondary hover:glass-accent transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">
              Armed Watchpoints
            </CardTitle>
            <Bell className="h-4 w-4 text-warning" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.activeWatchpoints}</div>
            <p className="text-xs text-foreground-muted">
              Ready to trigger
            </p>
          </CardContent>
        </Card>

        {/* SLA Breaches (24h) */}
        <Card className="glass-secondary hover:glass-accent transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">
              SLA Breaches (24h)
            </CardTitle>
            <AlertTriangle className="h-4 w-4 text-destructive" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.slaBreaches}</div>
            <p className="text-xs text-foreground-muted">
              {stats?.slaBreaches === 0 ? 'All SLAs met' : 'Requires attention'}
            </p>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="glass-secondary hover:glass-accent transition-all duration-300">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-foreground-muted">
              Recent Events
            </CardTitle>
            <FileText className="h-4 w-4 text-info" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{stats?.recentAudit.length}</div>
            <p className="text-xs text-foreground-muted">
              Last 20 audit entries
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Audit Activity */}
      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Recent Audit Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats?.recentAudit.slice(0, 5).map((entry) => (
              <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div className="flex items-center gap-3">
                  <Badge 
                    variant={entry.action === 'delete' ? 'destructive' : 'secondary'}
                    className="capitalize"
                  >
                    {entry.action}
                  </Badge>
                  <span className="text-sm text-foreground">{entry.resource_type}</span>
                  {entry.resource_id && (
                    <span className="text-xs text-foreground-muted font-mono">
                      {entry.resource_id.slice(0, 8)}...
                    </span>
                  )}
                </div>
                <div className="text-xs text-foreground-muted">
                  {new Date(entry.created_at).toLocaleString()}
                </div>
              </div>
            ))}
            
            {(!stats?.recentAudit || stats.recentAudit.length === 0) && (
              <div className="text-center py-6 text-foreground-muted">
                <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p className="text-sm">No recent audit activity</p>
              </div>
            )}
          </div>

          {stats?.recentAudit && stats.recentAudit.length > 5 && (
            <div className="mt-4 pt-4 border-t border-border">
              <Button variant="outline" size="sm" className="w-full">
                View Full Audit Log
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* System Health Indicators */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              System Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Database Connection</span>
                <Badge className="bg-success/20 text-success border-success/30">Healthy</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Authentication Service</span>
                <Badge className="bg-success/20 text-success border-success/30">Operational</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Processing</span>
                <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Users className="h-4 w-4 mr-2" />
                Invite New Member
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <Bell className="h-4 w-4 mr-2" />
                Create Watchpoint
              </Button>
              <Button variant="outline" size="sm" className="w-full justify-start">
                <FileText className="h-4 w-4 mr-2" />
                View System Logs
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};