import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';

type Score = 0|1|2|3|4|5;
const FIELDS = [
  ['authority','Authority'],['capacity','Capacity'],['data','Data sufficiency'],
  ['leverFit','Lever fit'],['safeguards','Safeguards'],['participation','Participation']
] as const;

export default function GateChecklistTool(){
  const open = useToolsStore(s=>s.act.gate);
  const close = useToolsStore(s=>s.close);
  const [itemId,setItemId]=React.useState('demo-item-1');
  const [scores,setScores]=React.useState<Record<string,Score>>({
    authority:3, capacity:3, data:3, leverFit:3, safeguards:3, participation:3
  } as any);
  const [outcome,setOutcome]=React.useState<'ALLOW'|'REWORK'|'BLOCK'|'—'>('—');
  const [override,setOverride]=React.useState(false);
  const [reason,setReason]=React.useState('');

  React.useEffect(()=>{
    if(!open) return;
    ds.getLastGateOutcome(itemId).then(r=> setOutcome((r.outcome ?? '—') as any));
  },[open,itemId]);

  async function submit(){
    const payload:any = {
      itemId,
      ...scores,
      overridden: override,
      overrideReason: override ? reason : undefined,
    };
    const res = await ds.submitGate(payload);
    setOutcome(res.outcome);
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('act','gate')}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed inset-x-0 top-20 mx-auto w-[720px] rounded-2xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Gate Checklist &amp; Override</h2>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm opacity-70">Item ID</label>
              <input className="w-full bg-zinc-800 rounded px-3 py-2" value={itemId} onChange={e=>setItemId(e.target.value)} />
              <div className="mt-3 space-y-2">
                {FIELDS.map(([k,label])=>(
                  <div key={k} className="flex items-center justify-between border border-white/10 rounded px-2 py-1">
                    <span className="text-sm">{label}</span>
                    <div className="flex items-center gap-1">
                      {[0,1,2,3,4,5].map(n=>(
                        <button key={n} onClick={()=>setScores(s=>({...s,[k]:n as Score}))}
                          className={`w-7 h-7 text-xs rounded border ${scores[k as string]===n ? 'bg-white/10' : 'bg-transparent'} border-white/10`}>{n}</button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-3">
              <div className="rounded-xl border border-white/10 p-3">
                <div className="text-sm opacity-70 mb-1">Last outcome</div>
                <div className="text-xl font-semibold">{outcome}</div>
              </div>

              <div className="rounded-xl border border-white/10 p-3">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={override} onChange={e=>setOverride(e.target.checked)} />
                  Apply Override (requires reason)
                </label>
                {override && (
                  <textarea className="w-full mt-2 bg-zinc-800 rounded px-3 py-2" rows={3} placeholder="Reason & expiry notes"
                    value={reason} onChange={e=>setReason(e.target.value)} />
                )}
              </div>

              <button onClick={submit} className="px-3 py-2 rounded bg-emerald-600">Submit Gate</button>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}