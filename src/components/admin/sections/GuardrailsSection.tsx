import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Settings, Plus, Shield, Clock } from 'lucide-react';

export const GuardrailsSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Guardrails & SLA Policies</h2>
          <p className="text-sm text-foreground-muted">
            Configure operational limits and service level agreements
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Policy
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Guardrail Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="text-sm font-medium">Task Concurrency Limit</p>
                  <p className="text-xs text-foreground-muted">Max 5 concurrent tasks per user</p>
                </div>
                <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="text-sm font-medium">Coverage Threshold</p>
                  <p className="text-xs text-foreground-muted">Max 80% system coverage per action</p>
                </div>
                <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-warning" />
              SLA Policies
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="text-sm font-medium">Responsive Tasks</p>
                  <p className="text-xs text-foreground-muted">Target: 4 hours</p>
                </div>
                <Badge variant="outline">Policy</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="text-sm font-medium">Deliberative Tasks</p>
                  <p className="text-xs text-foreground-muted">Target: 24 hours</p>
                </div>
                <Badge variant="outline">Policy</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};