import { create } from 'zustand'

type SimulationSettingsState = {
  horizon: number
  sensitivity: number
  setHorizon: (h: number) => void
  setSensitivity: (s: number) => void
}

export const useSimulationSettingsStore = create<SimulationSettingsState>((set)=>({
  horizon: 36,
  sensitivity: 1,
  setHorizon: (h) => set({ horizon: h }),
  setSensitivity: (s) => set({ sensitivity: s })
}))
