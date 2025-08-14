import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';
import { Overlay as MotionOverlay, Content as MotionContent } from '@/components/motion/MotionDialog';
import ParallaxCard from '@/components/motion/ParallaxCard';

type Series = Array<{ ts:string; y:number }>;

function MiniLine({series}:{series:Series}){
  if(!series?.length) return <div className="h-8"/>;
  // simple inline SVG sparkline
  const w=160, h=40;
  const xs = series.map((_,i)=> i/(series.length-1||1));
  const ys = series.map(p=>p.y);
  const min = Math.min(...ys), max = Math.max(...ys);
  const path = xs.map((x,i)=>{
    const nx = Math.round(x*w);
    const ny = Math.round(h - ((ys[i]-min)/(max-min || 1))*h);
    return `${i?'L':'M'}${nx},${ny}`;
  }).join(' ');
  return (<svg width={w} height={h} className="opacity-80"><path d={path} fill="none" stroke="currentColor" strokeWidth="2"/></svg>);
}

export default function PilotBoardTool(){
  const open = useToolsStore(s=>s.monitor.pilot);
  const close = useToolsStore(s=>s.close);
  const [rows,setRows]=React.useState<any[]>([]);
  const [sel,setSel]=React.useState<any|null>(null);

  React.useEffect(()=>{
    if(!open) return;
    ds.listPilots().then(ps=>{
      setRows(ps);
      setSel(ps[0] ?? null);
    });
  },[open]);

  function itsMerged(p:any): Series {
    const a = (p.seriesBefore ?? []).concat(p.seriesAfter ?? []);
    return a;
  }
  function didPairs(p:any): {t:Series;c:Series} {
    return { t: p.treatedGroup ?? [], c: p.controlGroup ?? [] };
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('monitor','pilot')}>
      <Dialog.Portal>
        <MotionOverlay />
        <MotionContent className="glass-modal top-14 w-[1040px] z-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Pilot Board</h2>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>

          <div className="grid grid-cols-[320px,1fr] gap-4">
            {/* list */}
            <div className="max-h-[520px] overflow-auto pr-1 space-y-2">
              {rows.map(p=>(
                <ParallaxCard key={p.id} className={`glass-panel-tight hover:bg-white/10 transition-colors ${sel?.id===p.id?'bg-white/10':''}`}>
                  <button className="w-full text-left" onClick={()=>setSel(p)}>
                    <div className="text-xs text-zinc-400">{p.code} • {p.method}</div>
                    <div className="text-sm font-medium">{p.title}</div>
                    <div className="mt-2 text-zinc-300">
                      {p.method==='ITS' && <MiniLine series={itsMerged(p)} />}
                      {p.method==='DiD' && (
                        <div className="flex gap-2">
                          <MiniLine series={(p.treatedGroup ?? [])}/>
                          <MiniLine series={(p.controlGroup ?? [])}/>
                        </div>
                      )}
                    </div>
                  </button>
                </ParallaxCard>
              ))}
              {!rows.length && <div className="text-sm text-zinc-300">No pilots yet (seeds should have loaded).</div>}
            </div>

            {/* detail */}
            <ParallaxCard className="glass-panel p-4 min-h-[360px] bg-zinc-800/30" maxTilt={4}>
              {sel ? (
                <>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-xs text-zinc-400">{sel.code} • {sel.method}</div>
                      <div className="text-lg font-semibold">{sel.title}</div>
                    </div>
                    <div className="text-sm opacity-70">Started: {new Date(sel.startedAt).toLocaleDateString()}</div>
                  </div>

                  <div className="mt-3">
                    {sel.method==='ITS' && (
                      <>
                        <div className="text-xs text-zinc-400 mb-1">Interrupted Time Series</div>
                        <MiniLine series={itsMerged(sel)} />
                        <div className="text-xs text-zinc-400 mt-1">Effect (level shift): {sel.summary?.effect ?? 0}</div>
                      </>
                    )}
                    {sel.method==='DiD' && (
                      <>
                        <div className="text-xs text-zinc-400 mb-1">Difference-in-Differences</div>
                        <div className="flex gap-2">
                          <div><div className="text-[11px] opacity-70">Treated</div><MiniLine series={(sel.treatedGroup ?? [])}/></div>
                          <div><div className="text-[11px] opacity-70">Control</div><MiniLine series={(sel.controlGroup ?? [])}/></div>
                        </div>
                        <div className="text-xs opacity-70 mt-1">Effect (Δtreated − Δcontrol): {sel.summary?.effect ?? 0}</div>
                      </>
                    )}
                    {sel.summary?.note && <div className="text-[11px] opacity-70 mt-2">Note: {sel.summary.note}</div>}
                  </div>
                </>
              ) : (
                <div className="text-sm text-zinc-300">Select a pilot to view details</div>
              )}
            </ParallaxCard>
          </div>

        </MotionContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}