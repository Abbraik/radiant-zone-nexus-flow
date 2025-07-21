import React from 'react';
import { motion } from 'framer-motion';
import { NavLink } from 'react-router-dom';
import { Brain, Zap, BarChart3, Lightbulb, Menu, Settings } from 'lucide-react';
import { useUIStore } from '../../stores/ui-store';
import { FeatureFlagChip } from './FeatureFlagProvider';
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
  const { setSidebarCollapsed, sidebarCollapsed, currentZone, setCurrentZone } = useUIStore();

  const handleZoneChange = (zone: Zone) => {
    setCurrentZone(zone);
  };

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-secondary border-b border-border-subtle h-16 flex items-center justify-between px-6 sticky top-0 z-50"
    >
      {/* Left Section - Logo & Menu */}
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          className="lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </Button>
        
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">RGS</span>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-lg font-semibold text-foreground">MVUI</h1>
            <p className="text-xs text-foreground-muted -mt-1">Multi-Variable User Interface</p>
          </div>
        </div>
      </div>

      {/* Center Section - Zone Navigation */}
      <nav className="hidden md:flex items-center gap-1 bg-glass-primary/50 rounded-xl p-1">
        {zoneTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentZone === tab.id;
          
          return (
            <NavLink
              key={tab.id}
              to={tab.path}
              onClick={() => handleZoneChange(tab.id)}
              className={({ isActive: navActive }) => `
                relative flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-fast
                ${navActive || isActive 
                  ? 'bg-primary text-primary-foreground shadow-md' 
                  : 'text-foreground-muted hover:text-foreground hover:bg-glass-secondary/50'
                }
              `}
            >
              {({ isActive: navActive }) => (
                <>
                  <Icon className="h-4 w-4" />
                  <span className="hidden lg:inline">{tab.label}</span>
                  {(navActive || isActive) && (
                    <motion.div
                      layoutId="activeZone"
                      className="absolute inset-0 bg-primary rounded-lg -z-10"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Right Section - Feature Flags & Settings */}
      <div className="flex items-center gap-3">
        <FeatureFlagChip flag="newRgsUI" />
        
        <Button variant="ghost" size="sm" className="text-foreground-muted hover:text-foreground">
          <Settings className="h-4 w-4" />
        </Button>
        
        {/* Role Indicator */}
        <div className="hidden sm:flex items-center gap-2 bg-glass-secondary/50 rounded-lg px-3 py-1.5">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <span className="text-xs">👩‍💼</span>
          </div>
          <span className="text-sm text-foreground-muted">Sarah Chen</span>
        </div>
      </div>
    </motion.header>
  );
};