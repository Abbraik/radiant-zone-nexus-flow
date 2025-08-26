import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertRail } from '@/components/alerts/AlertRail';
import { useTaskEngine } from '../../hooks/useTaskEngine';
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
import { Badge } from '../ui/badge';
import { OKR } from '../../modules/collab/data/mockData';
import CascadeSidebar from './CascadeSidebar';
import TaskClaimPopup from './TaskClaimPopup';
import EnhancedTaskClaimPopup from '../../modules/taskClaimPopup/TaskClaimPopup';
import EnhancedTaskCard from './EnhancedTaskCard';
import { taskRegistry } from '../../config/taskRegistry';
import { DynamicZoneBundleLoader } from './DynamicZoneBundleLoader';
import { ZoneBundleTest } from './ZoneBundleTest';
import { ZoneAwareSystemStatus } from './ZoneAwareSystemStatus';
import type { Zone, TaskType } from '../../types/zone-bundles';

export const Workspace: React.FC = () => {
  const { 
    tasks,
    selectedTask,
    setSelectedTask,
    activeTasks,
    myTasks,
    overdueTasks,
    createTask,
    updateTaskStatus,
    completeTask,
    assignTask,
    acquireLock,
    isCreating,
    isUpdating
  } = useTaskEngine();
  
  // Get the currently active task (first active task or selected task)
  const activeTask = selectedTask || activeTasks[0] || null;
  const availableTasks = tasks.filter(t => t.status === 'draft' || t.status === 'active');
  
  // Handle task claiming
  const handleTaskClaim = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      updateTaskStatus(taskId, 'active');
    }
  };
  
  // Mock old interface for compatibility
  const showClaimPopup = false;
  const claimingTask = null;
  const isClaimingTask = false;
  const isCompletingTask = isUpdating;
  
  // Convert TaskV2 to legacy Task format for compatibility
  const convertToLegacyTask = (taskV2: any): any => ({
    ...taskV2,
    zone: taskV2.context?.zone || 'think',
    type: taskV2.context?.type || 'default',
    components: taskV2.context?.components || []
  });
  
  // Convert tasks to legacy format
  const legacyTasks = tasks.map(convertToLegacyTask);
  const legacyMyTasks = myTasks.map(convertToLegacyTask);
  const legacyAvailableTasks = availableTasks.map(convertToLegacyTask);
  const legacyActiveTask = activeTask ? convertToLegacyTask(activeTask) : null;
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

  if (!legacyActiveTask) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex">
          <FeatureFlagGuard 
            flag="useCascadeBar" 
            fallback={
              <WorkspaceProSidebar 
              myTasks={legacyMyTasks}
              availableTasks={legacyAvailableTasks}
                activeTask={null}
              />
            }
          >
            <CascadeSidebar
              myTasks={legacyMyTasks}
              availableTasks={legacyAvailableTasks}
              activeTask={null}
              onTaskClaim={handleTaskClaim}
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
                    {legacyAvailableTasks.length} tasks available
                  </div>
                </div>
              </div>

              {/* Zone Bundle Integration Test */}
              <FeatureFlagGuard flag="useZoneBundles">
                <ZoneBundleTest />
              </FeatureFlagGuard>

              {/* System Status Display */}
              <ZoneAwareSystemStatus />
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
            onTaskClaim={handleTaskClaim}
              onOKRSelect={(okr) => setSelectedOKR(okr)}
            />
          </DialogContent>
        </Dialog>

      </div>
    );
  }

  // Get the current components from registry (this ensures we use the latest config)
  const currentComponents = taskRegistry[legacyActiveTask.type] || legacyActiveTask.components || [];
  const components = currentComponents;
  
  console.log('Workspace activeTask:', { 
    id: legacyActiveTask.id, 
    type: legacyActiveTask.type, 
    zone: legacyActiveTask.zone, 
    originalComponents: legacyActiveTask.components,
    currentComponents: components,
    registryMapping: taskRegistry[legacyActiveTask.type]
  });

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <WorkspaceProHeader
        activeTask={legacyActiveTask}
        myTasks={legacyMyTasks}
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
            myTasks={legacyMyTasks} 
            availableTasks={legacyAvailableTasks}
            activeTask={legacyActiveTask}
            />
          }
        >
          <CascadeSidebar
            myTasks={legacyMyTasks}
            availableTasks={legacyAvailableTasks}
            activeTask={legacyActiveTask}
            onTaskClaim={handleTaskClaim}
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
                  task={legacyActiveTask}
            onComplete={(taskId) => completeTask(taskId)}
                  isCompleting={isUpdating}
                  showTeamsButton={true}
                />
              </FeatureFlagGuard>
            </div>

            {/* Zone Bundle or Dynamic Widgets */}
            <div className="space-y-6">
              <FeatureFlagGuard flag="useZoneBundles">
                {legacyActiveTask.zone ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 }}
                    className="p-6 bg-glass/30 backdrop-blur-20 rounded-2xl border border-white/10"
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-blue-400"></div>
                        <h3 className="text-lg font-semibold text-white">
                          {legacyActiveTask.zone.toUpperCase()} Zone Bundle
                        </h3>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {legacyActiveTask.type}
                      </Badge>
                    </div>
                    
                    <DynamicZoneBundleLoader
                      zone={legacyActiveTask.zone as Zone}
                      taskType={legacyActiveTask.type as TaskType}
                      taskId={legacyActiveTask.id}
                      taskData={legacyActiveTask}
                      payload={{}}
                      onPayloadUpdate={(payload) => console.log('Zone bundle payload updated:', payload)}
                      onValidationChange={(isValid, errors) => console.log('Zone bundle validation:', isValid, errors)}
                      readonly={false}
                    />
                  </motion.div>
                ) : (
                  <AnimatePresence>
                    {components.map((componentName) => (
                      <DynamicWidget
                        key={componentName}
                        widgetName={componentName}
                        task={legacyActiveTask}
                      />
                    ))}
                  </AnimatePresence>
                )}
              </FeatureFlagGuard>

              <FeatureFlagGuard 
                flag="useZoneBundles" 
                fallback={
                  <AnimatePresence>
                    {components.map((componentName) => (
                      <DynamicWidget
                        key={componentName}
                        widgetName={componentName}
                        task={legacyActiveTask}
                      />
                    ))}
                  </AnimatePresence>
                }
              >
                <div />
              </FeatureFlagGuard>

              {!flags.useZoneBundles && components.length === 0 && (
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
        activeTask={legacyActiveTask}
      />
      
      <TeamsDrawer
        isOpen={isTeamsOpen}
        onClose={() => setIsTeamsOpen(false)}
        taskId={legacyActiveTask?.id}
        taskTitle={legacyActiveTask?.title}
      />

      {/* Goals Tree Dialog */}
      <Dialog open={isGoalTreeOpen} onOpenChange={setIsGoalTreeOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-auto bg-gray-900/95 backdrop-blur-20 border-white/10">
          <DialogHeader>
            <DialogTitle className="text-white">Goals & OKRs Cascade</DialogTitle>
          </DialogHeader>
          <GoalTreeWidget 
            onTaskClaim={handleTaskClaim}
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
        taskTitle={legacyActiveTask?.title}
      />

        {/* Alert Rail */}
        <AlertRail />
      </div>
  );
};