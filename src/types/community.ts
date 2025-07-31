export interface CommunityMetric {
  id: string;
  name: string;
  value: number;
  target: number;
  trend: 'up' | 'down' | 'stable';
  change: number;
  unit: string;
  category: 'engagement' | 'collaboration' | 'learning' | 'innovation';
}

export interface CommunityInsight {
  id: string;
  title: string;
  description: string;
  type: 'trend' | 'anomaly' | 'opportunity' | 'risk';
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: string;
  affectedAreas: string[];
  suggestedActions: string[];
  relatedMetrics: string[];
}

export interface LearningPath {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  estimatedTime: string;
  completionRate: number;
  modules: LearningModule[];
  prerequisites: string[];
  tags: string[];
  relevanceScore: number;
}

export interface LearningModule {
  id: string;
  title: string;
  type: 'video' | 'article' | 'interactive' | 'assessment';
  duration: string;
  status: 'not_started' | 'in_progress' | 'completed';
  progress: number;
}

export interface KnowledgeArticle {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  lastUpdated: string;
  author: string;
  relevanceScore: number;
  views: number;
  helpful: number;
  relatedArticles: string[];
}

export interface CollaborativeInsight {
  id: string;
  title: string;
  description: string;
  author: string;
  team: string;
  category: 'best_practice' | 'lesson_learned' | 'innovation' | 'challenge';
  impact: 'low' | 'medium' | 'high';
  applicability: string[];
  timestamp: string;
  likes: number;
  comments: number;
  implementations: number;
}

export interface UserBehaviorPattern {
  userId: string;
  preferredViews: string[];
  frequentActions: string[];
  timePatterns: {
    peak_hours: string[];
    preferred_duration: string;
  };
  learningStyle: 'visual' | 'analytical' | 'collaborative' | 'hands_on';
  adaptationLevel: number;
}