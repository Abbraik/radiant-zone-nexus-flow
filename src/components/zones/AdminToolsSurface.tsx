import React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import ToolFrame from '@/components/common/ToolFrame'
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'
import ChangesQueuePage from '@/pages/admin/ChangesQueuePage'
import { useNavigate } from 'react-router-dom'

function MetaLoopConsole(){
  return (
    <div className="space-y-3">
      <h2 className="text-lg font-semibold">Meta-Loop Console</h2>
      <p className="text-sm text-foreground-muted">Coming soon — administrative tools for inspecting and managing meta-loops.</p>
    </div>
  )
}

export default function AdminToolsSurface(){
  const view = useWorkspaceStore(s=> s.zoneViews['admin'])
  const setViewForZone = useWorkspaceStore(s=> s.setViewForZone)
  const nav = useNavigate()
  const open = view === 'changes-queue' || view === 'meta-loop-console'

  const onClose = ()=> { setTimeout(()=> { setViewForZone('admin', null, null); nav('/workspace', { replace: true }) }, 0) }

  const render = ()=>{
    switch(view){
      case 'changes-queue': return <ChangesQueuePage />
      case 'meta-loop-console': return <MetaLoopConsole />
      default: return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o)=>{ if(!o && open) onClose() }}>
      <DialogContent className="max-w-5xl w-[96vw] max-h-[90vh] overflow-auto bg-background/95 backdrop-blur-xl border">
        <ToolFrame>
          {render()}
        </ToolFrame>
      </DialogContent>
    </Dialog>
  )
}
