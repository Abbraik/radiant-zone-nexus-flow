import React, { useState } from 'react';
import { Workspace } from './Workspace';
import { WorkspaceShell } from '../layout/WorkspaceShell';
import { useTasks } from '../../hooks/useTasks';
import { CopilotDrawer } from '../../modules/ai/components/CopilotDrawer';
import { TeamsDrawer } from '../../modules/teams/components/TeamsDrawer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { GoalTreeWidget } from '../../modules/cascade/components/GoalTreeWidget';

export const WorkspaceWithShell: React.FC = () => {
  const { myTasks, activeTask } = useTasks();
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isTeamsOpen, setIsTeamsOpen] = useState(false);
  const [isGoalTreeOpen, setIsGoalTreeOpen] = useState(false);

  return (
    <WorkspaceShell
      activeTask={activeTask}
      myTasks={myTasks}
      onCopilotToggle={() => setIsCopilotOpen(!isCopilotOpen)}
      onTeamsToggle={() => setIsTeamsOpen(!isTeamsOpen)}
      onGoalTreeToggle={() => setIsGoalTreeOpen(!isGoalTreeOpen)}
    >
      <Workspace />
      
      {/* Global Drawers & Dialogs */}
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
            onTaskClaim={() => {}}
            onOKRSelect={() => {}}
          />
        </DialogContent>
      </Dialog>
    </WorkspaceShell>
  );
};