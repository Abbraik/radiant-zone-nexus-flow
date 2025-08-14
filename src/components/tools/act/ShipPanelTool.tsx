import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useToolsStore } from '@/stores/toolsStore';
import { useActDemo } from '@/stores/actDemoStore';
import { canShip } from '@/lib/guards';

function Row({ok,label,children}:{ok:boolean;label:string;children?:React.ReactNode}){
  return (
    <div className="flex items-center justify-between rounded border border-white/10 p-2">
      <div className="text-sm">{label}</div>
      <div className={`text-xs px-2 py-0.5 rounded ${ok?'bg-emerald-600/20 text-emerald-200':'bg-zinc-700/40 text-zinc-300'}`}>
        {ok?'OK':'Missing'}
      </div>
      {children}
    </div>
  );
}

export default function ShipPanelTool(){
  const open = useToolsStore(s=>s.monitor.rel) as any; // not used; we open by act zone below
  const close = useToolsStore(s=>s.close);

  const s = useActDemo();
  const ok = canShip(s);

  return (
    <Dialog.Root open={useToolsStore.getState().act?.ship ?? false} onOpenChange={(v)=>!v && close('act','ship' as any)}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed inset-x-0 top-24 mx-auto w-[720px] rounded-2xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Ship Decision — Guards</h2>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>

          <div className="space-y-3">
            <Row ok={s.hasLoopMapping} label="Mapped to loops & variables">
              <button onClick={()=>s.set({hasLoopMapping: !s.hasLoopMapping})} className="text-xs underline ml-3">toggle</button>
            </Row>
            <Row ok={s.hasPdiArc} label="Has at least one PDI arc">
              <button onClick={()=>s.set({hasPdiArc: !s.hasPdiArc})} className="text-xs underline ml-3">toggle</button>
            </Row>
            <Row ok={s.gateOutcome==='ALLOW'} label={`Gate outcome = ${s.gateOutcome ?? '—'}`}>
              <div className="flex items-center gap-2 ml-3">
                {(['ALLOW','REWORK','BLOCK'] as const).map(g=>(
                  <button key={g} onClick={()=>s.set({gateOutcome:g})}
                    className={`text-xs px-2 py-0.5 rounded border ${s.gateOutcome===g?'bg-white/10':''}`}>{g}</button>
                ))}
              </div>
            </Row>
            <Row ok={!s.participationDebtOverdue} label="No overdue participation debt">
              <button onClick={()=>s.set({participationDebtOverdue: !s.participationDebtOverdue})} className="text-xs underline ml-3">toggle</button>
            </Row>
          </div>

          <div className="mt-5">
            <button disabled={!ok} className="px-3 py-2 rounded bg-emerald-600 disabled:opacity-40">Ship decision</button>
            {!ok && <p className="text-xs opacity-70 mt-2">To ship: map loops/variables, add a PDI arc, pass Gate = ALLOW, and clear or legally compress participation with no overdue debt.</p>}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
