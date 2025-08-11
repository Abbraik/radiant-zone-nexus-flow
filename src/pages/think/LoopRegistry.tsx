import React, { useEffect, useState } from 'react'
import { useLoopRegistryStore } from '@/stores/useLoopRegistryStore'
import { useLevelStore } from '@/stores/useLevelStore'
import { useGovernanceStore } from '@/stores/useGovernanceStore'
import { useNavigate } from 'react-router-dom'
import LevelSwitcher from '@/components/shell/LevelSwitcher'
import { Badge } from '@/components/ui/badge'

export default function LoopRegistry(){
  const { loops, loading, fetchLoops } = useLoopRegistryStore()
  const { level } = useLevelStore()
  const { weights } = useGovernanceStore()
  const nav = useNavigate()
  const [typeFilter,setTypeFilter]=useState<string[]>([])
  const [pillarFilter,setPillarFilter]=useState<string[]>([])
  const [classFilter,setClassFilter]=useState<string[]>([])

  useEffect(()=>{ fetchLoops() },[level])

  const filtered = loops.filter(l=>{
    return l.level === level &&
      (typeFilter.length===0 || typeFilter.includes(l.type)) &&
      (pillarFilter.length===0 || pillarFilter.includes(l.pillar)) &&
      (classFilter.length===0 || classFilter.includes(l.class))
  })

  return (
    <div className="p-6 space-y-4">
      <header className="flex flex-wrap gap-4 items-center">
        <h1 className="text-xl font-semibold">Loop Registry</h1>
        <div className="flex items-center gap-3 ml-auto">
          <LevelSwitcher />
          <button onClick={()=>nav('/think/loops/new')} disabled className="px-3 py-2 rounded bg-muted text-foreground-subtle cursor-not-allowed">
            New Loop
          </button>
        </div>
      </header>

      <div className="flex flex-wrap gap-4 items-center" aria-label="Filters">
        <FilterMulti label="Type" options={['Reactive','Structural','Perceptual']} value={typeFilter} setValue={setTypeFilter}/>
        <FilterMulti label="Pillar" options={['Population','Behavior','Resource','Economic','Resilience']} value={pillarFilter} setValue={setPillarFilter}/>
        <FilterMulti label="Class" options={['R','B','N','C','T']} value={classFilter} setValue={setClassFilter}/>
      </div>

      {loading ? <p>Loading...</p> : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm border-collapse" role="table" aria-label="Loop Registry table">
            <thead>
              <tr className="bg-muted/50">
                <Th>ID</Th><Th>Name</Th><Th>Type</Th><Th>Class</Th><Th>Pillar</Th><Th>Dom</Th>
                <Th className="hidden md:table-cell">Gain</Th>
                <Th className="hidden md:table-cell">Conf</Th>
                <Th>Tier</Th><Th>SNL</Th><Th>DE-Band</Th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(loop=>{
                const goSnl = ()=> nav(`/think/variables?sns=${encodeURIComponent(loop.sharedNodes.join(','))}`)
                return (
                  <tr key={loop.id} className="border-b hover:bg-muted/40 focus-within:bg-muted/50" tabIndex={0}
                      onKeyDown={(e)=>{ if(e.key==='Enter' && loop.sharedNodes.length) goSnl() }}>
                    <Td>{loop.id}</Td>
                    <Td>{loop.name}</Td>
                    <Td>{loop.type}</Td>
                    <Td>{loop.class}</Td>
                    <Td>{loop.pillar}</Td>
                    <Td>{loop.dominance.toFixed(2)}</Td>
                    <Td className="hidden md:table-cell">{loop.gain.toFixed(2)}</Td>
                    <Td className="hidden md:table-cell">{loop.confidence.toFixed(2)}</Td>
                    <Td>
                      <div className="flex items-center gap-1">
                        <Badge variant="secondary" className="text-xs">T1 {weights.t1.toFixed(2)}</Badge>
                        <Badge variant="secondary" className="text-xs">T2 {weights.t2.toFixed(2)}</Badge>
                        <Badge variant="secondary" className="text-xs">T3 {weights.t3.toFixed(2)}</Badge>
                      </div>
                    </Td>
                    <Td>
                      <button onClick={goSnl} className="underline text-primary hover:text-primary/80" aria-label={`View ${loop.sharedNodes.length} shared nodes`}>
                        {loop.sharedNodes.length}
                      </button>
                    </Td>
                    <Td>{loop.deBand.low}–{loop.deBand.high}</Td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
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
