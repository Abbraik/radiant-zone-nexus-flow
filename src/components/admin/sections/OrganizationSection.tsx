import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Building2, Settings, Users, Bell } from 'lucide-react';
import { useWatchpointsData, useOverviewStats } from '@/hooks/useAdminData';
import { supabase } from '@/integrations/supabase/client';

export const OrganizationSection: React.FC = () => {
  const { watchpoints } = useWatchpointsData();
  const { data: stats, isLoading: statsLoading } = useOverviewStats();
  
  const [orgId, setOrgId] = React.useState<string>('');
  
  React.useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        setOrgId(user.id);
      }
    };
    getCurrentUser();
  }, []);

  const activeWatchpointsCount = watchpoints.filter(w => w.status === 'armed').length;
  const totalMembersCount = stats?.totalUsers || 0;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">Organization</h2>
        <p className="text-sm text-foreground-muted">
          Manage organization settings, branding, and configuration
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Organization Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-foreground-muted">Organization ID</span>
                {orgId ? (
                  <p className="font-mono">{orgId.slice(0, 8)}...</p>
                ) : (
                  <Skeleton className="h-4 w-24" />
                )}
              </div>
              <div>
                <span className="text-foreground-muted">Plan</span>
                <p>5C Enterprise</p>
              </div>
              <div>
                <span className="text-foreground-muted">Members</span>
                {statsLoading ? (
                  <Skeleton className="h-4 w-16" />
                ) : (
                  <p>{totalMembersCount} active</p>
                )}
              </div>
              <div>
                <span className="text-foreground-muted">Region</span>
                <p>Cloud</p>
              </div>
            </div>
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Edit Settings
            </Button>
          </CardContent>
        </Card>

        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-warning" />
              Quick Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Watchpoints</span>
                {statsLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge>{activeWatchpointsCount}</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Tasks</span>
                {statsLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge variant="outline">{stats?.totalTasks || 0}</Badge>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Claims</span>
                {statsLoading ? (
                  <Skeleton className="h-5 w-8" />
                ) : (
                  <Badge variant="secondary">{stats?.activeClaims || 0}</Badge>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle>5C Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground-muted text-sm mb-4">
            Your 5C workspace is connected and operational. Advanced configuration options coming soon.
          </p>
          <div className="flex gap-2">
            <Button variant="outline" disabled>
              Configure Capacities
            </Button>
            <Button variant="outline" disabled>
              Manage Loops
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};