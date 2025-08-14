export type BandStatus = 'in' | 'soft' | 'hard' | 'critical';
export type RelStage =
  | 'think' | 'act' | 'monitor' | 'learn' | 'innovate' | 'closed';

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
  submitParticipation(pack: ParticipationPack): Promise<ParticipationPack>;
  getParticipationDebt(): Promise<{ overdue: number; items: string[] }>;

  // Transparency
  publishPack(p: Omit<TransparencyPack,'id'|'hash'|'publishedAt'>): Promise<TransparencyPack>;
  listPacks(refType:'rel'|'meta', refId: string): Promise<TransparencyPack[]>;

  // Meta-Loop
  openMetaRel(seed: Partial<MetaRel>): Promise<MetaRel>;
  approveSequence(id: string, sequence: any): Promise<MetaRel>;
}
