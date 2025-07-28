import React from 'react';
import { motion } from 'framer-motion';
import { CLDWorkspace } from '../components/cld/CLDWorkspace';

export const ThinkZoneStudio: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-full"
    >
      <CLDWorkspace />
    </motion.div>
  );
};