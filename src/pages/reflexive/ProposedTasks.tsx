import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Calendar, User, CheckSquare } from 'lucide-react';

interface Task {
  id: string;
  title: string;
  description: string;
  capacity: string;
  leverage: string;
  dueDate: Date;
  status: 'open' | 'claimed' | 'active' | 'done';
}

interface ProposedTasksProps {
  tasks: Task[];
  onOpenClaimDrawer?: (tasks: Task[]) => void;
}

export const ProposedTasks: React.FC<ProposedTasksProps> = ({
  tasks = [],
  onOpenClaimDrawer
}) => {
  // Mock tasks for demonstration
  const mockTasks: Task[] = [
    {
      id: 'rt-1',
      title: 'Validate PI Controller Performance',
      description: 'Monitor oscillation and settling time after family switch',
      capacity: 'reflexive',
      leverage: 'N',
      dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      status: 'open'
    },
    {
      id: 'rt-2',
      title: 'Schedule T2 Weight Review',
      description: 'Evaluate dispersion impact of recent weighting changes',
      capacity: 'reflexive',
      leverage: 'P',
      dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      status: 'open'
    },
    {
      id: 'rt-3',
      title: 'Document Controller Rationale',
      description: 'Update governance documentation with tuning decisions',
      capacity: 'reflexive',
      leverage: 'N',
      dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
      status: 'open'
    }
  ];

  const displayTasks = tasks.length > 0 ? tasks : mockTasks;
  const openTasks = displayTasks.filter(task => task.status === 'open');

  const getLeverageBadgeVariant = (leverage: string) => {
    switch (leverage) {
      case 'N': return 'secondary';
      case 'P': return 'default';
      case 'S': return 'destructive';
      default: return 'outline';
    }
  };

  const formatDueDate = (date: Date) => {
    const now = new Date();
    const diffMs = date.getTime() - now.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return `${Math.abs(diffDays)} days overdue`;
    } else if (diffDays === 0) {
      return 'Due today';
    } else if (diffDays === 1) {
      return 'Due tomorrow';
    } else {
      return `Due in ${diffDays} days`;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckSquare className="h-5 w-5" />
              Proposed Tasks
            </CardTitle>
            <CardDescription>
              Tasks generated from decision template and reflexive recipes
            </CardDescription>
          </div>
          {openTasks.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => onOpenClaimDrawer?.(openTasks)}
            >
              <ExternalLink className="mr-2 h-4 w-4" />
              Open Claim Drawer
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {openTasks.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No open tasks available</p>
            <p className="text-xs mt-1">Tasks will appear here after applying recipes or making changes</p>
          </div>
        ) : (
          <div className="space-y-3">
            {openTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="space-y-1">
                    <h4 className="text-sm font-medium">{task.title}</h4>
                    <p className="text-xs text-muted-foreground">
                      {task.description}
                    </p>
                  </div>
                  <div className="flex gap-1">
                    <Badge variant="outline" className="text-xs">
                      {task.capacity}
                    </Badge>
                    <Badge variant={getLeverageBadgeVariant(task.leverage)} className="text-xs">
                      {task.leverage}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      <span>{formatDueDate(task.dueDate)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <User className="h-3 w-3" />
                      <span>Unassigned</span>
                    </div>
                  </div>
                  
                  <Button variant="outline" size="sm" className="h-7 px-2">
                    Claim
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};