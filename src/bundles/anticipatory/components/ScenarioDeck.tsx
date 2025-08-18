import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useAnticipatoryBundle, Scenario } from '@/hooks/useAnticipatoryBundle';
import { Play, Pin, Plus, TrendingUp, AlertTriangle } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface ScenarioDeckProps {
  taskId: string;
  loopId: string;
}

const SCENARIO_PRESETS = [
  {
    name: 'Baseline',
    params: { impact_multiplier: 1.0, demand_factor: 1.0, supply_factor: 1.0 },
    description: 'Normal operating conditions'
  },
  {
    name: 'High Demand',
    params: { impact_multiplier: 1.3, demand_factor: 1.5, supply_factor: 1.0 },
    description: 'Increased demand scenario'
  },
  {
    name: 'Low Supply',
    params: { impact_multiplier: 1.4, demand_factor: 1.0, supply_factor: 0.7 },
    description: 'Supply chain disruption'
  },
  {
    name: 'Policy Shift',
    params: { impact_multiplier: 1.2, demand_factor: 0.9, supply_factor: 1.1 },
    description: 'Regulatory changes impact'
  },
  {
    name: 'Shock',
    params: { impact_multiplier: 1.8, demand_factor: 1.2, supply_factor: 0.5 },
    description: 'Major disruption event'
  }
];

