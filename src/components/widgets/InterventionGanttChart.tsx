import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Calendar, 
  ArrowRight, 
  Plus, 
  Trash2, 
  AlertTriangle,
  CheckCircle,
  Clock,
  Zap,
  GitBranch,
  Link as LinkIcon
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { toast } from '../../hooks/use-toast';
import type { EnhancedIntervention, BundleDependency } from '../../types/intervention';

interface InterventionGanttChartProps {
  interventions: EnhancedIntervention[];
  dependencies: BundleDependency[];
  onDependencyAdd?: (dependency: BundleDependency) => void;
  onDependencyRemove?: (dependencyId: string) => void;
  timelineWeeks?: number;
}

export const InterventionGanttChart: React.FC<InterventionGanttChartProps> = ({
  interventions,
  dependencies,
  onDependencyAdd,
  onDependencyRemove,
  timelineWeeks = 26 // 6 months default
}) => {
  const [selectedIntervention, setSelectedIntervention] = useState<string | null>(null);
  const [dependencyType, setDependencyType] = useState<'sequence' | 'parallel' | 'conditional'>('sequence');
  const [showDependencyCreator, setShowDependencyCreator] = useState(false);

  // Calculate intervention timelines based on complexity and dependencies
  const interventionTimelines = useMemo(() => {
    return interventions.map((intervention, index) => {
      // Base duration based on complexity and task count
      const baseDuration = intervention.complexity === 'High' ? 8 : 
                          intervention.complexity === 'Medium' ? 4 : 2;
      const taskDuration = Math.max(1, Math.ceil(intervention.microTasks.length / 4));
      const duration = Math.min(timelineWeeks, baseDuration + taskDuration);
      
      // Calculate start week based on dependencies
      let startWeek = 1;
      const dependentOn = dependencies.filter(dep => dep.toInterventionId === intervention.id);
      
      if (dependentOn.length > 0) {
        const latestDependency = dependentOn.reduce((latest, dep) => {
          const fromIntervention = interventions.find(i => i.id === dep.fromInterventionId);
          if (!fromIntervention) return latest;
          
          const fromTimeline = interventionTimelines?.find(t => t.interventionId === fromIntervention.id);
          const endWeek = fromTimeline ? fromTimeline.startWeek + fromTimeline.duration : 1;
          
          return Math.max(latest, endWeek + 1);
        }, startWeek);
        
        startWeek = latestDependency;
      }

      return {
        interventionId: intervention.id,
        name: intervention.name,
        startWeek,
        duration,
        endWeek: startWeek + duration - 1,
        complexity: intervention.complexity,
        status: intervention.status,
        criticalPath: dependencies.some(dep => 
          (dep.fromInterventionId === intervention.id || dep.toInterventionId === intervention.id) && 
          dep.criticalPath
        )
      };
    });
  }, [interventions, dependencies, timelineWeeks]);

  const createDependency = (fromId: string, toId: string) => {
    if (fromId === toId) {
      toast({
        title: "Invalid Dependency",
        description: "An intervention cannot depend on itself.",
        variant: "destructive"
      });
      return;
    }

    // Check for circular dependencies
    const wouldCreateCycle = (from: string, to: string, visited = new Set<string>()): boolean => {
      if (visited.has(from)) return true;
      visited.add(from);
      
      const childDeps = dependencies.filter(dep => dep.fromInterventionId === from);
      return childDeps.some(dep => dep.toInterventionId === to || wouldCreateCycle(dep.toInterventionId, to, visited));
    };

    if (wouldCreateCycle(toId, fromId)) {
      toast({
        title: "Circular Dependency",
        description: "This dependency would create a circular reference.",
        variant: "destructive"
      });
      return;
    }

    const newDependency: BundleDependency = {
      type: dependencyType,
      fromInterventionId: fromId,
      toInterventionId: toId,
      description: `${dependencyType} dependency`,
      criticalPath: false
    };

    onDependencyAdd?.(newDependency);
    
    toast({
      title: "Dependency Added",
      description: `${dependencyType} dependency created successfully.`
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-success';
      case 'in-execution': return 'bg-primary';
      case 'approved': return 'bg-accent';
      case 'under-review': return 'bg-warning';
      default: return 'bg-muted';
    }
  };

  const getComplexityPattern = (complexity: string) => {
    switch (complexity) {
      case 'High': return 'bg-gradient-to-r from-destructive to-destructive/80';
      case 'Medium': return 'bg-gradient-to-r from-warning to-warning/80';
      default: return 'bg-gradient-to-r from-success to-success/80';
    }
  };

  const renderGanttBar = (timeline: any) => {
    const barWidth = (timeline.duration / timelineWeeks) * 100;
    const barLeft = ((timeline.startWeek - 1) / timelineWeeks) * 100;

    return (
      <motion.div
        className="relative"
        initial={{ opacity: 0, scaleX: 0 }}
        animate={{ opacity: 1, scaleX: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div
          className={`absolute h-8 rounded-lg ${getComplexityPattern(timeline.complexity)} ${
            timeline.criticalPath ? 'ring-2 ring-destructive' : ''
          } flex items-center px-2 shadow-lg`}
          style={{
            left: `${barLeft}%`,
            width: `${barWidth}%`,
            minWidth: '60px'
          }}
        >
          <span className="text-xs font-medium text-white truncate">
            {timeline.name}
          </span>
          {timeline.criticalPath && (
            <Zap className="h-3 w-3 text-yellow-300 ml-1" />
          )}
        </div>
      </motion.div>
    );
  };

  const renderDependencyArrows = () => {
    return dependencies.map((dep, index) => {
      const fromTimeline = interventionTimelines.find(t => t.interventionId === dep.fromInterventionId);
      const toTimeline = interventionTimelines.find(t => t.interventionId === dep.toInterventionId);
      
      if (!fromTimeline || !toTimeline) return null;

      const fromIndex = interventionTimelines.indexOf(fromTimeline);
      const toIndex = interventionTimelines.indexOf(toTimeline);
      
      return (
        <motion.div
          key={`${dep.fromInterventionId}-${dep.toInterventionId}-${index}`}
          className="absolute pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <svg
            className="absolute"
            style={{
              top: `${fromIndex * 60 + 40}px`,
              left: 0,
              width: '100%',
              height: `${Math.abs(toIndex - fromIndex) * 60 + 20}px`,
              zIndex: 1
            }}
          >
            <defs>
              <marker
                id={`arrowhead-${index}`}
                markerWidth="10"
                markerHeight="7"
                refX="10"
                refY="3.5"
                orient="auto"
              >
                <polygon
                  points="0 0, 10 3.5, 0 7"
                  fill={dep.criticalPath ? '#ef4444' : '#64748b'}
                />
              </marker>
            </defs>
            <path
              d={`M ${((fromTimeline.endWeek) / timelineWeeks) * 100}% 10 
                  Q ${((fromTimeline.endWeek + toTimeline.startWeek) / 2 / timelineWeeks) * 100}% ${(toIndex - fromIndex) * 30 + 10}
                  ${((toTimeline.startWeek - 1) / timelineWeeks) * 100}% ${(toIndex - fromIndex) * 60 + 10}`}
              stroke={dep.criticalPath ? '#ef4444' : '#64748b'}
              strokeWidth="2"
              fill="none"
              markerEnd={`url(#arrowhead-${index})`}
              className={dep.type === 'conditional' ? 'stroke-dashed' : ''}
            />
          </svg>
        </motion.div>
      );
    });
  };

  return (
    <Card className="glass-secondary border-border-subtle">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Intervention Timeline
          </span>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowDependencyCreator(!showDependencyCreator)}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Add Dependency
            </Button>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Dependency Creator */}
        <AnimatePresence>
          {showDependencyCreator && (
            <motion.div
              className="glass rounded-lg p-4 border border-border-subtle"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="grid grid-cols-4 gap-4 items-end">
                <div>
                  <Label>From Intervention</Label>
                  <Select value={selectedIntervention || ''} onValueChange={setSelectedIntervention}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select intervention" />
                    </SelectTrigger>
                    <SelectContent>
                      {interventions.map((intervention) => (
                        <SelectItem key={intervention.id} value={intervention.id}>
                          {intervention.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>To Intervention</Label>
                  <Select onValueChange={(toId) => selectedIntervention && createDependency(selectedIntervention, toId)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select target" />
                    </SelectTrigger>
                    <SelectContent>
                      {interventions
                        .filter(i => i.id !== selectedIntervention)
                        .map((intervention) => (
                        <SelectItem key={intervention.id} value={intervention.id}>
                          {intervention.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Dependency Type</Label>
                  <Select value={dependencyType} onValueChange={(value: any) => setDependencyType(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sequence">Sequential</SelectItem>
                      <SelectItem value="parallel">Parallel</SelectItem>
                      <SelectItem value="conditional">Conditional</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setShowDependencyCreator(false)}
                >
                  Done
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Timeline Headers */}
        <div className="flex items-center justify-between mb-4">
          <div className="w-48 font-medium text-foreground">Interventions</div>
          <div className="flex-1 grid grid-cols-26 gap-px text-xs text-muted-foreground">
            {Array.from({ length: timelineWeeks }, (_, i) => (
              <div key={i} className="text-center">
                W{i + 1}
              </div>
            ))}
          </div>
        </div>

        {/* Gantt Chart */}
        <div className="relative">
          {interventionTimelines.map((timeline, index) => (
            <motion.div
              key={timeline.interventionId}
              className="flex items-center mb-4 relative"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              {/* Intervention Info */}
              <div className="w-48 pr-4">
                <div className="flex items-center gap-2">
                  <span className="font-medium text-foreground">{timeline.name}</span>
                  {timeline.criticalPath && (
                    <Badge variant="destructive" className="text-xs">
                      Critical
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">
                    {timeline.complexity}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {timeline.duration}w
                  </span>
                </div>
              </div>

              {/* Gantt Bar Container */}
              <div className="flex-1 relative h-10 bg-muted/20 rounded">
                {renderGanttBar(timeline)}
              </div>
            </motion.div>
          ))}

          {/* Dependency Arrows */}
          {renderDependencyArrows()}
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 pt-4 border-t border-border-subtle">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-success to-success/80 rounded" />
            <span className="text-xs text-muted-foreground">Low Complexity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-warning to-warning/80 rounded" />
            <span className="text-xs text-muted-foreground">Medium Complexity</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-gradient-to-r from-destructive to-destructive/80 rounded" />
            <span className="text-xs text-muted-foreground">High Complexity</span>
          </div>
          <div className="flex items-center gap-2">
            <Zap className="h-4 w-4 text-yellow-300" />
            <span className="text-xs text-muted-foreground">Critical Path</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InterventionGanttChart;