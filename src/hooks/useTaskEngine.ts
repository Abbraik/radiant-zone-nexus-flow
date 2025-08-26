import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { taskEngine } from '@/services/taskEngine';
import { useToast } from './use-toast';
import type { TaskV2, TaskStatus, TaskPriority, TaskEventType } from '@/types/taskEngine';

export const useTaskEngine = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTask, setSelectedTask] = useState<TaskV2 | null>(null);

  // Task queries
  const { data: tasks = [], isLoading: tasksLoading } = useQuery({
    queryKey: ['tasks-v2'],
    queryFn: () => taskEngine.getTasks()
  });

  const { data: templates = [] } = useQuery({
    queryKey: ['task-templates'],
    queryFn: () => taskEngine.getTemplates()
  });

  const { data: summary } = useQuery({
    queryKey: ['task-summary'],
    queryFn: () => taskEngine.getTaskSummary(),
    refetchInterval: 30000 // Refresh every 30s
  });

  // Task mutations
  const createTaskMutation = useMutation({
    mutationFn: taskEngine.createTask,
    onSuccess: (task) => {
      queryClient.invalidateQueries({ queryKey: ['tasks-v2'] });
      queryClient.invalidateQueries({ queryKey: ['task-summary'] });
      toast({
        title: "Task Created",
        description: `"${task.title}" has been created successfully`
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to create task: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ taskId, status, context }: { taskId: string; status: TaskStatus; context?: Record<string, any> }) =>
      taskEngine.updateTaskStatus(taskId, status, context),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks-v2'] });
      queryClient.invalidateQueries({ queryKey: ['task-summary'] });
      toast({
        title: "Task Updated",
        description: "Task status has been updated"
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `Failed to update task: ${error.message}`,
        variant: "destructive"
      });
    }
  });

  const assignTaskMutation = useMutation({
    mutationFn: ({ taskId, userId, role }: { taskId: string; userId: string; role?: string }) =>
      taskEngine.assignTask(taskId, userId, role),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks-v2'] });
      toast({
        title: "Task Assigned",
        description: "Task has been assigned successfully"
      });
    }
  });

  const acquireLockMutation = useMutation({
    mutationFn: ({ taskId, duration }: { taskId: string; duration?: number }) =>
      taskEngine.acquireLock(taskId, duration),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks-v2'] });
      toast({
        title: "Lock Acquired",
        description: "Task has been locked for editing"
      });
    }
  });

  // Convenience methods
  const createTask = useCallback((data: Parameters<typeof taskEngine.createTask>[0]) => {
    createTaskMutation.mutate(data);
  }, [createTaskMutation]);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus, context?: Record<string, any>) => {
    updateStatusMutation.mutate({ taskId, status, context });
  }, [updateStatusMutation]);

  const assignTask = useCallback((taskId: string, userId: string, role?: string) => {
    assignTaskMutation.mutate({ taskId, userId, role });
  }, [assignTaskMutation]);

  const acquireLock = useCallback((taskId: string, duration?: number) => {
    acquireLockMutation.mutate({ taskId, duration });
  }, [acquireLockMutation]);

  const completeTask = useCallback((taskId: string, outputs?: Record<string, any>) => {
    updateTaskStatus(taskId, 'completed', outputs);
  }, [updateTaskStatus]);

  const pauseTask = useCallback((taskId: string, reason?: string) => {
    updateTaskStatus(taskId, 'paused', { reason });
  }, [updateTaskStatus]);

  const resumeTask = useCallback((taskId: string) => {
    updateTaskStatus(taskId, 'active');
  }, [updateTaskStatus]);

  const cancelTask = useCallback((taskId: string, reason?: string) => {
    updateTaskStatus(taskId, 'cancelled', { reason });
  }, [updateTaskStatus]);

  // Filtered tasks
  const activeTasks = tasks.filter(task => task.status === 'active');
  const myTasks = tasks.filter(task => task.created_by === 'current-user'); // TODO: Replace with actual user ID
  const overdueTasks = tasks.filter(task => 
    task.due_date && new Date(task.due_date) < new Date() && task.status !== 'completed'
  );

  return {
    // Data
    tasks,
    templates,
    summary,
    selectedTask,
    activeTasks,
    myTasks,
    overdueTasks,
    
    // Loading states
    tasksLoading,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateStatusMutation.isPending,
    isAssigning: assignTaskMutation.isPending,
    isAcquiringLock: acquireLockMutation.isPending,
    
    // Actions
    createTask,
    updateTaskStatus,
    assignTask,
    acquireLock,
    completeTask,
    pauseTask,
    resumeTask,
    cancelTask,
    setSelectedTask,
    
    // Direct service access for advanced operations
    taskEngine
  };
};