import React, { useEffect } from 'react'
import LoopStudioCanvas from '@/components/think/LoopStudioCanvas'
import LoopInspector from '@/components/think/LoopInspector'
import { useLoopStudioStore } from '@/stores/useLoopStudioStore'
import { useLevelStore } from '@/stores/useLevelStore'

export default function LoopStudioPage(){
  const { loadNew } = useLoopStudioStore()
  const { level } = useLevelStore()
  useEffect(()=>{ loadNew({ level }); document.title = 'Loop Studio - Think | RGS' }, [level, loadNew])

  

  return (
    <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-3">
        <h1 className="text-xl font-semibold">Loop Studio</h1>
        <LoopStudioCanvas />
      </div>
      <div>
        <LoopInspector />
      </div>
    </div>
  )
}
