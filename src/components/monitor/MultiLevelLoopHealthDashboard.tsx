import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { 
  Globe, 
  Building2, 
  Settings, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle,
  ChevronDown,
  ChevronRight
} from 'lucide-react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { EnhancedLoop, LoopLayer, LayerMetrics } from '../../types/monitor';

interface MultiLevelLoopHealthDashboardProps {
  loops?: EnhancedLoop[];
  onLoopSelect?: (loop: EnhancedLoop) => void;
  onLayerToggle?: (layer: LoopLayer) => void;
}

// Mock data for enhanced loops with multi-level architecture
const mockEnhancedLoops: EnhancedLoop[] = [
  // Macro Loops
  {
    id: 'macro-1',
    name: 'Population & Development',
    layer: 'macro',
    type: 'reinforcing',
    triScore: 7.8,
    deBand: 'green',
    srtHorizon: 52,
    trend: [7.2, 7.4, 7.6, 7.8, 7.8],
    status: 'healthy',
    lastCheck: '2 hours ago',
    nextCheck: '4 hours',
    layerData: {
      leveragePoints: ['Education Access', 'Healthcare Infrastructure', 'Economic Mobility'],
      systemScope: 'population',
      policyImpact: 85,
      stakeholderCount: 12000,
    },
    alertThresholds: { triLower: 6.0, triUpper: 9.0, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'macro-2',
    name: 'Environmental Quality',
    layer: 'macro',
    type: 'balancing',
    triScore: 6.2,
    deBand: 'yellow',
    srtHorizon: 26,
    trend: [6.8, 6.5, 6.3, 6.1, 6.2],
    status: 'warning',
    lastCheck: '1 hour ago',
    nextCheck: '3 hours',
    layerData: {
      leveragePoints: ['Carbon Pricing', 'Green Infrastructure', 'Regulatory Framework'],
      systemScope: 'environment',
      policyImpact: 72,
      stakeholderCount: 8500,
    },
    alertThresholds: { triLower: 5.0, triUpper: 8.0, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Meso Loops
  {
    id: 'meso-1',
    name: 'Budget Allocation Process',
    layer: 'meso',
    type: 'reinforcing',
    parentLoopId: 'macro-1',
    triScore: 8.1,
    deBand: 'green',
    srtHorizon: 12,
    trend: [7.8, 7.9, 8.0, 8.1, 8.1],
    status: 'healthy',
    lastCheck: '30 minutes ago',
    nextCheck: '2 hours',
    layerData: {
      processType: 'budget',
      throughputRate: 95, // % of bundles processed on time
      averageDeviation: 8, // % deviation from planned
      pilotSuccessRate: 87,
      resourceUtilization: 92,
    },
    alertThresholds: { triLower: 7.0, triUpper: 9.0, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'meso-2',
    name: 'Compliance Enforcement',
    layer: 'meso',
    type: 'balancing',
    parentLoopId: 'macro-2',
    triScore: 5.8,
    deBand: 'yellow',
    srtHorizon: 8,
    trend: [6.2, 6.0, 5.9, 5.8, 5.8],
    status: 'warning',
    lastCheck: '45 minutes ago',
    nextCheck: '1 hour',
    layerData: {
      processType: 'compliance',
      throughputRate: 78,
      averageDeviation: 15,
      pilotSuccessRate: 65,
      resourceUtilization: 85,
    },
    alertThresholds: { triLower: 6.0, triUpper: 8.5, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  // Micro Loops
  {
    id: 'micro-1',
    name: 'Grant Application Review',
    layer: 'micro',
    type: 'reinforcing',
    parentLoopId: 'meso-1',
    triScore: 7.5,
    deBand: 'green',
    srtHorizon: 2,
    trend: [7.2, 7.3, 7.4, 7.5, 7.5],
    status: 'healthy',
    lastCheck: '15 minutes ago',
    nextCheck: '45 minutes',
    layerData: {
      taskType: 'review',
      reworkPercentage: 12,
      averageCompletionTime: 4.5, // hours
      alertFrequency: 0.2, // per week
      bottleneckIndicators: ['Document Quality', 'Reviewer Availability'],
    },
    alertThresholds: { triLower: 6.5, triUpper: 8.5, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'micro-2',
    name: 'Environmental Impact Assessment',
    layer: 'micro',
    type: 'balancing',
    parentLoopId: 'meso-2',
    triScore: 4.8,
    deBand: 'red',
    srtHorizon: 3,
    trend: [5.5, 5.2, 5.0, 4.9, 4.8],
    status: 'critical',
    lastCheck: '10 minutes ago',
    nextCheck: '20 minutes',
    layerData: {
      taskType: 'approval',
      reworkPercentage: 35,
      averageCompletionTime: 12.8,
      alertFrequency: 2.1,
      bottleneckIndicators: ['Data Validation', 'Expert Review', 'Stakeholder Input'],
    },
    alertThresholds: { triLower: 5.0, triUpper: 7.5, deBandBreach: true, srtOverrun: true },
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const LayerIcon = ({ layer }: { layer: LoopLayer }) => {
  const icons = {
    macro: Globe,
    meso: Building2,
    micro: Settings,
  };
  const Icon = icons[layer];
  return <Icon className="w-5 h-5" />;
};

const LayerPanel: React.FC<{
  layer: LoopLayer;
  loops: EnhancedLoop[];
  metrics: LayerMetrics;
  expanded: boolean;
  onToggle: () => void;
  onLoopSelect?: (loop: EnhancedLoop) => void;
}> = ({ layer, loops, metrics, expanded, onToggle, onLoopSelect }) => {
  const layerColors = {
    macro: 'from-blue-500/20 to-purple-500/20',
    meso: 'from-green-500/20 to-teal-500/20',
    micro: 'from-orange-500/20 to-red-500/20',
  };

  const TrendIcon = ({ direction }: { direction: string }) => {
    if (direction === 'improving') return <TrendingUp className="w-4 h-4 text-green-400" />;
    if (direction === 'declining') return <TrendingDown className="w-4 h-4 text-red-400" />;
    return <Minus className="w-4 h-4 text-gray-400" />;
  };

  return (
    <motion.div
      className={`bg-gradient-to-br ${layerColors[layer]} backdrop-blur-xl rounded-xl border border-white/10`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="p-4">
        <button
          onClick={onToggle}
          className="w-full flex items-center justify-between text-left"
        >
          <div className="flex items-center gap-3">
            <LayerIcon layer={layer} />
            <div>
              <h3 className="text-white font-semibold capitalize">{layer} Loops</h3>
              <p className="text-gray-300 text-sm">
                {metrics.totalLoops} loops • Avg TRI: {metrics.averageTriScore.toFixed(1)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex gap-2">
              <Badge variant="outline" className="text-green-400 border-green-400/30">
                {metrics.healthyCount}
              </Badge>
              <Badge variant="outline" className="text-yellow-400 border-yellow-400/30">
                {metrics.warningCount}
              </Badge>
              <Badge variant="outline" className="text-red-400 border-red-400/30">
                {metrics.criticalCount}
              </Badge>
            </div>
            <TrendIcon direction={metrics.trendDirection} />
            {expanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
          </div>
        </button>

        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="mt-4 space-y-2"
          >
            {loops.map((loop) => (
              <motion.div
                key={loop.id}
                className="p-3 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
                whileHover={{ scale: 1.02 }}
                onClick={() => onLoopSelect?.(loop)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-3 h-3 rounded-full ${
                        loop.deBand === 'green' ? 'bg-green-500' :
                        loop.deBand === 'yellow' ? 'bg-yellow-500' :
                        loop.deBand === 'orange' ? 'bg-orange-500' : 'bg-red-500'
                      }`}
                    />
                    <div>
                      <h4 className="text-white font-medium text-sm">{loop.name}</h4>
                      <p className="text-gray-400 text-xs">Last check: {loop.lastCheck}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {loop.status === 'critical' && (
                      <AlertTriangle className="w-4 h-4 text-red-400" />
                    )}
                    <span className="text-white font-medium text-sm">{loop.triScore}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
};

export const MultiLevelLoopHealthDashboard: React.FC<MultiLevelLoopHealthDashboardProps> = ({
  loops = mockEnhancedLoops,
  onLoopSelect,
  onLayerToggle,
}) => {
  const [expandedLayers, setExpandedLayers] = useState<Set<LoopLayer>>(new Set(['macro']));

  const layerMetrics = useMemo(() => {
    const metrics: Record<LoopLayer, LayerMetrics> = {
      macro: { layer: 'macro', totalLoops: 0, healthyCount: 0, warningCount: 0, criticalCount: 0, averageTriScore: 0, breachedLoops: 0, trendDirection: 'stable' },
      meso: { layer: 'meso', totalLoops: 0, healthyCount: 0, warningCount: 0, criticalCount: 0, averageTriScore: 0, breachedLoops: 0, trendDirection: 'stable' },
      micro: { layer: 'micro', totalLoops: 0, healthyCount: 0, warningCount: 0, criticalCount: 0, averageTriScore: 0, breachedLoops: 0, trendDirection: 'stable' },
    };

    loops.forEach((loop) => {
      const layerMetric = metrics[loop.layer];
      layerMetric.totalLoops++;
      layerMetric.averageTriScore += loop.triScore;
      
      if (loop.status === 'healthy') layerMetric.healthyCount++;
      else if (loop.status === 'warning') layerMetric.warningCount++;
      else if (loop.status === 'critical') layerMetric.criticalCount++;
      
      if (loop.deBand === 'red' || loop.deBand === 'orange') layerMetric.breachedLoops++;
      
      // Simple trend calculation based on recent trend data
      const trendData = loop.trend;
      if (trendData.length >= 2) {
        const recent = trendData.slice(-2);
        if (recent[1] > recent[0]) layerMetric.trendDirection = 'improving';
        else if (recent[1] < recent[0]) layerMetric.trendDirection = 'declining';
      }
    });

    // Calculate averages
    Object.values(metrics).forEach((metric) => {
      if (metric.totalLoops > 0) {
        metric.averageTriScore = metric.averageTriScore / metric.totalLoops;
      }
    });

    return metrics;
  }, [loops]);

  const toggleLayer = (layer: LoopLayer) => {
    setExpandedLayers((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(layer)) {
        newSet.delete(layer);
      } else {
        newSet.add(layer);
      }
      return newSet;
    });
    onLayerToggle?.(layer);
  };

  const loopsByLayer = useMemo(() => {
    return {
      macro: loops.filter((loop) => loop.layer === 'macro'),
      meso: loops.filter((loop) => loop.layer === 'meso'),
      micro: loops.filter((loop) => loop.layer === 'micro'),
    };
  }, [loops]);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-semibold text-white">Multi-Level Loop Health</h2>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedLayers(new Set(['macro', 'meso', 'micro']))}
            className="border-white/30 text-white"
          >
            Expand All
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setExpandedLayers(new Set())}
            className="border-white/30 text-white"
          >
            Collapse All
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {(['macro', 'meso', 'micro'] as LoopLayer[]).map((layer) => (
          <LayerPanel
            key={layer}
            layer={layer}
            loops={loopsByLayer[layer]}
            metrics={layerMetrics[layer]}
            expanded={expandedLayers.has(layer)}
            onToggle={() => toggleLayer(layer)}
            onLoopSelect={onLoopSelect}
          />
        ))}
      </div>
    </div>
  );
};