import React from 'react';
import { useToolsStore } from '@/stores/toolsStore';
import { HelpCircle, Activity, Thermometer, FileText } from 'lucide-react';

type Props = { zone: 'think'|'monitor'|'act'|'admin' };

export default function ZoneToolsDock({zone}:Props){
  const toggle = useToolsStore(s=>s.toggle);
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {zone==='think' && (
        <>
          <button onClick={()=>toggle('think','indicators')}
            className="glass-dock-btn">
            <Thermometer className="w-5 h-5" />
          </button>
          <button onClick={()=>toggle('think','bands')}
            className="glass-dock-btn">
            <Activity className="w-5 h-5" />
          </button>
        </>
      )}
      {zone==='monitor' && (
        <div className="flex flex-col items-end gap-2">
          <button onClick={()=>toggle('monitor','rel')}
            className="glass-dock-btn">
            <HelpCircle className="w-5 h-5" />
          </button>
          <button onClick={()=>toggle('monitor','transparency')}
            className="glass-dock-btn">
            <FileText className="w-5 h-5" />
          </button>
          <button onClick={()=>toggle('monitor','pilot')}
            className="glass-dock-btn">
            Pilots
          </button>
        </div>
      )}
      {zone==='admin' && (
        <button onClick={()=>useToolsStore.getState().toggle('admin','meta' as any)}
          className="glass-dock-btn">
          Meta
        </button>
      )}
      {zone==='act' && (
        <div className="flex flex-col items-end gap-2">
          <button onClick={()=>useToolsStore.getState().toggle('act','stacks' as any)}
            className="glass-dock-btn">Stacks</button>
          <button onClick={()=>useToolsStore.getState().toggle('act','pdi' as any)}
            className="glass-dock-btn">PDI</button>
          <button onClick={()=>useToolsStore.getState().toggle('act','gate' as any)}
            className="glass-dock-btn">Gate</button>
          <button onClick={()=>useToolsStore.getState().toggle('act','participation' as any)}
            className="glass-dock-btn">Part.</button>
          <button onClick={()=>useToolsStore.getState().toggle('act','ship' as any)}
            className="glass-dock-btn">Ship</button>
        </div>
      )}
    </div>
  );
}
