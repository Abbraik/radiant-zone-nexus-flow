import React, { useEffect, useMemo, useState } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useBundleStore } from '@/stores/useBundleStore'
import { useActorStore } from '@/stores/useActorStore'
import { usePathwayStore, topoOrder } from '@/stores/usePathwayStore'
import ActorPalette from '@/components/act/ActorPalette'
import PathwayCanvas from '@/components/act/PathwayCanvas'
import MandateGateDrawer, { type MandateIssue } from '@/components/act/MandateGateDrawer'

export default function PathwayBuilderPage(){
  const { bundleId, itemId } = useParams()
  const nav = useNavigate()
  const { getBundle } = useBundleStore()
  const { fetchActors } = useActorStore()
  const { getPathway } = usePathwayStore()

  useEffect(()=>{ document.title = 'Pathway Builder • ACT'; fetchActors() },[])

  if (!bundleId || !itemId) return <div className="p-6">Invalid route.</div>
  const b = getBundle(bundleId)
  const item = b?.items.find(i=>i.id===itemId)
  if (!b || !item) return (
    <div className="p-6 space-y-2">
      <p>Bundle or item not found.</p>
      <button className="px-3 py-2 rounded border" onClick={()=>nav(-1)}>Back</button>
    </div>
  )

  const g = getPathway(item.id)

  const issues: MandateIssue[] = useMemo(()=>{
    return g.edges.map(e=>{
      // Will be recomputed inside canvas too for styling
      return { edgeId: e.id, message: '' }
    }).filter(()=>false) as MandateIssue[]
  },[g.edges])

  const orderIds = topoOrder(g.nodes, g.edges)

  return (
    <div className="p-4 space-y-4">
      <header className="flex items-center justify-between">
        <div>
          <div className="text-xs opacity-70"><Link className="underline" to={`/act/bundles/${bundleId}`}>Back to Bundle</Link></div>
          <h1 className="text-lg font-semibold">Pathway Builder — {item.title || item.id}</h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        <div className="lg:col-span-1">
          <ActorPalette />
        </div>
        <div className="lg:col-span-2">
          <PathwayCanvas bundleItemId={item.id} lever={item.lever} />
        </div>
        <div className="lg:col-span-1 space-y-3">
          <div className="p-3 border rounded-lg bg-card text-card-foreground">
            <div className="font-medium mb-2">Execution Order</div>
            {orderIds.length===0 ? <div className="text-sm opacity-70">Add actors and connect edges to see the order.</div> : (
              <ol className="list-decimal ml-5 text-sm space-y-1">
                {orderIds.map((id)=> {
                  const node = g.nodes.find(n=>n.id===id)
                  return <li key={id}>{node?.actorId}</li>
                })}
              </ol>
            )}
          </div>

          <MandateIssuesPanel bundleItemId={item.id} lever={item.lever} />
        </div>
      </div>
    </div>
  )
}

function MandateIssuesPanel({ bundleItemId, lever }:{ bundleItemId: string; lever: 'N'|'P'|'S' }){
  const { getPathway } = usePathwayStore()
  const { actors } = useActorStore()
  const [open, setOpen] = useState(false)
  const g = getPathway(bundleItemId)

  const issues: MandateIssue[] = useMemo(()=>{
    return g.edges.map(e=>{
      const srcNode = g.nodes.find(n=>n.id===e.sourceId)
      const actor = actors.find(a=> a.id === srcNode?.actorId)
      const ok = !!actor && (actor.authority.includes(lever) || actor.capabilities.includes(lever))
      return ok ? null : { edgeId: e.id, message: `Mandate gap: ${actor?.name||srcNode?.actorId} lacks authority for ${lever}.` }
    }).filter(Boolean) as MandateIssue[]
  },[g.edges, g.nodes, actors, lever])

  return (
    <div className="p-3 border rounded-lg bg-card text-card-foreground">
      <div className="flex items-center justify-between">
        <div className="font-medium">Mandate Gate</div>
        <button onClick={()=>setOpen(true)} className="px-2 py-1 rounded bg-warning text-warning-foreground text-xs">{issues.length} issue{issues.length===1?'':'s'}</button>
      </div>
      <p className="text-xs opacity-70 mt-1">Checks source actor authority against lever family.</p>
      <MandateGateDrawer open={open} onOpenChange={setOpen} issues={issues} />
    </div>
  )
}
