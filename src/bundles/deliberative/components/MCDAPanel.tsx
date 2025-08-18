import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';
import { BarChart3, TrendingUp, RotateCcw, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import type { MCDAWeights, MCDAResult } from '@/hooks/useDeliberativeBundle';

interface MCDAPanelProps {
  weights: MCDAWeights;
  onWeightsChange: (weights: MCDAWeights) => void;
  result?: MCDAResult;
  onRunAnalysis: () => void;
  isRunning?: boolean;
  optionCount: number;
}

export const MCDAPanel: React.FC<MCDAPanelProps> = ({
  weights,
  onWeightsChange,
  result,
  onRunAnalysis,
  isRunning = false,
  optionCount
}) => {
  const [sensitivityMode, setSensitivityMode] = useState(false);

  const criteriaLabels = {
    impact: 'Impact',
    cost: 'Cost Efficiency', 
    effort: 'Effort Feasibility',
    time: 'Time Efficiency',
    risk: 'Risk Mitigation'
  };

  const handleWeightChange = (criterion: keyof MCDAWeights, value: number[]) => {
    const newWeight = value[0] / 100;
    const currentTotal = Object.values(weights).reduce((sum, w) => sum + w, 0);
    const otherTotal = currentTotal - weights[criterion];
    
    // Redistribute remaining weight proportionally
    const remainingWeight = 1 - newWeight;
    const redistributionFactor = remainingWeight / otherTotal;
    
    const newWeights = { ...weights };
    Object.keys(newWeights).forEach(key => {
      if (key !== criterion) {
        newWeights[key as keyof MCDAWeights] *= redistributionFactor;
      }
    });
    newWeights[criterion] = newWeight;
    
    onWeightsChange(newWeights);
  };

  const resetToDefaults = () => {
    onWeightsChange({
      impact: 0.3,
      cost: 0.2,
      effort: 0.2,
      time: 0.15,
      risk: 0.15
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 0.7) return 'text-green-600';
    if (score >= 0.5) return 'text-blue-600';
    if (score >= 0.3) return 'text-orange-600';
    return 'text-red-600';
  };

  const getBarColor = (score: number) => {
    if (score >= 0.7) return 'bg-green-500';
    if (score >= 0.5) return 'bg-blue-500';
    if (score >= 0.3) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-primary" />
            MCDA Analysis
            <Badge variant="outline">{optionCount} Options</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Criteria Weights */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Criteria Weights</h4>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSensitivityMode(!sensitivityMode)}
                  className="flex items-center gap-2"
                >
                  <TrendingUp className="w-4 h-4" />
                  {sensitivityMode ? 'Exit' : 'Sensitivity'}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetToDefaults}
                  className="flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  Reset
                </Button>
              </div>
            </div>

            {Object.entries(weights).map(([criterion, weight]) => (
              <div key={criterion} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">{criteriaLabels[criterion as keyof MCDAWeights]}</Label>
                  <span className="text-sm font-mono">{Math.round(weight * 100)}%</span>
                </div>
                <Slider
                  value={[weight * 100]}
                  onValueChange={(value) => handleWeightChange(criterion as keyof MCDAWeights, value)}
                  max={100}
                  step={5}
                  className="w-full"
                />
              </div>
            ))}

            {/* Weight validation */}
            <div className="text-xs text-muted-foreground">
              Total: {Math.round(Object.values(weights).reduce((sum, w) => sum + w, 0) * 100)}%
              {Math.abs(Object.values(weights).reduce((sum, w) => sum + w, 0) - 1) > 0.01 && (
                <span className="text-orange-600 ml-2">⚠ Weights should sum to 100%</span>
              )}
            </div>
          </div>

          <Separator />

          {/* Run Analysis */}
          <div className="space-y-4">
            <Button
              onClick={onRunAnalysis}
              disabled={isRunning || optionCount === 0}
              className="w-full flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              {isRunning ? 'Running Analysis...' : 'Run MCDA Analysis'}
            </Button>

            {optionCount === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                Add options to run analysis
              </p>
            )}
          </div>

          {/* Results */}
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-4"
            >
              <Separator />
              
              <div className="space-y-4">
                <h4 className="font-medium flex items-center gap-2">
                  Results
                  <Badge variant="secondary">
                    {new Date(result.analyzed_at).toLocaleTimeString()}
                  </Badge>
                </h4>

                <div className="space-y-3">
                  {result.scores
                    .sort((a, b) => b.weighted_score - a.weighted_score)
                    .map((score, index) => (
                      <motion.div
                        key={score.option_id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="p-3 bg-muted/50 rounded-lg space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Badge variant={index === 0 ? "default" : "outline"}>
                              #{index + 1}
                            </Badge>
                            <span className="font-medium">{score.name}</span>
                            <Badge variant="outline" className="text-xs">
                              {score.lever}
                            </Badge>
                          </div>
                          <span className={`font-mono font-semibold ${getScoreColor(score.weighted_score)}`}>
                            {(score.weighted_score * 100).toFixed(1)}%
                          </span>
                        </div>

                        <div className="space-y-1">
                          <Progress 
                            value={score.weighted_score * 100} 
                            className="h-2"
                          />
                          <div className="text-xs text-muted-foreground">
                            {score.actor}
                          </div>
                        </div>

                        {sensitivityMode && (
                          <div className="grid grid-cols-5 gap-2 text-xs">
                            {Object.entries(score.raw_scores).map(([key, value]) => (
                              <div key={key} className="text-center">
                                <div className="font-mono">{(value * 100).toFixed(0)}%</div>
                                <div className="text-muted-foreground capitalize">
                                  {key.replace('_norm', '')}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </motion.div>
                    ))}
                </div>

                {/* Pareto frontier note */}
                {result.scores.length > 1 && (
                  <div className="text-xs text-muted-foreground bg-blue-50 dark:bg-blue-950/20 p-3 rounded">
                    <strong>Analysis Note:</strong> Top-ranked option shows best weighted performance. 
                    Consider trade-offs between criteria for final selection.
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};