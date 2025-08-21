export type LangMode = "general" | "expert";

export type TermKey =
  | "ANTICIPATORY_CAPACITY" | "EARLY_WARNING" | "RISK_CHANNEL" | "WATCHBOARD" | "BUFFER"
  | "LEAD_TIME" | "PROBABILITY" | "SCENARIO" | "PROJECTION" | "WATERFALL"
  | "SENSITIVITY" | "PRE_POSITION" | "TRIGGER" | "BACKTEST" | "THRESHOLD"
  | "EWS_COMPOSITION" | "GEO_GRID" | "TIMELINE_SPAN" | "READINESS_SCORE" | "SHELF_LIFE";

export type TermDict = Record<TermKey, {
  label_general: string;
  label_expert: string;
  hint?: string;
}>;

export const anticipatoryDict: TermDict = {
  // Core concepts
  ANTICIPATORY_CAPACITY: { label_general: "Early warning",                 label_expert: "Anticipatory capacity" },
  EARLY_WARNING:         { label_general: "Advance notice",                label_expert: "Early warning system" },
  RISK_CHANNEL:          { label_general: "Problem area",                  label_expert: "Risk channel" },
  WATCHBOARD:            { label_general: "Monitoring dashboard",          label_expert: "Risk watchboard" },
  BUFFER:                { label_general: "Safety reserve",                label_expert: "Buffer adequacy" },
  
  // Timing and probability
  LEAD_TIME:             { label_general: "Warning time",                  label_expert: "Lead time" },
  PROBABILITY:           { label_general: "Chance of happening",           label_expert: "EWS probability" },
  SCENARIO:              { label_general: "What-if situation",             label_expert: "Scenario simulation" },
  PROJECTION:            { label_general: "Future forecast",               label_expert: "Projection bands" },
  WATERFALL:             { label_general: "Contributing factors",          label_expert: "Waterfall analysis" },
  
  // Analysis tools
  SENSITIVITY:           { label_general: "Impact of changes",             label_expert: "Sensitivity analysis" },
  PRE_POSITION:          { label_general: "Getting ready in advance",      label_expert: "Pre-positioning" },
  TRIGGER:               { label_general: "Activation condition",          label_expert: "Trigger template" },
  BACKTEST:              { label_general: "Historical testing",            label_expert: "Backtest analysis" },
  THRESHOLD:             { label_general: "Warning level",                 label_expert: "Threshold breach" },
  
  // System components
  EWS_COMPOSITION:       { label_general: "Warning system parts",          label_expert: "EWS composition" },
  GEO_GRID:              { label_general: "Location map",                  label_expert: "Geographic grid" },
  TIMELINE_SPAN:         { label_general: "Time periods",                  label_expert: "Timeline spans" },
  READINESS_SCORE:       { label_general: "Preparation level",             label_expert: "Readiness score" },
  SHELF_LIFE:            { label_general: "How long preparations last",    label_expert: "Shelf life" }
};