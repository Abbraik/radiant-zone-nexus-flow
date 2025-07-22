import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTasks } from '../../hooks/useTasks';
import { DynamicWidget } from './DynamicWidget';
import { CascadeSidebar } from './CascadeSidebar';
import { TaskClaimModal } from './TaskClaimModal';
import { WorkspaceProHeader } from './WorkspaceProHeader';
import { CopilotDrawer } from '../../modules/ai/components/CopilotDrawer';
import { TeamsDrawer } from '../../modules/teams/components/TeamsDrawer';
import { GoalTreeWidget } from '../../modules/cascade/components/GoalTreeWidget';
import { OKRPanel } from '../../modules/cascade/components/OKRPanel';
import { PairWorkOverlay } from '../../modules/collab/components/PairWorkOverlay';
import { useFeatureFlags } from '../layout/FeatureFlagProvider';
import { Button } from '../ui/button';
import { CheckCircle, AlertCircle } from 'lucide-react';
import { OKR } from '../../modules/collab/data/mockData';

export const Workspace: React.FC = () => {
  const { myTasks, activeTask, availableTasks, completeTask, isCompletingTask, claimTask } = useTasks();
  const { flags } = useFeatureFlags();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false);
  const [isGoalTreeOpen, setIsGoalTreeOpen] = useState(false);
  const [selectedOKR, setSelectedOKR] = useState<OKR | null>(null);
  const [isPairWorkOpen, setIsPairWorkOpen] = useState(false);
  const [pairWorkPartner, setPairWorkPartner] = useState<string | null>(null);
  const [claimModalOpen, setClaimModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isConfirmingClaim, setIsConfirmingClaim] = useState(false);

  const handleTaskClaim = (taskId: string) => {
    console.log('handleTaskClaim called with taskId:', taskId);
    setSelectedTaskId(taskId);
    setClaimModalOpen(true);
    console.log('Modal should be opening...');
  };

  const handleConfirmClaim = async (taskId: string) => {
    setIsConfirmingClaim(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    await claimTask(taskId);
    setIsConfirmingClaim(false);
    setClaimModalOpen(false);
    setSelectedTaskId(null);
  };

  // Debug: Log the feature flags
  console.log('Workspace feature flags:', flags);

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
      <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
        <WorkspaceProHeader 
          activeTask={null} 
          myTasks={myTasks} 
          onCopilotToggle={() => setIsCopilotOpen(true)}
          onTeamsToggle={() => setIsTeamsOpen(true)}
          onGoalTreeToggle={() => setIsGoalTreeOpen(true)}
          onPairWorkStart={(partnerId) => {
            setPairWorkPartner(partnerId);
            setIsPairWorkOpen(true);
          }}
        />
        
        <div className="flex flex-1">
          <CascadeSidebar 
            onTaskClaim={handleTaskClaim}
            activeTaskId={activeTask?.id}
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
      <WorkspaceProHeader 
        activeTask={activeTask} 
        myTasks={myTasks} 
        onCopilotToggle={() => setIsCopilotOpen(true)}
        onTeamsToggle={() => setIsTeamsOpen(true)}
        onGoalTreeToggle={() => setIsGoalTreeOpen(true)}
        onPairWorkStart={(partnerId) => {
          setPairWorkPartner(partnerId);
          setIsPairWorkOpen(true);
        }}
      />
      
      <div className="flex flex-1">
        <CascadeSidebar 
          onTaskClaim={handleTaskClaim}
          activeTaskId={activeTask?.id}
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
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
              
              {/* Main Content Area */}
              <div className="xl:col-span-2 space-y-6">
                <AnimatePresence mode="wait">
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

              {/* Goals & OKRs Sidebar */}
              <div className="xl:col-span-1">
                <GoalTreeWidget 
                  onTaskClaim={handleTaskClaim}
                  onOKRSelect={(okr) => setSelectedOKR(okr)}
                />
              </div>
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

      <OKRPanel
        isOpen={!!selectedOKR}
        onClose={() => setSelectedOKR(null)}
        okr={selectedOKR}
        onTaskClaim={handleTaskClaim}
      />

      <PairWorkOverlay
        isOpen={isPairWorkOpen}
        onClose={() => setIsPairWorkOpen(false)}
        partnerId={pairWorkPartner || undefined}
        taskTitle={activeTask?.title}
      />

      <TaskClaimModal
        isOpen={claimModalOpen}
        onClose={() => setClaimModalOpen(false)}
        taskId={selectedTaskId}
        onConfirmClaim={handleConfirmClaim}
        isConfirming={isConfirmingClaim}
      />
    </div>
  );
};