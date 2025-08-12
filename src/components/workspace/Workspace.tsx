import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../hooks/useTasks';
import { DynamicWidget } from './DynamicWidget';
import { WorkspaceProSidebar } from './WorkspaceProSidebar';
import { WorkspaceProHeader } from './WorkspaceProHeader';
import { CopilotDrawer } from '../../modules/ai/components/CopilotDrawer';
import { TeamsDrawer } from '../../modules/teams/components/TeamsDrawer';
import { GoalTreeWidget } from '../../modules/cascade/components/GoalTreeWidget';
import { OKRPanel } from '../../modules/cascade/components/OKRPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { PairWorkOverlay } from '../../modules/collab/components/PairWorkOverlay';
import { useFeatureFlags, FeatureFlagGuard } from '../layout/FeatureFlagProvider';
import { Button } from '../ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { OKR } from '../../modules/collab/data/mockData';
import CascadeSidebar from './CascadeSidebar';
import TaskClaimPopup from './TaskClaimPopup';
import EnhancedTaskClaimPopup from '../../modules/taskClaimPopup/TaskClaimPopup';
import EnhancedTaskCard from './EnhancedTaskCard';
import { taskRegistry } from '../../config/taskRegistry';
import ThinkToolsSurface from '@/components/zones/ThinkToolsSurface'
import ActToolsSurface from '@/components/zones/ActToolsSurface'
import MonitorToolsSurface from '@/components/zones/MonitorToolsSurface'




