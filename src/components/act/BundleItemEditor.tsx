import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import type { BundleItem } from '@/types/bundles'
import type { Lever } from '@/types/pags'
import { useLoopRegistryStore } from '@/stores/useLoopRegistryStore'
import { useVariableRegistryStore } from '@/stores/useVariableRegistryStore'
import { useLevelStore } from '@/stores/useLevelStore'
import { useLeverageLadderStore } from '@/stores/useLeverageLadderStore'
import LPAssignmentDrawer from '@/components/act/LPAssignmentDrawer'

export default function BundleItemEditor({ item, onChange, onDelete, bundleId }:{
  item: BundleItem
  onChange: (next: BundleItem)=>void
  onDelete: ()=>void
  bundleId?: string
}){
  const { loops } = useLoopRegistryStore()
  const { variables } = useVariableRegistryStore()
  const { level } = useLevelStore()
  const loopsAtLevel = loops.filter(l=>l.level===level)

  const { getAssignment } = useLeverageLadderStore()
  const assignment = getAssignment(item.id)
  const [lpOpen, setLpOpen] = useState(false)

  const toggle = (arr:string[], id:string)=> arr.includes(id) ? arr.filter(x=>x!==id) : [...arr, id]

  return (
    <div className="p-3 border rounded-lg bg-card text-card-foreground space-y-3">
      <div className="flex items-center gap-2">
        <label className="sr-only" htmlFor={`title-${item.id}`}>Item title</label>
        <input id={`title-${item.id}`} value={item.title} onChange={e=>onChange({ ...item, title: e.target.value })} placeholder="Item title" className="border rounded px-3 py-2 flex-1"/>
        <label className="sr-only" htmlFor={`lever-${item.id}`}>Lever</label>
        <select id={`lever-${item.id}`} value={item.lever} onChange={e=>onChange({ ...item, lever: e.target.value as Lever })} className="border rounded px-2 py-2">
          <option value="N">N (Narrative)</option>
          <option value="P">P (Program)</option>
          <option value="S">S (Structure)</option>
        </select>
        {bundleId ? (
          <Link to={`/act/pathway-builder/${bundleId}/${item.id}`} className="px-2 py-2 rounded bg-accent text-accent-foreground text-sm">Define Pathway</Link>
        ) : (
          <button disabled className="px-2 py-2 rounded bg-muted text-muted-foreground text-sm cursor-not-allowed" title="Open from bundle page">Define Pathway</button>
        )}
        {assignment ? (
          <div className="flex items-center gap-2 ml-2">
            <span className="px-2 py-1 rounded-full text-xs bg-muted">{assignment.lpId}</span>
            <span className="px-2 py-1 rounded-full text-xs bg-secondary text-secondary-foreground">{assignment.stage}</span>
            <button onClick={()=>setLpOpen(true)} className="px-2 py-1 rounded border text-xs">Change</button>
          </div>
        ) : (
          <button onClick={()=>setLpOpen(true)} className="px-2 py-2 rounded bg-accent text-accent-foreground text-sm">Assign LP</button>
        )}
        <button onClick={onDelete} aria-label="Delete item" className="px-2 py-2 rounded border">✕</button>
      </div>
      <label className="sr-only" htmlFor={`desc-${item.id}`}>Description</label>
      <textarea id={`desc-${item.id}`} value={item.description||''} onChange={e=>onChange({ ...item, description: e.target.value })} rows={2} placeholder="Description" className="w-full border rounded px-3 py-2"/>

      <section>
        <h4 className="font-medium mb-1">Target loops (current level: {level})</h4>
        {loopsAtLevel.length===0 ? (
          <p className="text-sm">No loops at this level. <a href="/think/loops/new" className="underline">Create one</a>.</p>
        ) : (
          <div className="flex flex-wrap gap-2">
            {loopsAtLevel.map(l=>(
              <button key={l.id}
                onClick={()=>onChange({ ...item, targetLoops: toggle(item.targetLoops, l.id) })}
                aria-pressed={item.targetLoops.includes(l.id)}
                className={'px-2 py-1 rounded-full border text-xs '+(item.targetLoops.includes(l.id)?'bg-primary text-primary-foreground border-primary':'hover:bg-muted/60 border-border-subtle')}>
                {l.id}
              </button>
            ))}
          </div>
        )}
      </section>

      <section>
        <h4 className="font-medium mb-1">Target variables</h4>
        <div className="flex flex-wrap gap-2">
          {variables.map(v=>(
            <button key={v.id}
              onClick={()=>onChange({ ...item, targetVariables: toggle(item.targetVariables, v.id) })}
              aria-pressed={item.targetVariables.includes(v.id)}
              className={'px-2 py-1 rounded-full border text-xs '+(item.targetVariables.includes(v.id)?'bg-secondary text-secondary-foreground border-secondary':'hover:bg-muted/60 border-border-subtle')}>
              {v.id}
            </button>
          ))}
        </div>
      </section>

      {item.targetLoops.length===0 && item.targetVariables.length===0 && (
        <p className="text-sm text-destructive">This item must target at least one Loop or Variable.</p>
      )}

      <LPAssignmentDrawer open={lpOpen} onOpenChange={setLpOpen} itemId={item.id} />
    </div>
  )
}
