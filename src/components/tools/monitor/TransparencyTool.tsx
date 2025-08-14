import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { ds } from '@/services/datasource';
import { useToolsStore } from '@/stores/toolsStore';
import { Overlay as MotionOverlay, Content as MotionContent } from '@/components/motion/MotionDialog';

type PackType = 'short'|'full';

export default function TransparencyTool(){
  const open = useToolsStore(s=>s.monitor.transparency);
  const close = useToolsStore(s=>s.close);

  const [tab,setTab]=React.useState<'publish'|'history'>('publish');
  const [refType,setRefType]=React.useState<'rel'|'meta'>('rel');
  const [refId,setRefId]=React.useState<string>('');
  const [rels,setRels]=React.useState<any[]>([]);
  const [metas,setMetas]=React.useState<any[]>([]);
  const [type,setType]=React.useState<PackType>('short');
  const [url,setUrl]=React.useState<string>('/packs/demo.pdf');
  const [history,setHistory]=React.useState<any[]>([]);

  React.useEffect(()=>{
    if(!open) return;
    (async ()=>{
      const relRows = await ds.listRel();
      setRels(relRows);
      if (!refId && relRows[0]) setRefId(relRows[0].id);
      // meta list (optional): try reading via open Meta (we may not have a listing API; we'll infer from transparency history later)
      const all = await ds.listAllPacks();
      const metaIds = Array.from(new Set(all.filter(p=>p.refType==='meta').map(p=>p.refId)));
      setMetas(metaIds.map(id=>({id})));
    })();
  },[open]);

  async function loadHistory(){
    if(!refId) return;
    const rows = await ds.listPacks(refType, refId);
    // newest first
    setHistory(rows.slice().sort((a:any,b:any)=> (a.publishedAt>b.publishedAt?-1:1)));
  }

  async function publish(){
    if(!refId || !url) return;
    const pack = await ds.publishPack({ refType, refId, type, url });
    setTab('history');
    await loadHistory();
  }

  React.useEffect(()=>{ if(open){ loadHistory(); } },[refType, refId, open]);

  return (
    <Dialog.Root open={open} onOpenChange={(v)=>!v && close('monitor','transparency')}>
      <Dialog.Portal>
        <MotionOverlay />
        <MotionContent className="glass-modal top-14 w-[960px] z-50">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Transparency Packs</h2>
            <div className="flex items-center gap-3 text-sm">
              <button onClick={()=>setTab('publish')} className={`px-2 py-1 rounded ${tab==='publish'?'bg-white/10':''}`}>Publish</button>
              <button onClick={()=>setTab('history')} className={`px-2 py-1 rounded ${tab==='history'?'bg-white/10':''}`}>History</button>
            </div>
            <Dialog.Close className="text-sm opacity-70 hover:opacity-100">Close</Dialog.Close>
          </div>

          {/* selector */}
          <div className="flex flex-wrap items-end gap-3 mb-4">
            <div>
              <label className="block text-xs opacity-70">Reference</label>
              <select className="glass-input border border-white/10" value={refType} onChange={e=>setRefType(e.target.value as any)}>
                <option value="rel">REL</option>
                <option value="meta">Meta-REL</option>
              </select>
            </div>
            <div className="min-w-[320px]">
              <label className="block text-xs opacity-70">{refType==='rel'?'REL ID':'Meta-REL ID'}</label>
              {refType==='rel' ? (
                <select className="glass-input border border-white/10" value={refId} onChange={e=>setRefId(e.target.value)}>
                  {rels.map(r=><option key={r.id} value={r.id}>{r.id.slice(0,8)}</option>)}
                </select>
              ) : (
                <select className="glass-input border border-white/10" value={refId} onChange={e=>setRefId(e.target.value)}>
                  {metas.length ? metas.map(m=><option key={m.id} value={m.id}>{m.id.slice(0,8)}</option>) : <option value="">(none)</option>}
                </select>
              )}
            </div>
            {tab==='publish' && (
              <>
                <div>
                  <label className="block text-xs opacity-70">Type</label>
                  <select className="glass-input border border-white/10" value={type} onChange={e=>setType(e.target.value as PackType)}>
                    <option value="short">Short</option>
                    <option value="full">Full</option>
                  </select>
                </div>
                <div className="grow">
                  <label className="block text-xs opacity-70">Pack URL</label>
                  <input className="glass-input border border-white/10" value={url} onChange={e=>setUrl(e.target.value)} placeholder="/packs/REL-1234-short.pdf"/>
                </div>
                <button onClick={publish} className="btn-primary h-10">Publish</button>
              </>
            )}
          </div>

          {/* body */}
          {tab==='history' ? (
            <div className="space-y-2 max-h-[460px] overflow-auto pr-1">
              {history.map((p:any)=>(
                <div key={p.id} className="glass-panel-tight p-3 grid grid-cols-[120px,1fr,1fr] gap-3">
                  <div className="text-xs">
                    <div className="opacity-70">Type</div>
                    <div className="font-medium uppercase">{p.type}</div>
                  </div>
                  <div className="text-xs">
                    <div className="opacity-70">URL</div>
                    <div className="truncate">{p.url}</div>
                  </div>
                  <div className="text-xs">
                    <div className="opacity-70">Published</div>
                    <div>{new Date(p.publishedAt).toLocaleString()}</div>
                  </div>
                  <div className="col-span-3 text-[11px] break-all opacity-80 mt-1">hash: {p.hash}</div>
                </div>
              ))}
              {!history.length && <div className="text-sm text-zinc-300">No packs yet for this reference.</div>}
            </div>
          ) : (
            <div className="text-sm opacity-70">Publishing creates an immutable version with a SHA-256 hash. Re-publishing the same reference creates a new version.</div>
          )}
        </MotionContent>
      </Dialog.Portal>
    </Dialog.Root>
  );
}