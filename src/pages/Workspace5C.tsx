import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { AlertRail } from '@/components/alerts/AlertRail';
import { DynamicCapacityBundle } from '@/components/workspace/DynamicCapacityBundle';
import { WorkspaceProSidebar } from '@/components/workspace/WorkspaceProSidebar';
import { WorkspaceProHeader } from '@/components/workspace/WorkspaceProHeader';
import { CopilotDrawer } from '@/modules/ai/components/CopilotDrawer';
import { TeamsDrawer } from '@/modules/teams/components/TeamsDrawer';
import { GoalTreeWidget } from '@/modules/cascade/components/GoalTreeWidget';
import { OKRPanel } from '@/modules/cascade/components/OKRPanel';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { PairWorkOverlay } from '@/modules/collab/components/PairWorkOverlay';
import { useFeatureFlags, FeatureFlagGuard } from '@/components/layout/FeatureFlagProvider';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Settings } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OKR } from '@/modules/collab/data/mockData';
import CascadeSidebar from '@/components/workspace/CascadeSidebar';
import TaskClaimPopup from '@/components/workspace/TaskClaimPopup';
import EnhancedTaskClaimPopup from '@/modules/taskClaimPopup/TaskClaimPopup';
import EnhancedTaskCard from '@/components/workspace/EnhancedTaskCard';
import { ZoneBundleTest } from '@/components/workspace/ZoneBundleTest';
import { ZoneAwareSystemStatus } from '@/components/workspace/ZoneAwareSystemStatus';
import { Workspace5CSidebar } from '@/components/workspace/Workspace5CSidebar';
import { TaskEngineWidgets } from '@/components/workspace/TaskEngineWidgets';
import { TaskEngineToolbar } from '@/components/workspace/TaskEngineToolbar';
import ZoneToolsPortals from '@/components/zone/ZoneToolsPortals';
import { useToolsStore } from '@/stores/toolsStore';
import { getTasks5C, getTask5CById } from '@/5c/services';
import { QUERY_KEYS_5C, Capacity5C, EnhancedTask5C } from '@/5c/types';
import { use5cTaskEngine } from '@/hooks/use5cTaskEngine';
import { useGoldenScenarioEnrichment } from '@/hooks/useGoldenScenarioEnrichment';
import { ServiceStatus } from '@/5c/components/ServiceStatus';
import type { CapacityBundleProps } from '@/types/capacity';

// Helper function for compatibility
const use5cTasks = () => {
  const enhanced = use5cTaskEngine();
  return enhanced;
};

