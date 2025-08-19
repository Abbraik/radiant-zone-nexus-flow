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
import { CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { OKR } from '@/modules/collab/data/mockData';
import CascadeSidebar from '@/components/workspace/CascadeSidebar';
import TaskClaimPopup from '@/components/workspace/TaskClaimPopup';
import EnhancedTaskClaimPopup from '@/modules/taskClaimPopup/TaskClaimPopup';
import EnhancedTaskCard from '@/components/workspace/EnhancedTaskCard';
import { ZoneBundleTest } from '@/components/workspace/ZoneBundleTest';
import { ZoneAwareSystemStatus } from '@/components/workspace/ZoneAwareSystemStatus';
import { getTasks5C, getTask5CById } from '@/5c/services';
import { QUERY_KEYS_5C, Capacity5C, EnhancedTask5C } from '@/5c/types';
import type { CapacityBundleProps } from '@/types/capacity';

// Hook to mimic the workspace task management for 5C tasks
const use5cTasks = () => {
  const [searchParams] = useSearchParams();
  const taskId = searchParams.get('task5c');
  
  const { data: allTasks = [] } = useQuery({
    queryKey: QUERY_KEYS_5C.tasks(),
    queryFn: () => getTasks5C()
  });

  const { data: activeTask, isLoading: isLoadingTask } = useQuery({
    queryKey: QUERY_KEYS_5C.task(taskId!),
    queryFn: () => getTask5CById(taskId!),
    enabled: !!taskId
  });

  // Convert 5C tasks to workspace task format
  const convertToWorkspaceTask = (task5c: EnhancedTask5C): any => ({
    ...task5c,
    zone: task5c.capacity,
    components: [],
    task_type: `capacity-${task5c.capacity}`,
    priority: 'normal',
    due_date: task5c.updated_at,
    created_at: new Date(task5c.created_at),
    updated_at: new Date(task5c.updated_at),
    tri: task5c.tri ? {
      T: task5c.tri.t_value,
      R: task5c.tri.r_value,
      I: task5c.tri.i_value
    } : undefined,
    status: task5c.status === 'open' ? 'available' as const : 
            task5c.status === 'active' ? 'in_progress' as const :
            task5c.status === 'done' ? 'completed' as const :
            'claimed' as const
  });

  // Mock the workspace task management interface
  const mockTaskFunctions = {
    completeTask: (taskId: string) => console.log('5C Task completed:', taskId),
    isCompletingTask: false,
    openClaimPopup: (task: any) => console.log('5C Task claim popup:', task),
    confirmClaimTask: () => console.log('5C Task claim confirmed'),
    cancelClaimTask: () => console.log('5C Task claim cancelled'),
    claimingTask: null,
    showClaimPopup: false,
    isClaimingTask: false
  };

  return {
    myTasks: allTasks.filter(t => t.status === 'claimed').map(convertToWorkspaceTask),
    activeTask,
    availableTasks: allTasks.filter(t => t.status === 'open').map(convertToWorkspaceTask),
    ...mockTaskFunctions
  };
};

export const Workspace5C: React.FC = () => {
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
  } = use5cTasks();
  
  const { flags } = useFeatureFlags();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false);
  const [isGoalTreeOpen, setIsGoalTreeOpen] = useState(false);
  const [selectedOKR, setSelectedOKR] = useState<OKR | null>(null);
  const [isPairWorkOpen, setIsPairWorkOpen] = useState(false);
  const [pairWorkPartner, setPairWorkPartner] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Auto-collapse sidebar when task is active to maximize workspace space
  React.useEffect(() => {
    if (activeTask && !isSidebarCollapsed) {
      setIsSidebarCollapsed(true);
    }
  }, [activeTask]);

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
                    {availableTasks.length} capacity tasks available
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
        <FeatureFlagGuard 
          flag="useCascadeBar" 
          fallback={
            !isSidebarCollapsed && (
              <WorkspaceProSidebar 
                myTasks={myTasks} 
                availableTasks={availableTasks}
                activeTask={workspaceTask}
              />
            )
          }
        >
          {!isSidebarCollapsed && (
            <CascadeSidebar
              myTasks={myTasks}
              availableTasks={availableTasks}
              activeTask={workspaceTask}
              onTaskClaim={openClaimPopup}
              isCollapsed={isSidebarCollapsed}
              onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            />
          )}
        </FeatureFlagGuard>
        
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
                className="fixed top-20 left-4 z-50 p-2 bg-glass/70 backdrop-blur-20 rounded-lg border border-white/10 hover:bg-glass/90 transition-all duration-200 text-white"
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

            {/* 5C Capacity Bundle - Full screen when sidebar collapsed */}
            <div className="space-y-6">
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
                  payload={{}}
                  onPayloadUpdate={(payload) => console.log('5C bundle payload updated:', payload)}
                  onValidationChange={(isValid, errors) => console.log('5C bundle validation:', isValid, errors)}
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
      
      {/* Alert Rail */}
      <AlertRail />
    </div>
  );
};

export default Workspace5C;