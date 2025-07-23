import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Play, 
  CheckCircle,
  ChevronDown,
  Download,
  Save,
  Settings
} from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Switch } from '../ui/switch';
import { Badge } from '../ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Slider } from '../ui/slider';
import { toast } from '../../hooks/use-toast';

// Mock insights data
const mockInsights = [
  {
    id: 'insight-1',
    title: 'Loop A overfire at Wk2',
    summary: 'Customer onboarding loop shows 127% tension spike during week 2 implementation phases.',
    timestamp: '2 hours ago',
    category: 'pattern'
  },
  {
    id: 'insight-2', 
    title: 'API throttling reduces errors',
    summary: 'Rate limiting intervention decreased system failures by 43% while maintaining throughput.',
    timestamp: '5 hours ago',
    category: 'opportunity'
  },
  {
    id: 'insight-3',
    title: 'Team velocity correlation',
    summary: 'Sprint rhythm timing correlates with team satisfaction scores (r=0.82).',
    timestamp: '1 day ago',
    category: 'discovery'
  }
];

const parameterOptions = [
  { value: 'tension', label: 'Tension Level' },
  { value: 'srt', label: 'Sprint Rhythm Time' },
  { value: 'leverage', label: 'Leverage Point' },
  { value: 'throughput', label: 'System Throughput' }
];

