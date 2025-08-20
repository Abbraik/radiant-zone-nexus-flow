import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { createTask5C } from "@/5c/services";
import type { DecisionResult, Capacity } from "@/services/capacity-decision";
import type { EnhancedTask5C, Capacity5C, Leverage5C } from "@/5c/types";

export interface TaskComposerProps {
  decision: DecisionResult;
  loopCode?: string;
  indicator?: string;
  // Optional transforms / org context
  defaultUserId?: string;
  onTasksCreated?: (tasks: EnhancedTask5C[]) => void;
}

export function TaskComposer({ decision, loopCode, indicator, defaultUserId, onTasksCreated }: TaskComposerProps) {
  const { toast } = useToast();
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

  const handleCompose = async () => {
    try {
      // Convert template actions to 5C tasks
      const tasks: Partial<EnhancedTask5C>[] = actions.flatMap(block =>
        block.items.map((item, idx) => ({
          capacity: block.capacity as Capacity5C,
          loop_id: loopCode || 'unknown-loop',
          type: 'reactive' as const,
          scale: 'micro' as const,
          leverage: block.leverage as Leverage5C,
          title: `[${block.capacity.toUpperCase()}] ${item.text.split('.')[0]}`,
          description: item.text,
          status: 'open' as const,
          payload: {
            signal: indicator ? { indicator, timestamp: new Date().toISOString() } : {},
            decision: {
              scores: decision.scores,
              rationale: decision.rationale,
              srt: decision.srt,
              guardrails: decision.guardrails,
              consent: decision.consent
            },
            actionOrder: block.order,
            actionIndex: idx
          },
          user_id: defaultUserId || 'current-user'
        }))
      );

      // Create tasks in parallel
      const createdTasks = await Promise.all(
        tasks.map(task => createTask5C(task))
      );

      toast({
        title: "Tasks Created",
        description: `${createdTasks.length} capacity tasks created successfully`,
        duration: 4000
      });

      onTasksCreated?.(createdTasks);
    } catch (error) {
      console.error('Failed to create tasks:', error);
      toast({
        title: "Task Creation Failed",
        description: "Failed to create capacity tasks",
        variant: "destructive"
      });
    }
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
          Create Tasks
        </Button>
      </div>
    </Card>
  );
}