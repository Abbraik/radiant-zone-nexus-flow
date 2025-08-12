import React from 'react'
import { useSimulationSettingsStore } from '@/stores/useSimulationSettingsStore'

export default function SimulationControls({ onRun }:{ onRun: ()=>void }){
  const { horizon, sensitivity, setHorizon, setSensitivity } = useSimulationSettingsStore()
  return (
    <div className="flex flex-wrap items-center gap-4 p-3 glass rounded border">
      <label className="flex items-center gap-2 text-sm">
        Horizon:
        <select value={horizon} onChange={e=>setHorizon(Number(e.target.value))} className="border rounded px-2 py-1">
          {[12,24,36,60,120].map(h=><option key={h} value={h}>{h} months</option>)}
        </select>
      </label>
      <label className="flex items-center gap-2 text-sm">
        Sensitivity:
        <input aria-label="Sensitivity" type="range" min={0.5} max={2} step={0.1} value={sensitivity} onChange={e=>setSensitivity(Number(e.target.value))}/>
        <span>{sensitivity.toFixed(1)}x</span>
      </label>
      <button onClick={onRun} className="px-3 py-1 bg-primary text-primary-foreground rounded">Run Simulation</button>
    </div>
  )
}
