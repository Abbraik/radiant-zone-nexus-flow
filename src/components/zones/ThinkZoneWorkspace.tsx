
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Target, Database, Zap, Users, Lightbulb } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { useMockSprints } from '../../hooks/use-mock-data';
import type { TensionLevel, LeverageType, ThinkFormData } from '../../types';

const leverageOptions = [
  {
    value: 'high-leverage' as LeverageType,
    label: 'Paradigms',
    description: 'Shift mental models & worldviews',
    icon: Target,
  },
  {
    value: 'medium-leverage' as LeverageType,
    label: 'Structure',
    description: 'Change system architecture',
    icon: Database,
  },
  {
    value: 'low-leverage' as LeverageType,
    label: 'Flows',
    description: 'Optimize information & feedback',
    icon: Zap,
  },
  {
    value: 'high-leverage' as LeverageType,
    label: 'Power',
    description: 'Redistribute decision authority',
    icon: Users,
  }
];

const tensionSignals = [
  { value: 'customer_satisfaction', label: 'Customer Satisfaction Score' },
  { value: 'system_performance', label: 'System Performance Metrics' },
  { value: 'team_velocity', label: 'Team Velocity' },
  { value: 'technical_debt', label: 'Technical Debt Index' },
  { value: 'user_engagement', label: 'User Engagement Rate' },
];

// Custom Slider Component
const CustomSlider: React.FC<{
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
}> = ({ value, onChange, min = 3, max = 24, step = 3 }) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const ticks = [3, 6, 12, 18, 24];

  return (
    <div className="relative w-full">
      {/* Track */}
      <div className="relative h-1 bg-white/20 rounded-full">
        {/* Progress */}
        <div 
          className="absolute h-full bg-gradient-to-r from-teal-400 to-teal-500 rounded-full transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
        
        {/* Handle */}
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 bg-white rounded-full shadow-lg cursor-pointer border-2 border-teal-500"
          style={{ left: `${percentage}%`, transform: 'translate(-50%, -50%)' }}
          whileHover={{ scale: 1.1, boxShadow: '0 0 20px rgba(20, 184, 166, 0.5)' }}
          whileDrag={{ scale: 1.2 }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDrag={(_, info) => {
            const rect = (info.point.x - info.offset.x) / 400; // Assuming 400px width
            const newValue = Math.round((rect * (max - min) + min) / step) * step;
            onChange(Math.max(min, Math.min(max, newValue)));
          }}
        >
          {/* Floating Value Badge */}
          <motion.div
            className="absolute -top-10 left-1/2 -translate-x-1/2 bg-teal-500 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-medium"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            whileHover={{ scale: 1.2 }}
            key={value}
          >
            {value}
          </motion.div>
        </motion.div>
      </div>
      
      {/* Tick marks */}
      <div className="flex justify-between mt-2 px-3">
        {ticks.map((tick) => (
          <button
            key={tick}
            onClick={() => onChange(tick)}
            className="text-xs text-gray-400 hover:text-white transition-colors"
          >
            {tick}
          </button>
        ))}
      </div>
    </div>
  );
};