export default function ScenarioDeck({ taskId, loopId }: ScenarioDeckProps) {
  const {
    scenarios,
    createScenario,
    runScenario,
    selectedScenario,
    setSelectedScenario,
    isRunningScenario,
    scenarioResult
  } = useAnticipatoryBundle(taskId, loopId);

  const [currentParams, setCurrentParams] = useState({
    impact_multiplier: 1.0,
    demand_factor: 1.0,
    supply_factor: 1.0
  });
  const [newScenarioName, setNewScenarioName] = useState('');

  const handlePresetSelect = (preset: typeof SCENARIO_PRESETS[0]) => {
    setCurrentParams(preset.params);
    setNewScenarioName(preset.name);
  };

  const handleParameterChange = (param: string, value: number[]) => {
    setCurrentParams(prev => ({
      ...prev,
      [param]: value[0]
    }));
  };

  const handleCreateScenario = () => {
    if (!newScenarioName.trim()) return;
    
    createScenario.mutate({
      name: newScenarioName,
      params: currentParams,
      pinned: false
    });
    setNewScenarioName('');
  };

  const handleRunScenario = (scenario: Scenario) => {
    runScenario.mutate({
      scenarioId: scenario.id,
      params: scenario.params
    });
    setSelectedScenario(scenario.id);
  };

  const handlePinScenario = (scenarioId: string) => {
    // Toggle pin status logic would go here
  };

  const renderProjectionChart = (scenario: Scenario) => {
    if (!scenario.charts?.timeline) return null;

    const chartData = scenario.charts.timeline.map((point: any) => ({
      time: point.time,
      value: point.delivery_time,
      lower: point.confidence_band[0],
      upper: point.confidence_band[1]
    }));

    return (
      <div className="h-48 w-full mt-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
            <XAxis 
              dataKey="time" 
              className="text-xs"
              axisLine={false}
              tickLine={false}
            />
            <YAxis 
              className="text-xs"
              axisLine={false}
              tickLine={false}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'hsl(var(--background))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px'
              }}
            />
            <Area
              type="monotone"
              dataKey="upper"
              stackId="1"
              stroke="none"
              fill="hsl(var(--primary))"
              fillOpacity={0.1}
            />
            <Area
              type="monotone"
              dataKey="lower"
              stackId="1"
              stroke="none"
              fill="hsl(var(--background))"
              fillOpacity={1}
            />
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Scenario Presets */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Scenario Presets
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 mb-4">
            {SCENARIO_PRESETS.map((preset) => (
              <Button
                key={preset.name}
                variant="outline"
                className="h-auto p-3 flex flex-col items-start text-left"
                onClick={() => handlePresetSelect(preset)}
              >
                <div className="font-medium">{preset.name}</div>
                <div className="text-xs text-muted-foreground mt-1">{preset.description}</div>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Parameter Sliders */}
      <Card>
        <CardHeader>
          <CardTitle>Scenario Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label className="text-sm font-medium">Impact Multiplier: {currentParams.impact_multiplier.toFixed(1)}</Label>
              <Slider
                value={[currentParams.impact_multiplier]}
                onValueChange={(value) => handleParameterChange('impact_multiplier', value)}
                min={0.5}
                max={2.0}
                step={0.1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Demand Factor: {currentParams.demand_factor.toFixed(1)}</Label>
              <Slider
                value={[currentParams.demand_factor]}
                onValueChange={(value) => handleParameterChange('demand_factor', value)}
                min={0.5}
                max={2.0}
                step={0.1}
                className="mt-2"
              />
            </div>
            
            <div>
              <Label className="text-sm font-medium">Supply Factor: {currentParams.supply_factor.toFixed(1)}</Label>
              <Slider
                value={[currentParams.supply_factor]}
                onValueChange={(value) => handleParameterChange('supply_factor', value)}
                min={0.3}
                max={1.5}
                step={0.1}
                className="mt-2"
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Input
              placeholder="Scenario name..."
              value={newScenarioName}
              onChange={(e) => setNewScenarioName(e.target.value)}
              className="flex-1"
            />
            <Button 
              onClick={handleCreateScenario}
              disabled={!newScenarioName.trim() || createScenario.isPending}
            >
              <Plus className="h-4 w-4 mr-1" />
              Create
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Saved Scenarios */}
      <Card>
        <CardHeader>
          <CardTitle>Saved Scenarios</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {scenarios.map((scenario) => (
              <Card key={scenario.id} className="border border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{scenario.name}</h4>
                      {scenario.pinned && (
                        <Badge variant="secondary" className="text-xs">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handlePinScenario(scenario.id)}
                      >
                        <Pin className="h-4 w-4" />
                      </Button>
                      <Button
                        size="sm"
                        onClick={() => handleRunScenario(scenario)}
                        disabled={isRunningScenario}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Run
                      </Button>
                    </div>
                  </div>
                  
                  <div className="flex gap-4 text-sm text-muted-foreground mb-2">
                    <span>Impact: {(scenario.params?.impact_multiplier || 1.0).toFixed(1)}x</span>
                    <span>Demand: {(scenario.params?.demand_factor || 1.0).toFixed(1)}x</span>
                    <span>Supply: {(scenario.params?.supply_factor || 1.0).toFixed(1)}x</span>
                  </div>

                  {scenario.charts?.exceedance_probability && (
                    <div className="flex items-center gap-2 mb-2">
                      <AlertTriangle className="h-4 w-4 text-amber-500" />
                      <span className="text-sm">
                        Exceedance Risk: {(scenario.charts.exceedance_probability * 100).toFixed(0)}%
                      </span>
                    </div>
                  )}

                  {selectedScenario === scenario.id && scenarioResult && (
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm font-medium mb-2">Simulation Results</div>
                      <div className="grid grid-cols-2 gap-2 text-xs">
                        <div>Delivery Time: {(scenarioResult as any)?.projected_indicators?.delivery_time?.toFixed(1) || 'N/A'}</div>
                        <div>Cost Efficiency: {((scenarioResult as any)?.projected_indicators?.cost_efficiency * 100)?.toFixed(0) || 'N/A'}%</div>
                        <div>Quality Score: {(scenarioResult as any)?.projected_indicators?.quality_score?.toFixed(1) || 'N/A'}</div>
                        <div>Resource Util: {((scenarioResult as any)?.projected_indicators?.resource_utilization * 100)?.toFixed(0) || 'N/A'}%</div>
                      </div>
                    </div>
                  )}

                  {renderProjectionChart(scenario)}
                </CardContent>
              </Card>
            ))}
            
            {scenarios.length === 0 && (
              <div className="text-center py-6 text-muted-foreground">
                No scenarios created yet. Use presets above to get started.
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}