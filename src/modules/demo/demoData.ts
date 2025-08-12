import type { Bundle } from '@/types/bundles'
import type { Level } from '@/types/pags'
import { useLoopRegistryStore } from '@/stores/useLoopRegistryStore'
import { useVariableRegistryStore } from '@/stores/useVariableRegistryStore'
import { useBundleStore } from '@/stores/useBundleStore'
import { usePathwayStore, type ActorNode, type PathEdge } from '@/stores/usePathwayStore'
import { useLeverageLadderStore } from '@/stores/useLeverageLadderStore'
import { useChangesQueueStore } from '@/stores/useChangesQueueStore'
import { useNetworkStore } from '@/stores/useNetworkStore'

export type DemoCaseId = 'youth-employment'|'fertility-housing'|'service-throughput'

export type DemoCase = {
  id: DemoCaseId
  title: string
  description: string
  durationMin: number
  loops: Array<{
    id: string; name: string; type: 'Reactive'|'Structural'|'Perceptual'; class: 'R'|'B'|'N'|'C'|'T'; level: Level; pillar: 'Population'|'Behavior'|'Resource'|'Economic'|'Resilience'; dominance: number; gain: number; confidence: number; tierAnchors: {t1:number;t2:number;t3:number}; sharedNodes: string[]; deBand: {low:number;high:number}
  }>
  bundles: Bundle[]
  pathways: Array<{ bundleItemId: string; nodes: ActorNode[]; edges: PathEdge[] }>
  assignments: Record<string, { lpId: string; stage: 'N'|'P'|'S' }>
  changes: ReturnType<typeof useChangesQueueStore.getState>['changes']
  evidence: ReturnType<typeof useChangesQueueStore.getState>['evidence']
}

