import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Heart, MessageSquare, TrendingUp, Filter, Search, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import type { CollaborativeInsight } from '../../types/community';

interface CollaborativeInsightsEngineProps {
  className?: string;
}

// Mock collaborative insights data
const mockInsights: CollaborativeInsight[] = [
  {
    id: 'insight-1',
    title: 'Rapid Loop Identification Technique',
    description: 'Discovered a new method to identify critical feedback loops 60% faster using pattern recognition and visual mapping.',
    author: 'Sarah Chen',
    team: 'Systems Analysis',
    category: 'innovation',
    impact: 'high',
    applicability: ['Loop Analysis', 'Pattern Recognition', 'Visual Mapping'],
    timestamp: new Date().toISOString(),
    likes: 24,
    comments: 8,
    implementations: 5
  },
  {
    id: 'insight-2',
    title: 'Cross-Team Collaboration Best Practice',
    description: 'Implementing daily 15-minute sync sessions between teams reduced duplicate work by 40% and improved solution quality.',
    author: 'Marcus Rodriguez',
    team: 'Innovation Lab',
    category: 'best_practice',
    impact: 'medium',
    applicability: ['Team Coordination', 'Process Optimization', 'Communication'],
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    likes: 18,
    comments: 12,
    implementations: 8
  },
  {
    id: 'insight-3',
    title: 'Intervention Timing Optimization',
    description: 'Found that interventions are 3x more effective when applied during system stress periods rather than stable states.',
    author: 'Dr. Emily Watson',
    team: 'Research Division',
    category: 'lesson_learned',
    impact: 'high',
    applicability: ['Intervention Design', 'Timing Strategy', 'System Analysis'],
    timestamp: new Date(Date.now() - 172800000).toISOString(),
    likes: 31,
    comments: 15,
    implementations: 12
  },
  {
    id: 'insight-4',
    title: 'Resource Allocation Challenge',
    description: 'Struggling with balancing short-term fixes vs long-term systematic solutions. Need better framework for decision making.',
    author: 'Alex Thompson',
    team: 'Operations',
    category: 'challenge',
    impact: 'medium',
    applicability: ['Resource Management', 'Strategic Planning', 'Decision Making'],
    timestamp: new Date(Date.now() - 259200000).toISOString(),
    likes: 9,
    comments: 6,
    implementations: 2
  }
];

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'best_practice': return '⭐';
    case 'lesson_learned': return '💡';
    case 'innovation': return '🚀';
    case 'challenge': return '🤔';
    default: return '📝';
  }
};

const getImpactColor = (impact: string) => {
  switch (impact) {
    case 'high': return 'bg-success/10 text-success border-success/20';
    case 'medium': return 'bg-warning/10 text-warning border-warning/20';
    case 'low': return 'bg-muted/10 text-muted-foreground border-muted/20';
    default: return 'bg-muted';
  }
};

const InsightCard = ({ insight }: { insight: CollaborativeInsight }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="space-y-2 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{CategoryIcon({ category: insight.category })}</span>
                <CardTitle className="text-base font-semibold">{insight.title}</CardTitle>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>by {insight.author}</span>
                <span>•</span>
                <span>{insight.team}</span>
                <span>•</span>
                <span>{new Date(insight.timestamp).toLocaleDateString()}</span>
              </div>
            </div>
            <Badge className={`text-xs ${getImpactColor(insight.impact)}`}>
              {insight.impact} impact
            </Badge>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">{insight.description}</p>
          
          <div className="flex flex-wrap gap-1">
            {insight.applicability.map((area, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {area}
              </Badge>
            ))}
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Heart className="h-4 w-4 text-muted-foreground" />
                <span>{insight.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                <span>{insight.comments}</span>
              </div>
              <div className="flex items-center gap-1">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span>{insight.implementations} implemented</span>
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="text-xs">
                <Heart className="h-3 w-3 mr-1" />
                Like
              </Button>
              <Button variant="ghost" size="sm" className="text-xs">
                <MessageSquare className="h-3 w-3 mr-1" />
                Comment
              </Button>
              <Button variant="outline" size="sm" className="text-xs">
                Implement
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const CollaborativeInsightsEngine: React.FC<CollaborativeInsightsEngineProps> = ({
  className = ''
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [impactFilter, setImpactFilter] = useState<string>('all');

  const filteredInsights = mockInsights.filter(insight => {
    const matchesSearch = insight.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         insight.author.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || insight.category === categoryFilter;
    const matchesImpact = impactFilter === 'all' || insight.impact === impactFilter;
    
    return matchesSearch && matchesCategory && matchesImpact;
  });

  return (
    <div className={`space-y-6 ${className}`}>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Collaborative Insights
            </CardTitle>
            <Button size="sm" className="text-xs">
              <Plus className="h-3 w-3 mr-1" />
              Share Insight
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search insights..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="best_practice">Best Practices</SelectItem>
                <SelectItem value="lesson_learned">Lessons Learned</SelectItem>
                <SelectItem value="innovation">Innovations</SelectItem>
                <SelectItem value="challenge">Challenges</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={impactFilter} onValueChange={setImpactFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Impact" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Impact</SelectItem>
                <SelectItem value="high">High Impact</SelectItem>
                <SelectItem value="medium">Medium Impact</SelectItem>
                <SelectItem value="low">Low Impact</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Insights Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {filteredInsights.map((insight) => (
                <InsightCard key={insight.id} insight={insight} />
              ))}
            </AnimatePresence>
          </div>

          {filteredInsights.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">No insights found</h3>
              <p className="text-muted-foreground">Try adjusting your search or filters</p>
            </motion.div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};