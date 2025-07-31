import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  DollarSign, 
  Shield, 
  Lightbulb, 
  Users, 
  TrendingUp, 
  TrendingDown,
  ChevronRight,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface MesoLoop {
  id: string;
  name: string;
  icon: React.ElementType;
  kpiValue: number;
  kpiTarget: number;
  kpiUnit: string;
  trend: 'up' | 'down' | 'stable';
  trendValue: number;
  status: 'healthy' | 'warning' | 'critical';
  activeBundles: number;
  completedTasks: number;
  totalTasks: number;
  avgCycleTime: number;
  processType: string;
}

interface MesoLoopPanelProps {
  onLoopSelect: (id: string, data: MesoLoop) => void;
  selectedLoopId: string | null;
}

const mockMesoLoops: MesoLoop[] = [
  {
    id: 'meso-1',
    name: 'Budget Allocation',
    icon: DollarSign,
    kpiValue: 87,
    kpiTarget: 90,
    kpiUnit: '%',
    trend: 'up',
    trendValue: 3.2,
    status: 'warning',
    activeBundles: 12,
    completedTasks: 284,
    totalTasks: 320,
    avgCycleTime: 14,
    processType: 'Financial'
  },
  {
    id: 'meso-2',
    name: 'Compliance Monitoring',
    icon: Shield,
    kpiValue: 96,
    kpiTarget: 95,
    kpiUnit: '%',
    trend: 'up',
    trendValue: 1.8,
    status: 'healthy',
    activeBundles: 8,
    completedTasks: 152,
    totalTasks: 160,
    avgCycleTime: 7,
    processType: 'Governance'
  },
  {
    id: 'meso-3',
    name: 'Innovation Adoption',
    icon: Lightbulb,
    kpiValue: 73,
    kpiTarget: 80,
    kpiUnit: '%',
    trend: 'down',
    trendValue: -2.1,
    status: 'critical',
    activeBundles: 15,
    completedTasks: 98,
    totalTasks: 180,
    avgCycleTime: 21,
    processType: 'Innovation'
  },
  {
    id: 'meso-4',
    name: 'Governance Cell Coordination',
    icon: Users,
    kpiValue: 82,
    kpiTarget: 85,
    kpiUnit: '%',
    trend: 'stable',
    trendValue: 0.3,
    status: 'warning',
    activeBundles: 6,
    completedTasks: 76,
    totalTasks: 90,
    avgCycleTime: 10,
    processType: 'Coordination'
  }
];

