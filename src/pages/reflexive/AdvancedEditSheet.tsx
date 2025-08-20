import React, { useState } from 'react';
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Settings, AlertTriangle, Save } from 'lucide-react';

interface AdvancedEditSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave?: (tuning: any) => Promise<{ id: string }>;
}

export const AdvancedEditSheet: React.FC<AdvancedEditSheetProps> = ({
  open,
  onOpenChange,
  onSave
}) => {
  const [family, setFamily] = useState<'PID' | 'PI' | 'MPC' | 'RuleBased'>('PID');
  const [gains, setGains] = useState({
    Kp: 0.8,
    Ki: 0.15,
    Kd: 0.05
  });
  const [integralWindow, setIntegralWindow] = useState(60); // seconds
  const [antiWindup, setAntiWindup] = useState(true);
  const [derivativeFilter, setDerivativeFilter] = useState(0.1);
  const [busy, setBusy] = useState(false);

  const gainLimits = {
    Kp: { min: 0.1, max: 2.0, warning: 1.2 },
    Ki: { min: 0.01, max: 0.5, warning: 0.3 },
    Kd: { min: 0.0, max: 0.2, warning: 0.1 }
  };

  const updateGain = (param: keyof typeof gains, value: number) => {
    setGains(prev => ({ ...prev, [param]: value }));
  };

  const hasWarnings = () => {
    return Object.entries(gains).some(([param, value]) => {
      const limit = gainLimits[param as keyof typeof gainLimits];
      return value > limit.warning;
    });
  };

  const getWarnings = () => {
    const warnings: string[] = [];
    
    Object.entries(gains).forEach(([param, value]) => {
      const limit = gainLimits[param as keyof typeof gainLimits];
      if (value > limit.warning) {
        const warningText = {
          Kp: 'High proportional gain may cause oscillation',
          Ki: 'High integral gain may cause windup',
          Kd: 'High derivative gain may amplify noise'
        };
        warnings.push(warningText[param as keyof typeof warningText]);
      }
    });

    if (integralWindow < 30) {
      warnings.push('Short integral window may cause instability');
    }

    if (!antiWindup && gains.Ki > 0.1) {
      warnings.push('Anti-windup disabled with significant integral gain');
    }

    return warnings;
  };

  const handleSave = async () => {
    setBusy(true);
    try {
      await onSave?.({
        family,
        gains,
        integralWindow,
        antiWindup,
        derivativeFilter,
        timestamp: new Date().toISOString()
      });
      onOpenChange(false);
    } finally {
      setBusy(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[500px] max-w-[90vw]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Advanced Controller Edit
          </SheetTitle>
          <SheetDescription>
            Fine-tune controller family and parameters with full control
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Warnings */}
          {hasWarnings() && (
            <Alert className="border-warning">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-1">
                  {getWarnings().map((warning, index) => (
                    <div key={index} className="text-sm">• {warning}</div>
                  ))}
                </div>
              </AlertDescription>
            </Alert>
          )}

          <Tabs defaultValue="family" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="family">Family</TabsTrigger>
              <TabsTrigger value="gains">Gains</TabsTrigger>
              <TabsTrigger value="advanced">Advanced</TabsTrigger>
            </TabsList>

            <TabsContent value="family" className="space-y-4">
              <div className="space-y-3">
                <Label>Controller Family</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['PID', 'PI', 'MPC', 'RuleBased'] as const).map((type) => (
                    <Button
                      key={type}
                      variant={family === type ? 'default' : 'outline'}
                      onClick={() => setFamily(type)}
                      className="h-12"
                    >
                      <div className="text-center">
                        <div className="font-medium">{type}</div>
                        <div className="text-xs opacity-70">
                          {type === 'PID' && 'Full PID'}
                          {type === 'PI' && 'No derivative'}
                          {type === 'MPC' && 'Predictive'}
                          {type === 'RuleBased' && 'Logic-based'}
                        </div>
                      </div>
                    </Button>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="gains" className="space-y-4">
              {Object.entries(gains).map(([param, value]) => {
                const limit = gainLimits[param as keyof typeof gainLimits];
                const isWarning = value > limit.warning;
                
                return (
                  <div key={param} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label className="flex items-center gap-2">
                        {param}
                        {isWarning && <AlertTriangle className="h-3 w-3 text-warning" />}
                      </Label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={value}
                          onChange={(e) => updateGain(param as keyof typeof gains, parseFloat(e.target.value) || 0)}
                          className="w-20 h-8 text-sm"
                          step={0.01}
                          min={limit.min}
                          max={limit.max}
                        />
                        <Badge variant={isWarning ? 'destructive' : 'secondary'} className="text-xs">
                          {limit.min}-{limit.max}
                        </Badge>
                      </div>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => updateGain(param as keyof typeof gains, newValue)}
                      min={limit.min}
                      max={limit.max}
                      step={0.01}
                      className="w-full"
                    />
                  </div>
                );
              })}
            </TabsContent>

            <TabsContent value="advanced" className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Integral Window (seconds)</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[integralWindow]}
                      onValueChange={([value]) => setIntegralWindow(value)}
                      min={10}
                      max={300}
                      step={10}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-12">{integralWindow}s</span>
                  </div>
                </div>

                <Separator />

                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <Label>Anti-Windup Protection</Label>
                    <p className="text-xs text-muted-foreground">
                      Prevents integral term from growing excessively
                    </p>
                  </div>
                  <Switch
                    checked={antiWindup}
                    onCheckedChange={setAntiWindup}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Derivative Filter Coefficient</Label>
                  <div className="flex items-center gap-3">
                    <Slider
                      value={[derivativeFilter]}
                      onValueChange={([value]) => setDerivativeFilter(value)}
                      min={0.0}
                      max={1.0}
                      step={0.01}
                      className="flex-1"
                    />
                    <span className="text-sm font-mono w-12">{derivativeFilter.toFixed(2)}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Higher values provide more filtering but reduce responsiveness
                  </p>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={busy}
              className="flex-1"
            >
              <Save className="mr-2 h-4 w-4" />
              {busy ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};