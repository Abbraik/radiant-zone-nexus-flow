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

export const reflexiveTerms: Dictionary = {
  "concept.reflex_cycle": {
    key: "concept.reflex_cycle",
    labels: { general: "Review cycle", expert: "Reflex cycle" },
    explain: {
      general: "A regular check after a change to see what actually happened.",
      expert: "Post-adoption review cadence to assess effect and retune controllers."
    }
  },
  "concept.post_adoption": {
    key: "concept.post_adoption",
    labels: { general: "After rollout review", expert: "Post-adoption analysis" }
  },
  "concept.controller": {
    key: "concept.controller",
    labels: { general: "Automatic adjustment", expert: "Controller (gain/latency)" },
    explain: { general: "A setting that auto-adjusts how strong/fast changes happen." }
  },
  "concept.band_tuning": {
    key: "concept.band_tuning",
    labels: { general: "Safe range tuning", expert: "DE-band retuning" }
  },
  "concept.guardrail_audit": {
    key: "concept.guardrail_audit",
    labels: { general: "Safety limit audit", expert: "Guardrail renewal audit (META-L05)" }
  },
  "concept.its": {
    key: "concept.its",
    labels: { general: "Before/after trend check", expert: "Interrupted Time Series (ITS)" }
  },
  "concept.did": {
    key: "concept.did",
    labels: { general: "Compare with similar group", expert: "Difference-in-Differences (DiD)" }
  },
  "concept.effect_size": {
    key: "concept.effect_size",
    labels: { general: "Change caused by action", expert: "Effect size" }
  },
  "concept.confidence": {
    key: "concept.confidence",
    labels: { general: "Confidence", expert: "Confidence (statistical)" }
  },
  "concept.lag": {
    key: "concept.lag",
    labels: { general: "Delay to impact", expert: "Lag" }
  },
  "metric.band_hits": {
    key: "metric.band_hits",
    labels: { general: "Times outside range", expert: "Band hits" }
  },
  "metric.renewal_rate": {
    key: "metric.renewal_rate",
    labels: { general: "Safety renewals", expert: "Guardrail renewal rate" }
  },
  "metric.effect": {
    key: "metric.effect",
    labels: { general: "Estimated impact", expert: "Estimated effect" }
  },
  "metric.uplift": {
    key: "metric.uplift",
    labels: { general: "Improvement vs baseline", expert: "Uplift vs counterfactual" }
  }
};