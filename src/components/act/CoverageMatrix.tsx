import React, { useMemo } from 'react'
import type { Bundle } from '@/types/bundles'
import { useLoopRegistryStore } from '@/stores/useLoopRegistryStore'
import { useLevelStore } from '@/stores/useLevelStore'

export default function CoverageMatrix({ bundle }: { bundle: Bundle }){
  const { loops } = useLoopRegistryStore()
  const { level } = useLevelStore()
  const loopsAtLevel = useMemo(()=> loops.filter(l=>l.level===level), [loops, level])

  const covered: Record<string, number> = {}
  bundle.items.forEach(item=>{
    item.targetLoops.forEach(lid=> covered[lid] = (covered[lid]||0)+1 )
  })

  if (loopsAtLevel.length===0){
    return (
      <div className="p-4 border rounded bg-warning/10 text-warning-foreground">
        <div className="font-medium">No loops found for level “{level}”.</div>
        <div className="text-sm">Create one in Think → Loop Studio.</div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Matrix */}
      <div className="lg:col-span-2 overflow-x-auto">
        <table className="min-w-full text-sm border-collapse" role="table" aria-label="Coverage matrix">
          <thead>
            <tr className="bg-muted/50">
              <Th>Loop ↓ / Item →</Th>
              {bundle.items.map(it=>
                <Th key={it.id} className="max-w-[220px] truncate">{it.title || it.id}</Th>
              )}
            </tr>
          </thead>
          <tbody>
            {loopsAtLevel.map(loop=>(
              <tr key={loop.id} className="border-b">
                <Td>
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{loop.id}</span>
                    <span className="opacity-70 truncate max-w-[260px]">{loop.name}</span>
                  </div>
                </Td>
                {bundle.items.map(it=>{
                  const hit = it.targetLoops.includes(loop.id)
                  return <Td key={it.id + loop.id} className={hit? 'text-success':'text-destructive'}>{hit ? '✔︎' : '—'}</Td>
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Summary */}
      <div className="p-3 rounded border bg-card text-card-foreground space-y-2">
        <div className="font-medium">Loop coverage</div>
        <ul className="text-sm space-y-1">
          {loopsAtLevel.map(loop=>{
            const n = covered[loop.id] || 0
            return (
              <li key={loop.id} className="flex items-center justify-between">
                <span className="truncate">{loop.id} — {loop.name}</span>
                <span className={'px-2 py-0.5 rounded-full text-xs ' + (n>0 ? 'bg-success/20 text-success-foreground' : 'bg-destructive/20 text-destructive-foreground')}>
                  {n} item{n===1?'':'s'}
                </span>
              </li>
            )
          })}
        </ul>
        {loopsAtLevel.some(l=> (covered[l.id]||0)===0) && (
          <p className="text-xs text-destructive mt-2">Some loops have no coverage — add mappings before saving.</p>
        )}
      </div>
    </div>
  )
}

function Th({children, className}:{children:React.ReactNode; className?:string}){return <th scope="col" className={"px-3 py-2 text-left font-medium "+(className||'')}>{children}</th>}
function Td({children, className}:{children:React.ReactNode; className?:string}){return <td className={'px-3 py-2 '+(className||'')}>{children}</td>}
