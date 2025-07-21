import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  ChevronLeft, 
  ListTodo, 
  Plus, 
  Clock,
  CheckCircle,
  Calendar
} from 'lucide-react';
import { Task, useTasks } from '../../hooks/useTasks';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { format } from 'date-fns';

interface WorkspaceSidebarProps {
  myTasks: Task[];
  availableTasks: Task[];
  activeTask: Task | null;
}

export const WorkspaceSidebar: React.FC<WorkspaceSidebarProps> = ({ 
  myTasks, 
  availableTasks,
  activeTask 
}) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { claimTask, isClaimingTask } = useTasks();

  const sidebarVariants = {
    collapsed: { width: '72px' },
    expanded: { width: '320px' }
  };

  const contentVariants = {
    collapsed: { opacity: 0, x: -20 },
    expanded: { opacity: 1, x: 0 }
  };

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

        {/* Collapsed State - Icon Only */}
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
              {/* My Tasks Section */}
              <div className="p-4 border-b border-white/10">
                <div className="flex items-center gap-2 mb-3">
                  <ListTodo className="h-4 w-4 text-teal-400" />
                  <h3 className="text-sm font-medium text-white">My Workspace</h3>
                  <Badge variant="secondary" className="bg-teal-500/20 text-teal-300 text-xs">
                    {myTasks.length}
                  </Badge>
                </div>
                
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {myTasks.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      No active tasks
                    </p>
                  ) : (
                    myTasks.map((task) => (
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
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
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
                                {format(task.due_at, 'MMM d')}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>

              {/* Available Tasks Section */}
              <div className="flex-1 p-4 overflow-hidden">
                <div className="flex items-center gap-2 mb-3">
                  <Plus className="h-4 w-4 text-gray-400" />
                  <h3 className="text-sm font-medium text-white">Available Tasks</h3>
                  <Badge variant="secondary" className="bg-white/10 text-xs">
                    {availableTasks.length}
                  </Badge>
                </div>
                
                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {availableTasks.length === 0 ? (
                    <p className="text-xs text-gray-400 text-center py-4">
                      No tasks available
                    </p>
                  ) : (
                    availableTasks.map((task) => (
                      <motion.div
                        key={task.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
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
                                <Clock className="h-3 w-3" />
                                {format(task.due_at, 'MMM d')}
                              </div>
                            )}
                          </div>
                          
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => claimTask(task.id)}
                            disabled={isClaimingTask}
                            className="text-teal-400 hover:text-teal-300 hover:bg-teal-500/20 px-2"
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </motion.div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.aside>
    </>
  );
};