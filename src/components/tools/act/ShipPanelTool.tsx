import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { useToolsStore } from '@/stores/toolsStore';
import { useActDemo } from '@/stores/actDemoStore';
import { usePrecedenceStore } from '@/stores/precedenceStore';
import { canShip } from '@/lib/guards';
import { ds } from '@/services/datasource';

function Row({ok,label,children}:{ok:boolean;label:string;children?:React.ReactNode}){
  return (
    <div className="flex items-center justify-between glass-panel-tight">
      <div className="text-sm">{label}</div>
      <div className={`text-xs px-2 py-0.5 rounded ${ok?'bg-emerald-600/20 text-emerald-200':'bg-zinc-700/40 text-zinc-300'}`}>
        {ok?'OK':'Missing'}
      </div>
      {children}
    </div>
  );
}

export default function ShipPanelTool(){
  React.useEffect(()=>{
    // when panel opens, check applied arcs for demo item and set hasPdiArc accordingly
    const unsub = setInterval(async ()=>{
      try {
        const arcs = await ds.listAppliedArcs('demo-item-1');
        if (arcs && arcs.length) useActDemo.getState().set({ hasPdiArc: true });
      } catch {}
    }, 800);
    return ()=> clearInterval(unsub);
  },[]);
  const open = useToolsStore(s=>s.act?.ship ?? false);
  const close = useToolsStore(s=>s.close);

  const s = useActDemo();
  const [actualGateOutcome, setActualGateOutcome] = React.useState<'ALLOW'|'REWORK'|'BLOCK'|null>(null);
  const [actualDebt, setActualDebt] = React.useState({ overdue: 0, items: [] as string[] });

  React.useEffect(() => {
    if (!open) return;
    // Fetch real gate outcome and participation debt
    ds.getLastGateOutcome('demo-item-1').then(r => setActualGateOutcome(r.outcome));
    ds.getParticipationDebt().then(setActualDebt);
  }, [open]);

  const effectiveContext = {
    ...s,
    gateOutcome: actualGateOutcome,
    participationDebtOverdue: actualDebt.overdue > 0
  };
  const ok = canShip(effectiveContext);
  const prec = usePrecedenceStore(st=>st.state);
  const shipEnabled = ok && !prec.active;

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('act','ship' as any)}>
      <Dialog.Portal>
        <Dialog.Overlay className="glass-overlay" />
        <Dialog.Content className="glass-modal top-24 w-[720px]">
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
            <Row ok={effectiveContext.gateOutcome==='ALLOW'} label={`Gate outcome = ${effectiveContext.gateOutcome ?? '—'}`}>
              <div className="flex items-center gap-2 ml-3">
                {(['ALLOW','REWORK','BLOCK'] as const).map(g=>(
                  <button key={g} onClick={()=>setActualGateOutcome(g)}
                    className={`text-xs px-2 py-0.5 rounded border ${effectiveContext.gateOutcome===g?'bg-white/10':''}`}>{g}</button>
                ))}
              </div>
            </Row>
            <Row ok={!effectiveContext.participationDebtOverdue} label={`No overdue participation debt (${actualDebt.overdue} items)`}>
              <button onClick={()=>setActualDebt(d=>({...d, overdue: d.overdue > 0 ? 0 : 1}))} className="text-xs underline ml-3">toggle</button>
            </Row>
          </div>

          <div className="mt-5">
            <button disabled={!shipEnabled} className="btn-primary disabled:opacity-40">Ship decision</button>
            {(!shipEnabled) && (
              <p className="text-xs opacity-70 mt-2">
                {!ok
                  ? 'To ship: map loops/variables, add a PDI arc, pass Gate = ALLOW, and clear/legally compress participation with no overdue debt.'
                  : 'Ship is paused while a Meta-Loop precedence is active.'}
              </p>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
