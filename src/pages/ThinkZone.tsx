import React from 'react';
import { motion } from 'framer-motion';
import { ThinkZoneWorkspace } from '../components/zones/ThinkZoneWorkspace';
import ZoneToolsDock from '@/components/zone/ZoneToolsDock';
import ZoneToolsPortals from '@/components/zone/ZoneToolsPortals';
import { useToolsStore } from '@/stores/toolsStore';

export const ThinkZone: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-full relative"
    >
      <div className="absolute top-4 right-4 z-10">
        <button onClick={()=>useToolsStore.getState().openAbout('workflow')} className="btn-chip">What is this? (workflow)</button>
      </div>
      <ThinkZoneWorkspace />
      <ZoneToolsDock zone="think" />
      <ZoneToolsPortals zone="think" />
    </motion.div>
  );
};