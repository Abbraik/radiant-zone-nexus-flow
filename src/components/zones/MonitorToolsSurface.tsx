import React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import ToolFrame from '@/components/common/ToolFrame'
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'
import LoopHealthPage from '@/pages/monitor/LoopHealth'

export default function MonitorToolsSurface(){
  const { view } = useWorkspaceStore(s=> s.getViewForZone('monitor'))
  const setViewForZone = useWorkspaceStore(s=> s.setViewForZone)
  const open = view === 'loop-health'

  const onClose = ()=> setViewForZone('monitor', null, null)

  return (
    <Dialog open={open} onOpenChange={(o)=>{ if(!o) onClose() }}>
      <DialogContent className="max-w-6xl w-[96vw] max-h-[90vh] overflow-auto bg-background/95 backdrop-blur-xl border">
        <ToolFrame>
          <LoopHealthPage />
        </ToolFrame>
      </DialogContent>
    </Dialog>
  )
}
