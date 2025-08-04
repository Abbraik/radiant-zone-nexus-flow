import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Network, 
  TrendingUp, 
  Download, 
  Share, 
  Plus,
  Zap,
  FileText,
  BarChart3,
  Lightbulb,
  Target,
  Clock,
  Users
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface SelectedItem {
  type: 'macro' | 'meso' | 'micro';
  id: string;
  data: any;
}

interface ContextSidebarProps {
  selectedItem: SelectedItem | null;
}

const AIRecommendation = ({ title, confidence, action, description }: {
  title: string;
  confidence: number;
  action: string;
  description: string;
}) => (
  <Card className="bg-background/60 backdrop-blur-sm border-border/50">
    <CardContent className="p-3">
      <div className="flex items-center justify-between mb-2">
        <h4 className="text-sm font-medium text-foreground">{title}</h4>
        <Badge variant={confidence >= 80 ? 'default' : 'secondary'} className="text-xs">
          {confidence}% confidence
        </Badge>
      </div>
      <p className="text-xs text-muted-foreground mb-3">{description}</p>
      <Button size="sm" className="w-full text-xs">
        <Zap className="h-3 w-3 mr-1" />
        {action}
      </Button>
    </CardContent>
  </Card>
);

export function ContextSidebar({ selectedItem }: ContextSidebarProps) {
  const [activeChart, setActiveChart] = useState<'baseline' | 'impact' | 'pulse'>('baseline');

  if (!selectedItem) {
    return (
      <div className="h-full p-4">
        <motion.div
          className="text-center glass rounded-xl border-border/50 p-6 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="text-center">
            <Network className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-sm text-muted-foreground">
              Select a loop to view detailed analysis
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  const { type, data } = selectedItem;

  return (
    <div className="h-full p-4">
      <motion.div
        className="h-full glass rounded-xl border-border/50 overflow-hidden"
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="p-4 border-b border-border/50">
          <div className="flex items-center space-x-2 mb-2">
            <Badge variant="outline" className="text-xs">
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Badge>
            <Badge 
              variant={data.status === 'healthy' ? 'default' : 
                     data.status === 'warning' ? 'secondary' : 'destructive'}
              className="text-xs"
            >
              {data.status}
            </Badge>
          </div>
          <h3 className="font-semibold text-sm text-foreground">{data.name}</h3>
          {data.vision && (
            <p className="text-xs text-muted-foreground mt-1">{data.vision}</p>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {/* Full-Size CLD Viewer */}
          <div className="p-4 border-b border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Network className="h-4 w-4 mr-2" />
              Causal Loop Diagram
            </h4>
            <div className="h-32 bg-muted/20 rounded-lg p-3 relative overflow-hidden">
              {/* Simple CLD visualization */}
              <svg className="w-full h-full" viewBox="0 0 200 100">
                {/* Nodes */}
                <circle cx="30" cy="25" r="8" fill="hsl(var(--primary))" opacity="0.7" />
                <circle cx="170" cy="25" r="8" fill="hsl(var(--success))" opacity="0.7" />
                <circle cx="30" cy="75" r="8" fill="hsl(var(--warning))" opacity="0.7" />
                <circle cx="170" cy="75" r="8" fill="hsl(var(--destructive))" opacity="0.7" />
                <circle cx="100" cy="50" r="10" fill="hsl(var(--primary))" />
                
                {/* Connections */}
                <motion.path
                  d="M38 25 L92 50"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.2 }}
                />
                <motion.path
                  d="M108 50 L162 25"
                  stroke="hsl(var(--success))"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.4 }}
                />
                <motion.path
                  d="M38 75 L92 50"
                  stroke="hsl(var(--warning))"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.6 }}
                />
                <motion.path
                  d="M108 50 L162 75"
                  stroke="hsl(var(--destructive))"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1.5, delay: 0.8 }}
                />
                
                {/* Arrow heads */}
                <polygon points="160,23 165,25 160,27" fill="hsl(var(--success))" />
                <polygon points="160,73 165,75 160,77" fill="hsl(var(--destructive))" />
              </svg>
              <div className="absolute bottom-1 right-2">
                <p className="text-xs text-muted-foreground">Live CLD</p>
              </div>
            </div>
          </div>

          {/* Key Parameters */}
          <div className="p-4 border-b border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3">Key Parameters</h4>
            <div className="space-y-3">
              {type === 'macro' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Tension Signal</span>
                    <span className="text-xs font-medium">{data.deBandValue}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">DE-Band Range</span>
                    <span className="text-xs font-medium">{data.deBandMin}-{data.deBandMax}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Leverage Point</span>
                    <span className="text-xs font-medium">{data.leveragePoint}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Breach Count</span>
                    <span className="text-xs font-medium">{data.breachCount}</span>
                  </div>
                </>
              )}
              
              {type === 'meso' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">KPI Performance</span>
                    <span className="text-xs font-medium">{data.kpiValue}{data.kpiUnit}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Active Bundles</span>
                    <span className="text-xs font-medium">{data.activeBundles}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Avg Cycle Time</span>
                    <span className="text-xs font-medium">{data.avgCycleTime}d</span>
                  </div>
                </>
              )}

              {type === 'micro' && (
                <>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Completion Time</span>
                    <span className="text-xs font-medium">{data.avgCompletionTime}d</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Pulse Score</span>
                    <span className="text-xs font-medium">{data.pulseScore}/100</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-xs text-muted-foreground">Rework Rate</span>
                    <span className="text-xs font-medium">{data.reworkPercentage}%</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Performance Charts */}
          <div className="p-4 border-b border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <BarChart3 className="h-4 w-4 mr-2" />
              Performance Charts
            </h4>
            
            {/* Chart Tabs */}
            <div className="flex space-x-1 mb-3">
              <Button
                size="sm"
                variant={activeChart === 'baseline' ? 'default' : 'ghost'}
                onClick={() => setActiveChart('baseline')}
                className="text-xs h-7"
              >
                Baseline
              </Button>
              <Button
                size="sm"
                variant={activeChart === 'impact' ? 'default' : 'ghost'}
                onClick={() => setActiveChart('impact')}
                className="text-xs h-7"
              >
                Impact
              </Button>
              {type === 'micro' && (
                <Button
                  size="sm"
                  variant={activeChart === 'pulse' ? 'default' : 'ghost'}
                  onClick={() => setActiveChart('pulse')}
                  className="text-xs h-7"
                >
                  Pulse
                </Button>
              )}
            </div>

            {/* Chart Content */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeChart}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="h-24 bg-muted/20 rounded-lg p-3"
              >
                {activeChart === 'baseline' && (
                  <svg className="w-full h-full" viewBox="0 0 160 60">
                    {/* Baseline area chart */}
                    <defs>
                      <linearGradient id="baseline-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                      </linearGradient>
                    </defs>
                    
                    {/* Grid lines */}
                    <line x1="0" y1="15" x2="160" y2="15" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
                    <line x1="0" y1="30" x2="160" y2="30" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
                    <line x1="0" y1="45" x2="160" y2="45" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.5" />
                    
                    {/* Baseline area */}
                    <motion.path
                      d="M0 45 L20 40 L40 35 L60 38 L80 32 L100 30 L120 28 L140 25 L160 22 L160 60 L0 60 Z"
                      fill="url(#baseline-gradient)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 1 }}
                    />
                    
                    {/* Current line */}
                    <motion.path
                      d="M0 35 L20 32 L40 28 L60 30 L80 25 L100 23 L120 20 L140 18 L160 15"
                      stroke="hsl(var(--success))"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1.5, delay: 0.5 }}
                    />
                    
                    <text x="5" y="55" className="text-xs" fill="hsl(var(--muted-foreground))">Baseline</text>
                    <text x="120" y="12" className="text-xs" fill="hsl(var(--success))">Current</text>
                  </svg>
                )}
                
                {activeChart === 'impact' && (
                  <svg className="w-full h-full" viewBox="0 0 160 60">
                    {/* Impact bar chart */}
                    <rect x="10" y="40" width="20" height="15" fill="hsl(var(--primary))" opacity="0.7" />
                    <rect x="40" y="25" width="20" height="30" fill="hsl(var(--success))" opacity="0.7" />
                    <rect x="70" y="35" width="20" height="20" fill="hsl(var(--warning))" opacity="0.7" />
                    <rect x="100" y="15" width="20" height="40" fill="hsl(var(--destructive))" opacity="0.7" />
                    <rect x="130" y="30" width="20" height="25" fill="hsl(var(--primary))" opacity="0.7" />
                    
                    <text x="15" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">L1</text>
                    <text x="45" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">L2</text>
                    <text x="75" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">L3</text>
                    <text x="105" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">L4</text>
                    <text x="135" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">L5</text>
                  </svg>
                )}
                
                {activeChart === 'pulse' && type === 'micro' && (
                  <svg className="w-full h-full" viewBox="0 0 160 60">
                    {/* Pulse sentiment chart */}
                    <motion.path
                      d="M0 30 Q20 20, 40 25 T80 20 Q100 15, 120 18 T160 15"
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      fill="none"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 2 }}
                    />
                    
                    {/* Sentiment indicators */}
                    <circle cx="40" cy="25" r="3" fill="hsl(var(--success))" />
                    <circle cx="80" cy="20" r="3" fill="hsl(var(--warning))" />
                    <circle cx="120" cy="18" r="3" fill="hsl(var(--success))" />
                    
                    <text x="5" y="55" className="text-xs" fill="hsl(var(--muted-foreground))">Sentiment</text>
                    <text x="120" y="55" className="text-xs" fill="hsl(var(--muted-foreground))">94%</text>
                  </svg>
                )}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* AI Recommendations */}
          <div className="p-4 border-b border-border/50">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Lightbulb className="h-4 w-4 mr-2" />
              AI Recommendations
            </h4>
            <div className="space-y-3">
              <AIRecommendation
                title="Leverage Adjustment"
                confidence={87}
                action="Apply Lever 3"
                description="Increase information flow to reduce bottlenecks"
              />
              <AIRecommendation
                title="Process Optimization"
                confidence={73}
                action="Create Sprint"
                description="Focus on reducing rework through better quality gates"
              />
            </div>
          </div>

          {/* Action Panel */}
          <div className="p-4">
            <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
              <Target className="h-4 w-4 mr-2" />
              Quick Actions
            </h4>
            <div className="space-y-2">
              <Button size="sm" className="w-full text-xs">
                <Plus className="h-3 w-3 mr-1" />
                Create Think Sprint
              </Button>
              <Button size="sm" variant="outline" className="w-full text-xs">
                <Clock className="h-3 w-3 mr-1" />
                Add Micro-Task
              </Button>
              
              <Separator className="my-3" />
              
              <div className="flex space-x-1">
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <Download className="h-3 w-3 mr-1" />
                  Export
                </Button>
                <Button size="sm" variant="outline" className="flex-1 text-xs">
                  <Share className="h-3 w-3 mr-1" />
                  Share
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}