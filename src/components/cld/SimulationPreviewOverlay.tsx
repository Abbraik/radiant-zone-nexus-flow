import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Download, 
  X,
  TrendingUp,
  Activity,
  BarChart3
} from 'lucide-react';
import { Button } from '../ui/button';
import { Slider } from '../ui/slider';
import { Sparkline } from '../ui/sparkline';
import { CLDNode, SimulationResults } from '../../types/cld';

interface SimulationPreviewOverlayProps {
  results: SimulationResults;
  nodes: CLDNode[];
  onClose: () => void;
}

export const SimulationPreviewOverlay: React.FC<SimulationPreviewOverlayProps> = ({
  results,
  nodes,
  onClose
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedNodeIds, setSelectedNodeIds] = useState<Set<string>>(new Set());
  const [hoveredResult, setHoveredResult] = useState<{ nodeId: string; valueIndex: number } | null>(null);
  const intervalRef = useRef<NodeJS.Timeout>();

  const maxTime = results.timeSteps - 1;

  const handlePlayPause = useCallback(() => {
    if (isPlaying) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
      intervalRef.current = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= maxTime) {
            setIsPlaying(false);
            return 0;
          }
          return prev + 1;
        });
      }, Math.max(50, 200 / playbackSpeed));
    }
  }, [isPlaying, maxTime, playbackSpeed]);

  const handleTimeChange = useCallback((value: number[]) => {
    setCurrentTime(value[0]);
    if (isPlaying) {
      setIsPlaying(false);
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = undefined;
      }
    }
  }, [isPlaying]);

  const handleNodeToggle = useCallback((nodeId: string) => {
    setSelectedNodeIds(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  }, []);

  const handleExportCSV = useCallback(() => {
    const csv = ['Time,' + results.results.map(r => {
      const node = nodes.find(n => n.id === r.nodeId);
      return node?.label || r.nodeId;
    }).join(',')];
    
    for (let i = 0; i < results.timeSteps; i++) {
      const row = [i.toString()];
      results.results.forEach(result => {
        row.push(result.values[i]?.toFixed(2) || '0');
      });
      csv.push(row.join(','));
    }
    
    const blob = new Blob([csv.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'simulation_results.csv';
    a.click();
    URL.revokeObjectURL(url);
  }, [results, nodes]);

  const getCurrentValue = useCallback((nodeId: string) => {
    const result = results.results.find(r => r.nodeId === nodeId);
    return result?.values[currentTime] || 0;
  }, [results, currentTime]);

  const getValueAtTime = useCallback((nodeId: string, timeIndex: number) => {
    const result = results.results.find(r => r.nodeId === nodeId);
    return result?.values[timeIndex] || 0;
  }, [results]);

  React.useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-slate-800 rounded-2xl border border-slate-600 shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-600">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-teal-600 rounded-lg flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Simulation Results</h2>
              <p className="text-gray-400 text-sm">
                {results.duration} months • {results.timeSteps} time steps • {results.convergence}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="border-slate-600 text-white hover:bg-slate-700"
            >
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Content */}
        <div className="flex h-96">
          {/* Variables List */}
          <div className="w-80 border-r border-slate-600 overflow-y-auto">
            <div className="p-4">
              <h3 className="text-white font-medium mb-3 flex items-center gap-2">
                <BarChart3 className="w-4 h-4" />
                Variables
              </h3>
              
              <div className="space-y-2">
                {results.results.map(result => {
                  const node = nodes.find(n => n.id === result.nodeId);
                  const isSelected = selectedNodeIds.has(result.nodeId);
                  const currentValue = getCurrentValue(result.nodeId);
                  
                  return (
                    <motion.div
                      key={result.nodeId}
                      className={`
                        p-3 rounded-lg cursor-pointer border transition-all duration-200
                        ${isSelected 
                          ? 'bg-teal-600/20 border-teal-500' 
                          : 'bg-slate-700/50 border-slate-600 hover:border-slate-500'
                        }
                      `}
                      onClick={() => handleNodeToggle(result.nodeId)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium text-sm truncate">
                          {node?.label || result.nodeId}
                        </span>
                        <span className="text-gray-400 text-xs">
                          {currentValue.toFixed(2)}
                        </span>
                      </div>
                      
                      {/* Sparkline */}
                      <div 
                        className="h-8"
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const valueIndex = Math.floor((x / rect.width) * result.values.length);
                          setHoveredResult({ nodeId: result.nodeId, valueIndex });
                        }}
                        onMouseLeave={() => setHoveredResult(null)}
                      >
                        <Sparkline
                          data={result.values}
                          width={240}
                          height={32}
                          color={isSelected ? '#14b8a6' : '#6b7280'}
                          fillColor={isSelected ? '#14b8a6' : undefined}
                        />
                      </div>
                      
                      {/* Value tooltip */}
                      <AnimatePresence>
                        {hoveredResult?.nodeId === result.nodeId && (
                          <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            className="text-xs text-gray-400 mt-1"
                          >
                            Value: {getValueAtTime(result.nodeId, hoveredResult.valueIndex).toFixed(2)}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Main Chart Area */}
          <div className="flex-1 p-6">
            <div className="h-full bg-slate-700/30 rounded-lg border border-slate-600 p-4">
              {selectedNodeIds.size === 0 ? (
                <div className="h-full flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <TrendingUp className="w-12 h-12 mx-auto mb-4 opacity-50" />
                    <p>Select variables to view their trends</p>
                  </div>
                </div>
              ) : (
                <div className="h-full relative">
                  {/* Chart visualization would go here */}
                  <div className="text-center text-gray-400 mt-20">
                    <p>Interactive chart for selected variables</p>
                    <p className="text-sm mt-2">
                      Selected: {Array.from(selectedNodeIds).map(id => {
                        const node = nodes.find(n => n.id === id);
                        return node?.label || id;
                      }).join(', ')}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Playback Controls */}
        <div className="p-6 border-t border-slate-600">
          <div className="space-y-4">
            {/* Timeline */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm text-gray-400">
                <span>Time: {currentTime}/{maxTime}</span>
                <span>Progress: {((currentTime / maxTime) * 100).toFixed(1)}%</span>
              </div>
              
              <Slider
                value={[currentTime]}
                onValueChange={handleTimeChange}
                max={maxTime}
                min={0}
                step={1}
                className="w-full"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTime(0)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  <SkipBack className="w-4 h-4" />
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handlePlayPause}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </Button>
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentTime(maxTime)}
                  className="border-slate-600 text-white hover:bg-slate-700"
                >
                  <SkipForward className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-gray-400 text-sm">Speed:</span>
                <div className="flex gap-1">
                  {[0.5, 1, 2, 4].map(speed => (
                    <Button
                      key={speed}
                      variant={playbackSpeed === speed ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setPlaybackSpeed(speed)}
                      className={
                        playbackSpeed === speed
                          ? 'bg-teal-600 hover:bg-teal-700'
                          : 'border-slate-600 text-white hover:bg-slate-700'
                      }
                    >
                      {speed}x
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};