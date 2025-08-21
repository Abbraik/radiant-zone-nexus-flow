export type Id = string;

export type Criterion = {
  id: Id;
  label: string;
  description?: string;
  weight: number;     // 0..1, sum to 1 across all criteria
  direction: "maximize" | "minimize";
  scaleHint?: "0-1" | "percent" | "score";
};

export type OptionCandidate = {
  id: Id;
  name: string;
  synopsis?: string;
  tags?: string[];
  costs?: { capex?: number; opex?: number };
  latencyDays?: number;
  authorityFlag?: "ok"|"review"|"blocked";
  equityNote?: string;
};

export type ScoreCell = {
  optionId: Id;
  criterionId: Id;
  score: number;         // normalized 0..1
  evidenceRefs?: string[];
};

export type ScenarioOutcome = {
  scenarioId: Id;
  scenarioName: string;
  optionId: Id;
  outcomeScore: number;  // 0..1 effectiveness under scenario
  riskDelta?: number;    // +worse, -better
};

export type PortfolioPoint = {
  optionIds: Id[];
  label?: string;
  risk: number;        // 0..1
  cost: number;        // normalized 0..1 or absolute (UI prints both)
  equity: number;      // 0..1 inclusiveness/fairness composite
  regretWorst?: number; // 0..1
  feasible?: boolean;
};

export type Guardrail = {
  id: Id;
  label: string;
  kind: "cap" | "timebox" | "checkpoint";
  value?: string;       // e.g., "NRW <= 20%" or "90 days"
  required: boolean;
  selected?: boolean;
};

export type ParticipationStep = {
  id: Id;
  label: string;          // e.g., "City forum: Zones X/Y"
  date?: string;          // ISO
  audience?: string;
  status?: "planned"|"done"|"skipped";
};

export type MandateCheck = {
  id: Id;
  label: string;          // "Statutory authority exists", "Budget envelope"
  status: "ok"|"risk"|"fail";
  note?: string;
};

export type Dossier = {
  title: string;
  decisionSummary: string;
  selectedOptionIds: Id[];
  rejectedOptionIds: Id[];
  tradeOffNotes: string;
  robustnessNotes: string;
  participationPlan: ParticipationStep[];
  guardrails: Guardrail[];
  mandatePath: MandateCheck[];
  handoffs: Array<"responsive"|"structural"|"reflexive">;
  version: string;
  updatedAt: string;
};

export type EvidenceAttachment = {
  id: Id;
  label: string;
  link?: string;
  loopCodes?: string[];
  indicators?: string[];
};

export type DeliberativeUiProps = {
  loopCode: string;               // context loop (primary)
  mission?: string;               // short mission statement
  screen?: "intake"|"tradeoff"|"portfolio"|"mandate"|"dossier";

  // Intake
  options: OptionCandidate[];
  evidence: EvidenceAttachment[];
  scenarios: Array<{ id: Id; name: string; summary?: string }>;

  // Trade-off board
  criteria: Criterion[];
  scores: ScoreCell[];            // option x criterion
  scenarioOutcomes?: ScenarioOutcome[]; // optional layer
  mcdaTotal?: Array<{ optionId: Id; total: number }>; // computed by host or UI helper

  // Portfolio
  frontier?: PortfolioPoint[];    // candidate efficient points
  hardConstraints?: Array<{ id: Id; label: string; active: boolean }>;
  selectedPortfolio?: PortfolioPoint | null;

  // Mandate & Legitimacy
  mandateChecks: MandateCheck[];
  guardrails: Guardrail[];
  participation: ParticipationStep[];
  consentIndex?: number;          // 0..1

  // Dossier
  dossier?: Dossier;

  // Handlers
  onUploadEvidence?: (files: File[]) => void;
  onAddOption?: () => void; 
  onEditWeights?: (criteria: Criterion[]) => void;
  onScoreCell?: (cell: ScoreCell) => void;
  onSelectScenario?: (scenarioId: Id) => void;
  onPickPortfolio?: (point: PortfolioPoint) => void;
  onToggleConstraint?: (constraintId: Id) => void;
  onToggleGuardrail?: (guardrailId: Id, selected: boolean) => void;
  onSetParticipationStatus?: (stepId: Id, status: ParticipationStep["status"]) => void;
  onExportDossier?: () => void;
  onEvent?: (name: string, payload?: Record<string, any>) => void;

  // Handoffs
  handoff: {
    enableResponsive: boolean;
    enableStructural: boolean;
    enableReflexive: boolean;
    onHandoff?: (to: "responsive"|"structural"|"reflexive") => void;
  };

  // UI state
  busy?: boolean;
  errorText?: string;
};