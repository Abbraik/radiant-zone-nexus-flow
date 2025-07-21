import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { mockTasks, TaskType } from '../config/taskRegistry';
import { useToast } from './use-toast';

export interface Task extends TaskType {
  status: 'available' | 'claimed' | 'in_progress' | 'completed';
  owner_id?: string;
  loop_id?: string;
  due_at?: Date;
  created_at: Date;
  updated_at: Date;
}

// Mock data with status
const mockTasksWithStatus: Task[] = mockTasks.map((task, index) => ({
  ...task,
  status: index === 0 ? 'claimed' : 'available',
  owner_id: index === 0 ? 'current-user' : undefined,
  loop_id: `loop-${index + 1}`,
  due_at: new Date(Date.now() + (index + 1) * 7 * 24 * 60 * 60 * 1000),
  created_at: new Date(),
  updated_at: new Date()
}));

export const useTasks = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const { data: allTasks = [], isLoading } = useQuery({
    queryKey: ['tasks'],
    queryFn: async (): Promise<Task[]> => {
      // In real implementation, this would be a Supabase query
      await new Promise(resolve => setTimeout(resolve, 500)); // simulate API delay
      return mockTasksWithStatus;
    }
  });

  const myTasks = allTasks.filter(task => 
    task.status === 'claimed' && task.owner_id === 'current-user'
  );
  
  const availableTasks = allTasks.filter(task => task.status === 'available');
  
  const activeTask = myTasks[0] || null;

  const claimTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 300));
      return taskId;
    },
    onSuccess: (taskId) => {
      // Update local state
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => 
        oldTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: 'claimed' as const, owner_id: 'current-user' }
            : task
        )
      );
      
      toast({
        title: "Task Claimed",
        description: "Task has been added to your workspace",
        duration: 3000
      });
    }
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      await new Promise(resolve => setTimeout(resolve, 300));
      return taskId;
    },
    onSuccess: (taskId) => {
      queryClient.setQueryData(['tasks'], (oldTasks: Task[] = []) => 
        oldTasks.map(task => 
          task.id === taskId 
            ? { ...task, status: 'completed' as const }
            : task
        )
      );
      
      toast({
        title: "Task Completed",
        description: "Great work! Task marked as complete",
        duration: 3000
      });
    }
  });

  const claimTask = useCallback((taskId: string) => {
    claimTaskMutation.mutate(taskId);
  }, [claimTaskMutation]);

  const completeTask = useCallback((taskId: string) => {
    completeTaskMutation.mutate(taskId);
  }, [completeTaskMutation]);

  return {
    allTasks,
    myTasks,
    availableTasks,
    activeTask,
    isLoading,
    claimTask,
    completeTask,
    isClaimingTask: claimTaskMutation.isPending,
    isCompletingTask: completeTaskMutation.isPending
  };
};