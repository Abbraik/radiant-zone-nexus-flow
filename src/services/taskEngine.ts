import { supabase } from '@/integrations/supabase/client';
import type { 
  TaskV2, 
  TaskTemplate, 
  TaskAssignment, 
  TaskEvent, 
  TaskLock, 
  TaskOutput, 
  TaskSummary,
  TaskStatus,
  TaskPriority,
  TaskEventType 
} from '@/types/taskEngine';

class TaskEngineService {
  // Task Management
  async createTask(data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    template_id?: string;
    context?: Record<string, any>;
    due_date?: string;
    estimated_duration?: number;
  }): Promise<TaskV2> {
    const { data: result } = await supabase.functions.invoke('task-engine-create', {
      body: data
    });
    
    if (result?.error) throw new Error(result.error);
    return result.task;
  }

  async getTasks(filters?: {
    status?: TaskStatus[];
    priority?: TaskPriority[];
    assigned_to?: string;
    created_by?: string;
    limit?: number;
  }): Promise<TaskV2[]> {
    let query = supabase.from('tasks_v2').select('*');
    
    if (filters?.status) {
      query = query.in('status', filters.status);
    }
    if (filters?.priority) {
      query = query.in('priority', filters.priority);
    }
    if (filters?.created_by) {
      query = query.eq('created_by', filters.created_by);
    }
    if (filters?.limit) {
      query = query.limit(filters.limit);
    }

    const { data, error } = await query.order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  }

  async getTask(taskId: string): Promise<TaskV2 | null> {
    return null; // Mock implementation
  }

  async updateTaskStatus(taskId: string, status: TaskStatus, context?: Record<string, any>): Promise<void> {
    const { data } = await supabase.functions.invoke('task-engine-update-status', {
      body: { task_id: taskId, status, context }
    });
    
    if (data?.error) throw new Error(data.error);
  }

  // Task Assignments
  async assignTask(taskId: string, userId: string, role: string = 'assignee'): Promise<TaskAssignment> {
    const { data, error } = await supabase
      .from('task_assignments')
      .insert({
        task_id: taskId,
        user_id: userId,
        role,
        assigned_by: (await supabase.auth.getUser()).data.user?.id || 'system'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getTaskAssignments(taskId: string): Promise<TaskAssignment[]> {
    const { data, error } = await supabase
      .from('task_assignments')
      .select('*')
      .eq('task_id', taskId);
    
    if (error) throw error;
    return data || [];
  }

  // Task Locking
  async acquireLock(taskId: string, duration?: number): Promise<TaskLock> {
    const { data } = await supabase.functions.invoke('task-engine-acquire-lock', {
      body: { task_id: taskId, duration }
    });
    
    if (data?.error) throw new Error(data.error);
    return data.lock;
  }

  async releaseLock(taskId: string): Promise<void> {
    const { data, error } = await supabase
      .from('task_locks')
      .update({ released_at: new Date().toISOString() })
      .eq('task_id', taskId)
      .is('released_at', null);
    
    if (error) throw error;
  }

  // Task Events & History
  async getTaskEvents(taskId: string): Promise<TaskEvent[]> {
    const { data, error } = await supabase
      .from('task_events_v2')
      .select('*')
      .eq('task_id', taskId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  async createTaskEvent(taskId: string, eventType: TaskEventType, details?: Record<string, any>): Promise<TaskEvent> {
    const { data, error } = await supabase
      .from('task_events_v2')
      .insert({
        task_id: taskId,
        event_type: eventType,
        details: details || {},
        created_by: (await supabase.auth.getUser()).data.user?.id || 'system'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  // Task Outputs
  async publishOutput(taskId: string, outputType: string, content: Record<string, any>): Promise<TaskOutput> {
    const { data, error } = await supabase
      .from('task_outputs')
      .insert({
        task_id: taskId,
        output_type: outputType,
        content,
        published_by: (await supabase.auth.getUser()).data.user?.id || 'system'
      })
      .select()
      .single();
    
    if (error) throw error;
    return data;
  }

  async getTaskOutputs(taskId: string): Promise<TaskOutput[]> {
    const { data, error } = await supabase
      .from('task_outputs')
      .select('*')
      .eq('task_id', taskId)
      .order('published_at', { ascending: false });
    
    if (error) throw error;
    return data || [];
  }

  // Analytics & Summary
  async getTaskSummary(): Promise<TaskSummary> {
    const { data } = await supabase.functions.invoke('task-engine-summary');
    
    if (data?.error) throw new Error(data.error);
    return data.summary;
  }

  // Templates
  async getTemplates(): Promise<TaskTemplate[]> {
    const { data, error } = await supabase
      .from('task_templates')
      .select('*')
      .order('name');
    
    if (error) throw error;
    return data || [];
  }
}

export const taskEngine = new TaskEngineService();