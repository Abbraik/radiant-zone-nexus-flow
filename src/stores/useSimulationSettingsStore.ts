import { create } from 'zustand'

export type PillarKey = 'pop_dyn' | 'res_market' | 'prod_services' | 'soc_outcomes'

type SimulationSettingsState = {
  horizon: number
  sensitivity: Record<PillarKey, number>
  setHorizon: (h: number) => void
  setSensitivity: (pillar: PillarKey, value: number) => void
}

export const useSimulationSettingsStore = create<SimulationSettingsState>((set)=>({
  horizon: 36,
  sensitivity: {
    pop_dyn: 1,
    res_market: 1,
    prod_services: 1,
    soc_outcomes: 1
  },
  setHorizon: (h) => set({ horizon: h }),
  setSensitivity: (pillar, value) => set((state)=>({
    sensitivity: { ...state.sensitivity, [pillar]: value }
  }))
}))
