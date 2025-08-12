import { create } from 'zustand'

export type Trend = 'up'|'down'|'flat'
export type Status = 'ok'|'warn'|'breach'

export type IndexKey = 'SHI'|'SPI'|'SII'

export interface IndexInfo { value: number; trend: Trend; status: Status }
export interface IndexTrace { t: number[]; expected: number[]; observed: number[]; guidance: string }

type SystemIndicesState = {
  indices: Record<IndexKey, IndexInfo>
  traces: Record<IndexKey, IndexTrace>
  setIndices: (data: Partial<Record<IndexKey, IndexInfo>>) => void
  setTraces: (data: Partial<Record<IndexKey, IndexTrace>>) => void
}

const t = Array.from({length: 24}, (_,i)=> i)
const expected = t.map(i=> 0.6 + Math.sin(i/6)*0.05)
const observedA = expected.map((e,i)=> e + (i>15? -0.04: 0.01))
const observedB = expected.map((e,i)=> e + (i>18? -0.08: 0))

export const useSystemIndicesStore = create<SystemIndicesState>((set)=>({
  indices: {
    SHI: { value: observedA[observedA.length-1], trend: 'down', status: 'warn' },
    SPI: { value: expected[expected.length-1]+0.01, trend: 'flat', status: 'ok' },
    SII: { value: observedB[observedB.length-1], trend: 'down', status: 'breach' },
  },
  traces: {
    SHI: { t, expected, observed: observedA, guidance: '' },
    SPI: { t, expected, observed: expected.map((e)=> e+0.01), guidance: '' },
    SII: { t, expected, observed: observedB, guidance: '' },
  },
  setIndices: (data)=> set(s=> ({ indices: { ...s.indices, ...data } })),
  setTraces: (data)=> set(s=> ({ traces: { ...s.traces, ...data } })),
}))
