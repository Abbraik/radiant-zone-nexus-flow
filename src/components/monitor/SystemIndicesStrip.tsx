import React, { useMemo, useState } from 'react'
import { useSystemIndicesStore, type IndexKey } from '@/stores/useSystemIndicesStore'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { SparklineChart } from '@/components/dashboard/SparklineChart'

function statusClasses(status: 'ok'|'warn'|'breach'){
  return status==='ok' ? 'bg-success/15 text-success-foreground' : status==='warn' ? 'bg-warning/20 text-warning-foreground' : 'bg-destructive/20 text-destructive-foreground'
}

export default function SystemIndicesStrip({ onViewRelatedLoops }:{ onViewRelatedLoops?: (key: IndexKey)=>void }){
  const { indices, traces } = useSystemIndicesStore()
  const keys: IndexKey[] = ['SHI','SPI','SII']
  const [openKey, setOpenKey] = useState<IndexKey | null>(null)

  const open = (k: IndexKey)=> setOpenKey(k)
  const close = ()=> setOpenKey(null)

  return (
    <div className="overflow-x-auto -mx-2 px-2">
      <div className="flex gap-3 min-w-[680px] md:min-w-0 md:grid md:grid-cols-3 md:gap-4">
        {keys.map(k=> (
          <IndexCard key={k} k={k} value={indices[k].value} trend={indices[k].trend} status={indices[k].status} spark={traces[k].observed} onClick={()=>open(k)} />
        ))}
      </div>
      <TraceDrawer openKey={openKey} onClose={close} onViewRelatedLoops={onViewRelatedLoops} />
    </div>
  )
}

function IndexCard({ k, value, trend, status, spark, onClick }:{ k: IndexKey; value:number; trend:'up'|'down'|'flat'; status:'ok'|'warn'|'breach'; spark:number[]; onClick:()=>void }){
  const arrow = trend==='up' ? '↑' : trend==='down' ? '↓' : '→'
  return (
    <button onClick={onClick} className={`p-3 rounded-lg border bg-card/60 text-card-foreground w-full text-left hover-scale`}>
      <div className="flex items-center justify-between mb-2">
        <div className="font-medium">{k}</div>
        <span className={`px-2 py-0.5 rounded-full text-xs ${statusClasses(status)}`}>{status}</span>
      </div>
      <div className="flex items-center justify-between">
        <div className="text-2xl font-semibold">{Math.round(value*100)}%</div>
        <div className={trend==='up' ? 'text-success' : trend==='down' ? 'text-destructive' : 'text-muted-foreground'}>{arrow}</div>
      </div>
      <div className="mt-2">
        <SparklineChart data={spark.slice(-20)} color="#111827" height={36} />
      </div>
    </button>
  )
}

function guidanceFor(key: IndexKey, expected: number[], observed: number[]){
  const n = expected.length
  const gap = observed[n-1] - expected[n-1]
  const recentGaps = Array.from({length: Math.min(3,n)}, (_,i)=> Math.abs(observed[n-1-i] - expected[n-1-i]))
  const persistent = recentGaps.every(g=> g >= 0.05)
  if (key==='SII'){
    const drop = observed[n-1] - observed[n-3]
    if (!isNaN(drop) && drop < -0.1) return 'Investigate adoption and stakeholder alignment.'
  }
  if (Math.abs(gap) < 0.05) return 'Retune parameters in affected loops.'
  if (persistent) return 'Escalate to N/P/S pathway adjustment.'
  return 'Monitor closely and prepare corrective actions.'
}

function TraceDrawer({ openKey, onClose, onViewRelatedLoops }:{ openKey: IndexKey|null; onClose: ()=>void; onViewRelatedLoops?: (key: IndexKey)=>void }){
  const { traces } = useSystemIndicesStore()
  if (!openKey) return null
  const t = traces[openKey].t
  const exp = traces[openKey].expected
  const obs = traces[openKey].observed
  const guide = guidanceFor(openKey, exp, obs)

  return (
    <Drawer open={!!openKey} onOpenChange={(o)=> !o ? onClose() : null}>
      <DrawerContent className="max-h-[85vh] sm:max-w-[720px] sm:ml-auto animate-slide-in-right">
        <DrawerHeader>
          <DrawerTitle>{openKey} — Counterfactual Trace</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <CounterfactualChart t={t} expected={exp} observed={obs} breach={false} />
          <div className="p-3 rounded-lg border bg-card/70 text-sm">
            <div className="font-medium mb-1">Guidance</div>
            <p>{guide}</p>
          </div>
          <div className="flex justify-end">
            <button onClick={()=>{ onViewRelatedLoops?.(openKey); onClose() }} className="px-3 py-2 rounded bg-primary text-primary-foreground">View Related Loops</button>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
}

function CounterfactualChart({ t, expected, observed, breach }:{ t:number[]; expected:number[]; observed:number[]; breach:boolean }){
  const pointsExp = useMemo(()=> toPath(expected), [expected])
  const pointsObs = useMemo(()=> toPath(observed), [observed])
  return (
    <svg viewBox="0 0 100 40" className="w-full h-40">
      {/* Breach zone (mock threshold 0.8) */}
      {breach && (
        <rect x="0" y="0" width="100" height="8" className="fill-destructive/10" />
      )}
      <polyline points={pointsExp} fill="none" className="stroke-primary" strokeDasharray="2 2" strokeWidth="0.8" />
      <polyline points={pointsObs} fill="none" className="stroke-foreground" strokeWidth="1.2" />
      {/* Y grid */}
      {[0,0.25,0.5,0.75,1].map((v)=> (
        <line key={v} x1="0" x2="100" y1={40 - v*32 - 4} y2={40 - v*32 - 4} className="stroke-muted" strokeWidth="0.1" />
      ))}
    </svg>
  )
}

function toPath(values: number[]){
  const n = values.length
  const xs = values.map((_,i)=> (i/(n-1))*100)
  const ys = values.map(v=> 40 - (v*32 + 4))
  return values.map((_,i)=> `${xs[i]},${ys[i]}`).join(' ')
}
