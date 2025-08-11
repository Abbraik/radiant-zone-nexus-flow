import { create } from 'zustand'

export type LoopType = 'Reactive' | 'Structural' | 'Perceptual'
export type StructuralClass = 'R' | 'B' | 'N' | 'C' | 'T'
export type Pillar = 'Population' | 'Behavior' | 'Resource' | 'Economic' | 'Resilience'

export interface LoopRecord {
  id: string
  name: string
  type: LoopType
  class: StructuralClass
  level: 'micro' | 'meso' | 'macro'
  pillar: Pillar
  dominance: number
  gain: number
  confidence: number
  tierAnchors: { t1: number; t2: number; t3: number }
  sharedNodes: string[]
  deBand: { low: number; high: number }
}

type LoopRegistryState = {
  loops: LoopRecord[]
  loading: boolean
  fetchLoops: () => Promise<void>
}

const delay = (ms:number)=>new Promise(r=>setTimeout(r,ms))
const mockData: LoopRecord[] = [
  {
    id: 'EDU-421',
    name: 'Secondary Re-Enrollment Reflex',
    type: 'Structural',
    class: 'B',
    level: 'meso',
    pillar: 'Behavior',
    dominance: 0.65,
    gain: 0.22,
    confidence: 0.8,
    tierAnchors: { t1: 0.5, t2: 0.3, t3: 0.2 },
    sharedNodes: ['school_dropout_rate','youth_contact_rate'],
    deBand: { low: 0.1, high: 0.3 }
  },
]

export const useLoopRegistryStore = create<LoopRegistryState>((set)=>({
  loops: [],
  loading: false,
  fetchLoops: async ()=>{
    set({ loading: true })
    if (import.meta.env.VITE_MOCK_DATA_MODE === '1') {
      await delay(250)
      set({ loops: mockData, loading: false })
    } else {
      // TODO: replace with API call
      set({ loops: [], loading: false })
    }
  }
}))
