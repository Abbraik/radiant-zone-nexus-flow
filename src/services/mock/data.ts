import type { Loop, Sprint, Metric, Insight, Intervention, Role } from '../../types';

// Mock Roles
export const mockRoles: Role[] = [
  {
    id: 'role-1',
    name: 'Sarah Chen',
    email: 'sarah.chen@rgs.com',
    type: 'lead',
    responsibilities: ['Sprint Planning', 'Stakeholder Communication'],
    avatar: '👩‍💼'
  },
  {
    id: 'role-2',
    name: 'Marcus Rodriguez',
    email: 'marcus.r@rgs.com',
    type: 'contributor',
    responsibilities: ['Implementation', 'Testing'],
    avatar: '👨‍💻'
  },
  {
    id: 'role-3',
    name: 'Elena Vasquez',
    email: 'elena.v@rgs.com',
    type: 'reviewer',
    responsibilities: ['Quality Assurance', 'Process Review'],
    avatar: '👩‍🔬'
  }
];

// Mock Interventions
export const mockInterventions: Intervention[] = [
  {
    id: 'int-1',
    name: 'Automated Testing Pipeline',
    description: 'Implement comprehensive CI/CD testing automation',
    type: 'technology',
    effort: 'high',
    impact: 'high',
    roles: [mockRoles[0], mockRoles[1]],
    status: 'planned',
    dueDate: new Date('2024-08-15')
  },
  {
    id: 'int-2',
    name: 'Weekly Retrospectives',
    description: 'Establish regular team reflection sessions',
    type: 'process',
    effort: 'low',
    impact: 'medium',
    roles: [mockRoles[0], mockRoles[2]],
    status: 'in-progress'
  },
  {
    id: 'int-3',
    name: 'Performance Monitoring Dashboard',
    description: 'Real-time visibility into system performance',
    type: 'technology',
    effort: 'medium',
    impact: 'high',
    roles: [mockRoles[1]],
    status: 'planned'
  }
];

// Mock Loops
export const mockLoops: Loop[] = [
  {
    id: 'loop-1',
    name: 'Core Platform Delivery',
    tension: 'high',
    srt: 6,
    leverage: 'high-leverage',
    deBand: 'red',
    triScore: 2.3,
    status: 'active',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-07-20')
  },
  {
    id: 'loop-2',
    name: 'Customer Experience',
    tension: 'medium',
    srt: 12,
    leverage: 'medium-leverage',
    deBand: 'yellow',
    triScore: 6.8,
    status: 'active',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-07-18')
  },
  {
    id: 'loop-3',
    name: 'Infrastructure Optimization',
    tension: 'low',
    srt: 18,
    leverage: 'medium-leverage',
    deBand: 'green',
    triScore: 8.2,
    status: 'active',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-07-15')
  }
];

// Mock Sprints
export const mockSprints: Sprint[] = [
  {
    id: 'sprint-1',
    loopId: 'loop-1',
    week: 3,
    totalWeeks: 12,
    tension: 'high',
    srt: 6,
    leverage: 'high-leverage',
    interventions: [mockInterventions[0], mockInterventions[2]],
    status: 'active',
    createdAt: new Date('2024-07-01')
  },
  {
    id: 'sprint-2',
    loopId: 'loop-2',
    week: 5,
    totalWeeks: 24,
    tension: 'medium',
    srt: 12,
    leverage: 'medium-leverage',
    interventions: [mockInterventions[1]],
    status: 'planning',
    createdAt: new Date('2024-06-15')
  }
];

// Mock Metrics
export const mockMetrics: Metric[] = [
  {
    id: 'metric-1',
    loopId: 'loop-1',
    name: 'Deployment Frequency',
    value: 3.2,
    target: 5.0,
    unit: 'per week',
    category: 'delivery',
    trend: 'up',
    sparklineData: [2.1, 2.8, 3.0, 2.9, 3.2, 3.1, 3.2],
    lastUpdated: new Date()
  },
  {
    id: 'metric-2',
    loopId: 'loop-1',
    name: 'Lead Time',
    value: 4.5,
    target: 2.0,
    unit: 'days',
    category: 'efficiency',
    trend: 'down',
    sparklineData: [6.2, 5.8, 5.1, 4.9, 4.5, 4.3, 4.5],
    lastUpdated: new Date()
  },
  {
    id: 'metric-3',
    loopId: 'loop-2',
    name: 'Customer Satisfaction',
    value: 7.8,
    target: 8.5,
    unit: 'score',
    category: 'satisfaction',
    trend: 'stable',
    sparklineData: [7.5, 7.6, 7.8, 7.7, 7.8, 7.9, 7.8],
    lastUpdated: new Date()
  }
];

// Mock Insights
export const mockInsights: Insight[] = [
  {
    id: 'insight-1',
    title: 'Automation Opportunity Detected',
    summary: 'Analysis shows 73% of manual testing tasks could be automated, potentially reducing lead time by 2.3 days.',
    category: 'opportunity',
    confidence: 0.89,
    createdAt: new Date('2024-07-19')
  },
  {
    id: 'insight-2',
    title: 'Sprint Velocity Pattern',
    summary: 'Teams show 23% higher velocity when sprint duration is aligned with natural work rhythms.',
    category: 'pattern',
    confidence: 0.76,
    createdAt: new Date('2024-07-18')
  },
  {
    id: 'insight-3',
    title: 'Dependency Risk Alert',
    summary: 'External API dependencies contributing to 43% of deployment delays in high-tension loops.',
    category: 'risk',
    confidence: 0.92,
    createdAt: new Date('2024-07-17')
  }
];

// Utility functions for mock data
export const generateSparklineData = (base: number, variance: number, points: number = 7): number[] => {
  return Array.from({ length: points }, (_, i) => {
    const trend = (i - points / 2) * 0.1;
    const random = (Math.random() - 0.5) * variance;
    return Math.max(0, base + trend + random);
  });
};

export const getRandomTension = (): any => {
  const tensions = ['high', 'medium', 'low', 'neutral'];
  return tensions[Math.floor(Math.random() * tensions.length)];
};

export const getRandomDEBand = (): any => {
  const bands = ['red', 'orange', 'yellow', 'green'];
  return bands[Math.floor(Math.random() * bands.length)];
};