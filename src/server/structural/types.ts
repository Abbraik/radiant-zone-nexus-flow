export type UUID = string;
export type StructSessionStatus = "draft"|"in_review"|"resolved"|"archived";

export interface StructuralSession {
  id: UUID;
  org_id: UUID;
  loop_code: string;
  mission?: string;
  status: StructSessionStatus;
  created_by: UUID;
  created_at: string;
  updated_at: string;
}

export interface AuthoritySource {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  label: string;
  type: "statute" | "regulation" | "order" | "moa" | "budget_rule";
  status: "exists" | "draft" | "needed";
  note?: string;
  link?: string;
}

export interface BudgetEnvelope {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  label: string;
  currency: string;
  amount: number;
  window_from?: string;
  window_to?: string;
  status: "available" | "constrained" | "blocked";
  note?: string;
}

export interface DelegationNode {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  label: string;
  kind: "ministry" | "agency" | "council" | "zcu" | "elu" | "pmu";
  role?: "owner" | "controller" | "operator" | "auditor";
}

export interface DelegationEdge {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  from_node: UUID;
  to_node: UUID;
  permission: "decide" | "approve" | "coordinate" | "data_access" | "budget";
  note?: string;
}

export interface MandateCheck {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  label: string;
  status: "ok" | "risk" | "fail";
  note?: string;
}

export interface StandardSpec {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  name: string;
  kind: "schema" | "api" | "mrv" | "procurement";
  version: string;
  status: "draft" | "proposed" | "adopted" | "deprecated";
  owner_node_id?: UUID;
  summary?: string;
}

export interface ConformanceCheck {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  standard_id: UUID;
  actor_id: UUID;
  status: "pass" | "warn" | "fail";
  last_run?: string;
  note?: string;
}

export interface StructuralDossier {
  id: UUID;
  org_id: UUID;
  session_id: UUID;
  version: string;
  title: string;
  rationale: string;
  lever_summary: string;
  adoption_plan: string;
  mandate_path: any; // jsonb
  mesh_summary: string;
  process_summary: string;
  standards_snapshot: any; // jsonb
  market_snapshot: any; // jsonb
  attachments?: any; // jsonb
  published_by: UUID;
  published_at: string;
}