import React from 'react'
import { useSimulationSettingsStore, PillarKey } from '@/stores/useSimulationSettingsStore'

export default function SimulationControls({ onRun }:{ onRun: ()=>void }){
  const { horizon, sensitivity, setHorizon, setSensitivity } = useSimulationSettingsStore()
  const pillars: { key: PillarKey; label: string }[] = [
    { key: 'pop_dyn', label: 'Population Dynamics' },
    { key: 'res_market', label: 'Resource Market' },
    { key: 'prod_services', label: 'Products & Services' },
    { key: 'soc_outcomes', label: 'Social Outcomes' },
  ]
  return (
    <div className="flex flex-col gap-4 p-3 glass rounded border">
      <div className="flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          Horizon:
          <select value={horizon} onChange={(e)=>setHorizon(Number(e.target.value))} className="border rounded px-2 py-1">
            {[12,24,36,60,120].map(h=> <option key={h} value={h}>{h} months</option>)}
          </select>
        </label>
        <button onClick={onRun} className="px-3 py-1 bg-primary text-primary-foreground rounded">Run Simulation</button>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {pillars.map(p=> (
          <label key={p.key} className="flex flex-col text-sm bg-white/50 rounded p-2">
            <span className="font-medium">{p.label}</span>
            <div className="flex items-center gap-2">
              <input
                aria-label={`${p.label} sensitivity`}
                type="range"
                min={0.5}
                max={2}
                step={0.1}
                value={sensitivity[p.key]}
                onChange={(e)=>setSensitivity(p.key, Number(e.target.value))}
                className="flex-1"
              />
              <span className="w-10 text-right">{sensitivity[p.key].toFixed(1)}x</span>
            </div>
          </label>
        ))}
      </div>
    </div>
  )
}
