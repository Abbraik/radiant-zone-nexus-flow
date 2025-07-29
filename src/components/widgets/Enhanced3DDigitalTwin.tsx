import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Play, Pause, RotateCcw, Maximize, Layers, Gauge, TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Slider } from '../ui/slider';
import { Label } from '../ui/label';

interface Enhanced3DDigitalTwinProps {
  tensionLevel: number;
  srtHorizon: number;
  leveragePoint: string;
  onParameterChange: (params: { tension: number; srt: number }) => void;
}

interface SimulationFrame {
  timestamp: number;
  systemHealth: number;
  tensionLevel: number;
  resourceUtilization: number;
  stakeholderSatisfaction: number;
  adaptabilityIndex: number;
}

const Enhanced3DDigitalTwin: React.FC<Enhanced3DDigitalTwinProps> = ({
  tensionLevel,
  srtHorizon,
  leveragePoint,
  onParameterChange
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [viewMode, setViewMode] = useState<'system' | 'performance' | 'network'>('system');
  const [simulationTime, setSimulationTime] = useState(0);
  const [localTension, setLocalTension] = useState(tensionLevel);
  const [localSRT, setLocalSRT] = useState(srtHorizon);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();

  // Generate simulation data
  const generateSimulationFrame = (time: number): SimulationFrame => {
    const phase = (time / 100) * Math.PI * 2;
    const tensionImpact = localTension / 100;
    const srtImpact = localSRT / 24;
    
    return {
      timestamp: time,
      systemHealth: 80 + Math.sin(phase) * 15 * (1 - tensionImpact * 0.3),
      tensionLevel: localTension + Math.sin(phase * 2) * 10,
      resourceUtilization: 60 + Math.cos(phase) * 20 * srtImpact,
      stakeholderSatisfaction: 75 + Math.sin(phase * 0.5) * 20 * (1 - tensionImpact * 0.2),
      adaptabilityIndex: 70 + Math.cos(phase * 3) * 15 * srtImpact
    };
  };

  const currentFrame = generateSimulationFrame(simulationTime);

  // Canvas animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = () => {
      // Clear canvas
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Set canvas size
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;

      if (viewMode === 'system') {
        drawSystemView(ctx, canvas, currentFrame);
      } else if (viewMode === 'performance') {
        drawPerformanceView(ctx, canvas, currentFrame);
      } else {
        drawNetworkView(ctx, canvas, currentFrame);
      }

      if (isPlaying) {
        setSimulationTime(t => t + 1);
      }

      animationRef.current = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isPlaying, viewMode, currentFrame]);

  const drawSystemView = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: SimulationFrame) => {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const time = frame.timestamp * 0.05;

    // Draw central system core
    const coreRadius = 30 + Math.sin(time) * 5;
    const healthColor = `hsl(${frame.systemHealth * 1.2}, 70%, 60%)`;
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, coreRadius, 0, Math.PI * 2);
    ctx.fillStyle = healthColor;
    ctx.fill();
    
    // Draw orbiting components
    for (let i = 0; i < 6; i++) {
      const angle = (time + i * Math.PI / 3) % (Math.PI * 2);
      const distance = 80 + Math.sin(time + i) * 10;
      const x = centerX + Math.cos(angle) * distance;
      const y = centerY + Math.sin(angle) * distance;
      
      ctx.beginPath();
      ctx.arc(x, y, 8, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${180 + i * 30}, 60%, 70%)`;
      ctx.fill();
      
      // Draw connections
      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.lineTo(x, y);
      ctx.strokeStyle = 'rgba(20, 184, 166, 0.3)';
      ctx.stroke();
    }
  };

  const drawPerformanceView = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: SimulationFrame) => {
    const metrics = [
      { value: frame.systemHealth, label: 'Health', color: '#10b981' },
      { value: frame.resourceUtilization, label: 'Resources', color: '#f59e0b' },
      { value: frame.stakeholderSatisfaction, label: 'Satisfaction', color: '#3b82f6' },
      { value: frame.adaptabilityIndex, label: 'Adaptability', color: '#8b5cf6' }
    ];

    metrics.forEach((metric, index) => {
      const x = (canvas.width / 5) * (index + 1);
      const maxHeight = canvas.height * 0.7;
      const height = (metric.value / 100) * maxHeight;
      const y = canvas.height - height - 50;

      // Draw bar
      ctx.fillStyle = metric.color;
      ctx.fillRect(x - 20, y, 40, height);

      // Draw label
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(metric.label, x, canvas.height - 30);
      ctx.fillText(metric.value.toFixed(1), x, y - 10);
    });
  };

  const drawNetworkView = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement, frame: SimulationFrame) => {
    const nodes = 12;
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const radius = Math.min(canvas.width, canvas.height) * 0.3;

    // Draw network nodes
    for (let i = 0; i < nodes; i++) {
      const angle = (i / nodes) * Math.PI * 2;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      
      // Node size based on activity
      const activity = Math.sin(frame.timestamp * 0.1 + i) * 0.5 + 0.5;
      const nodeRadius = 8 + activity * 8;
      
      ctx.beginPath();
      ctx.arc(x, y, nodeRadius, 0, Math.PI * 2);
      ctx.fillStyle = `hsl(${frame.tensionLevel * 2 + i * 30}, 70%, 60%)`;
      ctx.fill();

      // Draw connections to adjacent nodes
      for (let j = i + 1; j < Math.min(i + 3, nodes); j++) {
        const angle2 = (j / nodes) * Math.PI * 2;
        const x2 = centerX + Math.cos(angle2) * radius;
        const y2 = centerY + Math.sin(angle2) * radius;
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x2, y2);
        ctx.strokeStyle = `rgba(20, 184, 166, ${activity * 0.5})`;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    }
  };

  const handleParameterUpdate = () => {
    onParameterChange({ tension: localTension, srt: localSRT });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div>
        <Label className="text-lg font-medium text-white mb-4 block">
          Enhanced Digital Twin Preview
        </Label>
        <p className="text-sm text-gray-400 mb-4">
          Real-time 3D simulation showing system dynamics based on your parameters.
        </p>
      </div>

      {/* Control Panel */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* View Mode Controls */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white">Visualization Mode</Label>
          <div className="flex gap-1">
            {[
              { id: 'system', label: 'System', icon: Layers },
              { id: 'performance', label: 'Performance', icon: Gauge },
              { id: 'network', label: 'Network', icon: TrendingUp }
            ].map(mode => {
              const Icon = mode.icon;
              return (
                <Button
                  key={mode.id}
                  variant={viewMode === mode.id ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode(mode.id as any)}
                  className="flex-1"
                >
                  <Icon className="w-4 h-4 mr-1" />
                  {mode.label}
                </Button>
              );
            })}
          </div>
        </div>

        {/* Simulation Controls */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white">Simulation</Label>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex-1"
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSimulationTime(0)}
            >
              <RotateCcw className="w-4 h-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
            >
              <Maximize className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Current Metrics */}
        <div className="space-y-2">
          <Label className="text-sm font-medium text-white">Current State</Label>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div>
              <span className="text-gray-400">Health:</span>
              <span className="text-green-400 ml-1">{currentFrame.systemHealth.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-400">Tension:</span>
              <span className="text-red-400 ml-1">{currentFrame.tensionLevel.toFixed(1)}</span>
            </div>
            <div>
              <span className="text-gray-400">Resources:</span>
              <span className="text-yellow-400 ml-1">{currentFrame.resourceUtilization.toFixed(1)}%</span>
            </div>
            <div>
              <span className="text-gray-400">Satisfaction:</span>
              <span className="text-blue-400 ml-1">{currentFrame.stakeholderSatisfaction.toFixed(1)}%</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3D Canvas */}
      <div className="bg-gray-900 rounded-lg border border-white/20 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="w-full h-64"
          style={{ background: 'radial-gradient(circle, #1f2937 0%, #111827 100%)' }}
        />
      </div>

      {/* Parameter Adjustment */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <Label className="text-sm font-medium text-white">
            Tension Level: {localTension}
          </Label>
          <Slider
            value={[localTension]}
            onValueChange={(value) => setLocalTension(value[0])}
            max={100}
            min={0}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-3">
          <Label className="text-sm font-medium text-white">
            SRT Horizon: {localSRT} months
          </Label>
          <Slider
            value={[localSRT]}
            onValueChange={(value) => setLocalSRT(value[0])}
            max={24}
            min={3}
            step={3}
            className="w-full"
          />
        </div>
      </div>

      {/* Real-time Feedback */}
      <div className="p-4 bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-sm font-medium text-white">Live System Analysis</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-gray-300 mb-2">Current leverage point: <span className="text-teal-300">{leveragePoint}</span></p>
            <p className="text-gray-300">
              System shows {currentFrame.systemHealth > 80 ? 'healthy' : currentFrame.systemHealth > 60 ? 'moderate' : 'stressed'} response
              to current tension levels.
            </p>
          </div>
          <div>
            <p className="text-gray-300 mb-2">Predicted outcome:</p>
            <div className="flex gap-2">
              <Badge variant="outline" className={`text-xs ${currentFrame.systemHealth > 75 ? 'border-green-500 text-green-400' : 'border-yellow-500 text-yellow-400'}`}>
                {currentFrame.systemHealth > 75 ? 'Stable' : 'Monitor'}
              </Badge>
              <Badge variant="outline" className="text-xs border-teal-500 text-teal-400">
                {localSRT <= 6 ? 'Fast Response' : localSRT <= 12 ? 'Balanced' : 'Strategic'}
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Changes Button */}
      {(localTension !== tensionLevel || localSRT !== srtHorizon) && (
        <Button 
          onClick={handleParameterUpdate}
          className="w-full bg-teal-500 hover:bg-teal-600 text-white"
        >
          Apply Parameter Changes
        </Button>
      )}
    </motion.div>
  );
};

export default Enhanced3DDigitalTwin;