export const InnovateLearnZoneWorkspace: React.FC = () => {
  const [currentInsight, setCurrentInsight] = useState(0);
  const [paramX, setParamX] = useState('');
  const [paramY, setParamY] = useState('');
  const [intensity, setIntensity] = useState([50]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [lastResult, setLastResult] = useState<number | null>(null);

  // Auto-rotate carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentInsight((prev) => (prev + 1) % mockInsights.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRunSimulation = () => {
    if (!paramX || !paramY) {
      toast({
        title: "Parameters Required",
        description: "Please select both X and Y parameters",
        variant: "destructive"
      });
      return;
    }

    const result = Math.random() * 10 - 5; // Random delta between -5 and +5
    setLastResult(result);
    
    toast({
      title: "Simulation Complete",
      description: `Δ=${result > 0 ? '+' : ''}${result.toFixed(1)}%`,
      action: (
        <button className="underline">Capture as Insight</button>
      )
    });
  };

  const handleShockRehearsal = () => {
    toast({
      title: "Shock Rehearsal Started",
      description: "Running stress test simulation...",
    });
  };

  const nextInsight = () => {
    setCurrentInsight((prev) => (prev + 1) % mockInsights.length);
  };

  const prevInsight = () => {
    setCurrentInsight((prev) => (prev - 1 + mockInsights.length) % mockInsights.length);
  };

  return (
    <div className="space-y-8">
      {/* Insight Feed Carousel */}
      <motion.div
        className="p-4 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="relative">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-white">Latest Insights</h2>
            <div className="flex items-center space-x-2">
              <button
                onClick={prevInsight}
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronLeft className="w-4 h-4 text-white" />
              </button>
              <button
                onClick={nextInsight}
                className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors"
              >
                <ChevronRight className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="relative h-40 overflow-hidden">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentInsight}
                className="absolute inset-0 bg-white/10 rounded-xl p-4 flex flex-col justify-between"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.3, type: "spring" }}
                whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.3)' }}
              >
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">
                    {mockInsights[currentInsight].title}
                  </h3>
                  <p className="text-sm text-gray-300 line-clamp-2">
                    {mockInsights[currentInsight].summary}
                  </p>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {mockInsights[currentInsight].timestamp}
                  </span>
                  <button className="text-teal-400 underline text-sm flex items-center space-x-1 hover:text-teal-300 transition-colors">
                    <span>Try Experiment</span>
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Carousel indicators */}
          <div className="flex justify-center space-x-2 mt-4">
            {mockInsights.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentInsight(index)}
                className={`w-2 h-2 rounded-full transition-colors ${
                  index === currentInsight ? 'bg-teal-400' : 'bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </motion.div>

      {/* Experiment Studio Panel */}
      <motion.div
        className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 shadow-2xl"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {/* Parameters Column */}
        <div className="space-y-4">
          <h3 className="text-xl font-semibold text-white">New Experiment</h3>
          
          <div className="space-y-4">
            <div>
              <label className="text-gray-300 text-sm mb-2 block">Parameter X</label>
              <Select value={paramX} onValueChange={setParamX}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select parameter X" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {parameterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-gray-300 text-sm mb-2 block">Parameter Y</label>
              <Select value={paramY} onValueChange={setParamY}>
                <SelectTrigger className="bg-white/10 border-white/20 text-white">
                  <SelectValue placeholder="Select parameter Y" />
                </SelectTrigger>
                <SelectContent className="bg-slate-800 border-slate-600">
                  {parameterOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value} className="text-white hover:bg-slate-700">
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-gray-300 text-sm">Intensity</label>
                <motion.div
                  className="bg-teal-500 text-white rounded-full w-8 h-6 flex items-center justify-center text-xs font-medium"
                  key={intensity[0]}
                  initial={{ scale: 0.8 }}
                  animate={{ scale: [0.8, 1.2, 1] }}
                  transition={{ duration: 0.3 }}
                >
                  {intensity[0]}
                </motion.div>
              </div>
              <div className="px-3">
                <Slider
                  value={intensity}
                  onValueChange={setIntensity}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Button
                onClick={handleRunSimulation}
                className="w-full bg-teal-500 hover:bg-teal-600 text-white rounded-full py-3 px-6"
              >
                Run Simulation
              </Button>
              
              <button
                onClick={handleShockRehearsal}
                className="w-full text-teal-300 underline text-sm hover:text-teal-200 transition-colors flex items-center justify-center space-x-1"
              >
                <span>Run Shock-Rehearsal</span>
                <Play className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>

        {/* Live Preview Column */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xl font-semibold text-white">Live Preview</h3>
          
          <motion.div
            className="w-full h-48 bg-white/10 rounded-lg flex items-center justify-center relative"
            whileHover={{ scale: 1.02 }}
          >
            {lastResult !== null ? (
              <div className="text-center">
                <div className="text-4xl font-bold text-white mb-2">
                  {lastResult > 0 ? '+' : ''}{lastResult.toFixed(1)}%
                </div>
                <div className="text-gray-300">Performance Change</div>
                <motion.div
                  className="absolute top-4 right-4 bg-teal-500 text-white rounded-full px-3 py-1 text-sm"
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  Latest Result
                </motion.div>
              </div>
            ) : (
              <div className="text-center text-gray-400">
                <div className="text-6xl mb-2">📊</div>
                <div>Run a simulation to see results</div>
              </div>
            )}
          </motion.div>
        </div>
      </motion.div>

      {/* Advanced Settings */}
      <div>
        <div className="flex justify-end">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="text-teal-300 underline text-sm hover:text-teal-200 transition-colors"
          >
            Advanced Options
          </button>
        </div>

        <AnimatePresence>
          {showAdvanced && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-4"
            >
              <div className="bg-white/5 backdrop-blur-xl rounded-xl border border-white/10 p-6 space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-medium text-white">Advanced Options</h3>
                  <motion.div
                    animate={{ rotate: showAdvanced ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  </motion.div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <h4 className="text-white font-medium">ORS Export Options</h4>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Switch />
                        <span className="text-gray-300 text-sm">Loop Data</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch />
                        <span className="text-gray-300 text-sm">Simulation Log</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch />
                        <span className="text-gray-300 text-sm">Metrics CSV</span>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Knowledge Graph</h4>
                    <div className="flex items-center justify-between">
                      <span className="text-gray-300">Enable 3D Graph</span>
                      <Switch />
                    </div>
                    <Button variant="outline" className="border-white/30 text-white w-full">
                      <Settings className="w-4 h-4 mr-2" />
                      Open Graph
                    </Button>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-white font-medium">Template Manager</h4>
                    <Select>
                      <SelectTrigger className="bg-white/10 border-white/20 text-white">
                        <SelectValue placeholder="Load template" />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-800 border-slate-600">
                        <SelectItem value="default" className="text-white">Default Setup</SelectItem>
                        <SelectItem value="stress" className="text-white">Stress Test</SelectItem>
                        <SelectItem value="optimization" className="text-white">Optimization Run</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="outline" className="border-white/30 text-white w-full">
                      <Save className="w-4 h-4 mr-2" />
                      Save as Template
                    </Button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};