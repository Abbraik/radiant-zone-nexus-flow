import React from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { FeatureFlagProvider } from './FeatureFlagProvider';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  return (
    <FeatureFlagProvider>
      <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
        <Header />
        
        <motion.main
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.3 }}
          className="flex-1 overflow-auto"
        >
          {children}
        </motion.main>
      </div>
    </FeatureFlagProvider>
  );
};