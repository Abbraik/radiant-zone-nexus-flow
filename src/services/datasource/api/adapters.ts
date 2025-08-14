import { IDataProvider } from '../types';

const notImpl = (name: string) => () => Promise.reject(new Error(`[apiProvider] ${name} not implemented`));

export const apiProvider: IDataProvider = {
  // Signals & Bands
  createIndicator: notImpl('createIndicator'),
  upsertIndicatorValue: notImpl('upsertIndicatorValue'),
  listIndicators: notImpl('listIndicators'),
  getBandStatus: notImpl('getBandStatus'),

  // REL
  openRel: notImpl('openRel'),
  advanceRel: notImpl('advanceRel'),
  listRel: notImpl('listRel'),

  // Gate & Participation
  submitGate: notImpl('submitGate'),
  submitParticipation: notImpl('submitParticipation'),
  getParticipationDebt: notImpl('getParticipationDebt'),

  // Transparency
  publishPack: notImpl('publishPack'),
  listPacks: notImpl('listPacks'),

  // Meta-Loop
  openMetaRel: notImpl('openMetaRel'),
  approveSequence: notImpl('approveSequence'),
};
