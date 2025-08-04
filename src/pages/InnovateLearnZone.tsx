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
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Switch } from '../components/ui/switch';
import { Badge } from '../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Slider } from '../components/ui/slider';
import { toast } from '../hooks/use-toast';

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

export const InnovateLearnZone: React.FC = () => {
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
    <div className="h-full relative overflow-hidden">
      {/* Animated Backdrop */}
      <div className="absolute inset-0 bg-gradient-to-br from-background via-background-secondary to-background-tertiary">
        {/* Data-stream particle effect */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-accent rounded-full"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
              }}
              animate={{
                x: [0, Math.random() * 200 - 100],
                y: [0, Math.random() * 200 - 100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 10 + 5,
                repeat: Infinity,
                delay: Math.random() * 5,
              }}
            />
          ))}
        </div>
      </div>

      <div className="relative z-10 h-full overflow-auto p-6">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Hero Carousel: Insight Feed */}
          <motion.div
            className="max-w-4xl mx-auto p-4 glass rounded-2xl border border-border-subtle shadow-elegant"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="relative">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-foreground">Latest Insights</h2>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={prevInsight}
                    className="w-8 h-8 glass rounded-full flex items-center justify-center hover:bg-glass-accent transition-colors"
                  >
                    <ChevronLeft className="w-4 h-4 text-foreground" />
                  </button>
                  <button
                    onClick={nextInsight}
                    className="w-8 h-8 glass rounded-full flex items-center justify-center hover:bg-glass-accent transition-colors"
                  >
                    <ChevronRight className="w-4 h-4 text-foreground" />
                  </button>
                </div>
              </div>

              <div className="relative h-40 overflow-hidden">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentInsight}
                    className="absolute inset-0 glass rounded-xl p-4 flex flex-col justify-between"
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3, type: "spring" }}
                    whileHover={{ y: -4, boxShadow: '0 8px 25px rgba(0,0,0,0.3)' }}
                  >
                    <div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">
                        {mockInsights[currentInsight].title}
                      </h3>
                      <p className="text-sm text-foreground-subtle line-clamp-2">
                        {mockInsights[currentInsight].summary}
                      </p>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted-foreground">
                        {mockInsights[currentInsight].timestamp}
                      </span>
                      <button className="text-accent underline text-sm flex items-center space-x-1 hover:text-accent/80 transition-colors">
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
                      index === currentInsight ? 'bg-accent' : 'bg-muted/50'
                    }`}
                  />
                ))}
              </div>
            </div>
          </motion.div>

          {/* Experiment Studio Panel */}
          <motion.div
            className="max-w-4xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 glass rounded-2xl border border-border-subtle shadow-elegant"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Parameters Column */}
            <div className="space-y-4">
              <h3 className="text-xl font-semibold text-foreground">New Experiment</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="text-foreground-subtle text-sm mb-2 block">Parameter X</label>
                  <Select value={paramX} onValueChange={setParamX}>
                    <SelectTrigger className="glass border-border-subtle text-foreground">
                      <SelectValue placeholder="Select parameter X" />
                    </SelectTrigger>
                    <SelectContent className="glass-secondary border-border-subtle">
                      {parameterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-foreground hover:bg-glass-accent">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-foreground-subtle text-sm mb-2 block">Parameter Y</label>
                  <Select value={paramY} onValueChange={setParamY}>
                    <SelectTrigger className="glass border-border-subtle text-foreground">
                      <SelectValue placeholder="Select parameter Y" />
                    </SelectTrigger>
                    <SelectContent className="glass-secondary border-border-subtle">
                      {parameterOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-foreground hover:bg-glass-accent">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-foreground-subtle text-sm">Intensity</label>
                    <motion.div
                      className="bg-accent text-foreground rounded-full w-8 h-6 flex items-center justify-center text-xs font-medium"
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
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground rounded-full py-3 px-6"
                  >
                    Run Simulation
                  </Button>
                  
                  <button
                    onClick={handleShockRehearsal}
                    className="w-full text-accent underline text-sm hover:text-accent/80 transition-colors flex items-center justify-center space-x-1"
                  >
                    <span>Run Shock-Rehearsal</span>
                    <Play className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>

            {/* Live Preview Column */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-xl font-semibold text-foreground">Live Preview</h3>
              
              <motion.div
                className="w-full h-48 glass rounded-lg flex items-center justify-center relative"
                whileHover={{ scale: 1.02 }}
              >
                {lastResult !== null ? (
                  <div className="text-center">
                    <div className="text-4xl font-bold text-foreground mb-2">
                      {lastResult > 0 ? '+' : ''}{lastResult.toFixed(1)}%
                    </div>
                    <div className="text-foreground-subtle">Performance Change</div>
                    <motion.div
                      className="absolute top-4 right-4 bg-accent text-accent-foreground rounded-full px-3 py-1 text-sm"
                      animate={{ scale: [1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Latest Result
                    </motion.div>
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground">
                    <div className="text-6xl mb-2">📊</div>
                    <div>Run a simulation to see results</div>
                  </div>
                )}
              </motion.div>
            </div>
          </motion.div>

          {/* Advanced Settings Accordion */}
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-end">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="text-accent underline text-sm hover:text-accent/80 transition-colors"
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
                  <div className="glass rounded-xl border border-border-subtle p-6 space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-lg font-medium text-foreground">Advanced Options</h3>
                      <motion.div
                        animate={{ rotate: showAdvanced ? 180 : 0 }}
                        transition={{ duration: 0.2 }}
                      >
                        <ChevronDown className="w-5 h-5 text-foreground-subtle" />
                      </motion.div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <h4 className="text-foreground font-medium">ORS Export Options</h4>
                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Switch />
                            <span className="text-foreground-subtle text-sm">Loop Data</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch />
                            <span className="text-foreground-subtle text-sm">Simulation Log</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Switch />
                            <span className="text-foreground-subtle text-sm">Metrics CSV</span>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-foreground font-medium">Knowledge Graph</h4>
                        <div className="flex items-center justify-between">
                          <span className="text-foreground-subtle">Enable 3D Graph</span>
                          <Switch />
                        </div>
                        <Button variant="outline" className="border-border-subtle text-foreground w-full">
                          <Settings className="w-4 h-4 mr-2" />
                          Open Graph
                        </Button>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-foreground font-medium">Template Manager</h4>
                        <Select>
                          <SelectTrigger className="glass border-border-subtle text-foreground">
                            <SelectValue placeholder="Load template" />
                          </SelectTrigger>
                          <SelectContent className="glass-secondary border-border-subtle">
                            <SelectItem value="default" className="text-foreground">Default Setup</SelectItem>
                            <SelectItem value="stress" className="text-foreground">Stress Test</SelectItem>
                            <SelectItem value="optimization" className="text-foreground">Optimization Run</SelectItem>
                          </SelectContent>
                        </Select>
                        <Button variant="outline" className="border-border-subtle text-foreground w-full">
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
      </div>
    </div>
  );
};