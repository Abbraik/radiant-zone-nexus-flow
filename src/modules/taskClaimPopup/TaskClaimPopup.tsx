import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Clock, 
  Tag, 
  AlertCircle, 
  Flag, 
  Timer, 
  ChevronRight,
  MessageSquare,
  Users,
  Sparkles,
  Calendar,
  Moon,
  UserPlus
} from 'lucide-react';
import { Task } from '../../hooks/useTasks';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '../../components/ui/avatar';
import { Progress } from '../../components/ui/progress';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../components/ui/tooltip';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '../../components/ui/dropdown-menu';
import { cn } from '../../lib/utils';
import { useTaskPopupLogic } from './useTaskPopupLogic';

interface TaskClaimPopupProps {
  isOpen: boolean;
  task: Task | null;
  onConfirm: () => void;
  onCancel: () => void;
  isLoading?: boolean;
}

const TaskClaimPopup: React.FC<TaskClaimPopupProps> = ({
  isOpen,
  task,
  onConfirm,
  onCancel,
  isLoading = false
}) => {
  const [comment, setComment] = useState('');
  const {
    goalProgress,
    okrProgress,
    recentActivity,
    timeUntilDue,
    dueStatus,
    estimatedEffort,
    dependencies,
    nextSteps,
    handleSnooze,
    handleDelegate,
    handleOpenTeams,
    handleAISuggest
  } = useTaskPopupLogic(task);

  if (!isOpen || !task) return null;

  const getDueDateColor = () => {
    switch (dueStatus) {
      case 'critical': return 'text-red-400';
      case 'warning': return 'text-orange-400';
      case 'good': return 'text-teal-400';
      default: return 'text-gray-400';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-400/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-400/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-400/30';
      default: return 'text-gray-400 bg-gray-500/20 border-gray-400/30';
    }
  };

  const getZoneColor = (zone: string) => {
    const zoneColors: Record<string, string> = {
      'think': 'bg-purple-500/20 text-purple-300 border-purple-400/30',
      'act': 'bg-blue-500/20 text-blue-300 border-blue-400/30',
      'monitor': 'bg-orange-500/20 text-orange-300 border-orange-400/30',
      'innovate-learn': 'bg-green-500/20 text-green-300 border-green-400/30'
    };
    return zoneColors[zone] || 'bg-gray-500/20 text-gray-300 border-gray-400/30';
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onCancel}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="w-[480px] max-h-[80vh] bg-glass/90 backdrop-blur-20 rounded-3xl shadow-2xl border border-white/10 overflow-hidden">
              
              {/* Header */}
              <div className="p-6 border-b border-white/10">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-semibold text-white">Task Mission Control</h2>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onCancel}
                    className="text-gray-400 hover:text-white h-8 w-8 p-0"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="max-h-[calc(80vh-120px)] overflow-y-auto">
                {/* Context Snapshot */}
                <div className="p-6 space-y-4">
                  <div className="text-sm font-medium text-gray-300 mb-3">Context Snapshot</div>
                  
                  {/* Goal & OKR Chain */}
                  <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/goal-avatar.png" />
                      <AvatarFallback className="bg-purple-500 text-white text-xs">🎯</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-white truncate">Stabilize Fertility Rate</div>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1">
                          <Progress value={goalProgress} className="h-1.5" />
                        </div>
                        <span className="text-xs text-gray-400">{goalProgress}%</span>
                      </div>
                    </div>
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                    <div className="flex items-center gap-2">
                      <Badge className="bg-blue-500/20 text-blue-300 border-blue-400/30 text-xs">
                        Loop {task.loop_id || 'A'}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <div className="w-12">
                          <Progress value={okrProgress} className="h-1.5" />
                        </div>
                        <span className="text-xs text-gray-400">{okrProgress}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Activity */}
                  <div className="space-y-2">
                    <div className="text-xs font-medium text-gray-400 mb-2">Recent Activity</div>
                    {recentActivity.map((activity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                        <span className="text-lg">{activity.icon}</span>
                        <span className="flex-1">{activity.text}</span>
                        <span className="text-xs text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>

                  {/* Quick Links */}
                  <div className="flex gap-2 flex-wrap">
                    <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 h-7">
                      📊 CLD Diagram
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 h-7">
                      📋 Policy Spec
                    </Button>
                    <Button variant="ghost" size="sm" className="text-xs text-blue-400 hover:text-blue-300 h-7">
                      🚀 Sprint Report
                    </Button>
                  </div>
                </div>

                {/* Task Details */}
                <div className="px-6 pb-4 space-y-4">
                  <div className="border-t border-white/10 pt-4">
                    <h3 className="text-lg font-medium text-white mb-2">{task.title}</h3>
                    <p className="text-base text-gray-300 leading-relaxed mb-4">{task.description}</p>

                    {/* Meta Information */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {/* Zone Badge */}
                      <Badge className={cn('border text-xs', getZoneColor(task.zone))}>
                        <Tag className="h-3 w-3 mr-1" />
                        {task.zone}
                      </Badge>

                      {/* Priority Badge */}
                      <Badge className="bg-orange-500/20 text-orange-300 border-orange-400/30 border text-xs">
                        <Flag className="h-3 w-3 mr-1" />
                        high priority
                      </Badge>

                      {/* Effort Badge */}
                      <Badge className="bg-white/10 text-gray-300 border-white/20 text-xs">
                        <Timer className="h-3 w-3 mr-1" />
                        ~{estimatedEffort}
                      </Badge>
                    </div>

                    {/* Due Date with Live Timer */}
                    <div className="flex items-center gap-2 text-sm mb-4">
                      <Clock className={cn('h-4 w-4', getDueDateColor())} />
                      <span className={getDueDateColor()}>
                        {timeUntilDue}
                      </span>
                    </div>

                    {/* Dependencies */}
                    {dependencies.length > 0 && (
                      <div className="space-y-2 mb-4">
                        <div className="text-sm font-medium text-gray-400">Dependencies</div>
                        {dependencies.map((dep, index) => (
                          <div key={index} className="flex items-center gap-2 text-sm">
                            <div className={cn(
                              'w-2 h-2 rounded-full',
                              dep.status === 'completed' ? 'bg-green-400' : 
                              dep.status === 'in-progress' ? 'bg-yellow-400' : 'bg-gray-400'
                            )} />
                            <span className="text-gray-300">{dep.title}</span>
                            <Badge className="text-xs bg-white/10 text-gray-400">
                              {dep.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Urgency Warning */}
                    {dueStatus === 'critical' && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-400/30 rounded-lg mb-4"
                      >
                        <AlertCircle className="h-4 w-4 text-red-400" />
                        <span className="text-sm text-red-300">
                          Critical priority - immediate attention required
                        </span>
                      </motion.div>
                    )}

                    {/* Inline Comment */}
                    <div className="space-y-2 mb-4">
                      <label className="text-sm font-medium text-gray-400">Quick Note</label>
                      <div className="flex gap-2">
                        <Input
                          value={comment}
                          onChange={(e) => setComment(e.target.value)}
                          placeholder="Add a quick note..."
                          className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                        />
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                          📝
                        </Button>
                      </div>
                    </div>

                    {/* Next Steps Checklist */}
                    <div className="space-y-2 mb-6">
                      <div className="text-sm font-medium text-gray-400">Success Criteria</div>
                      {nextSteps.map((step, index) => (
                        <div key={index} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className={cn(
                            'w-4 h-4 rounded border border-gray-500 flex items-center justify-center',
                            step.completed ? 'bg-teal-500 border-teal-500' : 'bg-transparent'
                          )}>
                            {step.completed && <span className="text-white text-xs">✓</span>}
                          </div>
                          <span className={step.completed ? 'line-through text-gray-500' : ''}>
                            {step.text}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-6 border-t border-white/10 space-y-4">
                {/* Primary Actions */}
                <div className="flex items-center justify-end gap-3">
                  <Button
                    variant="ghost"
                    onClick={onCancel}
                    className="text-teal-300 hover:text-white hover:bg-teal-500/20"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={onConfirm}
                    disabled={isLoading}
                    className="bg-teal-500 hover:bg-teal-600 text-white font-medium px-6 py-2 rounded-full"
                  >
                    {isLoading ? 'Claiming...' : 'Claim & Go to Workspace'}
                  </Button>
                </div>

                {/* Secondary Controls */}
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-3">
                    {/* Snooze Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-8">
                          <Moon className="h-3 w-3 mr-1" />
                          Snooze ▼
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem onClick={() => handleSnooze('5m')}>5 minutes</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSnooze('15m')}>15 minutes</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSnooze('1h')}>1 hour</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleSnooze('1d')}>1 day</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Delegate Dropdown */}
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white h-8">
                          <UserPlus className="h-3 w-3 mr-1" />
                          Delegate ▼
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent className="bg-gray-800 border-gray-700">
                        <DropdownMenuItem onClick={() => handleDelegate('user-1')}>
                          <Avatar className="h-4 w-4 mr-2">
                            <AvatarFallback className="bg-blue-500 text-white text-xs">AC</AvatarFallback>
                          </Avatar>
                          Alex Chen
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelegate('user-2')}>
                          <Avatar className="h-4 w-4 mr-2">
                            <AvatarFallback className="bg-purple-500 text-white text-xs">SK</AvatarFallback>
                          </Avatar>
                          Sarah Kim
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>

                  <div className="flex items-center gap-3">
                    {/* Teams Chat */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleOpenTeams(task.id, task.title)}
                      className="bg-white/10 text-white rounded-full py-1 px-4 flex items-center hover:bg-white/20"
                    >
                      <MessageSquare className="h-3 w-3 mr-2" />
                      Teams
                    </Button>

                    {/* AI Suggest */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleAISuggest}
                      className="text-teal-300 hover:text-white"
                    >
                      <Sparkles className="h-3 w-3 mr-1" />
                      AI Suggest
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default TaskClaimPopup;