import { create } from 'zustand'

export type LeverFamily = 'Legal & Institutional' | 'Economic & Fiscal' | 'Administrative & Executive' | 'Communicative & Normative' | 'Behavioral & Social' | 'International & Global'
export type TargetType = 'loop' | 'bundle' | 'policy'

export interface LeveragePoint {
  id: string
  name: string
  description: string
  tier: 'high' | 'mid' | 'low'
  families: LeverFamily[]
}

export interface LeverTag {
  lpId: string
  targetId: string
  targetType: TargetType
}

type LeverageLadderState = {
  leveragePoints: LeveragePoint[]
  tags: LeverTag[]
  addTag: (tag: LeverTag) => void
  removeTag: (lpId: string, targetId: string, targetType: TargetType) => void
}

const defaultLPs: LeveragePoint[] = [
  { id: 'LP12', name: 'Parameters', description: 'Adjust numbers, constants, coefficients in the system', tier: 'low', families: ['Economic & Fiscal','Administrative & Executive'] },
  { id: 'LP11', name: 'Buffers', description: 'Change the sizes of stabilizing stocks and buffers', tier: 'low', families: ['Economic & Fiscal','Legal & Institutional'] },
  { id: 'LP10', name: 'Stock-and-Flow Structure', description: 'Modify physical system structure and constraints', tier: 'low', families: ['Administrative & Executive','Legal & Institutional'] },
  { id: 'LP9', name: 'Delays', description: 'Adjust the length of delays relative to system change rate', tier: 'low', families: ['Administrative & Executive'] },
  { id: 'LP8', name: 'Balancing Feedbacks', description: 'Strengthen or weaken stabilizing (balancing) loops', tier: 'low', families: ['Administrative & Executive','Behavioral & Social'] },
  { id: 'LP7', name: 'Reinforcing Feedbacks', description: 'Change the gain around reinforcing feedback loops', tier: 'mid', families: ['Behavioral & Social','Communicative & Normative'] },
  { id: 'LP6', name: 'Information Flows', description: 'Redesign who gets what information and when', tier: 'mid', families: ['Communicative & Normative','Administrative & Executive'] },
  { id: 'LP5', name: 'Rules of the System', description: 'Change incentives, punishments, and constraints', tier: 'mid', families: ['Legal & Institutional','Economic & Fiscal'] },
  { id: 'LP4', name: 'Self-Organization', description: 'Encourage system to add/change structure, diversity', tier: 'high', families: ['Legal & Institutional','International & Global'] },
  { id: 'LP3', name: 'Goals of the System', description: 'Shift system priorities and goals', tier: 'high', families: ['Administrative & Executive','Legal & Institutional'] },
  { id: 'LP2', name: 'Paradigms', description: 'Change the mindset or paradigm out of which the system arises', tier: 'high', families: ['Communicative & Normative','Behavioral & Social'] },
  { id: 'LP1', name: 'Transcending Paradigms', description: 'See paradigms as constructs and move between them', tier: 'high', families: ['Communicative & Normative','International & Global'] },
]

export const useLeverageLadderStore = create<LeverageLadderState>((set)=>({
  leveragePoints: defaultLPs,
  tags: [],
  addTag: (tag) => set((state)=>{
    const exists = state.tags.some(t=> t.lpId===tag.lpId && t.targetId===tag.targetId && t.targetType===tag.targetType)
    return exists ? state : { tags: [...state.tags, tag] }
  }),
  removeTag: (lpId, targetId, targetType) => set((state)=>({ tags: state.tags.filter(t=>!(t.lpId===lpId && t.targetId===targetId && t.targetType===targetType)) }))
}))
