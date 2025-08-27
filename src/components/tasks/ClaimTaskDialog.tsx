import React, { useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { Clock, Shield, AlertTriangle, Eye, ExternalLink, CheckCircle2, Circle } from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { useToast } from '@/hooks/use-toast';
import { useClaimTaskData } from '@/hooks/useClaimTaskData';
import { useClaimTask } from '@/hooks/useClaimTask';
import { useGuardrailCheck } from '@/hooks/useGuardrailCheck';

interface ClaimTaskDialogProps {
  taskId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ClaimTaskDialog: React.FC<ClaimTaskDialogProps> = ({
  taskId,
  open,
  onOpenChange,
}) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { data: taskData, isLoading, error } = useClaimTaskData(taskId);
  const { mutate: claimTask, isPending: isClaiming } = useClaimTask();
  const { data: guardrailCheck, isLoading: isCheckingGuardrails } = useGuardrailCheck(taskId, open);

  // Fire telemetry event when dialog opens
  useEffect(() => {
    if (open && taskData) {
      // Fire frontend telemetry event
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'ui.claim_task.opened', {
          task_id: taskId,
          capacity: taskData.task.capacity,
          loop_code: taskData.loop.loop_code,
        });
      }
    }
  }, [open, taskData, taskId]);

  const handleClaim = () => {
    if (!taskData) return;

    // Fire telemetry event
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('event', 'ui.claim_task.confirmed', {
        task_id: taskId,
        capacity: taskData.task.capacity,
        loop_code: taskData.loop.loop_code,
      });
    }

    claimTask(taskId, {
      onSuccess: () => {
        toast({
          title: "Task Claimed",
          description: `"${taskData.task.title}" has been claimed successfully`,
        });
        onOpenChange(false);
      },
      onError: (error: any) => {
        toast({
          title: "Claim Failed",
          description: error.message || "Failed to claim task",
          variant: "destructive",
        });
      },
    });
  };

  const handleViewLoop = () => {
    if (taskData?.loop.loop_code) {
      navigate(`/loops/${taskData.loop.loop_code}`);
    }
  };

  const handleOpenPlaybook = () => {
    if (taskData?.task.open_route) {
      window.open(taskData.task.open_route, '_blank');
    }
  };

  const getCapacityColor = (capacity: string) => {
    const colors = {
      responsive: 'bg-blue-500',
      reflexive: 'bg-green-500',
      deliberative: 'bg-purple-500',
      anticipatory: 'bg-orange-500',
      structural: 'bg-red-500',
    };
    return colors[capacity as keyof typeof colors] || 'bg-gray-500';
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-green-500',
      claimed: 'bg-blue-500',
      in_progress: 'bg-yellow-500',
      review_due: 'bg-orange-500',
      completed: 'bg-gray-500',
      cancelled: 'bg-red-500',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-500';
  };

  const calculateSLADeadline = () => {
    if (!taskData) return null;
    
    if (taskData.task.due_at) {
      return new Date(taskData.task.due_at);
    }
    
    if (taskData.template?.default_sla_hours) {
      const createdAt = new Date(); // Would be task.created_at in real implementation
      return new Date(createdAt.getTime() + taskData.template.default_sla_hours * 60 * 60 * 1000);
    }
    
    return null;
  };

  const renderTRIProgress = () => {
    if (!taskData?.tri) return null;

    const { T, R, I } = taskData.tri;
    return (
      <div className="space-y-3">
        <h4 className="text-sm font-medium text-foreground">Loop TRI Status</h4>
        <div className="grid grid-cols-3 gap-4">
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Tension</span>
              <span className="text-foreground">{(T * 100).toFixed(0)}%</span>
            </div>
            <Progress value={T * 100} className="h-2" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Resources</span>
              <span className="text-foreground">{(R * 100).toFixed(0)}%</span>
            </div>
            <Progress value={R * 100} className="h-2" />
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-muted-foreground">Institutions</span>
              <span className="text-foreground">{(I * 100).toFixed(0)}%</span>
            </div>
            <Progress value={I * 100} className="h-2" />
          </div>
        </div>
      </div>
    );
  };

  const renderSignalStatus = () => {
    if (!taskData?.signal?.indicator) {
      return (
        <div className="rounded-lg border border-border bg-muted/30 p-3">
          <p className="text-sm text-muted-foreground">No recent signal data available</p>
        </div>
      );
    }

    const { signal } = taskData;
    const statusColors = {
      below: 'text-red-500',
      in_band: 'text-green-500',
      above: 'text-orange-500',
    };

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Signal Status</h4>
        <div className="rounded-lg border border-border bg-card p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-foreground">{signal.indicator}</span>
            <Badge variant={signal.status === 'in_band' ? 'default' : 'destructive'}>
              {signal.status}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-muted-foreground">Value: </span>
              <span className="text-foreground">{signal.value?.toFixed(3)}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Severity: </span>
              <span className="text-foreground">{signal.severity?.toFixed(2)}</span>
            </div>
          </div>
          {signal.ts && (
            <p className="text-xs text-muted-foreground mt-2">
              Last updated: {formatDistanceToNow(new Date(signal.ts))} ago
            </p>
          )}
        </div>
      </div>
    );
  };

  const renderGuardrails = () => {
    if (!guardrailCheck) return null;

    const { result, reason } = guardrailCheck;
    
    if (result === 'allow') return null;

    return (
      <Alert variant={result === 'block' ? 'destructive' : 'default'}>
        <Shield className="h-4 w-4" />
        <AlertDescription>
          <div className="flex items-center gap-2">
            {result === 'block' ? (
              <AlertTriangle className="h-4 w-4 text-destructive" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            )}
            <span className="font-medium">
              {result === 'block' ? 'Blocked' : 'Warning'}:
            </span>
            {reason}
          </div>
        </AlertDescription>
      </Alert>
    );
  };

  const renderChecklist = () => {
    if (!taskData?.checklist.length) return null;

    const sortedChecklist = [...taskData.checklist]
      .sort((a, b) => a.order_index - b.order_index)
      .slice(0, 5); // Max 5 items as specified

    return (
      <div className="space-y-2">
        <h4 className="text-sm font-medium text-foreground">Checklist Items</h4>
        <div className="space-y-1">
          {sortedChecklist.map((item) => (
            <div key={item.id} className="flex items-center gap-2 text-sm">
              {item.done ? (
                <CheckCircle2 className="h-4 w-4 text-green-500" />
              ) : (
                <Circle className="h-4 w-4 text-muted-foreground" />
              )}
              <span className={`${item.done ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                {item.label}
              </span>
              {item.required && !item.done && (
                <Badge variant="outline" className="text-xs">Required</Badge>
              )}
            </div>
          ))}
          {taskData.checklist.length > 5 && (
            <p className="text-xs text-muted-foreground">
              +{taskData.checklist.length - 5} more items
            </p>
          )}
        </div>
      </div>
    );
  };

  const slaDeadline = calculateSLADeadline();
  const isClaimDisabled = 
    taskData?.task.status !== 'available' || 
    guardrailCheck?.result === 'block' ||
    !!taskData?.owner ||
    isClaiming;

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  if (error || !taskData) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Error</DialogTitle>
            <DialogDescription>
              Failed to load task details. Please try again.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <DialogTitle className="text-xl font-semibold text-foreground mb-2">
                {taskData.task.title}
              </DialogTitle>
              <div className="flex items-center gap-2 mb-4">
                <Badge className={`${getCapacityColor(taskData.task.capacity)} text-white`}>
                  {taskData.task.capacity}
                </Badge>
                <Badge variant="outline" className={`${getStatusColor(taskData.task.status)} text-white`}>
                  {taskData.task.status}
                </Badge>
                <Badge variant="outline">
                  Priority: {taskData.task.priority}
                </Badge>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleViewLoop}
                className="gap-2"
              >
                <Eye className="h-4 w-4" />
                View Loop
              </Button>
              {taskData.task.open_route && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleOpenPlaybook}
                  className="gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  Open Playbook
                </Button>
              )}
            </div>
          </div>
          <DialogDescription className="text-base text-muted-foreground">
            {taskData.task.payload?.description || 'No description available'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Top Row - Basic Info */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Loop Information */}
            <div className="rounded-lg border border-border bg-card p-4">
              <h3 className="font-medium text-foreground mb-2">Loop: {taskData.loop.name}</h3>
              <p className="text-sm text-muted-foreground">Code: {taskData.loop.loop_code}</p>
            </div>

            {/* SLA Countdown */}
            {slaDeadline && (
              <div className="rounded-lg border border-border bg-card p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Due</p>
                    <p className="text-sm font-medium text-foreground">
                      {format(slaDeadline, 'PPp')} ({formatDistanceToNow(slaDeadline)} from now)
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Owner Status */}
          {taskData.owner && taskData.owner.user_id !== 'current-user' && (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                This task is already claimed by another user.
              </AlertDescription>
            </Alert>
          )}

          {/* Guardrails */}
          {renderGuardrails()}

          {/* Middle Row - TRI and Signal Status */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="space-y-4">
              {/* TRI Progress */}
              {renderTRIProgress()}
            </div>
            <div className="space-y-4">
              {/* Signal Status */}
              {renderSignalStatus()}
            </div>
          </div>

          <Separator />

          {/* Bottom Row - Checklist, Source, and Artifacts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Checklist */}
            <div className="space-y-4">
              {renderChecklist()}
            </div>

            {/* Source Information */}
            {taskData.source && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-foreground">Source</h4>
                <div className="rounded-lg border border-border bg-card p-3">
                  <p className="text-sm text-foreground">{taskData.source.label}</p>
                  {taskData.source.fired_at && (
                    <p className="text-xs text-muted-foreground mt-1">
                      Fired: {formatDistanceToNow(new Date(taskData.source.fired_at))} ago
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Artifacts */}
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-foreground">Related Artifacts</h4>
              {taskData.artifacts.length > 0 ? (
                <div className="space-y-2">
                  {taskData.artifacts.map((artifact) => (
                    <div key={artifact.id} className="flex items-center justify-between p-2 rounded border border-border bg-card">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">{artifact.kind}</Badge>
                        <span className="text-sm text-foreground">{artifact.title}</span>
                      </div>
                      {artifact.url && (
                        <Button variant="ghost" size="sm" asChild>
                          <a href={artifact.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3" />
                          </a>
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No artifacts available</p>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-6" />

        <DialogFooter className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex-1">
            {guardrailCheck?.result === 'throttle' && (
              <p className="text-sm text-yellow-600">
                ⚠️ Warning: {guardrailCheck.reason}
              </p>
            )}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleClaim}
              disabled={isClaimDisabled || isCheckingGuardrails}
              className="min-w-[100px]"
            >
              {isClaiming ? (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Claiming...
                </div>
              ) : (
                'Claim Task'
              )}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Deep-link route handler component
export const ClaimTaskRoute: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  
  const action = searchParams.get('action');
  const shouldOpen = action === 'claim' && !!id;

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      // Navigate back, removing the action parameter
      navigate(`/tasks/${id}`, { replace: true });
    }
  };

  if (!shouldOpen || !id) {
    return null;
  }

  return (
    <ClaimTaskDialog
      taskId={id}
      open={shouldOpen}
      onOpenChange={handleOpenChange}
    />
  );
};