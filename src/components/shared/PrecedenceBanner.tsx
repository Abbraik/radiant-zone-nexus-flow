import React from 'react';
import { usePrecedenceStore } from '@/stores/precedenceStore';
import { useToolsStore } from '@/stores/toolsStore';

export default function PrecedenceBanner(){
  const { state, refresh } = usePrecedenceStore();
  React.useEffect(()=>{ refresh(); },[refresh]);
  if(!state.active) return null;
  return (
    <div className="mb-3 rounded-xl border border-amber-400/30 bg-amber-500/10 text-amber-200 px-3 py-2 flex items-center justify-between">
      <div className="text-sm">
        {state.banner ?? 'Meta-Loop precedence is active.'} • Paused RELs: {state.relIds.map(id=>id.slice(0,8)).join(', ')}
      </div>
      <button
        onClick={()=>useToolsStore.getState().toggle('monitor','rel')}
        className="text-xs px-2 py-1 rounded border border-amber-400/30 hover:bg-amber-400/10">
        View Meta-Loop
      </button>
    </div>
  );
}