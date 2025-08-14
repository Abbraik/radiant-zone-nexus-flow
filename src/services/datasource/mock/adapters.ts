import { get, set, push, uuid, KEYS } from './db';
import { sha256 } from '@/lib/hash';
import type {
  IDataProvider, Indicator, IndicatorValue, BandStatus, RelTicket, GateScores,
  ParticipationPack, TransparencyPack, MetaRel, GateStack, AppliedArc, GateStackStep,
  MetricSummary, Pilot
} from '../types';

function bandStatusFor(value: number, L: number, U: number): BandStatus {
  if (value < L || value > U) return 'hard';
  const mid = (L + U) / 2;
  const wiggle = (U - L) * 0.15;
  if (value < mid - wiggle || value > mid + wiggle) return 'soft';
  return 'in';
}
function evaluateBandStatus(values: {value:number}[], L:number, U:number): {status:BandStatus; persist:number} {
  const n = values.length;
  if (n===0) return { status:'in', persist:0 };
  const s = bandStatusFor(values[n-1].value, L, U);
  let persist = 0;
  for (let i=n-1; i>=0; i--) {
    const st = bandStatusFor(values[i].value, L, U);
    if (st==='hard') persist++; else break;
  }
  // simple mock: 'critical' if 3+ consecutive out-of-band points
  const status = (persist>=3) ? 'critical' : s;
  return { status, persist };
}

function gateOutcome(scores: GateScores): 'ALLOW'|'REWORK'|'BLOCK' {
  const vals = [scores.authority, scores.capacity, scores.data, scores.leverFit, scores.safeguards, scores.participation];
  if (vals.some(v => v === 0)) return 'BLOCK';
  const lows = vals.filter(v => v <= 2).length;
  if (lows >= 2) return 'BLOCK';
  if (vals.some(v => v <= 2)) return 'REWORK';
  return 'ALLOW';
}

