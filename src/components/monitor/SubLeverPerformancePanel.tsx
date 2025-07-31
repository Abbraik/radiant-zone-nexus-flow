import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Target, 
  Activity, 
  RefreshCw,
  ChevronRight,
  Info,
  AlertTriangle,
  CheckCircle2,
  Settings
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { useSubLeverMetrics } from '../../hooks/useSubLeverMetrics';
import { SubLever, PerformanceMetric } from '../../types/analytics';

interface SubLeverPerformancePanelProps {
  bundleId?: string;
  onAdjustParameters?: (subLeverId: string) => void;
  onCreateCorrectiveTask?: (subLever: SubLever, gap: number) => void;
}

const ImpactTrendIcon = ({ trend }: { trend: 'improving' | 'declining' | 'stable' }) => {
  const iconProps = "w-4 h-4";
  
  switch (trend) {
    case 'improving':
      return <TrendingUp className={`${iconProps} text-green-400`} />;
    case 'declining':
      return <TrendingDown className={`${iconProps} text-red-400`} />;
    default:
      return <Minus className={`${iconProps} text-gray-400`} />;
  }
};

const PerformanceGauge: React.FC<{
  current: number;
  target: number;
  projected: number;
  confidence: number;
}> = ({ current, target, projected, confidence }) => {
  const currentPercent = (current / target) * 100;
  const projectedPercent = (projected / target) * 100;
  
  const getStatusColor = () => {
    if (currentPercent >= 95) return 'text-green-400';
    if (currentPercent >= 80) return 'text-yellow-400';
    return 'text-red-400';
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-sm">
        <span className="text-gray-400">Current vs Target</span>
        <span className={`font-medium ${getStatusColor()}`}>
          {current.toFixed(1)} / {target.toFixed(1)}
        </span>
      </div>
      
      <div className="space-y-2">
        <Progress value={currentPercent} className="h-2" />
        <div className="flex justify-between text-xs text-gray-400">
          <span>Current: {currentPercent.toFixed(0)}%</span>
          <span>Projected: {projectedPercent.toFixed(0)}%</span>
        </div>
      </div>
      
      <div className="flex items-center gap-2 text-xs">
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-blue-400"></div>
          <span className="text-gray-400">Confidence: {confidence}%</span>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  metric: PerformanceMetric;
  compact?: boolean;
}> = ({ metric, compact = false }) => {
  const performancePercent = (metric.value / metric.target) * 100;
  const isOnTarget = performancePercent >= 95;
  const isAtRisk = performancePercent < 80;

  return (
    <motion.div
      className={`p-3 bg-white/5 rounded-lg border border-white/10 ${compact ? 'space-y-2' : 'space-y-3'}`}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex items-center justify-between">
        <h4 className="text-white font-medium text-sm">{metric.metricName}</h4>
        <div className="flex items-center gap-1">
          <ImpactTrendIcon trend={metric.trend} />
          {isOnTarget && <CheckCircle2 className="w-3 h-3 text-green-400" />}
          {isAtRisk && <AlertTriangle className="w-3 h-3 text-red-400" />}
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <span className="text-2xl font-bold text-white">
          {metric.value.toFixed(1)}
          <span className="text-sm text-gray-400 ml-1">{metric.unit}</span>
        </span>
        <span className="text-sm text-gray-400">
          Target: {metric.target}{metric.unit}
        </span>
      </div>
      
      {!compact && metric.benchmarkComparison && (
        <div className="space-y-1">
          <div className="text-xs text-gray-400">Benchmarks:</div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <div className="text-center">
              <div className="text-gray-400">Industry</div>
              <div className="text-white font-medium">{metric.benchmarkComparison.industry}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Best Practice</div>
              <div className="text-green-400 font-medium">{metric.benchmarkComparison.bestPractice}</div>
            </div>
            <div className="text-center">
              <div className="text-gray-400">Internal</div>
              <div className="text-blue-400 font-medium">{metric.benchmarkComparison.internal}</div>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export const SubLeverPerformancePanel: React.FC<SubLeverPerformancePanelProps> = ({
  bundleId,
  onAdjustParameters,
  onCreateCorrectiveTask,
}) => {
  const {
    subLevers,
    selectedSubLever,
    performanceMetrics,
    isLoading,
    refreshData,
    selectSubLever,
    getMetricsForSubLever,
    calculatePerformanceGap,
    getImpactTrend,
  } = useSubLeverMetrics(bundleId);

  const [expandedSubLever, setExpandedSubLever] = useState<string | null>(null);

  const handleSubLeverClick = (subLever: SubLever) => {
    selectSubLever(subLever);
    setExpandedSubLever(expandedSubLever === subLever.id ? null : subLever.id);
  };

  const handleCreateCorrectiveTask = (subLever: SubLever) => {
    const gap = calculatePerformanceGap(subLever);
    onCreateCorrectiveTask?.(subLever, gap);
  };

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10 space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="w-6 h-6 text-blue-400" />
          <div>
            <h3 className="text-xl font-semibold text-white">Sub-Lever Performance</h3>
            <p className="text-gray-400 text-sm">Real-time impact measurement vs forecasts</p>
          </div>
        </div>
        
        <Button
          size="sm"
          variant="outline"
          onClick={refreshData}
          disabled={isLoading}
          className="border-white/30 text-white"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      {subLevers.length === 0 ? (
        <div className="text-center py-8">
          <Info className="w-8 h-8 text-gray-400 mx-auto mb-2" />
          <h4 className="text-white font-medium">No Sub-Levers Selected</h4>
          <p className="text-gray-400 text-sm">
            Select a bundle or intervention to view sub-lever performance metrics
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {subLevers.map((subLever) => {
            const gap = calculatePerformanceGap(subLever);
            const trend = getImpactTrend(subLever);
            const metrics = getMetricsForSubLever(subLever.id);
            const isExpanded = expandedSubLever === subLever.id;
            
            return (
              <motion.div
                key={subLever.id}
                className="border border-white/10 rounded-lg overflow-hidden"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <button
                  onClick={() => handleSubLeverClick(subLever)}
                  className="w-full p-4 bg-white/5 hover:bg-white/10 transition-colors text-left"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className="text-blue-400 border-blue-400/30 capitalize"
                      >
                        {subLever.category}
                      </Badge>
                      <h4 className="text-white font-medium">{subLever.name}</h4>
                      <ImpactTrendIcon trend={trend} />
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-white font-medium">
                          {subLever.currentImpact.toFixed(1)}%
                        </div>
                        <div className="text-xs text-gray-400">
                          Gap: {gap > 0 ? `+${gap.toFixed(1)}` : gap.toFixed(1)}%
                        </div>
                      </div>
                      <ChevronRight 
                        className={`w-5 h-5 text-gray-400 transition-transform ${
                          isExpanded ? 'rotate-90' : ''
                        }`} 
                      />
                    </div>
                  </div>
                </button>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="p-4 space-y-4 bg-white/5">
                        {/* Performance Overview */}
                        <PerformanceGauge
                          current={subLever.currentImpact}
                          target={subLever.targetImpact}
                          projected={subLever.projectedImpact}
                          confidence={subLever.confidenceLevel}
                        />

                        {/* Key Metrics */}
                        {metrics.length > 0 && (
                          <div className="space-y-3">
                            <h5 className="text-white font-medium">Key Indicators</h5>
                            <div className="grid gap-3">
                              {metrics.map((metric) => (
                                <MetricCard key={metric.id} metric={metric} compact />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => onAdjustParameters?.(subLever.id)}
                            className="border-blue-500/30 text-blue-400 hover:bg-blue-500/10"
                          >
                            <Settings className="w-3 h-3 mr-1" />
                            Adjust Parameters
                          </Button>
                          
                          {gap > 5 && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleCreateCorrectiveTask(subLever)}
                              className="border-orange-500/30 text-orange-400 hover:bg-orange-500/10"
                            >
                              <Activity className="w-3 h-3 mr-1" />
                              Create Corrective Task
                            </Button>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      )}
    </Card>
  );
};