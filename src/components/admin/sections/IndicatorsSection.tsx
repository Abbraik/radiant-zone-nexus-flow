import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { BarChart3, Plus, TrendingUp, AlertTriangle } from 'lucide-react';

export const IndicatorsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Indicators & DE Bands</h2>
          <p className="text-sm text-foreground-muted">
            Manage indicators, detection bands, and signal processing
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Indicator
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Indicator Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Indicators</span>
                <Badge>24</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">In Band</span>
                <Badge className="bg-success/20 text-success border-success/30">18</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Out of Band</span>
                <Badge className="bg-warning/20 text-warning border-warning/30">6</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="glass-secondary">
            <CardHeader>
              <CardTitle>Recent Band Breaches</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-warning/20 flex items-center justify-center">
                      <AlertTriangle className="h-4 w-4 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Housing Affordability Index</p>
                      <p className="text-xs text-foreground-muted">Upper band breach detected</p>
                    </div>
                  </div>
                  <Badge className="bg-warning/20 text-warning border-warning/30">Critical</Badge>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-info/20 flex items-center justify-center">
                      <TrendingUp className="h-4 w-4 text-info" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Employment Rate</p>
                      <p className="text-xs text-foreground-muted">Trending upward</p>
                    </div>
                  </div>
                  <Badge variant="outline">Normal</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};