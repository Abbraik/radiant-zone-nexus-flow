import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bot, 
  Users, 
  Zap, 
  BarChart3, 
  Puzzle, 
  User, 
  ChevronDown 
} from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { Task } from '../../hooks/useTasks';
import { useFeatureFlags, FeatureFlagChip } from '../layout/FeatureFlagProvider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { PresenceBar } from '../../modules/collab/components/PresenceBar';

interface WorkspaceProHeaderProps {
  activeTask: Task | null;
  myTasks: Task[];
  isDashboard?: boolean;
  onCopilotToggle: () => void;
}

export const WorkspaceProHeader: React.FC<WorkspaceProHeaderProps> = ({ 
  activeTask, 
  myTasks,
  isDashboard = false,
  onCopilotToggle
}) => {
  const { flags } = useFeatureFlags();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-16 bg-glass/70 backdrop-blur-20 border-b border-white/10 px-6 flex items-center justify-between"
    >
      {/* Left: Logo + Title + Navigation */}
      <div className="flex items-center gap-4">
        <div className="text-xl font-semibold text-white">
          🏛️ Workspace Pro
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 ml-4">
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
        
        {/* Task Selector */}
        {activeTask && myTasks.length > 1 && !isDashboard && (
          <Select value={activeTask.id}>
            <SelectTrigger className="w-64 bg-white/10 border-white/20 text-white">
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
      </div>

      {/* Center: Collaboration & Status */}
      <div className="flex items-center gap-4">
        {!isDashboard && <PresenceBar taskId={activeTask?.id} />}
        
        {!isDashboard && myTasks.length > 0 && (
          <Badge variant="secondary" className="bg-white/10 text-white">
            {myTasks.length} active task{myTasks.length !== 1 ? 's' : ''}
          </Badge>
        )}
        
        {isDashboard && (
          <Badge variant="secondary" className="bg-teal-500/20 text-teal-300">
            Personal Analytics
          </Badge>
        )}
      </div>

      {/* Right: AI + Modules + User */}
      <div className="flex items-center gap-3">
        {/* AI Copilot */}
        {flags.aiCopilot && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onCopilotToggle}
            className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/20"
          >
            <Bot className="h-4 w-4 mr-2" />
            Copilot
          </Button>
        )}
        
        {/* Module Indicators */}
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
        
        <Badge variant="secondary" className="bg-blue-500/20 text-blue-300">
          Champion
        </Badge>
        
        <FeatureFlagChip flag="workspacePro" />
        
        <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
          <User className="h-4 w-4 mr-2" />
          User
        </Button>
      </div>
    </motion.header>
  );
};