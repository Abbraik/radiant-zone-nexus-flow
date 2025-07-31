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

const getArchetypeSpecificTensions = (archetypeId?: string): TensionSignal[] => {
  switch (archetypeId) {
    case 'population-development-loop':
      return [
        {
          id: 'resource-efficiency',
          name: 'Resource Market Efficiency',
          description: 'Efficiency of resource allocation in the market',
          unit: '%',
          currentValue: 73,
          trend: 'down',
          category: 'economic',
          historicalData: [80, 78, 76, 75, 73]
        },
        {
          id: 'population-growth-rate',
          name: 'Population Growth Rate',
          description: 'Annual population growth rate',
          unit: '%',
          currentValue: 1.8,
          trend: 'up',
          category: 'social',
          historicalData: [1.4, 1.5, 1.6, 1.7, 1.8]
        },
        {
          id: 'economic-growth',
          name: 'Economic Growth Index',
          description: 'Overall economic development indicator',
          unit: 'index',
          currentValue: 2.3,
          trend: 'stable',
          category: 'economic',
          historicalData: [2.1, 2.2, 2.3, 2.3, 2.3]
        }
      ];

    case 'natural-population-growth':
      return [
        {
          id: 'fertility-rate',
          name: 'Total Fertility Rate',
          description: 'Average births per woman',
          unit: 'births/woman',
          currentValue: 2.1,
          trend: 'down',
          category: 'social',
          historicalData: [2.5, 2.4, 2.3, 2.2, 2.1]
        },
        {
          id: 'marriage-rate',
          name: 'Marriage Rate',
          description: 'Annual marriages per 1000 population',
          unit: 'per 1000',
          currentValue: 6.8,
          trend: 'down',
          category: 'social',
          historicalData: [8.2, 7.8, 7.4, 7.1, 6.8]
        },
        {
          id: 'youth-ratio',
          name: 'Youth Dependency Ratio',
          description: 'Ratio of youth to working age population',
          unit: '%',
          currentValue: 42.5,
          trend: 'up',
          category: 'social',
          historicalData: [38, 39.5, 40.8, 41.7, 42.5]
        }
      ];

    case 'environmental-quality-loop':
      return [
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
          id: 'water-quality',
          name: 'Water Quality Index',
          description: 'Overall water quality assessment',
          unit: 'WQI',
          currentValue: 68,
          trend: 'down',
          category: 'environmental',
          historicalData: [85, 80, 76, 72, 68]
        },
        {
          id: 'health-expenditure',
          name: 'Healthcare Expenditure',
          description: 'Public health spending as % of GDP',
          unit: '% GDP',
          currentValue: 4.2,
          trend: 'up',
          category: 'economic',
          historicalData: [3.5, 3.7, 3.9, 4.0, 4.2]
        }
      ];

    case 'economic-stability-loop':
      return [
        {
          id: 'market-volatility',
          name: 'Market Volatility Index',
          description: 'Measure of market price fluctuations',
          unit: 'index',
          currentValue: 24.5,
          trend: 'up',
          category: 'economic',
          historicalData: [18, 20, 22, 23, 24.5]
        },
        {
          id: 'employment-rate',
          name: 'Employment Rate',
          description: 'Percentage of working-age population employed',
          unit: '%',
          currentValue: 78.3,
          trend: 'stable',
          category: 'economic',
          historicalData: [77, 77.5, 78, 78.2, 78.3]
        },
        {
          id: 'consumer-confidence',
          name: 'Consumer Confidence Index',
          description: 'Consumer sentiment about economic conditions',
          unit: 'index',
          currentValue: 102.7,
          trend: 'up',
          category: 'economic',
          historicalData: [95, 98, 100, 101, 102.7]
        }
      ];

    case 'global-influence-loop':
      return [
        {
          id: 'trade-balance',
          name: 'Trade Balance',
          description: 'Difference between exports and imports',
          unit: 'billion USD',
          currentValue: -15.2,
          trend: 'down',
          category: 'economic',
          historicalData: [-8, -10, -12, -14, -15.2]
        },
        {
          id: 'currency-stability',
          name: 'Currency Stability Index',
          description: 'Measure of exchange rate volatility',
          unit: 'index',
          currentValue: 0.85,
          trend: 'down',
          category: 'economic',
          historicalData: [0.95, 0.92, 0.89, 0.87, 0.85]
        },
        {
          id: 'foreign-investment',
          name: 'Foreign Direct Investment',
          description: 'Inflow of foreign investment',
          unit: 'billion USD',
          currentValue: 12.8,
          trend: 'stable',
          category: 'economic',
          historicalData: [11.5, 12.0, 12.5, 12.7, 12.8]
        }
      ];

    case 'social-outcomes-loop':
      return [
        {
          id: 'education-index',
          name: 'Education Quality Index',
          description: 'Composite measure of education outcomes',
          unit: 'index',
          currentValue: 0.78,
          trend: 'up',
          category: 'social',
          historicalData: [0.72, 0.74, 0.76, 0.77, 0.78]
        },
        {
          id: 'healthcare-access',
          name: 'Healthcare Access Index',
          description: 'Population access to healthcare services',
          unit: '%',
          currentValue: 83.2,
          trend: 'up',
          category: 'social',
          historicalData: [78, 79.5, 81, 82.1, 83.2]
        },
        {
          id: 'social-mobility',
          name: 'Social Mobility Index',
          description: 'Opportunity for socioeconomic advancement',
          unit: 'index',
          currentValue: 0.64,
          trend: 'stable',
          category: 'social',
          historicalData: [0.61, 0.62, 0.63, 0.64, 0.64]
        }
      ];

    default:
      // Default/fallback tension signals for other loops
      return [
        {
          id: 'system-pressure',
          name: 'System Pressure Index',
          description: 'Overall stress on the system',
          unit: 'index',
          currentValue: 65.4,
          trend: 'up',
          category: 'governance',
          historicalData: [58, 60, 62, 64, 65.4]
        },
        {
          id: 'resource-scarcity',
          name: 'Resource Scarcity Index',
          description: 'Availability of key resources',
          unit: 'index',
          currentValue: 42.8,
          trend: 'up',
          category: 'economic',
          historicalData: [35, 37, 39, 41, 42.8]
        },
        {
          id: 'stakeholder-satisfaction',
          name: 'Stakeholder Satisfaction',
          description: 'Overall stakeholder contentment level',
          unit: '%',
          currentValue: 67.5,
          trend: 'down',
          category: 'governance',
          historicalData: [72, 70, 69, 68, 67.5]
        }
      ];
  }
};

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
  selectedTensionSignals?: TensionSignal[];
  onTensionSignalToggle?: (signal: TensionSignal) => void;
  multiSelect?: boolean;
}

