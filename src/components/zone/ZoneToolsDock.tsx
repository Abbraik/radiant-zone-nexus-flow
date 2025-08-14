import React from 'react';
import { useToolsStore } from '@/stores/toolsStore';
import { HelpCircle, Activity, Thermometer, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

type Props = { zone: 'think'|'monitor'|'act'|'admin' };

export default function ZoneToolsDock({zone}:Props){
  const toggle = useToolsStore(s=>s.toggle);
  return (
    <div className="fixed bottom-6 right-6 z-40 flex flex-col items-end gap-2">
      {zone==='think' && (
        <>
          <motion.button onClick={()=>toggle('think','indicators')}
            className="glass-dock-btn"
            whileHover={{ y: -2, scale: 1.06 }}
            whileTap={{ scale: 0.98 }}>
            <Thermometer className="w-5 h-5" />
          </motion.button>
          <motion.button onClick={()=>toggle('think','bands')}
            className="glass-dock-btn"
            whileHover={{ y: -2, scale: 1.06 }}
            whileTap={{ scale: 0.98 }}>
            <Activity className="w-5 h-5" />
          </motion.button>
        </>
      )}
      {zone==='monitor' && (
        <div className="flex flex-col items-end gap-2">
          <motion.button onClick={()=>toggle('monitor','rel')}
            className="glass-dock-btn"
            whileHover={{ y: -2, scale: 1.06 }}
            whileTap={{ scale: 0.98 }}>
            <HelpCircle className="w-5 h-5" />
          </motion.button>
          <motion.button onClick={()=>toggle('monitor','transparency')}
            className="glass-dock-btn"
            whileHover={{ y: -2, scale: 1.06 }}
            whileTap={{ scale: 0.98 }}>
            <FileText className="w-5 h-5" />
          </motion.button>
          <motion.button onClick={()=>toggle('monitor','pilot')}
            className="glass-dock-btn"
            whileHover={{ y: -2, scale: 1.06 }}
            whileTap={{ scale: 0.98 }}>
            Pilots
          </motion.button>
        </div>
      )}
      {zone==='admin' && (
        <motion.button onClick={()=>useToolsStore.getState().toggle('admin','meta' as any)}
          className="glass-dock-btn"
          whileHover={{ y: -2, scale: 1.06 }}
          whileTap={{ scale: 0.98 }}>
          Meta
        </motion.button>
      )}
      {zone==='act' && (
        <div className="flex flex-col items-end gap-2">
          <motion.button onClick={()=>useToolsStore.getState().toggle('act','stacks' as any)}
            className="glass-dock-btn"
            whileHover={{ y: -2, scale: 1.06 }}
            whileTap={{ scale: 0.98 }}>Stacks</motion.button>
          <motion.button onClick={()=>useToolsStore.getState().toggle('act','pdi' as any)}
            className="glass-dock-btn"
            whileHover={{ y: -2, scale: 1.06 }}
            whileTap={{ scale: 0.98 }}>PDI</motion.button>
          <motion.button onClick={()=>useToolsStore.getState().toggle('act','gate' as any)}
            className="glass-dock-btn"
            whileHover={{ y: -2, scale: 1.06 }}
            whileTap={{ scale: 0.98 }}>Gate</motion.button>
          <motion.button onClick={()=>useToolsStore.getState().toggle('act','participation' as any)}
            className="glass-dock-btn"
            whileHover={{ y: -2, scale: 1.06 }}
            whileTap={{ scale: 0.98 }}>Part.</motion.button>
          <motion.button onClick={()=>useToolsStore.getState().toggle('act','ship' as any)}
            className="glass-dock-btn"
            whileHover={{ y: -2, scale: 1.06 }}
            whileTap={{ scale: 0.98 }}>Ship</motion.button>
        </div>
      )}
    </div>
  );
}
