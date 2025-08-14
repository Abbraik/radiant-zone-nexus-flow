import type { IDataProvider } from '../types';

export const apiProvider: IDataProvider = {
  // Throw to make it obvious if someone flips to api prematurely
  async createIndicator(){ throw new Error('API provider not implemented'); },
  async upsertIndicatorValue(){ throw new Error('API provider not implemented'); },
  async listIndicators(){ throw new Error('API provider not implemented'); },
  async getBandStatus(){ throw new Error('API provider not implemented'); },
  async listIndicatorValues(){ throw new Error('API provider not implemented'); },

  async openRel(){ throw new Error('API provider not implemented'); },
  async advanceRel(){ throw new Error('API provider not implemented'); },
  async listRel(){ throw new Error('API provider not implemented'); },

  async submitGate(){ throw new Error('API provider not implemented'); },
  async getLastGateOutcome(){ throw new Error('API provider not implemented'); },
  async submitParticipation(){ throw new Error('API provider not implemented'); },
  async getParticipationForRel(){ throw new Error('API provider not implemented'); },
  async getParticipationDebt(){ throw new Error('API provider not implemented'); },

  async publishPack(){ throw new Error('API provider not implemented'); },
  async listPacks(){ throw new Error('API provider not implemented'); },
  async listAllPacks(){ throw new Error('API provider not implemented'); },

  async listGateStacks(){ throw new Error('API provider not implemented'); },
  async applyGateStackToItem(){ throw new Error('API provider not implemented'); },
  async listAppliedArcs(){ throw new Error('API provider not implemented'); },

  async openMetaRel(){ throw new Error('API provider not implemented'); },
  async approveSequence(){ throw new Error('API provider not implemented'); },
};
