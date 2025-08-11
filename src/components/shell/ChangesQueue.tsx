import React, { useState } from 'react'
import { useGovernanceStore } from '@/stores/useGovernanceStore'

export default function ChangesQueue(){
  const [open,setOpen]=useState(false)
  if (import.meta.env.VITE_PAGS_FULL !== '1') return null
  const { drafts, submitDraft } = useGovernanceStore()
  const [title,setTitle]=useState(''); const [kind,setKind]=useState<'loop'|'bundle'|'pathway'>('loop')
  const [diff,setDiff]=useState('')

  const submit=async(e:React.FormEvent)=>{ e.preventDefault(); await submitDraft({ id: crypto.randomUUID(), title, kind, diff }) ; setTitle(''); setDiff('') }

  return (
    <>
      <button aria-label="Open Changes Queue" onClick={()=>setOpen(true)}
        className="px-3 py-1 rounded-md border border-white/30 hover:bg-white/10">Changes</button>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[520px] bg-white/90 backdrop-blur-xl shadow-xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Changes Queue</h2>
              <button onClick={()=>setOpen(false)} aria-label="Close" className="px-2 py-1">✕</button>
            </div>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <select value={kind} onChange={e=>setKind(e.target.value as any)} className="border rounded px-3 py-2">
                <option value="loop">Loop</option>
                <option value="bundle">Bundle</option>
                <option value="pathway">Pathway</option>
              </select>
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border rounded px-3 py-2" required />
              <textarea value={diff} onChange={e=>setDiff(e.target.value)} placeholder="What changed?" className="w-full border rounded px-3 py-2" rows={4}/>
              <button className="px-3 py-2 rounded bg-black text-white">Submit draft</button>
            </form>
            <ul className="mt-4 space-y-2">
              {drafts.map(d=>(
                <li key={d.id} className="p-2 border rounded">
                  <div className="text-sm uppercase opacity-70">{d.kind}</div>
                  <div className="font-medium">{d.title}</div>
                  {d.diff && <pre className="bg-black/5 rounded p-2 text-xs mt-1 whitespace-pre-wrap">{d.diff}</pre>}
                  <span className="text-xs opacity-70">{d.status}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}