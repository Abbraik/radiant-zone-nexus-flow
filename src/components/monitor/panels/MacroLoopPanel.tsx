import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface MacroLoop {
  id: string;
  name: string;
  type: 'reinforcing' | 'balancing';
  vision: string;
  tensionSignal: number[];
  deBandValue: number;
  deBandMin: number;
  deBandMax: number;
  status: 'healthy' | 'warning' | 'critical';
  breachCount: number;
  leveragePoint: string;
}

interface MacroLoopPanelProps {
  searchQuery: string;
  onLoopSelect: (id: string, data: MacroLoop) => void;
  selectedLoopId: string | null;
}

const mockMacroLoops: MacroLoop[] = [
  {
    id: 'macro-1',
    name: 'Innovation Adoption',
    type: 'reinforcing',
    vision: 'Accelerate breakthrough solutions',
    tensionSignal: [65, 68, 72, 69, 74, 78, 82, 85, 88, 91, 94, 89],
    deBandValue: 89,
    deBandMin: 70,
    deBandMax: 95,
    status: 'healthy',
    breachCount: 0,
    leveragePoint: 'Culture & Mindset'
  },
  {
    id: 'macro-2',
    name: 'Resource Allocation',
    type: 'balancing',
    vision: 'Optimize strategic investments',
    tensionSignal: [45, 42, 38, 35, 32, 29, 26, 23, 20, 18, 15, 12],
    deBandValue: 12,
    deBandMin: 25,
    deBandMax: 85,
    status: 'critical',
    breachCount: 8,
    leveragePoint: 'Information Flow'
  },
  {
    id: 'macro-3',
    name: 'Market Response',
    type: 'reinforcing',
    vision: 'Adapt to market dynamics',
    tensionSignal: [75, 73, 71, 69, 67, 65, 63, 61, 59, 57, 55, 53],
    deBandValue: 53,
    deBandMin: 40,
    deBandMax: 80,
    status: 'warning',
    breachCount: 2,
    leveragePoint: 'Rules & Policies'
  },
  // Add more loops to fill the 3x4 grid
  ...Array.from({ length: 8 }, (_, i) => {
    const types: ('reinforcing' | 'balancing')[] = ['reinforcing', 'balancing'];
    const statuses: ('healthy' | 'warning' | 'critical')[] = ['healthy', 'warning', 'critical'];
    const leveragePoints = ['Culture & Mindset', 'Information Flow', 'Rules & Policies'];
    
    return {
      id: `macro-${i + 4}`,
      name: `Loop ${i + 4}`,
      type: types[Math.floor(Math.random() * types.length)],
      vision: 'Strategic objective alignment',
      tensionSignal: Array.from({ length: 12 }, () => Math.floor(Math.random() * 100)),
      deBandValue: Math.floor(Math.random() * 100),
      deBandMin: 20,
      deBandMax: 80,
      status: statuses[Math.floor(Math.random() * statuses.length)],
      breachCount: Math.floor(Math.random() * 10),
      leveragePoint: leveragePoints[Math.floor(Math.random() * leveragePoints.length)]
    };
  })
];

const SparklineChart: React.FC<{ data: number[]; status: string }> = ({ data, status }) => {
  const width = 80;
  const height = 24;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  const strokeColor = status === 'healthy' ? 'hsl(var(--success))' : 
                     status === 'warning' ? 'hsl(var(--warning))' : 
                     'hsl(var(--destructive))';

  return (
    <svg width={width} height={height} className="overflow-visible">
      <motion.polyline
        fill="none"
        stroke={strokeColor}
        strokeWidth="1.5"
        points={points}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeInOut" }}
      />
    </svg>
  );
};

const DEBandGauge: React.FC<{ value: number; min: number; max: number; status: string }> = ({ 
  value, min, max, status 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const radius = 24;
  const strokeWidth = 4;
  const circumference = Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  const strokeColor = status === 'healthy' ? 'hsl(var(--success))' : 
                     status === 'warning' ? 'hsl(var(--warning))' : 
                     'hsl(var(--destructive))';

  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 transform -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={circumference * 0.5}
        />
        <motion.circle
          cx="24"
          cy="24"
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset + circumference * 0.5}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: strokeDashoffset + circumference * 0.5 }}
          transition={{ duration: 1, delay: 0.5 }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium">{value}</span>
      </div>
    </div>
  );
};

