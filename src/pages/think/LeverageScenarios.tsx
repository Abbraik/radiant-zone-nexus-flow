import React, { useEffect, useMemo, useState } from 'react'
import { useScenarioStore } from '@/stores/useScenarioStore'
import { useLeverageLadderStore } from '@/stores/useLeverageLadderStore'
import type { TargetType } from '@/stores/useLeverageLadderStore'
import { useLoopRegistryStore } from '@/stores/useLoopRegistryStore'
import { useBundleStore } from '@/stores/useBundleStore'
import { applyMockImpact } from '@/services/mock/leverageImpact'

export default function LeverageScenarios(){
  const { scenarios, createScenario, addLP, removeLP, cloneScenario } = useScenarioStore()
  const { leveragePoints, stressTest } = useLeverageLadderStore()
  const { loops, fetchLoops } = useLoopRegistryStore()
  const { bundles, fetchBundles } = useBundleStore()

  const [newName, setNewName] = useState('')
  const [compare, setCompare] = useState(false)

  useEffect(()=>{ document.title = 'Leverage Scenarios | THINK' },[])
  useEffect(()=>{ fetchLoops(); fetchBundles() },[])

  function handleCreate(){ if (!newName.trim()) return; createScenario(newName); setNewName('') }

  const lpOptions = leveragePoints

  type TargetKey = { id: string; type: TargetType }
  function aggregateScenario(sId: string){
    const s = scenarios.find(x=>x.id===sId)
    if (!s) return { dIndex: 0, dRisk: 0, dLatency: 0 }
    // Group LPs by target
    const byTarget: Record<string, { target: TargetKey; lps: string[] }> = {}
    s.lps.forEach(sel=>{
      const key = `${sel.targetType}:${sel.targetId}`
      if (!byTarget[key]) byTarget[key] = { target: { id: sel.targetId, type: sel.targetType }, lps: [] }
      byTarget[key].lps.push(sel.lpId)
    })
    let sumIdx = 0, sumRisk = 0, sumLat = 0, n = 0
    for (const key of Object.keys(byTarget)){
      const group = byTarget[key]
      // Baseline per target similar to stressTest
      let baselineRisk = 0.6, baselineLatency = 14, baselineIndex = 0.4
      let dominantFamily: string|undefined
      if (group.target.type==='loop'){
        const l = loops.find(x=>x.id===group.target.id)
        if (l){ baselineIndex = Math.max(0, Math.min(1, (l.dominance + l.gain)/2)) }
      } else if (group.target.type==='bundle') {
        const b = bundles.find(x=>x.id===group.target.id) as any
        if (b){
          dominantFamily = b?.dominantFamily
          const loopIds = Array.from(new Set((b.items||[]).flatMap((it:any)=> it.targetLoops || [])))
          const ls = loops.filter(x=> loopIds.includes(x.id))
          if (ls.length){ baselineIndex = Math.max(0, Math.min(1, ls.reduce((a,c)=> a + (c.dominance + c.gain)/2, 0)/ls.length)) }
          baselineRisk = 0.55; baselineLatency = 16
        }
      } else {
        continue
      }
      let curRisk = baselineRisk, curLat = baselineLatency, curIdx = baselineIndex
      // Apply LPs cumulatively
      for (const lpId of group.lps){
        const lp = leveragePoints.find(x=>x.id===lpId)
        if (!lp) continue
        const res = applyMockImpact({ tier: lp.tier as any, families: lp.families, dominantFamily, baselineRisk: curRisk, baselineLatency: curLat, baselineIndex: curIdx, resolvesMandateGap: curRisk>0.65 })
        curRisk = res.projectedRisk; curLat = res.projectedLatency; curIdx = res.projectedIndex
      }
      sumIdx += (curIdx - baselineIndex);
      sumRisk += (curRisk - baselineRisk);
      sumLat += (curLat - baselineLatency);
      n++
    }
    if (n===0) return { dIndex: 0, dRisk: 0, dLatency: 0 }
    return { dIndex: sumIdx/n, dRisk: sumRisk/n, dLatency: sumLat/n }
  }

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Leverage Scenarios</h1>
        <input value={newName} onChange={e=>setNewName(e.target.value)} placeholder="Scenario name" className="border rounded px-2 py-1" aria-label="Scenario name"/>
        <button onClick={handleCreate} className="px-3 py-1 bg-primary text-primary-foreground rounded">Create</button>
        <label className="ml-auto flex items-center gap-2 text-sm"><input type="checkbox" checked={compare} onChange={e=>setCompare(e.target.checked)}/> Compare Scenarios</label>
      </header>

      {compare && (
        <section>
          <h2 className="font-medium mb-2">Comparison</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {scenarios.map(s=>{
              const a = aggregateScenario(s.id)
              return (
                <article key={s.id} className="p-4 rounded border bg-white/70 backdrop-blur">
                  <div className="font-medium">{s.name}</div>
                  <div className="text-xs opacity-70 mb-2">{s.lps.length} LPs</div>
                  <ul className="text-sm space-y-1">
                    <li>ΔIndex: <b>{Math.round(a.dIndex*100)}</b></li>
                    <li>ΔRisk: <b>{Math.round(a.dRisk*100)}%</b></li>
                    <li>ΔLatency: <b>{Math.round(a.dLatency)}</b> days</li>
                  </ul>
                </article>
              )
            })}
          </div>
        </section>
      )}

      {scenarios.length === 0 && <p className="text-sm opacity-70">No scenarios yet. Create one above.</p>}

      {scenarios.length > 0 && (
        <div className="grid md:grid-cols-2 gap-4">
          {scenarios.map(s=> (
            <ScenarioCard key={s.id} sId={s.id} />
          ))}
        </div>
      )}
    </div>
  )
}

