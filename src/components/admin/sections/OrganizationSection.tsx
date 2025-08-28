import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Building2, Settings, Users, Bell } from 'lucide-react';

export const OrganizationSection: React.FC = () => {
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
                <p className="font-mono">org_12345...</p>
              </div>
              <div>
                <span className="text-foreground-muted">Plan</span>
                <p>Enterprise</p>
              </div>
              <div>
                <span className="text-foreground-muted">Members</span>
                <p>12 active</p>
              </div>
              <div>
                <span className="text-foreground-muted">Region</span>
                <p>US-East</p>
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
                <Badge>8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Trigger Rules</span>
                <Badge variant="outline">15</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Data Sources</span>
                <Badge variant="secondary">5</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle>Organization Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-foreground-muted text-sm mb-4">
            Configuration and preference management coming soon.
          </p>
          <Button variant="outline" disabled>
            Configure Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};