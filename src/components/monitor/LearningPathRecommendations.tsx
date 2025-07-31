import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BookOpen, Clock, Star, ChevronRight, Play, CheckCircle, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import type { LearningPath, LearningModule } from '../../types/community';

interface LearningPathRecommendationsProps {
  className?: string;
}

// Mock learning paths data
const mockLearningPaths: LearningPath[] = [
  {
    id: 'systems-thinking-advanced',
    title: 'Advanced Systems Thinking',
    description: 'Deep dive into complex system dynamics and leverage points for maximum impact.',
    difficulty: 'advanced',
    estimatedTime: '4-6 weeks',
    completionRate: 78,
    relevanceScore: 95,
    prerequisites: ['Systems Thinking Basics', 'Loop Analysis'],
    tags: ['systems', 'strategy', 'analysis'],
    modules: [
      {
        id: 'mod-1',
        title: 'Complex System Dynamics',
        type: 'video',
        duration: '45 min',
        status: 'completed',
        progress: 100
      },
      {
        id: 'mod-2',
        title: 'Leverage Point Identification',
        type: 'interactive',
        duration: '60 min',
        status: 'in_progress',
        progress: 65
      },
      {
        id: 'mod-3',
        title: 'Systems Intervention Design',
        type: 'article',
        duration: '30 min',
        status: 'not_started',
        progress: 0
      },
      {
        id: 'mod-4',
        title: 'Case Study Analysis',
        type: 'assessment',
        duration: '90 min',
        status: 'not_started',
        progress: 0
      }
    ]
  },
  {
    id: 'collaborative-problem-solving',
    title: 'Collaborative Problem Solving',
    description: 'Learn effective techniques for team-based problem solving and decision making.',
    difficulty: 'intermediate',
    estimatedTime: '2-3 weeks',
    completionRate: 85,
    relevanceScore: 88,
    prerequisites: ['Team Dynamics', 'Communication Skills'],
    tags: ['collaboration', 'teamwork', 'decision-making'],
    modules: [
      {
        id: 'mod-5',
        title: 'Team Problem-Solving Frameworks',
        type: 'video',
        duration: '35 min',
        status: 'not_started',
        progress: 0
      },
      {
        id: 'mod-6',
        title: 'Facilitation Techniques',
        type: 'interactive',
        duration: '50 min',
        status: 'not_started',
        progress: 0
      },
      {
        id: 'mod-7',
        title: 'Consensus Building',
        type: 'article',
        duration: '25 min',
        status: 'not_started',
        progress: 0
      }
    ]
  },
  {
    id: 'data-driven-insights',
    title: 'Data-Driven Insights',
    description: 'Transform raw data into actionable insights for better decision making.',
    difficulty: 'beginner',
    estimatedTime: '3-4 weeks',
    completionRate: 92,
    relevanceScore: 82,
    prerequisites: [],
    tags: ['analytics', 'data', 'insights'],
    modules: [
      {
        id: 'mod-8',
        title: 'Data Analysis Fundamentals',
        type: 'video',
        duration: '40 min',
        status: 'not_started',
        progress: 0
      },
      {
        id: 'mod-9',
        title: 'Visualization Techniques',
        type: 'interactive',
        duration: '55 min',
        status: 'not_started',
        progress: 0
      }
    ]
  }
];

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => {
  const getColor = () => {
    switch (difficulty) {
      case 'beginner': return 'bg-success/10 text-success border-success/20';
      case 'intermediate': return 'bg-warning/10 text-warning border-warning/20';
      case 'advanced': return 'bg-destructive/10 text-destructive border-destructive/20';
      default: return 'bg-muted';
    }
  };

  return (
    <Badge className={`text-xs ${getColor()}`}>
      {difficulty}
    </Badge>
  );
};

