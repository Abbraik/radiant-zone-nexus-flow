import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, Users, Brain, Lightbulb, Target } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { useCommunityPulse } from '../../hooks/useCommunityPulse';
import type { CommunityMetric, CommunityInsight } from '../../types/community';

interface CommunityPulseDashboardProps {
  className?: string;
}

const CategoryIcon = ({ category }: { category: string }) => {
  switch (category) {
    case 'engagement': return <Users className="h-4 w-4" />;
    case 'collaboration': return <Target className="h-4 w-4" />;
    case 'learning': return <Brain className="h-4 w-4" />;
    case 'innovation': return <Lightbulb className="h-4 w-4" />;
    default: return <Users className="h-4 w-4" />;
  }
};

const TrendIcon = ({ trend }: { trend: 'up' | 'down' | 'stable' }) => {
  switch (trend) {
    case 'up': return <TrendingUp className="h-4 w-4 text-success" />;
    case 'down': return <TrendingDown className="h-4 w-4 text-destructive" />;
    case 'stable': return <Minus className="h-4 w-4 text-muted-foreground" />;
  }
};

const MetricCard = ({ metric }: { metric: CommunityMetric }) => {
  const progressPercentage = (metric.value / metric.target) * 100;
  const isOnTarget = metric.value >= metric.target;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-lg transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CategoryIcon category={metric.category} />
            {metric.name}
          </CardTitle>
          <TrendIcon trend={metric.trend} />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold">{metric.value}</span>
              <span className="text-sm text-muted-foreground">{metric.unit}</span>
              <Badge variant={isOnTarget ? "default" : "secondary"} className="text-xs">
                Target: {metric.target}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Progress</span>
                <span>{progressPercentage.toFixed(0)}%</span>
              </div>
              <div className="w-full bg-secondary rounded-full h-2">
                <motion.div
                  className={`h-2 rounded-full ${isOnTarget ? 'bg-success' : 'bg-primary'}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min(progressPercentage, 100)}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                />
              </div>
            </div>
            
            <div className="flex items-center gap-1 text-xs">
              <TrendIcon trend={metric.trend} />
              <span className={metric.trend === 'up' ? 'text-success' : metric.trend === 'down' ? 'text-destructive' : 'text-muted-foreground'}>
                {metric.change > 0 ? '+' : ''}{metric.change}% this week
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

const InsightCard = ({ insight }: { insight: CommunityInsight }) => {
  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'destructive';
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'secondary';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'opportunity': return 'bg-success/10 text-success border-success/20';
      case 'risk': return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'trend': return 'bg-primary/10 text-primary border-primary/20';
      case 'anomaly': return 'bg-warning/10 text-warning border-warning/20';
      default: return 'bg-muted';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="hover:shadow-md transition-shadow">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-sm font-medium">{insight.title}</CardTitle>
            <div className="flex gap-2">
              <Badge variant={getSeverityColor(insight.severity) as any} className="text-xs">
                {insight.severity}
              </Badge>
              <Badge className={`text-xs ${getTypeColor(insight.type)}`}>
                {insight.type}
              </Badge>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">{insight.description}</p>
          
          {insight.affectedAreas.length > 0 && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">Affected Areas:</span>
              <div className="flex flex-wrap gap-1 mt-1">
                {insight.affectedAreas.map((area, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {area}
                  </Badge>
                ))}
              </div>
            </div>
          )}
          
          {insight.suggestedActions.length > 0 && (
            <div>
              <span className="text-xs font-medium text-muted-foreground">Suggested Actions:</span>
              <ul className="mt-1 space-y-1">
                {insight.suggestedActions.map((action, index) => (
                  <li key={index} className="text-xs text-muted-foreground flex items-start gap-1">
                    <span className="text-primary">•</span>
                    {action}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
};

export const CommunityPulseDashboard: React.FC<CommunityPulseDashboardProps> = ({
  className = ''
}) => {
  const { metrics, insights, loading } = useCommunityPulse();

  if (loading) {
    return (
      <div className={`space-y-6 ${className}`}>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-8 bg-muted rounded w-1/2" />
                  <div className="h-2 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-2/3" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <MetricCard key={metric.id} metric={metric} />
        ))}
      </div>

      {/* Community Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            Community Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {insights.map((insight) => (
              <InsightCard key={insight.id} insight={insight} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};