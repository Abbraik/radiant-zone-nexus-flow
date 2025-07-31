import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, 
  TrendingUp, 
  Calendar, 
  Download, 
  Filter,
  Settings,
  PieChart,
  LineChart,
  Activity,
  Brain,
  Target,
  Zap
} from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { AnalyticsInsight, PredictiveModel, HistoricalPattern } from '../../types/analytics';

interface AdvancedAnalyticsSuiteProps {
  onExportData?: (query: any) => void;
  onConfigureAlert?: () => void;
  onViewInsight?: (insight: AnalyticsInsight) => void;
}

// Mock data for advanced analytics
const mockInsights: AnalyticsInsight[] = [
  {
    id: 'insight-1',
    title: 'Seasonal Performance Pattern Detected',
    description: 'Tax credit uptake shows 35% increase in Q4 annually. Consider resource pre-allocation.',
    type: 'pattern',
    severity: 'medium',
    confidence: 92,
    actionable: true,
    suggestedActions: [
      'Increase processing capacity by 30% in Q4',
      'Launch awareness campaign in September',
      'Pre-approve high-volume applications'
    ],
    evidence: [
      {
        type: 'correlation',
        description: '3-year historical data shows consistent Q4 surge',
        value: 35,
        source: 'Tax Credit Database',
        reliability: 0.95
      }
    ],
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
  },
  {
    id: 'insight-2',
    title: 'Process Bottleneck Optimization Opportunity',
    description: 'Environmental review process could reduce average time by 4.2 days with parallel validation.',
    type: 'opportunity',
    severity: 'high',
    confidence: 87,
    actionable: true,
    suggestedActions: [
      'Implement parallel review workflow',
      'Cross-train reviewers on multiple domains',
      'Automate preliminary checks'
    ],
    evidence: [
      {
        type: 'data_point',
        description: 'Sequential vs parallel processing simulation',
        value: 4.2,
        source: 'Process Analytics Engine',
        reliability: 0.87
      }
    ],
    createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
  },
  {
    id: 'insight-3',
    title: 'Resource Allocation Imbalance Risk',
    description: 'Budget allocation team operating at 140% capacity while compliance team at 60%.',
    type: 'risk',
    severity: 'critical',
    confidence: 96,
    actionable: true,
    suggestedActions: [
      'Temporarily reassign 2 compliance officers to budget team',
      'Implement cross-training program',
      'Consider external contractor support'
    ],
    evidence: [
      {
        type: 'data_point',
        description: 'Current team utilization metrics',
        value: 140,
        source: 'Resource Management System',
        reliability: 0.98
      }
    ],
    createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
  }
];

const mockPredictiveModels: PredictiveModel[] = [
  {
    id: 'model-1',
    name: 'TRI Score Forecasting',
    type: 'time_series',
    targetVariable: 'tri_score',
    features: ['historical_scores', 'intervention_count', 'resource_allocation', 'external_factors'],
    accuracy: 89,
    confidence: 92,
    lastTrained: new Date(Date.now() - 24 * 60 * 60 * 1000),
    predictions: [
      {
        id: 'pred-1',
        modelId: 'model-1',
        targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        predictedValue: 7.2,
        confidenceInterval: { lower: 6.8, upper: 7.6 },
        factors: [
          {
            factor: 'Resource Allocation',
            impact: 0.3,
            confidence: 94,
            explanation: 'Increased staffing positively impacts TRI scores'
          },
          {
            factor: 'Seasonal Demand',
            impact: -0.1,
            confidence: 78,
            explanation: 'Q4 typically shows slight performance dip due to volume'
          }
        ]
      }
    ]
  },
  {
    id: 'model-2',
    name: 'Loop Health Predictor',
    type: 'classification',
    targetVariable: 'loop_status',
    features: ['de_band_history', 'alert_frequency', 'intervention_effectiveness', 'stakeholder_engagement'],
    accuracy: 84,
    confidence: 88,
    lastTrained: new Date(Date.now() - 48 * 60 * 60 * 1000),
    predictions: []
  }
];

const mockHistoricalPatterns: HistoricalPattern[] = [
  {
    id: 'pattern-1',
    name: 'Quarterly Performance Cycle',
    description: 'Loop performance typically dips 10-15% in first month of each quarter',
    pattern: 'cyclical',
    frequency: 'quarterly',
    strength: 0.78,
    lastOccurrence: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    nextPredicted: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
    associatedMetrics: ['tri_score', 'throughput_rate', 'completion_time']
  },
  {
    id: 'pattern-2',
    name: 'Post-Intervention Recovery',
    description: 'Systems typically require 2-3 weeks to stabilize after major interventions',
    pattern: 'trending',
    frequency: 'ad-hoc',
    strength: 0.85,
    lastOccurrence: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000),
    associatedMetrics: ['de_band_status', 'alert_frequency']
  }
];

