import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, Plus, UserCheck } from 'lucide-react';
import { useUserRoles } from '@/hooks/useAdminData';
import { Skeleton } from '@/components/ui/skeleton';

export const RolesSection: React.FC = () => {
  const { data: roles, isLoading } = useUserRoles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Roles & Mandates</h2>
          <p className="text-sm text-foreground-muted">
            Manage user roles and mandate permissions
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Assign Role
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Role Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-5 w-8" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {['admin', 'moderator', 'user'].map((roleType) => {
                  const count = roles?.filter(r => r.role === roleType).length || 0;
                  return (
                    <div key={roleType} className="flex items-center justify-between">
                      <span className="text-sm capitalize">{roleType}</span>
                      <Badge variant={roleType === 'admin' ? 'default' : 'outline'}>
                        {count}
                      </Badge>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-success" />
              Recent Role Assignments
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="space-y-3">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="space-y-1">
                      <Skeleton className="h-3 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                    <Skeleton className="h-5 w-12" />
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {roles?.slice(0, 5).map((role) => (
                  <div key={role.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                    <div>
                      <p className="text-sm font-medium">User {role.user_id.slice(0, 8)}...</p>
                      <p className="text-xs text-foreground-muted">Role assigned</p>
                    </div>
                    <Badge 
                      variant={role.role === 'admin' ? 'default' : 'outline'}
                      className="capitalize"
                    >
                      {role.role}
                    </Badge>
                  </div>
                ))}
                
                {(!roles || roles.length === 0) && (
                  <div className="text-center py-6 text-foreground-muted">
                    <Shield className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p className="text-sm">No role assignments found</p>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};