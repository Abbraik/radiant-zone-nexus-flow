import React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import ToolFrame from '@/components/common/ToolFrame'
import DemoAtlas from '@/pages/DemoAtlas'
import { useLocation, useNavigate } from 'react-router-dom'

export default function DemoToolsSurface(){
  const loc = useLocation()
  const nav = useNavigate()
  const open = loc.pathname.startsWith('/demo-atlas')

  const onClose = ()=> nav('/workspace', { replace: true })

  return (
    <Dialog open={open} onOpenChange={(o)=>{ if(!o && open) onClose() }}>
      <DialogContent className="max-w-6xl w-[96vw] max-h-[90vh] overflow-auto bg-background/95 backdrop-blur-xl border">
        <ToolFrame>
          <DemoAtlas />
        </ToolFrame>
      </DialogContent>
    </Dialog>
  )
}