export const mockProvider: IDataProvider = {
  // Indicators
  async createIndicator(i) {
    const rec: Indicator = {
      id: uuid(),
      name: i.name ?? 'Indicator',
      target: i.target ?? 0,
      bandL: i.bandL ?? -1,
      bandU: i.bandU ?? 1,
      method: (i.method as any) ?? 'zscore',
      freq: i.freq ?? 'monthly',
    };
    const list = await get<Indicator[]>(KEYS.indicators, []);
    list.push(rec); await set(KEYS.indicators, list);
    return rec;
  },
  async upsertIndicatorValue(id, v) {
    const indicators = await get<Indicator[]>(KEYS.indicators, []);
    const ind = indicators.find(x => x.id === id);
    if (!ind) throw new Error('Indicator not found');
    const arr = await get<IndicatorValue[]>(KEYS.values(id), []);
    arr.push(v);
    await set(KEYS.values(id), arr);
    return v;
  },
  async listIndicators() {
    return get<Indicator[]>(KEYS.indicators, []);
  },
  async getBandStatus(id) {
    const inds = await get<Indicator[]>(KEYS.indicators, []);
    const ind = inds.find(x => x.id === id);
    if (!ind) throw new Error('Indicator not found');
    const vals = await get<IndicatorValue[]>(KEYS.values(id), []);
    const { status } = evaluateBandStatus(vals, ind.bandL, ind.bandU);
    const last = vals.at(-1);
    return { status, z: last?.z ?? 0 };
  },

  async listIndicatorValues(indicatorId: string) {
    return get<IndicatorValue[]>(KEYS.values(indicatorId), []);
  },

  // REL
  async openRel(indicatorId, breachClass) {
    const rel: RelTicket = { id: uuid(), indicatorId, breachClass, stage: 'think', openedAt: new Date().toISOString() };
    await push(KEYS.rels, rel);
    return rel;
  },
  async advanceRel(id, stage, decision) {
    const rels = await get<RelTicket[]>(KEYS.rels, []);
    const idx = rels.findIndex(r => r.id === id);
    if (idx < 0) throw new Error('REL not found');
    rels[idx] = { ...rels[idx], stage };
    await set(KEYS.rels, rels);
    return rels[idx];
  },
  async listRel(filter) {
    const rels = await get<RelTicket[]>(KEYS.rels, []);
    return rels.filter(r =>
      (!filter?.stage || r.stage === filter.stage) &&
      (!filter?.indicatorId || r.indicatorId === filter.indicatorId)
    );
  },

  // Gate & Participation
  async submitGate(scores) {
    const outcome = gateOutcome(scores);
    const rec = { ...scores, outcome, createdAt: new Date().toISOString() };
    await push(KEYS.gate, rec);
    return { itemId: scores.itemId, outcome };
  },
  async getLastGateOutcome(itemId: string) {
    const all = await get<any[]>(KEYS.gate, []);
    const rows = all.filter(g => g.itemId === itemId).sort((a,b)=> (a.createdAt>b.createdAt?-1:1));
    if (!rows.length) return { outcome: null };
    return { outcome: rows[0].outcome, at: rows[0].createdAt };
  },
  async submitParticipation(pack) {
    await push(KEYS.participation, pack);
    if (pack.compressed && pack.fullPackDue) {
      const debt = await get<{overdue:number; items:string[]}>(KEYS.debt, { overdue: 0, items: [] });
      // mock: mark overdue if due date < today
      const due = new Date(pack.fullPackDue);
      const today = new Date();
      if (due < new Date(today.toDateString())) {
        debt.overdue += 1;
        debt.items.push(pack.relId);
      }
      await set(KEYS.debt, debt);
    }
    return pack;
  },
  async getParticipationForRel(relId: string) {
    const all = await get<ParticipationPack[]>(KEYS.participation, []);
    const row = all.slice().reverse().find(p => p.relId === relId);
    return row ?? null;
  },
  async getParticipationDebt() {
    return get(KEYS.debt, { overdue: 0, items: [] });
  },

  // Transparency
  async publishPack(p) {
    const id = uuid();
    const payload = { ...p, id, publishedAt: new Date().toISOString() };
    const hash = await sha256(JSON.stringify(payload));
    const pack: TransparencyPack = { ...(payload as any), hash };
    await push(KEYS.packs, pack);
    return pack;
  },
  async listPacks(refType, refId) {
    const list = await get<TransparencyPack[]>(KEYS.packs, []);
    return list.filter(p => p.refType === refType && p.refId === refId);
  },
  async listAllPacks() {
    return get(KEYS.packs, [] as any[]);
  },

  // Gate Stacks & PDI arcs
  async listGateStacks() {
    return get<GateStack[]>(KEYS.stacks, []);
  },
  
  async listAppliedArcs(itemId: string) {
    return get<AppliedArc[]>(KEYS.applied(itemId), []);
  },
  
  async applyGateStackToItem(stackId: string, itemId: string) {
    const stacks = await get<GateStack[]>(KEYS.stacks, []);
    const stack = stacks.find(s => s.id === stackId);
    if (!stack) throw new Error('Stack not found');
    const existing = await get<AppliedArc[]>(KEYS.applied(itemId), []);
    const toApply: AppliedArc[] = stack.steps.map((s: GateStackStep) => ({
      ...s, itemId, stackId: stack.id, stackCode: stack.code
    }));
    const next = [...existing, ...toApply];
    await set(KEYS.applied(itemId), next);
    return { applied: toApply };
  },

  // Metrics & Pilots
  async getMetricsSummary() {
    const summary: MetricSummary = {
      tri: 78,
      pci: 84,
      mttrDays: 12.5,
      uptakePct: 67
    };
    return summary;
  },
  
  async listPilots() {
    return get<Pilot[]>(KEYS.pilots, []);
  },
  
  async upsertPilot(pilot: Pilot) {
    const pilots = await get<Pilot[]>(KEYS.pilots, []);
    const idx = pilots.findIndex(p => p.id === pilot.id);
    if (idx >= 0) {
      pilots[idx] = pilot;
    } else {
      pilots.push(pilot);
    }
    await set(KEYS.pilots, pilots);
    return pilot;
  },

  // Meta-Loop
  async openMetaRel(seed) {
    const rec: MetaRel = {
      id: uuid(), openedAt: new Date().toISOString(),
      mlhi: seed.mlhi ?? 80, mismatchPct: seed.mismatchPct ?? 0,
      conflicts: seed.conflicts ?? [], sequence: seed.sequence ?? []
    };
    await push(KEYS.meta, rec); return rec;
  },
  async approveSequence(id, sequence) {
    const metas = await get<MetaRel[]>(KEYS.meta, []);
    const i = metas.findIndex(m => m.id === id);
    if (i < 0) throw new Error('Meta-REL not found');
    metas[i] = { ...metas[i], sequence };
    await set(KEYS.meta, metas);
    return metas[i];
  },
};
