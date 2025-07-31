import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Calendar, Target, Settings, Clock, AlertTriangle } from 'lucide-react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface TensionSignal {
  id: string;
  name: string;
  description: string;
  unit: string;
  currentValue: number;
  trend: 'up' | 'down' | 'stable';
  category: 'environmental' | 'social' | 'economic' | 'governance';
  historicalData: number[];
}

interface DEBandConfig {
  signal: string;
  lowerBound: number;
  upperBound: number;
  currentValue: number;
  breachFrequency: number; // percentage of time outside bounds
  riskLevel: 'low' | 'medium' | 'high';
}

interface SRTHorizon {
  id: string;
  label: string;
  duration: number; // in months
  description: string;
  implications: string[];
  recommended: boolean;
}

interface ParameterConfig {
  tensionSignal: TensionSignal | null;
  deBandConfig: DEBandConfig | null;
  srtHorizon: SRTHorizon | null;
  customSRTMonths?: number;
}

const mockTensionSignals: TensionSignal[] = [
  {
    id: 'air-quality',
    name: 'Air Quality Index',
    description: 'Measures air pollution levels across major cities',
    unit: 'AQI',
    currentValue: 156,
    trend: 'up',
    category: 'environmental',
    historicalData: [120, 135, 145, 150, 156]
  },
  {
    id: 'employment-rate',
    name: 'Youth Employment Rate',
    description: 'Percentage of youth (16-24) in employment',
    unit: '%',
    currentValue: 67.5,
    trend: 'down',
    category: 'social',
    historicalData: [72, 70, 69, 68, 67.5]
  },
  {
    id: 'housing-affordability',
    name: 'Housing Affordability Index',
    description: 'Ratio of median house price to median income',
    unit: 'ratio',
    currentValue: 8.2,
    trend: 'up',
    category: 'economic',
    historicalData: [7.1, 7.5, 7.8, 8.0, 8.2]
  },
  {
    id: 'citizen-trust',
    name: 'Citizen Trust Index',
    description: 'Public trust in government institutions',
    unit: 'score',
    currentValue: 42,
    trend: 'down',
    category: 'governance',
    historicalData: [58, 52, 48, 45, 42]
  }
];

const srtHorizonTemplates: SRTHorizon[] = [
  {
    id: '3m',
    label: '3 Months',
    duration: 3,
    description: 'Short-term tactical response',
    implications: ['Quick wins', 'Limited structural change', 'High implementation speed'],
    recommended: false
  },
  {
    id: '6m',
    label: '6 Months',
    duration: 6,
    description: 'Medium-term strategic adjustment',
    implications: ['Balanced approach', 'Moderate system change', 'Sustainable pace'],
    recommended: true
  },
  {
    id: '12m',
    label: '12 Months',
    duration: 12,
    description: 'Long-term systemic transformation',
    implications: ['Deep structural change', 'Higher impact potential', 'Requires patience'],
    recommended: false
  },
  {
    id: '24m',
    label: '24 Months',
    duration: 24,
    description: 'Multi-year paradigm shift',
    implications: ['Fundamental transformation', 'High complexity', 'Maximum impact'],
    recommended: false
  }
];

