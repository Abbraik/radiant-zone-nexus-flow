import { create } from 'zustand'

export type Confidence = 'Low'|'Medium'|'High'
export type Level = 'micro'|'meso'|'macro'

export interface LoopHealth {
  id: string
  name: string
  level: Level
  dominance: number // 0-1
  gain: number // -1..1
  variance: number // 0-1
  bandMin: number // 0-1
  bandMax: number // 0-1
  delayFlag: boolean
  confidence: Confidence
  evidenceCount: number
  breachDuration: number // months
}

type LoopHealthState = {
  loops: LoopHealth[]
  setLoops: (data: LoopHealth[]) => void
}

const mock: LoopHealth[] = [
  { id: 'EDU-421', name: 'Secondary Re-Enrollment Reflex', level: 'meso', dominance: 0.65, gain: 0.22, variance: 0.72, bandMin: 0.5, bandMax: 0.7, delayFlag: false, confidence: 'High', evidenceCount: 12, breachDuration: 2 },
  { id: 'HLT-210', name: 'Clinic Staffing Loop', level: 'micro', dominance: 0.48, gain: -0.05, variance: 0.31, bandMin: 0.35, bandMax: 0.55, delayFlag: true, confidence: 'Medium', evidenceCount: 6, breachDuration: 4 },
  { id: 'ECO-990', name: 'SME Credit Expansion', level: 'macro', dominance: 0.72, gain: 0.15, variance: 0.81, bandMin: 0.4, bandMax: 0.75, delayFlag: false, confidence: 'Low', evidenceCount: 3, breachDuration: 5 },
  { id: 'SOC-555', name: 'Youth Outreach Momentum', level: 'meso', dominance: 0.58, gain: 0.05, variance: 0.46, bandMin: 0.4, bandMax: 0.6, delayFlag: true, confidence: 'High', evidenceCount: 18, breachDuration: 1 },
]

export const useLoopHealthStore = create<LoopHealthState>((set)=>({
  loops: mock,
  setLoops: (data)=> set({ loops: data })
}))
