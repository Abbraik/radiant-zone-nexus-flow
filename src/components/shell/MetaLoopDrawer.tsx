import React, { useState } from 'react'
import { useGovernanceStore } from '@/stores/useGovernanceStore'
import { levelsEnabled } from '@/stores/useLevelStore'

export default function MetaLoopDrawer() {
  const [open, setOpen] = useState(false)
  if (import.meta.env.VITE_PAGS_FULL !== '1') return null
  const { capacity, setCapacity, weights, setWeights, bandsT1, setBands } = useGovernanceStore()

  return (
    <>
      <button
        aria-label="Open Meta-Loop Console"
        onClick={() => setOpen(true)}
        className="px-3 py-1 rounded-md border border-white/30 hover:bg-white/10"
      >
        Meta‑Loop
      </button>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-white/90 backdrop-blur-xl shadow-xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold">Meta‑Loop Console</h2>
              <button onClick={()=>setOpen(false)} aria-label="Close" className="px-2 py-1">✕</button>
            </div>

            <section className="mt-4 space-y-4">
              <div>
                <h3 className="font-medium mb-2">Capacity in control</h3>
                <div className="flex gap-2 flex-wrap">
                  {(['Responsive','Reflexive','Deliberative','Anticipatory','Structural'] as const).map(c=>(
                    <button key={c}
                      aria-pressed={capacity===c}
                      onClick={()=>setCapacity(c)}
                      className={'px-3 py-1 rounded-full border ' + (capacity===c?'bg-black text-white':'')}
                    >{c}</button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Tier weights (T1/T2/T3)</h3>
                <div className="grid grid-cols-3 gap-3">
                  {(['t1','t2','t3'] as const).map(k=>(
                    <label key={k} className="text-sm">
                      <div className="mb-1">{k.toUpperCase()}</div>
                      <input type="range" min={0} max={1} step={0.05}
                        value={weights[k]}
                        onChange={(e)=>setWeights({ ...weights, [k]: Number(e.target.value) })}
                      />
                      <div className="text-xs">{weights[k].toFixed(2)}</div>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-medium mb-2">Tier‑1 band</h3>
                <div className="flex items-center gap-3">
                  <label className="text-sm">Low
                    <input className="ml-2 border rounded px-2 py-1 w-20" type="number" step="0.01"
                      value={bandsT1.low} onChange={(e)=>setBands(Number(e.target.value), bandsT1.high)} />
                  </label>
                  <label className="text-sm">High
                    <input className="ml-2 border rounded px-2 py-1 w-20" type="number" step="0.01"
                      value={bandsT1.high} onChange={(e)=>setBands(bandsT1.low, Number(e.target.value))} />
                  </label>
                </div>
              </div>

              {levelsEnabled() && (
                <p className="text-xs opacity-70">
                  Level‑aware supervision is enabled. Use the header Level Switcher to see scoped effects.
                </p>
              )}
            </section>
          </div>
        </div>
      )}
    </>
  )
}