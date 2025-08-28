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

  // Fetch tasks using existing tables
  const fetchTasks = useCallback(async () => {
    try {
      // Use existing sprint_tasks or fallback to mock data
      let formattedTasks: Task[] = [
        {
          id: '1',
          title: 'Monitor Heat Stress Indicators',
          description: 'Track temperature and heat index across affected regions',
          capacity: 'responsive',
          leverage: 'P',
          status: 'pending',
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          effort_hours: 8,
          progress_percent: 0,
          created_at: new Date().toISOString()
        },
        {
          id: '2',
          title: 'Activate Cooling Centers',
          description: 'Open emergency cooling centers in high-risk areas',
          capacity: 'responsive',
          leverage: 'S',
          status: 'pending',
          due_date: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
          effort_hours: 16,
          progress_percent: 0,
          created_at: new Date().toISOString()
        }
      ];
      
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
  const claimTask = useCallback(async (taskId: string): Promise<boolean> => {
    setClaiming(taskId);
    try {
      const user = await supabase.auth.getUser();
      if (!user.data.user) throw new Error('User not authenticated');

      // Update local state for now
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? { 
              ...task, 
              status: 'claimed' as const, 
              assignee_id: user.data.user.id,
              claimed_at: new Date().toISOString()
            }
          : task
      ));

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
  }, [toast]);

  // Update task progress
  const updateTaskProgress = useCallback(async (
    taskId: string, 
    progress: number, 
    status?: string,
    notes?: string
  ) => {
    try {
      setTasks(prev => prev.map(task => {
        if (task.id !== taskId) return task;
        
        const updatedTask = {
          ...task,
          progress_percent: progress,
          updated_at: new Date().toISOString()
        } as Task;

        if (status) {
          updatedTask.status = status as Task['status'];
          
          if (status === 'in_progress' && !task.started_at) {
            updatedTask.started_at = new Date().toISOString();
          }
          
          if (status === 'completed') {
            updatedTask.completed_at = new Date().toISOString();
            updatedTask.progress_percent = 100;
          }
        }

        return updatedTask;
      }));
      
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
  }, [toast]);

  // Assign task to user
  const assignTask = useCallback(async (taskId: string, userId: string) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? {
              ...task,
              assignee_id: userId,
              status: 'claimed' as const,
              claimed_at: new Date().toISOString()
            }
          : task
      ));
      
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
  }, [toast]);

  // Release task (unclaim)
  const releaseTask = useCallback(async (taskId: string) => {
    try {
      setTasks(prev => prev.map(task => 
        task.id === taskId 
          ? {
              ...task,
              status: 'pending' as const,
              assignee_id: undefined,
              claimed_at: undefined,
              started_at: undefined,
              progress_percent: 0
            }
          : task
      ));
      
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
  }, [toast]);

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