interface ParameterPanelProps {
  config: ParameterConfig;
  onConfigChange: (config: ParameterConfig) => void;
  loopArchetype?: string;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  config,
  onConfigChange,
  loopArchetype
}) => {
  const [activeTab, setActiveTab] = useState('tension');

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up': return <TrendingUp className="h-3 w-3 text-red-500" />;
      case 'down': return <TrendingUp className="h-3 w-3 text-green-500 rotate-180" />;
      default: return <Target className="h-3 w-3 text-blue-500" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'environmental': return 'bg-green-500/10 text-green-600 border-green-200';
      case 'social': return 'bg-blue-500/10 text-blue-600 border-blue-200';
      case 'economic': return 'bg-purple-500/10 text-purple-600 border-purple-200';
      case 'governance': return 'bg-orange-500/10 text-orange-600 border-orange-200';
      default: return 'bg-gray-500/10 text-gray-600 border-gray-200';
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low': return 'text-green-600';
      case 'medium': return 'text-yellow-600';
      case 'high': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  const handleTensionSelect = (signal: TensionSignal) => {
    // Auto-configure DE-Band based on signal
    const deBandConfig: DEBandConfig = {
      signal: signal.id,
      lowerBound: signal.currentValue * 0.8,
      upperBound: signal.currentValue * 1.2,
      currentValue: signal.currentValue,
      breachFrequency: Math.random() * 30, // Mock breach frequency
      riskLevel: signal.trend === 'up' ? 'high' : signal.trend === 'down' ? 'medium' : 'low'
    };

    onConfigChange({
      ...config,
      tensionSignal: signal,
      deBandConfig
    });
    setActiveTab('deband');
  };

  const handleDEBandUpdate = (updates: Partial<DEBandConfig>) => {
    if (config.deBandConfig) {
      onConfigChange({
        ...config,
        deBandConfig: { ...config.deBandConfig, ...updates }
      });
    }
  };

  const handleSRTSelect = (horizon: SRTHorizon) => {
    onConfigChange({
      ...config,
      srtHorizon: horizon
    });
  };

  const isConfigurationComplete = () => {
    return config.tensionSignal && config.deBandConfig && config.srtHorizon;
  };

  return (
    <TooltipProvider>
      <Card className="h-full">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-foreground">Parameter Configuration</h3>
            {isConfigurationComplete() && (
              <Badge variant="secondary" className="bg-green-500/10 text-green-600">
                Complete
              </Badge>
            )}
          </div>
          <p className="text-sm text-muted-foreground mt-1">
            Configure tension signals, DE-Bands, and SRT horizons
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full">
          <TabsList className="grid grid-cols-3 w-full mx-4 mt-4">
            <TabsTrigger value="tension" className="text-xs">
              <TrendingUp className="h-3 w-3 mr-1" />
              Tension
            </TabsTrigger>
            <TabsTrigger value="deband" className="text-xs" disabled={!config.tensionSignal}>
              <Target className="h-3 w-3 mr-1" />
              DE-Band
            </TabsTrigger>
            <TabsTrigger value="srt" className="text-xs" disabled={!config.deBandConfig}>
              <Calendar className="h-3 w-3 mr-1" />
              SRT
            </TabsTrigger>
          </TabsList>

          <div className="p-4 h-full overflow-y-auto">
            <TabsContent value="tension" className="space-y-4 mt-0">
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-muted-foreground">
                  Select Key Tension Signal
                </h4>
                
                {mockTensionSignals.map((signal) => (
                  <motion.div
                    key={signal.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`p-4 cursor-pointer transition-all ${
                        config.tensionSignal?.id === signal.id 
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => handleTensionSelect(signal)}
                    >
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h5 className="font-medium text-sm">{signal.name}</h5>
                              {getTrendIcon(signal.trend)}
                              <Badge className={getCategoryColor(signal.category)}>
                                {signal.category}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {signal.description}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="text-lg font-semibold">
                            {signal.currentValue} {signal.unit}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Trend: {signal.trend}
                          </div>
                        </div>

                        {/* Mini trend chart */}
                        <div className="flex items-end gap-1 h-8">
                          {signal.historicalData.map((value, index) => (
                            <div
                              key={index}
                              className="bg-primary/20 rounded-sm flex-1"
                              style={{
                                height: `${(value / Math.max(...signal.historicalData)) * 100}%`
                              }}
                            />
                          ))}
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="deband" className="space-y-4 mt-0">
              {config.tensionSignal && config.deBandConfig && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-medium">
                      DE-Band Configuration
                    </h4>
                    <Tooltip>
                      <TooltipTrigger>
                        <AlertTriangle className="h-4 w-4 text-muted-foreground" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Set acceptable bounds for {config.tensionSignal.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {config.deBandConfig.currentValue} {config.tensionSignal.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Current {config.tensionSignal.name}
                        </div>
                      </div>

                      {/* DE-Band Slider */}
                      <div className="space-y-3">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Lower Bound</span>
                          <span>Upper Bound</span>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-4">
                            <span className="text-sm w-12">{config.deBandConfig.lowerBound.toFixed(1)}</span>
                            <Slider
                              value={[config.deBandConfig.lowerBound]}
                              onValueChange={([value]) => handleDEBandUpdate({ lowerBound: value })}
                              min={config.tensionSignal.currentValue * 0.5}
                              max={config.tensionSignal.currentValue * 0.95}
                              step={0.1}
                              className="flex-1"
                            />
                          </div>
                          
                          <div className="flex items-center gap-4">
                            <span className="text-sm w-12">{config.deBandConfig.upperBound.toFixed(1)}</span>
                            <Slider
                              value={[config.deBandConfig.upperBound]}
                              onValueChange={([value]) => handleDEBandUpdate({ upperBound: value })}
                              min={config.tensionSignal.currentValue * 1.05}
                              max={config.tensionSignal.currentValue * 2}
                              step={0.1}
                              className="flex-1"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Breach Analysis */}
                      <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                        <div className="text-center">
                          <div className="text-lg font-semibold">
                            {config.deBandConfig.breachFrequency.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Historical Breaches
                          </div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-semibold ${getRiskColor(config.deBandConfig.riskLevel)}`}>
                            {config.deBandConfig.riskLevel.toUpperCase()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Risk Level
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>

            <TabsContent value="srt" className="space-y-4 mt-0">
              <div className="space-y-4">
                <h4 className="text-sm font-medium">
                  Strategic Response Time (SRT) Horizon
                </h4>

                <div className="grid grid-cols-1 gap-3">
                  {srtHorizonTemplates.map((horizon) => (
                    <motion.div
                      key={horizon.id}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Card 
                        className={`p-4 cursor-pointer transition-all ${
                          config.srtHorizon?.id === horizon.id 
                            ? 'ring-2 ring-primary bg-primary/5' 
                            : 'hover:border-primary/50'
                        }`}
                        onClick={() => handleSRTSelect(horizon)}
                      >
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4" />
                              <h5 className="font-medium">{horizon.label}</h5>
                              {horizon.recommended && (
                                <Badge variant="secondary" className="text-xs bg-green-500/10 text-green-600">
                                  Recommended
                                </Badge>
                              )}
                            </div>
                          </div>

                          <p className="text-sm text-muted-foreground">
                            {horizon.description}
                          </p>

                          <div className="space-y-1">
                            <div className="text-xs font-medium text-muted-foreground">
                              Implications:
                            </div>
                            <ul className="text-xs text-muted-foreground space-y-1">
                              {horizon.implications.map((implication, index) => (
                                <li key={index} className="flex items-center gap-2">
                                  <div className="w-1 h-1 rounded-full bg-current" />
                                  {implication}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </div>

                {/* Custom SRT Option */}
                <Card className="p-4 border-dashed">
                  <div className="space-y-3">
                    <div className="flex items-center gap-2">
                      <Settings className="h-4 w-4" />
                      <h5 className="font-medium">Custom Horizon</h5>
                    </div>
                    <div className="flex items-center gap-4">
                      <Slider
                        value={[config.customSRTMonths || 6]}
                        onValueChange={([value]) => onConfigChange({ ...config, customSRTMonths: value })}
                        min={1}
                        max={36}
                        step={1}
                        className="flex-1"
                      />
                      <span className="text-sm font-medium w-16">
                        {config.customSRTMonths || 6} months
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </Card>
    </TooltipProvider>
  );
};