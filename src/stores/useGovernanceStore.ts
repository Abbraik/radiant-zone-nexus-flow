import { create } from 'zustand'

export type Capacity = 'Responsive'|'Reflexive'|'Deliberative'|'Anticipatory'|'Structural'
export type TierWeights = { t1: number; t2: number; t3: number }

type ChangeDraft = { id: string; kind: 'loop'|'bundle'|'pathway'; title: string; status: 'draft'|'submitted'; diff: string }
type EvidenceItem = { id: string; title: string; url?: string; note?: string; linkedTo?: { type: 'variable'|'loop'|'intervention', id: string } }

type GovernanceState = {
  capacity: Capacity
  weights: TierWeights
  bandsT1: { low: number; high: number }
  drafts: ChangeDraft[]
  evidence: EvidenceItem[]
  submitDraft: (d: Omit<ChangeDraft,'status'>) => Promise<void>
  addEvidence: (e: Omit<EvidenceItem,'id'>) => Promise<void>
  setCapacity: (c: Capacity) => void
  setWeights: (w: TierWeights) => void
  setBands: (low: number, high: number) => void
}

const delay = (ms:number)=> new Promise(r=>setTimeout(r, ms))
const mock = import.meta.env.VITE_MOCK_DATA_MODE !== '0'

export const useGovernanceStore = create<GovernanceState>((set, get)=>({
  capacity: 'Reflexive',
  weights: { t1: 0.5, t2: 0.3, t3: 0.2 },
  bandsT1: { low: 0.0, high: 1.0 },
  drafts: [],
  evidence: [],
  submitDraft: async (d) => {
    if (mock) await delay(250)
    set(s=>({ drafts: [...s.drafts, { ...d, status: 'submitted' }] }))
  },
  addEvidence: async (e) => {
    if (mock) await delay(200)
    const id = crypto.randomUUID()
    set(s=>({ evidence: [...s.evidence, { id, ...e }] }))
  },
  setCapacity: (capacity)=> set({ capacity }),
  setWeights: (weights)=> set({ weights }),
  setBands: (low, high)=> set({ bandsT1: { low, high } }),
}))