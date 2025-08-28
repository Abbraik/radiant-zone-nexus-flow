import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { FileText, Search, Download, Filter } from 'lucide-react';
import { useAuditLog } from '@/hooks/useAdminData';
import { Skeleton } from '@/components/ui/skeleton';

export const AuditLogSection: React.FC = () => {
  const { data: auditEntries, isLoading } = useAuditLog();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Audit Log</h2>
          <p className="text-sm text-foreground-muted">
            Track all system changes and user activities
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-3 h-4 w-4 text-foreground-muted" />
          <Input 
            placeholder="Search audit entries..."
            className="pl-9"
          />
        </div>
      </div>

      <Card className="glass-secondary">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Audit Entries
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-background/50">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-20" />
                  </div>
                  <Skeleton className="h-3 w-24" />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              {auditEntries?.map((entry) => (
                <div key={entry.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50 hover:bg-background/70 transition-colors">
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant={
                        entry.action === 'delete' 
                          ? 'destructive' 
                          : entry.action === 'create' 
                            ? 'default'
                            : 'secondary'
                      }
                      className="capitalize min-w-16 justify-center"
                    >
                      {entry.action}
                    </Badge>
                    <div>
                      <p className="text-sm font-medium">{entry.resource_type}</p>
                      {entry.resource_id && (
                        <p className="text-xs text-foreground-muted font-mono">
                          ID: {entry.resource_id.slice(0, 8)}...
                        </p>
                      )}
                    </div>
                    {entry.user_id && (
                      <div className="text-xs text-foreground-muted">
                        User: {entry.user_id.slice(0, 8)}...
                      </div>
                    )}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-foreground-muted">
                      {new Date(entry.created_at).toLocaleString()}
                    </div>
                    {entry.ip_address && (
                      <div className="text-xs text-foreground-muted font-mono">
                        {String(entry.ip_address)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              
              {(!auditEntries || auditEntries.length === 0) && (
                <div className="text-center py-8 text-foreground-muted">
                  <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-sm">No audit entries found</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};