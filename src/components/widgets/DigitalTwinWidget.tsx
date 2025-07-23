import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, Zap, TrendingUp, Cpu, Wifi, BarChart3 } from 'lucide-react';

interface DigitalTwinWidgetProps {
  task: any;
}

const DigitalTwinWidget: React.FC<DigitalTwinWidgetProps> = ({ task }) => {
  // Generate realistic sample data based on task
  const [metrics, setMetrics] = useState(() => {
    const tensions = ['low', 'medium', 'high'] as const;
    const tension = tensions[Math.floor(Math.random() * tensions.length)];
    
    return {
      srt: (Math.random() * 0.5 + 0.2).toFixed(2),
      tension,
      throughput: (50 + Math.random() * 30).toFixed(1),
      responseTime: (1.5 + Math.random() * 1.0).toFixed(2),
      resourceUtilization: Math.floor(60 + Math.random() * 35),
      networkLoad: Math.floor(30 + Math.random() * 40),
      systemHealth: Math.floor(70 + Math.random() * 25)
    };
  });

  const [animationData, setAnimationData] = useState<number[]>([]);

  useEffect(() => {
    // Generate animated wave data
    const generateWave = () => {
      const data = [];
      for (let i = 0; i < 50; i++) {
        const base = metrics.tension === 'high' ? 0.8 : metrics.tension === 'medium' ? 0.5 : 0.3;
        const wave = Math.sin((Date.now() / 1000 + i * 0.2)) * base;
        data.push(50 + wave * 30);
      }
      return data;
    };

    const interval = setInterval(() => {
      setAnimationData(generateWave());
      
      // Slightly vary metrics for realism
      setMetrics(prev => ({
        ...prev,
        throughput: (parseFloat(prev.throughput) + (Math.random() - 0.5) * 2).toFixed(1),
        responseTime: Math.max(0.1, parseFloat(prev.responseTime) + (Math.random() - 0.5) * 0.1).toFixed(2),
        resourceUtilization: Math.max(0, Math.min(100, prev.resourceUtilization + Math.floor((Math.random() - 0.5) * 5))),
        networkLoad: Math.max(0, Math.min(100, prev.networkLoad + Math.floor((Math.random() - 0.5) * 3))),
        systemHealth: Math.max(0, Math.min(100, prev.systemHealth + Math.floor((Math.random() - 0.5) * 2)))
      }));
    }, 100);

    return () => clearInterval(interval);
  }, [metrics.tension]);

  const getTensionColor = (tension: string) => {
    switch (tension) {
      case 'high': return 'text-destructive bg-destructive/20 border-destructive/30';
      case 'medium': return 'text-warning bg-warning/20 border-warning/30';
      case 'low': return 'text-success bg-success/20 border-success/30';
      default: return 'text-foreground-subtle bg-background-secondary border-border-subtle';
    }
  };

  const getHealthColor = (value: number) => {
    if (value >= 80) return 'text-success';
    if (value >= 60) return 'text-warning';
    return 'text-destructive';
  };

  return (
    <Card className="w-full glass-secondary border-border-subtle/20">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-primary" />
          Digital Twin Preview
          <Badge variant="outline" className={`text-xs ${getTensionColor(metrics.tension)}`}>
            {metrics.tension} tension
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Real-time Wave Visualization */}
        <div className="h-32 bg-gradient-to-br from-background via-background-secondary to-background-tertiary rounded-lg p-4 mb-4 relative overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <svg width="100%" height="100%" viewBox="0 0 400 100" className="opacity-70">
              <defs>
                <linearGradient id="waveGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                  <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.8" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                </linearGradient>
              </defs>
              
              {/* Animated Wave Path */}
              <path
                d={`M 0 50 ${animationData.map((point, index) => `L ${index * 8} ${point}`).join(' ')}`}
                stroke="hsl(var(--primary))"
                strokeWidth="2"
                fill="none"
                className="animate-pulse"
              />
              
              {/* Wave Fill */}
              <path
                d={`M 0 50 ${animationData.map((point, index) => `L ${index * 8} ${point}`).join(' ')} L 400 100 L 0 100 Z`}
                fill="url(#waveGradient)"
              />
              
              {/* Floating Particles */}
              {[...Array(5)].map((_, i) => (
                <circle
                  key={i}
                  cx={50 + i * 80}
                  cy={30 + Math.sin(Date.now() / 1000 + i) * 10}
                  r="2"
                  fill="hsl(var(--accent))"
                  className="animate-pulse"
                />
              ))}
            </svg>
          </div>
          
          {/* Overlay Labels */}
          <div className="relative z-10 text-xs text-foreground-subtle">
            <div className="flex justify-between">
              <span>System Response Curve</span>
              <span>SRT: {metrics.srt}</span>
            </div>
          </div>
        </div>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-success" />
              <div>
                <div className="text-sm font-medium">Throughput</div>
                <div className="text-lg font-bold text-success">{metrics.throughput}</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Zap className="h-4 w-4 text-warning" />
              <div>
                <div className="text-sm font-medium">Response Time</div>
                <div className="text-lg font-bold text-warning">{metrics.responseTime}s</div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Wifi className="h-4 w-4 text-primary" />
              <div>
                <div className="text-sm font-medium">Network Load</div>
                <div className={`text-lg font-bold ${getHealthColor(metrics.networkLoad)}`}>
                  {metrics.networkLoad}%
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-accent" />
              <div>
                <div className="text-sm font-medium">CPU Usage</div>
                <div className={`text-lg font-bold ${getHealthColor(100 - metrics.resourceUtilization)}`}>
                  {metrics.resourceUtilization}%
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4 text-info" />
              <div>
                <div className="text-sm font-medium">System Health</div>
                <div className={`text-lg font-bold ${getHealthColor(metrics.systemHealth)}`}>
                  {metrics.systemHealth}%
                </div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div>
              <div className="text-sm font-medium mb-1">Overall Performance</div>
              <div className="w-full bg-background-tertiary rounded-full h-2">
                <div 
                  className="h-2 rounded-full bg-primary transition-all duration-300"
                  style={{ width: `${metrics.systemHealth}%` }}
                />
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-4 text-center">
          <p className="text-xs text-foreground-subtle">
            Live Digital Twin Analysis for: {task?.title}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default DigitalTwinWidget;