export function MesoLoopPanel({ onLoopSelect, selectedLoopId }: MesoLoopPanelProps) {
  const [expandedLoop, setExpandedLoop] = useState<string | null>(null);

  const handleTileClick = (loop: MesoLoop) => {
    if (expandedLoop === loop.id) {
      setExpandedLoop(null);
    } else {
      setExpandedLoop(loop.id);
      onLoopSelect(loop.id, loop);
    }
  };

  return (
    <div className="h-full">
      <motion.div
        className="h-full backdrop-blur-xl bg-background/40 rounded-2xl border border-border/50 p-6"
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.3 }}
      >
        <div className="mb-4">
          <h2 className="text-lg font-semibold text-foreground mb-1">Meso Loops</h2>
          <p className="text-sm text-muted-foreground">Process-level coordination and execution</p>
        </div>

        {/* Scrollable Tile List */}
        <div className="space-y-3 h-[calc(100%-4rem)] overflow-y-auto">
          {mockMesoLoops.map((loop) => {
            const Icon = loop.icon;
            const progressPercentage = (loop.completedTasks / loop.totalTasks) * 100;
            const kpiPercentage = (loop.kpiValue / loop.kpiTarget) * 100;
            
            return (
              <motion.div key={loop.id} layout>
                <Card 
                  className={`bg-background/60 backdrop-blur-sm border-border/50 cursor-pointer transition-all duration-300 overflow-hidden ${
                    selectedLoopId === loop.id ? 'border-primary ring-1 ring-primary/20' : 'hover:border-primary/50'
                  }`}
                  onClick={() => handleTileClick(loop)}
                >
                  <CardContent className="p-4">
                    {/* Main Tile Content */}
                    <div className="flex items-center justify-between">
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
                          <p className="text-xs text-muted-foreground">{loop.processType}</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* KPI Ring */}
                        <div className="relative w-12 h-12">
                          <svg className="w-12 h-12 transform -rotate-90">
                            <circle
                              cx="24"
                              cy="24"
                              r="20"
                              stroke="hsl(var(--muted))"
                              strokeWidth="3"
                              fill="none"
                            />
                            <motion.circle
                              cx="24"
                              cy="24"
                              r="20"
                              stroke={
                                loop.status === 'healthy' ? 'hsl(var(--success))' :
                                loop.status === 'warning' ? 'hsl(var(--warning))' :
                                'hsl(var(--destructive))'
                              }
                              strokeWidth="3"
                              fill="none"
                              strokeDasharray={`${2 * Math.PI * 20}`}
                              strokeDashoffset={`${2 * Math.PI * 20 * (1 - kpiPercentage / 100)}`}
                              initial={{ strokeDashoffset: `${2 * Math.PI * 20}` }}
                              animate={{ strokeDashoffset: `${2 * Math.PI * 20 * (1 - kpiPercentage / 100)}` }}
                              transition={{ duration: 1, delay: 0.3 }}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-medium">{loop.kpiValue}{loop.kpiUnit}</span>
                          </div>
                        </div>

                        {/* Trend Indicator */}
                        <div className="flex items-center space-x-1">
                          {loop.trend === 'up' && <TrendingUp className="h-4 w-4 text-success" />}
                          {loop.trend === 'down' && <TrendingDown className="h-4 w-4 text-destructive" />}
                          {loop.trend === 'stable' && <div className="w-4 h-4 bg-muted rounded-full" />}
                          <span className={`text-xs font-medium ${
                            loop.trend === 'up' ? 'text-success' :
                            loop.trend === 'down' ? 'text-destructive' :
                            'text-muted-foreground'
                          }`}>
                            {loop.trend === 'stable' ? '±' : ''}{Math.abs(loop.trendValue)}%
                          </span>
                        </div>

                        <motion.div
                          animate={{ rotate: expandedLoop === loop.id ? 90 : 0 }}
                          transition={{ duration: 0.2 }}
                        >
                          <ChevronRight className="h-4 w-4 text-muted-foreground" />
                        </motion.div>
                      </div>
                    </div>

                    {/* Expanded Content */}
                    <AnimatePresence>
                      {expandedLoop === loop.id && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="mt-4 pt-4 border-t border-border/50"
                        >
                          <div className="grid grid-cols-2 gap-4">
                            {/* Bundle Progress */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-muted-foreground">Task Progress</span>
                                <span className="text-xs font-medium">{loop.completedTasks}/{loop.totalTasks}</span>
                              </div>
                              <Progress value={progressPercentage} className="h-2" />
                            </div>

                            {/* Cycle Time */}
                            <div>
                              <div className="flex items-center justify-between mb-2">
                                <span className="text-xs text-muted-foreground">Avg Cycle Time</span>
                                <span className="text-xs font-medium flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {loop.avgCycleTime}d
                                </span>
                              </div>
                              <div className="flex space-x-1">
                                {loop.avgCycleTime > 15 && <AlertTriangle className="h-4 w-4 text-warning" />}
                              </div>
                            </div>
                          </div>

                          {/* Top Underperforming Bundles */}
                          <div className="mt-4">
                            <div className="text-xs text-muted-foreground mb-2">Active Bundles ({loop.activeBundles})</div>
                            <div className="space-y-1">
                              {Array.from({ length: Math.min(3, loop.activeBundles) }, (_, i) => (
                                <div key={i} className="flex items-center justify-between p-2 bg-muted/20 rounded">
                                  <span className="text-xs">Bundle {i + 1}</span>
                                  <Badge variant="outline" className="text-xs">
                                    {Math.floor(Math.random() * 100)}%
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
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