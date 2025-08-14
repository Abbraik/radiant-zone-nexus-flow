import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';
import BandStatusPill from '../shared/BandStatusPill';
import { Overlay as MotionOverlay, Content as MotionContent } from '@/components/motion/MotionDialog';
import ParallaxCard from '@/components/motion/ParallaxCard';

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
        <MotionOverlay />
        <MotionContent className="glass-modal top-16 w-[920px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Bands Heatmap</h2>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {rows.map(r=>(
              <ParallaxCard key={r.id} className="glass-panel p-4">
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
                <div className="text-xs text-zinc-300 mt-2">Band [{r.bandL} , {r.bandU}] • Target {r.target}</div>
              </ParallaxCard>
            ))}
            {rows.length===0 && <div className="opacity-70 text-sm">No indicators yet — add some from “Indicators & Bands”.</div>}
          </div>
        </MotionContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
