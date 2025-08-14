import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';
import { useActDemo } from '@/stores/actDemoStore';

type Stack = { id:string; code:string; title:string; domain:string; description:string; equity?:string; steps:any[] };

export default function GateStacksBrowserTool(){
  const open = useToolsStore(s=>s.act.stacks);
  const close = useToolsStore(s=>s.close);
  const [stacks,setStacks]=React.useState<Stack[]>([]);
  const [sel,setSel]=React.useState<Stack|null>(null);
  const [itemId,setItemId]=React.useState('demo-item-1');
  const setAct = useActDemo(s=>s.set);

  React.useEffect(()=>{ if(open){ ds.listGateStacks().then(setStacks); } },[open]);

  async function apply(){
    if(!sel) return;
    await ds.applyGateStackToItem(sel.id, itemId);
    // ensure Ship guard sees at least one PDI arc
    setAct({ hasPdiArc: true });
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('act','stacks')}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed inset-x-0 top-16 mx-auto w-[1000px] rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl z-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Gate Stacks Library</h2>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>

          <div className="grid grid-cols-[320px,1fr] gap-4">
            <div className="max-h-[520px] overflow-auto pr-1 space-y-2">
              {stacks.map(s=>(
                <button key={s.id} onClick={()=>setSel(s)}
                  className={`w-full text-left rounded-xl border border-white/10 p-3 hover:bg-white/5 transition-colors ${sel?.id===s.id?'bg-white/10':''}`}>
                  <div className="text-xs text-zinc-400">{s.code.toUpperCase()} • {s.domain}</div>
                  <div className="text-sm font-medium">{s.title}</div>
                  <div className="text-xs text-zinc-400 line-clamp-2">{s.description}</div>
                </button>
              ))}
              {!stacks.length && <div className="text-sm text-zinc-300">No stacks yet (seed should have loaded).</div>}
            </div>

            <div className="rounded-xl border border-white/10 p-4 min-h-[360px] bg-zinc-800/30">
              {sel ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-zinc-400">{sel.code} • {sel.domain}</div>
                      <div className="text-lg font-semibold">{sel.title}</div>
                    </div>
                    <div className="flex items-center gap-2">
                      <input className="bg-zinc-800 rounded px-2 py-1 text-xs border border-white/10" value={itemId} onChange={e=>setItemId(e.target.value)} />
                      <button onClick={apply} className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-sm transition-colors">Apply to Item</button>
                    </div>
                  </div>
                  <p className="text-sm opacity-80 mt-2">{sel.description}</p>
                  {sel.equity && <p className="text-xs text-zinc-400 mt-1">Equity: {sel.equity}</p>}
                  <div className="mt-3">
                    <div className="text-xs text-zinc-400 mb-1">Sequence (macro→meso→micro)</div>
                    <ol className="list-decimal pl-5 space-y-1">
                      {sel.steps.map((st,i)=>(
                        <li key={i} className="text-sm">
                          <span className="opacity-70">{st.level}</span> • <span className="font-medium">{st.actor}</span> — {st.arc} {st.note?`— ${st.note}`:''}
                        </li>
                      ))}
                    </ol>
                  </div>
                </>
              ) : (
                <div className="text-sm text-zinc-300">Select a stack to view details and apply.</div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}