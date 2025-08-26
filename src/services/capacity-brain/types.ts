// Capacity Brain Types - Data contracts for deterministic activation decisions

export type Capacity = 'responsive' | 'reflexive' | 'deliberative' | 'anticipatory' | 'structural';

export interface LoopScores {
  loopId: string;
  window: '7d' | '14d' | '28d' | '90d';
  asOf: string; // ISO timestamp
  severity: number;          // e in [0..2]
  persistence: number;       // π in [0..1]
  dispersion: number;        // δ in [0..1]
  hubLoad: number;           // η in [0..1]
  legitimacyDelta: number;   // λ (negative = trust falling vs service)
  indicators: Array<{
    key: string;
    status: 'below' | 'in_band' | 'above';
    bandPos: number;         // continuous position
    smoothed?: number;
  }>;
}

export interface ActionSummary {
  capacity: Capacity;
  startedAt: string;
  endsAt?: string;
  reviewAt?: string;
  status: 'active' | 'completed' | 'cancelled';
}

export interface LoopActionReadiness {
  autoOk: boolean;
  reasons: string[]; // DQ/staleness/drift, etc.
}

export interface LadderHints {
  recentAction?: { 
    capacity: Capacity; 
    withinDays: number; 
    reviewDue: boolean; 
  };
  earlyWarning?: boolean; // from watchboard/triggers warming
  fairnessRisk?: boolean; // dispersion across cohorts/regions
  recurrenceFlag?: boolean; // repeated breaches in last N windows
}

export interface ActivationInput {
  now: string; // ISO timestamp
  scores: LoopScores;
  readiness: LoopActionReadiness;
  hints?: LadderHints;
}

export interface HandoffAction {
  to: Capacity;
  when: 'end_of_timebox' | 'review_due' | 'immediate';
  template?: string;
}

export interface ActivationDecision {
  loopId: string;
  capacity: Capacity | null;   // null if blocked
  reasonCodes: string[];       // machine-readable reasons
  humanRationale: string;      // 1–2 sentences
  confidence: number;          // 0..1
  openRoute: string;           // e.g., '/workspace-5c/responsive/checkpoint'
  preselectTemplate: string;   // e.g., 'containment_pack'
  handoffs?: HandoffAction[];
  blocked: boolean;
  blockReasons?: string[];
  fingerprint: string;         // for dedupe
}

// Database types
export interface ActivationEvent {
  event_id: string;
  loop_id: string;
  time_window: string;
  as_of: string;
  decision: ActivationDecision;
  fingerprint: string;
  created_by: string;
  created_at: string;
}

export interface ActivationOverride {
  override_id: string;
  event_id: string;
  actor: string;
  before: ActivationDecision;
  after: ActivationDecision;
  reason: string;
  approved_by?: string;
  created_at: string;
}

export interface TaskFingerprint {
  fp: string;
  task_id: string;
  loop_id: string;
  capacity: string;
  created_at: string;
}

// UI Types
export interface OverrideFormData {
  capacity: Capacity;
  reason: string;
  approver?: string;
}

export interface TaskCreationResult {
  task_id: string;
  fingerprint: string;
  is_existing: boolean;
  route: string;
  template: string;
}

// i18n reason mappings
export interface ReasonMapping {
  code: string;
  general: string;
  expert: string;
}

export const REASON_MAPPINGS: ReasonMapping[] = [
  { code: 'DQ_BLOCK', general: 'Data check needed', expert: 'Data quality insufficient for automation' },
  { code: 'SEVERITY_HIGH', general: 'Immediate action needed', expert: 'Severity exceeds threshold (≥1.0)' },
  { code: 'PERSISTENCE_MID', general: 'Ongoing concern', expert: 'Persistence indicates sustained breach' },
  { code: 'LEGITIMACY_DIVERGENCE', general: 'Trust concerns', expert: 'Service-trust congruence gap detected' },
  { code: 'FAIRNESS_RISK', general: 'Equity review needed', expert: 'Cross-cohort dispersion flags fairness risk' },
  { code: 'PERSISTENT', general: 'Pattern detected', expert: 'Persistence score indicates systemic issue' },
  { code: 'HUB_SATURATION', general: 'Hub overload', expert: 'SNL hub saturation exceeds threshold' },
  { code: 'EARLY_WARNING', general: 'Risk developing', expert: 'EWS probability indicates emerging risk' },
  { code: 'REVIEW_DUE', general: 'Review needed', expert: 'Post-action review cycle due' },
  { code: 'RECENT_ACTION', general: 'Follow-up needed', expert: 'Recent action requires reflection phase' },
];