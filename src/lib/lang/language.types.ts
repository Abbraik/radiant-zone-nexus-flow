export type LanguageMode = "general" | "expert";

/** A term can have per-mode labels and an optional short explainer. */
export type TermDef = {
  key: string;
  labels: { general: string; expert: string };
  explain?: { general?: string; expert?: string }; // 1-liners
};

export type Dictionary = Record<string, TermDef>;

export type FormatHint =
  | { kind: "percent"; decimals?: number }
  | { kind: "days" }
  | { kind: "currency"; code?: string; decimals?: number }
  | { kind: "integer" }
  | { kind: "float"; decimals?: number };

export type MetricDef = {
  key: string;
  labelKeys: { general: string; expert: string }; // link to TermDef keys
  unit?: FormatHint;
  thresholds?: { lower?: number; upper?: number }; // for "within range" chips
};