import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { Brain, Zap, BarChart3, Lightbulb, X, ChevronLeft } from 'lucide-react';
import { useUIStore } from '../../stores/ui-store';
import { Button } from '../ui/button';
import type { Zone } from '../../types';

interface SidebarItem {
  id: Zone;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  description: string;
}

const sidebarItems: SidebarItem[] = [
  {
    id: 'think',
    label: 'Think',
    icon: Brain,
    path: '/think',
    description: 'Sprint planning & tension analysis'
  },
  {
    id: 'act',
    label: 'Act',
    icon: Zap,
    path: '/act',
    description: 'Bundle creation & role management'
  },
  {
    id: 'monitor',
    label: 'Monitor',
    icon: BarChart3,
    path: '/monitor',
    description: 'Loop monitoring & TRI tracking'
  },
  {
    id: 'innovate-learn',
    label: 'Innovate + Learn',
    icon: Lightbulb,
    path: '/innovate',
    description: 'Insights & experimentation'
  }
];

export const Sidebar: React.FC = () => {
  const { sidebarCollapsed, setSidebarCollapsed } = useUIStore();
  const location = useLocation();

  const sidebarVariants = {
    expanded: {
      width: '280px',
      transition: { type: 'spring' as const, bounce: 0.1, duration: 0.4 }
    },
    collapsed: {
      width: '72px',
      transition: { type: 'spring' as const, bounce: 0.1, duration: 0.4 }
    }
  };

  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: { delay: 0.1, duration: 0.2 }
    },
    collapsed: {
      opacity: 0,
      x: -10,
      transition: { duration: 0.1 }
    }
  };

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarCollapsed(true)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        initial="expanded"
        animate={sidebarCollapsed ? 'collapsed' : 'expanded'}
        className={`
          fixed lg:relative top-0 left-0 h-screen bg-glass-primary border-r border-border-subtle z-50
          flex flex-col transition-all duration-smooth
          ${sidebarCollapsed ? 'lg:w-[72px]' : 'lg:w-[280px]'}
          ${sidebarCollapsed ? '-translate-x-full lg:translate-x-0' : 'translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border-subtle">
          <AnimatePresence mode="wait">
            {!sidebarCollapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="flex items-center gap-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-primary-hover flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-sm">RGS</span>
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">Navigation</h2>
                  <p className="text-xs text-foreground-muted">Zone Selection</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="text-foreground-muted hover:text-foreground shrink-0"
          >
            {sidebarCollapsed ? (
              <ChevronLeft className="h-4 w-4 rotate-180" />
            ) : (
              <ChevronLeft className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.id}
                to={item.path}
                className={({ isActive: navActive }) => `
                  group relative flex items-center gap-3 p-3 rounded-xl transition-all duration-fast
                  ${navActive || isActive
                    ? 'bg-primary text-primary-foreground shadow-lg'
                    : 'text-foreground-muted hover:text-foreground hover:bg-glass-secondary/50'
                  }
                `}
              >
                <Icon className="h-5 w-5 shrink-0" />
                
                <AnimatePresence>
                  {!sidebarCollapsed && (
                    <motion.div
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="min-w-0 flex-1"
                    >
                      <div className="font-medium text-sm">{item.label}</div>
                      <div className="text-xs opacity-75 truncate">{item.description}</div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Tooltip for collapsed state */}
                {sidebarCollapsed && (
                  <div className="absolute left-full ml-3 px-3 py-2 bg-popover text-popover-foreground rounded-lg shadow-lg border border-border opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50">
                    <div className="font-medium text-sm">{item.label}</div>
                    <div className="text-xs opacity-75">{item.description}</div>
                  </div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border-subtle">
          <AnimatePresence>
            {!sidebarCollapsed && (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="text-xs text-foreground-muted space-y-1"
              >
                <div>RGS MVUI v2.0</div>
                <div>Feature Flag: Active</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.aside>
    </>
  );
};