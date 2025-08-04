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
  Settings,
  Globe,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface MacroSidebarContentProps {
  data: any;
}

const MacroAIRecommendation = ({ title, confidence, action, description }: {
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
        <Globe className="h-3 w-3 mr-1" />
        {action}
      </Button>
    </CardContent>
  </Card>
);

export function MacroSidebarContent({ data }: MacroSidebarContentProps) {
  const [activeChart, setActiveChart] = useState<'leverage' | 'policy' | 'strategic'>('leverage');

  return (
    <>
      {/* Strategic CLD Viewer */}
      <div className="p-4 border-b border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <Network className="h-4 w-4 mr-2" />
          Strategic Causal Loop Diagram
        </h4>
        <div className="h-40 bg-muted/20 rounded-lg p-3 relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 280 120">
            {/* Strategic nodes */}
            <circle cx="50" cy="30" r="12" fill="hsl(var(--primary))" opacity="0.8" />
            <circle cx="230" cy="30" r="12" fill="hsl(var(--success))" opacity="0.8" />
            <circle cx="50" cy="90" r="12" fill="hsl(var(--warning))" opacity="0.8" />
            <circle cx="230" cy="90" r="12" fill="hsl(var(--destructive))" opacity="0.8" />
            <circle cx="140" cy="60" r="15" fill="hsl(var(--primary))" />
            
            {/* Strategic connections */}
            <motion.path
              d="M62 30 L125 60"
              stroke="hsl(var(--primary))"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.2 }}
            />
            <motion.path
              d="M155 60 L218 30"
              stroke="hsl(var(--success))"
              strokeWidth="3"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.4 }}
            />
            
            {/* Policy feedback loop */}
            <motion.path
              d="M62 90 Q140 40 218 90"
              stroke="hsl(var(--warning))"
              strokeWidth="2"
              strokeDasharray="5,5"
              fill="none"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2.5, delay: 0.6 }}
            />
            
            {/* Labels */}
            <text x="35" y="20" className="text-xs" fill="hsl(var(--foreground))">Vision</text>
            <text x="210" y="20" className="text-xs" fill="hsl(var(--foreground))">Impact</text>
            <text x="35" y="105" className="text-xs" fill="hsl(var(--foreground))">Policy</text>
            <text x="210" y="105" className="text-xs" fill="hsl(var(--foreground))">Outcome</text>
            <text x="125" y="50" className="text-xs" fill="hsl(var(--foreground))">System</text>
          </svg>
          <div className="absolute bottom-1 right-2">
            <p className="text-xs text-muted-foreground">Strategic View</p>
          </div>
        </div>
      </div>

      {/* Macro Key Parameters */}
      <div className="p-4 border-b border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3">Strategic Parameters</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">System Tension</span>
            <span className="text-xs font-medium">{data.deBandValue || '2.4σ'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Policy Impact</span>
            <span className="text-xs font-medium">{data.policyImpact || '78%'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Leverage Point</span>
            <span className="text-xs font-medium">{data.leveragePoint || 'Information Flow'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Strategic Horizon</span>
            <span className="text-xs font-medium">{data.strategicHorizon || '18 months'}</span>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="p-4 border-b border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Strategic Analytics
        </h4>
        
        {/* Chart Tabs */}
        <div className="flex space-x-1 mb-3">
          <Button
            size="sm"
            variant={activeChart === 'leverage' ? 'default' : 'ghost'}
            onClick={() => setActiveChart('leverage')}
            className="text-xs h-7"
          >
            Leverage
          </Button>
          <Button
            size="sm"
            variant={activeChart === 'policy' ? 'default' : 'ghost'}
            onClick={() => setActiveChart('policy')}
            className="text-xs h-7"
          >
            Policy
          </Button>
          <Button
            size="sm"
            variant={activeChart === 'strategic' ? 'default' : 'ghost'}
            onClick={() => setActiveChart('strategic')}
            className="text-xs h-7"
          >
            Strategic
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
            {activeChart === 'leverage' && (
              <svg className="w-full h-full" viewBox="0 0 200 80">
                {/* Leverage point analysis */}
                <circle cx="30" cy="40" r="8" fill="hsl(var(--primary))" />
                <circle cx="70" cy="25" r="12" fill="hsl(var(--success))" />
                <circle cx="110" cy="35" r="10" fill="hsl(var(--warning))" />
                <circle cx="150" cy="20" r="14" fill="hsl(var(--destructive))" />
                <circle cx="190" cy="30" r="9" fill="hsl(var(--primary))" />
                
                <text x="25" y="58" className="text-xs" fill="hsl(var(--muted-foreground))">L1</text>
                <text x="65" y="58" className="text-xs" fill="hsl(var(--muted-foreground))">L2</text>
                <text x="105" y="58" className="text-xs" fill="hsl(var(--muted-foreground))">L3</text>
                <text x="145" y="58" className="text-xs" fill="hsl(var(--muted-foreground))">L4</text>
                <text x="185" y="58" className="text-xs" fill="hsl(var(--muted-foreground))">L5</text>
              </svg>
            )}
            
            {activeChart === 'policy' && (
              <svg className="w-full h-full" viewBox="0 0 200 80">
                {/* Policy impact heatmap */}
                <rect x="20" y="20" width="30" height="15" fill="hsl(var(--success))" opacity="0.8" />
                <rect x="60" y="20" width="30" height="15" fill="hsl(var(--primary))" opacity="0.6" />
                <rect x="100" y="20" width="30" height="15" fill="hsl(var(--warning))" opacity="0.7" />
                <rect x="140" y="20" width="30" height="15" fill="hsl(var(--destructive))" opacity="0.5" />
                
                <rect x="20" y="45" width="30" height="15" fill="hsl(var(--primary))" opacity="0.9" />
                <rect x="60" y="45" width="30" height="15" fill="hsl(var(--success))" opacity="0.7" />
                <rect x="100" y="45" width="30" height="15" fill="hsl(var(--primary))" opacity="0.5" />
                <rect x="140" y="45" width="30" height="15" fill="hsl(var(--warning))" opacity="0.8" />
                
                <text x="5" y="75" className="text-xs" fill="hsl(var(--muted-foreground))">Policy Impact Matrix</text>
              </svg>
            )}
            
            {activeChart === 'strategic' && (
              <svg className="w-full h-full" viewBox="0 0 200 80">
                {/* Strategic trajectory */}
                <motion.path
                  d="M10 60 Q50 20, 100 40 T190 15"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />
                
                {/* Strategic milestones */}
                <circle cx="50" cy="30" r="4" fill="hsl(var(--success))" />
                <circle cx="100" cy="40" r="4" fill="hsl(var(--warning))" />
                <circle cx="150" cy="25" r="4" fill="hsl(var(--success))" />
                
                <text x="10" y="75" className="text-xs" fill="hsl(var(--muted-foreground))">Strategic Trajectory</text>
              </svg>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* AI Recommendations */}
      <div className="p-4 border-b border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <Lightbulb className="h-4 w-4 mr-2" />
          Strategic AI Insights
        </h4>
        <div className="space-y-3">
          <MacroAIRecommendation
            title="System Leverage Optimization"
            confidence={92}
            action="Adjust Information Flow"
            description="Strategic intervention at paradigm level to shift mental models"
          />
          <MacroAIRecommendation
            title="Policy Framework Update"
            confidence={85}
            action="Update Governance Model"
            description="Align policy incentives with desired system behaviors"
          />
        </div>
      </div>

      {/* Strategic Actions */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <Target className="h-4 w-4 mr-2" />
          Strategic Actions
        </h4>
        <div className="space-y-2">
          <Button size="sm" className="w-full text-xs">
            <Globe className="h-3 w-3 mr-1" />
            Launch Strategic Initiative
          </Button>
          <Button size="sm" variant="outline" className="w-full text-xs">
            <Settings className="h-3 w-3 mr-1" />
            Configure Policy Framework
          </Button>
          <Button size="sm" variant="outline" className="w-full text-xs">
            <Layers className="h-3 w-3 mr-1" />
            Create MetaSolve Session
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