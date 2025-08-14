import React from 'react';
import { usePrecedenceStore } from '@/stores/precedenceStore';
import * as Dialog from '@radix-ui/react-dialog';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';
import RelStageChips from '../shared/RelStageChips';
import { dueInDays } from '@/lib/relTimers';

const STAGES: Array<{k:any;label:string}> = [
  {k:'think',label:'Think'},{k:'act',label:'Act'},{k:'monitor',label:'Monitor'},
  {k:'learn',label:'Learn'},{k:'innovate',label:'Innovate'},
];

export default function RELBoardTool(){
  const prec = usePrecedenceStore(s=>s.state);
  const open = useToolsStore(s=>s.monitor.rel);
  const close = useToolsStore(s=>s.close);
  const [rows,setRows]=React.useState<any[]>([]);
  const refresh = React.useCallback(async ()=>{
    const list = await ds.listRel();
    setRows(list);
  },[]);

  React.useEffect(()=>{ if(open){ refresh(); } },[open,refresh]);

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('monitor','rel')}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed inset-x-0 top-16 mx-auto w-[1000px] rounded-2xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">REL Board</h2>
            <button className="text-sm underline opacity-80" onClick={refresh}>Refresh</button>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>

          <div className="space-y-2 max-h-[520px] overflow-auto pr-1">
            {rows.map(r=>{
              const due = dueInDays(r.openedAt, r.stage);
              return (
                <div key={r.id} className="grid grid-cols-[1fr,200px,1fr] items-center gap-3 rounded-xl border border-white/10 p-3">
                  <div>
                    <div className="text-sm font-medium">REL #{r.id.slice(0,8)}</div>
                    <div className="text-xs opacity-70">Indicator: {r.indicatorId.slice(0,8)} • Breach: {r.breachClass}</div>
                  </div>
                  <div className="justify-self-center flex items-center gap-3">
                    <RelStageChips stage={r.stage}/>
                    <span className={`text-xs px-2 py-0.5 rounded border ${due.overdue?'border-rose-400/30 bg-rose-500/10':'border-white/10 bg-white/5'}`}>
                      {due.overdue ? 'Overdue' : `Due in ${due.days}d ${due.hours}h`}
                    </span>
                  </div>
                  <div className="justify-self-end">
                    <div className="flex items-center gap-2">
                      {STAGES.map(s=>{
                        const paused = prec.active && prec.relIds.includes(r.id);
                        return (
                          <button key={s.k}
                            disabled={paused}
                            className={`text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/5 ${paused?'opacity-40 cursor-not-allowed':''}`}
                            onClick={async ()=>{ if(paused) return; await ds.advanceRel(r.id, s.k as any); }}>
                            {s.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              );
            })}
            {rows.length===0 && <div className="opacity-70 text-sm">No REL tickets yet.</div>}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
