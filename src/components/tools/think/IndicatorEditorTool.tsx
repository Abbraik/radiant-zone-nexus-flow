import React, { useMemo, useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';
import BandStatusPill from '../shared/BandStatusPill';

export default function IndicatorEditorTool(){
  const open = useToolsStore(s=>s.think.indicators);
  const close = useToolsStore(s=>s.close);
  const [list,setList]=useState<any[]>([]);
  const [form,setForm]=useState({ name:'', target:0, bandL:0, bandU:1, freq:'monthly' });

React.useEffect(()=>{ 
  if(!open) return;
  (async ()=>{
    const inds = await ds.listIndicators();
    const rows = await Promise.all(inds.map(async i=>{
      const s = await ds.getBandStatus(i.id);
      return {...i, status:s.status};
    }));
    setList(rows);
  })();
},[open]);

  const canSave = useMemo(()=> form.name && form.bandU>form.bandL, [form]);

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('think','indicators')}>
      <Dialog.Portal>
        <Dialog.Overlay className="glass-overlay" />
        <Dialog.Content className="glass-modal top-10 w-[880px]">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Indicators &amp; Bands</h2>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <label className="block text-sm opacity-80">Name</label>
              <input className="glass-input" value={form.name} onChange={e=>setForm({...form, name:e.target.value})}/>
              <div className="grid grid-cols-3 gap-3">
                <div><label className="block text-sm opacity-80">Target</label>
                  <input type="number" className="glass-input" value={form.target} onChange={e=>setForm({...form, target:+e.target.value})}/>
                </div>
                <div><label className="block text-sm opacity-80">Band L</label>
                  <input type="number" className="glass-input" value={form.bandL} onChange={e=>setForm({...form, bandL:+e.target.value})}/>
                </div>
                <div><label className="block text-sm opacity-80">Band U</label>
                  <input type="number" className="glass-input" value={form.bandU} onChange={e=>setForm({...form, bandU:+e.target.value})}/>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <button disabled={!canSave} className="btn-primary disabled:opacity-50"
                  onClick={async ()=>{
                    const rec = await ds.createIndicator(form as any);
                    setList(l=>[...l,rec]);
                  }}>Add indicator</button>
              </div>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm uppercase tracking-wide opacity-60">Current</h3>
              <div className="max-h-[360px] overflow-auto pr-1 space-y-2">
                {list.map((it)=>(
                  <div key={it.id} className="flex items-center justify-between glass-panel-tight">
                    <div className="text-sm">
                      <div className="font-medium">{it.name}</div>
                      <div className="opacity-70">[{it.bandL} , {it.bandU}] target {it.target}</div>
                    </div>
                    <BandStatusPill status={it.status ?? 'in'} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
