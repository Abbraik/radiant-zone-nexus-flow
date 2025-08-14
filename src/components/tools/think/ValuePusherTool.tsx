import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';
import BandStatusPill from '../shared/BandStatusPill';

type Indicator = { id:string; name:string; bandL:number; bandU:number; target:number };

function breachClass(status:'in'|'soft'|'hard'|'critical'){ return status==='critical' ? 'Critical' : status==='hard' ? 'Hard' : 'Soft'; }

export default function ValuePusherTool(){
  const open = useToolsStore(s=>s.think.bands); // we’ll open from heatmap card or dock (can be separate if you want)
  const setOpen = (v:boolean)=> useToolsStore.getState().close('think','bands');
  const [inds,setInds]=React.useState<Indicator[]>([]);
  const [sel,setSel]=React.useState<string>('');
  const [val,setVal]=React.useState<string>('');
  const [status,setStatus]=React.useState<'in'|'soft'|'hard'|'critical'>('in');
  const [autoRel,setAutoRel]=React.useState(true);

  React.useEffect(()=>{ if(open){ ds.listIndicators().then((i:any)=>{ setInds(i); setSel(i[0]?.id ?? ''); }); } },[open]);

  React.useEffect(()=>{ 
    (async()=>{
      if(!sel) return;
      const s = await ds.getBandStatus(sel);
      setStatus(s.status as any);
    })();
  },[sel]);

  async function pushValue(){
    if(!sel || !val) return;
    await ds.upsertIndicatorValue(sel, { ts: new Date().toISOString(), value: +val });
    const s = await ds.getBandStatus(sel);
    setStatus(s.status as any);
    if(autoRel && (s.status==='hard' || s.status==='critical')){
      await ds.openRel(sel, breachClass(s.status) as any);
    }
    setVal('');
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="glass-overlay" />
        <Dialog.Content className="glass-modal top-24 w-[760px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Push Value &amp; Auto-REL</h2>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm opacity-80">Indicator</label>
              <select className="glass-input" value={sel} onChange={e=>setSel(e.target.value)}>
                {inds.map(i=>
                  <option key={i.id} value={i.id}>{i.name}</option>
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm opacity-80">New value</label>
              <input type="number" className="glass-input" value={val} onChange={e=>setVal(e.target.value)}/>
            </div>
          </div>

          <div className="mt-4 flex items-center justify-between">
            <div className="text-sm">Current status: <BandStatusPill status={status}/></div>
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" checked={autoRel} onChange={e=>setAutoRel(e.target.checked)} />
              Auto-open REL on Hard/Critical
            </label>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <button onClick={pushValue} className="btn-primary">Push value</button>
            {(status==='hard'||status==='critical') && (
              <button onClick={()=>ds.openRel(sel, breachClass(status) as any)} className="btn-ghost">Open REL now</button>
            )}
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
