import React, { useState } from 'react'
import { useGovernanceStore } from '@/stores/useGovernanceStore'

export default function EvidenceInbox(){
  const [open,setOpen]=useState(false)
  if (import.meta.env.VITE_PAGS_FULL !== '1') return null
  const { evidence, addEvidence } = useGovernanceStore()
  const [title,setTitle]=useState(''); const [url,setUrl]=useState(''); const [note,setNote]=useState('')

  const submit=async(e:React.FormEvent)=>{ e.preventDefault(); await addEvidence({ title, url, note }); setTitle(''); setUrl(''); setNote('') }

  return (
    <>
      <button aria-label="Open Evidence Inbox" onClick={()=>setOpen(true)}
        className="px-3 py-1 rounded-md border border-white/30 hover:bg-white/10">Evidence</button>
      {open && (
        <div role="dialog" aria-modal="true" className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={()=>setOpen(false)} />
          <div className="absolute right-0 top-0 h-full w-full sm:w-[420px] bg-white/90 backdrop-blur-xl shadow-xl p-5 overflow-y-auto">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Evidence Inbox</h2>
              <button onClick={()=>setOpen(false)} aria-label="Close" className="px-2 py-1">✕</button>
            </div>
            <form onSubmit={submit} className="mt-4 space-y-3">
              <input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Title" className="w-full border rounded px-3 py-2" required />
              <input value={url} onChange={e=>setUrl(e.target.value)} placeholder="URL (optional)" className="w-full border rounded px-3 py-2" />
              <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="Note" className="w-full border rounded px-3 py-2" rows={3}/>
              <button className="px-3 py-2 rounded bg-black text-white">Add</button>
            </form>
            <ul className="mt-4 space-y-2">
              {evidence.map(ev=>(
                <li key={ev.id} className="p-2 border rounded">
                  <div className="font-medium">{ev.title}</div>
                  {ev.url && <a className="text-blue-600 underline text-sm" href={ev.url} target="_blank" rel="noreferrer">{ev.url}</a>}
                  {ev.note && <div className="text-sm opacity-80">{ev.note}</div>}
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </>
  )
}