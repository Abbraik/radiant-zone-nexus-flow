export type TaskStatus = 'draft' | 'active' | 'paused' | 'completed' | 'cancelled' | 'failed';
export type TaskPriority = 'low' | 'medium' | 'high' | 'critical';
export type TaskEventType = 
  | 'created' 
  | 'assigned' 
  | 'started' 
  | 'paused' 
  | 'resumed' 
  | 'completed' 
  | 'cancelled' 
  | 'failed'
  | 'reminder_sent'
  | 'sla_breach'
  | 'lock_acquired'
  | 'lock_released';

export interface TaskTemplate {
  id: string;
  name: string;
  description?: string;
  default_priority: TaskPriority;
  estimated_duration?: number;
  template_config: Record<string, any>;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TaskV2 {
  id: string;
  template_id?: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  context: Record<string, any>;
  estimated_duration?: number;
  actual_duration?: number;
  due_date?: string;
  completed_at?: string;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export interface TaskAssignment {
  id: string;
  task_id: string;
  user_id: string;
  role: string;
  assigned_at: string;
  assigned_by: string;
}

export interface TaskEvent {
  id: string;
  task_id: string;
  event_type: TaskEventType;
  details: Record<string, any>;
  created_by: string;
  created_at: string;
}

export interface TaskLock {
  id: string;
  task_id: string;
  user_id: string;
  acquired_at: string;
  expires_at?: string;
  released_at?: string;
}

export interface TaskOutput {
  id: string;
  task_id: string;
  output_type: string;
  content: Record<string, any>;
  published_by: string;
  published_at: string;
}

export interface TaskSummary {
  total_tasks: number;
  by_status: Record<TaskStatus, number>;
  by_priority: Record<TaskPriority, number>;
  overdue_count: number;
  sla_breaches: number;
  avg_completion_time?: number;
}