const InsightCard: React.FC<{
  insight: AnalyticsInsight;
  onView: () => void;
}> = ({ insight, onView }) => {
  const severityColors = {
    low: 'text-blue-400 border-blue-400/30',
    medium: 'text-yellow-400 border-yellow-400/30',
    high: 'text-orange-400 border-orange-400/30',
    critical: 'text-red-400 border-red-400/30',
  };

  const typeIcons = {
    opportunity: Target,
    risk: Activity,
    pattern: TrendingUp,
    anomaly: Zap,
    recommendation: Brain,
  };

  const TypeIcon = typeIcons[insight.type];

  return (
    <motion.div
      className="p-4 bg-white/5 rounded-lg border border-white/10 hover:bg-white/10 cursor-pointer transition-all"
      whileHover={{ scale: 1.02 }}
      onClick={onView}
    >
      <div className="flex items-start gap-3">
        <TypeIcon className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <h4 className="text-white font-medium text-sm">{insight.title}</h4>
            <Badge variant="outline" className={`text-xs ${severityColors[insight.severity]}`}>
              {insight.severity}
            </Badge>
            <Badge variant="outline" className="text-gray-400 border-gray-400/30 text-xs">
              {insight.confidence}% confidence
            </Badge>
          </div>
          
          <p className="text-gray-300 text-xs leading-relaxed">
            {insight.description}
          </p>
          
          {insight.actionable && insight.suggestedActions && (
            <div className="space-y-1">
              <span className="text-xs text-gray-400">Suggested Actions:</span>
              <ul className="text-xs text-gray-300 space-y-1">
                {insight.suggestedActions.slice(0, 2).map((action, index) => (
                  <li key={index} className="flex items-start gap-1">
                    <span className="text-blue-400">•</span>
                    <span>{action}</span>
                  </li>
                ))}
                {insight.suggestedActions.length > 2 && (
                  <li className="text-blue-400 text-xs">+{insight.suggestedActions.length - 2} more</li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ModelCard: React.FC<{
  model: PredictiveModel;
}> = ({ model }) => {
  const typeColors = {
    regression: 'text-green-400 border-green-400/30',
    classification: 'text-blue-400 border-blue-400/30',
    time_series: 'text-purple-400 border-purple-400/30',
    causal_inference: 'text-orange-400 border-orange-400/30',
  };

  return (
    <Card className="p-4 bg-white/5 border-white/10">
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h4 className="text-white font-medium">{model.name}</h4>
          <Badge variant="outline" className={`text-xs ${typeColors[model.type]}`}>
            {model.type.replace('_', ' ')}
          </Badge>
        </div>
        
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Accuracy:</span>
            <span className="text-white font-medium ml-2">{model.accuracy}%</span>
          </div>
          <div>
            <span className="text-gray-400">Confidence:</span>
            <span className="text-white font-medium ml-2">{model.confidence}%</span>
          </div>
        </div>
        
        <div className="text-xs text-gray-400">
          Last trained: {model.lastTrained.toLocaleDateString()}
        </div>
        
        {model.predictions.length > 0 && (
          <div className="pt-2 border-t border-white/10">
            <span className="text-xs text-gray-400">Latest Prediction:</span>
            <div className="text-sm text-white mt-1">
              {model.predictions[0].predictedValue.toFixed(1)} 
              <span className="text-gray-400 ml-1">
                ({model.predictions[0].confidenceInterval.lower.toFixed(1)} - {model.predictions[0].confidenceInterval.upper.toFixed(1)})
              </span>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
};

export const AdvancedAnalyticsSuite: React.FC<AdvancedAnalyticsSuiteProps> = ({
  onExportData,
  onConfigureAlert,
  onViewInsight,
}) => {
  const [timeRange, setTimeRange] = useState('30d');
  const [selectedInsightType, setSelectedInsightType] = useState<string>('all');

  const filteredInsights = useMemo(() => {
    if (selectedInsightType === 'all') return mockInsights;
    return mockInsights.filter(insight => insight.type === selectedInsightType);
  }, [selectedInsightType]);

  const insightCounts = useMemo(() => {
    return {
      total: mockInsights.length,
      opportunities: mockInsights.filter(i => i.type === 'opportunity').length,
      risks: mockInsights.filter(i => i.type === 'risk').length,
      patterns: mockInsights.filter(i => i.type === 'pattern').length,
      actionable: mockInsights.filter(i => i.actionable).length,
    };
  }, []);

  return (
    <Card className="p-6 bg-white/5 backdrop-blur-xl border-white/10">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-purple-400" />
            <div>
              <h3 className="text-xl font-semibold text-white">Advanced Analytics</h3>
              <p className="text-gray-400 text-sm">Historical trends, predictions, and insights</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <Select value={timeRange} onValueChange={setTimeRange}>
              <SelectTrigger className="w-32 bg-white/10 border-white/20 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>
            
            <Button
              size="sm"
              variant="outline"
              onClick={onConfigureAlert}
              className="border-white/30 text-white"
            >
              <Settings className="w-4 h-4 mr-2" />
              Configure
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onExportData?.({ timeRange, insights: filteredInsights })}
              className="border-white/30 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </div>

        {/* Analytics Tabs */}
        <Tabs defaultValue="insights" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 bg-white/10">
            <TabsTrigger value="insights" className="data-[state=active]:bg-white/20">
              Insights ({insightCounts.actionable})
            </TabsTrigger>
            <TabsTrigger value="predictions" className="data-[state=active]:bg-white/20">
              Predictions
            </TabsTrigger>
            <TabsTrigger value="patterns" className="data-[state=active]:bg-white/20">
              Patterns
            </TabsTrigger>
            <TabsTrigger value="trends" className="data-[state=active]:bg-white/20">
              Trends
            </TabsTrigger>
          </TabsList>

          <TabsContent value="insights" className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <span className="text-white font-medium">AI-Generated Insights</span>
                <div className="flex gap-2">
                  <Badge variant="outline" className="text-blue-400 border-blue-400/30">
                    {insightCounts.opportunities} opportunities
                  </Badge>
                  <Badge variant="outline" className="text-red-400 border-red-400/30">
                    {insightCounts.risks} risks
                  </Badge>
                  <Badge variant="outline" className="text-purple-400 border-purple-400/30">
                    {insightCounts.patterns} patterns
                  </Badge>
                </div>
              </div>
              
              <Select value={selectedInsightType} onValueChange={setSelectedInsightType}>
                <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Types</SelectItem>
                  <SelectItem value="opportunity">Opportunities</SelectItem>
                  <SelectItem value="risk">Risks</SelectItem>
                  <SelectItem value="pattern">Patterns</SelectItem>
                  <SelectItem value="anomaly">Anomalies</SelectItem>
                  <SelectItem value="recommendation">Recommendations</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3">
              <AnimatePresence>
                {filteredInsights.map((insight) => (
                  <InsightCard
                    key={insight.id}
                    insight={insight}
                    onView={() => onViewInsight?.(insight)}
                  />
                ))}
              </AnimatePresence>
            </div>
          </TabsContent>

          <TabsContent value="predictions" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Predictive Models</span>
              <Button size="sm" variant="outline" className="border-white/30 text-white">
                <Brain className="w-4 h-4 mr-2" />
                Train New Model
              </Button>
            </div>
            
            <div className="grid gap-4 md:grid-cols-2">
              {mockPredictiveModels.map((model) => (
                <ModelCard key={model.id} model={model} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="patterns" className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-white font-medium">Historical Patterns</span>
              <Button size="sm" variant="outline" className="border-white/30 text-white">
                <Calendar className="w-4 h-4 mr-2" />
                Pattern Analysis
              </Button>
            </div>
            
            <div className="space-y-3">
              {mockHistoricalPatterns.map((pattern) => (
                <Card key={pattern.id} className="p-4 bg-white/5 border-white/10">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <h4 className="text-white font-medium">{pattern.name}</h4>
                      <Badge variant="outline" className="text-purple-400 border-purple-400/30 text-xs">
                        {pattern.pattern}
                      </Badge>
                    </div>
                    <p className="text-gray-300 text-sm">{pattern.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span>Strength: {(pattern.strength * 100).toFixed(0)}%</span>
                      <span>Frequency: {pattern.frequency}</span>
                      {pattern.nextPredicted && (
                        <span>Next predicted: {pattern.nextPredicted.toLocaleDateString()}</span>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="trends" className="space-y-4">
            <div className="text-center py-8">
              <LineChart className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-white font-medium mb-2">Trend Analysis Coming Soon</h4>
              <p className="text-gray-400 text-sm">
                Advanced trend visualization and correlation analysis will be available in the next release.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </Card>
  );
};