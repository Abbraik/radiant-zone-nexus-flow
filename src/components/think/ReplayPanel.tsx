import React, { useEffect, useMemo, useState } from 'react'

type MonthlyRow = {
  t: number
  pop_dyn: number
  res_market: number
  prod_services: number
  soc_outcomes: number
  activeLPs: string[]
}

export default function ReplayPanel({ monthlySeries, horizon }:{ monthlySeries: MonthlyRow[]; horizon: number }){
  const [month, setMonth] = useState(0)
  const [playing, setPlaying] = useState(false)
  const [speed, setSpeed] = useState(1)

  useEffect(()=>{ setMonth(0) },[monthlySeries])

  useEffect(()=>{
    if (!playing) return
    const id = setInterval(()=>{
      setMonth(m=> m < horizon ? m+1 : 0)
    }, 1000 / speed)
    return ()=>clearInterval(id)
  },[playing, speed, horizon])

  const current = useMemo(()=> monthlySeries.find(m=>m.t===month), [monthlySeries, month])
  const lpList = useMemo(()=>{
    const set = new Set<string>()
    monthlySeries.forEach(r=> r.activeLPs?.forEach(id=> set.add(id)))
    return Array.from(set)
  },[monthlySeries])
  const activationByLp = useMemo(()=>{
    const map: Record<string, number> = {}
    lpList.forEach(id=>{
      const first = monthlySeries.find(r=> r.activeLPs?.includes(id))
      map[id] = first ? first.t : horizon
    })
    return map
  },[lpList, monthlySeries, horizon])

  if (!current) return null

  const step = (d:number)=> setMonth(m=> Math.min(horizon, Math.max(0, m+d)))

  return (
    <div className="space-y-4 animate-fade-in">
      <div className="flex gap-3 items-center">
        <button onClick={()=>step(-1)} className="px-2 py-1 border rounded">◀</button>
        <button onClick={()=>setPlaying(p=>!p)} className="px-3 py-1 bg-primary text-primary-foreground rounded hover-scale">
          {playing ? 'Pause' : 'Play'}
        </button>
        <button onClick={()=>step(1)} className="px-2 py-1 border rounded">▶</button>
        <input aria-label="Timeline" type="range" min={0} max={horizon} value={month} onChange={e=>setMonth(Number(e.target.value))} className="flex-1"/>
        <label className="text-sm flex items-center gap-2">Speed
          <select value={speed} onChange={e=>setSpeed(Number(e.target.value))} className="border rounded px-2 py-1">
            {[0.25,0.5,1,2].map(s=> <option key={s} value={s}>{s}x</option>)}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
        {[
          { key:'pop_dyn', label:'Population Dynamics' },
          { key:'res_market', label:'Resource Market' },
          { key:'prod_services', label:'Products & Services' },
          { key:'soc_outcomes', label:'Social Outcomes' }
        ].map(p=>{
          const val = (current as any)[p.key] as number
          return (
            <div key={p.key} className="p-3 border rounded bg-white/70">
              <div className="text-xs font-medium mb-1">{p.label}</div>
              <div className="h-2 bg-muted rounded">
                <div className="h-2 bg-emerald-500 rounded transition-all" style={{ width: `${Math.round(val*100)}%` }} />
              </div>
              <div className="text-xs mt-1">{(val*100).toFixed(1)}%</div>
            </div>
          )
        })}
      </div>

      <div className="space-y-2">
        <div className="text-sm font-medium">LP Activation Timeline</div>
        <div className="space-y-1">
          {lpList.length===0 && <div className="text-xs opacity-70">No leverage points in this scenario.</div>}
          {lpList.map(id=>{
            const start = activationByLp[id] ?? horizon
            const left = (start / Math.max(1,horizon)) * 100
            const width = ((horizon - start) / Math.max(1,horizon)) * 100
            const justActivated = month===start
            return (
              <div key={id} className="flex items-center gap-2">
                <div className={`text-xs w-28 truncate ${justActivated? 'pulse':''}`}>{id}</div>
                <div className="relative h-2 flex-1 bg-muted rounded overflow-hidden">
                  <div className="absolute top-0 h-2 bg-primary/30" style={{ left: `${left}%`, width: `${Math.max(0,width)}%` }} />
                  <div className="absolute inset-y-0 left-0 w-[2px] bg-primary/50" style={{ left: `${(month/Math.max(1,horizon))*100}%` }} />
                </div>
              </div>
            )
          })}
        </div>
      </div>

      <div className="text-xs">Active LPs: {current.activeLPs?.join(', ') || 'None'}</div>
    </div>
  )
}
