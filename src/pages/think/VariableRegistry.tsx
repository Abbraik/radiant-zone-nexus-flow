import React, { useEffect, useMemo, useState } from 'react'
import { useVariableRegistryStore } from '@/stores/useVariableRegistryStore'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { SharedNodePalette } from '@/services/mock/sharedNodes'

export default function VariableRegistry(){
  const { variables, loading, fetchVariables, addVariable } = useVariableRegistryStore()
  const nav = useNavigate()
  const [params] = useSearchParams()
  const snsParam = useMemo(()=> params.get('sns')?.split(',').filter(Boolean) || [], [params])

  const [pillarFilter,setPillarFilter]=useState<string[]>([])
  const [typeFilter,setTypeFilter]=useState<string[]>([])
  const [sharedOnly,setSharedOnly]=useState(false)
  const [modalOpen,setModalOpen]=useState(false)

  useEffect(()=>{ fetchVariables() },[])

  const filtered = variables.filter(v=>{
    return (!sharedOnly || v.sharedNode) &&
      (pillarFilter.length===0 || pillarFilter.includes(v.pillar)) &&
      (typeFilter.length===0 || typeFilter.includes(v.type)) &&
      (snsParam.length===0 || snsParam.includes(v.id))
  })

  return (
    <div className="p-6 space-y-4">
      <header className="flex flex-wrap gap-4 items-center">
        <h1 className="text-xl font-semibold">Variable Registry</h1>
        <div className="flex items-center gap-3 ml-auto">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={sharedOnly} onChange={e=>setSharedOnly(e.target.checked)}/>
            Shared Nodes only
          </label>
          <button onClick={()=>setModalOpen(true)} className="px-3 py-2 rounded bg-primary text-primary-foreground hover:bg-primary/90">New Variable</button>
        </div>
      </header>

      <div className="flex flex-wrap gap-4 items-center" aria-label="Filters">
        <FilterMulti label="Pillar" options={['Population','Behavior','Resource','Economic','Resilience']} value={pillarFilter} setValue={setPillarFilter}/>
        <FilterMulti label="Type" options={['Stock','Flow','Indicator']} value={typeFilter} setValue={setTypeFilter}/>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse" role="table" aria-label="Variable Registry table">
            <thead>
              <tr className="bg-muted/50">
                <Th>ID</Th><Th>Name</Th>
                <Th className="hidden md:table-cell">Unit</Th>
                <Th>Pillar</Th>
                <Th className="hidden md:table-cell">Type</Th>
                <Th>Loops</Th>
                <Th>SNL</Th>
                <Th className="hidden md:table-cell">Sensitivity</Th>
                <Th className="hidden md:table-cell">Source</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(v=>(
                <tr key={v.id} className="border-b hover:bg-muted/40">
                  <Td>{v.id}</Td>
                  <Td>{v.name}</Td>
                  <Td className="hidden md:table-cell">{v.unit}</Td>
                  <Td>{v.pillar}</Td>
                  <Td className="hidden md:table-cell">{v.type}</Td>
                  <Td>
                    <button onClick={()=>nav(`/think/loops?filterLoops=${encodeURIComponent(v.linkedLoops.join(','))}`)} className="underline text-primary hover:text-primary/80">
                      {v.linkedLoops.length}
                    </button>
                  </Td>
                  <Td>{v.sharedNode ? <span className="inline-flex items-center px-2 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs">Shared</span> : ''}</Td>
                  <Td className="hidden md:table-cell">{v.sensitivity}</Td>
                  <Td className="hidden md:table-cell">{v.source}</Td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <NewVariableModal onClose={()=>setModalOpen(false)} onSubmit={(data)=>{
          const id = data.name.trim().toLowerCase().replace(/\s+/g,'_')
          addVariable({
            id,
            name: data.name.trim(),
            unit: data.unit || '',
            pillar: data.pillar as any,
            type: data.type as any,
            linkedLoops: [],
            sharedNode: data.shared,
            sensitivity: data.sensitivity as any,
            source: data.source || 'Unknown'
          })
          setModalOpen(false)
        }}/>
      )}
    </div>
  )
}

