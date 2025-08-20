// src/services/capacity-decision.ts
// Pure, framework-agnostic decision service for 5C capacity activation.
// No I/O, side-effects, or runtime dependencies.

export type Capacity = 'responsive' | 'reflexive' | 'deliberative' | 'anticipatory' | 'structural';

export interface BandContext {
  lower: number;
  upper: number;
}

export interface SignalInputs {
  // Required
  value: number;
  band: BandContext;

  // Optional (precomputed). If omitted, defaults to safe zeros (no pressure).
  slope?: number;           // normalized |Δ value|, 0..1
  persistencePk?: number;   // share of last k periods in breach, 0..1
  integralError?: number;   // normalized cumulative distance, 0..1
  oscillation?: number;     // 0..1
  dispersion?: number;      // cross-indicator variance, 0..1
  hubSaturation?: number;   // SNL hub stress, 0..1
  ewsProb?: number;         // early warning probability, 0..1
  bufferAdequacy?: number;  // 0..1 (1=healthy buffers) → we use (1-B)
  dataPenalty?: number;     // 0..1 (META-L04 penalty)
  legitimacyGap?: number;   // 0..1 service-trust congruence gap
  guardrailViolation?: number; // 0..1 (META-L05)
  rmseRel?: number;         // 0..1 relative controller error (META-L02)
  leadTimeWeight?: number;  // 0..1 usefulness of lead time
}

export interface DecisionConfig {
  // Score thresholds
  primaryCutoff?: number; // default 0.7
  nearTieDelta?: number;  // default 0.1

  // Weights (override to tune without code changes)
  weights?: {
    responsive?: { S: number; slope: number; invB: number; ews: number; };
    reflexive?:  { oscill: number; guard: number; rmse: number; };
    deliberative?: { disp: number; hub: number; leg: number; };
    anticipatory?: { ews: number; lead: number; };
    structural?: { pk: number; eint: number; qpen: number; };
  };
}

export interface DecisionRequest {
  loopCode: string;
  indicator: string;
  tstamp: string; // ISO
  reading: SignalInputs;
  context?: { lifeSafety?: boolean }; // if true, responsive can override consent gate
  config?: DecisionConfig;
}

export interface CapacityScores {
  responsive: number;
  reflexive: number;
  deliberative: number;
  anticipatory: number;
  structural: number;
}

export interface SRTSuggestion {
  horizon: 'P14D' | 'P30D' | 'P45D' | 'P60D' | 'P90D' | 'P180D' | 'P365D';
  cadence: 'daily' | 'weekly' | 'bi-monthly' | 'monthly' | 'quarterly' | 'semiannual' | 'annual';
}

export interface CapacityAction {
  capacity: Capacity;
  order: number;
  actions: string[];   // templated, editable by UI
  sprintLevel: 'N' | 'P' | 'S'; // Narrative / Policy / Structure
}

export interface DecisionResult {
  scores: CapacityScores;
  recommendedCapacities: Capacity[]; // 1 or 2 (composed)
  order: Capacity[];                 // execution order (length == recommendedCapacities)
  srt: SRTSuggestion;
  guardrails?: { caps?: string[]; timeboxDays?: number };
  consent?: { legGap: number; transparency: 'none' | 'banner' | 'pack' };
  rationale: string;
  templateActions: CapacityAction[];
}

const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const safe = (n: number | undefined) => clamp01(n ?? 0);

// Severity relative to band (two-sided)
export function severity(value: number, band: BandContext): number {
  const span = band.upper - band.lower;
  if (span <= 0) return 0;
  if (value > band.upper) return clamp01((value - band.upper) / span);
  if (value < band.lower) return clamp01((band.lower - value) / span);
  return 0;
}

const DEFAULT_WEIGHTS: Required<Required<DecisionConfig>['weights']> = {
  responsive:   { S: 0.45, slope: 0.20, invB: 0.20, ews: 0.25 },
  reflexive:    { oscill: 0.50, guard: 0.30, rmse: 0.20 },
  deliberative: { disp: 0.45, hub: 0.30, leg: 0.25 },
  anticipatory: { ews: 0.70, lead: 0.30 },
  structural:   { pk: 0.50, eint: 0.30, qpen: 0.20 },
};

function suggestSRT(primary: Capacity, scores: CapacityScores): SRTSuggestion {
  // Simplified mapping by capacity—with minor modulation by score
  const top = Math.max(...Object.values(scores));
  const intense = top >= 0.8;

  switch (primary) {
    case 'responsive':   return { horizon: intense ? 'P14D'  : 'P30D',  cadence: 'daily' };
    case 'reflexive':    return { horizon: 'P30D',  cadence: 'weekly' };
    case 'anticipatory': return { horizon: 'P60D',  cadence: 'weekly' };
    case 'deliberative': return { horizon: 'P60D',  cadence: 'bi-monthly' };
    case 'structural':   return { horizon: intense ? 'P180D' : 'P90D',  cadence: intense ? 'quarterly' : 'monthly' };
  }
}

