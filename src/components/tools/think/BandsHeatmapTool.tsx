import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';
import BandStatusPill from '../shared/BandStatusPill';

export default function BandsHeatmapTool(){
  const open = useToolsStore(s=>s.think.bands);
  const close = useToolsStore(s=>s.close);
  const [rows,setRows]=React.useState<any[]>([]);

  React.useEffect(()=>{
    if(open){
      (async ()=>{
        const inds = await ds.listIndicators();
        const withStatus = await Promise.all(inds.map(async i => ({...i, status:(await ds.getBandStatus(i.id)).status})));
        setRows(withStatus);
      })();
    }
  },[open]);

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('think','bands')}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed inset-x-0 top-16 mx-auto w-[920px] rounded-2xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Bands Heatmap</h2>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {rows.map(r=>(
              <div key={r.id} className="rounded-xl border border-white/10 p-4 bg-zinc-900/60">
                <div className="flex items-center justify-between">
                  <div className="text-sm font-medium mb-2">{r.name}</div>
                  {(r.status==='hard'||r.status==='critical') && (
                    <button
                      onClick={()=>ds.openRel(r.id, r.status==='critical'?'Critical':'Hard' as any)}
                      className="text-xs px-2 py-1 rounded bg-emerald-600/80 hover:bg-emerald-600">
                      Open REL
                    </button>
                  )}
                </div>
                <BandStatusPill status={r.status}/>
                <div className="text-xs opacity-70 mt-2">Band [{r.bandL} , {r.bandU}] • Target {r.target}</div>
              </div>
            ))}
            {rows.length===0 && <div className="opacity-70 text-sm">No indicators yet — add some from “Indicators & Bands”.</div>}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