const ModuleIcon = ({ type, status }: { type: string; status: string }) => {
  if (status === 'completed') {
    return <CheckCircle className="h-4 w-4 text-success" />;
  }
  
  if (status === 'in_progress') {
    return <Circle className="h-4 w-4 text-primary animate-pulse" />;
  }

  switch (type) {
    case 'video': return <Play className="h-4 w-4 text-muted-foreground" />;
    case 'interactive': return <Circle className="h-4 w-4 text-muted-foreground" />;
    case 'article': return <BookOpen className="h-4 w-4 text-muted-foreground" />;
    case 'assessment': return <Star className="h-4 w-4 text-muted-foreground" />;
    default: return <Circle className="h-4 w-4 text-muted-foreground" />;
  }
};

const ModuleCard = ({ module }: { module: LearningModule }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center gap-3 p-3 rounded-lg border bg-card/50 hover:bg-card transition-colors"
    >
      <ModuleIcon type={module.type} status={module.status} />
      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-medium truncate">{module.title}</h4>
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" />
          {module.duration}
          <Badge variant="outline" className="text-xs">
            {module.type}
          </Badge>
        </div>
      </div>
      {module.status === 'in_progress' && (
        <div className="w-16">
          <Progress value={module.progress} className="h-1" />
        </div>
      )}
    </motion.div>
  );
};

const LearningPathCard = ({ path }: { path: LearningPath }) => {
  const [expanded, setExpanded] = useState(false);
  const overallProgress = path.modules.reduce((acc, mod) => acc + mod.progress, 0) / path.modules.length;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <CardTitle className="text-base font-semibold">{path.title}</CardTitle>
              <p className="text-sm text-muted-foreground">{path.description}</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <DifficultyBadge difficulty={path.difficulty} />
              <Badge variant="secondary" className="text-xs">
                {path.relevanceScore}% match
              </Badge>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <span>{path.estimatedTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="h-4 w-4 text-muted-foreground" />
              <span>{path.completionRate}% completion rate</span>
            </div>
          </div>

          {path.prerequisites.length > 0 && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">Prerequisites:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {path.prerequisites.map((prereq, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {prereq}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-wrap gap-1">
            {path.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Overall Progress</span>
              <span>{overallProgress.toFixed(0)}%</span>
            </div>
            <Progress value={overallProgress} className="h-2" />
          </div>

          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setExpanded(!expanded)}
              className="text-xs"
            >
              {expanded ? 'Hide' : 'View'} Modules
              <ChevronRight className={`h-3 w-3 ml-1 transition-transform ${expanded ? 'rotate-90' : ''}`} />
            </Button>
            <Button size="sm" className="text-xs">
              Start Learning
            </Button>
          </div>

          <AnimatePresence>
            {expanded && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="space-y-2 pt-2 border-t"
              >
                {path.modules.map((module) => (
                  <ModuleCard key={module.id} module={module} />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const LearningPathRecommendations: React.FC<LearningPathRecommendationsProps> = ({
  className = ''
}) => {
  const [sortBy, setSortBy] = useState<'relevance' | 'difficulty' | 'duration'>('relevance');

  const sortedPaths = [...mockLearningPaths].sort((a, b) => {
    switch (sortBy) {
      case 'relevance':
        return b.relevanceScore - a.relevanceScore;
      case 'difficulty':
        const difficultyOrder = { beginner: 1, intermediate: 2, advanced: 3 };
        return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
      case 'duration':
        return a.estimatedTime.localeCompare(b.estimatedTime);
      default:
        return 0;
    }
  });

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Recommended Learning Paths
            </CardTitle>
            <div className="flex gap-2">
              <Button
                variant={sortBy === 'relevance' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('relevance')}
                className="text-xs"
              >
                Relevance
              </Button>
              <Button
                variant={sortBy === 'difficulty' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('difficulty')}
                className="text-xs"
              >
                Difficulty
              </Button>
              <Button
                variant={sortBy === 'duration' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSortBy('duration')}
                className="text-xs"
              >
                Duration
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {sortedPaths.map((path) => (
              <LearningPathCard key={path.id} path={path} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};