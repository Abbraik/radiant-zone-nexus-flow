import { useState, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../integrations/supabase/client';
import { useToast } from './use-toast';
import type { Zone, TaskType } from '../types/zone-bundles';

export interface SupabaseTask {
  id: string;
  title: string;
  description: string;
  zone: Zone;
  task_type: TaskType;
  status: 'todo' | 'in_progress' | 'completed' | 'blocked';
  user_id: string;
  assigned_to?: string;
  payload: any;
  priority: 'low' | 'medium' | 'high' | 'critical';
  due_date?: string;
  created_at: string;
  updated_at: string;
  sprint_id?: string;
  locked_by?: string;
  locked_at?: string;
  claim_id?: string;
  loop_id?: string;
  loop?: {
    id: string;
    name: string;
    type?: string;
    scale?: string;
  };
}

export const useEnhancedTasks = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [claimingTask, setClaimingTask] = useState<SupabaseTask | null>(null);
  const [showClaimPopup, setShowClaimPopup] = useState(false);
  
  // Mock current user ID - replace with real auth later
  const getCurrentUserId = () => 'mock-user-id';

  const { data: allTasks = [], isLoading } = useQuery({
    queryKey: ['enhanced-tasks'],
    queryFn: async (): Promise<SupabaseTask[]> => {
      console.log('Fetching tasks from Supabase...');
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Error fetching tasks:', error);
        throw error;
      }
      
      console.log('Fetched tasks:', data);
      return data as SupabaseTask[];
    }
  });

  const myTasks = allTasks.filter(task => 
    task.assigned_to === getCurrentUserId() && task.status !== 'completed'
  );
  
  const availableTasks = allTasks.filter(task => 
    !task.assigned_to && task.status === 'todo'
  );
  
  const activeTask = myTasks.find(task => task.status === 'in_progress') || myTasks[0] || null;

  const claimTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const userId = getCurrentUserId();
      
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          assigned_to: userId,
          status: 'in_progress',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (claimedTask) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-tasks'] });
      
      toast({
        title: "Task Claimed",
        description: `"${claimedTask.title}" has been added to your workspace`,
        duration: 3000
      });

      // Navigate to appropriate zone workspace based on task zone
      if (claimedTask.zone === 'monitor') {
        setTimeout(() => navigate('/monitor'), 100);
      } else if (claimedTask.zone === 'act') {
        setTimeout(() => navigate('/act-wizard'), 100);
      } else if (claimedTask.zone === 'think') {
        setTimeout(() => navigate('/think'), 100);
      } else if (claimedTask.zone === 'innovate-learn') {
        setTimeout(() => navigate('/innovate-learn'), 100);
      }
    },
    onError: (error) => {
      console.error('Error claiming task:', error);
      toast({
        title: "Error",
        description: "Failed to claim task. Please try again.",
        variant: "destructive"
      });
    }
  });

  const updateTaskPayloadMutation = useMutation({
    mutationFn: async ({ taskId, payload }: { taskId: string; payload: any }) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          payload,
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-tasks'] });
    }
  });

  const completeTaskMutation = useMutation({
    mutationFn: async (taskId: string) => {
      const { data, error } = await supabase
        .from('tasks')
        .update({ 
          status: 'completed',
          updated_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: (completedTask) => {
      queryClient.invalidateQueries({ queryKey: ['enhanced-tasks'] });
      
      // Create task event
      supabase.from('task_events').insert({
        task_id: completedTask.id,
        event_type: 'completed',
        actor: getCurrentUserId(),
        details: { completed_at: new Date().toISOString() }
      });
      
      toast({
        title: "Task Completed",
        description: `"${completedTask.title}" has been marked as complete`,
        duration: 3000
      });
    }
  });

  const openClaimPopup = useCallback((taskId: string) => {
    const task = allTasks.find(t => t.id === taskId);
    if (task) {
      setClaimingTask(task);
      setShowClaimPopup(true);
    }
  }, [allTasks]);

  const confirmClaimTask = useCallback(() => {
    if (claimingTask) {
      claimTaskMutation.mutate(claimingTask.id);
      setShowClaimPopup(false);
      setClaimingTask(null);
    }
  }, [claimingTask, claimTaskMutation]);

  const cancelClaimTask = useCallback(() => {
    setShowClaimPopup(false);
    setClaimingTask(null);
  }, []);

  const updateTaskPayload = useCallback((taskId: string, payload: any) => {
    updateTaskPayloadMutation.mutate({ taskId, payload });
  }, [updateTaskPayloadMutation]);

  const completeTask = useCallback((taskId: string) => {
    completeTaskMutation.mutate(taskId);
  }, [completeTaskMutation]);

  return {
    allTasks,
    myTasks,
    availableTasks,
    activeTask,
    isLoading,
    claimTask: (taskId: string) => claimTaskMutation.mutate(taskId),
    completeTask,
    updateTaskPayload,
    openClaimPopup,
    confirmClaimTask,
    cancelClaimTask,
    claimingTask,
    showClaimPopup,
    isClaimingTask: claimTaskMutation.isPending,
    isCompletingTask: completeTaskMutation.isPending,
    isUpdatingPayload: updateTaskPayloadMutation.isPending
  };
};