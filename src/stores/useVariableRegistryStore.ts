import { create } from 'zustand'

export type VarType = 'Stock' | 'Flow' | 'Indicator'
export type Pillar = 'Population' | 'Behavior' | 'Resource' | 'Economic' | 'Resilience'

export interface VariableRecord {
  id: string
  name: string
  unit: string
  pillar: Pillar
  type: VarType
  linkedLoops: string[]
  sharedNode: boolean
  sensitivity: 'Low' | 'Medium' | 'High'
  source: string
}

type VariableRegistryState = {
  variables: VariableRecord[]
  loading: boolean
  fetchVariables: () => Promise<void>
  addVariable: (v: VariableRecord) => void
}

const delay = (ms:number)=>new Promise(r=>setTimeout(r,ms))
const mockData: VariableRecord[] = [
  {
    id: 'school_dropout_rate',
    name: 'School Dropout Rate',
    unit: '%',
    pillar: 'Behavior',
    type: 'Indicator',
    linkedLoops: ['EDU-421'],
    sharedNode: true,
    sensitivity: 'High',
    source: 'Survey'
  },
  {
    id: 'youth_contact_rate',
    name: 'Youth Contact Rate',
    unit: '%',
    pillar: 'Behavior',
    type: 'Flow',
    linkedLoops: ['EDU-421'],
    sharedNode: true,
    sensitivity: 'Medium',
    source: 'Admin Data'
  },
]

export const useVariableRegistryStore = create<VariableRegistryState>((set)=>({
  variables: [],
  loading: false,
  fetchVariables: async ()=>{
    set({ loading: true })
    if (import.meta.env.VITE_MOCK_DATA_MODE === '1') {
      await delay(250)
      set({ variables: mockData, loading: false })
    } else {
      // TODO: replace with API call
      set({ variables: [], loading: false })
    }
  },
  addVariable: (v)=> set((state)=>({ variables: [...state.variables, v] }))
}))
