import React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import ToolFrame from '@/components/common/ToolFrame'
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'
import BundlesList from '@/pages/act/BundlesList'
import BundleEditorPage from '@/pages/act/BundleEditorPage'
import PathwayBuilderPage from '@/pages/act/PathwayBuilder'

export default function ActToolsSurface(){
  const { view } = useWorkspaceStore(s=> s.getViewForZone('act'))
  const setViewForZone = useWorkspaceStore(s=> s.setViewForZone)
  const open = !!view

  const onClose = ()=> setViewForZone('act', null, null)

  const render = ()=>{
    switch(view){
      case 'bundles': return <BundlesList />
      case 'bundle-editor': return <BundleEditorPage />
      case 'pathway-builder': return <PathwayBuilderPage />
      default: return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={(o)=>{ if(!o) onClose() }}>
      <DialogContent className="max-w-6xl w-[96vw] max-h-[90vh] overflow-auto bg-background/95 backdrop-blur-xl border">
        <ToolFrame>
          {render()}
        </ToolFrame>
      </DialogContent>
    </Dialog>
  )
}
