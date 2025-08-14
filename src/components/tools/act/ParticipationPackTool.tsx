import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';

export default function ParticipationPackTool(){
  const open = useToolsStore(s=>s.act.participation);
  const close = useToolsStore(s=>s.close);
  const [relId,setRelId]=React.useState<string>('');
  const [pack,setPack]=React.useState<any>({ method:'Panel', sampleSize:30, compliance:'Yes', compressed:false, fullPackDue:'' });
  const [existing,setExisting]=React.useState<any|null>(null);

  React.useEffect(()=>{
    if(!open) return;
    // pick the first REL if none chosen yet
    ds.listRel().then((rows)=> {
      const id = rows[0]?.id ?? '';
      setRelId(id);
      if(id) ds.getParticipationForRel(id).then(setExisting);
    });
  },[open]);

  async function submit(){
    const payload = { relId, ...pack };
    await ds.submitParticipation(payload);
    const got = await ds.getParticipationForRel(relId);
    setExisting(got);
  }

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('act','participation')}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60" />
        <Dialog.Content className="fixed inset-x-0 top-24 mx-auto w-[720px] rounded-2xl border border-white/10 bg-zinc-900/95 p-6 shadow-2xl">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Participation Pack</h2>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm opacity-70">REL ID</label>
              <input className="w-full bg-zinc-800 rounded px-3 py-2" value={relId} onChange={e=>setRelId(e.target.value)} />
              <div className="mt-3">
                <label className="block text-sm opacity-70">Method</label>
                <select className="w-full bg-zinc-800 rounded px-3 py-2"
                  value={pack.method} onChange={e=>setPack({...pack, method:e.target.value})}>
                  <option>Panel</option><option>Targeted consult</option><option>Citizen jury</option><option>Public comment</option>
                </select>
              </div>
              <div className="mt-3">
                <label className="block text-sm opacity-70">Sample size</label>
                <input type="number" className="w-full bg-zinc-800 rounded px-3 py-2"
                  value={pack.sampleSize} onChange={e=>setPack({...pack, sampleSize:+e.target.value})}/>
              </div>
            </div>

            <div className="space-y-3">
              <div className="glass-panel-tight">
                <label className="block text-sm opacity-70">Compliance</label>
                <select className="w-full bg-zinc-800 rounded px-3 py-2"
                  value={pack.compliance} onChange={e=>{
                    const c = e.target.value as 'Yes'|'No'|'Compressed';
                    setPack(p=>({...p, compliance:c, compressed: c==='Compressed'}));
                  }}>
                  <option>Yes</option><option>No</option><option>Compressed</option>
                </select>
                {pack.compressed && (
                  <div className="mt-2">
                    <label className="block text-sm opacity-70">Full Pack due (YYYY-MM-DD)</label>
                    <input className="w-full bg-zinc-800 rounded px-3 py-2"
                      placeholder="2025-09-15" value={pack.fullPackDue}
                      onChange={e=>setPack({...pack, fullPackDue:e.target.value})}/>
                  </div>
                )}
              </div>

              <button onClick={submit} className="px-3 py-2 rounded bg-emerald-600">Save Participation</button>

              {existing && (
                <div className="glass-panel-tight">
                  <div className="text-sm opacity-70 mb-1">Latest</div>
                  <div className="text-sm">Compliance: {existing.compliance} {existing.compressed ? '(Compressed)' : ''}</div>
                  {existing.fullPackDue && <div className="text-sm opacity-70">Full Pack due: {existing.fullPackDue}</div>}
                </div>
              )}
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}