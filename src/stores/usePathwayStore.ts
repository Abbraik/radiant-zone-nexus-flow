import { create } from 'zustand'

export type EdgeType = 'Authority' | 'Funding' | 'Data' | 'Coordination'

export interface ActorNode { id: string; actorId: string; x: number; y: number }
export interface PathEdge { id: string; sourceId: string; targetId: string; type: EdgeType }

interface PathwayGraph { bundleItemId: string; nodes: ActorNode[]; edges: PathEdge[] }

type PathwayState = {
  pathways: Record<string, PathwayGraph>
  getPathway: (bundleItemId: string) => PathwayGraph
  addNode: (bundleItemId: string, node: ActorNode) => void
  removeNode: (bundleItemId: string, nodeId: string) => void
  addEdge: (bundleItemId: string, edge: PathEdge) => void
  removeEdge: (bundleItemId: string, edgeId: string) => void
  setEdgeType: (bundleItemId: string, edgeId: string, type: EdgeType) => void
}

const ensure = (state: PathwayState, bundleItemId: string): PathwayGraph => {
  const g = state.pathways[bundleItemId]
  return g ?? { bundleItemId, nodes: [], edges: [] }
}

export const usePathwayStore = create<PathwayState>((set, get)=>({
  pathways: {},
  getPathway: (bundleItemId)=> get().pathways[bundleItemId] ?? { bundleItemId, nodes: [], edges: [] },
  addNode: (bundleItemId, node)=> set(s=>{
    const g = ensure(s, bundleItemId)
    return { pathways: { ...s.pathways, [bundleItemId]: { ...g, nodes: [...g.nodes, node] } } }
  }),
  removeNode: (bundleItemId, nodeId)=> set(s=>{
    const g = ensure(s, bundleItemId)
    return { pathways: { ...s.pathways, [bundleItemId]: { ...g, nodes: g.nodes.filter(n=>n.id!==nodeId), edges: g.edges.filter(e=> e.sourceId!==nodeId && e.targetId!==nodeId) } } }
  }),
  addEdge: (bundleItemId, edge)=> set(s=>{
    const g = ensure(s, bundleItemId)
    return { pathways: { ...s.pathways, [bundleItemId]: { ...g, edges: [...g.edges, edge] } } }
  }),
  removeEdge: (bundleItemId, edgeId)=> set(s=>{
    const g = ensure(s, bundleItemId)
    return { pathways: { ...s.pathways, [bundleItemId]: { ...g, edges: g.edges.filter(e=>e.id!==edgeId) } } }
  }),
  setEdgeType: (bundleItemId, edgeId, type)=> set(s=>{
    const g = ensure(s, bundleItemId)
    return { pathways: { ...s.pathways, [bundleItemId]: { ...g, edges: g.edges.map(e=> e.id===edgeId ? { ...e, type } : e) } } }
  }),
}))

// Helpers
export function topoOrder(nodes: ActorNode[], edges: PathEdge[]): string[] {
  const ids = nodes.map(n=>n.id)
  const inDeg: Record<string, number> = Object.fromEntries(ids.map(id=>[id,0]))
  edges.forEach(e=>{ inDeg[e.targetId] = (inDeg[e.targetId]??0)+1 })
  const q = ids.filter(id=> (inDeg[id]||0)===0)
  const order: string[] = []
  const adj: Record<string,string[]> = {}
  edges.forEach(e=>{ (adj[e.sourceId] ||= []).push(e.targetId) })
  while(q.length){
    const u = q.shift()!
    order.push(u)
    for(const v of (adj[u]||[])){
      inDeg[v] -= 1
      if(inDeg[v]===0) q.push(v)
    }
  }
  return order
}
