import React from 'react'
import { Drawer, DrawerContent, DrawerHeader, DrawerTitle } from '@/components/ui/drawer'

export type MandateIssue = { edgeId: string; message: string }

export default function MandateGateDrawer({ open, onOpenChange, issues }:{ open:boolean; onOpenChange:(o:boolean)=>void; issues: MandateIssue[] }){
  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="max-h-[70vh]">
        <DrawerHeader>
          <DrawerTitle>Mandate Issues</DrawerTitle>
        </DrawerHeader>
        <div className="p-4 space-y-2">
          {issues.length===0 ? (
            <div className="text-sm text-success">No mandate gaps detected.</div>
          ) : (
            <ul className="text-sm list-disc ml-5 space-y-1">
              {issues.map((i,idx)=> <li key={idx} className="text-destructive">{i.message}</li>)}
            </ul>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
}
