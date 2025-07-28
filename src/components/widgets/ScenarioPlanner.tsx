import React, { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer, Tooltip } from 'recharts';
import { RotateCcw, Download, X } from 'lucide-react';
import { Slider } from '../ui/slider';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Card } from '../ui/card';

interface Parameter {
  id: string;
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: string;
}

interface ScenarioPlannerProps {
  task: any;
}

const ScenarioPlanner: React.FC<ScenarioPlannerProps> = ({ task }) => {
  const [parameters, setParameters] = useState<Parameter[]>([
    { id: 'growth_rate', label: 'Population Growth Rate', value: 2.1, min: 0, max: 5, step: 0.1, defaultValue: 2.1, unit: '%' },
    { id: 'resource_allocation', label: 'Resource Allocation', value: 75, min: 0, max: 100, step: 5, defaultValue: 75, unit: '%' },
    { id: 'environmental_impact', label: 'Environmental Impact', value: 40, min: 0, max: 100, step: 5, defaultValue: 40, unit: 'index' },
    { id: 'economic_efficiency', label: 'Economic Efficiency', value: 80, min: 0, max: 100, step: 5, defaultValue: 80, unit: '%' },
    { id: 'social_investment', label: 'Social Investment', value: 60, min: 0, max: 100, step: 5, defaultValue: 60, unit: '%' },
    { id: 'innovation_factor', label: 'Innovation Factor', value: 50, min: 0, max: 100, step: 5, defaultValue: 50, unit: 'index' }
  ]);

  const [hoveredValue, setHoveredValue] = useState<{ value: number; year: number } | null>(null);

  // Generate projection data based on current parameters
  const generateProjectionData = useCallback(() => {
    const years = Array.from({ length: 10 }, (_, i) => 2024 + i);
    return years.map((year, index) => {
      const growthRate = parameters.find(p => p.id === 'growth_rate')?.value || 2.1;
      const resourceAllocation = parameters.find(p => p.id === 'resource_allocation')?.value || 75;
      const environmentalImpact = parameters.find(p => p.id === 'environmental_impact')?.value || 40;
      const economicEfficiency = parameters.find(p => p.id === 'economic_efficiency')?.value || 80;
      
      // Complex projection calculation
      const baseValue = 100;
      const growthFactor = Math.pow(1 + (growthRate / 100), index);
      const resourceFactor = (resourceAllocation / 100) * 1.2;
      const environmentalFactor = 1 - (environmentalImpact / 200);
      const economicFactor = (economicEfficiency / 100) * 1.1;
      
      const projectedValue = baseValue * growthFactor * resourceFactor * environmentalFactor * economicFactor;
      
      return {
        year,
        value: Math.round(projectedValue * 10) / 10,
        baseline: baseValue * Math.pow(1.02, index) // 2% baseline growth
      };
    });
  }, [parameters]);

  const chartData = generateProjectionData();

  const updateParameter = useCallback((id: string, value: number) => {
    setParameters(prev => prev.map(p => p.id === id ? { ...p, value } : p));
  }, []);

  const resetParameters = useCallback(() => {
    setParameters(prev => prev.map(p => ({ ...p, value: p.defaultValue })));
  }, []);

  const exportData = useCallback((format: 'csv' | 'png') => {
    if (format === 'csv') {
      const csv = [
        'Year,Projected Value,Baseline',
        ...chartData.map(d => `${d.year},${d.value},${d.baseline}`)
      ].join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'scenario-projection.csv';
      a.click();
      URL.revokeObjectURL(url);
    }
    // PNG export would require html2canvas or similar library
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-glass/90 backdrop-blur-md border border-white/20 rounded-lg p-3 shadow-xl"
        >
          <p className="text-white font-medium">{`Year: ${label}`}</p>
          <p className="text-primary font-medium">{`Value: ${payload[0].value}`}</p>
          {payload[1] && (
            <p className="text-gray-300">{`Baseline: ${payload[1].value}`}</p>
          )}
        </motion.div>
      );
    }
    return null;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="p-6 bg-glass/70 backdrop-blur-20 rounded-2xl shadow-2xl border border-white/10"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold text-white">Scenario Planner</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={resetParameters}
            className="text-white hover:bg-white/10 p-1.5"
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => exportData('csv')}
            className="text-white hover:bg-white/10 p-1.5"
          >
            <Download className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Parameters Column */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Parameters</h3>
          {parameters.map((param) => (
            <motion.div
              key={param.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-3"
            >
              <div className="flex items-center justify-between">
                <label className="text-sm text-white font-medium">{param.label}</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={param.value}
                    onChange={(e) => updateParameter(param.id, Number(e.target.value))}
                    min={param.min}
                    max={param.max}
                    step={param.step}
                    className="w-16 h-7 text-xs bg-white/10 border-white/20 text-white"
                  />
                  {param.unit && (
                    <span className="text-xs text-gray-400">{param.unit}</span>
                  )}
                </div>
              </div>
              <div className="relative">
                <Slider
                  value={[param.value]}
                  onValueChange={([value]) => updateParameter(param.id, value)}
                  min={param.min}
                  max={param.max}
                  step={param.step}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{param.min}</span>
                  <span>{param.max}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Chart Column */}
        <div className="space-y-3">
          <h3 className="text-sm font-medium text-gray-300 uppercase tracking-wide">Projection</h3>
          <Card className="p-4 bg-glass/30 border-white/10">
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis 
                    dataKey="year" 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <YAxis 
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: '#9CA3AF', fontSize: 12 }}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#30D158"
                    strokeWidth={2}
                    dot={false}
                    activeDot={{ r: 4, fill: '#30D158', stroke: '#30D158', strokeWidth: 2 }}
                  />
                  <Line
                    type="monotone"
                    dataKey="baseline"
                    stroke="#6B7280"
                    strokeWidth={1}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-6 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={resetParameters}
          className="text-gray-300 hover:text-white hover:bg-white/10"
        >
          Revert Defaults
        </Button>
        <Button
          className="bg-primary hover:bg-primary/90 text-white font-medium"
        >
          Apply Scenario
        </Button>
      </div>
    </motion.div>
  );
};

export default ScenarioPlanner;