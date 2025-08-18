import { useState, useCallback, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import type { EnhancedTask, TaskLock, Zone, TaskType } from '@/types/zone-bundles';

interface UseEnhancedTasksReturn {
  // Task data
  tasks: EnhancedTask[];
  activeTask: EnhancedTask | null;
  loading: boolean;
  error: Error | null;
  
  // Task actions
  claimTask: (taskId: string) => Promise<void>;
  releaseTask: (taskId: string) => Promise<void>;
  updateTaskPayload: (taskId: string, payload: any) => Promise<void>;
  submitTask: (taskId: string) => Promise<void>;
  escalateTask: (taskId: string, reason: string, target: string) => Promise<void>;
  
  // Task validation
  validateTask: (task: EnhancedTask) => { isValid: boolean; errors: string[] };
  
  // Checklist management
  updateChecklistItem: (taskId: string, itemId: string, done: boolean) => Promise<void>;
  
  // Artifact management
  addArtifact: (taskId: string, artifact: any) => Promise<void>;
  
  // Real-time updates
  isLocked: (taskId: string) => boolean;
  canClaim: (taskId: string) => boolean;
  getLockOwner: (taskId: string) => string | null;
}

const AUTOSAVE_INTERVAL = 15000; // 15 seconds

export function useEnhancedTasks(): UseEnhancedTasksReturn {
  const [autosaveTimeouts, setAutosaveTimeouts] = useState<Map<string, NodeJS.Timeout>>(new Map());
  const queryClient = useQueryClient();

  // Fetch tasks with enhanced data
  const {
    data: tasks = [],
    isLoading: loading,
    error
  } = useQuery({
    queryKey: ['enhanced-tasks'],
    queryFn: async () => {
      const { data: tasksData, error: tasksError } = await supabase
        .from('tasks')
        .select(`
          *,
          checklist_items:task_checklist_items(*),
          artifacts:task_artifacts(*),
          events:task_events(*),
          lock:task_locks(*)
        `)
        .order('created_at', { ascending: false });

      if (tasksError) throw tasksError;

      return (tasksData || []) as any[];
    }
  });

  // Get currently active task (claimed by current user)
  const activeTask = tasks.find(task => 
    Array.isArray(task.lock) ? task.lock.some((lock: any) => lock.locked_by === (supabase.auth.getUser() as any)?.data?.user?.id) : false
  ) || null;

  // Claim task mutation
  const claimTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // Check if task is already locked
      const { data: existingLock } = await supabase
        .from('task_locks')
        .select('*')
        .eq('task_id', taskId)
        .single();

      if (existingLock && new Date(existingLock.expires_at) > new Date()) {
        throw new Error('Task is already claimed by another user');
      }

      // Create or update lock
      const { error: lockError } = await supabase
        .from('task_locks')
        .upsert({
          task_id: taskId,
          locked_by: user.data.user.id,
          locked_at: new Date().toISOString(),
          expires_at: new Date(Date.now() + 30 * 60 * 1000).toISOString() // 30 minutes
        });

      if (lockError) throw lockError;

      // Update task status
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          status: 'claimed',
          assigned_to: user.data.user.id,
          locked_by: user.data.user.id,
          locked_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (taskError) throw taskError;

      // Log event
      await supabase
        .from('task_events')
        .insert({
          task_id: taskId,
          event_type: 'claimed',
          actor: user.data.user.id,
          details: { timestamp: new Date().toISOString() }
        });

      return taskId;
    },
    onSuccess: (taskId) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-tasks'] });
      toast.success('Task claimed successfully');
    },
    onError: (error) => {
      toast.error(`Failed to claim task: ${error.message}`);
    }
  });

  // Release task mutation
  const releaseTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // Remove lock
      const { error: lockError } = await supabase
        .from('task_locks')
        .delete()
        .eq('task_id', taskId)
        .eq('locked_by', user.data.user.id);

      if (lockError) throw lockError;

      // Update task status
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          status: 'open',
          locked_by: null,
          locked_at: null
        })
        .eq('id', taskId);

      if (taskError) throw taskError;

      // Log event
      await supabase
        .from('task_events')
        .insert({
          task_id: taskId,
          event_type: 'released',
          actor: user.data.user.id,
          details: { timestamp: new Date().toISOString() }
        });

      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-tasks'] });
      toast.success('Task released successfully');
    },
    onError: (error) => {
      toast.error(`Failed to release task: ${error.message}`);
    }
  });

  // Update task payload mutation
  const updatePayloadMutation = useMutation({
    mutationFn: async ({ taskId, payload }: { taskId: string; payload: any }) => {
      const { error: payloadError } = await supabase
        .from('task_payloads')
        .upsert({
          task_id: taskId,
          payload,
          updated_at: new Date().toISOString()
        });

      if (payloadError) throw payloadError;

      // Also update the main tasks table
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          payload,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (taskError) throw taskError;

      return { taskId, payload };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-tasks'] });
    },
    onError: (error) => {
      toast.error(`Failed to save changes: ${error.message}`);
    }
  });

  // Submit task mutation
  const submitTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // Update task status
      const { error: taskError } = await supabase
        .from('tasks')
        .update({
          status: 'submitted',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (taskError) throw taskError;

      // Remove lock
      await supabase
        .from('task_locks')
        .delete()
        .eq('task_id', taskId);

      // Log event
      await supabase
        .from('task_events')
        .insert({
          task_id: taskId,
          event_type: 'submitted',
          actor: user.data.user.id,
          details: { timestamp: new Date().toISOString() }
        });

      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-tasks'] });
      toast.success('Task submitted successfully');
    },
    onError: (error) => {
      toast.error(`Failed to submit task: ${error.message}`);
    }
  });

  // Escalate task mutation
  const escalateTaskMutation = useMutation({
    mutationFn: async ({ taskId, reason, target }: { taskId: string; reason: string; target: string }) => {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // Log escalation event
      await supabase
        .from('task_events')
        .insert({
          task_id: taskId,
          event_type: 'escalated',
          actor: user.data.user.id,
          details: { reason, target, timestamp: new Date().toISOString() }
        });

      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-tasks'] });
      toast.success('Task escalated successfully');
    },
    onError: (error) => {
      toast.error(`Failed to escalate task: ${error.message}`);
    }
  });

  // Update checklist item mutation
  const updateChecklistMutation = useMutation({
    mutationFn: async ({ taskId, itemId, done }: { taskId: string; itemId: string; done: boolean }) => {
      const { error } = await supabase
        .from('task_checklist_items')
        .update({ done, updated_at: new Date().toISOString() })
        .eq('id', itemId)
        .eq('task_id', taskId);

      if (error) throw error;
      return { taskId, itemId, done };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-tasks'] });
    }
  });

  // Add artifact mutation
  const addArtifactMutation = useMutation({
    mutationFn: async ({ taskId, artifact }: { taskId: string; artifact: any }) => {
      const { error } = await supabase
        .from('task_artifacts')
        .insert({
          task_id: taskId,
          ...artifact
        });

      if (error) throw error;
      return taskId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-tasks'] });
      toast.success('Artifact added successfully');
    }
  });

  // Helper functions
  const isLocked = useCallback((taskId: string): boolean => {
    const task = tasks.find(t => t.id === taskId);
    if (!task?.lock) return false;
    
    const lock = Array.isArray(task.lock) ? task.lock[0] : task.lock;
    return lock && new Date(lock.expires_at) > new Date();
  }, [tasks]);

  const canClaim = useCallback((taskId: string): boolean => {
    return !isLocked(taskId);
  }, [isLocked]);

  const getLockOwner = useCallback((taskId: string): string | null => {
    const task = tasks.find(t => t.id === taskId);
    if (!task?.lock) return null;
    
    const lock = Array.isArray(task.lock) ? task.lock[0] : task.lock;
    return lock?.locked_by || null;
  }, [tasks]);

  const validateTask = useCallback((task: EnhancedTask) => {
    // Import validation from bundle registry
    const { validateBundlePayload } = require('@/components/workspace/DynamicZoneBundleLoader');
    return validateBundlePayload(task.zone, task.payload);
  }, []);

  // Autosave functionality
  const updateTaskPayload = useCallback(async (taskId: string, payload: any) => {
    // Clear existing timeout
    const existingTimeout = autosaveTimeouts.get(taskId);
    if (existingTimeout) {
      clearTimeout(existingTimeout);
    }

    // Set new timeout
    const timeout = setTimeout(() => {
      updatePayloadMutation.mutate({ taskId, payload });
      setAutosaveTimeouts(prev => {
        const newMap = new Map(prev);
        newMap.delete(taskId);
        return newMap;
      });
    }, AUTOSAVE_INTERVAL);

    setAutosaveTimeouts(prev => new Map(prev).set(taskId, timeout));
  }, [autosaveTimeouts, updatePayloadMutation]);

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      autosaveTimeouts.forEach(timeout => clearTimeout(timeout));
    };
  }, [autosaveTimeouts]);

  return {
    // Task data
    tasks,
    activeTask,
    loading,
    error: error as Error | null,
    
    // Task actions
    claimTask: async (taskId: string) => { await claimTaskMutation.mutateAsync(taskId); },
    releaseTask: async (taskId: string) => { await releaseTaskMutation.mutateAsync(taskId); },
    updateTaskPayload,
    submitTask: async (taskId: string) => { await submitTaskMutation.mutateAsync(taskId); },
    escalateTask: async (taskId: string, reason: string, target: string) => { 
      await escalateTaskMutation.mutateAsync({ taskId, reason, target });
    },
    
    // Task validation
    validateTask,
    
    // Checklist management
    updateChecklistItem: async (taskId: string, itemId: string, done: boolean) => {
      await updateChecklistMutation.mutateAsync({ taskId, itemId, done });
    },
    
    // Artifact management
    addArtifact: async (taskId: string, artifact: any) => {
      await addArtifactMutation.mutateAsync({ taskId, artifact });
    },
    
    // Real-time updates
    isLocked,
    canClaim,
    getLockOwner
  };
}