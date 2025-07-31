import { useState, useEffect } from 'react';
import type { CommunityMetric, CommunityInsight } from '../types/community';

// Mock data for community pulse
const mockCommunityMetrics: CommunityMetric[] = [
  {
    id: 'engagement-rate',
    name: 'Community Engagement',
    value: 78,
    target: 85,
    trend: 'up',
    change: 5.2,
    unit: '%',
    category: 'engagement'
  },
  {
    id: 'collaboration-score',
    name: 'Collaboration Score',
    value: 92,
    target: 90,
    trend: 'up',
    change: 8.1,
    unit: 'points',
    category: 'collaboration'
  },
  {
    id: 'learning-adoption',
    name: 'Learning Path Adoption',
    value: 65,
    target: 75,
    trend: 'stable',
    change: 1.3,
    unit: '%',
    category: 'learning'
  },
  {
    id: 'innovation-index',
    name: 'Innovation Index',
    value: 87,
    target: 80,
    trend: 'up',
    change: 12.5,
    unit: 'index',
    category: 'innovation'
  }
];

const mockCommunityInsights: CommunityInsight[] = [
  {
    id: 'insight-1',
    title: 'Increased Cross-Team Collaboration',
    description: 'Teams are sharing insights 40% more frequently, leading to breakthrough solutions.',
    type: 'opportunity',
    severity: 'medium',
    timestamp: new Date().toISOString(),
    affectedAreas: ['Team Alpha', 'Team Beta', 'Innovation Lab'],
    suggestedActions: ['Expand collaboration tools', 'Create structured sharing sessions'],
    relatedMetrics: ['collaboration-score', 'innovation-index']
  },
  {
    id: 'insight-2',
    title: 'Learning Path Completion Plateau',
    description: 'Some advanced learning paths showing decreased completion rates.',
    type: 'risk',
    severity: 'low',
    timestamp: new Date(Date.now() - 86400000).toISOString(),
    affectedAreas: ['Advanced Analytics', 'Systems Thinking'],
    suggestedActions: ['Review path difficulty', 'Add mentorship components'],
    relatedMetrics: ['learning-adoption']
  }
];

export const useCommunityPulse = () => {
  const [metrics, setMetrics] = useState<CommunityMetric[]>([]);
  const [insights, setInsights] = useState<CommunityInsight[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setMetrics(mockCommunityMetrics);
      setInsights(mockCommunityInsights);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const refreshData = () => {
    setLoading(true);
    // Simulate refresh
    setTimeout(() => {
      setMetrics([...mockCommunityMetrics]);
      setInsights([...mockCommunityInsights]);
      setLoading(false);
    }, 500);
  };

  return {
    metrics,
    insights,
    loading,
    refreshData
  };
};