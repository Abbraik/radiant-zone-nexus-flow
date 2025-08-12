import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ReactFlow,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
} from '@xyflow/react'
import '@xyflow/react/dist/style.css'

import { useActorStore } from '@/stores/useActorStore'
import { usePathwayStore } from '@/stores/usePathwayStore'
import { useBundleStore } from '@/stores/useBundleStore'
import { useLoopRegistryStore } from '@/stores/useLoopRegistryStore'
import { useNetworkStore, type NetworkActor, type NetworkEdge } from '@/stores/useNetworkStore'

const edgeColor: Record<string, string> = {
  Authority: '#3b82f6',
  Funding: '#22c55e',
  Data: '#f59e0b',
  Coordination: '#8b5cf6',
}
const levelColor: Record<string, string> = {
  micro: '#2563eb',
  meso: '#ea580c',
  macro: '#7c3aed',
}

export default function NetworkExplorer(){
  const { actors: actorCatalog, fetchActors } = useActorStore()
  const pathways = usePathwayStore(s=> s.pathways)
  const bundles = useBundleStore(s=> s.bundles)
  const loops = useLoopRegistryStore(s=> s.loops)
  const { actors, edges, setNetwork } = useNetworkStore()

  const [rel, setRel] = useState<'All'|'Authority'|'Funding'|'Data'|'Coordination'>('All')
  const [overlay, setOverlay] = useState<'None'|'micro'|'meso'|'macro'>('None')
  const [q, setQ] = useState('')
  const [selectedNode, setSelectedNode] = useState<NetworkActor|null>(null)
  const [selectedEdge, setSelectedEdge] = useState<NetworkEdge|null>(null)
  const nav = useNavigate()

  useEffect(()=>{ document.title = 'Network Explorer • INNOVATE'; fetchActors() },[])

  // Build network from pathway graphs + bundles
  useEffect(()=>{
    const actorMap = new Map<string, NetworkActor>()
    const edgeMap = new Map<string, NetworkEdge>()

    const findBundleItem = (itemId: string)=> {
      for (const b of bundles){
        const it = b.items.find(i=> i.id===itemId)
        if (it) return { bundle: b, item: it }
      }
      return undefined
    }

    Object.values(pathways).forEach(g=>{
      const ctx = findBundleItem(g.bundleItemId)
      const itemLoops = Array.from(new Set(ctx?.item.targetLoops || []))
      const itemVars = Array.from(new Set(ctx?.item.targetVariables || []))
      const loopLevels = itemLoops.map(id=> loops.find(l=>l.id===id)?.level).filter(Boolean) as ('micro'|'meso'|'macro')[]
      const majorityLevel = loopLevels.length ? mostCommon(loopLevels) : (ctx?.bundle.level || 'meso')

      // Nodes
      g.nodes.forEach(n=>{
        const actor = actorCatalog.find(a=> a.id===n.actorId)
        const base: NetworkActor = {
          id: actor?.id || n.actorId,
          name: actor?.name || n.actorId,
          orgType: (actor?.orgType as any) || 'NGO',
          level: majorityLevel as any,
          loopsAffected: itemLoops,
        }
        const prev = actorMap.get(base.id)
        if (!prev) actorMap.set(base.id, base)
        else actorMap.set(base.id, { ...prev, loopsAffected: Array.from(new Set([...prev.loopsAffected, ...itemLoops])) })
      })

      // Edges
      g.edges.forEach(e=>{
        const src = g.nodes.find(n=> n.id===e.sourceId)?.actorId
        const tgt = g.nodes.find(n=> n.id===e.targetId)?.actorId
        if (!src || !tgt) return
        const key = `${src}->${tgt}:${e.type}`
        const prev = edgeMap.get(key)
        const shared = Array.from(new Set([...(prev?.sharedNodes||[]), ...itemLoops, ...itemVars]))
        edgeMap.set(key, { id: key, sourceId: src, targetId: tgt, type: e.type as any, sharedNodes: shared })
      })
    })

    setNetwork({ actors: Array.from(actorMap.values()), edges: Array.from(edgeMap.values()) })
  },[pathways, bundles, actorCatalog, loops, setNetwork])

  const filtered = useMemo(()=>{
    const nodes = actors.filter(a=> !q || a.name.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase()))
    const nodeIds = new Set(nodes.map(n=> n.id))
    const links = edges.filter(e=> (rel==='All' || e.type===rel) && nodeIds.has(e.sourceId) && nodeIds.has(e.targetId))
    return { nodes, links }
  },[actors, edges, rel, q])

  const { rfNodes, rfEdges } = useMemo(()=> buildFlow(filtered.nodes, filtered.links, overlay), [filtered, overlay])

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
      <div className="lg:col-span-3 space-y-3">
        <Toolbar rel={rel} setRel={setRel} overlay={overlay} setOverlay={setOverlay} q={q} setQ={setQ} />
        <div className="h-[70vh] rounded-lg border bg-card/60">
          <ReactFlow nodes={rfNodes} edges={rfEdges} fitView onNodeClick={(_, n:any)=>{ setSelectedEdge(null); setSelectedNode({ id: n.id, name: n.data.label, orgType: n.data.orgType, level: n.data.level, loopsAffected: [] }) }} onEdgeClick={(_, e:any)=>{ setSelectedNode(null); setSelectedEdge({ id: e.id, sourceId: e.source, targetId: e.target, type: e.label, sharedNodes: [] }) }}>
            <Background />
            <Controls />
          </ReactFlow>
        </div>
      </div>
      <aside className="lg:col-span-1 space-y-3">
        <DetailsPanel node={selectedNode} edge={selectedEdge} onViewLoops={(loopId)=> nav(`/monitor/loop-health?loop=${encodeURIComponent(loopId)}`)} />
      </aside>
    </div>
  )
}

