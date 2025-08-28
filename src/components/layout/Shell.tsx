import React from 'react';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { EnhancedHeader } from './EnhancedHeader';
import { FeatureFlagProvider } from './FeatureFlagProvider';
import { useTasks } from '../../hooks/useTasks';

interface ShellProps {
  children: React.ReactNode;
  onCopilotToggle?: () => void;
  onTeamsToggle?: () => void;
  onGoalTreeToggle?: () => void;
  onPairWorkStart?: (partnerId: string) => void;
  isDashboard?: boolean;
}

export const Shell: React.FC<ShellProps> = ({ 
  children, 
  onCopilotToggle,
  onTeamsToggle,
  onGoalTreeToggle,
  onPairWorkStart,
  isDashboard = false
}) => {
  return (
    <FeatureFlagProvider>
      <div className="h-screen w-full flex flex-col bg-background overflow-hidden">
        <EnhancedHeader 
          onCopilotToggle={onCopilotToggle}
          onTeamsToggle={onTeamsToggle}
          onGoalTreeToggle={onGoalTreeToggle}
          onPairWorkStart={onPairWorkStart}
          isDashboard={isDashboard}
        />
        
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