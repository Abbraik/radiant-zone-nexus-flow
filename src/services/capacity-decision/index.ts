import type {
  Capacity, DecisionResult, SignalReading, CapacityScores, ConsentGate, Guardrails, CapacityAction, Leverage, SRT
} from "./types";

// --- Helpers ---------------------------------------------------------------

function clamp01(x: number | null | undefined, fallback = 0): number {
  if (x == null || Number.isNaN(x)) return fallback;
  return Math.max(0, Math.min(1, x));
}

function distanceFromBand(value: number, lower?: number | null, upper?: number | null): number {
  if (lower == null && upper == null) return 0;
  if (lower != null && value < lower) {
    return (lower - value) / (Math.abs(lower) + 1e-6);
  }
  if (upper != null && value > upper) {
    return (value - upper) / (Math.abs(upper) + 1e-6);
  }
  return 0;
}

function isoHorizonBySeverity(sev: number): SRT {
  // map severity to shorter horizons/cadence
  if (sev >= 0.5) return { horizon: "P7D", cadence: "daily" as const };
  if (sev >= 0.25) return { horizon: "P14D", cadence: "daily" as const };
  if (sev >= 0.1) return { horizon: "P30D", cadence: "weekly" as const };
  return { horizon: "P60D", cadence: "bi-weekly" as const };
}

function structuralHorizon(persistence: number, integralErr: number): SRT {
  // structural work runs longer cadence
  const p = clamp01(persistence);
  const e = clamp01(integralErr);
  const weight = Math.max(p, e);
  if (weight > 0.66) return { horizon: "P90D", cadence: "monthly" as const };
  if (weight > 0.33) return { horizon: "P60D", cadence: "bi-weekly" as const };
  return { horizon: "P45D", cadence: "weekly" as const };
}

function nearTie(a: number, b: number): number {
  return Math.abs(a - b);
}

function hashDecision(obj: any): string {
  const s = JSON.stringify(obj);
  let h = 0;
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0;
  return `${h}`;
}

// Default/fallback actions per capacity
const FALLBACK_ACTIONS: Record<Capacity, { sprintLevel: Leverage; actions: string[]; }> = {
  responsive: {
    sprintLevel: "P",
    actions: ["Run contingency playbook", "Surge staffing/logistics", "Publish status banner"]
  },
  reflexive: {
    sprintLevel: "N",
    actions: ["Retune controller", "Reweight bands", "Interim evaluation plan"]
  },
  deliberative: {
    sprintLevel: "N",
    actions: ["Convene joint council", "Publish transparency pack", "Set joint KPIs & RACI"]
  },
  anticipatory: {
    sprintLevel: "P",
    actions: ["Arm watchpoints", "Pre-position bundles", "Define trigger rules"]
  },
  structural: {
    sprintLevel: "S",
    actions: ["Open structural ticket", "Mandate gate", "Pathway map + evaluation"]
  }
};

// --- Core scoring ----------------------------------------------------------

export function computeCapacityDecision(reading: SignalReading): DecisionResult {
  const {
    loopCode, indicator, value, lower, upper,
    slope, persistencePk, integralError, oscillation,
    dispersion, hubSaturation, ewsProb, bufferAdequacy,
    dataPenalty, legitimacyGap, rmseRel, guardrailViolation
  } = reading;

  const sevRaw = distanceFromBand(value, lower, upper);
  const severity = Math.max(0, Math.min(1, sevRaw)); // 0..1

  // Normalize features into 0..1
  const o = clamp01(oscillation);
  const d = clamp01(dispersion);
  const h = clamp01(hubSaturation);
  const ews = clamp01(ewsProb);
  const leg = clamp01(legitimacyGap);
  const pers = clamp01((persistencePk ?? 0) / 100); // if provided as %
  const eint = clamp01(integralError);
  const rmse = clamp01(rmseRel);
  const dataPen = clamp01(dataPenalty);

  // Capacity score heuristics (0..100)
  const scores: CapacityScores = {
    responsive: Math.round(
      100 * (
        0.45 * severity
        + 0.20 * clamp01((slope ?? 0) > 0 ? Math.min((slope as number)/10, 1) : 0) // rising risk
        + 0.15 * clamp01(1 - clamp01((bufferAdequacy ?? 60) / 120))                 // thin buffers
        + 0.10 * clamp01(guardrailViolation ? 1 : 0)
        + 0.10 * h                                                                  // hub stress
      )
    ),
    reflexive: Math.round(
      100 * (
        0.40 * o
        + 0.30 * rmse
        + 0.15 * severity * 0.7
        + 0.15 * d
      )
    ),
    deliberative: Math.round(
      100 * (
        0.45 * leg
        + 0.25 * d
        + 0.15 * h
        + 0.15 * clamp01((guardrailViolation ? 1 : 0))
      )
    ),
    anticipatory: Math.round(
      100 * (
        0.55 * ews
        + 0.25 * clamp01((bufferAdequacy ?? 90) < 30 ? 1 : 0) // weak buffers
        + 0.20 * clamp01(severity < 0.1 ? 1 : 0)              // act before breach
      )
    ),
    structural: Math.round(
      100 * (
        0.45 * pers
        + 0.35 * eint
        + 0.10 * severity
        + 0.10 * dataPen
      )
    )
  };

  // Order & primary
  const order = (Object.keys(scores) as Capacity[]).sort((a, b) => scores[b] - scores[a]);
  const primary = order[0];
  const secondary = order[1];

  // SRT
  const srt = primary === "structural"
    ? structuralHorizon(pers, eint)
    : primary === "anticipatory"
      ? { horizon: "P30D", cadence: "weekly" as const }
      : isoHorizonBySeverity(severity);

  // Consent gate
  const consent: ConsentGate = {
    legitimacyGap: leg,
    requireDeliberative: leg >= 0.45,
    notes: leg >= 0.45 ? "Open transparency pack & council convenor." : undefined
  };

  // Guardrails
  const guardrails: Guardrails = {
    caps: guardrailViolation ? ["tighten_caps"] : undefined,
    timeboxDays: primary === "responsive" ? 14 : undefined,
    coolDownMs: 15 * 60 * 1000, // 15 min default cool-down
    lifeSafety: false
  };

  // Template actions (fallbacks if none pre-defined)
  const templateActions: CapacityAction[] = order.map((cap, idx) => ({
    capacity: cap,
    order: idx + 1,
    sprintLevel: FALLBACK_ACTIONS[cap].sprintLevel,
    actions: FALLBACK_ACTIONS[cap].actions
  }));

  const result: DecisionResult = {
    loopCode,
    indicator,
    severity,
    scores,
    order,
    primary,
    secondary,
    srt,
    guardrails,
    consent,
    templateActions,
    nearTieDelta: nearTie(scores[primary], scores[secondary]),
    decisionId: hashDecision({ loopCode, indicator, scores, srt, consent })
  };

  return result;
}