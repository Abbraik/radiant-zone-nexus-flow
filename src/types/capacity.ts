// Capacity-Mode Architecture Types

export type Capacity = 'responsive' | 'reflexive' | 'deliberative' | 'anticipatory' | 'structural';
export type LoopType = 'reactive' | 'structural' | 'perceptual';
export type Scale = 'micro' | 'meso' | 'macro';
export type Leverage = 'N' | 'P' | 'S';
export type TaskStatus = 'open' | 'claimed' | 'active' | 'done' | 'blocked';
export type ClaimStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'implemented';
export type MandateStatus = 'allowed' | 'restricted' | 'forbidden';

export interface TRIValues {
  T: number;
  R: number;
  I: number;
}

export interface EnhancedTask {
  id: string;
  title: string;
  description?: string;
  
  // New capacity-mode fields
  capacity: Capacity;
  loop_id: string;
  type: LoopType;
  scale: Scale;
  leverage: Leverage;
  tri?: TRIValues;
  de_band_id?: string;
  srt_id?: string;
  
  // Existing fields (for backward compatibility)
  zone?: never; // deprecated
  task_type?: string;
  priority: string;
  user_id: string;
  assigned_to?: string;
  status: TaskStatus;
  payload: any;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  locked_by?: string;
  locked_at?: string;
}

export interface Loop {
  id: string;
  name: string;
  description?: string;
  loop_type: LoopType;
  scale: Scale;
  leverage_default: Leverage;
  metadata: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface SharedNode {
  id: string;
  label: string;
  domain?: string;
  description?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface DEBand {
  id: string;
  loop_id: string;
  indicator: string;
  lower_bound?: number;
  upper_bound?: number;
  asymmetry?: number;
  notes?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface SRTWindow {
  id: string;
  loop_id: string;
  window_start: string;
  window_end: string;
  reflex_horizon: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TRIEvent {
  id: string;
  loop_id: string;
  task_id?: string;
  t_value: number;
  r_value: number;
  i_value: number;
  at: string;
  user_id: string;
  created_at: string;
}

export interface BandCrossing {
  id: string;
  loop_id: string;
  direction: 'upper' | 'lower' | 'return';
  value: number;
  at: string;
  user_id: string;
  created_at: string;
}

export interface Claim {
  id: string;
  task_id: string;
  loop_id: string;
  assignee: string;
  raci: any;
  leverage: Leverage;
  mandate_status: MandateStatus;
  evidence: any;
  sprint_id?: string;
  status: ClaimStatus;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Intervention {
  id: string;
  claim_id: string;
  label: string;
  description?: string;
  effort: number;
  impact: number;
  ordering: number;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface MandateRule {
  id: string;
  actor: string;
  allowed_levers: string[];
  restrictions: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface LoopScorecard {
  loop_id: string;
  last_tri: any;
  de_state: string;
  claim_velocity: number;
  fatigue: number;
  user_id: string;
  updated_at: string;
}

// Bundle Props for Capacity Components
export interface CapacityBundleProps {
  taskId: string;
  taskData: EnhancedTask;
  payload: any;
  onPayloadUpdate: (payload: any) => void;
  onValidationChange: (isValid: boolean, errors?: string[]) => void;
  readonly?: boolean;
}

export interface CapacityBundleDefinition {
  capacity: Capacity;
  taskTypes: LoopType[];
  component: React.ComponentType<CapacityBundleProps>;
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