function Th({children, className}:{children:React.ReactNode; className?:string}){return <th scope="col" className={"px-3 py-2 text-left font-medium "+(className||'')}>{children}</th>}
function Td({children, className}:{children:React.ReactNode; className?:string}){return <td className={"px-3 py-2 "+(className||'')}>{children}</td>}
function FilterMulti({label,options,value,setValue}:{label:string;options:string[];value:string[];setValue:(v:string[])=>void}){
  const toggle=(opt:string)=> setValue(value.includes(opt)? value.filter(v=>v!==opt) : [...value,opt])
  return (
    <div className="flex items-center gap-1" role="group" aria-label={`${label} filter`}>
      <span className="text-sm font-medium">{label}:</span>
      {options.map(opt=>(
        <button key={opt} onClick={()=>toggle(opt)} aria-pressed={value.includes(opt)}
          className={'px-2 py-0.5 rounded border text-sm transition '+(value.includes(opt)?'bg-primary text-primary-foreground border-primary':'hover:bg-muted/60 border-border-subtle')}>
          {opt}
        </button>
      ))}
    </div>
  )
}

type ModalProps = { onClose: ()=>void; onSubmit: (data:{ name:string; unit:string; pillar:string; type:string; shared:boolean; sensitivity:string; source:string })=>void }
function NewVariableModal({onClose,onSubmit}:ModalProps){
  const [name,setName]=useState('')
  const [unit,setUnit]=useState('')
  const [pillar,setPillar]=useState('Behavior')
  const [type,setType]=useState('Indicator')
  const [shared,setShared]=useState(true)
  const [sensitivity,setSensitivity]=useState('Medium')
  const [source,setSource]=useState('Survey')

  const similar = useMemo(()=>{
    const q = name.trim().toLowerCase()
    if (!q) return [] as typeof SharedNodePalette
    return SharedNodePalette.filter(s=> s.name.toLowerCase().includes(q))
  },[name])

  const submit=(e:React.FormEvent)=>{ e.preventDefault(); onSubmit({ name, unit, pillar, type, shared, sensitivity, source }) }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />
      <div className="absolute right-0 top-0 h-full w-full sm:w-[480px] bg-background/95 backdrop-blur-xl shadow-xl p-5 overflow-y-auto">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">New Variable</h2>
          <button onClick={onClose} aria-label="Close" className="px-2 py-1">✕</button>
        </div>
        <form onSubmit={submit} className="mt-4 space-y-3">
          <label className="text-sm block">Name
            <input value={name} onChange={e=>setName(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" required />
          </label>
          <label className="text-sm block">Unit
            <input value={unit} onChange={e=>setUnit(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm block">Pillar
              <select value={pillar} onChange={e=>setPillar(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
                {['Population','Behavior','Resource','Economic','Resilience'].map(p=> <option key={p} value={p}>{p}</option>)}
              </select>
            </label>
            <label className="text-sm block">Type
              <select value={type} onChange={e=>setType(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
                {['Stock','Flow','Indicator'].map(t=> <option key={t} value={t}>{t}</option>)}
              </select>
            </label>
          </div>
          <label className="inline-flex items-center gap-2 text-sm">
            <input type="checkbox" checked={shared} onChange={e=>setShared(e.target.checked)} /> Mark as Shared Node (SNL)
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="text-sm block">Sensitivity
              <select value={sensitivity} onChange={e=>setSensitivity(e.target.value)} className="w-full border rounded px-3 py-2 mt-1">
                {['Low','Medium','High'].map(s=> <option key={s} value={s}>{s}</option>)}
              </select>
            </label>
            <label className="text-sm block">Source
              <input value={source} onChange={e=>setSource(e.target.value)} className="w-full border rounded px-3 py-2 mt-1" />
            </label>
          </div>

          {similar.length>0 && (
            <div className="mt-2 p-2 rounded border border-border-subtle bg-muted/40">
              <div className="text-xs font-medium mb-1">Similar Shared Nodes found — consider reusing:</div>
              <ul className="text-xs list-disc pl-5">
                {similar.map(s=> <li key={s.id}>{s.name}</li>)}
              </ul>
            </div>
          )}

          <div className="flex gap-2 mt-3">
            <button type="submit" className="px-3 py-2 rounded bg-primary text-primary-foreground">Add Variable</button>
            <button type="button" onClick={onClose} className="px-3 py-2 rounded border">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}
