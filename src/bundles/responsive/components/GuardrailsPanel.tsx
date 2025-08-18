import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { AlertTriangle, Shield, Clock, Users, TrendingUp, Lock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';
import { useResponsiveBundle } from '@/hooks/useResponsiveBundle';

interface GuardrailsPanelProps {
  claimId: string;
  isManager?: boolean;
}

export const GuardrailsPanel: React.FC<GuardrailsPanelProps> = ({
  claimId,
  isManager = false
}) => {
  const { guardrailStatus } = useResponsiveBundle(claimId);
  const { toast } = useToast();
  const [overrideActive, setOverrideActive] = useState(false);
  const [overrideReason, setOverrideReason] = useState('');

  const handleOverrideToggle = (enabled: boolean) => {
    if (!isManager) {
      toast({
        title: "Access denied",
        description: "Only managers can override guardrails.",
        variant: "destructive"
      });
      return;
    }

    if (enabled && !overrideReason) {
      toast({
        title: "Reason required",
        description: "Please provide a rationale for the override.",
        variant: "destructive"
      });
      return;
    }

    setOverrideActive(enabled);
    toast({
      title: enabled ? "Guardrails overridden" : "Guardrails re-enabled",
      description: enabled ? "Manual oversight required." : "Automatic controls restored."
    });
  };

  const guardrails = [
    {
      name: 'Time-box Limit',
      description: 'Maximum active duration before mandatory checkpoint',
      current: 6.5,
      limit: 8,
      unit: 'hours',
      status: 'ok' as const,
      icon: Clock
    },
    {
      name: 'Staged Rollout',
      description: 'Maximum coverage per day',
      current: 15,
      limit: 25,
      unit: '% population',
      status: 'warning' as const,
      icon: TrendingUp
    },
    {
      name: 'Concurrent Substeps',
      description: 'Active substeps limit',
      current: 2,
      limit: 3,
      unit: 'steps',
      status: 'ok' as const,
      icon: Users
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-green-500" />
            Guardrails & Anti-Windup
            <Badge variant={overrideActive ? "destructive" : "secondary"}>
              {overrideActive ? "Override Active" : "Protected"}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Override Controls */}
          {isManager && (
            <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-800">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-orange-500" />
                  <Label htmlFor="override-switch" className="text-sm font-medium">
                    Manager Override
                  </Label>
                </div>
                <Switch
                  id="override-switch"
                  checked={overrideActive}
                  onCheckedChange={handleOverrideToggle}
                />
              </div>
              {overrideActive && (
                <div className="text-sm text-orange-700 dark:text-orange-300">
                  ⚠️ Guardrails are disabled. Manual oversight required for all actions.
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Guardrail Status */}
          <div className="space-y-4">
            {guardrails.map((guardrail, index) => {
              const Icon = guardrail.icon;
              const percentage = (guardrail.current / guardrail.limit) * 100;
              const isWarning = percentage > 80;
              const isCritical = percentage >= 100;

              return (
                <div key={index} className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className={`w-4 h-4 ${
                        isCritical ? 'text-red-500' : 
                        isWarning ? 'text-orange-500' : 
                        'text-green-500'
                      }`} />
                      <span className="font-medium">{guardrail.name}</span>
                    </div>
                    <Badge variant={
                      isCritical ? "destructive" : 
                      isWarning ? "secondary" : 
                      "outline"
                    }>
                      {guardrail.current}/{guardrail.limit} {guardrail.unit}
                    </Badge>
                  </div>
                  
                  <div className="space-y-2">
                    <Progress 
                      value={Math.min(percentage, 100)} 
                      className={`h-2 ${
                        isCritical ? 'bg-red-100 dark:bg-red-950' : 
                        isWarning ? 'bg-orange-100 dark:bg-orange-950' : 
                        'bg-green-100 dark:bg-green-950'
                      }`} 
                    />
                    <p className="text-xs text-muted-foreground">
                      {guardrail.description}
                    </p>
                  </div>

                  {isCritical && !overrideActive && (
                    <div className="flex items-center gap-2 p-2 bg-red-50 dark:bg-red-950/20 rounded text-sm text-red-700 dark:text-red-300">
                      <AlertTriangle className="w-4 h-4" />
                      Limit exceeded - action blocked
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <Separator />

          {/* Capacity Controls */}
          <div className="space-y-3">
            <h4 className="font-medium flex items-center gap-2">
              <TrendingUp className="w-4 h-4" />
              Capacity Controls
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <div className="text-muted-foreground">Max Delta/Day</div>
                <div className="font-medium">0.1 units</div>
              </div>
              <div className="space-y-1">
                <div className="text-muted-foreground">Coverage Cap</div>
                <div className="font-medium">25% population</div>
              </div>
            </div>
          </div>

          {/* Emergency Actions */}
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="flex-1">
              View History
            </Button>
            <Button variant="outline" size="sm" className="flex-1">
              Adjust Limits
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};