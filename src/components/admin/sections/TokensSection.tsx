import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Key, Plus, Eye, Copy } from 'lucide-react';

export const TokensSection: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">API Tokens</h2>
          <p className="text-sm text-foreground-muted">
            Manage API access tokens and external integrations
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Generate Token
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key className="h-5 w-5 text-primary" />
              Token Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Active Tokens</span>
                <Badge>4</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Expired</span>
                <Badge variant="outline">2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Revoked</span>
                <Badge className="bg-destructive/20 text-destructive border-destructive/30">1</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="glass-secondary">
            <CardHeader>
              <CardTitle>Active Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-success/20 flex items-center justify-center">
                      <Key className="h-4 w-4 text-success" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Dashboard Integration</p>
                      <p className="text-xs text-foreground-muted font-mono">tk_dash_***...abc123</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-success/20 text-success border-success/30">Active</Badge>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-info/20 flex items-center justify-center">
                      <Eye className="h-4 w-4 text-info" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Public Status API</p>
                      <p className="text-xs text-foreground-muted font-mono">tk_pub_***...def456</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">Read-Only</Badge>
                    <Button variant="ghost" size="sm">
                      <Copy className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};