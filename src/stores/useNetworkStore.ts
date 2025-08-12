import { create } from 'zustand'

export type RelType = 'Authority' | 'Funding' | 'Data' | 'Coordination'
export type Level = 'micro'|'meso'|'macro'

export interface NetworkActor {
  id: string
  name: string
  orgType: 'Gov'|'NGO'|'Private'|'International'
  level: Level
  loopsAffected: string[]
}

export interface NetworkEdge {
  id: string
  sourceId: string
  targetId: string
  type: RelType
  sharedNodes: string[]
}

type NetworkState = {
  actors: NetworkActor[]
  edges: NetworkEdge[]
  setNetwork: (data: { actors: NetworkActor[]; edges: NetworkEdge[] }) => void
}

export const useNetworkStore = create<NetworkState>((set)=>({
  actors: [],
  edges: [],
  setNetwork: (data)=> set(data)
}))
