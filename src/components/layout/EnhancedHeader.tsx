import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
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
  Activity,
  Video
} from 'lucide-react';
import { useUIStore } from '../../stores/ui-store';
import { FeatureFlagChip, useFeatureFlags } from './FeatureFlagProvider';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useTasks } from '../../hooks/useTasks';
import { EnhancedPresenceBar } from '../../modules/collab/components/EnhancedPresenceBar';
import type { Zone } from '../../types';

interface UnifiedHeaderProps {
  onCopilotToggle?: () => void;
  onTeamsToggle?: () => void;
  onGoalTreeToggle?: () => void;
  onPairWorkStart?: (partnerId: string) => void;
  isDashboard?: boolean;
}

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
  { 
    id: 'mission-control', 
    label: 'Mission Control', 
    icon: Activity, 
    path: '/mission-control', 
    description: 'Real-time system overview'
  },
  { 
    id: 'registry', 
    label: 'Registry', 
    icon: BarChart3, 
    path: '/registry', 
    description: 'Loop registry and system catalog'
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

export const EnhancedHeader: React.FC<UnifiedHeaderProps> = ({ 
  onCopilotToggle,
  onTeamsToggle, 
  onGoalTreeToggle,
  onPairWorkStart,
  isDashboard = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentZone, setCurrentZone } = useUIStore();
  const { flags, updateFlag, isEnabled } = useFeatureFlags();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { myTasks, activeTask } = useTasks();

  const isUltimateWorkspace = isEnabled('newTaskDrivenUI');
  const isWorkspaceRoute = location.pathname === '/workspace' || location.pathname.startsWith('/workspace');

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

            {/* Enhanced Task Selector for Workspace */}
            {isWorkspaceRoute && activeTask && myTasks.length > 1 && !isDashboard && (
              <Select value={activeTask.id}>
                <SelectTrigger className="w-48 md:w-64 bg-white/10 border-white/20 text-white backdrop-blur-md">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-white/20">
                  {myTasks.map((task) => (
                    <SelectItem key={task.id} value={task.id} className="text-white hover:bg-white/10">
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="bg-teal-500/20 text-teal-300 text-xs">
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
            {/* Workspace Collaboration & Status - Center */}
            {isWorkspaceRoute && !isDashboard && (
              <div className="flex items-center gap-4 px-4">
                <EnhancedPresenceBar 
                  taskId={activeTask?.id} 
                  onPairWorkStart={onPairWorkStart}
                />
                
                {myTasks.length > 0 && (
                  <Badge variant="secondary" className="bg-white/10 text-white">
                    {myTasks.length} active task{myTasks.length !== 1 ? 's' : ''}
                  </Badge>
                )}
              </div>
            )}

            {isDashboard && (
              <Badge variant="secondary" className="bg-teal-500/20 text-teal-300 mx-4">
                Personal Analytics
              </Badge>
            )}
            {!isWorkspaceRoute && visibleNavigation.map((item) => {
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

            {/* Workspace Navigation Tabs */}
            {isWorkspaceRoute && (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/workspace"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                      isActive && !isDashboard
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  Workspace
                </NavLink>
                <NavLink
                  to="/dashboard"
                  className={({ isActive }) =>
                    `px-3 py-1.5 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${
                      isActive || isDashboard
                        ? 'bg-teal-500/20 text-teal-300 border border-teal-500/30'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`
                  }
                >
                  <BarChart3 className="h-4 w-4" />
                  Dashboard
                </NavLink>
              </div>
            )}
          </motion.nav>

          {/* Right Side Actions */}
          <motion.div 
            className="flex items-center gap-2 flex-shrink-0"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Enhanced Collaboration Tools */}
            {isWorkspaceRoute && flags.realTimeCollab && onTeamsToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onTeamsToggle}
                className="text-blue-400 hover:text-blue-300 hover:bg-blue-500/20"
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Teams</span>
              </Button>
            )}

            {isWorkspaceRoute && onGoalTreeToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onGoalTreeToggle}
                className="text-green-400 hover:text-green-300 hover:bg-green-500/20"
              >
                <Target className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Goals</span>
              </Button>
            )}

            {isWorkspaceRoute && flags.aiCopilot && onCopilotToggle && (
              <Button
                variant="ghost"
                size="sm"
                onClick={onCopilotToggle}
                className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/20"
              >
                <Bot className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">Copilot</span>
              </Button>
            )}
            
            {/* Module Indicators */}
            {isWorkspaceRoute && (
              <div className="flex items-center gap-1">
                {flags.realTimeCollab && (
                  <div className="w-2 h-2 bg-green-500 rounded-full" title="Collaboration Active" />
                )}
                {flags.automation && (
                  <div className="w-2 h-2 bg-yellow-500 rounded-full" title="Automation Active" />
                )}
                {flags.advancedAnalytics && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full" title="Analytics Active" />
                )}
              </div>
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

            {/* Enhanced Role Badge */}
            <Badge variant="secondary" className={isWorkspaceRoute ? "bg-blue-500/20 text-blue-300" : "glass text-foreground-subtle border-border-subtle"}>
              Champion
            </Badge>
            
            {/* User Profile */}
            <Button 
              variant="ghost" 
              size="sm" 
              className="p-2 hover:bg-glass-accent transition-all text-foreground-subtle hover:text-foreground"
              onClick={() => navigate('/profile')}
            >
              <User className="w-4 h-4" />
            </Button>

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
            {visibleNavigation.map((item) => {
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