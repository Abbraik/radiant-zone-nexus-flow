import React, { useEffect } from 'react'
import { useBundleStore } from '@/stores/useBundleStore'
import { useLevelStore } from '@/stores/useLevelStore'
import { useNavigate } from 'react-router-dom'

export default function BundlesList(){
  const { bundles, loading, fetchBundles, createBundle } = useBundleStore()
  const { level } = useLevelStore()
  const nav = useNavigate()

  useEffect(()=>{ fetchBundles() },[])

  const startNew = ()=>{
    const b = createBundle(level)
    nav(`/act/bundles/${b.id}`)
  }

  return (
    <div className="p-6 space-y-4">
      <header className="flex items-center gap-3">
        <h1 className="text-xl font-semibold">Bundles</h1>
        <div className="flex-1" />
        <button onClick={startNew} className="px-3 py-2 rounded bg-primary text-primary-foreground">New bundle</button>
      </header>

      {loading ? <p>Loading…</p> : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bundles.map(b=>(
            <article key={b.id} className="p-4 rounded border bg-card text-card-foreground">
              <div className="flex items-center justify-between">
                <div className="font-medium">{b.name || '(unnamed bundle)'}</div>
                <span className="text-xs opacity-70">{b.level}</span>
              </div>
              <p className="text-sm mt-1 line-clamp-2">{b.description}</p>
              <div className="text-xs opacity-70 mt-2">{b.items.length} item{b.items.length===1?'':'s'}</div>
              <button onClick={()=>nav(`/act/bundles/${b.id}`)} className="mt-3 px-3 py-1 rounded border">Open</button>
            </article>
          ))}
        </div>
      )}
    </div>
  )
}
