export type RiskChannel =
  | "Heat" | "ExternalDemand" | "SupplyChain" | "Cyber" | "Epidemic"
  | "FXCommodity" | "Drought" | "EnergyReliability" | "WaterStress" | "LocalPrices";

export type WatchboardCard = {
  riskChannel: RiskChannel;
  ewsProb: number;                // 0..1
  trend?: "up" | "down" | "flat";
  leadTimeDays?: number;
  linkedLoops: string[];
  bufferAdequacy?: number | null; // 0..1 or null
  series?: TimePoint[];           // sparkline
};

export type TimePoint = { t: string; v: number }; // ISO time + value

export type EwsComponent = { label: string; weight: number; series: TimePoint[] }; // composition stack

export type BufferGauge = { label: string; current: number; target: number; history?: TimePoint[] };

export type GeoCell = { id: string; label?: string; value: number; }; // normalized 0..1 for heatmap

export type ScenarioChip = { id: string; name: string; summary: string };

export type ProjectionBand = {
  label: "without" | "with";
  series: Array<{ t: string; mean: number; p10?: number; p90?: number }>;
};

export type WaterfallItem = { label: string; delta: number }; // +/− contribution

export type SensitivityItem = { factor: string; impact: number }; // tornado chart item

export type PrePositionPack = {
  id: string;
  title: string;                       // "Resource Pack", "Regulatory", "Comms"
  items: Array<{label: string; note?: string}>;
  status?: "draft" | "armed";
  costCeiling?: number;                // display only
  readinessScore?: number;             // 0..1
  shelfLifeDays?: number;
};

export type TimelineSpan = { id: string; label: string; start: string; end: string; status?: "draft"|"armed"|"expired" };

export type TriggerTemplate = {
  id: string;
  name: string;
  condition: string;                   // human-readable
  thresholdLabel?: string;
  windowLabel?: string;
  authorityHint?: string;
  ttlHint?: string;
};

export type BacktestPoint = { t: string; fired: 0|1; breach: 0|1; score?: number };

export type AnticipatoryUiProps = {
  loopCode: string;
  indicator?: string;

  // Header/meta
  ewsProb?: number;              // 0..1
  leadTimeDays?: number;
  bufferAdequacy?: number | null;
  consentRequired?: boolean;

  // Screen selection
  screen?: "risk-watchboard" | "scenario-sim" | "pre-positioner" | "trigger-library" | "runtime";

  // Risk Watchboard
  watchboard: WatchboardCard[];
  ewsComposition: EwsComponent[];
  buffers: BufferGauge[];
  geoGrid?: GeoCell[];  // optional

  // Scenario Simulator
  scenarios: ScenarioChip[];
  projectionBands?: ProjectionBand[];
  waterfall?: WaterfallItem[];
  sensitivity?: SensitivityItem[];

  // Pre-Positioner
  prePositionPacks: PrePositionPack[];
  shelfLifeTimeline?: TimelineSpan[];
  frontierPoints?: Array<{ cost: number; risk: number; label?: string }>;

  // Trigger Library
  triggerTemplates: TriggerTemplate[];
  backtest?: BacktestPoint[];

  // Handlers (UI -> host app)
  onArmWatchpoint?: (riskChannel: RiskChannel) => void;
  onRunScenario?: (scenarioId: string) => void;
  onStagePrePosition?: (packIds: string[]) => void;
  onSaveTrigger?: (templateId: string) => void;
  onBuildTrigger?: (expr: string) => void; // expression builder output
  onExportChart?: (id: string) => void;

  // Handoffs
  handoff: {
    enableResponsive: boolean;
    enableDeliberative: boolean;
    enableStructural: boolean;
    onHandoff?: (to: "responsive"|"deliberative"|"structural") => void;
  };

  // Telemetry hooks (UI-only)
  onEvent?: (name: string, payload?: Record<string, any>) => void;

  // UI state
  busy?: boolean;
  errorText?: string;
};