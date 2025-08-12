import React, { useEffect, useMemo, useState } from 'react'
import { useLoopHealthStore, type LoopHealth } from '@/stores/useLoopHealthStore'
import { SparklineChart } from '@/components/dashboard/SparklineChart'
import { Info, AlertTriangle } from 'lucide-react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import SystemIndicesStrip from '@/components/monitor/SystemIndicesStrip'

function hashSeed(seed: string){
  let h = 2166136261 >>> 0
  for (let i=0;i<seed.length;i++){
    h ^= seed.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function seededRandom(seedStr: string){
  let a = hashSeed(seedStr) || 123456789
  return function(){
    a |= 0; a = a + 0x6D2B79F5 | 0
    let t = Math.imul(a ^ a >>> 15, 1 | a)
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t
    return ((t ^ t >>> 14) >>> 0) / 4294967296
  }
}

function sparkFor(id: string, n=20, base=0.5){
  const rnd = seededRandom(id)
  const arr:number[]=[]
  let v = base
  for(let i=0;i<n;i++){
    v += (rnd()-0.5)*0.1
    v = Math.max(0, Math.min(1, v))
    arr.push(Number(v.toFixed(2)))
  }
  return arr
}

const breachThreshold = 3

export default function LoopHealthPage(){
  const { loops } = useLoopHealthStore()

  const [level, setLevel] = useState<'All'|'micro'|'meso'|'macro'>('All')
  const [q, setQ] = useState('')
  const [breachedOnly, setBreachedOnly] = useState(false)
  useEffect(()=>{ document.title = 'Loop Health • MONITOR' },[])

  // Deep-link support: ?loop or ?loopId focuses that loop
  useEffect(()=>{
    const params = new URLSearchParams(location.search)
    const id = params.get('loop') || params.get('loopId')
    if (id){
      setQ(id)
    }
  },[])

  const filtered = useMemo(()=>{
    return loops.filter(l=>
      (level==='All' || l.level===level) &&
      (l.name.toLowerCase().includes(q.toLowerCase()) || l.id.toLowerCase().includes(q.toLowerCase())) &&
      (!breachedOnly || isBreached(l))
    )
  },[loops, level, q, breachedOnly])

  return (
    <div className="p-4 space-y-4">
      <SystemIndicesStrip onViewRelatedLoops={()=> setBreachedOnly(true)} />

      <header className="flex flex-wrap items-center gap-3">
        <h1 className="text-xl font-semibold">Loop Health</h1>
        <div className="ml-auto flex flex-wrap items-center gap-2">
          <select value={level} onChange={e=>setLevel(e.target.value as any)} className="border rounded px-2 py-1">
            {(['All','micro','meso','macro'] as const).map(l=> <option key={l} value={l}>{l}</option>)}
          </select>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search loops" className="border rounded px-2 py-1"/>
          <label className="text-sm flex items-center gap-2">
            <input type="checkbox" checked={breachedOnly} onChange={e=>setBreachedOnly(e.target.checked)} />
            Show only breached
          </label>
        </div>
      </header>

      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {filtered.map(loop=> <LoopCard key={loop.id} loop={loop} />)}
      </section>
    </div>
  )
}

function isBreached(l: LoopHealth){
  return (l.variance < l.bandMin || l.variance > l.bandMax) && l.breachDuration > breachThreshold
}

function levelLabel(l:'micro'|'meso'|'macro'){ return l.charAt(0).toUpperCase()+l.slice(1) }

function ConfidenceBadge({c}:{c:LoopHealth['confidence']}){
  const cls = c==='High' ? 'bg-success text-success-foreground' : c==='Medium' ? 'bg-warning text-warning-foreground' : 'bg-destructive text-destructive-foreground'
  return <span className={'px-2 py-0.5 rounded-full text-xs '+cls}>{c}</span>
}

function LoopCard({ loop }:{ loop: LoopHealth }){
  const [open, setOpen] = useState(false)
  const spark = useMemo(()=> sparkFor(loop.id, 24, loop.dominance), [loop.id, loop.dominance])
  const trendUp = spark[spark.length-1] >= spark[spark.length-2]
  const breached = isBreached(loop)

  return (
    <article className="p-3 rounded-lg border bg-card/60 text-card-foreground space-y-3">
      <header className="flex items-start justify-between">
        <div>
          <div className="font-medium">{loop.name}</div>
          <div className="text-xs opacity-70">{loop.id}</div>
        </div>
        <span className="px-2 py-0.5 rounded bg-muted text-xs">{levelLabel(loop.level)}</span>
      </header>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1">
          <div className="text-xs opacity-70">Dominance</div>
          <div className="text-sm font-medium">{(loop.dominance*100).toFixed(0)}%</div>
          <SparklineChart data={spark} color="#22c55e" height={40} />
        </div>
        <div className="space-y-1">
          <div className="text-xs opacity-70">Gain</div>
          <div className="text-sm font-medium flex items-center gap-1">
            {loop.gain.toFixed(2)}
            <span className={trendUp? 'text-success':'text-destructive'}>{trendUp? '↑':'↓'}</span>
          </div>
          <div className="text-xs opacity-70">vs last month</div>
        </div>
      </div>

      <div>
        <div className="text-xs opacity-70 mb-1">Variance</div>
        <VarianceGauge value={loop.variance} min={loop.bandMin} max={loop.bandMax} />
      </div>

      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-2">
          {loop.delayFlag && (
            <span className="inline-flex items-center gap-1 text-warning" title="Signal delay detected">
              <Info size={16} /> Delay
            </span>
          )}
          <ConfidenceBadge c={loop.confidence} />
        </div>
        <button onClick={()=>setOpen(true)} className="underline text-sm">Evidence: {loop.evidenceCount}</button>
      </div>

      {breached && (
        <div className="text-xs px-2 py-1 rounded bg-destructive text-destructive-foreground inline-flex items-center gap-1">
          <AlertTriangle size={14}/> Hard Breach
        </div>
      )}

      <EvidenceDrawer open={open} onOpenChange={setOpen} loop={loop} />
    </article>
  )
}

function VarianceGauge({ value, min, max }:{ value:number; min:number; max:number }){
  const out = value < min || value > max
  const pct = Math.round(value*100)
  const left = Math.round(min*100)
  const right = Math.round(max*100)
  return (
    <div className="h-3 w-full rounded bg-muted relative overflow-hidden">
      <div className="absolute inset-y-0" style={{ left: `${left}%`, right: `${100-right}%` }}>
        <div className="h-full bg-primary/20" />
      </div>
      <div className={`absolute inset-y-0 w-0.5 ${out? 'bg-destructive':'bg-primary'}`} style={{ left: `${pct}%` }} />
    </div>
  )
}

function EvidenceDrawer({ open, onOpenChange, loop }:{ open:boolean; onOpenChange:(o:boolean)=>void; loop: LoopHealth }){
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[80vh] sm:max-w-[640px] sm:ml-auto animate-slide-in-right">
        <DrawerHeader>
          <DrawerTitle>Evidence — {loop.name}</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-2 text-sm">
          <p className="opacity-70">Mock evidence list for demo purposes.</p>
          <ul className="list-disc ml-5 space-y-1">
            {Array.from({length: loop.evidenceCount}).slice(0,8).map((_,i)=> (
              <li key={i}>Observation #{i+1} — variance snapshot and analyst note.</li>
            ))}
          </ul>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
