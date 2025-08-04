import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  GraduationCap, 
  Lightbulb, 
  TrendingUp, 
  AlertTriangle,
  CheckCircle,
  BookOpen,
  Target,
  Zap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LearningInsight {
  id: string;
  type: 'historical' | 'postmortem' | 'best-practice' | 'recommendation';
  title: string;
  description: string;
  relevanceScore: number;
  category: 'process' | 'policy' | 'system' | 'behavior';
  metadata: {
    dateCreated: Date;
    source: string;
    actionable: boolean;
    tags: string[];
  };
}

const mockLearningInsights: LearningInsight[] = [
  {
    id: 'insight-1',
    type: 'postmortem',
    title: 'Environmental Permit Delays - Root Cause Analysis',
    description: 'Previous incidents show that permit delays often stem from incomplete documentation submitted in initial applications. Implementing upfront checklist validation reduced delays by 35%.',
    relevanceScore: 92,
    category: 'process',
    metadata: {
      dateCreated: new Date('2024-01-15'),
      source: 'Post-Mortem Analysis Q4 2023',
      actionable: true,
      tags: ['permits', 'documentation', 'process-improvement']
    }
  },
  {
    id: 'insight-2',
    type: 'best-practice',
    title: 'Community Engagement Success Pattern',
    description: 'Historical data shows that proactive community engagement sessions before policy changes result in 60% higher acceptance rates and fewer critical feedback incidents.',
    relevanceScore: 87,
    category: 'behavior',
    metadata: {
      dateCreated: new Date('2024-01-10'),
      source: 'Community Relations Analytics',
      actionable: true,
      tags: ['engagement', 'communication', 'policy']
    }
  },
  {
    id: 'insight-3',
    type: 'recommendation',
    title: 'Leverage Point Optimization',
    description: 'ML analysis suggests focusing intervention on information flow bottlenecks rather than increasing staff would yield 40% better outcomes based on similar system patterns.',
    relevanceScore: 84,
    category: 'system',
    metadata: {
      dateCreated: new Date('2024-01-20'),
      source: 'AI Recommendation Engine',
      actionable: true,
      tags: ['leverage-points', 'optimization', 'ai-analysis']
    }
  },
  {
    id: 'insight-4',
    type: 'historical',
    title: 'Seasonal Pattern in Micro-Loop Performance',
    description: 'Birth registration processing shows consistent 20% efficiency drop during summer months. Previous successful mitigation involved temporary staffing adjustments.',
    relevanceScore: 76,
    category: 'process',
    metadata: {
      dateCreated: new Date('2023-08-15'),
      source: 'Historical Performance Analysis',
      actionable: false,
      tags: ['seasonal', 'staffing', 'patterns']
    }
  }
];

export function LearningModeToggle() {
  const [isLearningMode, setIsLearningMode] = useState(false);
  const [selectedInsight, setSelectedInsight] = useState<string | null>(null);
  const [insights] = useState(mockLearningInsights);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'postmortem': return AlertTriangle;
      case 'best-practice': return CheckCircle;
      case 'recommendation': return Lightbulb;
      case 'historical': return BookOpen;
      default: return GraduationCap;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'postmortem': return 'text-warning';
      case 'best-practice': return 'text-success';
      case 'recommendation': return 'text-primary';
      case 'historical': return 'text-info';
      default: return 'text-muted-foreground';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'process': return Target;
      case 'policy': return BookOpen;
      case 'system': return TrendingUp;
      case 'behavior': return Zap;
      default: return GraduationCap;
    }
  };

  return (
    <div className="space-y-4">
      {/* Learning Mode Toggle */}
      <Card className="glass border-border/50">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg flex items-center space-x-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              <span>Learning Mode</span>
            </CardTitle>
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">
                {isLearningMode ? 'Active' : 'Inactive'}
              </span>
              <Switch
                checked={isLearningMode}
                onCheckedChange={setIsLearningMode}
              />
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            Overlay historical insights and recommended interventions based on past performance
          </p>
        </CardHeader>
      </Card>

      {/* Learning Insights Panel */}
      <AnimatePresence>
        {isLearningMode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="glass border-border/50">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Lightbulb className="h-5 w-5 text-warning" />
                    <span>Learning Insights</span>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {insights.length} insights available
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-80">
                  <div className="space-y-3">
                    {insights.map((insight) => {
                      const Icon = getInsightIcon(insight.type);
                      const CategoryIcon = getCategoryIcon(insight.category);
                      const isSelected = selectedInsight === insight.id;
                      
                      return (
                        <motion.div
                          key={insight.id}
                          layout
                          whileHover={{ scale: 1.01 }}
                          whileTap={{ scale: 0.99 }}
                          className={`p-4 rounded-lg border cursor-pointer transition-all duration-200 ${
                            isSelected 
                              ? 'border-primary ring-1 ring-primary/20 bg-primary/5' 
                              : 'border-border/50 hover:border-primary/50 glass-secondary'
                          }`}
                          onClick={() => setSelectedInsight(isSelected ? null : insight.id)}
                        >
                          <div className="flex items-start space-x-3">
                            <div className={`p-2 rounded-lg ${getInsightColor(insight.type)} bg-current/10`}>
                              <Icon className="h-4 w-4" />
                            </div>
                            
                            <div className="flex-1">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="text-sm font-medium text-foreground">
                                  {insight.title}
                                </h4>
                                <div className="flex items-center space-x-2">
                                  <Badge variant="outline" className="text-xs capitalize">
                                    {insight.type.replace('-', ' ')}
                                  </Badge>
                                  <div className="flex items-center space-x-1">
                                    <CategoryIcon className="h-3 w-3 text-muted-foreground" />
                                    <span className="text-xs text-muted-foreground capitalize">
                                      {insight.category}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-xs text-muted-foreground mb-3">
                                {insight.description}
                              </p>
                              
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-2">
                                  <div className="flex items-center space-x-1">
                                    <TrendingUp className="h-3 w-3 text-success" />
                                    <span className="text-xs text-success font-medium">
                                      {insight.relevanceScore}% relevant
                                    </span>
                                  </div>
                                  {insight.metadata.actionable && (
                                    <Badge variant="default" className="text-xs">
                                      Actionable
                                    </Badge>
                                  )}
                                </div>
                                
                                <div className="text-xs text-muted-foreground">
                                  {insight.metadata.source}
                                </div>
                              </div>

                              {/* Expanded Details */}
                              <AnimatePresence>
                                {isSelected && (
                                  <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    exit={{ opacity: 0, height: 0 }}
                                    className="mt-3 pt-3 border-t border-border/50"
                                  >
                                    <div className="space-y-2">
                                      <div>
                                        <span className="text-xs text-muted-foreground">Tags: </span>
                                        <div className="flex flex-wrap gap-1 mt-1">
                                          {insight.metadata.tags.map((tag, index) => (
                                            <Badge key={index} variant="outline" className="text-xs">
                                              {tag}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                      
                                      <div className="flex items-center justify-between">
                                        <span className="text-xs text-muted-foreground">
                                          Created: {insight.metadata.dateCreated.toLocaleDateString()}
                                        </span>
                                        
                                        {insight.metadata.actionable && (
                                          <Button size="sm" className="text-xs h-7">
                                            <Target className="h-3 w-3 mr-1" />
                                            Apply Insight
                                          </Button>
                                        )}
                                      </div>
                                    </div>
                                  </motion.div>
                                )}
                              </AnimatePresence>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}