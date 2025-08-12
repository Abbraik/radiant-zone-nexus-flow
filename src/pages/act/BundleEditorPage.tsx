import React from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useBundleStore } from '@/stores/useBundleStore'
import BundleEditor from '@/components/act/BundleEditor'
import { useLevelStore } from '@/stores/useLevelStore'

export default function BundleEditorPage(){
  const { bundleId } = useParams()
  const nav = useNavigate()
  const { getBundle } = useBundleStore()
  const { level } = useLevelStore()

  if (!bundleId) return <div className="p-6">Invalid bundle id.</div>
  const b = getBundle(bundleId)
  if (!b) {
    return (
      <div className="p-6">
        <p>Bundle not found.</p>
        <button className="mt-3 px-3 py-2 rounded border" onClick={()=>nav('/act/bundles')}>Back to list</button>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-4">
      <div className="text-sm opacity-70">Level: {level}</div>
      <BundleEditor initial={b} />
    </div>
  )
}
