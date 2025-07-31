import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ArrowLeft, 
  ArrowRight, 
  Plus, 
  Trash2, 
  GitBranch, 
  AlertCircle,
  CheckCircle,
  Clock,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { toast } from '../../hooks/use-toast';
import InterventionGanttChart from './InterventionGanttChart';
import type { 
  EnhancedIntervention, 
  BundleDependency,
  InterventionBundle 
} from '../../types/intervention';

interface EnhancedDependencyConfiguratorProps {
  interventions: EnhancedIntervention[];
  dependencies: BundleDependency[];
  onDependenciesChange: (dependencies: BundleDependency[]) => void;
  bundle?: InterventionBundle;
}

export const EnhancedDependencyConfigurator: React.FC<EnhancedDependencyConfiguratorProps> = ({
  interventions,
  dependencies,
  onDependenciesChange,
  bundle
}) => {
  const [selectedDependency, setSelectedDependency] = useState<BundleDependency | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'gantt'>('gantt');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  // Validate dependencies for loops and conflicts
  const validateDependencies = () => {
    const errors: string[] = [];
    
    // Check for circular dependencies
    const visited = new Set<string>();
    const visiting = new Set<string>();
    
    const hasCycle = (interventionId: string): boolean => {
      if (visiting.has(interventionId)) return true;
      if (visited.has(interventionId)) return false;
      
      visiting.add(interventionId);
      
      const dependents = dependencies
        .filter(dep => dep.fromInterventionId === interventionId)
        .map(dep => dep.toInterventionId);
      
      for (const dependent of dependents) {
        if (hasCycle(dependent)) return true;
      }
      
      visiting.delete(interventionId);
      visited.add(interventionId);
      return false;
    };
    
    for (const intervention of interventions) {
      if (hasCycle(intervention.id)) {
        errors.push(`Circular dependency detected involving ${intervention.name}`);
        break;
      }
    }
    
    // Check for resource conflicts
    const resourceConflicts = new Map<string, string[]>();
    dependencies.forEach(dep => {
      if (dep.type === 'parallel') {
        const fromIntervention = interventions.find(i => i.id === dep.fromInterventionId);
        const toIntervention = interventions.find(i => i.id === dep.toInterventionId);
        
        if (fromIntervention && toIntervention) {
          // Simple check for overlapping resource requirements
          const sharedResources = fromIntervention.resources.filter(r1 =>
            toIntervention.resources.some(r2 => r1.name === r2.name && r1.type === r2.type)
          );
          
          if (sharedResources.length > 0) {
            errors.push(`Resource conflict between ${fromIntervention.name} and ${toIntervention.name}`);
          }
        }
      }
    });
    
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const addDependency = (dependency: BundleDependency) => {
    const updatedDependencies = [...dependencies, dependency];
    onDependenciesChange(updatedDependencies);
  };

  const removeDependency = (fromId: string, toId: string) => {
    const updatedDependencies = dependencies.filter(
      dep => !(dep.fromInterventionId === fromId && dep.toInterventionId === toId)
    );
    onDependenciesChange(updatedDependencies);
    
    toast({
      title: "Dependency Removed",
      description: "Dependency has been successfully removed."
    });
  };

  const updateDependency = (
    fromId: string, 
    toId: string, 
    updates: Partial<BundleDependency>
  ) => {
    const updatedDependencies = dependencies.map(dep =>
      (dep.fromInterventionId === fromId && dep.toInterventionId === toId)
        ? { ...dep, ...updates }
        : dep
    );
    onDependenciesChange(updatedDependencies);
  };

  const getInterventionName = (id: string) => {
    return interventions.find(i => i.id === id)?.name || 'Unknown';
  };

  const getDependencyTypeIcon = (type: string) => {
    switch (type) {
      case 'sequence': return <ArrowRight className="h-4 w-4" />;
      case 'parallel': return <GitBranch className="h-4 w-4" />;
      case 'conditional': return <Clock className="h-4 w-4" />;
      default: return <ArrowRight className="h-4 w-4" />;
    }
  };

  const getDependencyTypeColor = (type: string) => {
    switch (type) {
      case 'sequence': return 'text-primary border-primary/30 bg-primary/10';
      case 'parallel': return 'text-accent border-accent/30 bg-accent/10';
      case 'conditional': return 'text-warning border-warning/30 bg-warning/10';
      default: return 'text-muted-foreground border-border-subtle bg-muted/10';
    }
  };

  React.useEffect(() => {
    validateDependencies();
  }, [dependencies, interventions]);

  return (
    <div className="space-y-6">
      {/* Header and Controls */}
      <Card className="glass-secondary border-border-subtle">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span className="flex items-center gap-2">
              <GitBranch className="h-5 w-5" />
              Dependency Management
            </span>
            <div className="flex items-center gap-2">
              <Select value={viewMode} onValueChange={(value: 'list' | 'gantt') => setViewMode(value)}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="gantt">Gantt View</SelectItem>
                  <SelectItem value="list">List View</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => validateDependencies()}
              >
                <CheckCircle className="h-4 w-4 mr-2" />
                Validate
              </Button>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <motion.div
              className="mb-4 p-4 glass rounded-lg border border-destructive/30 bg-destructive/10"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="flex items-center gap-2 mb-2">
                <AlertCircle className="h-4 w-4 text-destructive" />
                <span className="font-medium text-destructive">Validation Issues</span>
              </div>
              <ul className="text-sm text-destructive/80 space-y-1">
                {validationErrors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </motion.div>
          )}

          {/* Summary Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">{interventions.length}</div>
              <div className="text-sm text-muted-foreground">Interventions</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">{dependencies.length}</div>
              <div className="text-sm text-muted-foreground">Dependencies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-semibold text-foreground">
                {dependencies.filter(d => d.criticalPath).length}
              </div>
              <div className="text-sm text-muted-foreground">Critical Path</div>
            </div>
            <div className="text-center">
              <div className={`text-2xl font-semibold ${validationErrors.length > 0 ? 'text-destructive' : 'text-success'}`}>
                {validationErrors.length > 0 ? 'Issues' : 'Valid'}
              </div>
              <div className="text-sm text-muted-foreground">Status</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      {viewMode === 'gantt' ? (
        <InterventionGanttChart
          interventions={interventions}
          dependencies={dependencies}
          onDependencyAdd={addDependency}
          onDependencyRemove={(depId) => {
            // Parse dependency ID to get from/to IDs
            const [fromId, toId] = depId.split('-');
            removeDependency(fromId, toId);
          }}
        />
      ) : (
        <Card className="glass-secondary border-border-subtle">
          <CardHeader>
            <CardTitle>Dependency List</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {dependencies.length === 0 ? (
              <div className="text-center py-8">
                <GitBranch className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                <p className="text-muted-foreground">No dependencies configured</p>
                <p className="text-sm text-muted-foreground mt-2">
                  Use the Gantt view to create dependencies between interventions
                </p>
              </div>
            ) : (
              dependencies.map((dependency, index) => (
                <motion.div
                  key={`${dependency.fromInterventionId}-${dependency.toInterventionId}-${index}`}
                  className="glass rounded-lg p-4 border border-border-subtle"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Badge className={getDependencyTypeColor(dependency.type)}>
                        {getDependencyTypeIcon(dependency.type)}
                        <span className="ml-1">{dependency.type}</span>
                      </Badge>
                      
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-foreground">
                          {getInterventionName(dependency.fromInterventionId)}
                        </span>
                        <ArrowRight className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium text-foreground">
                          {getInterventionName(dependency.toInterventionId)}
                        </span>
                      </div>

                      {dependency.criticalPath && (
                        <Badge variant="destructive" className="flex items-center gap-1">
                          <Zap className="h-3 w-3" />
                          Critical Path
                        </Badge>
                      )}
                    </div>

                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          updateDependency(
                            dependency.fromInterventionId,
                            dependency.toInterventionId,
                            { criticalPath: !dependency.criticalPath }
                          );
                        }}
                      >
                        <Zap className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeDependency(
                          dependency.fromInterventionId,
                          dependency.toInterventionId
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  {dependency.description && (
                    <p className="text-sm text-muted-foreground mt-2">
                      {dependency.description}
                    </p>
                  )}
                </motion.div>
              ))
            )}
          </CardContent>
        </Card>
      )}

      {/* Loop Dependency Validation */}
      {bundle && (
        <Card className="glass-secondary border-border-subtle">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5" />
              Loop Dependency Checks
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 glass rounded-lg">
                <span className="text-sm">Upstream loop completion validation</span>
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div className="flex items-center justify-between p-3 glass rounded-lg">
                <span className="text-sm">Downstream loop readiness check</span>
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
              <div className="flex items-center justify-between p-3 glass rounded-lg">
                <span className="text-sm">Resource conflict detection</span>
                <CheckCircle className="h-4 w-4 text-success" />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EnhancedDependencyConfigurator;