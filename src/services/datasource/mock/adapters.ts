import {
  IDataProvider,
  Indicator,
  IndicatorValue,
  RelTicket,
  RelStage,
  GateScores,
  ParticipationPack,
  TransparencyPack,
  MetaRel,
} from '../types';

const genId = (prefix = 'id') => `${prefix}_${Math.random().toString(36).slice(2)}_${Date.now()}`;

// In-memory stores (simple stubs; can be replaced with IndexedDB/localStorage later)
const indicators: Indicator[] = [];
const indicatorValues: Record<string, IndicatorValue[]> = {};
const rels: RelTicket[] = [];
const packs: TransparencyPack[] = [];
const metaRels: MetaRel[] = [];

export const mockProvider: IDataProvider = {
  // Signals & Bands
  async createIndicator(i: Partial<Indicator>): Promise<Indicator> {
    const ind: Indicator = {
      id: genId('ind'),
      name: i.name ?? 'New Indicator',
      target: i.target ?? 0,
      bandL: i.bandL ?? -1,
      bandU: i.bandU ?? 1,
      method: i.method ?? 'zscore',
      freq: i.freq ?? 'daily',
    };
    indicators.push(ind);
    return ind;
  },
  async upsertIndicatorValue(id: string, v: IndicatorValue): Promise<IndicatorValue> {
    indicatorValues[id] = indicatorValues[id] ?? [];
    const idx = indicatorValues[id].findIndex((x) => x.ts === v.ts);
    if (idx >= 0) indicatorValues[id][idx] = v; else indicatorValues[id].push(v);
    return v;
  },
  async listIndicators(): Promise<Indicator[]> {
    return [...indicators];
  },
  async getBandStatus(id: string): Promise<{ status: 'in' | 'soft' | 'hard' | 'critical'; z?: number }> {
    const series = indicatorValues[id] ?? [];
    const last = series[series.length - 1];
    if (!last) return { status: 'in' };
    return { status: last.status ?? 'in', z: last.z };
  },

  // REL
  async openRel(indicatorId: string, breachClass: 'Soft' | 'Hard' | 'Critical'): Promise<RelTicket> {
    const t: RelTicket = {
      id: genId('rel'),
      indicatorId,
      breachClass,
      stage: 'sense',
      openedAt: new Date().toISOString(),
    };
    rels.push(t);
    return t;
  },
  async advanceRel(id: string, stage: RelStage): Promise<RelTicket> {
    const r = rels.find((x) => x.id === id);
    if (!r) throw new Error('REL not found');
    r.stage = stage;
    return r;
  },
  async listRel(filter?: Partial<Pick<RelTicket, 'stage' | 'indicatorId'>>): Promise<RelTicket[]> {
    let out = [...rels];
    if (filter?.stage) out = out.filter((r) => r.stage === filter.stage);
    if (filter?.indicatorId) out = out.filter((r) => r.indicatorId === filter.indicatorId);
    return out;
  },

  // Gate & Participation
  async submitGate(scores: GateScores): Promise<{ itemId: string; outcome: 'ALLOW' | 'REWORK' | 'BLOCK' }> {
    // Simple stub logic: average score threshold
    const avg = (scores.authority + scores.capacity + scores.data + scores.leverFit + scores.safeguards + scores.participation) / 6;
    const outcome = avg >= 3.5 ? 'ALLOW' : avg >= 2.5 ? 'REWORK' : 'BLOCK';
    return { itemId: scores.itemId, outcome };
  },
  async submitParticipation(pack: ParticipationPack): Promise<ParticipationPack> {
    return { ...pack };
  },
  async getParticipationDebt(): Promise<{ overdue: number; items: string[] }> {
    return { overdue: 0, items: [] };
  },

  // Transparency
  async publishPack(p: Omit<TransparencyPack, 'id' | 'hash' | 'publishedAt'>): Promise<TransparencyPack> {
    const full: TransparencyPack = {
      ...p,
      id: genId('pack'),
      hash: genId('hash'),
      publishedAt: new Date().toISOString(),
    };
    packs.push(full);
    return full;
  },
  async listPacks(refType: 'rel' | 'meta', refId: string): Promise<TransparencyPack[]> {
    return packs.filter((x) => x.refType === refType && x.refId === refId);
  },

  // Meta-Loop
  async openMetaRel(seed: Partial<MetaRel>): Promise<MetaRel> {
    const m: MetaRel = {
      id: genId('mrel'),
      openedAt: new Date().toISOString(),
      mlhi: seed.mlhi ?? 0,
      mismatchPct: seed.mismatchPct ?? 0,
      conflicts: seed.conflicts ?? [],
      sequence: seed.sequence ?? [],
    };
    metaRels.push(m);
    return m;
  },
  async approveSequence(id: string, sequence: any): Promise<MetaRel> {
    const m = metaRels.find((x) => x.id === id);
    if (!m) throw new Error('MetaRel not found');
    m.sequence = sequence;
    return m;
  },
};
