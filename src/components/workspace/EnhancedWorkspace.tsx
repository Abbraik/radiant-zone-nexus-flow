import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEnhancedTasks } from '../../hooks/useEnhancedTasks';
import { DynamicZoneBundleLoader } from './DynamicZoneBundleLoader';
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
import { CheckCircle, AlertCircle, Database, Zap } from 'lucide-react';
import { OKR } from '../../modules/collab/data/mockData';
import CascadeSidebar from './CascadeSidebar';
import TaskClaimPopup from './TaskClaimPopup';
import EnhancedTaskClaimPopup from '../../modules/taskClaimPopup/TaskClaimPopup';
import EnhancedTaskCard from './EnhancedTaskCard';
import { Badge } from '../ui/badge';
import { toast } from '../../hooks/use-toast';
import type { Zone, TaskType } from '../../types/zone-bundles';

export const EnhancedWorkspace: React.FC = () => {
  const { 
    myTasks, 
    activeTask, 
    availableTasks, 
    completeTask, 
    updateTaskPayload,
    isCompletingTask,
    openClaimPopup,
    confirmClaimTask,
    cancelClaimTask,
    claimingTask,
    showClaimPopup,
    isClaimingTask,
    isLoading
  } = useEnhancedTasks();
  
  const { flags } = useFeatureFlags();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false);
  const [isGoalTreeOpen, setIsGoalTreeOpen] = useState(false);
  const [selectedOKR, setSelectedOKR] = useState<OKR | null>(null);
  const [isPairWorkOpen, setIsPairWorkOpen] = useState(false);
  const [pairWorkPartner, setPairWorkPartner] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [taskPayload, setTaskPayload] = useState<any>({});
  const [validationState, setValidationState] = useState<{isValid: boolean, errors?: string[]}>({ isValid: false });

  const handlePayloadUpdate = (payload: any) => {
    setTaskPayload(payload);
    if (activeTask) {
      updateTaskPayload(activeTask.id, payload);
    }
  };

  const handleValidationChange = (isValid: boolean, errors?: string[]) => {
    setValidationState({ isValid, errors });
  };

  const handleCompleteTask = () => {
    if (!activeTask) return;
    
    if (!validationState.isValid) {
      toast({
        title: "Validation Required",
        description: "Please complete all required fields before finishing the task.",
        variant: "destructive"
      });
      return;
    }
    
    completeTask(activeTask.id);
  };

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="inline-flex items-center gap-3 p-6 bg-glass/70 backdrop-blur-20 rounded-2xl border border-white/10">
            <Database className="h-6 w-6 text-teal-400 animate-pulse" />
            <span className="text-white font-medium">Loading workspace...</span>
          </div>
        </motion.div>
      </div>
    );
  }

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
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          </FeatureFlagGuard>
          
          <main className="flex-1 p-6 overflow-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="max-w-4xl mx-auto space-y-6"
            >
              <div className="text-center py-20">
                <div className="p-6 bg-glass/70 backdrop-blur-20 rounded-2xl shadow-2xl border border-white/10">
                  <AlertCircle className="h-16 w-16 text-teal-400 mx-auto mb-4" />
                  <h2 className="text-2xl font-semibold text-white mb-2">No Active Task</h2>
                  <p className="text-gray-300 mb-6">
                    Claim a task from the sidebar to get started with zone-aware task management
                  </p>
                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Badge variant="outline" className="flex items-center gap-2">
                      <Database className="h-3 w-3" />
                      Supabase Connected
                    </Badge>
                    <Badge variant="outline" className="flex items-center gap-2">
                      <Zap className="h-3 w-3" />
                      Zone Bundles Enabled
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-400">
                    {availableTasks.length} tasks available across {new Set(availableTasks.map(t => t.zone)).size} zones
                  </div>
                </div>
              </div>
            </motion.div>
          </main>
        </div>
        
        {/* Task Claim Popup */}
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
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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
                  onComplete={handleCompleteTask}
                  isCompleting={isCompletingTask}
                  showTeamsButton={true}
                  validationState={validationState}
                />
              </FeatureFlagGuard>
            </div>

            {/* Zone Bundle Interface */}
            <div className="space-y-6">
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
                      {activeTask.zone.toUpperCase()} Zone Workspace
                    </h3>
                  </div>
                  <Badge variant="outline" className="capitalize">
                    {activeTask.task_type}
                  </Badge>
                </div>
                
                <DynamicZoneBundleLoader
                  zone={activeTask.zone as Zone}
                  taskType={activeTask.task_type as TaskType}
                  taskId={activeTask.id}
                  taskData={activeTask}
                  payload={activeTask.payload || {}}
                  onPayloadUpdate={handlePayloadUpdate}
                  onValidationChange={handleValidationChange}
                  readonly={false}
                />
              </motion.div>
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
        onTaskClaim={(taskId) => openClaimPopup(taskId)}
      />

      <PairWorkOverlay
        isOpen={isPairWorkOpen}
        onClose={() => setIsPairWorkOpen(false)}
        partnerId={pairWorkPartner || undefined}
        taskTitle={activeTask?.title}
      />

      {/* Task Claim Popup */}
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
};