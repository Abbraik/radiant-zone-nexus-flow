// Workspace 5C Types - Isolated from legacy workspace
export type Capacity5C = 'responsive' | 'reflexive' | 'deliberative' | 'anticipatory' | 'structural';
export type LoopType5C = 'reactive' | 'structural' | 'perceptual';
export type Scale5C = 'micro' | 'meso' | 'macro';
export type Leverage5C = 'N' | 'P' | 'S';
export type MandateStatus5C = 'allowed' | 'warning_required' | 'blocked';
export type ClaimStatus5C = 'draft' | 'active' | 'paused' | 'done' | 'blocked';

export interface EnhancedTask5C {
  id: string;
  capacity: Capacity5C;
  loop_id: string;
  type: LoopType5C;
  scale: Scale5C;
  leverage: Leverage5C;
  tri?: { t_value: number; r_value: number; i_value: number };
  de_band_id?: string;
  srt_id?: string;
  assigned_to?: string;
  status: 'open' | 'claimed' | 'active' | 'done' | 'blocked';
  title: string;
  description?: string;
  payload: any;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface Claim5C {
  id: string;
  task_id: string;
  loop_id: string;
  assignee: string;
  raci: Record<string, any>;
  leverage: Leverage5C;
  mandate_status: MandateStatus5C;
  evidence: Record<string, any>;
  sprint_id?: string;
  status: ClaimStatus5C;
  started_at?: string;
  finished_at?: string;
  paused_at?: string;
  pause_reason?: string;
  last_checkpoint_at?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

export interface TRIEvent5C {
  id: string;
  loop_id: string;
  task_id?: string;
  t_value: number;
  r_value: number;
  i_value: number;
  tag: string;
  user_id: string;
  at: string;
  created_at: string;
}

export interface DEBand5C {
  id: string;
  loop_id: string;
  indicator: string;
  lower_bound?: number;
  upper_bound?: number;
  asymmetry: number;
  smoothing_alpha: number;
  notes?: string;
  user_id: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface SRTWindow5C {
  id: string;
  loop_id: string;
  window_start: string;
  window_end: string;
  reflex_horizon: string; // interval
  cadence: string; // interval
  user_id: string;
  updated_by?: string;
  created_at: string;
  updated_at: string;
}

export interface LoopScorecard5C {
  loop_id: string;
  last_tri: Record<string, any>;
  de_state: string;
  claim_velocity: number;
  fatigue: number;
  breach_days: number;
  tri_slope: number;
  heartbeat_at: string;
  user_id: string;
  updated_at: string;
}

export interface ReflexMemory5C {
  id: string;
  loop_id: string;
  actor: string;
  kind: string;
  before: Record<string, any>;
  after: Record<string, any>;
  rationale: string;
  attachments: any[];
  user_id: string;
  created_at: string;
}

export interface MandateRule5C {
  id: string;
  actor: string;
  allowed_levers: string[];
  restrictions: Record<string, any>;
  notes?: string;
  org_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
}

// Bundle-specific types
export interface BundleProps5C {
  task: EnhancedTask5C;
}

// Meta-Loop overlay types
export interface MetaLoopContext5C {
  current_capacity: Capacity5C;
  confidence: number;
  reasoning: string[];
  alternative_capacities: Array<{
    capacity: Capacity5C;
    confidence: number;
    reason: string;
  }>;
}

// Query key helpers
export const QUERY_KEYS_5C = {
  task: (id: string) => ['5c', 'task', id],
  tasks: (filters?: any) => ['5c', 'tasks', filters],
  claims: (taskId: string) => ['5c', 'claims', taskId],
  scorecard: (loopId: string) => ['5c', 'scorecard', loopId],
  triEvents: (loopId: string) => ['5c', 'tri-events', loopId],
  bands: (loopId: string) => ['5c', 'bands', loopId],
  srt: (loopId: string) => ['5c', 'srt', loopId],
  mandateRules: () => ['5c', 'mandate-rules'],
} as const;