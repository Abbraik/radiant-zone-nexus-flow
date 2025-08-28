import { useState, useCallback, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface Task {
  id: string;
  title: string;
  description: string;
  capacity: string;
  leverage?: string;
  status: 'pending' | 'claimed' | 'in_progress' | 'completed' | 'blocked';
  assignee_id?: string;
  assignee_name?: string;
  claimed_at?: string;
  started_at?: string;
  completed_at?: string;
  due_date?: string;
  effort_hours?: number;
  progress_percent?: number;
  sprint_id?: string;
  meta?: any;
  created_at?: string;
  updated_at?: string;
}

export interface TaskProgress {
  task_id: string;
  progress_percent: number;
  status: string;
  notes?: string;
  updated_at: string;
}

export function useTaskManagement(sprintId?: string) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);
  const { toast } = useToast();

  // Fetch tasks
  const fetchTasks = useCallback(async () => {
    try {
      let query = supabase
        .from('sprint_tasks')
        .select(`
          *,
          profiles:assignee_id(display_name)
        `);
      
      if (sprintId) {
        query = query.eq('sprint_id', sprintId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });
      
      if (error) throw error;
      
      const formattedTasks = data?.map(task => ({
        ...task,
        assignee_name: task.profiles?.display_name
      })) || [];
      
      setTasks(formattedTasks);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error loading tasks",
        description: error instanceof Error ? error.message : "Failed to load tasks",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  }, [sprintId, toast]);

  // Claim task
  const claimTask = useCallback(async (taskId: string) => {
    setClaiming(taskId);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('sprint_tasks')
        .update({
          status: 'claimed',
          assignee_id: user.data.user.id,
          claimed_at: new Date().toISOString()
        })
        .eq('id', taskId)
        .eq('status', 'pending'); // Only claim if still pending

      if (error) throw error;

      await fetchTasks();
      
      toast({
        title: "Task claimed",
        description: "You have successfully claimed this task",
      });

      return true;
    } catch (error) {
      console.error('Error claiming task:', error);
      toast({
        title: "Failed to claim task",
        description: error instanceof Error ? error.message : "Failed to claim task",
        variant: "destructive"
      });
      return false;
    } finally {
      setClaiming(null);
    }
  }, [fetchTasks, toast]);

  // Update task progress
  const updateTaskProgress = useCallback(async (
    taskId: string, 
    progress: number, 
    status?: string,
    notes?: string
  ) => {
    try {
      const updateData: any = {
        progress_percent: progress,
        updated_at: new Date().toISOString()
      };

      if (status) {
        updateData.status = status;
        
        if (status === 'in_progress' && !tasks.find(t => t.id === taskId)?.started_at) {
          updateData.started_at = new Date().toISOString();
        }
        
        if (status === 'completed') {
          updateData.completed_at = new Date().toISOString();
          updateData.progress_percent = 100;
        }
      }

      const { error } = await supabase
        .from('sprint_tasks')
        .update(updateData)
        .eq('id', taskId);

      if (error) throw error;

      // Log progress update
      if (notes) {
        await supabase
          .from('task_progress_logs')
          .insert({
            task_id: taskId,
            progress_percent: progress,
            status: status || tasks.find(t => t.id === taskId)?.status || 'in_progress',
            notes,
            user_id: (await supabase.auth.getUser()).data.user?.id
          });
      }

      await fetchTasks();
      
      toast({
        title: "Progress updated",
        description: `Task progress set to ${progress}%`,
      });
    } catch (error) {
      console.error('Error updating task progress:', error);
      toast({
        title: "Failed to update progress",
        description: error instanceof Error ? error.message : "Failed to update progress",
        variant: "destructive"
      });
    }
  }, [tasks, fetchTasks, toast]);

  // Assign task to user
  const assignTask = useCallback(async (taskId: string, userId: string) => {
    try {
      const { error } = await supabase
        .from('sprint_tasks')
        .update({
          assignee_id: userId,
          status: 'claimed',
          claimed_at: new Date().toISOString()
        })
        .eq('id', taskId);

      if (error) throw error;

      await fetchTasks();
      
      toast({
        title: "Task assigned",
        description: "Task has been assigned successfully",
      });
    } catch (error) {
      console.error('Error assigning task:', error);
      toast({
        title: "Failed to assign task",
        description: error instanceof Error ? error.message : "Failed to assign task",
        variant: "destructive"
      });
    }
  }, [fetchTasks, toast]);

  // Release task (unclaim)
  const releaseTask = useCallback(async (taskId: string) => {
    try {
      const { error } = await supabase
        .from('sprint_tasks')
        .update({
          status: 'pending',
          assignee_id: null,
          claimed_at: null,
          started_at: null,
          progress_percent: 0
        })
        .eq('id', taskId);

      if (error) throw error;

      await fetchTasks();
      
      toast({
        title: "Task released",
        description: "Task is now available for claiming",
      });
    } catch (error) {
      console.error('Error releasing task:', error);
      toast({
        title: "Failed to release task",
        description: error instanceof Error ? error.message : "Failed to release task",
        variant: "destructive"
      });
    }
  }, [fetchTasks, toast]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  // Filter helpers
  const getTasksByStatus = useCallback((status: string) => {
    return tasks.filter(task => task.status === status);
  }, [tasks]);

  const getMyTasks = useCallback(async () => {
    const user = await supabase.auth.getUser();
    if (!user.data.user) return [];
    return tasks.filter(task => task.assignee_id === user.data.user.id);
  }, [tasks]);

  return {
    tasks,
    loading,
    claiming,
    claimTask,
    updateTaskProgress,
    assignTask,
    releaseTask,
    fetchTasks,
    getTasksByStatus,
    getMyTasks
  };
}