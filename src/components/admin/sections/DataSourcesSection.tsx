import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, Plus, Activity, AlertCircle } from 'lucide-react';

export const DataSourcesSection: React.FC = () => {
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
                <Badge className="bg-success/20 text-success border-success/30">5</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Quality Issues</span>
                <Badge variant="outline">2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Offline</span>
                <Badge className="bg-destructive/20 text-destructive border-destructive/30">0</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="glass-secondary">
            <CardHeader>
              <CardTitle>Recent Source Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                      <Activity className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Labor Market API</p>
                      <p className="text-xs text-foreground-muted">Last sync: 2 minutes ago</p>
                    </div>
                  </div>
                  <Badge className="bg-success/20 text-success border-success/30">Online</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center">
                      <AlertCircle className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Housing Database</p>
                      <p className="text-xs text-foreground-muted">Quality issues detected</p>
                    </div>
                  </div>
                  <Badge className="bg-warning/20 text-warning border-warning/30">Warning</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};