
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Target, Database, Zap, Users, Lightbulb, ArrowRight } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Switch } from '../ui/switch';
import { useMockSprints } from '../../hooks/use-mock-data';
import EnhancedLoopSelector from '../widgets/EnhancedLoopSelector';
import EnhancedTensionSelector from '../widgets/EnhancedTensionSelector';
import DEBandConfigurator from '../widgets/DEBandConfigurator';
import EnhancedSRTSlider from '../widgets/EnhancedSRTSlider';
import SequentialProgressBar from '../widgets/SequentialProgressBar';
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
  
  // Step management
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedLoop, setSelectedLoop] = useState<string | null>(null);
  const [selectedSignal, setSelectedSignal] = useState('');
  const [deBandConfig, setDEBandConfig] = useState({ lower: 20, upper: 80 });
  const [showAdvanced, setShowAdvanced] = useState(false);

  // Step configuration
  const steps = [
    { id: 'loop', title: 'Select Loop', completed: !!selectedLoop, active: currentStep === 1 },
    { id: 'tension', title: 'Tension Signal', completed: !!selectedSignal, active: currentStep === 2 },
    { id: 'deband', title: 'DE-Band', completed: currentStep > 3, active: currentStep === 3 },
    { id: 'srt', title: 'SRT Horizon', completed: currentStep > 4, active: currentStep === 4 },
    { id: 'leverage', title: 'Leverage Point', completed: currentStep > 5, active: currentStep === 5 },
  ];

  const currentSprint = sprints?.[0];
  const weekProgress = currentSprint ? (currentSprint.week / currentSprint.totalWeeks) * 100 : 33;

  const handleNext = () => {
    if (canProceed()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1: return !!selectedLoop;
      case 2: return !!selectedSignal;
      case 3: return true; // DE-Band is always configurable
      case 4: return true; // SRT is always set
      case 5: return !!formData.leverage;
      default: return false;
    }
  };

  const handleSubmit = () => {
    console.log('Starting sprint with data:', { 
      ...formData, 
      loop: selectedLoop,
      signal: selectedSignal,
      deBand: deBandConfig
    });
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

        {/* Progress Bar */}
        <SequentialProgressBar steps={steps} className="mb-8" />

        {/* Sequential Content */}
        <div className="space-y-8">
          <AnimatePresence mode="wait">
            {currentStep === 1 && (
              <motion.div
                key="loop-selection"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <EnhancedLoopSelector
                  value={selectedLoop || undefined}
                  onChange={setSelectedLoop}
                  onComplete={() => setCurrentStep(2)}
                />
              </motion.div>
            )}

            {currentStep === 2 && (
              <motion.div
                key="tension-selection"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <EnhancedTensionSelector
                  value={selectedSignal}
                  onChange={setSelectedSignal}
                  onComplete={() => setCurrentStep(3)}
                />
              </motion.div>
            )}

            {currentStep === 3 && (
              <motion.div
                key="deband-config"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <DEBandConfigurator
                  lowerBound={deBandConfig.lower}
                  upperBound={deBandConfig.upper}
                  onChange={setDEBandConfig}
                  onComplete={() => setCurrentStep(4)}
                  currentValue={67}
                  unit="score"
                />
              </motion.div>
            )}

            {currentStep === 4 && (
              <motion.div
                key="srt-horizon"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <EnhancedSRTSlider
                  value={formData.srt}
                  onChange={(value) => setFormData(prev => ({ ...prev, srt: value }))}
                  onComplete={() => setCurrentStep(5)}
                />
              </motion.div>
            )}

            {currentStep === 5 && (
              <motion.div
                key="leverage-selection"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-4"
              >
                <Label className="text-lg font-medium text-white">Choose a Leverage Point</Label>
                <div className="grid grid-cols-2 gap-3">
                  {leverageOptions.map((option) => {
                    const Icon = option.icon;
                    const isSelected = formData.leverage === option.value;
                    
                    return (
                      <motion.button
                        key={option.value}
                        onClick={() => setFormData(prev => ({ ...prev, leverage: option.value }))}
                        className={`
                          bg-white/10 rounded-xl p-4 flex flex-col items-center cursor-pointer
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
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Navigation Bar */}
        <motion.div
          className="sticky bottom-0 flex items-center justify-between pt-6 border-t border-white/10"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <div className="flex items-center gap-3">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                className="border-white/20 text-white hover:bg-white/10"
              >
                Back
              </Button>
            )}
            
            {currentStep < 5 ? (
              <Button
                onClick={handleNext}
                disabled={!canProceed()}
                className="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Continue
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={!formData.leverage}
                className="bg-teal-500 hover:bg-teal-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Play className="w-5 h-5 mr-2" />
                Start Sprint
              </Button>
            )}
          </div>
          
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
