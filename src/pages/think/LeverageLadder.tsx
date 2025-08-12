import React, { useEffect, useMemo, useState } from 'react'
import { useLeverageLadderStore } from '@/stores/useLeverageLadderStore'
import { useLoopRegistryStore } from '@/stores/useLoopRegistryStore'
import { useBundleStore } from '@/stores/useBundleStore'
import { useLevelStore } from '@/stores/useLevelStore'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'

export default function LeverageLadder(){
  const { leveragePoints, tags, addTag, removeTag } = useLeverageLadderStore()
  const { loops, fetchLoops, loading: loadingLoops } = useLoopRegistryStore()
  const { bundles, fetchBundles } = useBundleStore()
  const { level } = useLevelStore()

  const [selectedLP, setSelectedLP] = useState<string>('')
  const [contextTarget, setContextTarget] = useState<{type:'loop'|'bundle', id:string}|null>(null)

  useEffect(()=>{ document.title = 'Leverage Ladder | THINK'; },[])
  useEffect(()=>{ fetchLoops() ; fetchBundles() },[level])

  const loopsAtLevel = useMemo(()=> loops.filter(l=>l.level===level), [loops, level])
  const lp = leveragePoints.find(x=>x.id===selectedLP)
  const families = useMemo(()=> Array.from(new Set(leveragePoints.flatMap(p=>p.families))), [leveragePoints])

  const moveSelection = (delta:number)=>{
    if (!leveragePoints.length) return
    const current = leveragePoints.findIndex(p=>p.id===selectedLP)
    const idx = current === -1 ? 0 : Math.max(0, Math.min(leveragePoints.length-1, current + delta))
    setSelectedLP(leveragePoints[idx]?.id || leveragePoints[0].id)
  }

  const tagFor = (lpId:string, targetId:string, targetType:'loop'|'bundle')=> tags.find(t=>t.lpId===lpId && t.targetId===targetId && t.targetType===targetType)

  return (
    <main className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Leverage Ladder</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 h-[70vh]">
        {/* Left: Ladder */}
        <section aria-label="Leverage Points" className="glass rounded-xl p-3 border overflow-auto">
          <div 
            className="flex flex-row-reverse md:flex-col-reverse gap-2 overflow-x-auto md:overflow-y-auto" 
            role="listbox" aria-activedescendant={selectedLP}
            onKeyDown={(e)=>{ if(e.key==='ArrowDown' || e.key==='ArrowRight') moveSelection(1); if(e.key==='ArrowUp' || e.key==='ArrowLeft') moveSelection(-1); }}
            tabIndex={0}
          >
            {leveragePoints.map(p=>{
              const active = p.id===selectedLP
              const tierCls = p.tier==='high' ? 'border-accent' : p.tier==='mid' ? 'border-primary' : 'border-border-subtle'
              return (
                <button key={p.id} id={p.id} aria-selected={active}
                  onClick={()=>setSelectedLP(p.id)}
                  className={`text-left px-3 py-2 rounded-lg border-2 min-w-[220px] md:min-w-0 ${tierCls} ${active? 'bg-primary/10 border-primary':''}`}>
                  <div className="text-sm font-medium">{p.id}: {p.name}</div>
                  <div className="text-xs opacity-80">{p.description}</div>
                </button>
              )
            })}
          </div>
        </section>

        {/* Middle: Families */}
        <section aria-label="Government Lever Families" className="glass rounded-xl p-3 border overflow-auto">
          <div className="space-y-2">
            {families.map(fam=>{
              const highlighted = lp?.families.includes(fam)
              return (
                <div key={fam} className={`px-3 py-2 rounded border text-sm ${highlighted? 'bg-primary/10 border-primary text-primary':'border-border-subtle'}`}>{fam}</div>
              )
            })}
          </div>
        </section>

        {/* Right: Targets */}
        <section aria-label="Targets" className="glass rounded-xl p-3 border overflow-auto space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Targets</h2>
            {!lp && <span className="text-xs text-foreground-subtle">Select a leverage point</span>}
          </div>

          {/* Loops */}
          <div>
            <div className="text-sm font-medium mb-1">Loops (level: {level})</div>
            {loadingLoops && <p className="text-xs">Loading loops…</p>}
            {loopsAtLevel.length===0 ? (
              <p className="text-xs">No loops at this level. <a className="underline text-primary" href="/think/loops/new">Create one</a>.</p>
            ) : (
              <ul className="space-y-1">
                {loopsAtLevel.map(l=>{
                  const t = tagFor(lp?.id||'', l.id, 'loop')
                  return (
                    <li key={l.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{l.id} — {l.name}</div>
                        <div className="text-xs text-foreground-subtle">{l.pillar} • {l.class}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {t ? (
                          <button aria-label={`Remove ${lp?.id} from ${l.id}`} onClick={()=> lp && removeTag(lp.id, l.id, 'loop')} className="px-2 py-1 text-xs rounded border">Remove</button>
                        ):(
                          <button aria-label={`Apply ${lp?.id} to ${l.id}`} disabled={!lp} onClick={()=> lp && addTag({ lpId: lp.id, targetId: l.id, targetType: 'loop' })} className="px-2 py-1 text-xs rounded border disabled:opacity-50">Tag</button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <button onClick={()=>setContextTarget({type:'loop', id:l.id})} className="px-2 py-1 text-xs rounded border">View in Context</button>
                          </DialogTrigger>
                          <ContextModal target={contextTarget} onClose={()=>setContextTarget(null)} />
                        </Dialog>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>

          {/* Bundles */}
          <div>
            <div className="text-sm font-medium mb-1">Bundles</div>
            {bundles.length===0 ? (
              <p className="text-xs">No bundles yet. <a className="underline" href="/act/bundles">Create one</a>.</p>
            ) : (
              <ul className="space-y-1">
                {bundles.map(b=>{
                  const t = tagFor(lp?.id||'', b.id, 'bundle')
                  return (
                    <li key={b.id} className="flex items-center justify-between gap-2">
                      <div className="min-w-0">
                        <div className="text-sm font-medium truncate">{b.name || b.id}</div>
                        <div className="text-xs text-foreground-subtle">{b.items.length} items • {b.level}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        {t ? (
                          <button aria-label={`Remove ${lp?.id} from ${b.id}`} onClick={()=> lp && removeTag(lp.id, b.id, 'bundle')} className="px-2 py-1 text-xs rounded border">Remove</button>
                        ):(
                          <button aria-label={`Apply ${lp?.id} to ${b.id}`} disabled={!lp} onClick={()=> lp && addTag({ lpId: lp.id, targetId: b.id, targetType: 'bundle' })} className="px-2 py-1 text-xs rounded border disabled:opacity-50">Tag</button>
                        )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <button onClick={()=>setContextTarget({type:'bundle', id:b.id})} className="px-2 py-1 text-xs rounded border">View in Context</button>
                          </DialogTrigger>
                          <ContextModal target={contextTarget} onClose={()=>setContextTarget(null)} />
                        </Dialog>
                      </div>
                    </li>
                  )
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </main>
  )
}

function ContextModal({ target, onClose }:{ target: {type:'loop'|'bundle', id:string}|null; onClose: ()=>void }){
  const { loops } = useLoopRegistryStore()
  const { bundles } = useBundleStore()
  const { tags } = useLeverageLadderStore()

  if (!target) return null
  const title = target.type==='loop' ? (loops.find(l=>l.id===target.id)?.name || target.id) : (bundles.find(b=>b.id===target.id)?.name || target.id)
  const applied = tags.filter(t=> t.targetId===target.id && t.targetType===target.type)

  return (
    <DialogContent className="max-w-lg">
      <DialogHeader>
        <DialogTitle>{title}</DialogTitle>
      </DialogHeader>
      <div className="text-sm space-y-2">
        <div>ID: <span className="opacity-80">{target.id}</span></div>
        <div>Applied Leverage Points:</div>
        <ul className="list-disc pl-5">
          {applied.length ? applied.map(t=> <li key={t.lpId}>{t.lpId}</li>) : <li className="opacity-70">None</li>}
        </ul>
      </div>
    </DialogContent>
  )
}
