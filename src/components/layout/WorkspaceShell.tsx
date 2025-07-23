import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Search, Settings, User, MessageSquare, Target, Users } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { useFeatureFlags } from './FeatureFlagProvider';
import { useUIStore } from '@/stores/ui-store';
import { FeatureFlagChip } from './FeatureFlagProvider';

interface WorkspaceShellProps {
  children: React.ReactNode;
  activeTask?: any;
  myTasks?: any[];
  onCopilotToggle?: () => void;
  onTeamsToggle?: () => void;
  onGoalTreeToggle?: () => void;
}

export const WorkspaceShell: React.FC<WorkspaceShellProps> = ({
  children,
  activeTask,
  myTasks = [],
  onCopilotToggle,
  onTeamsToggle,
  onGoalTreeToggle
}) => {
  const { flags } = useFeatureFlags();
  const { currentZone, sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const [searchValue, setSearchValue] = useState('');

  // Animation variants
  const headerVariants = {
    initial: { y: -64, opacity: 0 },
    animate: { y: 0, opacity: 1 }
  };

  const shellVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1 }
  };

  const contentVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1 }
  };

  return (
    <motion.div 
      className="h-screen w-full flex flex-col bg-background overflow-hidden"
      initial={shellVariants.initial}
      animate={shellVariants.animate}
      transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
    >
      {/* Premium Header */}
      <motion.header 
        className="h-16 flex items-center justify-between px-8 glass-secondary border-b border-border-subtle/30 relative z-50"
        initial={headerVariants.initial}
        animate={headerVariants.animate}
        transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Left Section - Logo & Navigation */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-r from-primary to-accent flex items-center justify-center">
              <span className="text-background font-bold text-sm">R</span>
            </div>
            <span className="text-foreground font-semibold text-lg">Workspace</span>
          </div>

          {/* Task Switcher */}
          {myTasks.length > 0 && (
            <div className="flex items-center gap-2">
              <div className="h-4 w-px bg-border-subtle" />
              <Badge variant="secondary" className="text-xs">
                {myTasks.length} active task{myTasks.length !== 1 ? 's' : ''}
              </Badge>
            </div>
          )}
        </div>

        {/* Center Section - Search */}
        <div className="flex-1 max-w-md mx-8">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-foreground-subtle" />
            <Input
              placeholder="Search tasks, goals, insights..."
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              className="pl-10 bg-glass-primary/50 border-border-subtle/30 focus:border-primary/50 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Right Section - Actions & User */}
        <div className="flex items-center gap-3">
          {/* AI Copilot */}
          {flags.aiCopilot && onCopilotToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onCopilotToggle}
              className="text-primary hover:text-primary-hover hover:bg-primary/10"
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          )}

          {/* Teams Chat */}
          {flags.useCollabEngine && onTeamsToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onTeamsToggle}
              className="text-accent hover:text-accent-hover hover:bg-accent/10"
            >
              <Users className="h-4 w-4" />
            </Button>
          )}

          {/* 3D Cascade */}
          {flags.useCascade3D && onGoalTreeToggle && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onGoalTreeToggle}
              className="text-success hover:text-success/80 hover:bg-success/10"
            >
              <Target className="h-4 w-4" />
            </Button>
          )}

          {/* Notifications */}
          <Button variant="ghost" size="sm">
            <Bell className="h-4 w-4" />
          </Button>

          <div className="h-4 w-px bg-border-subtle" />

          {/* Feature Flag Chip */}
          <FeatureFlagChip flag="useUltimateWorkspace" />

          {/* User Avatar */}
          <Avatar className="h-8 w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="bg-primary text-primary-foreground text-xs">
              JD
            </AvatarFallback>
          </Avatar>
        </div>
      </motion.header>

      {/* Main Content Area */}
      <motion.main 
        className="flex-1 relative overflow-hidden"
        initial={contentVariants.initial}
        animate={contentVariants.animate}
        transition={{ duration: 0.4, delay: 0.1, ease: [0.23, 1, 0.32, 1] }}
      >
        {/* Glass Container */}
        <div className="h-full w-full p-8 relative">
          <motion.div 
            className="h-full w-full glass rounded-3xl p-8 relative overflow-auto custom-scrollbar"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.2, ease: [0.23, 1, 0.32, 1] }}
          >
            {children}
          </motion.div>
        </div>

        {/* Floating Footer */}
        <motion.footer 
          className="absolute bottom-8 left-8 right-8 h-14 glass-secondary rounded-full px-6 flex items-center justify-between border border-border-subtle/20"
          initial={{ y: 64, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.3, ease: [0.23, 1, 0.32, 1] }}
        >
          {/* Presence Avatars */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-foreground-subtle">Active:</span>
            <div className="flex -space-x-2">
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="text-xs bg-primary text-primary-foreground">J</AvatarFallback>
              </Avatar>
              <Avatar className="h-6 w-6 border-2 border-background">
                <AvatarFallback className="text-xs bg-accent text-accent-foreground">S</AvatarFallback>
              </Avatar>
            </div>
          </div>

          {/* Center Actions */}
          <div className="flex items-center gap-4">
            {flags.useCollabEngine && (
              <Button variant="ghost" size="sm" className="text-xs">
                Start Pair Work
              </Button>
            )}
          </div>

          {/* Status Indicators */}
          <div className="flex items-center gap-3">
            {flags.useOfflinePWA && (
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-success animate-pulse-subtle" />
                <span className="text-xs text-foreground-subtle">Online</span>
              </div>
            )}
            <Badge variant="outline" className="text-xs">
              Zone: {currentZone}
            </Badge>
          </div>
        </motion.footer>
      </motion.main>
    </motion.div>
  );
};