export const ThinkZoneWorkspace: React.FC = () => {
  const navigate = useNavigate();
  const { data: sprints } = useMockSprints();
  const [formData, setFormData] = useState<ThinkFormData>({
    tension: 'medium',
    srt: 12,
    leverage: 'medium-leverage'
  });
  const [selectedSignal, setSelectedSignal] = useState('');
  const [showAdvanced, setShowAdvanced] = useState(false);

  const currentSprint = sprints?.[0];
  const weekProgress = currentSprint ? (currentSprint.week / currentSprint.totalWeeks) * 100 : 33;

  const handleSubmit = () => {
    if (!selectedSignal) {
      return;
    }
    console.log('Starting sprint with data:', { ...formData, signal: selectedSignal });
  };

  const handleLaunchStudio = () => {
    navigate('/think-zone-studio');
  };

  return (
    <motion.div
      className="w-full bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <div className="p-8 space-y-8">
        {/* Circular Progress Ring */}
        <div className="text-center">
          <div className="relative inline-block">
            <div className="w-36 h-36 relative">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="rgba(255,255,255,0.1)"
                  strokeWidth="4"
                  fill="none"
                />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="42"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  fill="none"
                  strokeLinecap="round"
                  style={{
                    strokeDasharray: `${2 * Math.PI * 42}`,
                    strokeDashoffset: `${2 * Math.PI * 42 * (1 - weekProgress / 100)}`
                  }}
                  initial={{ strokeDashoffset: 2 * Math.PI * 42 }}
                  animate={{ strokeDashoffset: 2 * Math.PI * 42 * (1 - weekProgress / 100) }}
                  transition={{ duration: 0.8, ease: "easeOut", delay: 0.3 }}
                />
                <defs>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#14b8a6" />
                    <stop offset="100%" stopColor="#06b6d4" />
                  </linearGradient>
                </defs>
              </svg>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <motion.span 
                  className="text-3xl font-bold text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.6, type: "spring", bounce: 0.4 }}
                >
                  Week 2
                </motion.span>
                <span className="text-sm text-gray-300">of 6</span>
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 mt-4 text-base">
            Define your loop's tension, target, and leverage.
          </p>
        </div>

        {/* Core Input Section */}
        <div className="space-y-8">
          {/* Tension Signal Selector */}
          <div className="space-y-3">
            <Label className="text-lg font-medium text-white">Tension Signal</Label>
            <Select value={selectedSignal} onValueChange={setSelectedSignal}>
              <SelectTrigger className="w-full bg-white/10 text-white border-white/20 rounded-lg p-3 focus:ring-2 focus:ring-teal-500 focus:border-transparent">
                <SelectValue placeholder="Select a signal..." />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                {tensionSignals.map((signal) => (
                  <SelectItem key={signal.value} value={signal.value} className="text-white hover:bg-slate-700">
                    {signal.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-sm text-gray-400">
              Choose the metric that indicates system drift.
            </p>
          </div>

          {/* SRT Horizon Slider */}
          <div className="space-y-4">
            <Label className="text-lg font-medium text-white">Target Horizon (months)</Label>
            <div className="px-3">
              <CustomSlider
                value={formData.srt}
                onChange={(value) => setFormData(prev => ({ ...prev, srt: value }))}
              />
            </div>
          </div>

          {/* Leverage Point Picker */}
          <div className="space-y-4">
            <Label className="text-lg font-medium text-white">Choose a Leverage Point</Label>
            <div className="flex gap-3 overflow-x-auto pb-2">
              {leverageOptions.map((option) => {
                const Icon = option.icon;
                const isSelected = formData.leverage === option.value;
                
                return (
                  <motion.button
                    key={option.value}
                    onClick={() => setFormData(prev => ({ ...prev, leverage: option.value }))}
                    className={`
                      min-w-[140px] bg-white/10 rounded-xl p-4 flex flex-col items-center cursor-pointer
                      border-2 transition-all duration-200
                      ${isSelected 
                        ? 'border-teal-500 -translate-y-1 shadow-lg shadow-teal-500/25' 
                        : 'border-transparent hover:border-white/30 hover:-translate-y-0.5'
                      }
                    `}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Icon className="w-8 h-8 text-teal-400 mb-2" />
                    <span className="text-white text-base font-medium mb-1">{option.label}</span>
                    <span className="text-gray-400 text-sm text-center leading-tight">
                      {option.description}
                    </span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Primary Action Bar */}
        <motion.div
          className="sticky bottom-0 flex items-center justify-between pt-6 border-t border-white/10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <motion.button
            onClick={handleSubmit}
            className="bg-teal-500 hover:bg-teal-600 text-white rounded-full py-3 px-10 text-lg font-semibold flex items-center gap-3 shadow-lg transition-all duration-200"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Play className="w-5 h-5" />
            Start Sprint
          </motion.button>
          
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-teal-300 underline text-base hover:text-teal-200 transition-colors"
          >
            Advanced Settings
          </button>
        </motion.div>

        {/* Advanced Settings Accordion */}
        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="bg-white/5 rounded-lg p-6 space-y-6 border border-white/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Advanced Settings</h3>
                  <motion.div
                    animate={{ rotate: showAdvanced ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm text-gray-300">DE-Band Configuration</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Input
                        type="number"
                        placeholder="Lower Bound"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                    <div>
                      <Input
                        type="number"
                        placeholder="Upper Bound"
                        className="bg-white/10 border-white/20 text-white placeholder:text-gray-400 focus:ring-2 focus:ring-teal-500"
                      />
                    </div>
                  </div>
                  <p className="text-xs text-gray-400">Define acceptable range for metric fluctuations.</p>
                </div>

                <div className="space-y-3">
                  <Label className="text-sm text-gray-300">Detailed SRT Options</Label>
                  <div className="flex items-center justify-between">
                    <span className="text-white">Sync Across Loops</span>
                    <Switch />
                  </div>
                </div>

                <Button 
                  variant="outline" 
                  onClick={handleLaunchStudio}
                  className="w-full text-teal-300 border-teal-300 hover:bg-teal-300 hover:text-slate-900 transition-all duration-200"
                >
                  <Lightbulb className="w-4 h-4 mr-2" />
                  Launch System Framing Studio
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};
