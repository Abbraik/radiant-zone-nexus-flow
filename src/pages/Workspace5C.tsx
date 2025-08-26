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
import ZoneToolsPortals from '@/components/zone/ZoneToolsPortals';
import { useToolsStore } from '@/stores/toolsStore';
import { useTaskEngine } from '@/hooks/useTaskEngine';
import { TaskAssignmentPanel } from '@/components/taskEngine/TaskAssignmentPanel';
import { TaskTimeline } from '@/components/taskEngine/TaskTimeline';
import { TaskCreationModal } from '@/components/taskEngine/TaskCreationModal';
import type { CapacityBundleProps } from '@/types/capacity';

export const Workspace5C: React.FC = () => {
  const { 
    tasks,
    selectedTask,
    setSelectedTask,
    activeTasks,
    myTasks,
    overdueTasks,
    tasksLoading,
    createTask,
    updateTaskStatus,
    completeTask,
    assignTask,
    acquireLock,
    isCreating,
    isUpdating,
    isAssigning,
    isAcquiringLock
  } = useTaskEngine();
  
  const { flags } = useFeatureFlags();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false);
  const [isGoalTreeOpen, setIsGoalTreeOpen] = useState(false);
  const [selectedOKR, setSelectedOKR] = useState<OKR | null>(null);
  const [isPairWorkOpen, setIsPairWorkOpen] = useState(false);
  const [pairWorkPartner, setPairWorkPartner] = useState<string | null>(null);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isTaskCreationOpen, setIsTaskCreationOpen] = useState(false);
  
  // Get the currently active task (first active task or selected task)
  const activeTask = selectedTask || activeTasks[0] || null;
  
  const openMetaLoopConsole = () => {
    useToolsStore.getState().open('admin', 'meta');
  };

  // Auto-collapse sidebar when task is active to maximize workspace space
  React.useEffect(() => {
    if (activeTask && !isSidebarCollapsed) {
      setIsSidebarCollapsed(true);
    }
  }, [activeTask]);
  
  // Handle task claiming
  const handleTaskClaim = (taskId: string) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      setSelectedTask(task);
      updateTaskStatus(taskId, 'active');
    }
  };

  // Show loading state
  if (tasksLoading) {
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
            myTasks={myTasks}
            availableTasks={tasks.filter(t => t.status === 'draft' || t.status === 'active')}
            activeTask={null}
            onTaskClaim={handleTaskClaim}
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
                    {tasks.filter(t => t.status === 'draft' || t.status === 'active').length} tasks available • {myTasks.length} assigned tasks
                  </div>
                  <Button
                    onClick={() => setIsTaskCreationOpen(true)}
                    className="mt-4 bg-teal-500 hover:bg-teal-600 text-white"
                  >
                    Create New Task
                  </Button>
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

        {/* Task Creation Modal */}
        <TaskCreationModal
          isOpen={isTaskCreationOpen}
          onClose={() => setIsTaskCreationOpen(false)}
          onCreate={createTask}
          isCreating={isCreating}
        />
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
        {!isSidebarCollapsed && (
          <Workspace5CSidebar
            myTasks={myTasks}
            availableTasks={tasks.filter(t => t.status === 'draft' || t.status === 'active')}
            activeTask={activeTask}
            onTaskClaim={handleTaskClaim}
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
            {/* Task Engine V2 Components */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div className="lg:col-span-2">
                <div className="p-6 bg-glass/30 backdrop-blur-20 rounded-2xl border border-white/10">
                  <h3 className="text-lg font-semibold text-white mb-4">Active Task</h3>
                  {activeTask ? (
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-white font-medium">{activeTask.title}</h4>
                        <p className="text-gray-300 text-sm mt-1">{activeTask.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          activeTask.priority === 'critical' ? 'bg-red-500/20 text-red-300' :
                          activeTask.priority === 'high' ? 'bg-orange-500/20 text-orange-300' :
                          activeTask.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                          'bg-green-500/20 text-green-300'
                        }`}>
                          {activeTask.priority}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          activeTask.status === 'active' ? 'bg-blue-500/20 text-blue-300' :
                          activeTask.status === 'completed' ? 'bg-green-500/20 text-green-300' :
                          'bg-gray-500/20 text-gray-300'
                        }`}>
                          {activeTask.status}
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => completeTask(activeTask.id)}
                          disabled={isUpdating}
                          className="bg-green-500 hover:bg-green-600 text-white"
                        >
                          {isUpdating ? 'Completing...' : 'Complete Task'}
                        </Button>
                        <Button
                          onClick={() => updateTaskStatus(activeTask.id, 'paused')}
                          disabled={isUpdating}
                          variant="outline"
                        >
                          Pause
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-gray-400 mb-4">No active task selected</p>
                      <Button
                        onClick={() => setIsTaskCreationOpen(true)}
                        className="bg-teal-500 hover:bg-teal-600 text-white"
                      >
                        Create New Task
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div>
                <TaskAssignmentPanel
                  tasks={tasks}
                  onAssign={assignTask}
                  isAssigning={isAssigning}
                />
              </div>
            </div>

            {/* Task Timeline */}
            <div className="space-y-6">
              <TaskTimeline 
                tasks={tasks}
                onTaskSelect={setSelectedTask}
                selectedTask={selectedTask}
              />
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
        taskTitle={activeTask?.title}
      />

      {/* Task Creation Modal */}
      <TaskCreationModal
        isOpen={isTaskCreationOpen}
        onClose={() => setIsTaskCreationOpen(false)}
        onCreate={createTask}
        isCreating={isCreating}
      />
      
      {/* Zone Tools Portals - Admin zone for Meta Loop Console */}
      <ZoneToolsPortals zone="admin" />
      
      {/* Alert Rail */}
      <AlertRail />
    </div>
  );
};

export default Workspace5C;