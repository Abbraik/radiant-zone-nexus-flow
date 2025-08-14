export type BandStatus = 'in' | 'soft' | 'hard' | 'critical';
export type RelStage =
  | 'think' | 'act' | 'monitor' | 'learn' | 'innovate' | 'closed';

export type PdiArc = 'P_to_R'|'R_to_PS'|'PS_to_S'|'S_to_P';
export type PdiLevel = 'macro'|'meso'|'micro';

export interface GateStackStep {
  arc: PdiArc;
  actor: string;
  level: PdiLevel;
  note?: string;
}

export interface GateStack {
  id: string;
  code: string;       // e.g., 'E-1'
  title: string;      // 'Rapid Re-employment'
  domain: 'employment'|'housing'|'health'|'energy'|'digital'|'education'|'other';
  description: string;
  steps: GateStackStep[];   // macro→meso→micro
  equity?: string;
}

export interface AppliedArc extends GateStackStep {
  stackId: string;
  stackCode: string;
  itemId: string; // bundle item id (we'll use 'demo-item-1')
}

export interface Indicator { id: string; name: string; target: number; bandL: number; bandU: number; method: 'zscore'|'custom'; freq: string; }
export interface IndicatorValue { ts: string; value: number; z?: number; status?: BandStatus; }

export interface RelTicket { id: string; indicatorId: string; breachClass: 'Soft'|'Hard'|'Critical'; stage: RelStage; openedAt: string; mttrDays?: number; }

export interface GateScores {
  itemId: string; authority: number; capacity: number; data: number; leverFit: number; safeguards: number; participation: number;
  outcome?: 'ALLOW'|'REWORK'|'BLOCK'; notes?: string; overridden?: boolean; overrideReason?: string; approver?: string;
}

export interface ParticipationPack { relId: string; method: string; sampleSize: number; compliance: 'Yes'|'No'|'Compressed'; compressed: boolean; fullPackDue?: string; }
export interface TransparencyPack { id: string; refType: 'rel'|'meta'; refId: string; type: 'short'|'full'; url: string; hash: string; publishedAt: string; }

export interface MetaRel { id: string; openedAt: string; mlhi: number; mismatchPct: number; conflicts: any[]; sequence: any[]; closedAt?: string; }

export interface MetricSummary {
  tri: number;          // Trigger Readiness Index 0–100
  pci: number;          // Platform Control Index 0–100
  mttrDays: number;     // Mean Time To Resolve REL (days)
  uptakePct: number;    // % of target adoption
}

export type EvalMethod = 'ITS'|'DiD';

export interface Pilot {
  id: string;
  code: string;                 // e.g., 'E-1'
  title: string;                // 'Rapid Re-employment Pilot'
  relId?: string;
  startedAt: string;
  method: EvalMethod;
  // ITS
  seriesBefore?: Array<{ ts: string; y: number }>;
  seriesAfter?: Array<{ ts: string; y: number }>;
  // DiD
  treatedGroup?: Array<{ ts: string; y: number }>;
  controlGroup?: Array<{ ts: string; y: number }>;
  summary?: { effect: number; p?: number; note?: string };
}

export interface IDataProvider {
  // Signals & Bands
  createIndicator(i: Partial<Indicator>): Promise<Indicator>;
  upsertIndicatorValue(id: string, v: IndicatorValue): Promise<IndicatorValue>;
  listIndicators(): Promise<Indicator[]>;
  getBandStatus(id: string): Promise<{ status: BandStatus; z?: number }>;
  /** Raw values for an indicator (latest last) */
  listIndicatorValues(indicatorId: string): Promise<IndicatorValue[]>;
  // REL
  openRel(indicatorId: string, breachClass: 'Soft'|'Hard'|'Critical'): Promise<RelTicket>;
  advanceRel(id: string, stage: RelStage, decision?: string): Promise<RelTicket>;
  listRel(filter?: Partial<Pick<RelTicket,'stage'|'indicatorId'>>): Promise<RelTicket[]>;

  // Gate & Participation
  submitGate(scores: GateScores): Promise<{ itemId: string; outcome: 'ALLOW'|'REWORK'|'BLOCK' }>;
  getLastGateOutcome(itemId: string): Promise<{ outcome:'ALLOW'|'REWORK'|'BLOCK'|null; at?: string }>;
  submitParticipation(pack: ParticipationPack): Promise<ParticipationPack>;
  getParticipationForRel(relId: string): Promise<ParticipationPack | null>;
  getParticipationDebt(): Promise<{ overdue: number; items: string[] }>;

  // Transparency
  publishPack(p: Omit<TransparencyPack,'id'|'hash'|'publishedAt'>): Promise<TransparencyPack>;
  listPacks(refType:'rel'|'meta', refId: string): Promise<TransparencyPack[]>;
  listAllPacks(): Promise<TransparencyPack[]>;

  // Gate Stacks & PDI arcs
  listGateStacks(): Promise<GateStack[]>;
  applyGateStackToItem(stackId: string, itemId: string): Promise<{ applied: AppliedArc[] }>;
  listAppliedArcs(itemId: string): Promise<AppliedArc[]>;

  // Metrics & Pilots
  getMetricsSummary(): Promise<MetricSummary>;
  listPilots(): Promise<Pilot[]>;
  upsertPilot(pilot: Pilot): Promise<Pilot>;

  // Meta-Loop
  openMetaRel(seed: Partial<MetaRel>): Promise<MetaRel>;
  approveSequence(id: string, sequence: any): Promise<MetaRel>;
}
