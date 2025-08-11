import { create } from 'zustand'
import type { LoopDraft, LoopRecord, Variable, Edge } from '@/types/pags'

type StudioState = {
  draft: LoopDraft
  isDirty: boolean
  loadNew: (initial?: Partial<LoopDraft>) => void
  addVariable: (name: string, isShared?: boolean, unit?: string) => void
  removeVariable: (id: string) => void
  addEdge: (fromVarId: string, toVarId: string, polarity: '+'|'-') => void
  toggleDelay: (edgeId: string) => void
  setEdgeWeight: (edgeId: string, w: number) => void
  updateMeta: (partial: Partial<LoopDraft>) => void
  validate: () => { ok: boolean; issues: string[] }
  saveDraft: () => Promise<void>
  submitDraft: () => Promise<{ draftId: string }>
  publishDraft: () => Promise<LoopRecord>
}

const delay = (ms:number)=>new Promise(r=>setTimeout(r,ms))

const emptyDraft: LoopDraft = {
  draftId: crypto.randomUUID(),
  name: '',
  type: 'Structural',
  class: 'B',
  level: 'meso',
  pillar: 'Behavior',
  variables: [],
  edges: [],
  sharedNodes: [],
  deBand: { low: 0.1, high: 0.3 },
  thresholds: { soft: 0.15, hard: 0.3 },
  leveragePath: ['N'],
  tierAnchors: { t1: 0.5, t2: 0.3, t3: 0.2 },
  expectedLagDays: 90,
  evaluationNote: '',
  triggerNote: '',
  confidence: 0.5
}

export const useLoopStudioStore = create<StudioState>((set,get)=>({
  draft: emptyDraft,
  isDirty: false,
  loadNew: (initial)=> set({ draft: { ...emptyDraft, ...initial, draftId: crypto.randomUUID() }, isDirty: false }),
  addVariable: (name, isShared=false, unit)=> set(s=>{
    const v: Variable = { id: crypto.randomUUID(), name, isShared, unit }
    return { draft: { ...s.draft, variables: [...s.draft.variables, v] }, isDirty: true }
  }),
  removeVariable: (id)=> set(s=>{
    const vars = s.draft.variables.filter(v=>v.id!==id)
    const edges = s.draft.edges.filter(e=>e.fromVarId!==id && e.toVarId!==id)
    return { draft: { ...s.draft, variables: vars, edges }, isDirty: true }
  }),
  addEdge: (fromVarId,toVarId,polarity)=> set(s=>{
    const id = crypto.randomUUID()
    const edge: Edge = { id, fromVarId, toVarId, polarity, delay:false, weight: 0.5 }
    return { draft: { ...s.draft, edges: [...s.draft.edges, edge] }, isDirty: true }
  }),
  toggleDelay: (edgeId)=> set(s=>({ draft: { ...s.draft, edges: s.draft.edges.map(e=> e.id===edgeId? { ...e, delay: !e.delay }: e ) }, isDirty: true })),
  setEdgeWeight: (edgeId,w)=> set(s=>({ draft: { ...s.draft, edges: s.draft.edges.map(e=> e.id===edgeId? { ...e, weight: Math.max(0, Math.min(1,w)) }: e ) }, isDirty: true })),
  updateMeta: (partial)=> set(s=>({ draft: { ...s.draft, ...partial }, isDirty: true })),
  validate: ()=>{
    const d = get().draft
    const issues: string[] = []
    if (!d.name.trim()) issues.push('Name is required.')
    if (!d.variables.length) issues.push('At least one variable is required.')
    if (!d.edges.length) issues.push('At least one causal edge is required.')
    if (d.deBand.low >= d.deBand.high) issues.push('DE band low must be < high.')
    if (!d.leveragePath.length) issues.push('Select at least one leverage class (N/P/S).')
    if (d.tierAnchors.t1 + d.tierAnchors.t2 + d.tierAnchors.t3 <= 0) issues.push('Tier anchors must sum to > 0.')
    if (d.sharedNodes.length===0) issues.push('Pick at least one Shared Node (SNL) for coherence.')
    return { ok: issues.length===0, issues }
  },
  saveDraft: async ()=>{
    await delay(200)
  },
  submitDraft: async ()=>{
    await delay(250)
    return { draftId: get().draft.draftId }
  },
  publishDraft: async ()=>{
    await delay(300)
    const d = get().draft
    const rec: LoopRecord = {
      id: `L-${d.draftId.slice(0,6).toUpperCase()}`,
      name: d.name,
      type: d.type,
      class: d.class,
      level: d.level,
      pillar: d.pillar,
      variables: d.variables,
      edges: d.edges,
      sharedNodes: d.sharedNodes,
      deBand: d.deBand,
      thresholds: d.thresholds,
      triggerNote: d.triggerNote,
      leveragePath: d.leveragePath,
      tierAnchors: d.tierAnchors,
      expectedLagDays: d.expectedLagDays,
      evaluationNote: d.evaluationNote,
      confidence: d.confidence,
      version: 1,
      dominance: 0.5,
      gain: 0.2
    }
    return rec
  }
}))
