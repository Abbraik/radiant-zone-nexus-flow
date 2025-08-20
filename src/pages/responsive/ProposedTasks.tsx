import React from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  CheckSquare, 
  Clock, 
  User,
  ArrowRight,
  ExternalLink
} from 'lucide-react';
import { formatDistanceToNow, addDays } from 'date-fns';

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
}

export const ProposedTasks: React.FC<ProposedTasksProps> = ({
  tasks,
  onTaskClaim,
  onOpenClaimDrawer
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
    <Card className="glass">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <CheckSquare className="h-5 w-5 text-primary" />
            Proposed Tasks
          </CardTitle>
          <Badge variant="outline" className="text-xs">
            {tasks.length} ready
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3 max-h-64 overflow-y-auto custom-scrollbar">
          {tasks.map((task, index) => {
            const capacity = getCapacityBadge(task.capacity);
            const leverage = getLeverageBadge(task.leverage);
            const dueDate = task.dueDate || addDays(new Date(), 7);
            
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-3 border border-border rounded-lg bg-card/50 hover:bg-card/80 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge variant={capacity.variant === 'warning' || capacity.variant === 'success' || capacity.variant === 'info' ? 'secondary' : capacity.variant} className="text-xs">
                      {capacity.label}
                    </Badge>
                    {leverage && (
                      <Badge variant={leverage.variant === 'warning' ? 'destructive' : leverage.variant} className="text-xs">
                        {leverage.label}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    <span>Due {formatDistanceToNow(dueDate, { addSuffix: true })}</span>
                  </div>
                </div>
                
                <h4 className="text-sm font-medium text-foreground mb-1">
                  {task.title}
                </h4>
                
                <p className="text-xs text-muted-foreground mb-3 line-clamp-2">
                  {task.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {task.effort && (
                      <div className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        <span>{task.effort}d effort</span>
                      </div>
                    )}
                  </div>
                  
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onTaskClaim?.(task)}
                    className="text-xs"
                  >
                    Claim
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {tasks.length === 0 && (
          <div className="text-center py-6 text-muted-foreground">
            <CheckSquare className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-sm">No tasks available</p>
          </div>
        )}
        
        {tasks.length > 0 && (
          <div className="pt-3 border-t border-border">
            <Button 
              onClick={onOpenClaimDrawer}
              className="w-full"
              variant="secondary"
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              Open Claim Drawer
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};