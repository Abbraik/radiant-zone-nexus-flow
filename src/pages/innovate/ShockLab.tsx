import React, { useEffect } from 'react'
import { useShockLabStore } from '@/stores/useShockLabStore'
import { useLoopRegistryStore } from '@/stores/useLoopRegistryStore'
import { SparklineChart } from '@/components/dashboard/SparklineChart'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { useNavigate } from 'react-router-dom'

export default function ShockLab(){
  const { fetchLoops } = useLoopRegistryStore()
  const { shocks, loops, initFromLoops, setShockValue, reset } = useShockLabStore()
  const nav = useNavigate()

  useEffect(()=>{ document.title = 'Shock Lab • INNOVATE'; fetchLoops().finally(initFromLoops) },[])

  return (
    <div className="p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
      {/* Controls */}
      <section className="lg:col-span-1 space-y-3">
        <div className="p-3 rounded-lg border bg-card text-card-foreground">
          <div className="flex items-center justify-between">
            <h2 className="font-medium">Shock Parameters</h2>
            <button onClick={reset} className="text-sm underline">Reset</button>
          </div>
          <div className="mt-3 space-y-4">
            {shocks.map(s=> (
              <div key={s.def.id}>
                <label className="flex items-center justify-between text-sm font-medium">
                  <span>{s.def.name}</span>
                  <span>{s.value}{s.def.unit}</span>
                </label>
                <input type="range" min={s.def.min} max={s.def.max} step={1}
                  value={s.value}
                  onChange={e=> setShockValue(s.def.id, Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs opacity-70 mt-1">{s.def.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact */}
      <section className="lg:col-span-3 space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-medium">Predicted Impact</h2>
          <CascadeMap />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {loops.map(l=> (
            <article key={l.id} className="p-3 rounded-lg border bg-card/60 text-card-foreground space-y-2">
              <header className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{l.name}</div>
                  <div className="text-xs opacity-70">{l.id} • {l.level}</div>
                </div>
                <RiskBadge risk={l.breachRisk} />
              </header>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <div className="text-xs opacity-70">Pred. Dominance</div>
                  <div className="text-sm font-medium">{Math.round(l.predDominance*100)}%</div>
                </div>
                <div>
                  <div className="text-xs opacity-70">Latency</div>
                  <div className="text-sm font-medium">{l.latency} mo</div>
                </div>
              </div>
              <SparklineChart data={[l.baseDominance, (l.baseDominance*2 + l.predDominance)/3, l.predDominance]} color={l.breachRisk==='High' ? '#ef4444' : '#10b981'} height={38} />
              <button onClick={()=> nav('/monitor/loop-health')} className="underline text-xs">Open in Loop Health</button>
            </article>
          ))}
        </div>
      </section>
    </div>
  )
}

function RiskBadge({ risk }:{ risk: 'Low'|'High' }){
  const cls = risk==='High' ? 'bg-destructive text-destructive-foreground' : 'bg-success text-success-foreground'
  return <span className={`px-2 py-0.5 rounded-full text-xs ${cls}`}>{risk} risk</span>
}

function CascadeMap(){
  const { loops } = useShockLabStore()
  const risky = loops.filter(l=> l.breachRisk==='High')
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-3 py-1.5 rounded bg-primary text-primary-foreground text-sm">Cascade Map</button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[640px]">
        <DialogHeader>
          <DialogTitle>Cascade Containment Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {risky.length===0 ? (
            <p className="text-sm opacity-70">No high-risk loops under current shocks.</p>
          ) : (
            <ul className="text-sm space-y-1">
              {risky.map(l=> <li key={l.id}>• {l.id} — {l.name} ({l.level})</li>)}
            </ul>
          )}
          <p className="text-xs opacity-70">Mock: edges imply shared pillar or shared nodes; real propagation will use model structure.</p>
        </div>
      </DialogContent>
    </Dialog>
  )
}
