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
            <div className="h-32 bg-muted/20 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Network className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                <p className="text-xs text-muted-foreground">Interactive CLD</p>
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
                className="h-24 bg-muted/20 rounded-lg flex items-center justify-center"
              >
                <div className="text-center">
                  <TrendingUp className="h-6 w-6 text-muted-foreground mx-auto mb-1" />
                  <p className="text-xs text-muted-foreground">
                    {activeChart === 'baseline' && 'Baseline vs Current'}
                    {activeChart === 'impact' && 'Sub-Lever Impact'}
                    {activeChart === 'pulse' && 'Community Sentiment'}
                  </p>
                </div>
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