export type LangMode = "general" | "expert";

export type TermKey =
  | "TENSION" | "BAND_BREACH" | "GUARDRAIL" | "OSCILLATION" | "ACTUATION"
  | "NRW" | "DEMAND_SURGE" | "CHECKPOINT" | "TRI" | "SRT";

export type TermDict = Record<TermKey, {
  label_general: string;
  label_expert: string;
  hint?: string; // short tooltip/explainer
}>;

// Default dictionary for Responsive capacity
export const responsiveDict: TermDict = {
  TENSION:       { label_general: "System strain",        label_expert: "Tension (error/strain)", hint: "How far the signal is from its target band." },
  BAND_BREACH:   { label_general: "Outside safe range",    label_expert: "Band breach",            hint: "Indicator is above/below the defined thresholds." },
  GUARDRAIL:     { label_general: "Safety limit",          label_expert: "Guardrail",              hint: "Caps, time-boxes, or rate limits to keep things safe." },
  OSCILLATION:   { label_general: "Back-and-forth swings", label_expert: "Oscillation",            hint: "Repeated overshoot/undershoot pattern." },
  ACTUATION:     { label_general: "Apply change",          label_expert: "Actuation",              hint: "Direct system adjustment (e.g., trigger a pack)." },
  NRW:           { label_general: "Water loss (NRW)",      label_expert: "Non-Revenue Water (NRW)",hint: "Share of water produced but not billed." },
  DEMAND_SURGE:  { label_general: "Demand spike",          label_expert: "Demand surge",           hint: "Short-term increase in usage or need." },
  CHECKPOINT:    { label_general: "Scheduled check",       label_expert: "Checkpoint",             hint: "Time-bound review of results." },
  TRI:           { label_general: "Trust–Reciprocity–Integrity", label_expert: "TRI",              hint: "Legitimacy compass, tracked over time." },
  SRT:           { label_general: "Short response time",   label_expert: "SRT",                    hint: "Time window to sense→act→review." },
};