export const Workspace5C: React.FC = () => {
  const { 
    myTasks, 
    activeTask: rawActiveTask, 
    availableTasks, 
    completeTask, 
    isCompletingTask,
    openClaimPopup,
    confirmClaimTask,
    cancelClaimTask,
    claimingTask,
    showClaimPopup,
    isClaimingTask,
    isLoading
  } = use5cTaskEngine();
  
  // Enrich the active task with golden scenario data
  const activeTask = useGoldenScenarioEnrichment(rawActiveTask);
  
  const { flags } = useFeatureFlags();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false);
  const [isGoalTreeOpen, setIsGoalTreeOpen] = useState(false);
  const [selectedOKR, setSelectedOKR] = useState<OKR | null>(null);
  const [isPairWorkOpen, setIsPairWorkOpen] = useState(false);
  const [pairWorkPartner, setPairWorkPartner] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  
  const openMetaLoopConsole = () => {
    useToolsStore.getState().open('admin', 'meta');
  };

  // Auto-collapse sidebar when task is active to maximize workspace space
  React.useEffect(() => {
    if (activeTask && !isSidebarCollapsed) {
      setIsSidebarCollapsed(true);
    }
  }, [activeTask]);

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex items-center justify-center h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-400 mx-auto mb-4"></div>
            <p className="text-white">Loading 5C Workspace...</p>
          </div>
        </div>
      </div>
    );
  }

  if (!activeTask) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <div className="flex">
          <Workspace5CSidebar
            myTasks={myTasks.map(t => t as any)}
            availableTasks={availableTasks.map(t => t as any)}
            activeTask={null}
            onTaskClaim={openClaimPopup}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
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
                  <h2 className="text-2xl font-semibold text-white mb-2">No Active 5C Task</h2>
                  <p className="text-gray-300 mb-6">
                    Claim a capacity-based task from the sidebar to get started with your 5C workspace
                  </p>
                  <div className="text-sm text-gray-400">
                    {availableTasks.length} capacity tasks available • {myTasks.length} claimed tasks
                  </div>
                </div>
              </div>

              {/* Zone Bundle Integration Test */}
              <FeatureFlagGuard flag="useZoneBundles">
                <ZoneBundleTest />
              </FeatureFlagGuard>

              {/* System Status Display */}
              <ZoneAwareSystemStatus />
              
              {/* Service Health Monitor */}
              <ServiceStatus />
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

  // Convert 5C task to workspace task format for components
  const workspaceTask: any = {
    ...activeTask,
    type: `capacity-${activeTask.capacity}`,
    zone: activeTask.capacity,
    components: [],
    task_type: `capacity-${activeTask.capacity}`,
    priority: 'normal',
    due_date: activeTask.updated_at,
    created_at: new Date(activeTask.created_at),
    updated_at: new Date(activeTask.updated_at),
    tri: activeTask.tri ? {
      T: activeTask.tri.t_value,
      R: activeTask.tri.r_value,
      I: activeTask.tri.i_value
    } : undefined,
    status: activeTask.status === 'open' ? 'available' as const : 
            activeTask.status === 'active' ? 'in_progress' as const :
            activeTask.status === 'done' ? 'completed' as const :
            'claimed' as const
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <WorkspaceProHeader
        activeTask={workspaceTask}
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
        {!isSidebarCollapsed && (
          <Workspace5CSidebar
            myTasks={myTasks.map(t => t as any)}
            availableTasks={availableTasks.map(t => t as any)}
            activeTask={activeTask}
            onTaskClaim={openClaimPopup}
            isCollapsed={isSidebarCollapsed}
            onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
          />
        )}
        
        {/* Full-screen workspace when sidebar is collapsed */}
        <main className={`flex-1 p-6 overflow-auto transition-all duration-300 ${
          isSidebarCollapsed ? 'w-full' : ''
        }`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mx-auto transition-all duration-300 ${
              isSidebarCollapsed ? 'max-w-none' : 'max-w-4xl'
            }`}
          >
            {/* Sidebar Toggle Button when collapsed */}
            {isSidebarCollapsed && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                onClick={() => setIsSidebarCollapsed(false)}
                className="fixed top-20 left-4 z-50 p-3 bg-glass/80 backdrop-blur-20 rounded-lg border border-white/20 hover:bg-glass/95 transition-all duration-200 text-white shadow-lg"
                title="Expand sidebar"
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 18L15 12L9 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </motion.button>
            )}
            {/* Enhanced Task Card */}
            <div className="mb-6">
              <FeatureFlagGuard flag="useTeamsButton">
                <EnhancedTaskCard
                  task={workspaceTask}
                  onComplete={completeTask}
                  isCompleting={isCompletingTask}
                  showTeamsButton={true}
                />
              </FeatureFlagGuard>
            </div>

            {/* TaskEngine V2 Toolbar */}
            <div className="mb-4">
              <TaskEngineToolbar
                activeTask5C={activeTask}
                onTaskAction={(action, taskId) => console.log('5C Task action:', action, taskId)}
              />
            </div>

            {/* 5C Capacity Bundle - Full screen when sidebar collapsed */}
            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <div className="lg:col-span-3">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`p-6 bg-glass/30 backdrop-blur-20 rounded-2xl border border-white/10 transition-all duration-300 ${
                    isSidebarCollapsed ? 'min-h-[calc(100vh-200px)]' : ''
                  }`}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-teal-400 to-blue-400"></div>
                      <h3 className="text-lg font-semibold text-white">
                        {activeTask.capacity.toUpperCase()} Capacity Bundle
                      </h3>
                      {isSidebarCollapsed && (
                        <span className="text-sm text-gray-400 ml-2">• Full Screen Mode</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="capitalize">
                        {activeTask.capacity}
                      </Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={openMetaLoopConsole}
                        className="gap-2"
                      >
                        <Settings className="w-4 h-4" />
                        Meta-Loop Console
                      </Button>
                      {!isSidebarCollapsed && (
                        <button
                          onClick={() => setIsSidebarCollapsed(true)}
                          className="p-1 text-gray-400 hover:text-white transition-colors"
                          title="Expand to full screen"
                        >
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M8 3H5C3.89543 3 3 3.89543 3 5V8M21 8V5C21 3.89543 20.1046 3 19 3H16M16 21H19C20.1046 21 21 20.1046 21 19V16M8 21H5C3.89543 21 3 20.1046 3 19V16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>
                  
                  <DynamicCapacityBundle
                    capacity={activeTask.capacity as Capacity5C}
                    taskId={activeTask.id}
                    taskData={workspaceTask}
                    payload={activeTask.payload || {}}
                    onPayloadUpdate={(payload) => {
                      console.log('5C bundle payload updated:', payload);
                      // TODO: Implement real payload update
                    }}
                    onValidationChange={(isValid, errors) => {
                      console.log('5C bundle validation:', isValid, errors);
                    }}
                    readonly={false}
                  />
                </motion.div>
              </div>
              {!isSidebarCollapsed && (
                <div className="lg:col-span-1">
                  <ServiceStatus />
                </div>
              )}
            </div>
          </motion.div>
        </main>
      </div>
      
      {/* Overlays & Drawers */}
      <CopilotDrawer
        isOpen={isCopilotOpen}
        onClose={() => setIsCopilotOpen(false)}
        activeTask={workspaceTask}
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
      
      {/* Zone Tools Portals - Admin zone for Meta Loop Console */}
      <ZoneToolsPortals zone="admin" />
      
      {/* Alert Rail */}
      <AlertRail />
    </div>
  );
};

export default Workspace5C;