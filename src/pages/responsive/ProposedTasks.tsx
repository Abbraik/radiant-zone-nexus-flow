import React from 'react';
import { TaskManagementDashboard } from '@/components/responsive/TaskManagementDashboard';
import { QuickTaskRevert } from '@/components/admin/QuickTaskRevert';

interface Task {
  title: string;
  description: string;
  capacity: string;
  leverage?: string;
  dueDate?: Date;
  effort?: number;
}

interface ProposedTasksProps {
  tasks: Task[];
  onTaskClaim?: (task: Task) => void;
  onOpenClaimDrawer?: () => void;
  sprintId?: string;
}

export const ProposedTasks: React.FC<ProposedTasksProps> = ({
  tasks,
  onTaskClaim,
  onOpenClaimDrawer,
  sprintId
}) => {
  const getCapacityBadge = (capacity: string) => {
    switch (capacity.toLowerCase()) {
      case 'responsive':
        return { variant: 'destructive' as const, label: 'Responsive' };
      case 'reflexive':
        return { variant: 'warning' as const, label: 'Reflexive' };
      case 'deliberative':
        return { variant: 'info' as const, label: 'Deliberative' };
      case 'anticipatory':
        return { variant: 'success' as const, label: 'Anticipatory' };
      case 'structural':
        return { variant: 'secondary' as const, label: 'Structural' };
      default:
        return { variant: 'outline' as const, label: capacity };
    }
  };

  const getLeverageBadge = (leverage?: string) => {
    switch (leverage) {
      case 'S':
        return { variant: 'destructive' as const, label: 'Strategic' };
      case 'P':
        return { variant: 'warning' as const, label: 'Policy' };
      case 'N':
        return { variant: 'secondary' as const, label: 'Operational' };
      default:
        return null;
    }
  };

  return (
    <div className="space-y-4">
      {/* Quick Task Revert */}
      <div className="flex justify-end">
        <QuickTaskRevert />
      </div>
      
      {/* Enhanced Task Management Dashboard */}
      <TaskManagementDashboard 
        sprintId={sprintId}
        onCreateTask={() => onOpenClaimDrawer?.()}
      />
    </div>
  );
};