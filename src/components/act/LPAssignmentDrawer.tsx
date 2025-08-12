import React, { useMemo } from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'
import { useLeverageLadderStore } from '@/stores/useLeverageLadderStore'

const depthColors: Record<string, string> = {
  'Parameters': 'bg-secondary text-secondary-foreground',
  'Feedbacks': 'bg-warning text-warning-foreground',
  'System Structure': 'bg-primary text-primary-foreground',
  'Mindset': 'bg-destructive text-destructive-foreground',
}

export default function LPAssignmentDrawer({ open, onOpenChange, itemId }:{ open:boolean; onOpenChange:(o:boolean)=>void; itemId: string }){
  const { leveragePoints, assignLP, getAssignment } = useLeverageLadderStore()
  const assign = getAssignment(itemId)

  const groups = useMemo(()=>{
    const byDepth: Record<string, typeof leveragePoints> = {}
    leveragePoints.forEach(lp=>{ (byDepth[lp.depth] ||= []).push(lp) })
    const order = ['Parameters','Feedbacks','System Structure','Mindset']
    return order.map(k=> ({ key: k, items: byDepth[k]||[] }))
  },[leveragePoints])

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[85vh] sm:max-w-[520px] sm:ml-auto">
        <DrawerHeader>
          <DrawerTitle>Assign Leverage Point</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-4">
          <div>
            <label className="text-sm font-medium">Pathway stage</label>
            <div className="mt-2 flex gap-2">
              {(['N','P','S'] as const).map(s=> (
                <button key={s}
                  onClick={()=> assignLP(itemId, assign?.lpId || 'LP12', s)}
                  className={'px-2 py-1 rounded border text-sm ' + (assign?.stage===s ? 'bg-accent text-accent-foreground border-accent' : 'hover:bg-muted/60 border-border-subtle')}
                >{s}</button>
              ))}
            </div>
            <p className="text-xs opacity-70 mt-1">N = Narrative, P = Policy, S = System.</p>
          </div>

          {groups.map(g=> (
            <section key={g.key} className="space-y-2">
              <div className="flex items-center gap-2">
                <span className={'px-2 py-0.5 rounded-full text-xs '+ (depthColors[g.key]||'bg-muted')}>
                  {g.key}
                </span>
              </div>
              <ul className="space-y-2">
                {g.items.map(lp=>{
                  const selected = assign?.lpId===lp.id
                  return (
                    <li key={lp.id} className={'p-2 rounded border bg-card/70 ' + (selected ? 'ring-1 ring-primary' : '')}>
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input type="radio" name={`lp-${itemId}`} checked={selected} onChange={()=> assignLP(itemId, lp.id, assign?.stage || 'N')} />
                        <div className="flex-1">
                          <div className="font-medium text-sm">{lp.id} — {lp.name}</div>
                          <p className="text-xs opacity-80">{lp.description}</p>
                          <div className="flex gap-2 mt-1 text-xs">
                            <span className="px-1.5 py-0.5 rounded bg-muted">Time: {lp.timeToEffect}</span>
                            <span className="px-1.5 py-0.5 rounded bg-muted">Durability: {lp.durability}</span>
                          </div>
                        </div>
                      </label>
                    </li>
                  )
                })}
              </ul>
            </section>
          ))}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
