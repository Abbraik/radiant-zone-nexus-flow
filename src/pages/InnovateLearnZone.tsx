import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, Play, TrendingUp, Download, Zap, BarChart } from 'lucide-react';
import { Button } from '../components/ui/button';
import { Card } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Label } from '../components/ui/label';
import { Sparkline } from '../components/ui/sparkline';
import { useMockInsights, useMockMetrics } from '../hooks/use-mock-data';

const simulationTypes = [
  { value: 'monte-carlo', label: 'Monte Carlo Analysis', description: 'Risk & probability modeling' },
  { value: 'scenario', label: 'Scenario Planning', description: 'What-if simulations' },
  { value: 'optimization', label: 'Parameter Optimization', description: 'Find optimal configurations' }
];

const shockTypes = [
  { value: 'demand-spike', label: 'Demand Spike', description: '3x normal load' },
  { value: 'system-failure', label: 'System Failure', description: 'Critical component down' },
  { value: 'resource-constraint', label: 'Resource Constraint', description: '50% capacity reduction' }
];

export const InnovateLearnZone: React.FC = () => {
  const { data: insights = [] } = useMockInsights();
  const { data: metrics = [] } = useMockMetrics();
  const [selectedSimulation, setSelectedSimulation] = useState('');
  const [selectedShock, setSelectedShock] = useState('');

  const handleRunSimulation = () => {
    console.log('Running simulation:', selectedSimulation);
  };

  const handleShockRehearsal = () => {
    console.log('Running shock rehearsal:', selectedShock);
  };

  const lastRunMetric = metrics[0];
  const deltaValue = lastRunMetric ? ((Math.random() - 0.5) * 2).toFixed(1) : '0';

  return (
    <div className="space-y-6 animate-entrance">
      {/* Header */}
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="text-center space-y-2"
      >
        <h1 className="text-3xl font-bold text-foreground flex items-center justify-center gap-3">
          <Lightbulb className="h-8 w-8 text-primary" />
          Innovate + Learn Zone
        </h1>
        <p className="text-foreground-muted max-w-2xl mx-auto">
          Discover insights, run experiments, and learn from system behavior patterns
        </p>
      </motion.div>

      {/* Two-Column Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Insight Feed (60%) */}
        <div className="lg:col-span-2">
          <Card className="glass rounded-2xl shadow-lg p-6 h-full">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-foreground">Insight Feed</h3>
                <Badge variant="secondary" className="bg-primary/20 text-primary">
                  {insights.length} Active
                </Badge>
              </div>

              <div className="space-y-4 max-h-96 overflow-y-auto">
                {insights.map((insight, index) => (
                  <motion.div
                    key={insight.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-glass-secondary rounded-lg p-4 hover:bg-glass-accent transition-colors border border-border-subtle"
                  >
                    <div className="space-y-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                insight.category === 'opportunity' ? 'border-success text-success' :
                                insight.category === 'risk' ? 'border-destructive text-destructive' :
                                insight.category === 'pattern' ? 'border-info text-info' :
                                'border-warning text-warning'
                              }`}
                            >
                              {insight.category}
                            </Badge>
                            <Badge variant="secondary" className="text-xs">
                              {Math.round(insight.confidence * 100)}% confidence
                            </Badge>
                          </div>
                          <h4 className="font-medium text-foreground mb-1">
                            {insight.title}
                          </h4>
                          <p className="text-sm text-foreground-muted">
                            {insight.summary}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-foreground-muted">
                          {insight.createdAt.toLocaleDateString()}
                        </span>
                        <Button size="sm" variant="outline" className="text-xs">
                          <Play className="h-3 w-3 mr-1" />
                          Try Experiment
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              {insights.length === 0 && (
                <div className="text-center py-8 text-foreground-muted">
                  <Lightbulb className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No new insights available</p>
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Right Column - Quick-Run & Last-Run (40%) */}
        <div className="space-y-6">
          {/* Quick-Run Panel */}
          <Card className="glass rounded-2xl shadow-lg p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Quick-Run
              </h3>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm">Simulation Type</Label>
                  <Select value={selectedSimulation} onValueChange={setSelectedSimulation}>
                    <SelectTrigger className="glass-secondary mt-2">
                      <SelectValue placeholder="Select simulation" />
                    </SelectTrigger>
                    <SelectContent>
                      {simulationTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="text-sm">Shock Type</Label>
                  <Select value={selectedShock} onValueChange={setSelectedShock}>
                    <SelectTrigger className="glass-secondary mt-2">
                      <SelectValue placeholder="Select shock scenario" />
                    </SelectTrigger>
                    <SelectContent>
                      {shockTypes.map((type) => (
                        <SelectItem key={type.value} value={type.value}>
                          <div>
                            <div className="font-medium">{type.label}</div>
                            <div className="text-xs text-muted-foreground">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Button
                    onClick={handleRunSimulation}
                    disabled={!selectedSimulation}
                    className="w-full bg-primary hover:bg-primary-hover"
                  >
                    <BarChart className="h-4 w-4 mr-2" />
                    Run Simulation
                  </Button>
                  
                  <Button
                    onClick={handleShockRehearsal}
                    disabled={!selectedShock}
                    variant="outline"
                    className="w-full"
                  >
                    <Zap className="h-4 w-4 mr-2" />
                    Shock-Rehearsal
                  </Button>
                </div>
              </div>
            </div>
          </Card>

          {/* Last-Run Preview */}
          <Card className="glass rounded-2xl shadow-lg p-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-primary" />
                Last Run
              </h3>

              {lastRunMetric ? (
                <div className="space-y-3">
                  <div className="text-center">
                    <Sparkline
                      data={lastRunMetric.sparklineData}
                      width={120}
                      height={40}
                      color="#3b82f6"
                      fillColor="#3b82f6"
                      className="mx-auto"
                    />
                  </div>
                  
                  <div className="text-center">
                    <div className="text-sm text-foreground-muted">{lastRunMetric.name}</div>
                    <div className="text-lg font-bold text-foreground">
                      {lastRunMetric.value} {lastRunMetric.unit}
                    </div>
                    <div className={`text-sm font-medium ${
                      parseFloat(deltaValue) > 0 ? 'text-success' : 'text-destructive'
                    }`}>
                      {parseFloat(deltaValue) > 0 ? '+' : ''}{deltaValue}% change
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      ORS Bundle
                    </Button>
                    <Button variant="outline" size="sm" className="w-full text-xs">
                      <Download className="h-3 w-3 mr-1" />
                      Lesson Summary
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6 text-foreground-muted">
                  <BarChart className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No recent runs</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};