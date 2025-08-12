import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Brain, 
  Zap, 
  BarChart3, 
  Lightbulb, 
  User, 
  Briefcase,
  Home,
  Settings,
  Package,
  Shield,
  Star,
  Wifi,
  Menu,
  X,
  Bot,
  Users,
  Target,
  MessageSquare,
  Activity
} from 'lucide-react';
import { useUIStore } from '../../stores/ui-store';
import { FeatureFlagChip, useFeatureFlags } from './FeatureFlagProvider';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTasks } from '../../hooks/useTasks';
import type { Zone } from '../../types';
import HeaderAddons from '@/components/shell/HeaderAddons';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  path: string;
  description?: string;
  badge?: string;
  requiresFeature?: keyof import('../../types').FeatureFlags;
}

// Zone Navigation (Legacy RGS)
const zoneTabs: NavigationItem[] = [
  { id: 'think', label: 'Think', icon: Brain, path: '/think', description: 'Strategic planning and design' },
  { id: 'act', label: 'Act', icon: Zap, path: '/act', description: 'Execute interventions' },
  { id: 'monitor', label: 'Monitor', icon: BarChart3, path: '/monitor', description: 'Track performance' },
  { id: 'innovate-learn', label: 'Innovate + Learn', icon: Lightbulb, path: '/innovate', description: 'Continuous improvement' }
];

// Ultimate Workspace Navigation
const workspaceNavigation: NavigationItem[] = [
  { id: 'workspace', label: 'Home', icon: Home, path: '/workspace', description: 'Main workspace hub' },
  { id: 'dashboard', label: 'Dashboard', icon: BarChart3, path: '/dashboard', description: 'Analytics & insights' },
  { 
    id: 'mission-control', 
    label: 'Mission Control', 
    icon: Activity, 
    path: '/mission-control', 
    description: 'Real-time system overview'
  },
  { 
    id: 'admin', 
    label: 'Admin', 
    icon: Settings, 
    path: '/admin', 
    description: 'System administration',
    badge: 'New'
  }
];

