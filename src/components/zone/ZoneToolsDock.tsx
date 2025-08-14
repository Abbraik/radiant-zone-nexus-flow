import React from 'react';
import { useToolsStore } from '@/stores/toolsStore';
import { HelpCircle, Activity, Thermometer } from 'lucide-react';

type Props = { zone: 'think'|'monitor'|'act' };

export default function ZoneToolsDock({zone}:Props){
  const toggle = useToolsStore(s=>s.toggle);
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {zone==='think' && (
        <>
          <button onClick={()=>toggle('think','indicators')}
            className="rounded-full bg-white/10 hover:bg-white/20 p-3 border border-white/10 backdrop-blur">
            <Thermometer className="w-5 h-5" />
          </button>
          <button onClick={()=>toggle('think','bands')}
            className="rounded-full bg-white/10 hover:bg-white/20 p-3 border border-white/10 backdrop-blur">
            <Activity className="w-5 h-5" />
          </button>
        </>
      )}
      {zone==='monitor' && (
        <button onClick={()=>toggle('monitor','rel')}
          className="rounded-full bg-white/10 hover:bg-white/20 p-3 border border-white/10 backdrop-blur">
          <HelpCircle className="w-5 h-5" />
        </button>
      )}
      {zone==='act' && (
        <>
          <button onClick={()=>useToolsStore.getState().toggle('act','ship' as any)}
            className="rounded-full bg-white/10 hover:bg-white/20 p-3 border border-white/10 backdrop-blur">
            Ship
          </button>
          <button onClick={()=>useToolsStore.getState().toggle('act','gate' as any)}
            className="rounded-full bg-white/10 hover:bg-white/20 p-3 border border-white/10 backdrop-blur">
            Gate
          </button>
        </>
      )}
    </div>
  );
}
