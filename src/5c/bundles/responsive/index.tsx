// Responsive Capacity Bundle for Workspace 5C
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Zap, Shield, Clock, User } from 'lucide-react';
import type { BundleProps5C } from '@/5c/types';
import { BUNDLE_CLASSES, getCapacityClasses } from '@/5c/utils/uiParity';
import { useResponsiveData } from '@/hooks/useResponsiveData';
import { formatDistanceToNow } from 'date-fns';

const ResponsiveBundle: React.FC<BundleProps5C> = ({ task }) => {
  const capacityClasses = getCapacityClasses('responsive');
  const loopId = task.loop_id;
  
  const {
    breachEvents,
    activeClaims,
    deBands,
    isLoading,
    createClaim,
    respondToBreach
  } = useResponsiveData(loopId);

  const handleStartClaim = () => {
    createClaim.mutate({
      taskId: task.id,
      assignee: task.user_id,
      leverage: task.leverage
    });
  };

  if (isLoading) {
    return (
      <div className={BUNDLE_CLASSES.container}>
        <div className="flex items-center justify-center py-12">
          <div className="text-muted-foreground">Loading responsive data...</div>
        </div>
      </div>
    );
  }

  return (
    <div className={BUNDLE_CLASSES.container}>
      <div className={BUNDLE_CLASSES.header}>
        <div>
          <h1 className={BUNDLE_CLASSES.title}>Responsive Capacity</h1>
          <p className={BUNDLE_CLASSES.subtitle}>Emergency response and stabilization actions</p>
        </div>
      </div>

      <div className={BUNDLE_CLASSES.content}>
        {/* Alert Rail */}
        <Card className={`${BUNDLE_CLASSES.panel} ${capacityClasses.border}`}>
          <CardHeader className={BUNDLE_CLASSES.panelHeader}>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Active Alerts ({breachEvents.length})
            </CardTitle>
          </CardHeader>
          <CardContent className={BUNDLE_CLASSES.panelContent}>
            <div className="space-y-3">
              {breachEvents.length > 0 ? (
                breachEvents.slice(0, 3).map((breach) => (
                  <div key={breach.id} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                    <div>
                      <p className="font-medium text-red-800">{breach.indicator_name}</p>
                      <p className="text-sm text-red-600">
                        {breach.breach_type} • Value: {breach.value.toFixed(2)}
                      </p>
                      <p className="text-xs text-red-500">
                        {formatDistanceToNow(new Date(breach.at), { addSuffix: true })}
                      </p>
                    </div>
                    <div className="flex flex-col gap-1">
                      <Badge variant={breach.resolved_at ? 'secondary' : 'destructive'}>
                        {breach.resolved_at ? 'Resolved' : 'Active'}
                      </Badge>
                      {!breach.resolved_at && (
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => respondToBreach.mutate(breach.id)}
                          disabled={respondToBreach.isPending}
                        >
                          Respond
                        </Button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <AlertTriangle className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No active alerts</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Claims Management */}
        <Card className={BUNDLE_CLASSES.panel}>
          <CardHeader className={BUNDLE_CLASSES.panelHeader}>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-orange-500" />
              Active Claims ({activeClaims.length})
            </CardTitle>
          </CardHeader>
          <CardContent className={BUNDLE_CLASSES.panelContent}>
            <div className="space-y-3">
              {activeClaims.length > 0 ? (
                activeClaims.slice(0, 3).map((claim) => (
                  <div key={claim.id} className="p-3 border rounded-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium">Claim #{claim.id.slice(0, 8)}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-2">
                          <User className="h-3 w-3" />
                          Assignee: {claim.assignee}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Leverage: {claim.leverage}
                        </div>
                      </div>
                      <Badge variant={claim.status === 'active' ? 'default' : 'secondary'}>
                        {claim.status}
                      </Badge>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-muted-foreground">
                  <p>No active claims</p>
                  <Button 
                    className="mt-2" 
                    size="sm"
                    onClick={handleStartClaim}
                    disabled={createClaim.isPending}
                  >
                    {createClaim.isPending ? 'Creating...' : 'Start New Claim'}
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Guardrails */}
        <Card className={BUNDLE_CLASSES.panel}>
          <CardHeader className={BUNDLE_CLASSES.panelHeader}>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-500" />
              Anti-Windup Guardrails
            </CardTitle>
          </CardHeader>
          <CardContent className={BUNDLE_CLASSES.panelContent}>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Active Claims</span>
                <span className="text-sm font-medium">{activeClaims.length}/5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">DE Bands Configured</span>
                <span className="text-sm font-medium">{deBands.length}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Unresolved Breaches</span>
                <span className="text-sm font-medium">
                  {breachEvents.filter(b => !b.resolved_at).length}
                </span>
              </div>
              <div className={`text-xs mt-2 ${
                breachEvents.filter(b => !b.resolved_at).length === 0 ? 'text-green-600' : 'text-yellow-600'
              }`}>
                {breachEvents.filter(b => !b.resolved_at).length === 0 
                  ? '✓ All systems within acceptable limits'
                  : '⚠ Active breaches require attention'
                }
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResponsiveBundle;