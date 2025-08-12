import { create } from 'zustand'
import { useLoopRegistryStore } from '@/stores/useLoopRegistryStore'

export type Risk = 'Low'|'High'

export interface ShockDef {
  id: string
  name: string
  description: string
  unit: string
  min: number
  max: number
  default: number
  // simple tag to map affected loops (by pillar or keyword)
  affects: 'Economic'|'Resource'|'Behavior'|'Any'
}

export interface ShockState {
  def: ShockDef
  value: number
}

export interface ShockLoop {
  id: string
  name: string
  level: 'micro'|'meso'|'macro'
  pillar: 'Population'|'Behavior'|'Resource'|'Economic'|'Resilience'
  baseDominance: number
  bandMax: number
  predDominance: number
  breachRisk: Risk
  latency: number
}

type ShockLabState = {
  shocks: ShockState[]
  loops: ShockLoop[]
  initFromLoops: () => void
  setShockValue: (id: string, value: number) => void
  reset: () => void
}

const mockShocks: ShockDef[] = [
  { id: 'demand', name: 'Demand Drop', description: 'Change in demand', unit: '%', min: -30, max: 30, default: 0, affects: 'Economic' },
  { id: 'heat', name: 'Heat Index Spike', description: 'Change in heat index', unit: '°C', min: 0, max: 10, default: 0, affects: 'Resource' },
  { id: 'policy', name: 'Policy Uncertainty', description: 'Uncertainty index', unit: 'idx', min: 0, max: 100, default: 20, affects: 'Behavior' },
]

export const useShockLabStore = create<ShockLabState>((set, get)=>({
  shocks: mockShocks.map(def=>({ def, value: def.default })),
  loops: [],
  initFromLoops: ()=>{
    const { loops: src } = useLoopRegistryStore.getState()
    const loops: ShockLoop[] = (src.length ? src : [
      { id: 'EDU-421', name: 'Secondary Re-Enrollment Reflex', level: 'meso', pillar: 'Behavior', dominance: 0.65, gain: 0.22, confidence: 0.8, tierAnchors: {t1:0.5,t2:0.3,t3:0.2}, sharedNodes: [], deBand: {low:0.1, high:0.3}, type: 'Structural', class: 'B' }
    ] as any).map((l:any)=>({
      id: l.id,
      name: l.name,
      level: l.level,
      pillar: l.pillar,
      baseDominance: l.dominance ?? 0.5,
      bandMax: 0.7,
      predDominance: l.dominance ?? 0.5,
      breachRisk: 'Low',
      latency: 3,
    }))
    set({ loops })
    // run first calc
    recalc(set, get)
  },
  setShockValue: (id, value)=>{
    set(s=>({ shocks: s.shocks.map(x=> x.def.id===id ? { ...x, value } : x) }))
    recalc(set, get)
  },
  reset: ()=>{
    set({ shocks: mockShocks.map(def=>({ def, value: def.default })) })
    recalc(set, get)
  }
}))

function recalc(set: any, get: ()=> ShockLabState){
  const { shocks } = get()
  const normalized = (s: ShockState)=>{
    const span = (s.def.max - s.def.min) || 1
    return (s.value - s.def.default) / span // roughly -1..1 around default
  }
  set((state: ShockLabState)=>({
    loops: state.loops.map(loop=>{
      const affecting = shocks.filter(s=> s.def.affects==='Any' ||
        (s.def.affects==='Economic' && loop.pillar==='Economic') ||
        (s.def.affects==='Resource' && loop.pillar==='Resource') ||
        (s.def.affects==='Behavior' && loop.pillar==='Behavior')
      )
      const sum = affecting.reduce((acc, s)=> acc + normalized(s), 0)
      const pred = clamp01(loop.baseDominance + sum * 0.01)
      const risk: Risk = pred > loop.bandMax ? 'High' : 'Low'
      const latency = Math.max(1, 6 - affecting.length)
      return { ...loop, predDominance: pred, breachRisk: risk, latency }
    })
  }))
}

function clamp01(x:number){ return Math.max(0, Math.min(1, x)) }
