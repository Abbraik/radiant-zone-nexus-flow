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
  // Task Management - Using mock data for demo
  async createTask(data: {
    title: string;
    description?: string;
    priority: TaskPriority;
    template_id?: string;
    context?: Record<string, any>;
    due_date?: string;
    estimated_duration?: number;
  }): Promise<TaskV2> {
    // Mock implementation
    const newTask: TaskV2 = {
      id: `task-${Date.now()}`,
      title: data.title,
      description: data.description,
      status: 'draft',
      priority: data.priority,
      context: data.context || {},
      estimated_duration: data.estimated_duration,
      due_date: data.due_date,
      created_by: 'current-user',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    // Store in localStorage for demo
    const existingTasks = this.getStoredTasks();
    existingTasks.push(newTask);
    localStorage.setItem('mockTasks', JSON.stringify(existingTasks));
    
    return newTask;
  }

  private getStoredTasks(): TaskV2[] {
    const stored = localStorage.getItem('mockTasks');
    return stored ? JSON.parse(stored) : [];
  }

  async getTasks(filters?: {
    status?: TaskStatus[];
    priority?: TaskPriority[];
    assigned_to?: string;
    created_by?: string;
    limit?: number;
  }): Promise<TaskV2[]> {
    // Mock implementation using localStorage
    let tasks = this.getStoredTasks();
    
    // Add some default tasks if empty
    if (tasks.length === 0) {
      tasks = [
        {
          id: 'task-1',
          title: 'Sample Task 1 - High Priority Analysis',
          description: 'Complete analysis of system performance metrics',
          status: 'active',
          priority: 'high',
          context: { category: 'analysis' },
          estimated_duration: 120,
          due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
          created_by: 'user-1',
          created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'task-2',
          title: 'Sample Task 2 - Code Review',
          description: 'Review pull request for task engine implementation',
          status: 'draft',
          priority: 'medium',
          context: { category: 'review', pr_number: 123 },
          estimated_duration: 60,
          created_by: 'user-1',
          created_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString()
        },
        {
          id: 'task-3',
          title: 'Sample Task 3 - Database Migration',
          description: 'Execute database schema updates for new features',
          status: 'completed',
          priority: 'critical',
          context: { category: 'deployment' },
          estimated_duration: 90,
          actual_duration: 85,
          completed_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
          created_by: 'user-2',
          created_at: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString(),
          updated_at: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString()
        }
      ];
      localStorage.setItem('mockTasks', JSON.stringify(tasks));
    }

    // Apply filters
    if (filters?.status) {
      tasks = tasks.filter(task => filters.status!.includes(task.status));
    }
    if (filters?.priority) {
      tasks = tasks.filter(task => filters.priority!.includes(task.priority));
    }
    if (filters?.created_by) {
      tasks = tasks.filter(task => task.created_by === filters.created_by);
    }
    if (filters?.limit) {
      tasks = tasks.slice(0, filters.limit);
    }

    return tasks.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  async getTask(taskId: string): Promise<TaskV2 | null> {
    const tasks = this.getStoredTasks();
    return tasks.find(task => task.id === taskId) || null;
  }

  async updateTaskStatus(taskId: string, status: TaskStatus, context?: Record<string, any>): Promise<void> {
    const tasks = this.getStoredTasks();
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    
    if (taskIndex === -1) throw new Error('Task not found');
    
    // Update task status
    tasks[taskIndex] = {
      ...tasks[taskIndex],
      status,
      updated_at: new Date().toISOString(),
      ...(status === 'completed' && {
        completed_at: new Date().toISOString(),
        actual_duration: tasks[taskIndex].estimated_duration // Mock duration
      })
    };
    
    localStorage.setItem('mockTasks', JSON.stringify(tasks));
  }

  // Task Assignments - Mock implementation
  async assignTask(taskId: string, userId: string, role: string = 'assignee'): Promise<TaskAssignment> {
    const assignment: TaskAssignment = {
      id: `assignment-${Date.now()}`,
      task_id: taskId,
      user_id: userId,
      role,
      assigned_at: new Date().toISOString(),
      assigned_by: 'current-user'
    };
    
    // Store in localStorage
    const assignments = this.getStoredAssignments();
    assignments.push(assignment);
    localStorage.setItem('mockAssignments', JSON.stringify(assignments));
    
    return assignment;
  }

  private getStoredAssignments(): TaskAssignment[] {
    const stored = localStorage.getItem('mockAssignments');
    return stored ? JSON.parse(stored) : [];
  }

  async getTaskAssignments(taskId: string): Promise<TaskAssignment[]> {
    const assignments = this.getStoredAssignments();
    return assignments.filter(assignment => assignment.task_id === taskId);
  }

  // Task Locking - Mock implementation  
  async acquireLock(taskId: string, duration: number = 30): Promise<TaskLock> {
    const lock: TaskLock = {
      id: `lock-${Date.now()}`,
      task_id: taskId,
      user_id: 'current-user',
      acquired_at: new Date().toISOString(),
      expires_at: new Date(Date.now() + duration * 60 * 1000).toISOString()
    };
    
    const locks = this.getStoredLocks();
    locks.push(lock);
    localStorage.setItem('mockLocks', JSON.stringify(locks));
    
    return lock;
  }

  private getStoredLocks(): TaskLock[] {
    const stored = localStorage.getItem('mockLocks');
    return stored ? JSON.parse(stored) : [];
  }

  async releaseLock(taskId: string): Promise<void> {
    const locks = this.getStoredLocks();
    const lockIndex = locks.findIndex(lock => lock.task_id === taskId && !lock.released_at);
    
    if (lockIndex !== -1) {
      locks[lockIndex].released_at = new Date().toISOString();
      localStorage.setItem('mockLocks', JSON.stringify(locks));
    }
  }

  // Task Events & History - Mock implementation
  async getTaskEvents(taskId: string): Promise<TaskEvent[]> {
    const events = this.getStoredEvents();
    return events.filter(event => event.task_id === taskId)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }

  private getStoredEvents(): TaskEvent[] {
    const stored = localStorage.getItem('mockEvents');
    if (stored) return JSON.parse(stored);
    
    // Default events for demo
    const defaultEvents: TaskEvent[] = [
      {
        id: 'event-1',
        task_id: 'task-1',
        event_type: 'created',
        details: { initial_priority: 'high' },
        created_by: 'user-1',
        created_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
      },
      {
        id: 'event-2', 
        task_id: 'task-1',
        event_type: 'started',
        details: {},
        created_by: 'user-1',
        created_at: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString()
      }
    ];
    localStorage.setItem('mockEvents', JSON.stringify(defaultEvents));
    return defaultEvents;
  }

  async createTaskEvent(taskId: string, eventType: TaskEventType, details?: Record<string, any>): Promise<TaskEvent> {
    const event: TaskEvent = {
      id: `event-${Date.now()}`,
      task_id: taskId,
      event_type: eventType,
      details: details || {},
      created_by: 'current-user',
      created_at: new Date().toISOString()
    };
    
    const events = this.getStoredEvents();
    events.push(event);
    localStorage.setItem('mockEvents', JSON.stringify(events));
    
    return event;
  }

  // Task Outputs - Mock implementation
  async publishOutput(taskId: string, outputType: string, content: Record<string, any>): Promise<TaskOutput> {
    const output: TaskOutput = {
      id: `output-${Date.now()}`,
      task_id: taskId,
      output_type: outputType,
      content,
      published_by: 'current-user',
      published_at: new Date().toISOString()
    };
    
    const outputs = this.getStoredOutputs();
    outputs.push(output);
    localStorage.setItem('mockOutputs', JSON.stringify(outputs));
    
    return output;
  }

  private getStoredOutputs(): TaskOutput[] {
    const stored = localStorage.getItem('mockOutputs');
    return stored ? JSON.parse(stored) : [];
  }

  async getTaskOutputs(taskId: string): Promise<TaskOutput[]> {
    const outputs = this.getStoredOutputs();
    return outputs.filter(output => output.task_id === taskId)
      .sort((a, b) => new Date(b.published_at).getTime() - new Date(a.published_at).getTime());
  }

  // Analytics & Summary - Mock implementation
  async getTaskSummary(): Promise<TaskSummary> {
    const tasks = this.getStoredTasks();
    
    const summary: TaskSummary = {
      total_tasks: tasks.length,
      by_status: {
        draft: tasks.filter(t => t.status === 'draft').length,
        active: tasks.filter(t => t.status === 'active').length,
        paused: tasks.filter(t => t.status === 'paused').length,
        completed: tasks.filter(t => t.status === 'completed').length,
        cancelled: tasks.filter(t => t.status === 'cancelled').length,
        failed: tasks.filter(t => t.status === 'failed').length
      },
      by_priority: {
        low: tasks.filter(t => t.priority === 'low').length,
        medium: tasks.filter(t => t.priority === 'medium').length,
        high: tasks.filter(t => t.priority === 'high').length,
        critical: tasks.filter(t => t.priority === 'critical').length
      },
      overdue_count: tasks.filter(t => 
        t.due_date && new Date(t.due_date) < new Date() && t.status !== 'completed'
      ).length,
      sla_breaches: 0, // Mock
      avg_completion_time: tasks
        .filter(t => t.actual_duration)
        .reduce((sum, t) => sum + (t.actual_duration || 0), 0) / 
        Math.max(1, tasks.filter(t => t.actual_duration).length)
    };
    
    return summary;
  }

  // Templates - Mock implementation
  async getTemplates(): Promise<TaskTemplate[]> {
    return [
      {
        id: 'template-1',
        name: 'Analysis Template',
        description: 'Standard template for analysis tasks',
        default_priority: 'medium',
        estimated_duration: 120,
        template_config: { category: 'analysis', checklist: ['Review data', 'Generate report'] },
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      },
      {
        id: 'template-2',
        name: 'Review Template', 
        description: 'Standard template for review tasks',
        default_priority: 'high',
        estimated_duration: 60,
        template_config: { category: 'review', checklist: ['Check code', 'Test functionality'] },
        created_by: 'system',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
    ];
  }
}

export const taskEngine = new TaskEngineService();