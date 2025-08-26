// TaskEngine V2 Widgets for 5C Workspace Integration
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clock, 
  Users, 
  FileText, 
  ChevronDown, 
  ChevronUp,
  BarChart3,
  Settings,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { TaskTimeline } from '@/components/taskEngine/TaskTimeline';
import { TaskAssignmentPanel } from '@/components/taskEngine/TaskAssignmentPanel';
import { TaskSummaryCard } from '@/components/taskEngine/TaskSummaryCard';
import { useTaskEngine } from '@/hooks/useTaskEngine';
import type { EnhancedTask5C } from '@/5c/types';

interface TaskEngineWidgetsProps {
  activeTask5C?: EnhancedTask5C | null;
  isCollapsed?: boolean;
}

export const TaskEngineWidgets: React.FC<TaskEngineWidgetsProps> = ({ 
  activeTask5C,
  isCollapsed = false 
}) => {
  const [expandedWidget, setExpandedWidget] = useState<string | null>(null);
  const { summary, tasks, activeTasks } = useTaskEngine();

  const toggleWidget = (widgetId: string) => {
    setExpandedWidget(expandedWidget === widgetId ? null : widgetId);
  };

  // Don't show if sidebar is collapsed
  if (isCollapsed) return null;

  return (
    <div className="space-y-4">
      {/* Task Engine Summary */}
      <div className="grid grid-cols-2 gap-3">
        <TaskSummaryCard
          title="Total Tasks"
          value={summary?.total_tasks || 0}
          icon={<FileText className="h-4 w-4 text-muted-foreground" />}
        />
        <TaskSummaryCard
          title="Active"
          value={activeTasks.length}
          icon={<Clock className="h-4 w-4 text-blue-500" />}
        />
      </div>

      {/* Active Task Widgets */}
      {activeTask5C && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-white/80 border-b border-white/10 pb-2">
            Task Engine Features
          </h4>
          
          {/* Timeline Widget */}
          <Card className="bg-glass/30 backdrop-blur-20 border-white/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Clock className="h-4 w-4" />
                  Timeline
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleWidget('timeline')}
                  className="h-6 w-6 p-0 text-white/60 hover:text-white"
                >
                  {expandedWidget === 'timeline' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <AnimatePresence>
              {expandedWidget === 'timeline' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0">
                    <TaskTimeline taskId={activeTask5C.id} />
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Assignments Widget */}
          <Card className="bg-glass/30 backdrop-blur-20 border-white/10">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2 text-white">
                  <Users className="h-4 w-4" />
                  Assignments
                </CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toggleWidget('assignments')}
                  className="h-6 w-6 p-0 text-white/60 hover:text-white"
                >
                  {expandedWidget === 'assignments' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </Button>
              </div>
            </CardHeader>
            <AnimatePresence>
              {expandedWidget === 'assignments' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <CardContent className="pt-0">
                    <TaskAssignmentPanel taskId={activeTask5C.id} />
                  </CardContent>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>

          {/* Task Status & Controls */}
          <Card className="bg-glass/30 backdrop-blur-20 border-white/10">
            <CardContent className="pt-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Status</span>
                  <Badge variant="outline" className="capitalize text-white border-white/20">
                    {activeTask5C.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white/80">Capacity</span>
                  <Badge variant="outline" className="capitalize text-teal-300 border-teal-400/30">
                    {activeTask5C.capacity}
                  </Badge>
                </div>

                {activeTask5C.tri && activeTask5C.tri.t_value !== undefined && (
                  <div className="space-y-2">
                    <span className="text-sm text-white/80">TRI Values</span>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="bg-white/5 rounded p-2">
                        <div className="text-white/60">T</div>
                        <div className="font-mono text-white">{(activeTask5C.tri.t_value || 0).toFixed(2)}</div>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <div className="text-white/60">R</div>
                        <div className="font-mono text-white">{(activeTask5C.tri.r_value || 0).toFixed(2)}</div>
                      </div>
                      <div className="bg-white/5 rounded p-2">
                        <div className="text-white/60">I</div>
                        <div className="font-mono text-white">{(activeTask5C.tri.i_value || 0).toFixed(2)}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Analytics Widget */}
      <Card className="bg-glass/30 backdrop-blur-20 border-white/10">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm flex items-center gap-2 text-white">
              <BarChart3 className="h-4 w-4" />
              Analytics
            </CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => toggleWidget('analytics')}
              className="h-6 w-6 p-0 text-white/60 hover:text-white"
            >
              {expandedWidget === 'analytics' ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </Button>
          </div>
        </CardHeader>
        <AnimatePresence>
          {expandedWidget === 'analytics' && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <CardContent className="pt-0">
                <div className="space-y-3">
                  {summary && (
                    <>
                      <div className="grid grid-cols-2 gap-3 text-xs">
                        <div>
                          <span className="text-white/60">Completed</span>
                          <div className="font-semibold text-green-400">{summary.by_status.completed}</div>
                        </div>
                        <div>
                          <span className="text-white/60">In Progress</span>
                          <div className="font-semibold text-blue-400">{summary.by_status.active}</div>
                        </div>
                      </div>
                      
                      {summary.overdue_count > 0 && (
                        <div className="flex items-center gap-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                          <AlertTriangle className="h-4 w-4 text-red-400" />
                          <span className="text-xs text-red-300">{summary.overdue_count} overdue</span>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </CardContent>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};