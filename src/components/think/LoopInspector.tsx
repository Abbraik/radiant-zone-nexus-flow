import React, { useMemo } from 'react'
import { useLoopStudioStore } from '@/stores/useLoopStudioStore'
import { SharedNodePalette } from '@/services/mock/sharedNodes'
import type { Level, LoopType, StructuralClass, Pillar, Lever } from '@/types/pags'
import { useLevelStore } from '@/stores/useLevelStore'

export default function LoopInspector(){
  const { draft, updateMeta, validate, saveDraft, submitDraft, publishDraft } = useLoopStudioStore()
  const { level, setLevel } = useLevelStore()

  const v = draft
  const canSubmit = useMemo(()=> validate().ok, [v])

  const toggleSet = (arr:string[], val:string) => (arr.includes(val)? arr.filter(x=>x!==val): [...arr,val])

  return (
    <aside className="rounded-xl border bg-white/70 backdrop-blur p-4 space-y-4">
      <section>
        <label className="block text-sm font-medium">Name</label>
        <input value={v.name} onChange={e=>updateMeta({ name: e.target.value })} placeholder="Loop name" className="w-full border rounded px-3 py-2"/>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <Select label="Type" value={v.type} options={['Reactive','Structural','Perceptual']} onChange={val=>updateMeta({ type: val as LoopType })}/>
        <Select label="Class" value={v.class} options={['R','B','N','C','T']} onChange={val=>updateMeta({ class: val as StructuralClass })}/>
        <Select label="Pillar" value={v.pillar} options={['Population','Behavior','Resource','Economic','Resilience']} onChange={val=>updateMeta({ pillar: val as Pillar })}/>
        <Select label="Level" value={v.level} options={['micro','meso','macro']} onChange={val=>{ updateMeta({ level: val as Level }); setLevel(val as Level) }}/>
      </section>

      <section>
        <h3 className="font-medium mb-1">Shared Nodes (SNL)</h3>
        <div className="flex flex-wrap gap-2">
          {SharedNodePalette.map(n=>(
            <button key={n.id}
              onClick={()=>updateMeta({ sharedNodes: toggleSet(v.sharedNodes, n.id) as any })}
              aria-pressed={v.sharedNodes.includes(n.id)}
              className={'px-2 py-1 rounded-full border text-xs ' + (v.sharedNodes.includes(n.id)? 'bg-black text-white':'')}
            >{n.name}</button>
          ))}
        </div>
      </section>

      <section>
        <h3 className="font-medium mb-1">Signals / Thresholds</h3>
        <div className="grid grid-cols-2 gap-3">
          <NumberField label="DE band (low)" value={v.deBand.low} onChange={val=>updateMeta({ deBand: { ...v.deBand, low: val } })}/>
          <NumberField label="DE band (high)" value={v.deBand.high} onChange={val=>updateMeta({ deBand: { ...v.deBand, high: val } })}/>
          <NumberField label="Soft threshold" value={v.thresholds.soft} onChange={val=>updateMeta({ thresholds: { ...v.thresholds, soft: val } })}/>
          <NumberField label="Hard threshold" value={v.thresholds.hard} onChange={val=>updateMeta({ thresholds: { ...v.thresholds, hard: val } })}/>
        </div>
        <label className="block text-sm mt-2">Trigger note</label>
        <textarea value={v.triggerNote} onChange={e=>updateMeta({ triggerNote: e.target.value })} rows={2} className="w-full border rounded px-3 py-2" />
      </section>

      <section>
        <h3 className="font-medium mb-1">Leverage Ladder</h3>
        <div className="flex gap-2">
          {(['N','P','S'] as Lever[]).map(L=>(
            <button key={L} onClick={()=>updateMeta({ leveragePath: (v.leveragePath.includes(L)? v.leveragePath.filter(x=>x!==L): [...v.leveragePath, L]) })}
              aria-pressed={v.leveragePath.includes(L)}
              className={'px-3 py-1 rounded-full border ' + (v.leveragePath.includes(L)? 'bg-black text-white':'')}
            >{L}</button>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-3 gap-3">
        <NumberField label="T1 weight" value={v.tierAnchors.t1} onChange={val=>updateMeta({ tierAnchors: { ...v.tierAnchors, t1: val } })}/>
        <NumberField label="T2 weight" value={v.tierAnchors.t2} onChange={val=>updateMeta({ tierAnchors: { ...v.tierAnchors, t2: val } })}/>
        <NumberField label="T3 weight" value={v.tierAnchors.t3} onChange={val=>updateMeta({ tierAnchors: { ...v.tierAnchors, t3: val } })}/>
      </section>

      <section className="grid grid-cols-2 gap-3">
        <NumberField label="Expected lag (days)" value={v.expectedLagDays ?? 0} onChange={val=>updateMeta({ expectedLagDays: val })}/>
        <NumberField label="Confidence (0–1)" value={v.confidence} step={0.05} onChange={val=>updateMeta({ confidence: Math.max(0,Math.min(1,val)) })}/>
      </section>

      <section>
        <label className="block text-sm">Evaluation note</label>
        <textarea value={v.evaluationNote} onChange={e=>updateMeta({ evaluationNote: e.target.value })} rows={2} className="w-full border rounded px-3 py-2" />
      </section>

      <Actions canSubmit={canSubmit} />
    </aside>
  )
}

function Select({label,value,options,onChange}:{label:string;value:string;options:string[];onChange:(v:string)=>void}){
  return (
    <label className="text-sm">
      <div className="mb-1">{label}</div>
      <select value={value} onChange={(e)=>onChange(e.target.value)} className="w-full border rounded px-3 py-2">
        {options.map(o=> <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  )
}
function NumberField({label,value,onChange,step=0.01}:{label:string;value:number;onChange:(v:number)=>void;step?:number}){
  return (
    <label className="text-sm">
      <div className="mb-1">{label}</div>
      <input type="number" step={step} value={value} onChange={e=>onChange(Number(e.target.value))} className="w-full border rounded px-3 py-2"/>
    </label>
  )
}
function Actions({canSubmit}:{canSubmit:boolean}){
  const { validate, saveDraft, submitDraft, publishDraft } = useLoopStudioStore()
  const v = validate()
  const warn = !v.ok ? v.issues.join(' • ') : ''
  return (
    <div className="space-y-2">
      {!canSubmit && <p className="text-xs text-red-700">{warn}</p>}
      <div className="flex items-center gap-2">
        <button onClick={()=>saveDraft()} className="px-3 py-2 rounded border">Save draft</button>
        <button disabled={!canSubmit} onClick={async()=>{ await submitDraft(); alert('Draft submitted to Changes Queue.') }} className={'px-3 py-2 rounded '+(canSubmit?'bg-black text-white':'bg-black/20 text-white/60 cursor-not-allowed')}>Submit</button>
        <button disabled={!canSubmit} onClick={async()=>{ const rec=await publishDraft(); alert(`Published ${rec.name} (${rec.id})`) }} className={'px-3 py-2 rounded '+(canSubmit?'bg-emerald-600 text-white':'bg-emerald-600/30 text-white/60 cursor-not-allowed')}>Publish (mock)</button>
      </div>
    </div>
  )
}
