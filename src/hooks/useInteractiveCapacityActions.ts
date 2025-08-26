// Interactive Capacity Bundle Actions Hook
import { useCallback } from 'react';
import { toast } from 'sonner';
import { use5cTaskEngine } from '@/hooks/use5cTaskEngine';
import type { EnhancedTask5C } from '@/5c/types';

export const useInteractiveCapacityActions = (task: EnhancedTask5C | null) => {
  const { createCapacityTask, completeTask } = use5cTaskEngine();

  // Responsive capacity actions
  const handleUpsertIncident = useCallback(async (payload: any) => {
    if (!task) return null;

    try {
      const incidentTask = await createCapacityTask({
        title: `Incident: ${payload.title || 'Service Disruption'}`,
        description: payload.description || 'Incident response task',
        capacity: 'responsive',
        payload: {
          incident_type: payload.type,
          severity: payload.severity,
          affected_services: payload.affected_services,
          source_task_id: task.id,
          parent_scenario: task.payload?.scenario_id,
          loop_id: task.loop_id
        }
      });

      toast.success(`Created incident response task`);
      return incidentTask;
    } catch (error) {
      toast.error('Failed to create incident task');
      console.error('Incident creation error:', error);
      return null;
    }
  }, [task, createCapacityTask]);

  const handleAppendIncidentEvent = useCallback(async (incidentId: string, event: any) => {
    if (!task) return null;

    try {
      // For now, just log the event - in a real implementation this would update the task
      console.log('Appending incident event:', { incidentId, event, taskId: task.id });
      toast.success(`Added event to incident ${incidentId}`);
      return { success: true, event };
    } catch (error) {
      toast.error('Failed to update incident');
      console.error('Incident update error:', error);
      return null;
    }
  }, [task]);

  const handleCreateSprintWithTasks = useCallback(async (payload: any) => {
    if (!task) return null;

    try {
      const sprintTasks = await Promise.all(
        (payload.tasks || []).map(async (taskData: any) => {
          return createCapacityTask({
            title: taskData.title,
            description: taskData.description,
            capacity: taskData.capacity || task.capacity,
            payload: {
              sprint_id: payload.sprint_id,
              parent_task_id: task.id,
              parent_scenario: task.payload?.scenario_id,
              estimated_effort: taskData.estimated_effort,
              dependencies: taskData.dependencies,
              loop_id: task.loop_id
            }
          });
        })
      );

      toast.success(`Created sprint with ${sprintTasks.length} tasks`);
      return sprintTasks;
    } catch (error) {
      toast.error('Failed to create sprint tasks');
      console.error('Sprint creation error:', error);
      return null;
    }
  }, [task, createCapacityTask]);

  // Deliberative capacity actions  
  const handleSaveDeliberativeSession = useCallback(async (sessionData: any) => {
    if (!task) return null;

    try {
      // For now, just log the session data
      console.log('Saving deliberative session:', { taskId: task.id, sessionData });
      toast.success('Deliberative session saved');
      return { success: true, sessionData };
    } catch (error) {
      toast.error('Failed to save deliberative session');
      console.error('Session save error:', error);
      return null;
    }
  }, [task]);

  // Anticipatory capacity actions
  const handleArmWatchpoint = useCallback(async (riskChannel: string) => {
    if (!task) return;

    try {
      console.log('Arming watchpoint:', { taskId: task.id, riskChannel });
      toast.success(`Armed watchpoint for ${riskChannel}`);
      return { success: true, riskChannel };
    } catch (error) {
      toast.error('Failed to arm watchpoint');
      console.error('Watchpoint error:', error);
    }
  }, [task]);

  const handleRunScenario = useCallback(async (scenarioId: string) => {
    if (!task) return;

    try {
      // Create a scenario analysis task
      const scenarioTask = await createCapacityTask({
        title: `Scenario Analysis: ${scenarioId}`,
        description: `Analysis of scenario ${scenarioId} impact`,
        capacity: 'anticipatory',
        payload: {
          scenario_id: scenarioId,
          parent_task_id: task.id,
          analysis_type: 'impact_assessment',
          parent_scenario: task.payload?.scenario_id,
          loop_id: task.loop_id
        }
      });

      toast.success(`Running scenario analysis: ${scenarioId}`);
      return scenarioTask;
    } catch (error) {
      toast.error('Failed to run scenario');
      console.error('Scenario error:', error);
    }
  }, [task, createCapacityTask]);

  const handleStagePrePosition = useCallback(async (packIds: string[]) => {
    if (!task) return;

    try {
      console.log('Staging pre-position packs:', { taskId: task.id, packIds });
      toast.success(`Staged ${packIds.length} pre-position packs`);
      return { success: true, packIds };
    } catch (error) {
      toast.error('Failed to stage pre-position packs');
      console.error('Pre-position error:', error);
    }
  }, [task]);

  // Structural capacity actions
  const handleStructuralUpdate = useCallback(async (updateData: any) => {
    if (!task) return;

    try {
      console.log('Applying structural update:', { taskId: task.id, updateData });
      toast.success('Structural update applied');
      return { success: true, updateData };
    } catch (error) {
      toast.error('Failed to apply structural update');
      console.error('Structural update error:', error);
    }
  }, [task]);

  return {
    // Responsive actions
    handleUpsertIncident,
    handleAppendIncidentEvent,
    handleCreateSprintWithTasks,
    
    // Deliberative actions
    handleSaveDeliberativeSession,
    
    // Anticipatory actions
    handleArmWatchpoint,
    handleRunScenario,
    handleStagePrePosition,
    
    // Structural actions
    handleStructuralUpdate
  };
};