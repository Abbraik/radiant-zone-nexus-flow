import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, Clock, Database } from 'lucide-react';
import type { SignalReading } from '@/services/capacity-decision/types';

interface GuardrailsPoliciesProps {
  reading: SignalReading;
}

export const GuardrailsPolicies: React.FC<GuardrailsPoliciesProps> = ({
  reading
}) => {
  const guardrails = [
    {
      name: 'Max Δgain per cycle',
      limit: 0.2,
      current: 0.15,
      status: 'ok' as const,
      description: 'Maximum gain change allowed per tuning cycle'
    },
    {
      name: 'Weight delta bounds',
      limit: 15,
      current: 8,
      status: 'ok' as const,
      description: 'Maximum tier weight change percentage',
      unit: '%'
    },
    {
      name: 'Renewal without eval',
      limit: 2,
      current: 1,
      status: 'warning' as const,
      description: 'Band renewals without evaluation (META-L05)'
    }
  ];

  const hasDataPenalty = reading.dataPenalty > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Guardrails & Policies
        </CardTitle>
        <CardDescription>
          Safety boundaries and governance rules
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Data Integrity Warning */}
        {hasDataPenalty && (
          <Alert className="border-warning">
            <Database className="h-4 w-4" />
            <AlertDescription>
              Data quality is degraded (penalty: {reading.dataPenalty.toFixed(2)}). 
              Irreversible changes are temporarily blocked.
            </AlertDescription>
          </Alert>
        )}

        {/* Guardrails List */}
        <div className="space-y-4">
          {guardrails.map((guardrail) => (
            <div key={guardrail.name} className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">{guardrail.name}</span>
                    <Badge variant={guardrail.status === 'warning' ? 'destructive' : 'secondary'}>
                      {guardrail.status}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {guardrail.description}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-mono">
                    {guardrail.current}{guardrail.unit || ''} / {guardrail.limit}{guardrail.unit || ''}
                  </div>
                </div>
              </div>
              
              <div className="relative">
                <Progress 
                  value={(guardrail.current / guardrail.limit) * 100} 
                  className="h-2"
                />
                {guardrail.status === 'warning' && (
                  <div className="absolute -top-1 right-2">
                    <AlertTriangle className="h-3 w-3 text-destructive" />
                  </div>
                )}
              </div>

              {guardrail.status === 'warning' && (
                <div className="flex items-center gap-1 text-xs text-destructive">
                  <AlertTriangle className="h-3 w-3" />
                  <span>Approaching limit - review required</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Policy Reminders */}
        <div className="pt-4 border-t space-y-2">
          <h4 className="text-sm font-medium flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Policy Reminders
          </h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 shrink-0" />
              <span>META-L01: Band changes require review within 14 days</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full mt-1.5 shrink-0" />
              <span>META-L02: Controller family changes must be evaluated</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 bg-purple-500 rounded-full mt-1.5 shrink-0" />
              <span>META-L04: High data penalty blocks irreversible operations</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="w-2 h-2 bg-red-500 rounded-full mt-1.5 shrink-0" />
              <span>META-L05: Maximum 2 renewals without evaluation</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};