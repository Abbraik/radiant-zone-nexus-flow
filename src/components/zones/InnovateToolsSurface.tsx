import React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import ToolFrame from '@/components/common/ToolFrame'
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'
import NetworkExplorer from '@/pages/innovate/NetworkExplorer'
import ShockLab from '@/pages/innovate/ShockLab'
import { useNavigate } from 'react-router-dom'

export default function InnovateToolsSurface(){
  const view = useWorkspaceStore(s=> s.zoneViews['innovate'])
  const setViewForZone = useWorkspaceStore(s=> s.setViewForZone)
  const nav = useNavigate()
  const open = view === 'network-explorer' || view === 'shock-lab'

  const onClose = ()=> { setTimeout(()=> { setViewForZone('innovate', null, null); nav('/workspace', { replace: true }) }, 0) }

  const render = ()=>{
    switch(view){
      case 'network-explorer': return <NetworkExplorer />
      case 'shock-lab': return <ShockLab />
      default: return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o)=>{ if(!o && open) onClose() }}>
      <DialogContent className="max-w-6xl w-[96vw] max-h-[90vh] overflow-auto bg-background/95 backdrop-blur-xl border">
        <ToolFrame>
          {render()}
        </ToolFrame>
      </DialogContent>
    </Dialog>
  )
}
