
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Play, Target, Database, Zap, Users, Lightbulb, ArrowRight, BarChart, Activity } from 'lucide-react';
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
import LeveragePointPicker from '../widgets/LeveragePointPicker';
import LoopMetadataForm from '../widgets/LoopMetadataForm';
import DataExplorerWidget from '../widgets/DataExplorerWidget';
import Enhanced3DDigitalTwin from '../widgets/Enhanced3DDigitalTwin';
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
  { value: 'fertility_rate', label: 'Total Fertility Rate' },
  { value: 'population_growth_rate', label: 'Population Growth Rate' },
  { value: 'resource_consumption_per_capita', label: 'Resource Consumption Per Capita' },
  { value: 'economic_dependency_ratio', label: 'Economic Dependency Ratio' },
  { value: 'environmental_pressure_index', label: 'Environmental Pressure Index' },
  { value: 'migration_flow_rate', label: 'Migration Flow Rate' },
  { value: 'social_cohesion_index', label: 'Social Cohesion Index' },
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
  const [selectedLeveragePoint, setSelectedLeveragePoint] = useState('');
  const [loopMetadata, setLoopMetadata] = useState({});
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [showDataExplorer, setShowDataExplorer] = useState(false);
  const [showDigitalTwin, setShowDigitalTwin] = useState(false);

  // Step configuration - expanded to 7 steps for Phase 2
  const steps = [
    { id: 'loop', title: 'Select Loop', completed: !!selectedLoop, active: currentStep === 1 },
    { id: 'tension', title: 'Tension Signal', completed: !!selectedSignal, active: currentStep === 2 },
    { id: 'deband', title: 'DE-Band', completed: currentStep > 3, active: currentStep === 3 },
    { id: 'srt', title: 'SRT Horizon', completed: currentStep > 4, active: currentStep === 4 },
    { id: 'leverage', title: 'Leverage Point', completed: !!selectedLeveragePoint, active: currentStep === 5 },
    { id: 'metadata', title: 'Metadata', completed: currentStep > 6, active: currentStep === 6 },
    { id: 'validate', title: 'Validate', completed: currentStep > 7, active: currentStep === 7 },
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
      case 5: return !!selectedLeveragePoint;
      case 6: return true; // Metadata is optional but can proceed
      case 7: return true; // Validation step
      default: return false;
    }
  };

  const handleSubmit = () => {
    console.log('Starting sprint with data:', { 
      ...formData, 
      loop: selectedLoop,
      signal: selectedSignal,
      deBand: deBandConfig,
      leveragePoint: selectedLeveragePoint,
      metadata: loopMetadata
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
              >
                <LeveragePointPicker
                  value={selectedLeveragePoint}
                  onChange={setSelectedLeveragePoint}
                  onComplete={() => setCurrentStep(6)}
                />
              </motion.div>
            )}

            {currentStep === 6 && (
              <motion.div
                key="metadata-form"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
              >
                <LoopMetadataForm
                  value={loopMetadata}
                  onChange={setLoopMetadata}
                  onComplete={() => setCurrentStep(7)}
                />
              </motion.div>
            )}

            {currentStep === 7 && (
              <motion.div
                key="validation-step"
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <Label className="text-lg font-medium text-white mb-4 block">
                    Validate & Launch
                  </Label>
                  <p className="text-sm text-gray-400 mb-6">
                    Review your configuration, explore historical data, and simulate outcomes before launching the sprint.
                  </p>
                </div>

                {/* Validation Options */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button
                    variant="outline"
                    onClick={() => setShowDataExplorer(!showDataExplorer)}
                    className="h-24 flex flex-col items-center justify-center border-teal-500 text-teal-300 hover:bg-teal-500 hover:text-white"
                  >
                    <BarChart className="w-6 h-6 mb-2" />
                    <span>Explore Historical Data</span>
                    <span className="text-xs opacity-70">Validate parameters against past trends</span>
                  </Button>

                  <Button
                    variant="outline"
                    onClick={() => setShowDigitalTwin(!showDigitalTwin)}
                    className="h-24 flex flex-col items-center justify-center border-teal-500 text-teal-300 hover:bg-teal-500 hover:text-white"
                  >
                    <Activity className="w-6 h-6 mb-2" />
                    <span>Digital Twin Preview</span>
                    <span className="text-xs opacity-70">Simulate system dynamics</span>
                  </Button>
                </div>

                {/* Data Explorer */}
                <AnimatePresence>
                  {showDataExplorer && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <DataExplorerWidget
                        selectedSignal={selectedSignal}
                        onComplete={() => setShowDataExplorer(false)}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Digital Twin */}
                <AnimatePresence>
                  {showDigitalTwin && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Enhanced3DDigitalTwin
                        tensionLevel={70}
                        srtHorizon={formData.srt}
                        leveragePoint={selectedLeveragePoint}
                        onParameterChange={(params) => {
                          setFormData(prev => ({ ...prev, srt: params.srt }));
                        }}
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
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
            
            {currentStep < 7 ? (
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
                disabled={!selectedLeveragePoint}
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