function Toolbar({ rel, setRel, overlay, setOverlay, q, setQ }:{ rel:any; setRel:any; overlay:any; setOverlay:any; q:string; setQ:(s:string)=>void }){
  return (
    <div className="p-2 rounded-lg border bg-card/60 flex flex-wrap items-center gap-2">
      <label className="text-sm flex items-center gap-2">Relationship
        <select value={rel} onChange={e=>setRel(e.target.value)} className="border rounded px-2 py-1">
          {(['All','Authority','Funding','Data','Coordination'] as const).map(r=> <option key={r} value={r}>{r}</option>)}
        </select>
      </label>
      <label className="text-sm flex items-center gap-2">Overlay
        <select value={overlay} onChange={e=>setOverlay(e.target.value)} className="border rounded px-2 py-1">
          {(['None','micro','meso','macro'] as const).map(o=> <option key={o} value={o}>{o}</option>)}
        </select>
      </label>
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search actor/org" className="border rounded px-2 py-1 flex-1 min-w-[160px]"/>
    </div>
  )
}

function buildFlow(nodes: NetworkActor[], links: NetworkEdge[], overlay: 'None'|'micro'|'meso'|'macro'){
  const center = { x: 0, y: 0 }
  const R = 250
  const angleStep = (Math.PI * 2) / Math.max(1, nodes.length)
  const positions: Record<string, {x:number;y:number}> = {}
  nodes.forEach((n, i)=>{
    positions[n.id] = { x: center.x + R * Math.cos(i*angleStep), y: center.y + R * Math.sin(i*angleStep) }
  })

  const rfNodes = nodes.map(n=>({
    id: n.id,
    position: positions[n.id],
    data: { label: n.name, orgType: n.orgType, level: n.level },
    style: {
      background: '#fff',
      border: `2px solid ${levelColor[n.level] || '#94a3b8'}`,
      color: '#111827',
      padding: 6,
      borderRadius: n.orgType==='Private' ? 16 : n.orgType==='Gov' ? 4 : 8,
      boxShadow: overlay!=='None' && n.level===overlay ? `0 0 0 6px ${(levelColor[n.level]||'#64748b')}33` : undefined,
      transform: n.orgType==='NGO' ? 'rotate(45deg)' : undefined,
      width: 140,
    }
  }))

  const rfEdges = links.map(l=>({
    id: l.id,
    source: l.sourceId,
    target: l.targetId,
    label: l.type,
    animated: false,
    style: { stroke: edgeColor[l.type] || '#94a3b8' },
  }))

  return { rfNodes, rfEdges }
}

function DetailsPanel({ node, edge, onViewLoops }:{ node: NetworkActor|null; edge: NetworkEdge|null; onViewLoops: (id:string)=>void }){
  if (node){
    return (
      <div className="p-3 rounded-lg border bg-card text-card-foreground space-y-2">
        <div className="font-medium">{node.name}</div>
        <div className="text-xs opacity-70">{node.id} • {node.orgType} • {node.level}</div>
        <div className="mt-2">
          <div className="text-sm font-medium mb-1">Affected Loops</div>
          {node.loopsAffected.length===0 ? <div className="text-sm opacity-70">None</div> : (
            <ul className="text-sm space-y-1">
              {node.loopsAffected.map(id=> <li key={id}><button className="underline" onClick={()=>onViewLoops(id)}>{id}</button></li>)}
            </ul>
          )}
        </div>
      </div>
    )
  }
  if (edge){
    return (
      <div className="p-3 rounded-lg border bg-card text-card-foreground space-y-2">
        <div className="font-medium">{edge.sourceId} → {edge.targetId}</div>
        <div className="text-xs opacity-70">Type: {edge.type}</div>
        <div className="mt-2">
          <div className="text-sm font-medium mb-1">Shared Nodes</div>
          {edge.sharedNodes.length===0 ? <div className="text-sm opacity-70">None</div> : (
            <ul className="text-sm space-y-1 max-h-40 overflow-auto">
              {edge.sharedNodes.map(id=> <li key={id}>{id}</li>)}
            </ul>
          )}
        </div>
      </div>
    )
  }
  return (
    <div className="p-3 rounded-lg border bg-card text-card-foreground">
      <div className="text-sm opacity-70">Select a node or edge to see details.</div>
    </div>
  )
}

function mostCommon(arr: string[]){
  const map: Record<string, number> = {}
  arr.forEach(v=> map[v] = (map[v]||0)+1)
  return Object.entries(map).sort((a,b)=> b[1]-a[1])[0]?.[0] || arr[0]
}