export function MacroLoopPanel({ searchQuery, onLoopSelect, selectedLoopId }: MacroLoopPanelProps) {
  const [hoveredLoop, setHoveredLoop] = useState<string | null>(null);

  const filteredLoops = mockMacroLoops.filter(loop =>
    loop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loop.vision.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate aggregate stats for "All Loops" card
  const totalLoops = mockMacroLoops.length;
  const healthyCount = mockMacroLoops.filter(l => l.status === 'healthy').length;
  const warningCount = mockMacroLoops.filter(l => l.status === 'warning').length;
  const criticalCount = mockMacroLoops.filter(l => l.status === 'critical').length;

  return (
    <div className="h-full">
      <motion.div
        className="h-full backdrop-blur-xl bg-background/40 rounded-2xl border border-border/50 p-6"
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Macro Loops</h2>
          <p className="text-sm text-muted-foreground">System-level feedback loops and strategic indicators</p>
        </div>

        {/* Loop Cards Grid */}
        <div className="grid grid-cols-3 gap-4 h-[calc(100%-5rem)]">
          {/* All Loops Summary Card */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="col-span-1"
          >
            <Card className="h-full bg-background/60 backdrop-blur-sm border-border/50 cursor-pointer hover:border-primary/50 transition-all duration-300">
              <CardContent className="p-4 h-full flex flex-col justify-between">
                <div>
                  <h3 className="font-medium text-sm mb-2 text-foreground">All Loops</h3>
                  <div className="text-2xl font-bold text-foreground mb-2">{totalLoops}</div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-success">Healthy</span>
                      <span>{healthyCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-warning">Warning</span>
                      <span>{warningCount}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-destructive">Critical</span>
                      <span>{criticalCount}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-center">
                  <Activity className="h-8 w-8 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Individual Loop Cards */}
          {filteredLoops.slice(0, 11).map((loop) => (
            <motion.div
              key={loop.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setHoveredLoop(loop.id)}
              onHoverEnd={() => setHoveredLoop(null)}
              className="relative"
            >
              <Card 
                className={`h-full bg-background/60 backdrop-blur-sm border-border/50 cursor-pointer transition-all duration-300 ${
                  selectedLoopId === loop.id ? 'border-primary ring-1 ring-primary/20' : 'hover:border-primary/50'
                }`}
                onClick={() => onLoopSelect(loop.id, loop)}
              >
                <CardContent className="p-4 h-full flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-medium text-sm text-foreground truncate">{loop.name}</h3>
                      <div className="flex items-center space-x-1">
                        {loop.type === 'reinforcing' ? (
                          <TrendingUp className="h-3 w-3 text-blue-500" />
                        ) : (
                          <TrendingDown className="h-3 w-3 text-purple-500" />
                        )}
                        <motion.div
                          className={`w-2 h-2 rounded-full ${
                            loop.status === 'healthy' ? 'bg-success' :
                            loop.status === 'warning' ? 'bg-warning' : 'bg-destructive'
                          }`}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{ duration: 2, repeat: Infinity }}
                        />
                      </div>
                    </div>
                    
                    <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{loop.vision}</p>
                    
                    <div className="flex items-center justify-between mb-2">
                      <SparklineChart data={loop.tensionSignal} status={loop.status} />
                      <DEBandGauge 
                        value={loop.deBandValue}
                        min={loop.deBandMin}
                        max={loop.deBandMax}
                        status={loop.status}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <Badge variant={loop.status === 'healthy' ? 'default' : 'destructive'} className="text-xs">
                      {loop.breachCount} breaches
                    </Badge>
                    {loop.status === 'critical' && (
                      <AlertCircle className="h-4 w-4 text-destructive" />
                    )}
                  </div>
                </CardContent>

                {/* Hover Expansion */}
                <AnimatePresence>
                  {hoveredLoop === loop.id && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      className="absolute inset-0 bg-background/95 backdrop-blur-xl rounded-lg border border-primary/50 p-4 z-10"
                    >
                      <div className="h-full flex flex-col justify-between">
                        <div>
                          <h3 className="font-medium text-sm text-foreground mb-2">{loop.name}</h3>
                          <p className="text-xs text-muted-foreground mb-3">{loop.vision}</p>
                          <div className="text-xs space-y-1">
                            <div>Leverage Point: <span className="text-primary">{loop.leveragePoint}</span></div>
                            <div>DE-Band: {loop.deBandMin}-{loop.deBandMax}</div>
                            <div>Current: {loop.deBandValue}</div>
                          </div>
                        </div>
                        <div className="mt-2 opacity-20">
                          {/* Mini CLD placeholder */}
                          <div className="text-xs text-center text-muted-foreground">CLD Preview</div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}