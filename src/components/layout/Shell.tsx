import React from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { FeatureFlagProvider } from './FeatureFlagProvider';
import { useUIStore } from '../../stores/ui-store';

interface ShellProps {
  children: React.ReactNode;
}

export const Shell: React.FC<ShellProps> = ({ children }) => {
  const { sidebarCollapsed } = useUIStore();

  return (
    <FeatureFlagProvider>
      <div className="min-h-screen w-full flex bg-background">
        <Sidebar />
        
        <div className="flex-1 flex flex-col min-w-0">
          <Header />
          
          <motion.main
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.3 }}
            className="flex-1 p-6 overflow-auto"
          >
            <div className="max-w-7xl mx-auto">
              {children}
            </div>
          </motion.main>
        </div>
      </div>
    </FeatureFlagProvider>
  );
};