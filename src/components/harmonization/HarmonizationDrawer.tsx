// Harmonization Drawer - Conflict detection and resolution UI
import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetDescription 
} from '@/components/ui/sheet';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import {
  Network,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  Users,
  MapPin,
  Eye,
  Zap
} from 'lucide-react';
import { useHarmonization } from '@/hooks/useHarmonization';
import { HarmonizationService, type HarmonizationContext, type ConflictSuggestion } from '@/lib/harmonization/service';

interface HarmonizationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  taskId?: string;
  context?: HarmonizationContext;
}

export const HarmonizationDrawer: React.FC<HarmonizationDrawerProps> = ({
  isOpen,
  onClose,
  taskId,
  context
}) => {
  const {
    conflicts,
    allocationSummary,
    isExpertMode,
    setIsExpertMode,
    evaluateHarmonization,
    applySuggestion,
    resolveConflict,
    isEvaluating,
    isApplying,
    getRiskColor
  } = useHarmonization(taskId);

  const [currentResult, setCurrentResult] = useState<any>(null);
  const [selectedSuggestion, setSelectedSuggestion] = useState<ConflictSuggestion | null>(null);

  // Get task-specific conflicts
  const taskConflicts = useMemo(() => {
    if (!taskId) return [];
    return conflicts.filter(conflict => conflict.tasks.includes(taskId));
  }, [conflicts, taskId]);

  // Evaluate harmonization if context provided
  const handleEvaluate = () => {
    if (!context) return;
    
    const result = evaluateHarmonization(context);
    setCurrentResult(result);
  };

  const handleApplySuggestion = (suggestion: ConflictSuggestion) => {
    if (!context) return;
    
    applySuggestion({ context, suggestion });
    setSelectedSuggestion(suggestion);
  };

  const renderRiskMeter = (riskScore: number, level: string) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-300">Risk Level</span>
        <Badge 
          variant="outline" 
          className={`${getRiskColor(level as any)} border-current`}
        >
          {level}
        </Badge>
      </div>
      
      <div className="relative">
        <Progress value={riskScore * 100} className="h-2" />
        <div className="flex justify-between text-xs text-gray-400 mt-1">
          <span>CLEAR</span>
          <span>TENSION</span>
          <span>CONFLICT</span>
        </div>
        
        {/* Risk thresholds */}
        <div className="absolute top-0 left-1/2 w-px h-2 bg-yellow-500/50" />
        <div className="absolute top-0 left-3/4 w-px h-2 bg-red-500/50" />
      </div>
      
      <div className="text-xs text-gray-400">
        Risk Score: {(riskScore * 100).toFixed(1)}%
      </div>
    </div>
  );

  const renderHubStrip = () => {
    if (!context) return null;
    
    return (
      <Card className="bg-glass/20 backdrop-blur-10 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Network className="h-4 w-4" />
            SNL Hubs
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 flex-wrap">
            {context.task.hubAllocations.map((alloc, index) => {
              const isConflicted = taskConflicts.some(c => c.snl_id === alloc.snlId);
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-1 px-2 py-1 rounded text-xs ${
                    isConflicted 
                      ? 'bg-red-500/20 border border-red-500/30 text-red-300'
                      : 'bg-blue-500/20 border border-blue-500/30 text-blue-300'
                  }`}
                >
                  <Network className="h-3 w-3" />
                  <span className="font-mono">{alloc.snlId}</span>
                  <span>{(alloc.allocPct * 100).toFixed(0)}%</span>
                  {alloc.region && (
                    <>
                      <Separator orientation="vertical" className="h-3" />
                      <MapPin className="h-2 w-2" />
                      <span>{alloc.region}</span>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderOverlapTimeline = () => {
    if (!context || !currentResult) return null;
    
    return (
      <Card className="bg-glass/20 backdrop-blur-10 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Clock className="h-4 w-4" />
            Timeline Overlap
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {/* Current task timeline */}
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs">
                <div className="w-3 h-3 bg-blue-500 rounded" />
                <span className="text-blue-300">Your Task</span>
                <Badge variant="outline" className="text-xs">
                  {new Date(context.task.timeWindow.start).toLocaleDateString()} - 
                  {new Date(context.task.timeWindow.end).toLocaleDateString()}
                </Badge>
              </div>
            </div>
            
            {/* Conflicting tasks */}
            {currentResult.conflictingTasks.slice(0, 3).map((conflictTaskId: string, index: number) => (
              <div key={conflictTaskId} className="space-y-1">
                <div className="flex items-center gap-2 text-xs">
                  <div className="w-3 h-3 bg-red-500/60 rounded" />
                  <span className="text-red-300">Task {conflictTaskId.slice(-6)}</span>
                  <Badge variant="outline" className="text-xs text-red-300 border-red-500/30">
                    Overlap Detected
                  </Badge>
                </div>
              </div>
            ))}
            
            {currentResult.conflictingTasks.length > 3 && (
              <div className="text-xs text-gray-400">
                +{currentResult.conflictingTasks.length - 3} more conflicts
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    );
  };

  const renderSuggestions = () => {
    if (!currentResult?.suggestions.length) return null;
    
    return (
      <Card className="bg-glass/20 backdrop-blur-10 border-white/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-white flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Suggested Actions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {currentResult.suggestions.map((suggestion: ConflictSuggestion, index: number) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={`p-3 rounded border ${
                selectedSuggestion === suggestion
                  ? 'border-blue-500/50 bg-blue-500/10'
                  : 'border-white/10 bg-white/5 hover:bg-white/10'
              } transition-all cursor-pointer`}
              onClick={() => setSelectedSuggestion(suggestion)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-medium text-white">
                      {suggestion.title}
                    </span>
                    <Badge variant="outline" className="text-xs">
                      -{(suggestion.riskReduction * 100).toFixed(0)}% risk
                    </Badge>
                  </div>
                  <p className="text-xs text-gray-300">
                    {suggestion.description}
                  </p>
                  
                  {/* Adjustment details */}
                  <div className="mt-2 text-xs text-blue-300">
                    {suggestion.adjustment.timeShiftDays && 
                      `Shift: +${suggestion.adjustment.timeShiftDays} days`}
                    {suggestion.adjustment.scopeReductionPct && 
                      `Scope: -${(suggestion.adjustment.scopeReductionPct * 100).toFixed(0)}%`}
                    {suggestion.adjustment.deltaThrottlePct && 
                      `Throttle: -${(suggestion.adjustment.deltaThrottlePct * 100).toFixed(0)}%`}
                    {suggestion.adjustment.meshTaskIds && 
                      `Mesh: ${suggestion.adjustment.meshTaskIds.length} tasks`}
                  </div>
                </div>
                
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleApplySuggestion(suggestion);
                  }}
                  disabled={isApplying}
                  className="ml-2"
                >
                  {isApplying && selectedSuggestion === suggestion ? 'Applying...' : 'Apply'}
                </Button>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    );
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[600px] bg-gray-900/95 backdrop-blur-20 border-white/10">
        <SheetHeader className="pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-white">Harmonization Analysis</SheetTitle>
            <div className="flex items-center gap-2">
              <Switch 
                checked={isExpertMode}
                onCheckedChange={setIsExpertMode}
              />
              <Eye className="h-4 w-4 text-gray-400" />
            </div>
          </div>
          <SheetDescription className="text-gray-300">
            Detect and resolve conflicts on shared resource hubs
          </SheetDescription>
        </SheetHeader>

        <div className="space-y-6 pb-6">
          {/* Risk Assessment */}
          {currentResult && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="bg-glass/30 backdrop-blur-20 border-white/10">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm text-white flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Risk Assessment
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {renderRiskMeter(currentResult.riskScore, currentResult.level)}
                  
                  <div className="mt-3 p-2 bg-white/5 rounded text-xs text-gray-300">
                    {currentResult.reason}
                  </div>
                  
                  {isExpertMode && (
                    <div className="mt-2 text-xs text-gray-400">
                      Evaluation: {currentResult.evaluationMs}ms
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Hub Strip */}
          {renderHubStrip()}

          {/* Overlap Timeline */}
          {renderOverlapTimeline()}

          {/* Suggestions */}
          {renderSuggestions()}

          {/* Active Conflicts */}
          {taskConflicts.length > 0 && (
            <Card className="bg-glass/20 backdrop-blur-10 border-white/10">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-white flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-400" />
                  Active Conflicts ({taskConflicts.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {taskConflicts.map((conflict) => (
                  <div
                    key={conflict.conflict_id}
                    className="p-2 bg-red-500/10 border border-red-500/20 rounded"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="text-sm text-red-300 mb-1">
                          Hub: {conflict.snl_id}
                        </div>
                        <div className="text-xs text-gray-300">
                          {conflict.reason}
                        </div>
                        <div className="text-xs text-blue-300 mt-1">
                          {conflict.recommendation}
                        </div>
                      </div>
                      
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveConflict({ 
                          conflictId: conflict.conflict_id, 
                          resolution: 'manual' 
                        })}
                        className="text-xs"
                      >
                        Resolve
                      </Button>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Actions */}
          <div className="flex gap-2">
            <Button 
              onClick={handleEvaluate}
              disabled={!context || isEvaluating}
              className="flex-1"
            >
              {isEvaluating ? 'Evaluating...' : 'Evaluate Harmonization'}
            </Button>
            
            {currentResult && currentResult.level !== 'CLEAR' && (
              <Button 
                variant="outline"
                onClick={onClose}
              >
                Review Later
              </Button>
            )}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};