export type Id = string;

/** Common */
export type Tag = string;
export type StatusTone = "ok" | "risk" | "fail" | "info";

/** ── Mandate Gate ───────────────────────────────────────────── */
export type AuthoritySource = {
  id: Id;
  label: string;                 // e.g., "Planning Act §12", "Executive Order 2025-03"
  type: "statute" | "regulation" | "order" | "moa" | "budget_rule";
  status: "exists" | "draft" | "needed";
  note?: string;
  link?: string;
};

export type BudgetEnvelope = {
  id: Id;
  label: string;                 // "Housing Capex Envelope"
  currency: string;
  amount: number;                // absolute
  window: { from: string; to: string }; // ISO
  status: "available" | "constrained" | "blocked";
  note?: string;
};

export type DelegationNode = {
  id: Id;
  label: string;                 // "Ministry of Housing"
  kind: "ministry" | "agency" | "council" | "zcu" | "elu" | "pmu";
  role?: "owner" | "controller" | "operator" | "auditor";
};

export type DelegationEdge = {
  id: Id;
  from: Id;
  to: Id;
  right: "decide" | "approve" | "coordinate" | "data_access" | "budget";
  note?: string;
};

export type MandateCheckUI = {
  id: Id;
  label: string;                 // "Statutory authority present"
  status: "ok" | "risk" | "fail";
  note?: string;
};

/** ── Mesh Planner (coordination) ───────────────────────────── */
export type MeshMetric = { label: string; value: number; unit?: string }; // e.g., betweenness, conflict tickets
export type MeshIssue = { id: Id; label: string; severity: "low"|"med"|"high"; loopRefs?: string[]; note?: string };

export type MeshPlannerModel = {
  nodes: DelegationNode[];
  edges: DelegationEdge[];
  metrics: MeshMetric[];         // precomputed SNA-like numbers
  issues: MeshIssue[];           // coordination conflicts/spillovers
};

/** ── Process Studio ─────────────────────────────────────────── */
export type ProcessGate = {
  id: Id;
  label: string;                 // "Stage: Approvals Screening"
  kind: "gate" | "review" | "sla" | "checkpoint";
  latencyDaysTarget?: number;
  varianceTargetPct?: number;
  triageRule?: string;           // free text for now
};
export type RaciEntry = {
  id: Id;
  stepId: Id;                    // link to ProcessGate
  actorId: Id;                   // link to DelegationNode
  role: "R"|"A"|"C"|"I";
};
export type SLA = {
  id: Id;
  stepId: Id;
  kpi: string;                   // "Time to gate decision"
  target: string;                // "≤ 10 days"
};

export type ProcessMap = {
  steps: ProcessGate[];
  raci: RaciEntry[];
  slas: SLA[];
  latencyDist?: Array<{ label: string; value: number }>; // chart: current latency histogram
  varianceSeries?: Array<{ t: string; v: number }>;      // time series
};

/** ── Standards & Interop Forge ─────────────────────────────── */
export type StandardSpec = {
  id: Id;
  name: string;                  // "Housing Approvals Schema v1"
  kind: "schema" | "api" | "mrv" | "procurement";
  version: string;
  status: "draft" | "proposed" | "adopted" | "deprecated";
  ownerNodeId?: Id;
  summary?: string;
};
export type ConformanceCheck = {
  id: Id;
  standardId: Id;
  actorId: Id;                   // who must conform
  status: "pass"|"warn"|"fail";
  lastRun?: string;
  note?: string;
};
export type StandardForgeModel = {
  standards: StandardSpec[];
  conformance: ConformanceCheck[];
};

/** ── Market Design Lab ─────────────────────────────────────── */
export type PermitClass = {
  id: Id;
  name: string;                  // "Water Reuse Permit"
  capRule?: string;              // "NRW ≤ 20%"
  priceRule?: string;            // "Time-varying congestion pricing"
  mrvStandardId?: Id;
};
export type PricingRule = {
  id: Id;
  label: string;                 // "Indexation: CPI-X"
  formula: string;               // free text for now
};
export type AuctionDesign = {
  id: Id;
  name: string;                  // "Approvals Slot Auction"
  mechanism: "uniform_price" | "pay_as_bid" | "vcg";
  lotSize?: string;
  reservePrice?: number;
};

export type MarketLabModel = {
  permits: PermitClass[];
  pricing: PricingRule[];
  auctions: AuctionDesign[];
  fairnessChart?: Array<{ label: string; value: number }>; // incidence by cohort/region
  elasticityChart?: Array<{ t: string; v: number }>;
};

/** ── Structural Dossier ────────────────────────────────────── */
export type StructuralDossier = {
  version: string;
  title: string;
  rationale: string;             // why structure change is needed
  leverSummary: string;          // selected levers (rights/standards/market/budget/process)
  adoptionPlan: string;          // rollout & conformance
  mandatePath: MandateCheckUI[];
  meshSummary: string;           // coordination rights & joint KPIs
  processSummary: string;        // stages, SLAs, RACI highlights
  standardsSnapshot: StandardSpec[];
  marketSnapshot: { permits: PermitClass[]; pricing: PricingRule[]; auctions: AuctionDesign[] };
  attachments?: Array<{ label: string; link?: string }>;
  updatedAt: string;
};

/** ── Structural Bundle Props ───────────────────────────────── */
export type StructuralUiProps = {
  loopCode: string;
  mission?: string;
  screen?: "mandate"|"mesh"|"process"|"standards"|"market"|"dossier";

  // Mandate Gate
  authorities: AuthoritySource[];
  budgets: BudgetEnvelope[];
  delegNodes: DelegationNode[];
  delegEdges: DelegationEdge[];
  mandateChecks: MandateCheckUI[];

  // Mesh Planner
  mesh: MeshPlannerModel;

  // Process Studio
  process: ProcessMap;

  // Standards & Interop Forge
  forge: StandardForgeModel;

  // Market Design Lab
  market: MarketLabModel;

  // Dossier
  dossier?: StructuralDossier;

  // Handlers
  onMandateCheckChange?: (id: Id, status: MandateCheckUI["status"], note?: string)=>void;
  onAddAuthority?: ()=>void;
  onAddBudget?: ()=>void;
  onDelegationEdit?: (edge: DelegationEdge)=>void;

  onMeshEdit?: (payload: Partial<MeshPlannerModel>)=>void;

  onProcessEdit?: (payload: Partial<ProcessMap>)=>void;
  onRaciEdit?: (entry: RaciEntry)=>void;

  onStandardEdit?: (spec: StandardSpec)=>void;
  onConformanceToggle?: (id: Id, status: ConformanceCheck["status"])=>void;

  onMarketEdit?: (payload: Partial<MarketLabModel>)=>void;

  onExportDossier?: ()=>void;
  onEvent?: (name: string, payload?: Record<string, any>)=>void;

  busy?: boolean;
  errorText?: string;
};