export const Workspace: React.FC = () => {
  const { 
    myTasks, 
    activeTask, 
    availableTasks, 
    completeTask, 
    isCompletingTask,
    openClaimPopup,
    confirmClaimTask,
    cancelClaimTask,
    claimingTask,
    showClaimPopup,
    isClaimingTask
  } = useTasks();
  
  // Debug state values on every render
  console.log('Workspace render - Popup state:', { 
    showClaimPopup, 
    claimingTask: claimingTask?.id, 
    isClaimingTask 
  });
  const { flags } = useFeatureFlags();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false);
  const [isGoalTreeOpen, setIsGoalTreeOpen] = useState(false);
  const [selectedOKR, setSelectedOKR] = useState<OKR | null>(null);
  const [isPairWorkOpen, setIsPairWorkOpen] = useState(false);
  const [pairWorkPartner, setPairWorkPartner] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  console.log('Workspace render - Sidebar collapsed state:', isSidebarCollapsed);

  // Debug console logs
  console.log('Dialog render state:', { isGoalTreeOpen });

  // Debug: Log the feature flags
  console.log('Workspace feature flags:', flags);
  console.log('Cascade features enabled:', {
    useCascadeBar: flags.useCascadeBar,
    useTaskClaimPopup: flags.useTaskClaimPopup,
    useTeamsButton: flags.useTeamsButton
  });

  // Guard with feature flag - temporarily disabled to ensure access
  // if (!flags.workspacePro) {
  //   return (
  //     <div className="h-screen w-full flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
  //       <div className="text-center p-8 bg-glass/70 backdrop-blur-20 rounded-2xl border border-white/10">
  //         <h2 className="text-2xl font-semibold text-white mb-4">Workspace Pro</h2>
  //         <p className="text-gray-300">This feature is currently disabled.</p>
  //       </div>
  //     </div>
  //   );
  // }

  if (!activeTask) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex">
          <FeatureFlagGuard 
            flag="useCascadeBar" 
            fallback={
              <WorkspaceProSidebar 
                myTasks={myTasks} 
                availableTasks={availableTasks}
                activeTask={null}
              />
            }
          >
            <CascadeSidebar
              myTasks={myTasks}
              availableTasks={availableTasks}
              activeTask={null}
              onTaskClaim={openClaimPopup}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => {
                console.log('Toggle collapse called, current state:', isSidebarCollapsed);
                setIsSidebarCollapsed(!isSidebarCollapsed);
              }}
            />
          </FeatureFlagGuard>
          
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
        
        {/* Goals Tree Dialog */}
        <Dialog open={isGoalTreeOpen} onOpenChange={setIsGoalTreeOpen}>
          <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto bg-gray-900/95 backdrop-blur-20 border-white/10">
            <DialogHeader>
              <DialogTitle className="text-white">Goals & OKRs Cascade</DialogTitle>
            </DialogHeader>
            <GoalTreeWidget 
              onTaskClaim={openClaimPopup}
              onOKRSelect={(okr) => setSelectedOKR(okr)}
            />
          </DialogContent>
        </Dialog>

        {/* Task Claim Popup - Enhanced or Basic (for no active task state) */}
        {flags.useEnhancedTaskPopup ? (
          <EnhancedTaskClaimPopup
            isOpen={showClaimPopup}
            task={claimingTask}
            onConfirm={confirmClaimTask}
            onCancel={cancelClaimTask}
            isLoading={isClaimingTask}
          />
        ) : (
          <TaskClaimPopup
            isOpen={showClaimPopup}
            task={claimingTask}
            onConfirm={confirmClaimTask}
            onCancel={cancelClaimTask}
            isLoading={isClaimingTask}
          />
        )}
      </div>
    );
  }

  // Get the current components from registry (this ensures we use the latest config)
  const currentComponents = taskRegistry[activeTask.type] || activeTask.components || [];
  const components = currentComponents;
  
  console.log('Workspace activeTask:', { 
    id: activeTask.id, 
    type: activeTask.type, 
    zone: activeTask.zone, 
    originalComponents: activeTask.components,
    currentComponents: components,
    registryMapping: taskRegistry[activeTask.type]
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <WorkspaceProHeader
        activeTask={activeTask}
        myTasks={myTasks}
        onCopilotToggle={() => setIsCopilotOpen(!isCopilotOpen)}
        onTeamsToggle={() => setIsTeamsOpen(!isTeamsOpen)}
        onGoalTreeToggle={() => setIsGoalTreeOpen(!isGoalTreeOpen)}
        onPairWorkStart={(partnerId) => {
          setPairWorkPartner(partnerId);
          setIsPairWorkOpen(true);
        }}
      />
      
      <div className="flex">
        <FeatureFlagGuard 
          flag="useCascadeBar" 
          fallback={
            <WorkspaceProSidebar 
              myTasks={myTasks} 
              availableTasks={availableTasks}
              activeTask={activeTask}
            />
          }
        >
          <CascadeSidebar
            myTasks={myTasks}
            availableTasks={availableTasks}
            activeTask={activeTask}
            onTaskClaim={openClaimPopup}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => {
              console.log('Toggle collapse called, current state:', isSidebarCollapsed);
              setIsSidebarCollapsed(!isSidebarCollapsed);
            }}
          />
        </FeatureFlagGuard>
        
        <main className="flex-1 p-6 overflow-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-4xl mx-auto"
          >
            {/* Enhanced Task Card */}
            <div className="mb-6">
              <FeatureFlagGuard flag="useTeamsButton">
                <EnhancedTaskCard
                  task={activeTask}
                  onComplete={completeTask}
                  isCompleting={isCompletingTask}
                  showTeamsButton={true}
                />
              </FeatureFlagGuard>
            </div>

            {/* Dynamic Widgets */}
            <div className="space-y-6">
              <AnimatePresence>
                {components.map((componentName) => (
                  <DynamicWidget
                    key={componentName}
                    widgetName={componentName}
                    task={activeTask}
                  />
                ))}
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
            </div>
          </motion.div>
        </main>
      </div>
      
      {/* Overlays & Drawers */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeTask={activeTask}
      />
      
      <TeamsDrawer
        isOpen={isTeamsOpen}
        onClose={() => setIsTeamsOpen(false)}
        taskId={activeTask?.id}
        taskTitle={activeTask?.title}
      />

      {/* Goals Tree Dialog */}
      <Dialog open={isGoalTreeOpen} onOpenChange={setIsGoalTreeOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto bg-gray-900/95 backdrop-blur-20 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Goals & OKRs Cascade</DialogTitle>
          </DialogHeader>
          <GoalTreeWidget 
            onTaskClaim={openClaimPopup}
            onOKRSelect={(okr) => setSelectedOKR(okr)}
          />
        </DialogContent>
      </Dialog>

      <OKRPanel
        isOpen={!!selectedOKR}
        onClose={() => setSelectedOKR(null)}
        okr={selectedOKR}
        onTaskClaim={(taskId) => console.log('Claim task from OKR:', taskId)}
      />

      <PairWorkOverlay
        isOpen={isPairWorkOpen}
        onClose={() => setIsPairWorkOpen(false)}
        partnerId={pairWorkPartner || undefined}
        taskTitle={activeTask?.title}
      />

        {/* Task Claim Popup - Enhanced or Basic */}
        {flags.useEnhancedTaskPopup ? (
          <EnhancedTaskClaimPopup
            isOpen={showClaimPopup}
            task={claimingTask}
            onConfirm={confirmClaimTask}
            onCancel={cancelClaimTask}
            isLoading={isClaimingTask}
          />
        ) : (
          <TaskClaimPopup
            isOpen={showClaimPopup}
            task={claimingTask}
            onConfirm={confirmClaimTask}
            onCancel={cancelClaimTask}
            isLoading={isClaimingTask}
          />
        )}

        {/* Think Zone Tools Surface */}
        <ThinkToolsSurface />
        {/* Act Zone Tools Surface */}
        <ActToolsSurface />
        {/* Monitor Zone Tools Surface */}
        <MonitorToolsSurface />
    </div>
  );
};