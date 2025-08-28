import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Code, Plus, FileText, Layers } from 'lucide-react';

export const TemplatesSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Task Templates & Playbooks</h2>
          <p className="text-sm text-foreground-muted">
            Manage reusable task templates and operational playbooks
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Task Templates
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="text-sm font-medium">Standard Investigation</p>
                  <p className="text-xs text-foreground-muted">Used in responsive capacity</p>
                </div>
                <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="text-sm font-medium">Policy Review</p>
                  <p className="text-xs text-foreground-muted">Used in deliberative capacity</p>
                </div>
                <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="text-sm font-medium">Data Collection</p>
                  <p className="text-xs text-foreground-muted">Multi-capacity template</p>
                </div>
                <Badge variant="outline">Draft</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Layers className="h-5 w-5 text-accent" />
              Playbooks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="text-sm font-medium">Crisis Response</p>
                  <p className="text-xs text-foreground-muted">Emergency procedures</p>
                </div>
                <Badge className="bg-success/20 text-success border-success/30">Published</Badge>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                <div>
                  <p className="text-sm font-medium">Routine Monitoring</p>
                  <p className="text-xs text-foreground-muted">Daily operations guide</p>
                </div>
                <Badge className="bg-success/20 text-success border-success/30">Published</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};