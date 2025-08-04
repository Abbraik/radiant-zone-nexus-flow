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
  Users,
  Package,
  ArrowRight,
  Workflow
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface MesoSidebarContentProps {
  data: any;
}

const MesoAIRecommendation = ({ title, confidence, action, description }: {
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
        <Package className="h-3 w-3 mr-1" />
        {action}
      </Button>
    </CardContent>
  </Card>
);

export function MesoSidebarContent({ data }: MesoSidebarContentProps) {
  const [activeChart, setActiveChart] = useState<'process' | 'bundles' | 'throughput'>('process');

  return (
    <>
      {/* Process Flow Diagram */}
      <div className="p-4 border-b border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <Workflow className="h-4 w-4 mr-2" />
          Process Flow Diagram
        </h4>
        <div className="h-36 bg-muted/20 rounded-lg p-3 relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 260 100">
            {/* Process flow nodes */}
            <rect x="10" y="35" width="30" height="20" rx="5" fill="hsl(var(--primary))" opacity="0.8" />
            <rect x="70" y="35" width="30" height="20" rx="5" fill="hsl(var(--success))" opacity="0.8" />
            <rect x="130" y="35" width="30" height="20" rx="5" fill="hsl(var(--warning))" opacity="0.8" />
            <rect x="190" y="35" width="30" height="20" rx="5" fill="hsl(var(--destructive))" opacity="0.8" />
            
            {/* Process connections with arrows */}
            <motion.path
              d="M40 45 L70 45"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            <motion.path
              d="M100 45 L130 45"
              stroke="hsl(var(--success))"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.4 }}
            />
            <motion.path
              d="M160 45 L190 45"
              stroke="hsl(var(--warning))"
              strokeWidth="2"
              markerEnd="url(#arrowhead)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
            />
            
            {/* Feedback loop */}
            <motion.path
              d="M205 35 Q230 15 180 15 Q100 15 25 15 Q10 15 10 35"
              stroke="hsl(var(--muted-foreground))"
              strokeWidth="1"
              strokeDasharray="3,3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.8 }}
            />
            
            {/* Arrow marker definition */}
            <defs>
              <marker id="arrowhead" markerWidth="10" markerHeight="7" 
               refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill="hsl(var(--primary))" />
              </marker>
            </defs>
            
            {/* Labels */}
            <text x="15" y="70" className="text-xs" fill="hsl(var(--foreground))">Input</text>
            <text x="75" y="70" className="text-xs" fill="hsl(var(--foreground))">Process</text>
            <text x="130" y="70" className="text-xs" fill="hsl(var(--foreground))">Quality</text>
            <text x="190" y="70" className="text-xs" fill="hsl(var(--foreground))">Output</text>
          </svg>
          <div className="absolute bottom-1 right-2">
            <p className="text-xs text-muted-foreground">Process View</p>
          </div>
        </div>
      </div>

      {/* Meso Key Parameters */}
      <div className="p-4 border-b border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3">Process Parameters</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">KPI Performance</span>
            <span className="text-xs font-medium">{data.kpiValue || '87'}{data.kpiUnit || '%'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Active Bundles</span>
            <span className="text-xs font-medium">{data.activeBundles || '12'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Avg Cycle Time</span>
            <span className="text-xs font-medium">{data.avgCycleTime || '8.3'}d</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Throughput Rate</span>
            <span className="text-xs font-medium">{data.throughputRate || '24'}/day</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Quality Score</span>
            <span className="text-xs font-medium">{data.qualityScore || '94'}%</span>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="p-4 border-b border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Process Analytics
        </h4>
        
        {/* Chart Tabs */}
        <div className="flex space-x-1 mb-3">
          <Button
            size="sm"
            variant={activeChart === 'process' ? 'default' : 'ghost'}
            onClick={() => setActiveChart('process')}
            className="text-xs h-7"
          >
            Process
          </Button>
          <Button
            size="sm"
            variant={activeChart === 'bundles' ? 'default' : 'ghost'}
            onClick={() => setActiveChart('bundles')}
            className="text-xs h-7"
          >
            Bundles
          </Button>
          <Button
            size="sm"
            variant={activeChart === 'throughput' ? 'default' : 'ghost'}
            onClick={() => setActiveChart('throughput')}
            className="text-xs h-7"
          >
            Throughput
          </Button>
        </div>

        {/* Chart Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeChart}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="h-28 bg-muted/20 rounded-lg p-3"
          >
            {activeChart === 'process' && (
              <svg className="w-full h-full" viewBox="0 0 200 80">
                {/* Process efficiency timeline */}
                <motion.path
                  d="M10 60 L30 45 L50 40 L70 35 L90 42 L110 38 L130 30 L150 28 L170 25 L190 20"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />
                
                {/* Efficiency zones */}
                <rect x="10" y="65" width="40" height="5" fill="hsl(var(--destructive))" opacity="0.3" />
                <rect x="50" y="65" width="80" height="5" fill="hsl(var(--warning))" opacity="0.3" />
                <rect x="130" y="65" width="60" height="5" fill="hsl(var(--success))" opacity="0.3" />
                
                <text x="10" y="15" className="text-xs" fill="hsl(var(--muted-foreground))">Process Efficiency</text>
              </svg>
            )}
            
            {activeChart === 'bundles' && (
              <svg className="w-full h-full" viewBox="0 0 200 80">
                {/* Bundle performance bars */}
                <rect x="20" y="50" width="15" height="25" fill="hsl(var(--primary))" opacity="0.8" />
                <rect x="45" y="35" width="15" height="40" fill="hsl(var(--success))" opacity="0.8" />
                <rect x="70" y="40" width="15" height="35" fill="hsl(var(--warning))" opacity="0.8" />
                <rect x="95" y="25" width="15" height="50" fill="hsl(var(--primary))" opacity="0.8" />
                <rect x="120" y="45" width="15" height="30" fill="hsl(var(--success))" opacity="0.8" />
                <rect x="145" y="30" width="15" height="45" fill="hsl(var(--destructive))" opacity="0.8" />
                
                <text x="20" y="15" className="text-xs" fill="hsl(var(--muted-foreground))">Bundle Performance</text>
                <text x="25" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">B1</text>
                <text x="50" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">B2</text>
                <text x="75" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">B3</text>
                <text x="100" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">B4</text>
                <text x="125" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">B5</text>
                <text x="150" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">B6</text>
              </svg>
            )}
            
            {activeChart === 'throughput' && (
              <svg className="w-full h-full" viewBox="0 0 200 80">
                {/* Throughput flow visualization */}
                <motion.path
                  d="M10 40 Q50 20, 100 35 T190 25"
                  stroke="hsl(var(--success))"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5 }}
                />
                
                {/* Throughput indicators */}
                <circle cx="50" cy="30" r="3" fill="hsl(var(--primary))" />
                <circle cx="100" cy="35" r="3" fill="hsl(var(--warning))" />
                <circle cx="150" cy="30" r="3" fill="hsl(var(--success))" />
                
                <text x="10" y="70" className="text-xs" fill="hsl(var(--muted-foreground))">Throughput: 24/day</text>
              </svg>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* AI Recommendations */}
      <div className="p-4 border-b border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <Lightbulb className="h-4 w-4 mr-2" />
          Process AI Insights
        </h4>
        <div className="space-y-3">
          <MesoAIRecommendation
            title="Bundle Optimization"
            confidence={89}
            action="Optimize Bundle B3"
            description="Reduce cycle time by restructuring bundle dependencies"
          />
          <MesoAIRecommendation
            title="Resource Allocation"
            confidence={76}
            action="Rebalance Resources"
            description="Shift capacity from B1 to B4 for better throughput"
          />
        </div>
      </div>

      {/* Process Actions */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <Target className="h-4 w-4 mr-2" />
          Process Actions
        </h4>
        <div className="space-y-2">
          <Button size="sm" className="w-full text-xs">
            <Package className="h-3 w-3 mr-1" />
            Create New Bundle
          </Button>
          <Button size="sm" variant="outline" className="w-full text-xs">
            <Workflow className="h-3 w-3 mr-1" />
            Optimize Process Flow
          </Button>
          <Button size="sm" variant="outline" className="w-full text-xs">
            <Users className="h-3 w-3 mr-1" />
            Assign Resources
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
    </>
  );
}