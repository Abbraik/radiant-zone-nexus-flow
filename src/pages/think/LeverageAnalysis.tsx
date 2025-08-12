import React, { useMemo, useState } from 'react'
import { useLeverageLadderStore } from '@/stores/useLeverageLadderStore'
import { useLoopRegistryStore } from '@/stores/useLoopRegistryStore'
import { useBundleStore } from '@/stores/useBundleStore'

export default function LeverageAnalysis(){
  const { leveragePoints, tags, addTag, recommendForTarget } = useLeverageLadderStore()
  const { loops } = useLoopRegistryStore()
  const { bundles } = useBundleStore()
  const [filterType, setFilterType] = useState<'all'|'loop'|'bundle'>('all')
  const [gapThreshold, setGapThreshold] = useState(40)

  const targets = useMemo(()=>{
    const loopTargets = filterType!=='bundle' ? loops.map(l=>({ id:l.id, name:l.name, type:'loop' as const })) : []
    const bundleTargets = filterType!=='loop' ? bundles.map(b=>({ id:b.id, name:b.name || b.id, type:'bundle' as const })) : []
    return [...loopTargets, ...bundleTargets]
  },[loops,bundles,filterType])

  const lpIds = useMemo(()=> leveragePoints.map(lp=>lp.id), [leveragePoints])
  const coverage = useMemo(()=>{
    const map: Record<string, string[]> = {}
    targets.forEach(t=>{
      map[t.id] = tags.filter(tag=>tag.targetId===t.id).map(tag=>tag.lpId)
    })
    return map
  },[targets,tags])

  const coveragePct = (id:string)=> Math.round(((coverage[id]?.length || 0) / lpIds.length) * 100)

  return (
    <div className="p-6 space-y-6">
      <header className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Leverage Coverage Analysis</h1>
        <select value={filterType} onChange={e=>setFilterType(e.target.value as any)} className="border rounded px-2 py-1">
          <option value="all">All</option>
          <option value="loop">Loops only</option>
          <option value="bundle">Bundles only</option>
        </select>
      </header>

      {/* View A — Coverage Matrix */}
      <section>
        <h2 className="font-medium mb-2">Coverage Matrix</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse">
            <thead>
              <tr className="bg-muted/50">
                <th className="px-2 py-1 text-left">Target</th>
                {lpIds.map(lpId=> <th key={lpId} className="px-2 py-1">{lpId}</th>)}
                <th className="px-2 py-1">Total</th>
              </tr>
            </thead>
            <tbody>
              {targets.map(t=>(
                <tr key={t.id} className="border-b">
                  <td className="px-2 py-1 whitespace-nowrap pr-4">{t.name}</td>
                  {lpIds.map(lpId=> <td key={lpId} className="text-center">{coverage[t.id]?.includes(lpId) ? '✔' : '—'}</td>)}
                  <td className="px-2 py-1 text-center">{coverage[t.id]?.length || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* View C — Gap Finder */}
      <section>
        <h2 className="font-medium mb-2">Gap Finder</h2>
        <label className="text-sm flex items-center gap-2">Coverage threshold:
          <input type="range" min={0} max={100} value={gapThreshold} onChange={e=>setGapThreshold(Number(e.target.value))}/>
          <span>{gapThreshold}%</span>
        </label>
        <ul className="list-disc ml-5 mt-2 text-sm">
          {targets.filter(t=>coveragePct(t.id) < gapThreshold).map(t=>{
            const missing = lpIds.filter(lpId=>!coverage[t.id]?.includes(lpId))
            return <li key={t.id}>{t.name} — Missing: {missing.join(', ')}</li>
          })}
        </ul>
      </section>

      {/* Recommendations */}
      <section>
        <h2 className="font-medium mb-2">Recommendations</h2>
        {targets.map(t=>{
          const recs = recommendForTarget(t.id, t.type)
          if (!recs.length) return null
          return (
            <div key={t.id} className="p-2 border rounded mb-2">
              <div className="font-medium">{t.name}</div>
              <ul className="mt-1 text-sm">
                {recs.slice(0,3).map(r=>{
                  const lp = leveragePoints.find(x=>x.id===r.lpId)
                  return (
                    <li key={r.lpId} className="flex items-center justify-between gap-2">
                      <span title={`${lp?.description} | Families: ${lp?.families.join(', ')}`}>{r.lpId} — {lp?.name}</span>
                      <button onClick={()=>addTag({ lpId: r.lpId, targetId: t.id, targetType: t.type })} className="px-2 py-0.5 rounded bg-primary text-primary-foreground text-xs">Apply</button>
                    </li>
                  )
                })}
              </ul>
            </div>
          )
        })}
      </section>
    </div>
  )
}