const youthEmployment: DemoCase = {
  id: 'youth-employment',
  title: 'Youth Employment',
  description: 'Reduce youth unemployment via re-enrollment, apprenticeships, and SME incentives.',
  durationMin: 12,
  loops: [
    { id: 'EDU-421', name: 'Secondary Re-Enrollment Reflex', type: 'Structural', class: 'B', level: 'meso', pillar: 'Behavior', dominance: 0.65, gain: 0.22, confidence: 0.8, tierAnchors: { t1: 0.5, t2: 0.3, t3: 0.2 }, sharedNodes: ['school_dropout_rate','youth_contact_rate'], deBand: { low: 0.1, high: 0.3 } },
    { id: 'LAB-310', name: 'Youth Unemployment Rate', type: 'Reactive', class: 'R', level: 'macro', pillar: 'Economic', dominance: 0.58, gain: 0.12, confidence: 0.76, tierAnchors: { t1: 0.4, t2: 0.35, t3: 0.25 }, sharedNodes: ['youth_contact_rate'], deBand: { low: 0.2, high: 0.5 } },
    { id: 'TVT-118', name: 'Apprenticeship Capacity Loop', type: 'Structural', class: 'B', level: 'micro', pillar: 'Resource', dominance: 0.44, gain: 0.05, confidence: 0.7, tierAnchors: { t1: 0.3, t2: 0.4, t3: 0.3 }, sharedNodes: [], deBand: { low: 0.15, high: 0.45 } },
  ],
  bundles: [
    {
      id: 'BND-YE-1',
      name: 'Youth Employment Starter',
      description: 'Narrative + program combo mapped to meso/macro loops.',
      level: 'meso',
      items: [
        { id: 'YE-I-1', title: 'Apprenticeship campaign', lever: 'N', targetLoops: ['EDU-421','TVT-118'], targetVariables: ['youth_contact_rate'], expectedEffect: 'Raise contact and re-enrollment' },
        { id: 'YE-I-2', title: 'SME hiring subsidy', lever: 'P', targetLoops: ['LAB-310'], targetVariables: [], expectedEffect: 'Shift hiring thresholds' },
      ],
      updatedAt: new Date().toISOString(),
    },
    {
      id: 'BND-YE-2',
      name: 'Youth Services Optimization',
      description: 'Improve intake throughput and reduce drop-offs.',
      level: 'micro',
      items: [
        { id: 'YE-I-3', title: 'One-stop intake desk', lever: 'S', targetLoops: ['TVT-118'], targetVariables: [], expectedEffect: 'Reduce processing delays' },
      ],
      updatedAt: new Date().toISOString(),
    }
  ],
  pathways: [
    { bundleItemId: 'YE-I-1', nodes: [
      { id: 'n1', actorId: 'MOE', x: 100, y: 120 },
      { id: 'n2', actorId: 'NGO-Y', x: 300, y: 120 },
      { id: 'n3', actorId: 'CHAM', x: 200, y: 260 },
    ], edges: [
      { id: 'e1', sourceId: 'n1', targetId: 'n2', type: 'Coordination' },
      { id: 'e2', sourceId: 'n2', targetId: 'n3', type: 'Data' },
      { id: 'e3', sourceId: 'n3', targetId: 'n1', type: 'Authority' },
    ]},
    { bundleItemId: 'YE-I-2', nodes: [
      { id: 'm1', actorId: 'MOL', x: 120, y: 110 },
      { id: 'm2', actorId: 'CHAM', x: 280, y: 210 },
    ], edges: [ { id: 'em1', sourceId: 'm1', targetId: 'm2', type: 'Funding' } ]},
  ],
  assignments: {
    'YE-I-1': { lpId: 'LP7', stage: 'N' },
    'YE-I-2': { lpId: 'LP5', stage: 'P' },
    'YE-I-3': { lpId: 'LP10', stage: 'S' },
  },
  changes: [
    { id: 'chg-ye-1', type: 'Loop', name: 'EDU-421 • Re-Enrollment', submitter: 'sara', updatedAt: new Date().toISOString(), status: 'In Review', diff: { format: 'json', before: { dominance: 0.62 }, after: { dominance: 0.65 } }, evidenceIds: ['ev-ye-1'], lastPublishedAt: new Date(Date.now()-45*24*3600*1000).toISOString() },
    { id: 'chg-ye-2', type: 'Pathway', name: 'Apprenticeship Campaign Path', submitter: 'amina', updatedAt: new Date().toISOString(), status: 'Ready', diff: { format: 'json', before: { edges: 3 }, after: { edges: 4 } }, evidenceIds: ['ev-ye-2'], lastPublishedAt: new Date(Date.now()-20*24*3600*1000).toISOString() },
  ],
  evidence: [
    { id: 'ev-ye-1', title: 'Admin dataset Q2', linkedIds: ['chg-ye-1'], quality: 4, submitter: 'data.ops', text: 'Quarterly dataset indicates uptick.' },
    { id: 'ev-ye-2', title: 'Workshop notes', linkedIds: ['chg-ye-2'], quality: 3, submitter: 'policy.unit', text: 'Stakeholder alignment achieved.' },
  ],
}

const fertilityHousing: DemoCase = {
  id: 'fertility-housing',
  title: 'Fertility & Housing',
  description: 'Balance family formation incentives with affordable housing supply.',
  durationMin: 14,
  loops: [
    { id: 'DEM-210', name: 'Fertility Expectation Loop', type: 'Perceptual', class: 'N', level: 'macro', pillar: 'Population', dominance: 0.52, gain: 0.06, confidence: 0.7, tierAnchors: { t1: 0.4, t2: 0.35, t3: 0.25 }, sharedNodes: [], deBand: { low: 0.2, high: 0.6 } },
    { id: 'HOU-330', name: 'Affordable Housing Stock', type: 'Structural', class: 'B', level: 'meso', pillar: 'Resource', dominance: 0.61, gain: 0.08, confidence: 0.78, tierAnchors: { t1: 0.3, t2: 0.4, t3: 0.3 }, sharedNodes: [], deBand: { low: 0.25, high: 0.55 } },
  ],
  bundles: [
    { id: 'BND-FH-1', name: 'Starter Homes Acceleration', description: 'Permitting and subsidies', level: 'meso', items: [ { id: 'FH-I-1', title: 'Permitting fast-track', lever: 'S', targetLoops: ['HOU-330'], targetVariables: [], expectedEffect: 'Reduce time to build' } ], updatedAt: new Date().toISOString() },
  ],
  pathways: [ { bundleItemId: 'FH-I-1', nodes: [ { id: 'h1', actorId: 'WB', x: 160, y: 140 }, { id: 'h2', actorId: 'CHAM', x: 300, y: 180 } ], edges: [ { id: 'eh1', sourceId: 'h1', targetId: 'h2', type: 'Funding' } ] } ],
  assignments: { 'FH-I-1': { lpId: 'LP5', stage: 'S' } },
  changes: [ { id: 'chg-fh-1', type: 'Bundle', name: 'Starter Homes Acceleration', submitter: 'lee', updatedAt: new Date().toISOString(), status: 'Draft', diff: { format: 'text', before: 'No fast-track', after: 'Introduced fast-track' }, evidenceIds: [] } ],
  evidence: [ { id: 'ev-fh-1', title: 'Planning report', linkedIds: [], quality: 4, submitter: 'planning.unit', text: 'Backlog analysis.' } ],
}

