import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { ReactFlow, Background, Controls, useNodesState, useEdgesState, addEdge, type Connection, type Edge } from '@xyflow/react'
import '@xyflow/react/dist/style.css'
import { useActorStore } from '@/stores/useActorStore'
import { usePathwayStore, type EdgeType } from '@/stores/usePathwayStore'

const typeCycle: EdgeType[] = ['Authority','Funding','Data','Coordination']

export default function PathwayCanvas({ bundleItemId, lever }:{ bundleItemId: string; lever: 'N'|'P'|'S' }){
  const { actors } = useActorStore()
  const addNode = usePathwayStore(s=> s.addNode)
  const addEdgeStore = usePathwayStore(s=> s.addEdge)
  const setEdgeType = usePathwayStore(s=> s.setEdgeType)
  const g = usePathwayStore(s=> s.pathways[bundleItemId] ?? { bundleItemId, nodes: [], edges: [] })

  const initialNodes = g.nodes.map(n=>({ id: n.id, position: { x: n.x, y: n.y }, data: { label: actors.find(a=>a.id===n.actorId)?.name||n.actorId }, type: 'default' as const }))
  const initialEdges: Edge[] = g.edges.map(e=>({ id: e.id, source: e.sourceId, target: e.targetId, label: e.type, className: edgeClass(e.type), style: { stroke: 'currentColor' } }))

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const rfRef = useRef<HTMLDivElement | null>(null)

  useEffect(()=>{ setNodes(initialNodes) },[g.nodes.length])
  useEffect(()=>{ setEdges(initialEdges) },[g.edges.length])

  const onConnect = useCallback((c: Connection)=>{
    if (!c.source || !c.target) return
    const edgeId = `e-${crypto.randomUUID().slice(0,6)}`
    addEdgeStore(bundleItemId, { id: edgeId, sourceId: c.source, targetId: c.target, type: 'Authority' })
    setEdges(eds=> addEdge({ id: edgeId, source: c.source!, target: c.target!, label: 'Authority', className: edgeClass('Authority'), style:{ stroke:'currentColor'} }, eds))
  },[bundleItemId])

  const onDrop = useCallback((event: React.DragEvent)=>{
    event.preventDefault()
    const actorId = event.dataTransfer.getData('application/actor-id')
    if (!actorId) return
    const bounds = rfRef.current?.getBoundingClientRect()
    const pos = { x: (event.clientX - (bounds?.left||0)), y: (event.clientY - (bounds?.top||0)) }
    const nodeId = `n-${crypto.randomUUID().slice(0,6)}`
    addNode(bundleItemId, { id: nodeId, actorId, x: pos.x, y: pos.y })
    setNodes(nds=> [...nds, { id: nodeId, position: pos, data: { label: actors.find(a=>a.id===actorId)?.name||actorId }, type:'default' }])
  },[bundleItemId, actors])

  const onDragOver = (e: React.DragEvent)=>{ e.preventDefault(); e.dataTransfer.dropEffect='move' }

  const issues = useMemo(()=>{
    // Mandate Gate: edge source must include lever in authority or capabilities
    return g.edges.map(e=>{
      const srcNode = g.nodes.find(n=>n.id===e.sourceId)
      const actor = actors.find(a=> a.id === srcNode?.actorId)
      const ok = !!actor && (actor.authority.includes(lever) || actor.capabilities.includes(lever))
      return ok ? null : { edgeId: e.id, message: `Mandate gap: ${actor?.name||srcNode?.actorId} lacks authority for ${lever}.` }
    }).filter(Boolean) as { edgeId: string; message: string }[]
  },[g.edges, g.nodes, actors, lever])

  // Decorate edges with warnings
  useEffect(()=>{
    setEdges(eds=> eds.map(e=>{
      const warn = issues.some(i=> i.edgeId===e.id)
      return { ...e, label: warn ? `${e.label} ⚠︎` : e.label, className: warn ? 'text-destructive' : e.className }
    }))
  },[issues.length])

  const onEdgeClick = useCallback((_: any, edge: Edge)=>{
    const idx = typeCycle.indexOf((edge.label as EdgeType) || 'Authority')
    const next = typeCycle[(idx+1)%typeCycle.length]
    setEdgeType(bundleItemId, edge.id, next)
    setEdges(eds=> eds.map(e=> e.id===edge.id ? { ...e, label: next, className: edgeClass(next) } : e))
  },[bundleItemId])

  return (
    <div ref={rfRef} className="h-[520px] border rounded-lg bg-card/60" onDrop={onDrop} onDragOver={onDragOver}>
      <ReactFlow 
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        fitView
      >
        <Background />
        <Controls />
      </ReactFlow>
    </div>
  )
}

function edgeClass(t: EdgeType){
  switch(t){
    case 'Authority': return 'text-primary'
    case 'Funding': return 'text-success'
    case 'Data': return 'text-warning'
    case 'Coordination': return 'text-secondary'
    default: return 'text-primary'
  }
}
