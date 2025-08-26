import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { AlertCircle, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';
import type { EnhancedTask5C } from '@/5c/types';
import { TaskEngineWidgets } from './TaskEngineWidgets';

interface Workspace5CSidebarProps {
  myTasks: EnhancedTask5C[];
  availableTasks: EnhancedTask5C[];
  activeTask: EnhancedTask5C | null;
  onTaskClaim: (task: EnhancedTask5C) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const getCapacityColor = (capacity: string) => {
  switch (capacity) {
    case 'responsive': return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
    case 'reflexive': return 'bg-green-500/20 text-green-300 border-green-500/30';
    case 'deliberative': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
    case 'anticipatory': return 'bg-purple-500/20 text-purple-300 border-purple-500/30';
    case 'structural': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'open': return <AlertCircle className="h-4 w-4 text-blue-400" />;
    case 'claimed': return <Clock className="h-4 w-4 text-yellow-400" />;
    case 'active': return <CheckCircle className="h-4 w-4 text-green-400" />;
    case 'done': return <CheckCircle className="h-4 w-4 text-green-400" />;
    case 'blocked': return <XCircle className="h-4 w-4 text-red-400" />;
    default: return <AlertCircle className="h-4 w-4 text-gray-400" />;
  }
};

export const Workspace5CSidebar: React.FC<Workspace5CSidebarProps> = ({
  myTasks,
  availableTasks,
  activeTask,
  onTaskClaim,
  isCollapsed,
  onToggleCollapse
}) => {
  const [isMyTasksCollapsed, setIsMyTasksCollapsed] = useState(false);
  const [isAvailableTasksCollapsed, setIsAvailableTasksCollapsed] = useState(false);
  const TaskCard = ({ task }: { task: EnhancedTask5C }) => (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
        activeTask?.id === task.id 
          ? 'bg-primary/20 border-primary/40' 
          : 'bg-glass/30 border-white/10 hover:bg-glass/40'
      }`}
      onClick={() => onTaskClaim(task)}
    >
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          {getStatusIcon(task.status)}
          <span className="text-xs text-gray-400 uppercase tracking-wide">
            {task.type} • {task.scale}
          </span>
        </div>
        <Badge className={`text-xs ${getCapacityColor(task.capacity)}`}>
          {task.capacity}
        </Badge>
      </div>
      
      <h4 className="text-white font-medium text-sm mb-1 line-clamp-2">
        {task.title}
      </h4>
      
      {task.description && (
        <p className="text-gray-400 text-xs line-clamp-2 mb-2">
          {task.description}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-500">
            Leverage: {task.leverage}
          </span>
        </div>
        
        {task.tri && task.tri.t_value !== undefined && task.tri.r_value !== undefined && task.tri.i_value !== undefined && (
          <div className="flex items-center gap-1 text-xs">
            <span className="text-red-300">T:{task.tri.t_value.toFixed(1)}</span>
            <span className="text-blue-300">R:{task.tri.r_value.toFixed(1)}</span>
            <span className="text-green-300">I:{task.tri.i_value.toFixed(1)}</span>
          </div>
        )}
      </div>
    </motion.div>
  );

  return (
    <motion.div
      initial={{ width: 320 }}
      animate={{ width: isCollapsed ? 0 : 320 }}
      className="h-full bg-glass/40 backdrop-blur-20 border-r border-white/10 overflow-hidden flex flex-col"
    >
      <div className="p-4 border-b border-white/10">
        <div className="flex items-center justify-between">
          <h2 className="text-white font-semibold text-sm">5C Workspace</h2>
          <Button
            variant="ghost"
            size="sm"
            onClick={onToggleCollapse}
            className="p-1 h-auto text-gray-400 hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* My Tasks */}
        {myTasks.length > 0 && (
          <Collapsible open={!isMyTasksCollapsed} onOpenChange={(open) => setIsMyTasksCollapsed(!open)}>
            <CollapsibleTrigger asChild>
              <Button
                variant="ghost"
                className="flex items-center justify-between w-full mb-3 p-0 h-auto hover:bg-transparent"
              >
                <div className="flex items-center gap-2">
                  <h3 className="text-gray-300 font-medium text-sm">My Tasks</h3>
                  <Badge variant="secondary" className="text-xs">
                    {myTasks.length}
                  </Badge>
                </div>
                {isMyTasksCollapsed ? (
                  <ChevronDown className="h-4 w-4 text-gray-400" />
                ) : (
                  <ChevronUp className="h-4 w-4 text-gray-400" />
                )}
              </Button>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <motion.div
                initial={false}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-2"
              >
                {myTasks.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </motion.div>
            </CollapsibleContent>
          </Collapsible>
        )}

        {/* Available Tasks */}
        <Collapsible open={!isAvailableTasksCollapsed} onOpenChange={(open) => setIsAvailableTasksCollapsed(!open)}>
          <CollapsibleTrigger asChild>
            <Button
              variant="ghost"
              className="flex items-center justify-between w-full mb-3 p-0 h-auto hover:bg-transparent"
            >
              <div className="flex items-center gap-2">
                <h3 className="text-gray-300 font-medium text-sm">Available Tasks</h3>
                <Badge variant="secondary" className="text-xs">
                  {availableTasks.length}
                </Badge>
              </div>
              {isAvailableTasksCollapsed ? (
                <ChevronDown className="h-4 w-4 text-gray-400" />
              ) : (
                <ChevronUp className="h-4 w-4 text-gray-400" />
              )}
            </Button>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <motion.div
              initial={false}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-2"
            >
              {availableTasks.map((task) => (
                <TaskCard key={task.id} task={task} />
              ))}
            </motion.div>
          </CollapsibleContent>
        </Collapsible>

        {availableTasks.length === 0 && myTasks.length === 0 && (
          <div className="text-center py-8">
            <AlertCircle className="h-8 w-8 text-gray-500 mx-auto mb-2" />
            <p className="text-gray-500 text-sm">No capacity tasks available</p>
          </div>
        )}

        {/* TaskEngine V2 Widgets - Integrated within sidebar */}
        <div className="mt-6 px-2">
          <TaskEngineWidgets 
            activeTask5C={activeTask}
            isCollapsed={false}
          />
        </div>
      </div>
    </motion.div>
  );
};