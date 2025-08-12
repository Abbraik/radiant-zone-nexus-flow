import { create } from 'zustand'
import type { TargetType } from '@/stores/useLeverageLadderStore'

export interface ScenarioLP {
  lpId: string
  targetId: string
  targetType: TargetType
}

export interface Scenario {
  id: string
  name: string
  description?: string
  lps: ScenarioLP[]
}

type ScenarioState = {
  scenarios: Scenario[]
  createScenario: (name: string, description?: string) => Scenario
  addLP: (scenarioId: string, lp: ScenarioLP) => void
  removeLP: (scenarioId: string, lpId: string, targetId: string) => void
  cloneScenario: (scenarioId: string) => Scenario
}

export const useScenarioStore = create<ScenarioState>((set,get)=>({
  scenarios: [],
  createScenario: (name, description)=>{
    const s: Scenario = { id: `SC-${crypto.randomUUID().slice(0,6)}`, name, description, lps: [] }
    set(state=>({ scenarios: [...state.scenarios, s] }))
    return s
  },
  addLP: (scenarioId, lp)=>{
    set(state=>({
      scenarios: state.scenarios.map(s=> s.id===scenarioId ? { ...s, lps: [...s.lps, lp] } : s)
    }))
  },
  removeLP: (scenarioId, lpId, targetId)=>{
    set(state=>({
      scenarios: state.scenarios.map(s=> s.id===scenarioId ? { ...s, lps: s.lps.filter(x=>!(x.lpId===lpId && x.targetId===targetId)) } : s)
    }))
  },
  cloneScenario: (scenarioId)=>{
    const orig = get().scenarios.find(s=>s.id===scenarioId)
    if (!orig) throw new Error('Scenario not found')
    const copy: Scenario = { ...orig, id: `SC-${crypto.randomUUID().slice(0,6)}`, name: orig.name + ' (Clone)' }
    set(state=>({ scenarios: [...state.scenarios, copy] }))
    return copy
  }
}))
