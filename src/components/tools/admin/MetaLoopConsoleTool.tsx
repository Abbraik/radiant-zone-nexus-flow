import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';
import { usePrecedenceStore } from '@/stores/precedenceStore';

type Rel = { id:string; indicatorId:string; stage:string; openedAt:string };
type HeatCell = { domain:string; level:'macro'|'meso'|'micro'; count:number };

const DOMAINS = ['employment','housing','health','energy','digital'];

function Heatmap({cells}:{cells:HeatCell[]}){
  const grid:Record<string,Record<string,number>> = {};
  DOMAINS.forEach(d=>grid[d]={macro:0,meso:0,micro:0});
  cells.forEach(c=>{ grid[c.domain][c.level]+=c.count; });
  return (
    <div className="grid grid-cols-4 gap-2">
      {DOMAINS.map(d=>(
        <div key={d} className="rounded-xl border border-white/10 p-2">
          <div className="text-xs opacity-70 mb-1">{d}</div>
          <div className="grid grid-cols-3 gap-1 text-center">
            {(['macro','meso','micro'] as const).map(l=>{
              const v = grid[d][l];
              const cls = v>1?'bg-rose-500/30':v>0?'bg-amber-500/30':'bg-white/5';
              return <div key={l} className={`rounded px-2 py-1 text-xs ${cls}`}>{l}<div className="text-[10px] opacity-70">{v}</div></div>;
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function MetaLoopConsoleTool(){
  const open = useToolsStore(s=>s.admin.meta);
  const close = useToolsStore(s=>s.close);
  const { state:prec, set:setPrec, clear, refresh } = usePrecedenceStore();
  const [rels,setRels]=React.useState<Rel[]>([]);
  const [metaList,setMetaList]=React.useState<any[]>([]);
  const [selectedMeta,setSelectedMeta]=React.useState<string>('');
  const [sequence,setSequence]=React.useState<any[]>([]);
  const [heat,setHeat]=React.useState<HeatCell[]>([]);
  const [pause,setPause]=React.useState<string[]>([]);

  React.useEffect(()=>{
    if(!open) return;
    (async()=>{
      const list = await ds.listRel(); setRels(list);
      const metas = await (await import('@/services/datasource/mock/db')).get('meta-rels', []) as any[]; // fallback; we seeded KEYS.meta
      const metas2 = await (await import('@/services/datasource/mock/db')).get('meta', []) as any[];    // KEYS.meta actual
      const meta = metas2?.length? metas2 : metas;
      setMetaList(meta ?? []);
      const active = await ds.getPrecedence(); setPause(active.relIds ?? []);
      if (active.metaRelId) setSelectedMeta(active.metaRelId);
      refresh();
      // Build heat from seeded meta conflicts if any
      const cells:HeatCell[] = [];
      (meta?.[0]?.conflicts ?? []).forEach((c:any)=> cells.push({ domain:c.domain, level:c.level, count:1 }));
      setHeat(cells);
      setSequence(meta?.[0]?.sequence ?? [
        { label:'Macro initiatives', level:'macro' },
        { label:'Meso coordination', level:'meso'  },
        { label:'Micro delivery',    level:'micro' },
      ]);
    })();
  },[open,refresh]);

  async function activate(){
    await setPrec({
      active: true,
      metaRelId: selectedMeta || metaList[0]?.id,
      relIds: pause,
      banner: 'Meta-Loop sequence in effect: precedence applied',
    });
  }
  async function deactivate(){ await clear(); }

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('admin','meta')}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 z-50" />
        <Dialog.Content className="fixed inset-x-0 top-12 mx-auto w-[1080px] rounded-2xl border border-white/10 bg-zinc-900 p-6 shadow-2xl z-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Meta-Loop Console</h2>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>

          <div className="grid grid-cols-[1fr,1fr] gap-6">
            {/* left: conflicts heatmap + paused RELs */}
            <div>
              <div className="text-sm opacity-70 mb-1">Conflict heatmap</div>
              <Heatmap cells={heat}/>
              <div className="mt-4">
                <div className="text-sm opacity-70 mb-1">Pause (precedence) selected RELs</div>
                <div className="max-h-[140px] overflow-auto space-y-1">
                  {rels.map(r=>{
                    const checked = pause.includes(r.id);
                    return (
                      <label key={r.id} className="flex items-center gap-2 text-sm">
                        <input type="checkbox" checked={checked} onChange={(e)=>{
                          setPause(p=> e.target.checked ? [...p, r.id] : p.filter(x=>x!==r.id));
                        }} />
                        REL {r.id.slice(0,8)} • {r.stage}
                      </label>
                    );
                  })}
                  {!rels.length && <div className="text-sm opacity-70">No RELs (seeds should populate).</div>}
                </div>
                <div className="mt-3 flex items-center gap-2">
                  <button onClick={activate} className="px-3 py-2 rounded bg-emerald-600 hover:bg-emerald-700 text-sm transition-colors">Activate precedence</button>
                  <button onClick={deactivate} className="px-3 py-2 rounded border border-white/10 text-sm hover:bg-white/5 transition-colors">Deactivate</button>
                </div>
              </div>
            </div>

            {/* right: sequence editor */}
            <div>
              <div className="text-sm opacity-70 mb-1">Sequence (macro → meso → micro)</div>
              <div className="rounded-xl border border-white/10 p-3 space-y-2 bg-zinc-800/30">
                {sequence.map((s:any,i:number)=>(
                  <div key={i} className="flex items-center justify-between rounded border border-white/10 p-2 bg-zinc-900/50">
                    <div className="text-sm">{s.label}</div>
                    <div className="text-xs opacity-70">{s.level}</div>
                    <div className="flex items-center gap-1">
                      <button disabled={i===0} onClick={()=>setSequence(q=>{
                        const a=[...q]; const t=a[i]; a[i]=a[i-1]; a[i-1]=t; return a;
                      })} className="text-xs px-2 py-0.5 rounded border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">↑</button>
                      <button disabled={i===sequence.length-1} onClick={()=>setSequence(q=>{
                        const a=[...q]; const t=a[i]; a[i]=a[i+1]; a[i+1]=t; return a;
                      })} className="text-xs px-2 py-0.5 rounded border border-white/10 hover:bg-white/5 disabled:opacity-30 disabled:cursor-not-allowed transition-colors">↓</button>
                    </div>
                  </div>
                ))}
                <div className="flex items-center gap-2">
                  <input placeholder="Label" className="bg-zinc-800 rounded px-2 py-1 text-sm border border-white/10 flex-1"
                    onKeyDown={(e:any)=>{ if(e.key==='Enter'){ setSequence(prev=>[...prev,{label:e.target.value, level:'micro'}]); e.currentTarget.value=''; } }} />
                  <button onClick={()=>setSequence(prev=>[...prev,{label:'New step', level:'micro'}])}
                    className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition-colors">Add</button>
                </div>
              </div>
              <div className="mt-3">
                <button
                  onClick={async ()=>{
                    const id = selectedMeta || metaList[0]?.id;
                    if (!id) return;
                    await ds.approveSequence(id, sequence);
                  }}
                  className="px-3 py-2 rounded bg-indigo-600 hover:bg-indigo-700 text-sm transition-colors">Approve sequence</button>
              </div>
            </div>
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}