const serviceThroughput: DemoCase = {
  id: 'service-throughput',
  title: 'Service Throughput',
  description: 'Increase frontline service throughput while maintaining quality.',
  durationMin: 10,
  loops: [
    { id: 'SRV-101', name: 'Clinic Staffing Loop', type: 'Structural', class: 'B', level: 'micro', pillar: 'Behavior', dominance: 0.48, gain: -0.05, confidence: 0.7, tierAnchors: { t1: 0.3, t2: 0.4, t3: 0.3 }, sharedNodes: [], deBand: { low: 0.35, high: 0.55 } },
    { id: 'SRV-205', name: 'Queue Abandonment', type: 'Reactive', class: 'R', level: 'meso', pillar: 'Behavior', dominance: 0.55, gain: 0.04, confidence: 0.68, tierAnchors: { t1: 0.4, t2: 0.35, t3: 0.25 }, sharedNodes: [], deBand: { low: 0.2, high: 0.5 } },
  ],
  bundles: [ { id: 'BND-ST-1', name: 'Throughput Booster', description: 'Scheduling + triage', level: 'micro', items: [ { id: 'ST-I-1', title: 'Smart scheduling', lever: 'N', targetLoops: ['SRV-101'], targetVariables: [], expectedEffect: 'Smoother arrivals' } ], updatedAt: new Date().toISOString() } ],
  pathways: [ { bundleItemId: 'ST-I-1', nodes: [ { id: 's1', actorId: 'NGO-Y', x: 180, y: 120 }, { id: 's2', actorId: 'MOL', x: 300, y: 220 } ], edges: [ { id: 'es1', sourceId: 's1', targetId: 's2', type: 'Coordination' } ] } ],
  assignments: { 'ST-I-1': { lpId: 'LP7', stage: 'N' } },
  changes: [ { id: 'chg-st-1', type: 'Pathway', name: 'Throughput Booster Pathway', submitter: 'amina', updatedAt: new Date().toISOString(), status: 'Ready', diff: { format: 'json', before: { edges: 1 }, after: { edges: 2 } }, evidenceIds: ['ev-st-1'] } ],
  evidence: [ { id: 'ev-st-1', title: 'Pilot results', linkedIds: ['chg-st-1'], quality: 5, submitter: 'ops.team', text: 'Pilot shows 18% throughput increase.' } ],
}

export const DEMO_CASES: DemoCase[] = [youthEmployment, fertilityHousing, serviceThroughput]

export function applyDemoCase(id: DemoCaseId){
  const demo = DEMO_CASES.find(c=>c.id===id)
  if (!demo) return

  // 1) Loops into registry
  const loops = demo.loops
  useLoopRegistryStore.setState({ loops, loading: false })

  // 2) Bundles
  useBundleStore.setState({ bundles: demo.bundles, loading: false })

  // 3) Pathways per item
  const pathwaysMap: Record<string, any> = {}
  demo.pathways.forEach(p=>{ pathwaysMap[p.bundleItemId] = { bundleItemId: p.bundleItemId, nodes: p.nodes, edges: p.edges } })
  usePathwayStore.setState({ pathways: pathwaysMap })

  // 4) LP assignments
  useLeverageLadderStore.setState({ itemAssignments: { ...demo.assignments } })

  // 5) Changes queue & evidence
  useChangesQueueStore.setState({ changes: demo.changes, evidence: demo.evidence })

  // 6) Clear network (will be rebuilt from pathways when visiting)
  useNetworkStore.setState({ actors: [], edges: [] })
}
