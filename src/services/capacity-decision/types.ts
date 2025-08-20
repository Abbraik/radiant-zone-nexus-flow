export type Capacity =
  | "responsive"
  | "reflexive"
  | "deliberative"
  | "anticipatory"
  | "structural";

export type Leverage = "N" | "P" | "S";

export type ConsentGate = {
  legitimacyGap: number;       // 0..1
  requireDeliberative: boolean;
  notes?: string;
};

export type Guardrails = {
  caps?: string[];             // e.g., ["price_cap_5%", "timebox_14d"]
  timeboxDays?: number;        // default 14 for responsive
  coolDownMs?: number;         // to avoid screen thrash
  lifeSafety?: boolean;        // override cooldown when true
};

export type SRT = {
  horizon: string;   // ISO 8601 period: P7D, P30D, etc.
  cadence: "15min" | "hourly" | "daily" | "weekly" | "bi-weekly" | "monthly" | "quarterly" | "semiannual" | "annual";
};

export type SignalReading = {
  loopCode: string;            // e.g., "MES-L01"
  indicator: string;           // indicator name
  value: number;               // current value
  lower?: number | null;       // DE band lower
  upper?: number | null;       // DE band upper
  unit?: string;
  slope?: number | null;       // first derivative (per cadence)
  persistencePk?: number | null; // % periods breached in window
  integralError?: number | null; // cumulative band deviation
  oscillation?: number | null;   // 0..1 ringing score
  dispersion?: number | null;    // 0..1 cross-tier dispersion
  hubSaturation?: number | null; // 0..1 hub load
  ewsProb?: number | null;       // 0..1 early-warning probability
  bufferAdequacy?: number | null;// days or normalized 0..1
  dataPenalty?: number | null;   // 0..1 quality penalty
  legitimacyGap?: number | null; // 0..1 consent/legitimacy gap
  rmseRel?: number | null;       // relative RMSE vs expectation
  guardrailViolation?: boolean | null;
  timestamp?: string;           // ISO time
};

export type CapacityScores = Record<Capacity, number>; // 0..100

export type CapacityAction = {
  capacity: Capacity;
  order: number;
  sprintLevel: Leverage; // N, P, or S
  actions: string[];     // human-readable action names
};

export type DecisionResult = {
  loopCode: string;
  indicator: string;
  severity: number;         // 0..1 distance from band
  scores: CapacityScores;
  order: Capacity[];        // capacities sorted by score desc
  primary: Capacity;
  secondary?: Capacity;
  srt: SRT;
  guardrails: Guardrails;
  consent: ConsentGate;
  templateActions: CapacityAction[];
  nearTieDelta?: number;    // small diff between primary & secondary
  decisionId: string;       // stable hash for idempotency
};