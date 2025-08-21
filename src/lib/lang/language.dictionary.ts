import type { Dictionary } from "./language.types";

/** Shared baseline terms used by Responsive; extensible across capacities. */
export const baseDictionary: Dictionary = {
  // Concepts
  "concept.safe_range": {
    key: "concept.safe_range",
    labels: { general: "Safe range", expert: "DE-band (indicator limits)" },
    explain: {
      general: "The healthy range for this indicator.",
      expert: "Configured upper/lower bounds used for band-breach logic."
    }
  },
  "concept.breach": {
    key: "concept.breach",
    labels: { general: "Outside range", expert: "Band breach" },
    explain: { general: "The value is outside its safe range." }
  },
  "concept.guardrail": {
    key: "concept.guardrail",
    labels: { general: "Safety limit", expert: "Guardrail (cap/time-box)" },
    explain: { general: "Auto-stop or cap to prevent harm." }
  },
  "concept.activation": {
    key: "concept.activation",
    labels: { general: "Apply change", expert: "Actuate policy lever" }
  },
  "concept.oscillation": {
    key: "concept.oscillation",
    labels: { general: "Back-and-forth swings", expert: "Oscillation" }
  },
  // Metrics (labels point to concept keys)
  "metric.breach_count": {
    key: "metric.breach_count",
    labels: { general: "Outside range (count)", expert: "Band breaches" }
  },
  "metric.response_time": {
    key: "metric.response_time",
    labels: { general: "Response time", expert: "Controller latency" }
  },
  "metric.rmse": {
    key: "metric.rmse",
    labels: { general: "Prediction error", expert: "RMSE" }
  },
  "metric.nrwpct": {
    key: "metric.nrwpct",
    labels: { general: "Water loss", expert: "Non-Revenue Water (NRW)" }
  },
};