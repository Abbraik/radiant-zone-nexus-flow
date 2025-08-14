import { get, set, push, uuid, KEYS } from './db';
import { sha256 } from '@/lib/hash';
import type {
  IDataProvider, Indicator, IndicatorValue, BandStatus, RelTicket, GateScores,
  ParticipationPack, TransparencyPack, MetaRel
} from '../types';

function bandStatusFor(value: number, L: number, U: number): BandStatus {
  if (value < L || value > U) return 'hard';
  const mid = (L + U) / 2;
  const wiggle = (U - L) * 0.15;
  if (value < mid - wiggle || value > mid + wiggle) return 'soft';
  return 'in';
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
    const last = vals.at(-1);
    if (!last) return { status: 'in' as BandStatus, z: 0 };
    return { status: bandStatusFor(last.value, ind.bandL, ind.bandU), z: last.z ?? 0 };
  },

  // REL
  async openRel(indicatorId, breachClass) {
    const rel: RelTicket = { id: uuid(), indicatorId, breachClass, stage: 'sense', openedAt: new Date().toISOString() };
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
