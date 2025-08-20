import { computeCapacityDecision, severity } from '@/services/capacity-decision';
import { ActivationVector } from './ActivationVector';
import { TaskComposer } from './TaskComposer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useState } from 'react';

interface CapacityPanelProps {
  loopCode: string;
  indicator: string;
  reading: {
    value: number;
    band: { lower: number; upper: number };
    slope?: number;
    persistencePk?: number;
    integralError?: number;
    oscillation?: number;
    dispersion?: number;
    hubSaturation?: number;
    ewsProb?: number;
    bufferAdequacy?: number;
    dataPenalty?: number;
    legitimacyGap?: number;
    guardrailViolation?: number;
    rmseRel?: number;
    leadTimeWeight?: number;
  };
  context?: { lifeSafety?: boolean };
  onTasksComposed?: (tasks: any[]) => void;
}

export function CapacityPanel({ 
  loopCode, 
  indicator, 
  reading, 
  context,
  onTasksComposed 
}: CapacityPanelProps) {
  const [showDecisionLog, setShowDecisionLog] = useState(false);
  
  const decision = computeCapacityDecision({
    loopCode,
    indicator,
    tstamp: new Date().toISOString(),
    reading,
    context,
  });

  const picked = { 
    primary: decision.order[0], 
    secondary: decision.order[1] 
  };

  const evidence = [
    { 
      label: 'S', 
      value: severity(reading.value, reading.band).toFixed(2),
      hint: 'Severity: Distance from band boundaries',
      intent: severity(reading.value, reading.band) > 0.5 ? 'bad' : 'neutral'
    },
    { 
      label: 'EWS', 
      value: (reading.ewsProb ?? 0).toFixed(2),
      hint: 'Early Warning System probability',
      intent: (reading.ewsProb ?? 0) > 0.6 ? 'warn' : 'neutral'
    },
    { 
      label: 'Pk', 
      value: (reading.persistencePk ?? 0).toFixed(2),
      hint: 'Persistence: Share of recent periods in breach',
      intent: (reading.persistencePk ?? 0) > 0.6 ? 'bad' : 'neutral'
    },
    { 
      label: 'LegGap', 
      value: (reading.legitimacyGap ?? 0).toFixed(2),
      hint: 'Legitimacy Gap: Service-trust congruence gap',
      intent: (reading.legitimacyGap ?? 0) > 0.35 ? 'warn' : 'good'
    },
  ].filter(e => e.value !== '0.00');

  return (
    <>
      <div className="grid gap-4 lg:grid-cols-2">
        <ActivationVector
          loopCode={loopCode}
          indicator={indicator}
          scores={decision.scores}
          picked={picked as any}
          srt={decision.srt}
          consent={decision.consent}
          guardrails={decision.guardrails}
          evidence={evidence as any}
          onOpenDecisionLog={() => setShowDecisionLog(true)}
        />
        <TaskComposer
          decision={decision}
          onCompose={(tasks) => {
            console.log('Composed tasks:', tasks);
            onTasksComposed?.(tasks);
          }}
        />
      </div>

      <Dialog open={showDecisionLog} onOpenChange={setShowDecisionLog}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Decision Log - {loopCode}:{indicator}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Rationale</h4>
              <p className="text-sm">{decision.rationale}</p>
            </div>
            <div className="bg-muted p-4 rounded-lg">
              <h4 className="font-semibold mb-2">Full Decision Object</h4>
              <pre className="text-xs overflow-x-auto whitespace-pre-wrap">
                {JSON.stringify(decision, null, 2)}
              </pre>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}