function actionTemplates(cap: Capacity, loopCode: string): CapacityAction {
  const base = (actions: string[], sprintLevel: 'N'|'P'|'S', order = 1): CapacityAction =>
    ({ capacity: cap, order, actions, sprintLevel });

  switch (cap) {
    case 'responsive':
      return base([
        `Run contingency playbook for ${loopCode}`,
        'Authorize targeted surge (staffing/logistics/buffers)',
        'Issue real-time status dashboard banner',
      ], 'P');
    case 'reflexive':
      return base([
        'Retune controller (gain/family) per META-L02',
        'Enforce time-box and interim evaluation (META-L05)',
        'Publish governance note on band/weight changes (META-L01)',
      ], 'N');
    case 'deliberative':
      return base([
        'Convene joint council w/ shared KPIs (MES-L11)',
        'Publish transparency pack & consult schedule (META-L07)',
        'Set RACI + escalation path (META-L03)',
      ], 'N');
    case 'anticipatory':
      return base([
        'Arm watchpoints & simulate scenarios (META-L08)',
        'Pre-position bundles/resources; standby comms',
        'Define staged triggers with auto-activation',
      ], 'P');
    case 'structural':
      return base([
        'Open structural proposal ticket (META-L06)',
        'Draft standards/rights/budget formula changes',
        'Attach DiD/ITS evaluation plan & adoption SLA',
      ], 'S');
  }
}

export function computeCapacityDecision(req: DecisionRequest): DecisionResult {
  const { loopCode, indicator, tstamp, reading, config, context } = req;
  const weights = { ...DEFAULT_WEIGHTS, ...(config?.weights ?? {}) };

  const S  = severity(reading.value, reading.band);
  const Sd = safe(reading.slope);
  const Pk = safe(reading.persistencePk);
  const Ei = safe(reading.integralError);
  const O  = safe(reading.oscillation);
  const D  = safe(reading.dispersion);
  const H  = safe(reading.hubSaturation);
  const EW = safe(reading.ewsProb);
  const B  = safe(reading.bufferAdequacy);
  const Qp = safe(reading.dataPenalty);
  const LG = safe(reading.legitimacyGap);
  const GR = safe(reading.guardrailViolation);
  const RM = safe(reading.rmseRel);
  const LT = safe(reading.leadTimeWeight);

  const invB = clamp01(1 - B);

  const responsive   = clamp01(weights.responsive.S * S + weights.responsive.slope * Sd + weights.responsive.invB * invB + weights.responsive.ews * EW);
  const reflexive    = clamp01(weights.reflexive.oscill * O + weights.reflexive.guard * GR + weights.reflexive.rmse * RM);
  const deliberative = clamp01(weights.deliberative.disp * D + weights.deliberative.hub * H + weights.deliberative.leg * LG);
  const anticipatory = clamp01(weights.anticipatory.ews * EW + weights.anticipatory.lead * LT);
  const structural   = clamp01(weights.structural.pk * Pk + weights.structural.eint * Ei + weights.structural.qpen * Qp);

  const scores: CapacityScores = { responsive, reflexive, deliberative, anticipatory, structural };

  const primaryCutoff = config?.primaryCutoff ?? 0.7;
  const nearTieDelta  = config?.nearTieDelta ?? 0.1;

  // Rank capacities by score
  const ranked = (Object.entries(scores) as [Capacity, number][])
    .sort((a, b) => b[1] - a[1]);

  const [topCap, topScore] = ranked[0];

  let picked: Capacity[] = [topCap];

  // Compose with a second capacity if near-tie
  if (ranked.length > 1 && ranked[1][1] >= topScore - nearTieDelta) {
    picked = [ranked[0][0], ranked[1][0]];
  }

  // Enforce consent gate: append deliberative if LegGap high (unless life-safety)
  if (!context?.lifeSafety && LG >= 0.35 && !picked.includes('deliberative')) {
    picked = picked.length === 1 ? [picked[0], 'deliberative'] : [picked[0], 'deliberative'];
  }

  // If topScore below cutoff, still produce guidance with lowest-intensity SRT
  const primary = picked[0];
  const srt = suggestSRT(primary, scores);

  // Guardrails suggestion (simple heuristic)
  const guardrails = (() => {
    if (primary === 'responsive') return { caps: ['limit discretionary actuation'], timeboxDays: 14 };
    if (primary === 'reflexive')  return { caps: ['respect controller caps'], timeboxDays: 30 };
    if (primary === 'structural') return { caps: ['no irreversible commitments pre-review'], timeboxDays: 90 };
    return undefined;
  })();

  const consent = {
    legGap: LG,
    transparency: LG >= 0.35 ? ('pack' as const) : LG >= 0.2 ? ('banner' as const) : ('none' as const),
  };

  // Order: if anticipatory is present with responsive, prefer Antic → Resp
  let order = [...picked];
  if (picked.includes('anticipatory') && picked.includes('responsive')) {
    order = ['anticipatory', 'responsive', ...picked.filter(c => c !== 'anticipatory' && c !== 'responsive')];
  }

  const tmpl = picked.map((c, i) => {
    const act = actionTemplates(c, loopCode);
    return { ...act, order: i + 1 };
  });

  const rationale = [
    `Signal on ${loopCode}:${indicator} at ${tstamp}`,
    `S=${S.toFixed(2)}, slope=${Sd.toFixed(2)}, Pk=${Pk.toFixed(2)}, EWS=${EW.toFixed(2)}, LegGap=${LG.toFixed(2)}`,
    `Top capacity: ${primary} (${topScore.toFixed(2)})${picked.length>1 ? ` + ${picked[1]} (${(scores[picked[1]] as number).toFixed(2)})` : ''}`
  ].join(' | ');

  return {
    scores,
    recommendedCapacities: picked,
    order,
    srt,
    guardrails,
    consent,
    rationale,
    templateActions: tmpl,
  };
}