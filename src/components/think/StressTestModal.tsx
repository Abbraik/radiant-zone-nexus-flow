import React, { useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import type { LeveragePoint, TargetType } from '@/stores/useLeverageLadderStore'

export default function StressTestModal({ open, onClose, lp, target, result, onApply }:{
  open: boolean
  onClose: ()=>void
  lp: LeveragePoint
  target: { id: string; name: string; type: TargetType }
  result: { baselineRisk: number; baselineLatency: number; baselineIndex: number; projectedRisk: number; projectedLatency: number; projectedIndex: number; assumptions: string[] }
  onApply: ()=>void
}){
  useEffect(()=>{
    const onKey = (e:KeyboardEvent)=>{ if (e.key==='Escape') onClose() }
    window.addEventListener('keydown', onKey)
    return ()=> window.removeEventListener('keydown', onKey)
  },[onClose])

  return (
    <Dialog open={open} onOpenChange={(o)=>{ if(!o) onClose() }}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Stress Test — {lp.id}: {lp.name}</DialogTitle>
        </DialogHeader>
        <section className="space-y-2 text-sm">
          <div>Target: {target.name} ({target.type})</div>
          <div>Baseline → Projected:</div>
          <ul className="list-disc ml-5">
            <li>Risk: {Math.round(result.baselineRisk*100)}% → <b>{Math.round(result.projectedRisk*100)}%</b></li>
            <li>Latency: {result.baselineLatency} days → <b>{result.projectedLatency} days</b></li>
            <li>System Index: {Math.round(result.baselineIndex*100)} → <b>{Math.round(result.projectedIndex*100)}</b></li>
          </ul>
        </section>
        <section>
          <div className="font-medium mb-1">Assumptions</div>
          <ul className="list-disc ml-5 text-xs">
            {result.assumptions.map((a,i)=>(<li key={i}>{a}</li>))}
          </ul>
        </section>
        <div className="flex items-center justify-end gap-2">
          <button onClick={onClose} className="px-3 py-2 rounded border">Close</button>
          <button onClick={onApply} className="px-3 py-2 rounded bg-primary text-primary-foreground">Apply LP</button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
