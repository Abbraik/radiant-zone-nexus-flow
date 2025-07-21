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
  icon: React.ComponentType<{
    className?: string;
  }>;
  path: string;
  description: string;
}
const sidebarItems: SidebarItem[] = [{
  id: 'think',
  label: 'Think',
  icon: Brain,
  path: '/think',
  description: 'Sprint planning & tension analysis'
}, {
  id: 'act',
  label: 'Act',
  icon: Zap,
  path: '/act',
  description: 'Bundle creation & role management'
}, {
  id: 'monitor',
  label: 'Monitor',
  icon: BarChart3,
  path: '/monitor',
  description: 'Loop monitoring & TRI tracking'
}, {
  id: 'innovate-learn',
  label: 'Innovate + Learn',
  icon: Lightbulb,
  path: '/innovate',
  description: 'Insights & experimentation'
}];
export const Sidebar: React.FC = () => {
  const {
    sidebarCollapsed,
    setSidebarCollapsed
  } = useUIStore();
  const location = useLocation();
  const sidebarVariants = {
    expanded: {
      width: '280px',
      transition: {
        type: 'spring' as const,
        bounce: 0.1,
        duration: 0.4
      }
    },
    collapsed: {
      width: '72px',
      transition: {
        type: 'spring' as const,
        bounce: 0.1,
        duration: 0.4
      }
    }
  };
  const contentVariants = {
    expanded: {
      opacity: 1,
      x: 0,
      transition: {
        delay: 0.1,
        duration: 0.2
      }
    },
    collapsed: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.1
      }
    }
  };
  return <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {!sidebarCollapsed && <motion.div initial={{
        opacity: 0
      }} animate={{
        opacity: 1
      }} exit={{
        opacity: 0
      }} onClick={() => setSidebarCollapsed(true)} className="fixed inset-0 bg-black/50 z-40 lg:hidden" />}
      </AnimatePresence>

      {/* Sidebar */}
      
    </>;
};