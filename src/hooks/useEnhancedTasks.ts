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
}

// Task interface compatible with the workspace
export interface Task {
  id: string;
  title: string;
  description: string;
  zone: 'think' | 'act' | 'monitor' | 'innovate-learn';
  type: string;
  components: string[];
  status: 'available' | 'claimed' | 'in_progress' | 'completed';
  owner_id?: string;
  assignee?: string;
  assigned_to?: string;
  loop_id?: string;
  due_at?: Date;
  due_date?: string;
  created_at: Date;
  updated_at: Date;
  task_type?: string;
  payload?: any;
}

// Convert SupabaseTask to Task format
const convertToTask = (supabaseTask: SupabaseTask): Task => {
  // Map zones properly for navigation and consistency
  const zoneMap: Record<string, 'think' | 'act' | 'monitor' | 'innovate-learn'> = {
    'THINK': 'think',
    'ACT': 'act', 
    'MONITOR': 'monitor',
    'INNOVATE': 'innovate-learn'
  };
  
  const zone = zoneMap[supabaseTask.zone as string] || supabaseTask.zone as 'think' | 'act' | 'monitor' | 'innovate-learn';
  
  return {
    id: supabaseTask.id,
    title: supabaseTask.title,
    description: supabaseTask.description || '',
    zone: zone,
    type: supabaseTask.task_type || 'general',
    components: [], // Default empty array
    status: supabaseTask.status === 'todo' ? 'available' :
           supabaseTask.assigned_to ? 'claimed' : 
           supabaseTask.status as 'available' | 'claimed' | 'in_progress' | 'completed',
    owner_id: supabaseTask.user_id,
    assignee: supabaseTask.assigned_to,
    assigned_to: supabaseTask.assigned_to,
    due_at: supabaseTask.due_date ? new Date(supabaseTask.due_date) : undefined,
    due_date: supabaseTask.due_date,
    created_at: new Date(supabaseTask.created_at),
    updated_at: new Date(supabaseTask.updated_at),
    task_type: supabaseTask.task_type,
    payload: supabaseTask.payload
  };
};

export const useEnhancedTasks = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [claimingTask, setClaimingTask] = useState<Task | null>(null);
  const [showClaimPopup, setShowClaimPopup] = useState(false);
  
  // Mock current user ID - replace with real auth later
  const getCurrentUserId = () => '00000000-0000-4000-8000-000000000000'; // Valid UUID format

  const { data: supabaseTasks = [], isLoading } = useQuery({
    queryKey: ['enhanced-tasks'],
    queryFn: async (): Promise<SupabaseTask[]> => {
      console.log('Fetching tasks from Supabase...');
      
      // Reset all tasks to available state when fetching
      try {
        await supabase.rpc('reset_all_tasks');
        console.log('Tasks reset to available state');
      } catch (error) {
        console.warn('Failed to reset tasks:', error);
      }
      
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

  // Convert to Task format
  const allTasks = supabaseTasks.map(convertToTask);

  const myTasks = allTasks.filter(task => 
    task.assignee === getCurrentUserId() && task.status !== 'completed'
  );
  
  const availableTasks = allTasks.filter(task => 
    !task.assignee && task.status === 'available'
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

      // No navigation needed - workspace will adapt dynamically to the claimed task
      console.log(`Task claimed for zone: ${claimedTask.zone}. Workspace will adapt dynamically.`);
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