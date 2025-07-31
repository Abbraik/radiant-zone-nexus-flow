import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileCheck, 
  Database, 
  MessageSquare, 
  Clock,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Users,
  Heart,
  ChevronDown,
  Plus,
  Settings,
  Eye
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MicroLoop {
  id: string;
  name: string;
  icon: React.ElementType;
  kpiValue: number;
  deBandMin: number;
  deBandMax: number;
  status: 'healthy' | 'warning' | 'critical';
  pulseScore: number;
  pulseTrend: number[];
  pulseVolume: number;
  topThemes: string[];
  avgCompletionTime: number;
  reworkPercentage: number;
  alertCount: number;
}

interface MicroLoopPanelProps {
  onLoopSelect: (id: string, data: MicroLoop) => void;
  selectedLoopId: string | null;
}

const mockMicroLoops: MicroLoop[] = [
  {
    id: 'micro-1',
    name: 'Permit Approval',
    icon: FileCheck,
    kpiValue: 8.5,
    deBandMin: 5,
    deBandMax: 10,
    status: 'warning',
    pulseScore: 78,
    pulseTrend: [72, 74, 76, 78, 75, 78, 80, 78],
    pulseVolume: 24,
    topThemes: ['speed', 'clarity', 'transparency'],
    avgCompletionTime: 8.5,
    reworkPercentage: 12,
    alertCount: 2
  },
  {
    id: 'micro-2',
    name: 'Data Pipeline Refresh',
    icon: Database,
    kpiValue: 15.2,
    deBandMin: 8,
    deBandMax: 12,
    status: 'critical',
    pulseScore: 65,
    pulseTrend: [68, 66, 64, 62, 60, 63, 65, 65],
    pulseVolume: 18,
    topThemes: ['reliability', 'downtime', 'accuracy'],
    avgCompletionTime: 15.2,
    reworkPercentage: 25,
    alertCount: 5
  },
  {
    id: 'micro-3',
    name: 'Community Pulse',
    icon: MessageSquare,
    kpiValue: 2.1,
    deBandMin: 1,
    deBandMax: 3,
    status: 'healthy',
    pulseScore: 85,
    pulseTrend: [82, 83, 84, 85, 87, 86, 85, 85],
    pulseVolume: 156,
    topThemes: ['helpful', 'responsive', 'improvement'],
    avgCompletionTime: 2.1,
    reworkPercentage: 3,
    alertCount: 0
  }
];