export const EnhancedHeader: React.FC = () => {
  const location = useLocation();
  const { currentZone, setCurrentZone } = useUIStore();
  const { updateFlag, isEnabled } = useFeatureFlags();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { myTasks, activeTask } = useTasks();

  const isUltimateWorkspace = isEnabled('newTaskDrivenUI');

  const handleZoneChange = (zone: Zone) => {
    setCurrentZone(zone);
  };

  const toggleWorkspace = () => {
    updateFlag('newTaskDrivenUI', !isUltimateWorkspace);
    setIsMobileMenuOpen(false);
  };

  const getVisibleNavigation = () => {
    if (isUltimateWorkspace) {
      return workspaceNavigation.filter(item => 
        !item.requiresFeature || isEnabled(item.requiresFeature)
      );
    }
    return zoneTabs;
  };

  const visibleNavigation = getVisibleNavigation();
  const loopsNav: NavigationItem = { id: 'think-loops', label: 'Loops', icon: Package, path: '/think/loops', description: 'Loop Registry' };
  const loopStudioNav: NavigationItem = { id: 'think-loop-studio', label: 'Loop Studio', icon: Star, path: '/think/loops/new', description: 'Create and edit loops' };
  const leverageNav: NavigationItem = { id: 'think-leverage', label: 'Leverage', icon: Target, path: '/think/leverage', description: 'Meadows Leverage Ladder' };
  const leverageAnalysisNav: NavigationItem = { id: 'think-leverage-analysis', label: 'Leverage Analysis', icon: BarChart3, path: '/think/leverage-analysis', description: 'Coverage across loops & bundles' };
  const variablesNav: NavigationItem = { id: 'think-variables', label: 'Variables', icon: Shield, path: '/think/variables', description: 'Variable Registry' };
  const bundlesNav: NavigationItem = { id: 'act-bundles', label: 'Bundles', icon: Briefcase, path: '/act/bundles', description: 'Intervention Bundles' };
  const navItems: NavigationItem[] = (!isUltimateWorkspace && import.meta.env.VITE_PAGS_FULL === '1')
    ? [...visibleNavigation, loopsNav, loopStudioNav, leverageNav, leverageAnalysisNav, variablesNav, bundlesNav]
    : visibleNavigation;

  return (
    <>
      <motion.header
        initial={{ y: -8, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="h-16 relative z-50 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 backdrop-blur-xl border-b border-white/10 shadow-2xl"
      >
        <div className="h-full flex items-center justify-between px-3 lg:px-6 max-w-full mx-auto">
          {/* Logo */}
          <motion.div 
            className="flex items-center gap-2 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
          >
            <NavLink to="/" className="flex items-center gap-2 hover:opacity-80 transition-all">
              <div className="w-8 h-8 rounded-xl bg-gradient-primary shadow-elegant flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-sm">R</span>
              </div>
              <div className="hidden md:block">
                <div className="font-bold text-foreground text-base tracking-tight">
                  RGS {isUltimateWorkspace ? 'Ultimate' : 'MVUI'}
                </div>
                <div className="text-xs text-foreground-subtle">
                  {isUltimateWorkspace ? 'Governance OS' : 'Multi-Value UI'}
                </div>
              </div>
            </NavLink>

            {/* Task Selector for Ultimate Workspace */}
            {isUltimateWorkspace && activeTask && myTasks.length > 1 && (
              <Select value={activeTask.id}>
                <SelectTrigger className="w-40 md:w-48 glass border-border-subtle text-foreground backdrop-blur-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-secondary backdrop-blur-xl border-border-subtle">
                  {myTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id} className="text-foreground hover:bg-glass-accent">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="text-xs glass text-foreground-subtle border-border-subtle">
                          {task.zone}
                        </Badge>
                        <span className="truncate">{task.title}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </motion.div>

          {/* Desktop Navigation */}
          <motion.nav 
            className="hidden lg:flex items-center glass backdrop-blur-md rounded-2xl p-1 border border-border-subtle shadow-elegant justify-center min-w-fit"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = (item.id === 'workspace' && (location.pathname === '/workspace' || location.pathname === '/')) ||
                (item.id !== 'workspace' && location.pathname === item.path) ||
                (item.id === currentZone && !isUltimateWorkspace);
              
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => !isUltimateWorkspace && handleZoneChange(item.id as Zone)}
                  className={`relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? 'text-foreground shadow-elegant'
                      : 'text-foreground-subtle hover:text-foreground hover:bg-glass-accent'
                  }`}
                  title={item.description}
                >
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-teal-500 to-cyan-500 rounded-xl shadow-lg shadow-teal-500/20"
                      layoutId="activeTab"
                      transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                    />
                  )}
                  <Icon className="w-4 h-4 relative z-10" />
                  <span className="relative z-10 whitespace-nowrap">{item.label}</span>
                  {item.badge && (
                    <Badge variant="secondary" className="relative z-10 text-xs ml-1 glass text-foreground-subtle border-border-subtle">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              );
            })}
          </motion.nav>

          {/* Right Side Actions */}
          <motion.div 
            className="flex items-center gap-2 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Ultimate Workspace Quick Actions */}
            {isUltimateWorkspace && location.pathname === '/workspace' && isEnabled('realTimeCollab') && (
              <Button variant="ghost" size="sm" className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-smooth">
                <MessageSquare className="w-4 h-4 md:mr-1" />
                <span className="hidden md:inline">Teams</span>
              </Button>
            )}

            {isUltimateWorkspace && location.pathname === '/workspace' && (
              <Button variant="ghost" size="sm" className="text-green-400 hover:text-green-300 hover:bg-green-500/20 transition-smooth">
                <Target className="w-4 h-4 md:mr-1" />
                <span className="hidden md:inline">Goals</span>
              </Button>
            )}

            {isUltimateWorkspace && location.pathname === '/workspace' && isEnabled('aiCopilot') && (
              <Button variant="ghost" size="sm" className="text-info hover:text-info/80 hover:bg-info/20 transition-smooth">
                <Bot className="w-4 h-4 md:mr-1" />
                <span className="hidden md:inline">Copilot</span>
              </Button>
            )}

            {/* Task Count Badge for Ultimate Workspace */}
            {isUltimateWorkspace && (location.pathname === '/workspace' || location.pathname === '/dashboard') && myTasks.length > 0 && (
              <Badge variant="secondary" className="glass text-foreground-subtle border-border-subtle hidden sm:flex">
                {myTasks.length} task{myTasks.length !== 1 ? 's' : ''}
              </Badge>
            )}

            {/* Feature Flag Chip */}
            <div className="hidden md:block">
              <FeatureFlagChip flag="newRgsUI" />
            </div>

            {/* Workspace Toggle */}
            <Button
              variant="outline"
              size="sm"
              onClick={toggleWorkspace}
              className={`border-white/20 backdrop-blur-md transition-all duration-200 ${
                isUltimateWorkspace
                  ? 'bg-accent text-accent-foreground border-accent shadow-elegant hover:bg-accent/90'
                  : 'glass text-foreground-subtle hover:bg-glass-accent border-border-subtle'
              }`}
            >
              <Briefcase className="w-4 h-4 md:mr-2" />
              <span className="hidden md:inline">
                {isUltimateWorkspace ? 'Legacy UI' : 'Ultimate'}
              </span>
            </Button>

            {/* Role Badge */}
            <div className="hidden xl:block glass backdrop-blur-md rounded-2xl px-3 py-1.5 border border-border-subtle">
              <span className="text-xs font-medium text-foreground-subtle">Champion</span>
            </div>
            
            {/* User Profile */}
            <Button variant="ghost" size="sm" className="p-2 hover:bg-glass-accent transition-all text-foreground-subtle hover:text-foreground">
              <User className="w-4 h-4" />
            </Button>

            {/* PAGS Header Addons */}
            <HeaderAddons />

            {/* Mobile Menu Toggle */}
            <Button
              variant="ghost"
              size="sm"
              className="lg:hidden p-2"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </Button>
          </motion.div>
        </div>
      </motion.header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden fixed inset-x-0 top-16 z-40 bg-gray-900/95 backdrop-blur-xl border-b border-white/10 p-4"
        >
          <div className="space-y-3">
            {/* Mode Indicator */}
            <div className="text-center pb-3 border-b border-border/20">
              <Badge variant="outline" className="text-xs">
                {isUltimateWorkspace ? 'Ultimate Workspace Mode' : 'Legacy RGS Mode'}
              </Badge>
            </div>

            {/* Navigation Items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = (item.id === 'workspace' && (location.pathname === '/workspace' || location.pathname === '/')) ||
                (item.id !== 'workspace' && location.pathname === item.path);
              
              return (
                <NavLink
                  key={item.id}
                  to={item.path}
                  onClick={() => {
                    if (!isUltimateWorkspace) handleZoneChange(item.id as Zone);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl transition-all ${
                    isActive
                      ? 'bg-teal-500 text-white shadow-lg'
                      : 'bg-gray-800/30 text-gray-300 hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <div className="flex-1">
                    <div className="font-medium">{item.label}</div>
                    {item.description && (
                      <div className="text-xs opacity-75">{item.description}</div>
                    )}
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </NavLink>
              );
            })}

            <Separator className="my-3" />

            {/* Actions */}
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={toggleWorkspace}
            >
              <Briefcase className="w-4 h-4 mr-3" />
              Switch to {isUltimateWorkspace ? 'Legacy UI' : 'Ultimate Workspace'}
            </Button>
          </div>
        </motion.div>
      )}
    </>
  );
};