import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';

export default function PDIStoryboardTool(){
  const open = useToolsStore(s=>s.act.pdi);
  const close = useToolsStore(s=>s.close);
  const [itemId,setItemId]=React.useState('demo-item-1');
  const [arcs,setArcs]=React.useState<any[]>([]);

  React.useEffect(()=>{
    if(!open) return;
    ds.listAppliedArcs(itemId).then(setArcs);
  },[open,itemId]);

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('act','pdi')}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed inset-x-0 top-20 mx-auto w-[900px] rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl z-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">PDI Storyboard — Applied Arcs</h2>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <label className="text-sm opacity-70">Item ID</label>
            <input className="bg-zinc-800 rounded px-2 py-1 text-sm border border-white/10" value={itemId} onChange={e=>setItemId(e.target.value)} />
            <button onClick={()=>ds.listAppliedArcs(itemId).then(setArcs)} className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition-colors">Refresh</button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            {arcs.map((a,i)=>(
              <div key={i} className="rounded-xl border border-white/10 p-3 bg-zinc-800/30">
                <div className="text-xs opacity-70">{a.stackCode}</div>
                <div className="text-sm font-medium">{a.actor}</div>
                <div className="text-xs opacity-70">{a.arc} • {a.level}</div>
                {a.note && <div className="text-xs mt-1 opacity-80">{a.note}</div>}
              </div>
            ))}
            {!arcs.length && <div className="opacity-70 text-sm col-span-3 text-center py-8">No applied arcs yet — open "Stacks" to apply one.</div>}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}