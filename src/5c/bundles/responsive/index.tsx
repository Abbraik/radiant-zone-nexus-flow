// Responsive Capacity Bundle for Workspace 5C
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Zap, Shield } from 'lucide-react';
import type { BundleProps5C } from '@/5c/types';
import { BUNDLE_CLASSES, getCapacityClasses } from '@/5c/utils/uiParity';
import { useResponsiveData } from '@/hooks/useResponsiveData';

const ResponsiveBundle: React.FC<BundleProps5C> = ({ task }) => {
  const capacityClasses = getCapacityClasses('responsive');
  const { alerts, claims, guardrails } = useResponsiveData(task);

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
              Active Alerts
            </CardTitle>
          </CardHeader>
          <CardContent className={BUNDLE_CLASSES.panelContent}>
            <div className="space-y-3">
              {alerts.map((alert, index) => (
                <div key={alert.id || index} className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded">
                  <div>
                    <p className="font-medium text-red-800">{alert.title}</p>
                    <p className="text-sm text-red-600">{alert.description}</p>
                  </div>
                  <Button size="sm" variant="outline">
                    Respond
                  </Button>
                </div>
              ))}
              {alerts.length === 0 && (
                <div className="text-center py-6 text-muted-foreground">
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
              Active Claims
            </CardTitle>
          </CardHeader>
          <CardContent className={BUNDLE_CLASSES.panelContent}>
            <div className="space-y-3">
              <div className="text-center py-6 text-muted-foreground">
                <p>No active claims</p>
                <Button className="mt-2" size="sm">
                  Start New Claim
                </Button>
              </div>
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
                <span className="text-sm">Concurrent Substeps</span>
                <span className="text-sm font-medium">{guardrails.concurrentSubsteps}/{guardrails.maxSubsteps}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Time Remaining</span>
                <span className="text-sm font-medium">{guardrails.timeRemaining} min</span>
              </div>
              <div className={`text-xs mt-2 ${guardrails.allWithinLimits ? 'text-green-600' : 'text-red-600'}`}>
                {guardrails.allWithinLimits ? '✓ All guardrails within limits' : '⚠ Guardrails exceeded'}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ResponsiveBundle;