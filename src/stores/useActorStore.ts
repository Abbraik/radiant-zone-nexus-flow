import { create } from 'zustand'
import type { Lever } from '@/types/pags'

export type OrgType = 'Gov' | 'NGO' | 'Private' | 'International'

export interface ActorRecord {
  id: string
  name: string
  orgType: OrgType
  capabilities: Lever[]
  authority: Lever[]
}

type ActorState = {
  actors: ActorRecord[]
  loading: boolean
  fetchActors: () => Promise<void>
}

const delay = (ms:number)=>new Promise(r=>setTimeout(r,ms))

const mockActors: ActorRecord[] = [
  { id: 'MOE', name: 'Ministry of Education', orgType: 'Gov', capabilities: ['N','P'], authority: ['N','P','S'] },
  { id: 'MOL', name: 'Ministry of Labor', orgType: 'Gov', capabilities: ['P','S'], authority: ['P','S'] },
  { id: 'NGO-Y', name: 'Youth NGO Coalition', orgType: 'NGO', capabilities: ['N','P'], authority: ['N'] },
  { id: 'CHAM', name: 'Chamber of Commerce', orgType: 'Private', capabilities: ['P'], authority: ['P'] },
  { id: 'WB', name: 'World Bank Country Office', orgType: 'International', capabilities: ['P','S'], authority: ['P'] },
]

export const useActorStore = create<ActorState>((set)=>({
  actors: [],
  loading: false,
  fetchActors: async ()=>{
    set({ loading: true })
    await delay(200)
    set({ actors: mockActors, loading: false })
  }
}))
