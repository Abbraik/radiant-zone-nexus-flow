import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  ListTodo, 
  Bell,
  Puzzle,
  Calendar,
  Zap
} from 'lucide-react';
import { Task, useTasks } from '../../hooks/useTasks';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { AutomationPanel } from '../../modules/automation/components/AutomationPanel';
import { QueryPanel } from '../../modules/analytics/components/QueryPanel';
import { format } from 'date-fns';

interface WorkspaceProSidebarProps {
  myTasks: Task[];
  availableTasks: Task[];
  activeTask: Task | null;
}

export const WorkspaceProSidebar: React.FC<WorkspaceProSidebarProps> = ({ 
  myTasks, 
  availableTasks,
  activeTask 
}) => {
  const [isExpanded, setIsExpanded] = useState(true);
  const { claimTask, isClaimingTask } = useTasks();

  const sidebarVariants = {
    collapsed: { width: '72px' },
    expanded: { width: '400px' }
  };

  const contentVariants = {
    collapsed: { opacity: 0, x: -20 },
    expanded: { opacity: 1, x: 0 }
  };

  const notifications = [
    { id: '1', type: 'reminder', message: 'TRI review due in 2 hours', time: '2h' },
    { id: '2', type: 'alert', message: 'Critical task escalated', time: '30m' },
    { id: '3', type: 'info', message: 'New bundle published', time: '1h' }
  ];

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsExpanded(false)}
            className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        variants={sidebarVariants}
        animate={isExpanded ? 'expanded' : 'collapsed'}
        transition={{ type: 'spring', bounce: 0.1, duration: 0.4 }}
        className="bg-glass/70 backdrop-blur-20 border-r border-white/10 flex flex-col relative z-50"
      >
        {/* Toggle Button */}
        <div className="p-4 border-b border-white/10">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="w-full justify-center text-white hover:bg-white/10"
          >
            {isExpanded ? (
              <ChevronLeft className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Collapsed State - Icons Only */}
        {!isExpanded && (
          <div className="flex flex-col items-center py-4 space-y-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(true)}
              className="text-white hover:bg-white/10 relative"
            >
              <ListTodo className="h-5 w-5" />
              {myTasks.length > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-teal-500">
                  {myTasks.length}
                </Badge>
              )}
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10 relative"
            >
              <Bell className="h-5 w-5" />
              <Badge className="absolute -top-1 -right-1 h-5 w-5 p-0 text-xs bg-red-500">
                {notifications.length}
              </Badge>
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/10"
            >
              <Zap className="h-5 w-5" />
            </Button>
          </div>
        )}

        {/* Expanded State - Full Content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
              transition={{ delay: 0.1, duration: 0.2 }}
              className="flex-1 overflow-hidden flex flex-col"
            >
              <Tabs defaultValue="tasks" className="flex-1 flex flex-col">
                <TabsList className="grid w-full grid-cols-3 bg-white/10 mx-4 mt-4">
                  <TabsTrigger value="tasks" className="text-xs">
                    <ListTodo className="h-3 w-3 mr-1" />
                    Tasks
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="text-xs">
                    <Bell className="h-3 w-3 mr-1" />
                    Alerts
                  </TabsTrigger>
                  <TabsTrigger value="modules" className="text-xs">
                    <Puzzle className="h-3 w-3 mr-1" />
                    Tools
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="tasks" className="flex-1 p-4 space-y-4 overflow-y-auto">
                  {/* My Tasks */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-medium text-white">My Workspace</h3>
                      <Badge variant="secondary" className="bg-teal-500/20 text-teal-300 text-xs">
                        {myTasks.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {myTasks.map((task) => (
                        <motion.div
                          key={task.id}
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          className={`p-3 rounded-lg border transition-colors cursor-pointer ${
                            activeTask?.id === task.id
                              ? 'bg-teal-500/20 border-teal-500/50'
                              : 'bg-white/5 border-white/10 hover:bg-white/10'
                          }`}
                        >
                          <p className="text-sm font-medium text-white truncate">
                            {task.title}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Badge variant="secondary" className="bg-white/10 text-xs">
                              {task.zone}
                            </Badge>
                          </div>
                          {task.due_at && (
                            <div className="flex items-center gap-1 mt-2 text-xs text-gray-400">
                              <Calendar className="h-3 w-3" />
                              Due {format(task.due_at, 'MMM d')}
                            </div>
                          )}
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Available Tasks */}
                  <div>
                    <div className="flex items-center gap-2 mb-3">
                      <h3 className="text-sm font-medium text-white">Available</h3>
                      <Badge variant="secondary" className="bg-white/10 text-xs">
                        {availableTasks.length}
                      </Badge>
                    </div>
                    
                    <div className="space-y-2">
                      {availableTasks.slice(0, 3).map((task) => (
                        <motion.div
                          key={task.id}
                          className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-medium text-white truncate">
                                {task.title}
                              </p>
                              <Badge variant="secondary" className="bg-white/10 text-xs mt-1">
                                {task.zone}
                              </Badge>
                            </div>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => claimTask(task.id)}
                              disabled={isClaimingTask}
                              className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/20 px-2"
                            >
                              Claim
                            </Button>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="notifications" className="flex-1 p-4 overflow-y-auto">
                  <div className="space-y-3">
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`p-3 rounded-lg border ${
                          notification.type === 'alert' 
                            ? 'bg-red-500/10 border-red-500/30'
                            : notification.type === 'reminder'
                            ? 'bg-yellow-500/10 border-yellow-500/30'
                            : 'bg-blue-500/10 border-blue-500/30'
                        }`}
                      >
                        <p className="text-sm text-white">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time} ago</p>
                      </motion.div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="modules" className="flex-1 p-4 space-y-4 overflow-y-auto">
                  <AutomationPanel />
                  <QueryPanel />
                </TabsContent>
              </Tabs>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
};