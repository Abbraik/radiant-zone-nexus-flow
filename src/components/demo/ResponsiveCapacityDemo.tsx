import React, { useState } from 'react';
import { DynamicCapacityBundle } from '@/components/workspace/DynamicCapacityBundle';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import type { EnhancedTask } from '@/types/capacity';

export const ResponsiveCapacityDemo: React.FC = () => {
  const [demoTask, setDemoTask] = useState<EnhancedTask>({
    id: 'demo-responsive-task',
    title: 'Demo Responsive Capacity Task',
    description: 'A demonstration of responsive capacity bundle integration',
    capacity: 'responsive',
    loop_id: 'demo-loop-001',
    type: 'reactive',
    scale: 'micro',
    leverage: 'P',
    priority: 'high',
    user_id: 'demo-user',
    status: 'open',
    payload: {
      loopCode: 'DEMO-HEALTH-001',
      indicator: 'wait_times',
      decision: {
        severity: 0.75,
        guardrails: {
          timeboxDays: 7,
          caps: ['overtime_cap', 'budget_cap']
        },
        srt: {
          cadence: '2 hours'
        },
        consent: {
          requireDeliberative: false
        }
      },
      reading: {
        oscillation: 0.3,
        dispersion: 0.4,
        persistencePk: 40,
        integralError: 0.2,
        hubSaturation: 0.6
      }
    }
  });
  
  const [payload, setPayload] = useState(demoTask.payload);
  const [isValid, setIsValid] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const handlePayloadUpdate = (newPayload: any) => {
    setPayload(newPayload);
    setDemoTask(prev => ({ ...prev, payload: newPayload }));
  };

  const handleValidationChange = (valid: boolean, errors?: string[]) => {
    setIsValid(valid);
    setValidationErrors(errors || []);
  };

  const resetDemo = () => {
    setPayload({
      loopCode: 'DEMO-HEALTH-001',
      indicator: 'wait_times',
      decision: {
        severity: Math.random() * 0.5 + 0.5, // Random severity between 0.5-1.0
        guardrails: {
          timeboxDays: Math.floor(Math.random() * 14) + 7,
          caps: ['overtime_cap', 'budget_cap']
        },
        srt: {
          cadence: ['30 minutes', '1 hour', '2 hours'][Math.floor(Math.random() * 3)]
        },
        consent: {
          requireDeliberative: Math.random() > 0.7
        }
      },
      reading: {
        oscillation: Math.random() * 0.8,
        dispersion: Math.random() * 0.8,
        persistencePk: Math.floor(Math.random() * 80) + 20,
        integralError: Math.random() * 0.6,
        hubSaturation: Math.random() * 0.9
      }
    });
  };

  return (
    <div className="space-y-6 p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Responsive Capacity Integration Demo
            <Badge variant="outline" className="text-xs">
              Severity: {Math.round((payload.decision?.severity || 0) * 100)}%
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <Button onClick={resetDemo} variant="outline" size="sm">
              Randomize Scenario
            </Button>
            <div className="flex items-center gap-2">
              <span className="text-sm">Status:</span>
              <Badge variant={isValid ? "default" : "destructive"}>
                {isValid ? "Valid" : "Invalid"}
              </Badge>
            </div>
            {validationErrors.length > 0 && (
              <div className="text-sm text-red-600">
                {validationErrors.join(', ')}
              </div>
            )}
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
            <div>
              <div className="font-medium">Loop Code</div>
              <div className="text-muted-foreground">{payload.loopCode}</div>
            </div>
            <div>
              <div className="font-medium">Indicator</div>
              <div className="text-muted-foreground">{payload.indicator}</div>
            </div>
            <div>
              <div className="font-medium">Severity</div>
              <div className="text-muted-foreground">
                {Math.round((payload.decision?.severity || 0) * 100)}%
              </div>
            </div>
          </div>

          <DynamicCapacityBundle
            capacity="responsive"
            taskId={demoTask.id}
            taskData={demoTask}
            payload={payload}
            onPayloadUpdate={handlePayloadUpdate}
            onValidationChange={handleValidationChange}
            readonly={false}
          />
        </CardContent>
      </Card>

      {payload.handoffRequest && (
        <Card>
          <CardHeader>
            <CardTitle className="text-amber-600">Handoff Request</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div>
                <span className="font-medium">Target Capacity:</span> {payload.handoffRequest.to}
              </div>
              <div>
                <span className="font-medium">Reason:</span> {payload.handoffRequest.reason}
              </div>
              <div className="text-sm text-muted-foreground">
                Requested at: {new Date(payload.handoffRequest.timestamp).toLocaleString()}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {payload.lastIncidentId && (
        <Card>
          <CardHeader>
            <CardTitle className="text-blue-600">Active Incident</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <span className="font-medium">Incident ID:</span> {payload.lastIncidentId}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};