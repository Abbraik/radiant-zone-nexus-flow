import React from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useWorkspaceStore } from '@/stores/useWorkspaceStore'
import ToolFrame from '@/components/common/ToolFrame'
import LoopRegistry from '@/pages/think/LoopRegistry'
import VariableRegistry from '@/pages/think/VariableRegistry'
import LeverageLadder from '@/pages/think/LeverageLadder'
import LeverageAnalysis from '@/pages/think/LeverageAnalysis'
import LeverageScenarios from '@/pages/think/LeverageScenarios'
import LoopStudioPage from '@/pages/think/LoopStudio'
import { useNavigate } from 'react-router-dom'

export default function ThinkToolsSurface(){
  const { view } = useWorkspaceStore(s=> s.getViewForZone('think'))
  const setViewForZone = useWorkspaceStore(s=> s.setViewForZone)
  const nav = useNavigate()
  const open = !!view

  const onClose = ()=> { setTimeout(()=> { setViewForZone('think', null, null); nav('/workspace', { replace: true }) }, 0) }

  const render = ()=>{
    switch(view){
      case 'loops': return <LoopRegistry />
      case 'variables': return <VariableRegistry />
      case 'leverage-ladder': return <LeverageLadder />
      case 'leverage-analysis': return <LeverageAnalysis />
      case 'leverage-scenarios': return <LeverageScenarios />
      case 'loop-studio': return <LoopStudioPage />
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
