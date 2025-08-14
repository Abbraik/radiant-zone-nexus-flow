import React from 'react';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';

function hoursBetween(a:string,b:string){
  return Math.abs((new Date(a).getTime() - new Date(b).getTime()) / 36e5);
}

export default function TransparencyScoreTile(){
  const [score,setScore]=React.useState<{pct:number; timely:number; total:number}>({pct:0, timely:0, total:0});
  const toggle = useToolsStore(s => s.toggle);

  React.useEffect(()=>{
    (async ()=>{
      const packs = await ds.listAllPacks();
      const rels = await ds.listRel();
      const relMap = new Map(rels.map((r:any)=>[r.id, r.openedAt]));
      const relPacks = packs.filter((p:any)=>p.refType==='rel');
      const timely = relPacks.filter((p:any)=>{
        const opened = relMap.get(p.refId);
        if(!opened) return false;
        return hoursBetween(p.publishedAt, opened) <= 72; // 72h SLO
      }).length;
      const total = relPacks.length || 1;
      const pct = Math.round((timely/ (relPacks.length || 1))*100);
      setScore({pct, timely, total: relPacks.length});
    })();
  },[]);

  return (
    <div className="rounded-2xl border border-white/10 p-4 bg-zinc-900/60">
      <div className="text-xs opacity-70 mb-1">Transparency Score (72h SLO)</div>
      <div className="text-3xl font-semibold">{score.pct}%</div>
      <div className="text-xs opacity-70 mt-1">{score.timely}/{score.total||0} packs published ≤72h</div>
      <div className="mt-3">
        <button
          onClick={() => toggle('monitor', 'transparency')}
          className="text-xs px-2 py-1 rounded border border-white/10 hover:bg-white/5 transition-colors">
          Open Transparency
        </button>
      </div>
    </div>
  );
}