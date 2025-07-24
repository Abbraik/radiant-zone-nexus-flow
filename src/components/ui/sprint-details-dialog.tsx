import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format, parseISO, differenceInDays } from 'date-fns';
import { X, Calendar, Clock, Target, Zap, CheckCircle, Circle, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';

interface Sprint {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  phase: 'think' | 'act' | 'monitor' | 'innovate';
  progress?: number;
  description?: string;
  objectives?: string[];
  team?: string[];
  status?: 'planning' | 'active' | 'completed' | 'blocked';
  milestones?: {
    id: string;
    title: string;
    dueDate: string;
    completed: boolean;
  }[];
}

interface SprintDetailsDialogProps {
  sprint: Sprint | null;
  isOpen: boolean;
  onClose: () => void;
}

const getPhaseColor = (phase: string) => {
  switch (phase) {
    case 'think': return 'hsl(var(--success))';
    case 'act': return 'hsl(var(--primary))';
    case 'monitor': return 'hsl(var(--warning))';
    case 'innovate': return 'hsl(var(--accent))';
    default: return 'hsl(var(--primary))';
  }
};

const getPhaseIcon = (phase: string) => {
  switch (phase) {
    case 'think': return Calendar;
    case 'act': return Zap;
    case 'monitor': return Target;
    case 'innovate': return Clock;
    default: return Calendar;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'completed': return 'hsl(var(--success))';
    case 'active': return 'hsl(var(--primary))';
    case 'planning': return 'hsl(var(--muted-foreground))';
    case 'blocked': return 'hsl(var(--destructive))';
    default: return 'hsl(var(--muted-foreground))';
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'completed': return CheckCircle;
    case 'active': return Clock;
    case 'planning': return Circle;
    case 'blocked': return AlertCircle;
    default: return Circle;
  }
};

export const SprintDetailsDialog: React.FC<SprintDetailsDialogProps> = ({
  sprint,
  isOpen,
  onClose
}) => {
  if (!sprint) return null;

  const PhaseIcon = getPhaseIcon(sprint.phase);
  const StatusIcon = getStatusIcon(sprint.status || 'planning');
  const phaseColor = getPhaseColor(sprint.phase);
  const statusColor = getStatusColor(sprint.status || 'planning');
  
  const startDate = parseISO(sprint.startDate);
  const endDate = parseISO(sprint.endDate);
  const duration = differenceInDays(endDate, startDate);
  const daysRemaining = differenceInDays(endDate, new Date());

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[999999] flex items-center justify-center p-4"
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-background/90 backdrop-blur-md"
            onClick={onClose}
          />
          
          {/* Dialog */}
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.3 }}
            className="relative w-full max-w-2xl mx-auto my-8"
            style={{ maxHeight: 'calc(100vh - 4rem)' }}
          >
            <div className="glass rounded-2xl p-6 border border-border/50 shadow-2xl h-full overflow-y-auto relative z-[999999]">
              {/* Header */}
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-start gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: phaseColor }}
                  >
                    <PhaseIcon className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-foreground mb-2">{sprint.name}</h2>
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className="capitalize border-border/50"
                        style={{ color: phaseColor, borderColor: phaseColor }}
                      >
                        <PhaseIcon className="w-3 h-3 mr-1" />
                        {sprint.phase} Phase
                      </Badge>
                      {sprint.status && (
                        <Badge 
                          variant="outline"
                          className="capitalize border-border/50"
                          style={{ color: statusColor, borderColor: statusColor }}
                        >
                          <StatusIcon className="w-3 h-3 mr-1" />
                          {sprint.status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-foreground-subtle hover:text-foreground"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Timeline and Progress */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-foreground-subtle" />
                      <div>
                        <div className="text-sm text-foreground-subtle">Start Date</div>
                        <div className="font-medium text-foreground">
                          {format(startDate, 'MMMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Calendar className="w-4 h-4 text-foreground-subtle" />
                      <div>
                        <div className="text-sm text-foreground-subtle">End Date</div>
                        <div className="font-medium text-foreground">
                          {format(endDate, 'MMMM dd, yyyy')}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-foreground-subtle" />
                      <div>
                        <div className="text-sm text-foreground-subtle">Duration</div>
                        <div className="font-medium text-foreground">
                          {duration} days
                        </div>
                      </div>
                    </div>
                    {daysRemaining > 0 && (
                      <div className="flex items-center gap-3">
                        <Target className="w-4 h-4 text-foreground-subtle" />
                        <div>
                          <div className="text-sm text-foreground-subtle">Days Remaining</div>
                          <div className="font-medium text-foreground">
                            {daysRemaining} days
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-foreground">Progress</h3>
                  <div className="space-y-3">
                    {sprint.progress !== undefined && (
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span className="text-foreground-subtle">Completion</span>
                          <span className="text-foreground font-medium">{sprint.progress}%</span>
                        </div>
                        <Progress value={sprint.progress} className="h-2" />
                      </div>
                    )}
                    {sprint.team && (
                      <div>
                        <div className="text-sm text-foreground-subtle mb-2">Team Members</div>
                        <div className="flex flex-wrap gap-2">
                          {sprint.team.map((member, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {member}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Description */}
              {sprint.description && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Description</h3>
                  <p className="text-foreground-subtle leading-relaxed">{sprint.description}</p>
                </div>
              )}

              {/* Objectives */}
              {sprint.objectives && sprint.objectives.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Objectives</h3>
                  <ul className="space-y-2">
                    {sprint.objectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <div 
                          className="w-2 h-2 rounded-full mt-2 flex-shrink-0"
                          style={{ backgroundColor: phaseColor }}
                        />
                        <span className="text-foreground-subtle">{objective}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Milestones */}
              {sprint.milestones && sprint.milestones.length > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-foreground mb-3">Milestones</h3>
                  <div className="space-y-3">
                    {sprint.milestones.map((milestone) => (
                      <div key={milestone.id} className="flex items-center gap-3 p-3 rounded-lg bg-background/50">
                        {milestone.completed ? (
                          <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                        ) : (
                          <Circle className="w-5 h-5 text-foreground-subtle flex-shrink-0" />
                        )}
                        <div className="flex-1">
                          <div className={cn(
                            "font-medium",
                            milestone.completed ? "text-foreground" : "text-foreground-subtle"
                          )}>
                            {milestone.title}
                          </div>
                          <div className="text-sm text-foreground-subtle">
                            Due: {format(parseISO(milestone.dueDate), 'MMM dd, yyyy')}
                          </div>
                        </div>
                        <Badge 
                          variant={milestone.completed ? "default" : "secondary"}
                          className="text-xs"
                        >
                          {milestone.completed ? "Complete" : "Pending"}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-border/50">
                <Button variant="outline" onClick={onClose}>
                  Close
                </Button>
                <Button style={{ backgroundColor: phaseColor }}>
                  View Details
                </Button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};