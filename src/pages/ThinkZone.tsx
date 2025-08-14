import React from 'react';
import { motion } from 'framer-motion';
import { ThinkZoneWorkspace } from '../components/zones/ThinkZoneWorkspace';
import ZoneToolsDock from '@/components/zone/ZoneToolsDock';
import ZoneToolsPortals from '@/components/zone/ZoneToolsPortals';

export const ThinkZone: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-full relative"
    >
      <ThinkZoneWorkspace />
      <ZoneToolsDock zone="think" />
      <ZoneToolsPortals zone="think" />
    </motion.div>
  );
};