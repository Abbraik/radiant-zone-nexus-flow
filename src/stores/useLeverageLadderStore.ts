import { create } from 'zustand'
import { scoreLPsForTarget } from '@/services/recommendation/scoreLPs'
import { useLoopRegistryStore } from '@/stores/useLoopRegistryStore'
import { useBundleStore } from '@/stores/useBundleStore'

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
  getCoverage: () => { loopCoverage: Record<string, string[]>; bundleCoverage: Record<string, string[]> }
  getCoverageStats: () => { lpCoverageCounts: Record<string, number> }
  recommendForTarget: (targetId: string, targetType: TargetType) => { lpId: string; score: number }[]
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

export const useLeverageLadderStore = create<LeverageLadderState>((set, get)=>({
  leveragePoints: defaultLPs,
  tags: [],
  addTag: (tag) => set((state)=>{
    const exists = state.tags.some(t=> t.lpId===tag.lpId && t.targetId===tag.targetId && t.targetType===tag.targetType)
    return exists ? state : { tags: [...state.tags, tag] }
  }),
  removeTag: (lpId, targetId, targetType) => set((state)=>({ tags: state.tags.filter(t=>!(t.lpId===lpId && t.targetId===targetId && t.targetType===targetType)) })),
  getCoverage: () => {
    const ts = get().tags
    const loopCoverage: Record<string, string[]> = {}
    const bundleCoverage: Record<string, string[]> = {}
    ts.forEach(t=>{
      const bucket = t.targetType==='loop' ? loopCoverage : t.targetType==='bundle' ? bundleCoverage : null
      if (!bucket) return
      bucket[t.targetId] = bucket[t.targetId] || []
      if (!bucket[t.targetId].includes(t.lpId)) bucket[t.targetId].push(t.lpId)
    })
    return { loopCoverage, bundleCoverage }
  },
  getCoverageStats: () => {
    const ts = get().tags
    const lpCoverageCounts: Record<string, number> = {}
    ts.forEach(t=>{ lpCoverageCounts[t.lpId] = (lpCoverageCounts[t.lpId]||0) + 1 })
    return { lpCoverageCounts }
  },
  recommendForTarget: (targetId, targetType) => {
    const { leveragePoints, tags } = get()
    const pref = (import.meta.env.VITE_PAGS_LP_PREF as 'high'|'mid'|'low') || 'high'
    const already = tags.filter(t=> t.targetId===targetId && t.targetType===targetType).map(t=>t.lpId)
    const lpInputs = leveragePoints.map(lp=> ({ lpId: lp.id, tier: lp.tier, families: lp.families }))

    // Gather target metadata
    let loopClass: 'R'|'B'|'N'|'C'|'T'|undefined
    let dominantFamily: string|undefined
    // Optional readiness (future): default medium
    let pathwayRiskPct: number|undefined
    let expectedLatencyDays: number|undefined

    if (targetType==='loop') {
      const l = useLoopRegistryStore.getState().loops.find(x=>x.id===targetId)
      loopClass = l?.class as any
      // readiness could be derived in future; keep defaults
    } else if (targetType==='bundle') {
      const b = useBundleStore.getState().bundles.find(x=>x.id===targetId) as any
      dominantFamily = b?.dominantFamily // optional property
    }

    const targetMeta = { id: targetId, type: targetType, loopClass, dominantFamily, pathwayRiskPct, expectedLatencyDays } as const

    return scoreLPsForTarget(lpInputs as any, already, targetMeta as any, pref)
  }
}))
