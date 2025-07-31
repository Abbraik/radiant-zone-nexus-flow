import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  LineChart, 
  TrendingUp, 
  TrendingDown, 
  Activity,
  Users,
  DollarSign,
  Target,
  AlertTriangle,
  CheckCircle,
  Eye,
  ToggleLeft,
  ToggleRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Progress } from '../ui/progress';
import { Switch } from '../ui/switch';
import { Label } from '../ui/label';
import type { EnhancedIntervention } from '../../types/intervention';

interface AdvancedImpactSimulatorProps {
  interventions: EnhancedIntervention[];
  loopContext?: {
    loopId: string;
    loopName: string;
    loopType: 'Reinforcing' | 'Balancing';
    currentState: Record<string, number>;
  };
}

export const AdvancedImpactSimulator: React.FC<AdvancedImpactSimulatorProps> = ({
  interventions,
  loopContext
}) => {
  const [selectedScenario, setSelectedScenario] = useState<'baseline' | 'intervention'>('baseline');
  const [showTrustMetrics, setShowTrustMetrics] = useState(false);
  const [timeHorizon, setTimeHorizon] = useState(12); // months

  // Mock simulation data generation
  const generateSimulationData = useMemo(() => {
    const months = Array.from({ length: timeHorizon }, (_, i) => i + 1);
    
    // Baseline scenario - gradual decline or stagnation
    const baselineData = months.map(month => ({
      month,
      efficiency: Math.max(0.3, 0.7 - (month * 0.02)), // Gradual decline
      satisfaction: Math.max(0.4, 0.75 - (month * 0.015)),
      cost: 100 + (month * 2), // Increasing costs
      trust: showTrustMetrics ? Math.max(0.2, 0.6 - (month * 0.01)) : null
    }));

    // Intervention scenario - improvement with leverage effects
    const interventionData = months.map(month => {
      const leverageEffect = loopContext?.loopType === 'Reinforcing' 
        ? Math.min(1.5, 1 + (month * 0.08)) // Accelerating improvement
        : Math.min(1.2, 1 + (month * 0.03)); // Steady improvement

      return {
        month,
        efficiency: Math.min(0.95, 0.7 + (month * 0.05 * leverageEffect)),
        satisfaction: Math.min(0.92, 0.75 + (month * 0.04 * leverageEffect)),
        cost: Math.max(70, 100 - (month * 3 * leverageEffect)), // Decreasing costs
        trust: showTrustMetrics ? Math.min(0.9, 0.6 + (month * 0.03 * leverageEffect)) : null
      };
    });

    return { baselineData, interventionData };
  }, [timeHorizon, loopContext, showTrustMetrics]);

  const currentData = selectedScenario === 'baseline' 
    ? generateSimulationData.baselineData 
    : generateSimulationData.interventionData;

  // Calculate impact metrics
  const impactMetrics = useMemo(() => {
    const baseline = generateSimulationData.baselineData[timeHorizon - 1];
    const intervention = generateSimulationData.interventionData[timeHorizon - 1];

    return {
      efficiencyImprovement: ((intervention.efficiency - baseline.efficiency) / baseline.efficiency * 100),
      satisfactionImprovement: ((intervention.satisfaction - baseline.satisfaction) / baseline.satisfaction * 100),
      costReduction: ((baseline.cost - intervention.cost) / baseline.cost * 100),
      trustImprovement: showTrustMetrics && intervention.trust && baseline.trust 
        ? ((intervention.trust - baseline.trust) / baseline.trust * 100) 
        : null
    };
  }, [generateSimulationData, timeHorizon, showTrustMetrics]);

  // Calculate intervention complexity and risk
  const bundleMetrics = useMemo(() => {
    const totalBudget = interventions.reduce((sum, int) => sum + int.budget.totalBudget, 0);
    const avgComplexity = interventions.reduce((sum, int) => {
      const complexityScore = int.complexity === 'High' ? 3 : int.complexity === 'Medium' ? 2 : 1;
      return sum + complexityScore;
    }, 0) / interventions.length;

    const riskFactors = interventions.reduce((risks, int) => {
      if (int.budget.totalBudget > 100000) risks.push('High budget');
      if (int.microTasks.length > 10) risks.push('Many tasks');
      if (int.complexity === 'High') risks.push('High complexity');
      return risks;
    }, [] as string[]);

    return {
      totalBudget,
      avgComplexity,
      riskLevel: riskFactors.length > 2 ? 'High' : riskFactors.length > 1 ? 'Medium' : 'Low',
      riskFactors
    };
  }, [interventions]);

  const getMetricIcon = (value: number) => {
    return value > 0 ? <TrendingUp className="h-4 w-4 text-success" /> : <TrendingDown className="h-4 w-4 text-destructive" />;
  };

  const getLoopTypeIndicator = () => {
    if (!loopContext) return null;
    
    return (
      <div className="flex items-center gap-2 p-3 glass rounded-lg border border-border-subtle">
        <span className="text-2xl">
          {loopContext.loopType === 'Reinforcing' ? '🔄' : '⚖️'}
        </span>
        <div>
          <h4 className="font-medium text-foreground">{loopContext.loopName}</h4>
          <p className="text-sm text-muted-foreground">
            {loopContext.loopType} Loop - {loopContext.loopType === 'Reinforcing' ? 'Accelerating' : 'Balancing'} Effects
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="glass-secondary rounded-xl p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Activity className="h-6 w-6 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Impact Simulation</h3>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Label htmlFor="trust-metrics" className="text-sm">Trust Metrics</Label>
            <Switch
              id="trust-metrics"
              checked={showTrustMetrics}
              onCheckedChange={setShowTrustMetrics}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant={selectedScenario === 'baseline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedScenario('baseline')}
            >
              Baseline
            </Button>
            <Button
              variant={selectedScenario === 'intervention' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedScenario('intervention')}
            >
              With Interventions
            </Button>
          </div>
        </div>
      </div>

      {/* Loop Context */}
      {loopContext && getLoopTypeIndicator()}

      <Tabs defaultValue="projections" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="projections">Projections</TabsTrigger>
          <TabsTrigger value="comparison">Comparison</TabsTrigger>
          <TabsTrigger value="dependencies">Dependencies</TabsTrigger>
        </TabsList>

        <TabsContent value="projections" className="space-y-6">
          {/* Key Metrics Overview */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Efficiency</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {(currentData[currentData.length - 1].efficiency * 100).toFixed(0)}%
                    </p>
                  </div>
                  <Target className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Satisfaction</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {(currentData[currentData.length - 1].satisfaction * 100).toFixed(0)}%
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">Cost Index</p>
                    <p className="text-2xl font-semibold text-foreground">
                      {currentData[currentData.length - 1].cost.toFixed(0)}
                    </p>
                  </div>
                  <DollarSign className="h-8 w-8 text-primary" />
                </div>
              </CardContent>
            </Card>

            {showTrustMetrics && (
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Trust Level</p>
                      <p className="text-2xl font-semibold text-foreground">
                        {currentData[currentData.length - 1].trust ? 
                          (currentData[currentData.length - 1].trust! * 100).toFixed(0) + '%' : 'N/A'}
                      </p>
                    </div>
                    <CheckCircle className="h-8 w-8 text-primary" />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Mock Chart Visualization */}
          <Card>
            <CardHeader>
              <CardTitle>Projected Trajectory ({selectedScenario})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-end justify-center gap-2">
                {currentData.slice(0, 12).map((data, index) => (
                  <div key={index} className="flex flex-col items-center gap-1">
                    <div className="flex flex-col items-center gap-1">
                      {/* Efficiency Bar */}
                      <div 
                        className="w-4 bg-primary rounded-t"
                        style={{ height: `${data.efficiency * 200}px` }}
                      />
                      <div className="text-xs text-muted-foreground">M{data.month}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center justify-center gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-primary rounded" />
                  <span className="text-sm text-muted-foreground">Efficiency</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-6">
          {/* Impact Comparison */}
          <div className="grid grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Performance Improvements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Efficiency Gain</span>
                  <div className="flex items-center gap-2">
                    {getMetricIcon(impactMetrics.efficiencyImprovement)}
                    <span className="font-medium">
                      {impactMetrics.efficiencyImprovement > 0 ? '+' : ''}
                      {impactMetrics.efficiencyImprovement.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Satisfaction Boost</span>
                  <div className="flex items-center gap-2">
                    {getMetricIcon(impactMetrics.satisfactionImprovement)}
                    <span className="font-medium">
                      {impactMetrics.satisfactionImprovement > 0 ? '+' : ''}
                      {impactMetrics.satisfactionImprovement.toFixed(1)}%
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Cost Reduction</span>
                  <div className="flex items-center gap-2">
                    {getMetricIcon(impactMetrics.costReduction)}
                    <span className="font-medium">
                      {impactMetrics.costReduction > 0 ? '+' : ''}
                      {impactMetrics.costReduction.toFixed(1)}%
                    </span>
                  </div>
                </div>

                {showTrustMetrics && impactMetrics.trustImprovement !== null && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Trust Improvement</span>
                    <div className="flex items-center gap-2">
                      {getMetricIcon(impactMetrics.trustImprovement)}
                      <span className="font-medium">
                        {impactMetrics.trustImprovement > 0 ? '+' : ''}
                        {impactMetrics.trustImprovement.toFixed(1)}%
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Bundle Risk Assessment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Total Investment</span>
                  <span className="font-medium">${bundleMetrics.totalBudget.toLocaleString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Complexity Level</span>
                  <Badge variant={bundleMetrics.avgComplexity > 2.5 ? 'destructive' : bundleMetrics.avgComplexity > 1.5 ? 'default' : 'secondary'}>
                    {bundleMetrics.avgComplexity > 2.5 ? 'High' : bundleMetrics.avgComplexity > 1.5 ? 'Medium' : 'Low'}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-sm">Risk Level</span>
                  <Badge variant={bundleMetrics.riskLevel === 'High' ? 'destructive' : bundleMetrics.riskLevel === 'Medium' ? 'default' : 'secondary'}>
                    {bundleMetrics.riskLevel}
                  </Badge>
                </div>

                {bundleMetrics.riskFactors.length > 0 && (
                  <div>
                    <p className="text-sm font-medium mb-2">Risk Factors:</p>
                    <div className="space-y-1">
                      {bundleMetrics.riskFactors.map((factor, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <AlertTriangle className="h-3 w-3 text-warning" />
                          <span className="text-xs text-muted-foreground">{factor}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="dependencies" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Intervention Dependencies</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {interventions.map((intervention, index) => (
                  <div key={intervention.id} className="flex items-center gap-4 p-3 glass rounded-lg">
                    <span className="text-xl">{intervention.icon}</span>
                    <div className="flex-1">
                      <h4 className="font-medium">{intervention.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {intervention.microTasks.length} tasks • ${intervention.budget.totalBudget.toLocaleString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{intervention.effort}</Badge>
                      <Badge variant="outline">{intervention.timeToImpact}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdvancedImpactSimulator;