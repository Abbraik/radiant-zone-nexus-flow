import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, AlertTriangle } from 'lucide-react';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Badge } from '../ui/badge';
import { generateSparklineData } from '../../services/mock/data';

interface EnhancedTensionSelectorProps {
  value?: string;
  onChange: (signal: string) => void;
  onComplete: () => void;
}

const tensionSignals = [
  { 
    value: 'fertility_rate', 
    label: 'Total Fertility Rate',
    unit: 'births/woman',
    current: 2.3,
    target: 2.1,
    breachCount: 8,
    description: 'Key indicator for natural population growth dynamics'
  },
  { 
    value: 'population_growth_rate', 
    label: 'Annual Population Growth Rate',
    unit: '%',
    current: 1.8,
    target: 1.2,
    breachCount: 12,
    description: 'Primary signal for population and development meta-loop'
  },
  { 
    value: 'resource_consumption_per_capita', 
    label: 'Resource Consumption Per Capita',
    unit: 'units/person',
    current: 8.4,
    target: 6.5,
    breachCount: 15,
    description: 'Critical for population-resource market balance'
  },
  { 
    value: 'economic_dependency_ratio', 
    label: 'Economic Dependency Ratio',
    unit: 'ratio',
    current: 0.67,
    target: 0.55,
    breachCount: 6,
    description: 'Measures economic model sustainability vs population structure'
  },
  { 
    value: 'environmental_pressure_index', 
    label: 'Environmental Pressure Index',
    unit: 'index',
    current: 7.2,
    target: 5.0,
    breachCount: 9,
    description: 'Environmental quality degradation from population pressure'
  },
  { 
    value: 'labor_market_saturation', 
    label: 'Labor Market Saturation',
    unit: '%',
    current: 78,
    target: 85,
    breachCount: 4,
    description: 'Production process efficiency and workforce balance'
  },
  { 
    value: 'inflation_rate', 
    label: 'Core Inflation Rate',
    unit: '%',
    current: 4.2,
    target: 2.5,
    breachCount: 11,
    description: 'Economic stability indicator for population-driven demand'
  },
  { 
    value: 'trade_balance_ratio', 
    label: 'Trade Balance Ratio',
    unit: 'ratio',
    current: -0.08,
    target: 0.02,
    breachCount: 7,
    description: 'Global influence loop - external trade dependencies'
  },
  { 
    value: 'social_cohesion_index', 
    label: 'Social Cohesion Index',
    unit: 'index',
    current: 6.1,
    target: 7.5,
    breachCount: 5,
    description: 'Social outcomes and community stability measures'
  },
  { 
    value: 'migration_flow_rate', 
    label: 'Net Migration Flow Rate',
    unit: 'people/1000',
    current: 12.4,
    target: 8.0,
    breachCount: 13,
    description: 'Migration and economic opportunities balance'
  },
  { 
    value: 'social_mobility_index', 
    label: 'Social Mobility Index',
    unit: 'index',
    current: 4.8,
    target: 6.5,
    breachCount: 3,
    description: 'Social structure evolution and opportunity distribution'
  },
  { 
    value: 'urban_density_pressure', 
    label: 'Urban Density Pressure',
    unit: 'people/km²',
    current: 2840,
    target: 2200,
    breachCount: 10,
    description: 'Urbanization stress on infrastructure and resources'
  }
];

const EnhancedTensionSelector: React.FC<EnhancedTensionSelectorProps> = ({ 
  value, 
  onChange, 
  onComplete 
}) => {
  const [selectedSignal, setSelectedSignal] = useState(value || '');

  const handleSignalSelect = (signalValue: string) => {
    setSelectedSignal(signalValue);
    onChange(signalValue);
    onComplete();
  };

  const generateMiniSparkline = (signal: typeof tensionSignals[0]) => {
    const points = generateSparklineData(signal.current, signal.current * 0.1, 24);
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    
    return points.map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
  };

  const getTrendIcon = (current: number, target: number) => {
    const diff = ((current - target) / target) * 100;
    if (diff > 5) return TrendingUp;
    if (diff < -5) return TrendingDown;
    return Minus;
  };

  const getTrendColor = (current: number, target: number) => {
    const diff = ((current - target) / target) * 100;
    if (Math.abs(diff) <= 5) return 'text-green-400';
    if (diff > 0) return 'text-red-400';
    return 'text-yellow-400';
  };

  const getBreachSeverity = (count: number) => {
    if (count >= 10) return 'bg-red-500';
    if (count >= 5) return 'bg-orange-500';
    if (count >= 1) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-lg font-medium text-white mb-4 block">
          Define Tension Signal
        </Label>
        <p className="text-sm text-gray-400 mb-4">
          Identify the key metric that indicates system drift and requires monitoring.
        </p>
      </div>

      {/* Signal Grid */}
      <div className="grid gap-3">
        {tensionSignals.map((signal) => {
          const points = generateMiniSparkline(signal);
          const TrendIcon = getTrendIcon(signal.current, signal.target);
          const trendColor = getTrendColor(signal.current, signal.target);
          const isSelected = selectedSignal === signal.value;
          
          return (
            <motion.button
              key={signal.value}
              onClick={() => handleSignalSelect(signal.value)}
              className={`
                p-4 rounded-lg border-2 transition-all duration-200 text-left
                ${isSelected 
                  ? 'border-teal-500 bg-teal-500/10' 
                  : 'border-white/10 bg-white/5 hover:border-white/30'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="text-white font-medium text-sm mb-1">{signal.label}</h3>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-bold text-white">
                      {signal.current}
                      <span className="text-sm text-gray-400 ml-1">{signal.unit}</span>
                    </span>
                    <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                  </div>
                </div>
                
                {/* Mini Sparkline */}
                <div className="w-20 h-8">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <polyline
                      points={points}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      className="text-teal-400"
                    />
                  </svg>
                </div>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="text-xs text-gray-400">
                  Target: <span className="text-white">{signal.target} {signal.unit}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {signal.breachCount > 0 && (
                    <Badge 
                      variant="secondary" 
                      className={`text-xs ${getBreachSeverity(signal.breachCount)} text-white`}
                    >
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      {signal.breachCount} breaches
                    </Badge>
                  )}
                </div>
              </div>
            </motion.button>
          );
        })}
      </div>

      {/* Selected Signal Summary */}
      {selectedSignal && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="p-4 bg-teal-500/10 rounded-lg border border-teal-500/30"
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
            <span className="text-sm font-medium text-teal-300">
              Selected Tension Signal
            </span>
          </div>
          <p className="text-sm text-gray-300">
            {tensionSignals.find(s => s.value === selectedSignal)?.label} will be monitored 
            for system drift and DE-Band breach detection.
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default EnhancedTensionSelector;