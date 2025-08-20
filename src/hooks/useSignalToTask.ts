import { useCallback } from 'react';
import { useToast } from './use-toast';
import { createTask5C } from '@/5c/services';
import { computeCapacityDecision, type DecisionRequest } from '@/services/capacity-decision';
import type { EnhancedTask5C, Capacity5C, Leverage5C } from '@/5c/types';

interface SignalToTaskOptions {
  onTasksCreated?: (tasks: EnhancedTask5C[]) => void;
  defaultUserId?: string;
}

export function useSignalToTask(options: SignalToTaskOptions = {}) {
  const { toast } = useToast();

  const createTasksFromSignal = useCallback(async (request: DecisionRequest) => {
    try {
      // Compute capacity decision
      const decision = computeCapacityDecision(request);
      
      // Convert template actions to 5C tasks
      const tasks: Partial<EnhancedTask5C>[] = decision.templateActions.flatMap(actionBlock => 
        actionBlock.actions.map((actionText, idx) => ({
          capacity: actionBlock.capacity as Capacity5C,
          loop_id: request.loopCode, // Using loopCode as loop_id
          type: 'reactive' as const, // Default type
          scale: 'micro' as const, // Default scale
          leverage: actionBlock.sprintLevel as Leverage5C,
          title: `[${actionBlock.capacity.toUpperCase()}] ${actionText.split('.')[0]}`,
          description: actionText,
          status: 'open' as const,
          payload: {
            signal: {
              indicator: request.indicator,
              value: request.reading.value,
              band: request.reading.band,
              timestamp: request.tstamp
            },
            decision: {
              scores: decision.scores,
              rationale: decision.rationale,
              srt: decision.srt,
              guardrails: decision.guardrails,
              consent: decision.consent
            },
            actionOrder: actionBlock.order,
            actionIndex: idx
          },
          user_id: options.defaultUserId || 'current-user'
        }))
      );

      // Create tasks in parallel
      const createdTasks = await Promise.all(
        tasks.map(task => createTask5C(task))
      );

      // Show success toast
      toast({
        title: "Capacity Tasks Created",
        description: `${createdTasks.length} tasks created from ${request.indicator} signal`,
        duration: 4000
      });

      // Notify caller
      options.onTasksCreated?.(createdTasks);

      return createdTasks;
    } catch (error) {
      console.error('Failed to create tasks from signal:', error);
      toast({
        title: "Task Creation Failed",
        description: "Failed to create capacity tasks from signal",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast, options]);

  return {
    createTasksFromSignal
  };
}