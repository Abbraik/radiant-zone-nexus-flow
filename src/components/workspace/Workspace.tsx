import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../hooks/useTasks';
import { DynamicWidget } from './DynamicWidget';
import { WorkspaceSidebar } from './WorkspaceSidebar';
import { WorkspaceHeader } from './WorkspaceHeader';
import { Button } from '../ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';

export const Workspace: React.FC = () => {
  const { myTasks, activeTask, availableTasks, completeTask, isCompletingTask } = useTasks();

  if (!activeTask) {
    return (
      <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <WorkspaceHeader activeTask={null} myTasks={myTasks} />
        
        <div className="flex flex-1">
          <WorkspaceSidebar 
            myTasks={myTasks} 
            availableTasks={availableTasks}
            activeTask={null}
          />
          
          <main className="flex-1 p-6 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto"
            >
              <div className="text-center py-20">
                <div className="p-6 bg-glass/70 backdrop-blur-20 rounded-2xl shadow-2xl border border-white/10">
                  <AlertCircle className="h-16 w-16 text-teal-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-white mb-2">No Active Task</h2>
                  <p className="text-gray-300 mb-6">
                    Claim a task from the sidebar to get started with your workspace
                  </p>
                  <div className="text-sm text-gray-400">
                    {availableTasks.length} tasks available
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
      </div>
    );
  }

  const components = activeTask.components || [];

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <WorkspaceHeader activeTask={activeTask} myTasks={myTasks} />
      
      <div className="flex flex-1">
        <WorkspaceSidebar 
          myTasks={myTasks} 
          availableTasks={availableTasks}
          activeTask={activeTask}
        />
        
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Task Header */}
            <div className="mb-6 p-6 bg-glass/70 backdrop-blur-20 rounded-2xl shadow-2xl border border-white/10">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm text-teal-300 font-medium">Working on:</span>
                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                  </div>
                  <h1 className="text-2xl font-semibold text-white mb-2">
                    {activeTask.title}
                  </h1>
                  <p className="text-gray-300 text-base">
                    {activeTask.description}
                  </p>
                  <div className="flex items-center gap-2 mt-3">
                    <span className="text-xs bg-teal-500/20 text-teal-300 px-2 py-1 rounded-full">
                      {activeTask.zone}
                    </span>
                    <span className="text-xs bg-white/10 text-gray-300 px-2 py-1 rounded-full">
                      {activeTask.type}
                    </span>
                    {activeTask.loop_id && (
                      <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">
                        {activeTask.type.includes('simulation') ? `Scenario ${activeTask.loop_id}` : `Loop ${activeTask.loop_id}`}
                      </span>
                    )}
                  </div>
                </div>
                
                <Button
                  onClick={() => completeTask(activeTask.id)}
                  disabled={isCompletingTask}
                  className={`${
                    activeTask.type === 'publish_bundle' 
                      ? 'bg-primary hover:bg-primary-hover text-white font-medium' 
                      : 'bg-teal-500 hover:bg-teal-600 text-white'
                  }`}
                >
                  <CheckCircle className="h-4 w-4 mr-2" />
                  {isCompletingTask ? 'Completing...' : 
                   activeTask.type === 'publish_bundle' ? 'Publish Bundle' : 'Complete Task'}
                </Button>
              </div>
            </div>

            {/* Dynamic Widgets */}
            <AnimatePresence mode="wait">
              <div className="space-y-6">
                {components.map((componentName) => (
                  <DynamicWidget
                    key={componentName}
                    widgetName={componentName}
                    task={activeTask}
                  />
                ))}
              </div>
            </AnimatePresence>

            {components.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="p-6 bg-glass/50 backdrop-blur-20 rounded-2xl border border-white/10">
                  <p className="text-gray-400">No widgets configured for this task type.</p>
                </div>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </div>
  );
};