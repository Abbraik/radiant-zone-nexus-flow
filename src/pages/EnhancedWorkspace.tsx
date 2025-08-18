import React from 'react';
import { motion } from 'framer-motion';
import { EnhancedWorkspace as EnhancedWorkspaceComponent } from '../components/workspace/EnhancedWorkspace';

export const EnhancedWorkspace: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="h-screen w-full"
    >
      <EnhancedWorkspaceComponent />
    </motion.div>
  );
};