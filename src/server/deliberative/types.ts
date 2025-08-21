export type UUID = string;
export type SessionStatus = "draft" | "in_review" | "resolved" | "archived";

export interface DeliberativeSession {
  id: UUID;
  org_id: UUID;
  loop_code: string;
  mission?: string;
  status: SessionStatus;
  activation_vector?: any;
  created_by: UUID;
  created_at: string;
  updated_at: string;
}

export interface DeliberativeCriterion {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  label: string;
  description?: string;
  weight: number;
  direction: "maximize" | "minimize";
  scale_hint?: string;
  order_index: number;
  created_at: string;
}

export interface DeliberativeOption {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  name: string;
  synopsis?: string;
  tags?: string[];
  costs?: any;
  latency_days?: number;
  authority_flag?: "ok" | "review" | "blocked";
  equity_note?: string;
  created_at: string;
}

export interface DeliberativeScore {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  option_id: UUID;
  criterion_id: UUID;
  score: number;
  evidence_refs?: string[];
}

export interface DeliberativeScenario {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  antic_scenario_id?: string;
  name: string;
  summary?: string;
  created_at: string;
}

export interface DeliberativeFrontierPoint {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  label?: string;
  option_ids: UUID[];
  risk: number;
  cost: number;
  equity: number;
  regret_worst?: number;
  feasible: boolean;
  created_at: string;
}

export interface DeliberativeDossier {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  version: string;
  title: string;
  decision_summary: string;
  selected_option_ids: UUID[];
  rejected_option_ids: UUID[];
  tradeoff_notes?: string;
  robustness_notes?: string;
  guardrails?: any;
  mandate_path?: any;
  participation_plan?: any;
  handoffs: string[];
  published_by: UUID;
  published_at: string;
}

export interface MCDATotal {
  optionId: UUID;
  total: number;
}