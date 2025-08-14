import React from 'react';
import { usePrecedenceStore } from '@/stores/precedenceStore';
import { useToolsStore } from '@/stores/toolsStore';

export default function PrecedenceBanner(){
  const { state, refresh } = usePrecedenceStore();
  React.useEffect(()=>{ refresh(); },[refresh]);
  if(!state.active) return null;
  return (
    <div className="mb-3 banner-amber flex items-center justify-between">
      <div className="text-sm">
        {state.banner ?? 'Meta-Loop precedence is active.'} • Paused RELs: {state.relIds.map(id=>id.slice(0,8)).join(', ')}
      </div>
      <button
        onClick={()=>useToolsStore.getState().toggle('monitor','rel')}
        className="btn-chip border-amber-400/30 hover:bg-amber-400/10">
        View Meta-Loop
      </button>
    </div>
  );
}