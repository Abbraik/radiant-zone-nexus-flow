import React, { useMemo, useState } from 'react'
import { useLoopStudioStore } from '@/stores/useLoopStudioStore'
import type { Variable } from '@/types/pags'

export default function LoopStudioCanvas(){
  const { draft, addVariable, removeVariable, addEdge, toggleDelay, setEdgeWeight } = useLoopStudioStore()
  const [newVar,setNewVar]=useState('')

  const addV = () => {
    if (!newVar.trim()) return
    addVariable(newVar.trim(), false)
    setNewVar('')
  }

  const vars = draft.variables
  const gridCols = Math.ceil(Math.sqrt(Math.max(1, vars.length)))
  const positions = useMemo(()=>{
    const pos: Record<string,{x:number,y:number}> = {}
    vars.forEach((v,i)=>{
      const r = Math.floor(i / gridCols)
      const c = i % gridCols
      pos[v.id] = { x: 140 + c*180, y: 120 + r*120 }
    })
    return pos
  },[vars, gridCols])

  return (
    <div className="relative min-h-[480px] rounded-xl border bg-white/60 backdrop-blur p-3">
      <svg className="absolute inset-0 pointer-events-none" aria-hidden>
        {draft.edges.map(e=>{
          const a = positions[e.fromVarId]; const b = positions[e.toVarId]
          if (!a || !b) return null
          const path = `M ${a.x} ${a.y} C ${(a.x+b.x)/2} ${a.y-40}, ${(a.x+b.x)/2} ${b.y+40}, ${b.x} ${b.y}`
          return (
            <g key={e.id}>
              <path d={path} fill="none" stroke="black" strokeOpacity={0.25} strokeWidth={e.weight? (1+e.weight*3):2} markerEnd="url(#arrow)"/>
              {e.delay && <circle cx={(a.x+b.x)/2} cy={(a.y+b.y)/2} r="6" fill="black" fillOpacity="0.3" />}
            </g>
          )
        })}
        <defs>
          <marker id="arrow" markerWidth="10" markerHeight="10" refX="6" refY="3" orient="auto">
            <path d="M0,0 L0,6 L9,3 z" fill="black" fillOpacity="0.25" />
          </marker>
        </defs>
      </svg>

      {vars.map(v=>{
        const p = positions[v.id]
        return (
          <div key={v.id} style={{ left: p.x-60, top: p.y-20 }} className="absolute w-[120px]">
            <div className="glass rounded-lg px-3 py-2 text-sm">
              <div className="flex items-center justify-between">
                <span>{v.name}{v.isShared? ' •SNL':''}</span>
                <button onClick={()=>removeVariable(v.id)} aria-label={`Remove ${v.name}`} className="text-xs opacity-70">✕</button>
              </div>
              <EdgeControls varId={v.id}/>
            </div>
          </div>
        )
      })}

      <div className="absolute bottom-3 left-3 flex gap-2">
        <input value={newVar} onChange={e=>setNewVar(e.target.value)} placeholder="Add variable" className="border rounded px-2 py-1"/>
        <button onClick={addV} className="px-3 py-1 rounded bg-black text-white">Add</button>
      </div>
    </div>
  )
}

function EdgeControls({varId}:{varId:string}){
  const { draft, addEdge, toggleDelay, setEdgeWeight } = useLoopStudioStore()
  const others = draft.variables.filter(v=>v.id!==varId)
  const [to,setTo]=useState<string>(''); const [pol,setPol]=useState<'+'|'-'>('+')

  const create = ()=>{
    if (!to) return
    addEdge(varId, to, pol)
    setTo('')
  }

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center gap-1">
        <select value={to} onChange={e=>setTo(e.target.value)} className="border rounded px-2 py-1 text-xs flex-1">
          <option value="">→ variable…</option>
          {others.map(o=> <option key={o.id} value={o.id}>{o.name}</option>)}
        </select>
        <select value={pol} onChange={e=>setPol(e.target.value as any)} className="border rounded px-2 py-1 text-xs">
          <option value="+">+</option><option value="-">-</option>
        </select>
        <button onClick={create} className="text-xs px-2 py-1 rounded bg-black text-white">Add</button>
      </div>
      {draft.edges.filter(e=>e.fromVarId===varId).map(e=>(
        <div key={e.id} className="flex items-center justify-between text-xs">
          <span>{e.polarity} → {nameOf(draft.variables, e.toVarId)}</span>
          <div className="flex items-center gap-1">
            <label className="inline-flex items-center gap-1">
              <input type="checkbox" checked={!!e.delay} onChange={()=>toggleDelay(e.id)} /> delay
            </label>
            <input type="range" min={0} max={1} step={0.05} value={e.weight ?? 0.5} onChange={ev=>setEdgeWeight(e.id, Number(ev.target.value))}/>
          </div>
        </div>
      ))}
    </div>
  )
}
function nameOf(vars:Variable[], id:string){ return vars.find(v=>v.id===id)?.name ?? 'unknown' }
