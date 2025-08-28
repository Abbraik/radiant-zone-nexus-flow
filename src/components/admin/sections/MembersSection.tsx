import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, UserPlus, Mail, Shield } from 'lucide-react';
import { useProfiles } from '@/hooks/useAdminData';
import { Skeleton } from '@/components/ui/skeleton';

export const MembersSection: React.FC = () => {
  const { data: profiles, isLoading } = useProfiles();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Members</h2>
          <p className="text-sm text-foreground-muted">
            Manage organization members and access permissions
          </p>
        </div>
        <Button>
          <UserPlus className="h-4 w-4 mr-2" />
          Invite Member
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="glass-secondary">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Member Stats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">Total Members</span>
                <Badge>{profiles?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Active</span>
                <Badge variant="secondary">{profiles?.length || 0}</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Admins</span>
                <Badge variant="outline">2</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="lg:col-span-2">
          <Card className="glass-secondary">
            <CardHeader>
              <CardTitle>Recent Members</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center space-x-4">
                      <Skeleton className="h-10 w-10 rounded-full" />
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-3 w-24" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="space-y-3">
                  {profiles?.slice(0, 5).map((profile) => (
                    <div key={profile.id} className="flex items-center justify-between p-3 rounded-lg bg-background/50 border border-border/50">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center">
                          <Users className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="text-sm font-medium">{profile.display_name || 'Unnamed User'}</p>
                          <p className="text-xs text-foreground-muted font-mono">
                            {profile.id.slice(0, 8)}...
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {profile.org_id ? 'Member' : 'Pending'}
                        </Badge>
                        <Button variant="ghost" size="sm">
                          <Shield className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  ))}
                  
                  {(!profiles || profiles.length === 0) && (
                    <div className="text-center py-6 text-foreground-muted">
                      <Users className="h-8 w-8 mx-auto mb-2 opacity-50" />
                      <p className="text-sm">No members found</p>
                    </div>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};