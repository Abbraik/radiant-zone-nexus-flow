import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Bell, Plus, Eye, AlertTriangle } from 'lucide-react';

export const WatchpointsSection: React.FC = () => {
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
                <Badge className="bg-success/20 text-success border-success/30">8</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Disarmed</span>
                <Badge variant="outline">3</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Triggered (24h)</span>
                <Badge className="bg-warning/20 text-warning border-warning/30">2</Badge>
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
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                      <Eye className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Housing Price Monitor</p>
                      <p className="text-xs text-foreground-muted">Threshold: &gt;15% monthly increase</p>
                    </div>
                  </div>
                  <Badge className="bg-success/20 text-success border-success/30">Armed</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Unemployment Spike</p>
                      <p className="text-xs text-foreground-muted">Recently triggered</p>
                    </div>
                  </div>
                  <Badge className="bg-warning/20 text-warning border-warning/30">Triggered</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};