export const ParameterPanel: React.FC<ParameterPanelProps> = ({
  config,
  onConfigChange,
  loopArchetype,
  selectedTensionSignals = [],
  onTensionSignalToggle,
  multiSelect = false
}) => {
  const [activeTab, setActiveTab] = useState('tension');
  
  // Get dynamic tension signals based on selected archetype
  const tensionSignals = getArchetypeSpecificTensions(loopArchetype);

  const isSignalSelected = (signal: TensionSignal) => {
    if (multiSelect && selectedTensionSignals) {
      return selectedTensionSignals.some(s => s.id === signal.id);
    }
    return config.tensionSignal?.id === signal.id;
  };

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
            <TabsTrigger value="deband" className="text-xs" disabled={!config.tensionSignal && (!multiSelect || selectedTensionSignals.length === 0)}>
              <Target className="h-3 w-3 mr-1" />
              DE-Band
            </TabsTrigger>
            <TabsTrigger value="srt" className="text-xs" disabled={!config.deBandConfig && (!multiSelect || selectedTensionSignals.length === 0)}>
              <Calendar className="h-3 w-3 mr-1" />
              SRT
            </TabsTrigger>
          </TabsList>

          <div className="p-4 h-full overflow-y-auto">
            <TabsContent value="tension" className="space-y-4 mt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-medium text-muted-foreground">
                    {multiSelect ? 'Select Tension Signals' : 'Select Key Tension Signal'}
                  </h4>
                  <div className="flex items-center gap-2">
                    {loopArchetype && (
                      <Badge variant="outline" className="text-xs">
                        {loopArchetype.replace(/-/g, ' ')}
                      </Badge>
                    )}
                    {multiSelect && selectedTensionSignals.length > 0 && (
                      <Badge variant="secondary" className="text-xs bg-blue-500/10 text-blue-600">
                        {selectedTensionSignals.length} selected
                      </Badge>
                    )}
                  </div>
                </div>
                
                {tensionSignals.map((signal) => (
                  <motion.div
                    key={signal.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card 
                      className={`p-4 cursor-pointer transition-all ${
                        isSignalSelected(signal)
                          ? 'ring-2 ring-primary bg-primary/5' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => {
                        if (multiSelect && onTensionSignalToggle) {
                          onTensionSignalToggle(signal);
                          // Also set this signal as the primary config signal if not already set
                          if (!config.tensionSignal) {
                            handleTensionSelect(signal);
                          }
                        } else {
                          handleTensionSelect(signal);
                        }
                      }}
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
              {(config.tensionSignal && config.deBandConfig) || (multiSelect && selectedTensionSignals.length > 0) ? (
                (() => {
                  // Use existing config or create one from first selected signal
                  const activeTensionSignal = config.tensionSignal || selectedTensionSignals[0];
                  const activeDeBandConfig = config.deBandConfig || {
                    signal: activeTensionSignal.id,
                    lowerBound: activeTensionSignal.currentValue * 0.8,
                    upperBound: activeTensionSignal.currentValue * 1.2,
                    currentValue: activeTensionSignal.currentValue,
                    breachFrequency: Math.random() * 30,
                    riskLevel: activeTensionSignal.trend === 'up' ? 'high' : activeTensionSignal.trend === 'down' ? 'medium' : 'low'
                  };

                  return (
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
                        <p>Set acceptable bounds for {activeTensionSignal.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>

                  <Card className="p-4">
                    <div className="space-y-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold">
                          {activeDeBandConfig.currentValue} {activeTensionSignal.unit}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Current {activeTensionSignal.name}
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
                             <span className="text-sm w-12">{activeDeBandConfig.lowerBound.toFixed(1)}</span>
                             <Slider
                               value={[activeDeBandConfig.lowerBound]}
                               onValueChange={([value]) => {
                                 const updatedConfig = { ...activeDeBandConfig, lowerBound: value };
                                 if (config.deBandConfig) {
                                   handleDEBandUpdate({ lowerBound: value });
                                 } else {
                                   // Auto-create config if not exists
                                   onConfigChange({
                                     ...config,
                                     tensionSignal: activeTensionSignal,
                                     deBandConfig: updatedConfig
                                   });
                                 }
                               }}
                               min={activeTensionSignal.currentValue * 0.5}
                               max={activeTensionSignal.currentValue * 0.95}
                               step={0.1}
                               className="flex-1"
                             />
                           </div>
                           
                           <div className="flex items-center gap-4">
                             <span className="text-sm w-12">{activeDeBandConfig.upperBound.toFixed(1)}</span>
                             <Slider
                               value={[activeDeBandConfig.upperBound]}
                               onValueChange={([value]) => {
                                 const updatedConfig = { ...activeDeBandConfig, upperBound: value };
                                 if (config.deBandConfig) {
                                   handleDEBandUpdate({ upperBound: value });
                                 } else {
                                   // Auto-create config if not exists
                                   onConfigChange({
                                     ...config,
                                     tensionSignal: activeTensionSignal,
                                     deBandConfig: updatedConfig
                                   });
                                 }
                               }}
                               min={activeTensionSignal.currentValue * 1.05}
                               max={activeTensionSignal.currentValue * 2}
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
                            {activeDeBandConfig.breachFrequency.toFixed(1)}%
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Historical Breaches
                          </div>
                        </div>
                        <div className="text-center">
                          <div className={`text-lg font-semibold ${getRiskColor(activeDeBandConfig.riskLevel)}`}>
                            {activeDeBandConfig.riskLevel.toUpperCase()}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            Risk Level
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </div>
                  );
                })()
              ) : (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    Please select a tension signal to configure DE-Bands
                  </p>
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