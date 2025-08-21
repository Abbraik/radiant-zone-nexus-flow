export type RiskChannel =
  | "Heat" | "ExternalDemand" | "SupplyChain" | "Cyber" | "Epidemic"
  | "FXCommodity" | "Drought" | "EnergyReliability" | "WaterStress" | "LocalPrices";

export type WatchboardCard = {
  riskChannel: RiskChannel;
  ewsProb: number;          // 0..1
  trend?: "up" | "down" | "flat";
  leadTimeDays?: number;
  linkedLoops: string[];    // loop codes
  bufferAdequacy?: number | null; // 0..1 or null
};

export type ScenarioChip = {
  id: string;
  name: string;
  summary: string;
};

export type PrePositionPack = {
  id: string;
  title: string;                 // e.g., "Resource Pack"
  items: Array<{label: string; note?: string}>;
  status?: "draft" | "armed";
};

export type TriggerTemplate = {
  id: string;
  name: string;
  condition: string;             // human-readable
  thresholdLabel?: string;       // e.g., "REER ≥ 8% and orders ≤ −20%"
  windowLabel?: string;          // e.g., "7 days window"
  authorityHint?: string;        // e.g., "Treasury + Trade"
  ttlHint?: string;              // e.g., "Valid 30 days"
};

export type AnticipatoryUiProps = {
  loopCode: string;
  indicator?: string;

  // Header/meta
  ewsProb?: number;              // 0..1
  leadTimeDays?: number;
  bufferAdequacy?: number | null;
  consentRequired?: boolean;

  // Screen selection
  screen?: "risk-watchboard" | "scenario-sim" | "pre-positioner" | "trigger-library";

  // Content for each screen
  watchboard: WatchboardCard[];
  scenarios: ScenarioChip[];
  prePositionPacks: PrePositionPack[];
  triggerTemplates: TriggerTemplate[];

  // Handlers (wired by app shell later)
  onArmWatchpoint?: (riskChannel: RiskChannel) => void;
  onRunScenario?: (scenarioId: string) => void;
  onStagePrePosition?: (packIds: string[]) => void;
  onSaveTrigger?: (templateId: string) => void;

  // Handoffs
  handoff: {
    enableResponsive: boolean;
    enableDeliberative: boolean;
    enableStructural: boolean;
    onHandoff?: (to: "responsive"|"deliberative"|"structural") => void;
  };

  // Instrumentation hooks (optional, UI-only)
  onEvent?: (name: string, payload?: Record<string, any>) => void;

  // Loading & error states (UI only)
  busy?: boolean;
  errorText?: string;
};