import React, { useMemo, useState } from 'react'
import { useActorStore, type OrgType } from '@/stores/useActorStore'

export default function ActorPalette(){
  const { actors } = useActorStore()
  const [q, setQ] = useState('')
  const [org, setOrg] = useState<OrgType | 'All'>('All')

  const filtered = useMemo(()=> actors.filter(a=>
    (org==='All' || a.orgType===org) && (
      a.name.toLowerCase().includes(q.toLowerCase()) || a.id.toLowerCase().includes(q.toLowerCase())
    )
  ),[actors,q,org])

  const onDragStart = (e: React.DragEvent, actorId: string)=>{
    e.dataTransfer.setData('application/actor-id', actorId)
    e.dataTransfer.effectAllowed = 'move'
  }

  return (
    <aside className="p-3 border rounded-lg bg-card text-card-foreground space-y-3">
      <div className="flex items-center gap-2">
        <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search actors" className="border rounded px-2 py-1 flex-1"/>
        <select value={org} onChange={e=>setOrg(e.target.value as any)} className="border rounded px-2 py-1">
          {(['All','Gov','NGO','Private','International'] as const).map(o=> <option key={o} value={o}>{o}</option>)}
        </select>
      </div>
      <ul className="space-y-2 max-h-[360px] overflow-auto">
        {filtered.map(a=> (
          <li key={a.id} draggable onDragStart={(e)=>onDragStart(e, a.id)}
              className="p-2 rounded border bg-muted/40 cursor-grab active:cursor-grabbing">
            <div className="text-sm font-medium">{a.name}</div>
            <div className="text-xs opacity-70">{a.id} • {a.orgType}</div>
          </li>
        ))}
        {filtered.length===0 && <li className="text-sm opacity-70">No actors.</li>}
      </ul>
    </aside>
  )
}
