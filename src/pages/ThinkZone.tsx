import React from 'react';
import { motion } from 'framer-motion';
import { ThinkZoneWorkspace } from '../components/zones/ThinkZoneWorkspace';

export const ThinkZone: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-full"
    >
      <ThinkZoneWorkspace />
    </motion.div>
  );
};