function ScenarioCard({ sId }:{ sId: string }){
  const { scenarios, addLP, removeLP, cloneScenario } = useScenarioStore()
  const { leveragePoints, stressTest } = useLeverageLadderStore()
  const { loops } = useLoopRegistryStore()
  const { bundles } = useBundleStore()

  const s = scenarios.find(x=>x.id===sId)!
  const [type,setType]=useState<'loop'|'bundle'>('loop')
  const [target,setTarget]=useState('')
  const [lpId,setLpId]=useState('LP12')

  const targetOptions = type==='loop' ? loops.map(l=>({ id:l.id, name:`${l.id} — ${l.name}` })) : bundles.map(b=>({ id:b.id, name:b.name||b.id }))

  const addSel = ()=>{ if (!target || !lpId) return; addLP(sId, { lpId, targetId: target, targetType: type }) }

  return (
    <article className="p-3 border rounded bg-white/70 backdrop-blur space-y-3">
      <header className="flex items-center justify-between">
        <h2 className="font-medium">{s.name}</h2>
        <button onClick={()=>cloneScenario(s.id)} className="text-xs underline">Clone</button>
      </header>

      <div className="flex flex-wrap items-center gap-2">
        <label className="text-sm">Type
          <select value={type} onChange={e=>setType(e.target.value as any)} className="ml-2 border rounded px-2 py-1 text-sm">
            <option value="loop">Loop</option>
            <option value="bundle">Bundle</option>
          </select>
        </label>
        <label className="text-sm">Target
          <select value={target} onChange={e=>setTarget(e.target.value)} className="ml-2 border rounded px-2 py-1 text-sm">
            <option value="">Select…</option>
            {targetOptions.map(o=> <option key={o.id} value={o.id}>{o.name}</option>)}
          </select>
        </label>
        <label className="text-sm">LP
          <select value={lpId} onChange={e=>setLpId(e.target.value)} className="ml-2 border rounded px-2 py-1 text-sm">
            {leveragePoints.map(lp=> <option key={lp.id} value={lp.id}>{lp.id} — {lp.name}</option>)}
          </select>
        </label>
        <button onClick={addSel} className="ml-auto px-3 py-1 rounded bg-primary text-primary-foreground">Add</button>
      </div>

      <div className="space-y-2">
        {s.lps.length===0 && <p className="text-xs opacity-70">No LPs yet. Add some above.</p>}
        {s.lps.map(sel=>{
          const lp = leveragePoints.find(x=>x.id===sel.lpId)
          const res = stressTest(sel.lpId, sel.targetId, sel.targetType)
          return (
            <div key={`${sel.lpId}-${sel.targetId}`} className="p-2 rounded border bg-white/50 flex items-center justify-between">
              <div className="text-sm">
                <div className="font-medium">{sel.lpId}: {lp?.name}</div>
                <div className="text-xs opacity-70">ΔIndex {Math.round((res.projectedIndex - res.baselineIndex)*100)} · ΔRisk {Math.round((res.projectedRisk - res.baselineRisk)*100)}% · ΔLatency {res.projectedLatency - res.baselineLatency}d</div>
              </div>
              <button onClick={()=>removeLP(s.id, sel.lpId, sel.targetId)} className="text-xs underline">Remove</button>
            </div>
          )
        })}
      </div>
    </article>
  )
}
