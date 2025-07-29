import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, TrendingUp, Activity } from 'lucide-react';
import { Label } from '../ui/label';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';

interface EnhancedSRTSliderProps {
  value: number;
  onChange: (value: number) => void;
  onComplete: () => void;
  min?: number;
  max?: number;
  step?: number;
}

const EnhancedSRTSlider: React.FC<EnhancedSRTSliderProps> = ({ 
  value, 
  onChange, 
  onComplete,
  min = 3, 
  max = 24, 
  step = 3 
}) => {
  const [isHovering, setIsHovering] = useState(false);
  
  const percentage = ((value - min) / (max - min)) * 100;
  const ticks = [3, 6, 12, 18, 24];
  
  // Generate mock forecast data based on SRT horizon
  const generateForecastData = (horizon: number) => {
    const points = [];
    const baseValue = 75;
    for (let i = 0; i <= horizon; i++) {
      const seasonality = Math.sin((i / horizon) * Math.PI * 2) * 10;
      const trend = i * 0.5;
      const noise = (Math.random() - 0.5) * 5;
      points.push(Math.max(0, Math.min(100, baseValue + seasonality + trend + noise)));
    }
    return points;
  };

  const forecastData = generateForecastData(value);
  
  const generateForecastPath = (points: number[]) => {
    const max = Math.max(...points);
    const min = Math.min(...points);
    const range = max - min || 1;
    
    return points.map((point, index) => {
      const x = (index / (points.length - 1)) * 100;
      const y = 100 - ((point - min) / range) * 100;
      return `${x},${y}`;
    }).join(' ');
  };

  const getHorizonCategory = (months: number) => {
    if (months <= 6) return { label: 'Short-term', color: 'text-orange-400', bg: 'bg-orange-500/20' };
    if (months <= 12) return { label: 'Medium-term', color: 'text-yellow-400', bg: 'bg-yellow-500/20' };
    return { label: 'Long-term', color: 'text-green-400', bg: 'bg-green-500/20' };
  };

  const category = getHorizonCategory(value);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-lg font-medium text-white mb-4 block">
          Set SRT Horizon
        </Label>
        <p className="text-sm text-gray-400 mb-4">
          Define the strategic response timeframe (0-24 months) for system interventions.
        </p>
      </div>

      {/* Main Slider */}
      <div className="relative w-full">
        {/* Track */}
        <div className="relative h-2 bg-white/20 rounded-full">
          {/* Progress */}
          <div 
            className="absolute h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-300"
            style={{ width: `${percentage}%` }}
          />
          
          {/* Handle */}
          <motion.div
            className="absolute top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg cursor-pointer border-2 border-teal-500"
            style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
            whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(20, 184, 166, 0.5)' }}
            whileDrag={{ scale: 1.2 }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            onHoverStart={() => setIsHovering(true)}
            onHoverEnd={() => setIsHovering(false)}
            onDrag={(_, info) => {
              const rect = (info.point.x - info.offset.x) / 400; // Assuming 400px width
              const newValue = Math.round((rect * (max - min) + min) / step) * step;
              onChange(Math.max(min, Math.min(max, newValue)));
            }}
          >
            {/* Floating Value Badge */}
            <motion.div
              className={`absolute -top-12 left-1/2 -translate-x-1/2 ${category.bg} backdrop-blur-sm rounded-full px-3 py-1 flex items-center gap-2`}
              initial={{ scale: 0.8, opacity: 0.8 }}
              animate={{ 
                scale: isHovering ? 1.1 : 1,
                opacity: 1
              }}
              key={value}
            >
              <Calendar className="w-3 h-3 text-white" />
              <span className="text-white text-sm font-medium">{value}mo</span>
            </motion.div>
          </motion.div>
        </div>
        
        {/* Tick marks with quarters */}
        <div className="flex justify-between mt-4 px-3">
          {ticks.map((tick) => (
            <button
              key={tick}
              onClick={() => onChange(tick)}
              className="flex flex-col items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <span className="font-medium">{tick}</span>
              <span className="text-[10px]">Q{Math.ceil(tick / 3)}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Current Selection Info */}
      <div className="grid grid-cols-2 gap-4">
        <div className={`p-3 rounded-lg border ${category.bg} border-white/10`}>
          <div className="flex items-center gap-2 mb-1">
            <Activity className={`w-4 h-4 ${category.color}`} />
            <span className="text-sm font-medium text-white">Response Type</span>
          </div>
          <p className={`text-xs ${category.color}`}>{category.label}</p>
        </div>
        
        <div className="p-3 bg-white/5 rounded-lg border border-white/10">
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp className="w-4 h-4 text-teal-400" />
            <span className="text-sm font-medium text-white">Forecast Confidence</span>
          </div>
          <p className="text-xs text-teal-400">
            {value <= 6 ? 'High (85%)' : value <= 12 ? 'Medium (72%)' : 'Lower (58%)'}
          </p>
        </div>
      </div>

      {/* Mini Digital Twin Preview */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <Label className="text-sm font-medium text-white">Projected Impact</Label>
          <Badge variant="outline" className="text-xs">
            {value} month horizon
          </Badge>
        </div>
        
        <div className="w-full h-16 mb-2">
          <svg viewBox="0 0 100 100" className="w-full h-full">
            {/* Grid lines */}
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
            
            {/* Forecast line */}
            <polyline
              points={generateForecastPath(forecastData)}
              fill="none"
              stroke="url(#forecastGradient)"
              strokeWidth="2"
            />
            
            {/* Gradient definition */}
            <defs>
              <linearGradient id="forecastGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#14b8a6" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        
        <p className="text-xs text-gray-400">
          Simulated tension response over {value} month period. Shorter horizons enable faster corrections 
          but may miss systemic patterns.
        </p>
      </div>

      {/* Confirm Button */}
      <Button 
        onClick={onComplete}
        className="w-full bg-teal-500 hover:bg-teal-600 text-white"
      >
        Confirm SRT Horizon
      </Button>
    </motion.div>
  );
};

export default EnhancedSRTSlider;