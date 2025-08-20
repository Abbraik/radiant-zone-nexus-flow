import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import type { DecisionResult, Capacity } from "@/services/capacity-decision";

export interface TaskComposerProps {
  decision: DecisionResult;
  // Optional transforms / org context
  defaultOwnerId?: string;
  onCompose?: (tasks: {
    title: string;
    description: string;
    capacity: Capacity;
    leverage: 'N'|'P'|'S';
    dueAt?: string;
    guardrails?: string[];
    meta?: Record<string, any>;
  }[]) => void; // caller persists to Supabase task table & opens claim drawer
}

export function TaskComposer({ decision, defaultOwnerId, onCompose }: TaskComposerProps) {
  const [actions, setActions] = useState(() =>
    decision.templateActions.map(a => ({
      capacity: a.capacity,
      leverage: a.sprintLevel,
      order: a.order,
      items: a.actions.map(text => ({ text }))
    }))
  );

  const defaultDue = (() => {
    // naive mapping from SRT; your real logic can map cadence→date
    const days = decision.srt.horizon === 'P14D' ? 14 :
                 decision.srt.horizon === 'P30D' ? 30 :
                 decision.srt.horizon === 'P45D' ? 45 :
                 decision.srt.horizon === 'P60D' ? 60 :
                 decision.srt.horizon === 'P90D' ? 90 :
                 decision.srt.horizon === 'P180D' ? 180 : 365;
    const dt = new Date(); 
    dt.setDate(dt.getDate() + Math.min(days, 30));
    return dt.toISOString();
  })();

  const handleCompose = () => {
    const tasks = actions.flatMap(block =>
      block.items.map((it, idx) => ({
        title: `[${block.capacity.toUpperCase()}] ${it.text.split('.').shift()}`,
        description: it.text,
        capacity: block.capacity,
        leverage: block.leverage,
        dueAt: defaultDue,
        guardrails: decision.guardrails?.caps ?? [],
        meta: {
          order: block.order,
          legGap: decision.consent?.legGap,
          transparency: decision.consent?.transparency,
          srt: decision.srt,
        }
      }))
    );
    onCompose?.(tasks);
  };

  const getLeverageColor = (leverage: 'N'|'P'|'S') => {
    switch (leverage) {
      case 'N': return 'bg-blue-500';
      case 'P': return 'bg-orange-500';
      case 'S': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getCapacityColor = (capacity: Capacity) => {
    switch (capacity) {
      case 'responsive': return 'border-amber-200 bg-amber-50';
      case 'reflexive': return 'border-indigo-200 bg-indigo-50';
      case 'deliberative': return 'border-cyan-200 bg-cyan-50';
      case 'anticipatory': return 'border-emerald-200 bg-emerald-50';
      case 'structural': return 'border-violet-200 bg-violet-50';
    }
  };

  return (
    <Card className="p-4 space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Task Composer</h3>
        <div className="text-xs text-muted-foreground">
          {decision.recommendedCapacities.join(' → ')}
        </div>
      </div>

      {actions.sort((a,b) => a.order - b.order).map((block, i) => (
        <div key={i} className={`space-y-2 border rounded-xl p-3 ${getCapacityColor(block.capacity)}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="font-medium capitalize">{block.capacity}</span>
              <Badge className={`${getLeverageColor(block.leverage)} text-white`}>
                {block.leverage}
              </Badge>
            </div>
            <div className="text-xs text-muted-foreground">Order {block.order}</div>
          </div>
          
          {block.items.map((it, j) => (
            <div key={j} className="space-y-1">
              <Label className="text-xs font-medium">Action {j + 1}</Label>
              <Textarea 
                value={it.text} 
                onChange={e => {
                  const v = e.target.value;
                  setActions(prev => {
                    const p = [...prev];
                    p[i] = { 
                      ...p[i], 
                      items: p[i].items.map((x, idx) => idx === j ? { text: v } : x) 
                    };
                    return p;
                  });
                }}
                className="min-h-[60px] text-sm"
                placeholder="Describe the action to be taken..."
              />
            </div>
          ))}
        </div>
      ))}
      
      <div className="flex items-center gap-3 pt-2 border-t">
        <div className="text-xs text-muted-foreground">
          Timebox: {decision.guardrails?.timeboxDays ?? '—'} days · SRT {decision.srt.cadence}/{decision.srt.horizon}
        </div>
        <div className="flex-1" />
        <Button onClick={handleCompose} className="bg-primary hover:bg-primary/90">
          Compose Tasks
        </Button>
      </div>
    </Card>
  );
}