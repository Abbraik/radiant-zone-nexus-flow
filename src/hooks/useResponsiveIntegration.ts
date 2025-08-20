import { useCallback } from 'react';
import { upsertIncident, appendIncidentEvent, createSprintWithTasks } from '@/services/responsive-incidents';
import { useToast } from '@/hooks/use-toast';

export function useResponsiveIntegration(payload: any, onPayloadUpdate: (payload: any) => void) {
  const { toast } = useToast();

  const handleUpsertIncident = useCallback(async (incidentPayload: any) => {
    try {
      const result = await upsertIncident(incidentPayload);
      onPayloadUpdate({
        ...payload,
        lastIncidentId: result.id
      });
      return result;
    } catch (error) {
      toast({
        title: "Error creating incident",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
      throw error;
    }
  }, [payload, onPayloadUpdate, toast]);

  const handleAppendIncidentEvent = useCallback(async (incidentId: string, event: any) => {
    try {
      return await appendIncidentEvent(incidentId, event);
    } catch (error) {
      toast({
        title: "Error logging incident event",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const handleCreateSprintWithTasks = useCallback(async (sprintPayload: any) => {
    try {
      const result = await createSprintWithTasks(sprintPayload);
      toast({
        title: "Sprint created",
        description: `Created containment sprint with ${sprintPayload.tasks?.length || 0} tasks`,
      });
      return result;
    } catch (error) {
      toast({
        title: "Error creating sprint",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive"
      });
      throw error;
    }
  }, [toast]);

  const handleOpenClaimDrawer = useCallback((tasks: Array<any>) => {
    toast({
      title: "Tasks ready for claiming",
      description: `${tasks.length} tasks are available for claiming`,
    });
    
    onPayloadUpdate({
      ...payload,
      availableTasks: tasks,
      tasksReady: true
    });
  }, [payload, onPayloadUpdate, toast]);

  return {
    handleUpsertIncident,
    handleAppendIncidentEvent,
    handleCreateSprintWithTasks,
    handleOpenClaimDrawer
  };
}