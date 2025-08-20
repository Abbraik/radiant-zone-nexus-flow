export type ControllerFamily = "P" | "PI" | "PID" | "MPC" | "RuleBased";

export type TuningChange = {
  id?: string;
  loopCode: string;
  indicator: string;
  before: { family: ControllerFamily; params: Record<string, number>; };
  after:  { family: ControllerFamily; params: Record<string, number>; };
  rationale: string;
  rmseDelta?: number;
  oscillationDelta?: number;
  effectiveFrom?: string; // ISO
};

export type BandWeightChange = {
  id?: string;
  loopCode: string;
  tier: "T1" | "T2" | "T3";
  anchor: string;                  // indicator/anchor name
  before: { lower: number; upper: number; weight?: number; };
  after:  { lower: number; upper: number; weight?: number; };
  rationale: string;
};

export type EvalDesign = {
  id?: string;
  loopCode: string;
  method: "ITS" | "DiD" | "AB";
  indicators: string[];
  startAt: string; // ISO
  reviewAt: string; // ISO
  notes?: string;
};

export type Experiment = {
  id?: string;
  loopCode: string;
  name: string;
  hypothesis: string;
  arms: Array<{ key: string; label: string; params: Record<string, any>; share?: number; }>;
  target: { population?: string; minSize?: number; };
  metrics: string[]; // indicator names
  startAt?: string; endAt?: string;
  status?: "draft" | "running" | "completed";
};

export type ReflexiveRecipe = {
  id: string;
  name: string;
  appliesTo: string[]; // loop codes or regex tokens
  actions: Array<
    | { kind: "switch_family"; to: ControllerFamily; }
    | { kind: "scale_gain"; param: string; factor: number; }
    | { kind: "set_param"; param: string; value: number; }
    | { kind: "reweight_tier"; tier: "T1"|"T2"|"T3"; weightDelta: number; }
    | { kind: "adjust_band"; anchor: string; lower?: number; upper?: number; }
  >;
  evaluation?: { method: "ITS"|"DiD"; reviewInDays: number; indicators: string[]; };
  rationaleHint?: string;
};