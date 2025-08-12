import { create } from 'zustand'

export type ChangeType = 'Loop'|'Bundle'|'Pathway'
export type ChangeStatus = 'Draft'|'In Review'|'Ready'

export type DiffFormat = 'json'|'text'
export interface ChangeDiff { before: any; after: any; format: DiffFormat }

export interface ChangeItem {
  id: string
  type: ChangeType
  name: string
  submitter: string
  updatedAt: string
  status: ChangeStatus
  diff: ChangeDiff
  evidenceIds: string[]
  lastPublishedAt?: string // for integrity banner (fixture age)
}

export interface EvidenceItem {
  id: string
  title: string
  linkedIds: string[]
  quality: number // 1..5
  submitter: string
  fileUrl?: string
  text?: string
}

type ChangesQueueState = {
  changes: ChangeItem[]
  evidence: EvidenceItem[]
  setChanges: (items: ChangeItem[]) => void
  setEvidence: (items: EvidenceItem[]) => void
  linkEvidence: (evidenceId: string, changeId: string) => void
  setEvidenceQuality: (evidenceId: string, q: number) => void
  canPublish: (changeId: string) => boolean
  publishAllEnabled: () => boolean
  hasStaleFixtures: (days: number) => boolean
}

const nowIso = ()=> new Date().toISOString()
const daysAgo = (n:number)=> new Date(Date.now()-n*24*3600*1000).toISOString()

const mockChanges: ChangeItem[] = [
  { id: 'chg-1', type: 'Loop', name: 'EDU-421 • Re-Enrollment', submitter: 'sara', updatedAt: nowIso(), status: 'In Review', diff: { format: 'json', before: { dominance: 0.62 }, after: { dominance: 0.65 } }, evidenceIds: ['ev-1'], lastPublishedAt: daysAgo(45) },
  { id: 'chg-2', type: 'Bundle', name: 'Youth Employment Starter', submitter: 'lee', updatedAt: nowIso(), status: 'Draft', diff: { format: 'text', before: 'No SME subsidy', after: 'Added SME hiring subsidy' }, evidenceIds: [], lastPublishedAt: daysAgo(10) },
  { id: 'chg-3', type: 'Pathway', name: 'Apprenticeship Campaign Path', submitter: 'amina', updatedAt: nowIso(), status: 'Ready', diff: { format: 'json', before: { edges: 3 }, after: { edges: 4 } }, evidenceIds: ['ev-2'], lastPublishedAt: daysAgo(62) },
]

const mockEvidence: EvidenceItem[] = [
  { id: 'ev-1', title: 'Admin dataset Q2', linkedIds: ['chg-1'], quality: 4, submitter: 'data.ops', fileUrl: undefined, text: 'Quarterly admin dataset indicates uptick.' },
  { id: 'ev-2', title: 'Stakeholder workshop notes', linkedIds: ['chg-3'], quality: 3, submitter: 'policy.unit', text: 'Alignment achieved with Chamber of Commerce.' },
  { id: 'ev-3', title: 'Survey snippet', linkedIds: [], quality: 2, submitter: 'field.agent', text: 'Preliminary youth survey sample.' },
]

export const useChangesQueueStore = create<ChangesQueueState>((set, get)=>({
  changes: mockChanges,
  evidence: mockEvidence,
  setChanges: (items)=> set({ changes: items }),
  setEvidence: (items)=> set({ evidence: items }),
  linkEvidence: (evidenceId, changeId)=> set((s)=> ({
    evidence: s.evidence.map(e=> e.id===evidenceId ? { ...e, linkedIds: Array.from(new Set([...e.linkedIds, changeId])) } : e),
    changes: s.changes.map(c=> c.id===changeId ? { ...c, evidenceIds: Array.from(new Set([...c.evidenceIds, evidenceId])) } : c)
  })),
  setEvidenceQuality: (evidenceId, q)=> set((s)=> ({ evidence: s.evidence.map(e=> e.id===evidenceId ? { ...e, quality: q } : e) })),
  canPublish: (changeId)=>{
    const s = get()
    const c = s.changes.find(x=>x.id===changeId)
    if (!c || c.status!=='Ready') return false
    const evs = s.evidence.filter(e=> c.evidenceIds.includes(e.id))
    return evs.some(e=> e.quality>=3)
  },
  publishAllEnabled: ()=>{
    const s = get()
    const ready = s.changes.filter(c=> c.status==='Ready')
    if (ready.length===0) return false
    return ready.every(c=> s.evidence.filter(e=> c.evidenceIds.includes(e.id)).some(e=> e.quality>=3))
  },
  hasStaleFixtures: (days)=>{
    const cutoff = Date.now() - days*24*3600*1000
    return get().changes.some(c=> c.lastPublishedAt && new Date(c.lastPublishedAt).getTime() < cutoff)
  }
}))
