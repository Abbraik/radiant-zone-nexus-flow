// Enhanced 5C Task Hook with TaskEngine V2 Integration
import { useState, useCallback, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { useTaskEngine } from './useTaskEngine';
import { getTasks5C, getTask5CById, createTask5C, updateTask5C } from '@/5c/services';
import { QUERY_KEYS_5C, type EnhancedTask5C, type Capacity5C } from '@/5c/types';
import { useToast } from './use-toast';
import type { TaskV2, TaskStatus, TaskPriority } from '@/types/taskEngine';

export const use5cTaskEngine = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const taskId = searchParams.get('task5c');
  
  // Also get TaskEngine V2 capabilities
  const taskEngineV2 = useTaskEngine();

  // 5C Tasks queries
  const { data: c5Tasks = [], isLoading: isLoadingTasks, error: tasksError } = useQuery({
    queryKey: QUERY_KEYS_5C.tasks(),
    queryFn: () => {
      console.log('🔍 5C useQuery: Fetching tasks...');
      return getTasks5C();
    },
    refetchInterval: 30000 // Refresh every 30s
  });

  // Log query results
  useEffect(() => {
    if (c5Tasks && c5Tasks.length > 0) {
      console.log('✅ 5C useQuery: Tasks fetched successfully:', c5Tasks);
    }
    if (tasksError) {
      console.error('❌ 5C useQuery: Error fetching tasks:', tasksError);
    }
  }, [c5Tasks, tasksError]);

  const { data: activeTask, isLoading: isLoadingTask, error: taskError } = useQuery({
    queryKey: QUERY_KEYS_5C.task(taskId!),
    queryFn: () => getTask5CById(taskId!),
    enabled: !!taskId
  });

  // Create 5C task mutation
  const createTask5CMutation = useMutation({
    mutationFn: createTask5C,
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_5C.tasks() });
      toast({
        title: "5C Task Created",
        description: `"${task.title}" has been created successfully`
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create 5C task: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Update 5C task mutation
  const updateTask5CMutation = useMutation({
    mutationFn: ({ taskId, updates }: { taskId: string; updates: Partial<EnhancedTask5C> }) =>
      updateTask5C(taskId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_5C.tasks() });
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS_5C.task(taskId!) });
      toast({
        title: "5C Task Updated",
        description: "Task has been updated successfully"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update 5C task: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  // Convert 5C task to workspace-compatible format
  const convertToWorkspaceTask = useCallback((task5c: EnhancedTask5C): any => ({
    ...task5c,
    zone: task5c.capacity,
    type: `capacity-${task5c.capacity}`,
    components: [],
    task_type: `capacity-${task5c.capacity}`,
    priority: 'normal',
    due_date: task5c.updated_at,
    created_at: new Date(task5c.created_at),
    updated_at: new Date(task5c.updated_at),
    tri: task5c.tri ? {
      T: task5c.tri.t_value,
      R: task5c.tri.r_value,
      I: task5c.tri.i_value
    } : undefined,
    status: task5c.status === 'open' ? 'available' as const : 
            task5c.status === 'active' ? 'in_progress' as const :
            task5c.status === 'done' ? 'completed' as const :
            'claimed' as const
  }), []);

  // Filtered tasks
  const filteredTasks = useMemo(() => {
    console.log('🔍 5C useMemo: Processing tasks:', c5Tasks);
    
    const result = {
      myTasks: c5Tasks.filter(t => t.status === 'claimed').map(convertToWorkspaceTask),
      availableTasks: c5Tasks.filter(t => t.status === 'open').map(convertToWorkspaceTask),
      activeTasks: c5Tasks.filter(t => t.status === 'active'),
      completedTasks: c5Tasks.filter(t => t.status === 'done'),
      byCapacity: {
        responsive: c5Tasks.filter(t => t.capacity === 'responsive'),
        reflexive: c5Tasks.filter(t => t.capacity === 'reflexive'),
        deliberative: c5Tasks.filter(t => t.capacity === 'deliberative'),
        anticipatory: c5Tasks.filter(t => t.capacity === 'anticipatory'),
        structural: c5Tasks.filter(t => t.capacity === 'structural')
      }
    };
    
    console.log('✅ 5C useMemo: Filtered tasks result:', result);
    return result;
  }, [c5Tasks, convertToWorkspaceTask]);

  // Task management functions
  const handleTaskClaim = useCallback((task: any) => {
    console.log('5C Task claiming:', task);
    setSearchParams({ task5c: task.id });
  }, [setSearchParams]);

  const completeTask = useCallback(async (taskId: string) => {
    try {
      await updateTask5CMutation.mutateAsync({
        taskId,
        updates: { status: 'done' }
      });
      setSearchParams({}); // Clear active task
    } catch (error) {
      console.error('Failed to complete 5C task:', error);
    }
  }, [updateTask5CMutation, setSearchParams]);

  const claimTask = useCallback(async (taskId: string) => {
    try {
      await updateTask5CMutation.mutateAsync({
        taskId,
        updates: { status: 'claimed' }
      });
      setSearchParams({ task5c: taskId }); // Set as active task
    } catch (error) {
      console.error('Failed to claim 5C task:', error);
    }
  }, [updateTask5CMutation, setSearchParams]);

  const pauseTask = useCallback(async (taskId: string, reason?: string) => {
    try {
      await updateTask5CMutation.mutateAsync({
        taskId,
        updates: { 
          status: 'blocked',
          payload: { ...activeTask?.payload, pause_reason: reason }
        }
      });
    } catch (error) {
      console.error('Failed to pause 5C task:', error);
    }
  }, [updateTask5CMutation, activeTask]);

  const resumeTask = useCallback(async (taskId: string) => {
    try {
      await updateTask5CMutation.mutateAsync({
        taskId,
        updates: { status: 'active' }
      });
    } catch (error) {
      console.error('Failed to resume 5C task:', error);
    }
  }, [updateTask5CMutation]);

  // Create 5C task with capacity template
  const createCapacityTask = useCallback(async (data: {
    capacity: Capacity5C;
    title: string;
    description?: string;
    payload?: any;
  }) => {
    try {
      const task5c: Partial<EnhancedTask5C> = {
        capacity: data.capacity,
        loop_id: `loop-${data.capacity}-001`,
        type: data.capacity === 'responsive' ? 'reactive' : 
              data.capacity === 'reflexive' ? 'structural' : 'perceptual',
        scale: 'meso',
        leverage: 'P',
        title: data.title,
        description: data.description,
        payload: data.payload || {},
        status: 'open'
      };

      await createTask5CMutation.mutateAsync(task5c);
    } catch (error) {
      console.error('Failed to create capacity task:', error);
    }
  }, [createTask5CMutation]);

  // Enhanced analytics
  const taskAnalytics = useMemo(() => {
    const total = c5Tasks.length;
    const completed = c5Tasks.filter(t => t.status === 'done').length;
    const active = c5Tasks.filter(t => t.status === 'active').length;
    const claimed = c5Tasks.filter(t => t.status === 'claimed').length;
    const open = c5Tasks.filter(t => t.status === 'open').length;

    return {
      total,
      completed,
      active,
      claimed,
      open,
      completionRate: total > 0 ? (completed / total) * 100 : 0,
      byCapacity: Object.entries(filteredTasks.byCapacity).reduce((acc, [capacity, tasks]) => ({
        ...acc,
        [capacity]: tasks.length
      }), {} as Record<Capacity5C, number>)
    };
  }, [c5Tasks, filteredTasks.byCapacity]);

  return {
    // 5C Data
    c5Tasks,
    activeTask,
    ...filteredTasks,
    taskAnalytics,
    
    // Loading states
    isLoading: isLoadingTasks || isLoadingTask,
    isCreating: createTask5CMutation.isPending,
    isUpdating: updateTask5CMutation.isPending,
    
    // Actions
    handleTaskClaim,
    completeTask,
    claimTask,
    pauseTask,
    resumeTask,
    createCapacityTask,
    
    // TaskEngine V2 integration
    taskEngineV2,
    
  // Mock task management interface for compatibility
  openClaimPopup: handleTaskClaim,
  confirmClaimTask: () => {
    const taskIdParam = searchParams.get('task5c');
    if (taskIdParam) {
      claimTask(taskIdParam);
    }
  },
  cancelClaimTask: () => console.log('5C Task claim cancelled'),
  claimingTask: null,
  showClaimPopup: false,
  isClaimingTask: updateTask5CMutation.isPending,
    isCompletingTask: updateTask5CMutation.isPending,
    
    // Error states
    error: tasksError || taskError
  };
};