import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { AlertTriangle, Play, Edit3, Activity, Zap } from 'lucide-react';
import type { SignalReading } from '@/services/capacity-decision/types';
import type { ReflexiveRecipe } from '@/reflexive/types';

interface ControllerTunerProps {
  reading: SignalReading;
  recipe?: ReflexiveRecipe;
  onApplyRecipe: () => void;
  onAdvancedEdit: () => void;
  rationale: string;
  onRationaleChange: (value: string) => void;
  busy: boolean;
}

export const ControllerTuner: React.FC<ControllerTunerProps> = ({
  reading,
  recipe,
  onApplyRecipe,
  onAdvancedEdit,
  rationale,
  onRationaleChange,
  busy
}) => {
  const [selectedFamily, setSelectedFamily] = useState<'PID' | 'PI' | 'MPC' | 'RuleBased'>('PID');

  const telemetryData = [
    { label: 'Oscillation', value: reading.oscillation, threshold: 0.3, status: reading.oscillation > 0.3 ? 'warning' : 'ok' },
    { label: 'RMSE', value: reading.rmseRel, threshold: 0.2, status: reading.rmseRel > 0.2 ? 'warning' : 'ok' },
    { label: 'Bias', value: 0.12, threshold: 0.1, status: 0.12 > 0.1 ? 'warning' : 'ok' },
    { label: 'Settling', value: 45, threshold: 60, status: 45 < 60 ? 'ok' : 'warning', unit: 's' }
  ];

  const gainParams = [
    { param: 'Kp', value: 0.8, min: 0.1, max: 2.0, warning: 'Risk of oscillation if > 1.2' },
    { param: 'Ki', value: 0.15, min: 0.01, max: 0.5, warning: 'Risk of windup if > 0.3' },
    { param: 'Kd', value: 0.05, min: 0.0, max: 0.2, warning: 'Risk of noise amplification if > 0.1' }
  ];

  const actuationHealth = {
    overrun: 12, // percentage
    saturation: false,
    throttle: 85 // percentage
  };

  return (
    <div className="space-y-6">
      {/* Recipe Suggestion Banner */}
      {recipe && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-base text-primary">
                  Safe Recipe Ready: {recipe.name}
                </CardTitle>
                <CardDescription className="mt-1">
                  {recipe.rationaleHint}
                </CardDescription>
              </div>
              <Button 
                onClick={onApplyRecipe}
                disabled={busy || !rationale.trim()}
                size="sm"
                className="shrink-0"
              >
                <Play className="mr-2 h-4 w-4" />
                Apply Recipe
              </Button>
            </div>
          </CardHeader>
        </Card>
      )}

      {/* Main Controller Tuner */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="h-5 w-5" />
            Controller Tuner
          </CardTitle>
          <CardDescription>
            Adjust controller family and parameters to optimize system response
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Telemetry Strip */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">System Telemetry</h4>
            <div className="flex gap-2 flex-wrap">
              {telemetryData.map((metric) => (
                <Badge
                  key={metric.label}
                  variant={metric.status === 'warning' ? 'destructive' : 'secondary'}
                  className="px-3 py-1"
                >
                  {metric.label}: {metric.value.toFixed(2)}{metric.unit || ''}
                </Badge>
              ))}
            </div>
          </div>

          <Separator />

          {/* Family Selector */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Controller Family</h4>
            <Tabs value={selectedFamily} onValueChange={(value) => setSelectedFamily(value as any)}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="PID" title="Proportional-Integral-Derivative">PID</TabsTrigger>
                <TabsTrigger value="PI" title="Proportional-Integral">PI</TabsTrigger>
                <TabsTrigger value="MPC" title="Model Predictive Control">MPC</TabsTrigger>
                <TabsTrigger value="RuleBased" title="Rule-Based Controller">Rule</TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <Separator />

          {/* Gain Panel */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Gain Parameters</h4>
            <div className="space-y-4">
              {gainParams.map((gain) => (
                <div key={gain.param} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-sm font-medium">{gain.param}</label>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-mono">{gain.value}</span>
                      <Badge 
                        variant={gain.value > (gain.max * 0.8) ? 'destructive' : 'secondary'}
                        className="text-xs"
                      >
                        {gain.min}-{gain.max}
                      </Badge>
                    </div>
                  </div>
                  <div className="relative">
                    <Progress 
                      value={(gain.value / gain.max) * 100} 
                      className="h-2" 
                    />
                    {gain.value > (gain.max * 0.8) && (
                      <div className="absolute -top-1 right-0">
                        <AlertTriangle className="h-3 w-3 text-destructive" />
                      </div>
                    )}
                  </div>
                  {gain.value > (gain.max * 0.8) && (
                    <p className="text-xs text-destructive flex items-center gap-1">
                      <AlertTriangle className="h-3 w-3" />
                      {gain.warning}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Actuation Health */}
          <div className="space-y-3">
            <h4 className="text-sm font-medium">Actuation Health</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Overrun</span>
                  <span className="font-mono">{actuationHealth.overrun}%</span>
                </div>
                <Progress 
                  value={actuationHealth.overrun} 
                  className="h-2"
                />
                {actuationHealth.overrun > 15 && (
                  <p className="text-xs text-warning">High overrun detected</p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Throttle Level</span>
                  <span className="font-mono">{actuationHealth.throttle}%</span>
                </div>
                <Progress 
                  value={actuationHealth.throttle} 
                  className="h-2"
                />
                <p className="text-xs text-muted-foreground">
                  {actuationHealth.saturation ? 'Saturated' : 'Normal range'}
                </p>
              </div>
            </div>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button 
              onClick={onApplyRecipe}
              disabled={busy || !recipe || !rationale.trim()}
              className="flex-1"
            >
              <Play className="mr-2 h-4 w-4" />
              {busy ? 'Applying...' : 'Apply Safe Recipe'}
            </Button>
            <Button 
              variant="outline"
              onClick={onAdvancedEdit}
              className="flex-1"
            >
              <Edit3 className="mr-2 h-4 w-4" />
              Advanced Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};