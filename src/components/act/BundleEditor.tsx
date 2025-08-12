import React, { useEffect, useMemo, useState } from 'react'
import type { Bundle, BundleItem } from '@/types/bundles'
import { validateBundle, useBundleStore } from '@/stores/useBundleStore'
import { useLevelStore } from '@/stores/useLevelStore'
import CoverageMatrix from './CoverageMatrix'
import BundleItemEditor from './BundleItemEditor'
import { useLoopRegistryStore } from '@/stores/useLoopRegistryStore'
import { useVariableRegistryStore } from '@/stores/useVariableRegistryStore'

export default function BundleEditor({ initial }:{ initial: Bundle }){
  const [bundle, setBundle] = useState<Bundle>(initial)
  const { saveBundle } = useBundleStore()
  const { level } = useLevelStore()
  const { fetchLoops } = useLoopRegistryStore()
  const { fetchVariables } = useVariableRegistryStore()

  useEffect(()=>{ fetchLoops(); fetchVariables(); },[])

  // keep bundle level in sync with header
  if (bundle.level !== level) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useMemo(()=> setBundle({ ...bundle, level }), [level])
  }

  const issues = validateBundle(bundle)
  const addItem = ()=>{
    const it: BundleItem = { id: crypto.randomUUID(), title: '', lever: 'N', targetLoops: [], targetVariables: [], description: '' }
    setBundle(b=>({ ...b, items: [...b.items, it] }))
  }
  const updateItem = (idx:number, next: BundleItem)=> setBundle(b=>{
    const items = [...b.items]; items[idx] = next; return { ...b, items }
  })
  const deleteItem = (idx:number)=> setBundle(b=>{
    const items = b.items.filter((_,i)=>i!==idx); return { ...b, items }
  })

  const save = async ()=>{
    if (!issues.ok) return
    await saveBundle(bundle)
    alert('Bundle saved.')
  }

  return (
    <div className="space-y-5">
      <header className="flex flex-wrap items-center gap-3">
        <label className="sr-only" htmlFor="bundle-name">Bundle name</label>
        <input id="bundle-name" value={bundle.name} onChange={e=>setBundle({ ...bundle, name: e.target.value })} placeholder="Bundle name" className="border rounded px-3 py-2 flex-1"/>
        <button onClick={addItem} className="px-3 py-2 rounded bg-primary text-primary-foreground">Add item</button>
        <button onClick={save} disabled={!issues.ok} className={'px-3 py-2 rounded '+(issues.ok? 'bg-success text-success-foreground':'bg-success/40 text-success-foreground/70 cursor-not-allowed')}>Save bundle</button>
      </header>

      {issues.ok ? null : (
        <div className="p-3 rounded border border-destructive bg-destructive/10 text-sm">
          <ul className="list-disc ml-5">
            {issues.issues.map((s,i)=><li key={i}>{s}</li>)}
          </ul>
        </div>
      )}

      <label className="sr-only" htmlFor="bundle-desc">Bundle description</label>
      <textarea id="bundle-desc" value={bundle.description||''} onChange={e=>setBundle({ ...bundle, description: e.target.value })}
        placeholder="Bundle description" className="w-full border rounded px-3 py-2" rows={2}/>

      <section className="space-y-3">
        {bundle.items.length===0 && <p className="text-sm opacity-70">No items yet. Add your first intervention line item.</p>}
        {bundle.items.map((it, idx)=>(
          <BundleItemEditor key={it.id} item={it} onChange={(n)=>updateItem(idx,n)} onDelete={()=>deleteItem(idx)} />
        ))}
      </section>

      <section>
        <h3 className="text-lg font-semibold mb-2">Coverage Matrix</h3>
        <CoverageMatrix bundle={bundle} />
      </section>
    </div>
  )
}
