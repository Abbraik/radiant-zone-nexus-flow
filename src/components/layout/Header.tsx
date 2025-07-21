import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Brain, Zap, BarChart3, Lightbulb, User, Briefcase } from 'lucide-react';
import { useUIStore } from '../../stores/ui-store';
import { FeatureFlagChip, useFeatureFlags } from './FeatureFlagProvider';
import { Button } from '../ui/button';
import type { Zone } from '../../types';

interface ZoneTab {
  id: Zone;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
}

const zoneTabs: ZoneTab[] = [
  { id: 'think', label: 'Think', icon: Brain, path: '/think' },
  { id: 'act', label: 'Act', icon: Zap, path: '/act' },
  { id: 'monitor', label: 'Monitor', icon: BarChart3, path: '/monitor' },
  { id: 'innovate-learn', label: 'Innovate + Learn', icon: Lightbulb, path: '/innovate' }
];

export const Header: React.FC = () => {
  const { currentZone, setCurrentZone } = useUIStore();
  const { updateFlag, isEnabled } = useFeatureFlags();

  const handleZoneChange = (zone: Zone) => {
    setCurrentZone(zone);
  };

  const toggleWorkspace = () => {
    const isCurrentlyEnabled = isEnabled('newTaskDrivenUI');
    updateFlag('newTaskDrivenUI', !isCurrentlyEnabled);
  };

  return (
    <motion.header
      initial={{ y: -8, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="h-12 relative z-50"
    >
      {/* Full-width glass backdrop */}
      <div className="absolute inset-0 bg-glass-backdrop/60 backdrop-blur-xl border-b border-border/10" />
      
      <div className="relative h-full flex items-center justify-between px-8 max-w-7xl mx-auto">
        {/* Logo - Left */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 }}
        >
          <NavLink to="/" className="flex items-center gap-3 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-primary via-primary-hover to-accent shadow-lg flex items-center justify-center animate-glow">
              <span className="text-white font-bold text-xs">R</span>
            </div>
            <span className="font-semibold text-foreground text-sm tracking-tight">RGS MVUI</span>
          </NavLink>
        </motion.div>

        {/* Center Navigation - Floating Tabs */}
        <motion.nav 
          className="flex items-center bg-glass-primary/40 backdrop-blur-md rounded-2xl p-1 border border-border/20 shadow-elevation"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {zoneTabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = currentZone === tab.id;
            
            return (
              <NavLink
                key={tab.id}
                to={tab.path}
                onClick={() => handleZoneChange(tab.id)}
                className={({ isActive: navActive }) =>
                  `relative flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    navActive || isActive
                      ? 'text-primary-foreground shadow-lg'
                      : 'text-foreground-muted hover:text-foreground'
                  }`
                }
              >
                {({ isActive: navActive }) => (
                  <>
                    {(navActive || isActive) && (
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-primary to-primary-hover rounded-xl shadow-glow"
                        layoutId="activeTab"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <Icon className="w-4 h-4 relative z-10" />
                    <span className="relative z-10 hidden lg:inline">{tab.label}</span>
                  </>
                )}
              </NavLink>
            );
          })}
        </motion.nav>

        {/* Right Side - Role & Profile */}
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          {/* Feature Flag Badge */}
          <FeatureFlagChip flag="newRgsUI" />

          {/* Workspace Toggle Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleWorkspace}
            className={`border-border/20 backdrop-blur-sm transition-all duration-200 ${
              isEnabled('newTaskDrivenUI')
                ? 'bg-primary text-primary-foreground border-primary/50 shadow-glow'
                : 'bg-glass-secondary/60 text-foreground-muted hover:bg-glass-secondary/80'
            }`}
          >
            <Briefcase className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">
              {isEnabled('newTaskDrivenUI') ? 'Exit Workspace' : 'Workspace'}
            </span>
          </Button>

          {/* Role Pill */}
          <div className="bg-glass-secondary/60 backdrop-blur-sm rounded-2xl px-4 py-1.5 border border-border/20 hidden lg:block">
            <span className="text-xs font-medium text-foreground-muted">Product Manager</span>
          </div>
          
          {/* Profile */}
          <button className="w-8 h-8 bg-glass-secondary/60 backdrop-blur-sm rounded-xl border border-border/20 flex items-center justify-center hover:bg-glass-secondary/80 transition-all duration-200 hover:scale-105">
            <User className="w-4 h-4 text-foreground-muted" />
          </button>
        </motion.div>
      </div>
    </motion.header>
  );
};