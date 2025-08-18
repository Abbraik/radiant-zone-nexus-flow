export type Zone = 'THINK' | 'ACT' | 'MONITOR' | 'INNOVATE';
export type TaskType = 'loop_design' | 'sprint_planning' | 'breach_response' | 'experiment_design' | 'general';

export interface ZoneBundleProps {
  taskId: string;
  taskData: any;
  payload: any;
  onPayloadUpdate: (payload: any) => void;
  onValidationChange: (isValid: boolean, errors?: string[]) => void;
  readonly?: boolean;
}

export interface ZoneBundleDefinition {
  zone: Zone;
  taskTypes: TaskType[];
  component: React.ComponentType<ZoneBundleProps>;
  validationRules: ValidationRule[];
  checklistItems: ChecklistItem[];
}

export interface ValidationRule {
  key: string;
  message: string;
  validator: (payload: any) => boolean;
  required: boolean;
}

export interface ChecklistItem {
  id: string;
  label: string;
  required: boolean;
  order: number;
  validator?: (payload: any) => boolean;
}

export interface TaskLock {
  id: string;
  task_id: string;
  locked_by: string;
  locked_at: string;
  expires_at: string;
}

export interface TaskEvent {
  id: string;
  task_id: string;
  event_type: string;
  at: string;
  actor: string;
  details: any;
}

export interface TaskArtifact {
  id: string;
  task_id: string;
  kind: string;
  ref_id?: string;
  title: string;
  url?: string;
  meta: any;
  created_at: string;
  updated_at: string;
}

export interface TaskChecklistItem {
  id: string;
  task_id: string;
  label: string;
  required: boolean;
  done: boolean;
  order_index: number;
  created_at: string;
  updated_at: string;
}

export interface EnhancedTask {
  id: string;
  title: string;
  description?: string;
  zone: Zone;
  task_type: TaskType;
  status: string;
  priority: string;
  user_id: string;
  assigned_to?: string;
  due_date?: string;
  payload: any;
  locked_by?: string;
  locked_at?: string;
  created_at: string;
  updated_at: string;
  // Relations
  checklist_items?: TaskChecklistItem[];
  artifacts?: TaskArtifact[];
  events?: TaskEvent[];
  lock?: TaskLock;
}