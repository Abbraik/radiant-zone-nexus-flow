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
  MessageSquare,
  Heart,
  CheckSquare
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Progress } from '@/components/ui/progress';

interface MicroSidebarContentProps {
  data: any;
}

const MicroAIRecommendation = ({ title, confidence, action, description }: {
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
        <CheckSquare className="h-3 w-3 mr-1" />
        {action}
      </Button>
    </CardContent>
  </Card>
);

export function MicroSidebarContent({ data }: MicroSidebarContentProps) {
  const [activeChart, setActiveChart] = useState<'tasks' | 'pulse' | 'community'>('tasks');

  return (
    <>
      {/* Task Analytics Diagram */}
      <div className="p-4 border-b border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <CheckSquare className="h-4 w-4 mr-2" />
          Task Analytics Network
        </h4>
        <div className="h-36 bg-muted/20 rounded-lg p-3 relative overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 240 100">
            {/* Task nodes with different states */}
            <circle cx="30" cy="30" r="8" fill="hsl(var(--success))" opacity="0.9" />
            <circle cx="80" cy="20" r="6" fill="hsl(var(--primary))" opacity="0.8" />
            <circle cx="130" cy="35" r="7" fill="hsl(var(--warning))" opacity="0.8" />
            <circle cx="180" cy="25" r="5" fill="hsl(var(--destructive))" opacity="0.7" />
            <circle cx="220" cy="40" r="9" fill="hsl(var(--success))" opacity="0.9" />
            
            {/* Community pulse rings */}
            <circle cx="30" cy="70" r="12" fill="none" stroke="hsl(var(--primary))" strokeWidth="1" opacity="0.6" />
            <circle cx="80" cy="70" r="15" fill="none" stroke="hsl(var(--success))" strokeWidth="2" opacity="0.8" />
            <circle cx="130" cy="70" r="10" fill="none" stroke="hsl(var(--warning))" strokeWidth="1" opacity="0.5" />
            <circle cx="180" cy="70" r="8" fill="none" stroke="hsl(var(--destructive))" strokeWidth="1" opacity="0.4" />
            <circle cx="220" cy="70" r="18" fill="none" stroke="hsl(var(--primary))" strokeWidth="3" opacity="0.9" />
            
            {/* Task connections */}
            <motion.path
              d="M38 30 L72 20"
              stroke="hsl(var(--primary))"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.2 }}
            />
            <motion.path
              d="M86 20 L123 35"
              stroke="hsl(var(--success))"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.4 }}
            />
            <motion.path
              d="M137 35 L175 25"
              stroke="hsl(var(--warning))"
              strokeWidth="1"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, delay: 0.6 }}
            />
            
            {/* Community feedback lines */}
            <motion.path
              d="M30 58 L80 58"
              stroke="hsl(var(--primary))"
              strokeWidth="2"
              strokeDasharray="2,2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 0.8 }}
            />
            <motion.path
              d="M95 70 L115 70"
              stroke="hsl(var(--success))"
              strokeWidth="2"
              strokeDasharray="2,2"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, delay: 1 }}
            />
            
            {/* Labels */}
            <text x="20" y="15" className="text-xs" fill="hsl(var(--foreground))">Done</text>
            <text x="70" y="10" className="text-xs" fill="hsl(var(--foreground))">Active</text>
            <text x="120" y="15" className="text-xs" fill="hsl(var(--foreground))">Review</text>
            <text x="170" y="15" className="text-xs" fill="hsl(var(--foreground))">Block</text>
            <text x="205" y="15" className="text-xs" fill="hsl(var(--foreground))">Ready</text>
            
            <text x="15" y="95" className="text-xs" fill="hsl(var(--muted-foreground))">Community Pulse</text>
          </svg>
          <div className="absolute bottom-1 right-2">
            <p className="text-xs text-muted-foreground">Real-time</p>
          </div>
        </div>
      </div>

      {/* Micro Key Parameters */}
      <div className="p-4 border-b border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3">Task Parameters</h4>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Completion Time</span>
            <span className="text-xs font-medium">{data.avgCompletionTime || '2.1'}d</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Pulse Score</span>
            <span className="text-xs font-medium">{data.pulseScore || '94'}/100</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Rework Rate</span>
            <span className="text-xs font-medium">{data.reworkPercentage || '12'}%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Active Tasks</span>
            <span className="text-xs font-medium">{data.activeTasks || '47'}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-xs text-muted-foreground">Team Velocity</span>
            <span className="text-xs font-medium">{data.teamVelocity || '23'}/week</span>
          </div>
        </div>
      </div>

      {/* Performance Charts */}
      <div className="p-4 border-b border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <BarChart3 className="h-4 w-4 mr-2" />
          Task Analytics
        </h4>
        
        {/* Chart Tabs */}
        <div className="flex space-x-1 mb-3">
          <Button
            size="sm"
            variant={activeChart === 'tasks' ? 'default' : 'ghost'}
            onClick={() => setActiveChart('tasks')}
            className="text-xs h-7"
          >
            Tasks
          </Button>
          <Button
            size="sm"
            variant={activeChart === 'pulse' ? 'default' : 'ghost'}
            onClick={() => setActiveChart('pulse')}
            className="text-xs h-7"
          >
            Pulse
          </Button>
          <Button
            size="sm"
            variant={activeChart === 'community' ? 'default' : 'ghost'}
            onClick={() => setActiveChart('community')}
            className="text-xs h-7"
          >
            Community
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
            {activeChart === 'tasks' && (
              <svg className="w-full h-full" viewBox="0 0 200 80">
                {/* Task completion velocity */}
                <motion.path
                  d="M10 70 L25 60 L40 55 L55 50 L70 45 L85 40 L100 35 L115 32 L130 28 L145 25 L160 22 L175 18 L190 15"
                  stroke="hsl(var(--primary))"
                  strokeWidth="2"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2 }}
                />
                
                {/* Velocity indicators */}
                <circle cx="55" cy="50" r="2" fill="hsl(var(--success))" />
                <circle cx="100" cy="35" r="2" fill="hsl(var(--primary))" />
                <circle cx="145" cy="25" r="2" fill="hsl(var(--warning))" />
                <circle cx="190" cy="15" r="2" fill="hsl(var(--success))" />
                
                <text x="10" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">Task Velocity</text>
                <text x="150" y="75" className="text-xs" fill="hsl(var(--muted-foreground))">23/week</text>
              </svg>
            )}
            
            {activeChart === 'pulse' && (
              <svg className="w-full h-full" viewBox="0 0 200 80">
                {/* Community pulse sentiment */}
                <motion.path
                  d="M0 40 Q25 20, 50 35 T100 25 Q125 15, 150 20 T200 18"
                  stroke="hsl(var(--primary))"
                  strokeWidth="3"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 2.5 }}
                />
                
                {/* Pulse peaks */}
                <circle cx="50" cy="35" r="3" fill="hsl(var(--success))" />
                <circle cx="100" cy="25" r="3" fill="hsl(var(--primary))" />
                <circle cx="150" cy="20" r="3" fill="hsl(var(--success))" />
                
                {/* Sentiment zones */}
                <rect x="0" y="10" width="200" height="8" fill="hsl(var(--success))" opacity="0.2" />
                <rect x="0" y="18" width="200" height="12" fill="hsl(var(--primary))" opacity="0.2" />
                <rect x="0" y="30" width="200" height="15" fill="hsl(var(--warning))" opacity="0.2" />
                <rect x="0" y="45" width="200" height="25" fill="hsl(var(--destructive))" opacity="0.2" />
                
                <text x="5" y="12" className="text-xs" fill="hsl(var(--muted-foreground))">Excellent</text>
                <text x="5" y="25" className="text-xs" fill="hsl(var(--muted-foreground))">Good</text>
                <text x="5" y="40" className="text-xs" fill="hsl(var(--muted-foreground))">Fair</text>
                <text x="5" y="60" className="text-xs" fill="hsl(var(--muted-foreground))">Poor</text>
                
                <text x="130" y="75" className="text-xs" fill="hsl(var(--muted-foreground))">Score: 94%</text>
              </svg>
            )}
            
            {activeChart === 'community' && (
              <svg className="w-full h-full" viewBox="0 0 200 80">
                {/* Community engagement bubbles */}
                <circle cx="30" cy="30" r="8" fill="hsl(var(--primary))" opacity="0.7" />
                <circle cx="70" cy="25" r="12" fill="hsl(var(--success))" opacity="0.8" />
                <circle cx="110" cy="35" r="6" fill="hsl(var(--warning))" opacity="0.6" />
                <circle cx="150" cy="20" r="10" fill="hsl(var(--primary))" opacity="0.9" />
                <circle cx="180" cy="40" r="7" fill="hsl(var(--success))" opacity="0.7" />
                
                {/* Engagement connections */}
                <motion.path
                  d="M38 30 L62 25"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
                <motion.path
                  d="M82 25 L104 35"
                  stroke="hsl(var(--success))"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.4 }}
                />
                <motion.path
                  d="M140 20 L173 40"
                  stroke="hsl(var(--primary))"
                  strokeWidth="1"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 1, delay: 0.6 }}
                />
                
                <text x="10" y="70" className="text-xs" fill="hsl(var(--muted-foreground))">Community Engagement</text>
                <text x="130" y="70" className="text-xs" fill="hsl(var(--muted-foreground))">Active: 127</text>
              </svg>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* AI Recommendations */}
      <div className="p-4 border-b border-border/50">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <Lightbulb className="h-4 w-4 mr-2" />
          Task AI Insights
        </h4>
        <div className="space-y-3">
          <MicroAIRecommendation
            title="Task Prioritization"
            confidence={91}
            action="Reorder Task Queue"
            description="Move high-impact tasks to front based on community feedback"
          />
          <MicroAIRecommendation
            title="Team Velocity Boost"
            confidence={83}
            action="Suggest Pairing"
            description="Pair experienced members with blockers to accelerate progress"
          />
        </div>
      </div>

      {/* Task Actions */}
      <div className="p-4">
        <h4 className="text-sm font-medium text-foreground mb-3 flex items-center">
          <Target className="h-4 w-4 mr-2" />
          Task Actions
        </h4>
        <div className="space-y-2">
          <Button size="sm" className="w-full text-xs">
            <Plus className="h-3 w-3 mr-1" />
            Create Micro-Task
          </Button>
          <Button size="sm" variant="outline" className="w-full text-xs">
            <MessageSquare className="h-3 w-3 mr-1" />
            Pulse Check
          </Button>
          <Button size="sm" variant="outline" className="w-full text-xs">
            <Users className="h-3 w-3 mr-1" />
            Engage Community
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