const MiniSparkline: React.FC<{ data: number[] }> = ({ data }) => {
  const width = 40;
  const height = 16;
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const points = data.map((value, index) => {
    const x = (index / (data.length - 1)) * width;
    const y = height - ((value - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg width={width} height={height} className="overflow-visible">
      <motion.polyline
        fill="none"
        stroke="hsl(var(--primary))"
        strokeWidth="1.5"
        points={points}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1, ease: "easeInOut" }}
      />
    </svg>
  );
};

const MiniDEBandGauge: React.FC<{ value: number; min: number; max: number; status: string }> = ({ 
  value, min, max, status 
}) => {
  const percentage = ((value - min) / (max - min)) * 100;
  const clampedPercentage = Math.max(0, Math.min(100, percentage));

  const getColor = () => {
    if (status === 'healthy') return 'hsl(var(--success))';
    if (status === 'warning') return 'hsl(var(--warning))';
    return 'hsl(var(--destructive))';
  };

  return (
    <div className="relative w-8 h-8">
      <svg className="w-8 h-8 transform -rotate-90">
        <circle
          cx="16"
          cy="16"
          r="12"
          stroke="hsl(var(--muted))"
          strokeWidth="2"
          fill="none"
        />
        <motion.circle
          cx="16"
          cy="16"
          r="12"
          stroke={getColor()}
          strokeWidth="2"
          fill="none"
          strokeDasharray={`${2 * Math.PI * 12}`}
          strokeDashoffset={`${2 * Math.PI * 12 * (1 - clampedPercentage / 100)}`}
          initial={{ strokeDashoffset: `${2 * Math.PI * 12}` }}
          animate={{ strokeDashoffset: `${2 * Math.PI * 12 * (1 - clampedPercentage / 100)}` }}
          transition={{ duration: 1, delay: 0.2 }}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[10px] font-medium">{value}</span>
      </div>
    </div>
  );
};

export function MicroLoopPanel({ onLoopSelect, selectedLoopId }: MicroLoopPanelProps) {
  const [expandedPulse, setExpandedPulse] = useState<string | null>(null);

  return (
    <div className="h-full">
      <motion.div
        className="h-full glass rounded-xl border-border/50 p-6"
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground mb-1">Micro Loops + Community Pulse</h2>
          <p className="text-sm text-muted-foreground">Task-level execution and real-time feedback</p>
        </div>

        {/* Micro-Loop Gauges */}
        <div className="space-y-3 h-[calc(100%-4rem)] overflow-y-auto">
          {mockMicroLoops.map((loop) => {
            const Icon = loop.icon;
            
            return (
              <motion.div key={loop.id} layout>
                <Card 
                  className={`glass-secondary border-border/50 cursor-pointer transition-all duration-300 ${
                    selectedLoopId === loop.id ? 'border-primary ring-1 ring-primary/20' : 'hover:border-primary/50'
                  }`}
                  onClick={() => onLoopSelect(loop.id, loop)}
                >
                  <CardContent className="p-4">
                    {/* Main Loop Info */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          loop.status === 'healthy' ? 'bg-success/20 text-success' :
                          loop.status === 'warning' ? 'bg-warning/20 text-warning' :
                          'bg-destructive/20 text-destructive'
                        }`}>
                          <Icon className="h-4 w-4" />
                        </div>
                        
                        <div>
                          <h3 className="font-medium text-sm text-foreground">{loop.name}</h3>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <Clock className="h-3 w-3" />
                            <span>{loop.avgCompletionTime}d avg</span>
                            {loop.reworkPercentage > 10 && (
                              <>
                                <span>•</span>
                                <span className="text-warning">{loop.reworkPercentage}% rework</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        {/* DE-Band Gauge */}
                        <MiniDEBandGauge 
                          value={loop.kpiValue}
                          min={loop.deBandMin}
                          max={loop.deBandMax}
                          status={loop.status}
                        />

                        {/* Pulse Score Badge */}
                        <motion.div
                          className="relative"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Badge 
                            variant={loop.pulseScore >= 80 ? 'default' : loop.pulseScore >= 60 ? 'secondary' : 'destructive'}
                            className="flex items-center space-x-1"
                          >
                            <Heart className="h-3 w-3" />
                            <span>{loop.pulseScore}</span>
                          </Badge>
                        </motion.div>

                        {/* Alert Badge */}
                        {loop.alertCount > 0 && (
                          <Badge variant="destructive" className="flex items-center space-x-1">
                            <AlertCircle className="h-3 w-3" />
                            <span>{loop.alertCount}</span>
                          </Badge>
                        )}
                      </div>
                    </div>

                    {/* Community Pulse Widget */}
                    <Collapsible 
                      open={expandedPulse === loop.id}
                      onOpenChange={(isOpen) => setExpandedPulse(isOpen ? loop.id : null)}
                    >
                      <CollapsibleTrigger asChild>
                        <Button variant="ghost" size="sm" className="w-full justify-between p-2 h-auto">
                          <div className="flex items-center space-x-2">
                            <MessageSquare className="h-3 w-3" />
                            <span className="text-xs">Community Pulse</span>
                            <Badge variant="outline" className="text-xs">
                              {loop.pulseVolume} responses
                            </Badge>
                          </div>
                          <motion.div
                            animate={{ rotate: expandedPulse === loop.id ? 180 : 0 }}
                            transition={{ duration: 0.2 }}
                          >
                            <ChevronDown className="h-3 w-3" />
                          </motion.div>
                        </Button>
                      </CollapsibleTrigger>
                      
                      <CollapsibleContent>
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-3 p-3 glass-secondary rounded-lg space-y-3"
                        >
                          {/* Pulse Trendline */}
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="text-xs text-muted-foreground mb-1">Sentiment Trend</div>
                              <MiniSparkline data={loop.pulseTrend} />
                            </div>
                            <div className="text-right">
                              <div className="text-xs text-muted-foreground">Volume</div>
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span className="text-xs font-medium">{loop.pulseVolume}</span>
                              </div>
                            </div>
                          </div>

                          {/* Top Themes */}
                          <div>
                            <div className="text-xs text-muted-foreground mb-2">Top Themes</div>
                            <div className="flex flex-wrap gap-1">
                              {loop.topThemes.map((theme, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {theme}
                                </Badge>
                              ))}
                            </div>
                          </div>

                          {/* Quick Actions */}
                          <div className="flex space-x-2">
                            <Button size="sm" variant="outline" className="text-xs h-7">
                              <Eye className="h-3 w-3 mr-1" />
                              View All Feedback
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-7">
                              <Plus className="h-3 w-3 mr-1" />
                              Spawn Task
                            </Button>
                            <Button size="sm" variant="outline" className="text-xs h-7">
                              <Settings className="h-3 w-3 mr-1" />
                              Adjust
                            </Button>
                          </div>
                        </motion.div>
                      </CollapsibleContent>
                    </Collapsible>
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}