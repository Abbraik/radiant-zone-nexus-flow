import { create } from 'zustand'
import type { Bundle, BundleItem } from '@/types/bundles'
import type { Level } from '@/types/pags'
import { usePathwayStore } from '@/stores/usePathwayStore'
import { useLeverageLadderStore } from '@/stores/useLeverageLadderStore'

type BundleState = {
  bundles: Bundle[]
  loading: boolean
  fetchBundles: () => Promise<void>
  getBundle: (id: string) => Bundle | undefined
  createBundle: (level: Level) => Bundle
  saveBundle: (b: Bundle) => Promise<void>
  deleteItem: (bundleId: string, itemId: string) => void
  // New helpers for targeting and coverage
  setItemTargets: (
    bundleId: string,
    itemId: string,
    targets: { loopId: string; variableIds?: string[] }[]
  ) => void
  getCoverageMatrix: (
    bundle: Bundle,
    loops: { id: string }[]
  ) => { loopId: string; coveredBy: string[] }[]
}

const delay = (ms:number)=>new Promise(r=>setTimeout(r,ms))

const demo: Bundle = {
  id: 'BND-100',
  name: 'Youth Employment Starter',
  description: 'Narrative + program combo mapped to meso loops.',
  level: 'meso',
  items: [
    { id: 'I-1', title: 'Apprenticeship campaign', lever: 'N', targetLoops: ['EDU-421'], targetVariables: ['youth_contact_rate'], expectedEffect: 'Raise contact and re-enrollment' },
    { id: 'I-2', title: 'SME hiring subsidy', lever: 'P', targetLoops: [], targetVariables: [], expectedEffect: 'Shift hiring thresholds' },
  ],
  updatedAt: new Date().toISOString()
}

export const useBundleStore = create<BundleState>((set, get)=>({
  bundles: [demo],
  loading: false,
  fetchBundles: async ()=>{
    set({ loading: true })
    await delay(200)
    set({ loading: false })
  },
  getBundle: (id)=> get().bundles.find(b=>b.id===id),
  createBundle: (level)=> {
    const b: Bundle = {
      id: `BND-${crypto.randomUUID().slice(0,6).toUpperCase()}`,
      name: '',
      description: '',
      level,
      items: [],
      updatedAt: new Date().toISOString()
    }
    set(s=>({ bundles: [b, ...s.bundles] }))
    return b
  },
  saveBundle: async (b)=> {
    await delay(250)
    set(s=>({
      bundles: s.bundles.some(x=>x.id===b.id)
        ? s.bundles.map(x=> x.id===b.id ? { ...b, updatedAt: new Date().toISOString() } : x)
        : [ { ...b, updatedAt: new Date().toISOString() }, ...s.bundles ]
    }))
  },
  deleteItem: (bundleId, itemId)=> {
    set(s=>({
      bundles: s.bundles.map(b=> b.id!==bundleId ? b : { ...b, items: b.items.filter(i=>i.id!==itemId) })
    }))
  },
  setItemTargets: (bundleId, itemId, targets)=>{
    set(s=>({
      bundles: s.bundles.map(b=>{
        if (b.id !== bundleId) return b
        const items = b.items.map(it=>{
          if (it.id !== itemId) return it
          const loopIds = Array.from(new Set(targets.map(t=>t.loopId)))
          const variableIds = Array.from(new Set(targets.flatMap(t=> t.variableIds || [])))
          const next: BundleItem = { ...it, targetLoops: loopIds, targetVariables: variableIds }
          return next
        })
        return { ...b, items }
      })
    }))
  },
  getCoverageMatrix: (bundle, loops)=>{
    return loops.map(l=>({
      loopId: l.id,
      coveredBy: bundle.items.filter(it=> it.targetLoops.includes(l.id)).map(it=> it.id)
    }))
  }
}))

export function validateBundle(b: Bundle, loopsInScope?: { id: string }[]){
  const issues: string[] = []
  if (!b.name.trim()) issues.push('Bundle name is required.')

  const lpAssignments = useLeverageLadderStore.getState().itemAssignments || {}
  const pathwaysMap = usePathwayStore.getState().pathways || {}

  b.items.forEach((it, idx)=>{
    if (!it.title.trim()) issues.push(`Item ${idx+1}: title is required.`)
    if (it.targetLoops.length===0 && it.targetVariables.length===0) {
      issues.push(`Item ${idx+1}: must target at least one Loop or Variable.`)
    }
    const assign = lpAssignments[it.id]
    if (!assign?.lpId || !assign?.stage) {
      issues.push(`Item ${idx+1}: assign a Leverage Point and N/P/S stage.`)
    }
    const g = pathwaysMap[it.id]
    if (!g || (g.nodes?.length||0) < 2) {
      issues.push(`Item ${idx+1}: define a Pathway with ≥2 actors.`)
    }
  })

  // Governance: all loops in scope must be covered by at least one item
  if (loopsInScope && loopsInScope.length>0){
    const uncovered = loopsInScope.filter(l=> !b.items.some(it=> it.targetLoops.includes(l.id)))
    if (uncovered.length>0){
      uncovered.forEach(l=> issues.push(`Loop ${l.id} has no coverage.`))
    }
  }

  return { ok: issues.length===0, issues }
}
