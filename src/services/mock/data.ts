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

// Mock Loops - Updated to match Population and Development Framework
export const mockLoops: Loop[] = [
  // Meta Loop - Leading all others
  {
    id: 'loop-meta',
    name: 'The Population and Development Loop',
    tension: 'medium',
    srt: 18,
    leverage: 'high-leverage',
    deBand: 'yellow',
    triScore: 7.5,
    status: 'active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-07-29')
  },
  // Top Row Loops
  {
    id: 'loop-1',
    name: 'Natural Population Growth Loop',
    tension: 'high',
    srt: 6,
    leverage: 'high-leverage',
    deBand: 'red',
    triScore: 2.8,
    status: 'active',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-07-29')
  },
  {
    id: 'loop-2',
    name: 'Population and Resource Market Loop',
    tension: 'medium',
    srt: 12,
    leverage: 'medium-leverage',
    deBand: 'yellow',
    triScore: 6.2,
    status: 'active',
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-07-28')
  },
  {
    id: 'loop-3',
    name: 'Economic Model and Unnatural Population Growth Loop',
    tension: 'medium',
    srt: 15,
    leverage: 'medium-leverage',
    deBand: 'yellow',
    triScore: 5.9,
    status: 'active',
    createdAt: new Date('2024-04-10'),
    updatedAt: new Date('2024-07-27')
  },
  {
    id: 'loop-4',
    name: 'Environmental Quality Loop',
    tension: 'low',
    srt: 24,
    leverage: 'low-leverage',
    deBand: 'green',
    triScore: 8.1,
    status: 'active',
    createdAt: new Date('2024-03-20'),
    updatedAt: new Date('2024-07-26')
  },
  // Bottom Row Loops
  {
    id: 'loop-5',
    name: 'Production Process Loop',
    tension: 'high',
    srt: 9,
    leverage: 'high-leverage',
    deBand: 'orange',
    triScore: 3.4,
    status: 'active',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-07-25')
  },
  {
    id: 'loop-6',
    name: 'Economic Stability Loop',
    tension: 'medium',
    srt: 12,
    leverage: 'medium-leverage',
    deBand: 'yellow',
    triScore: 6.8,
    status: 'active',
    createdAt: new Date('2024-05-01'),
    updatedAt: new Date('2024-07-24')
  },
  {
    id: 'loop-7',
    name: 'Global Influence Loop',
    tension: 'medium',
    srt: 18,
    leverage: 'medium-leverage',
    deBand: 'yellow',
    triScore: 5.5,
    status: 'active',
    createdAt: new Date('2024-04-20'),
    updatedAt: new Date('2024-07-23')
  },
  {
    id: 'loop-8',
    name: 'Social Outcomes Loops',
    tension: 'low',
    srt: 15,
    leverage: 'medium-leverage',
    deBand: 'green',
    triScore: 7.9,
    status: 'active',
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-07-22')
  },
  {
    id: 'loop-9',
    name: 'Migration and Economic Opportunities Loop',
    tension: 'medium',
    srt: 9,
    leverage: 'high-leverage',
    deBand: 'orange',
    triScore: 4.7,
    status: 'active',
    createdAt: new Date('2024-06-10'),
    updatedAt: new Date('2024-07-21')
  },
  {
    id: 'loop-10',
    name: 'Social Structure Loop',
    tension: 'low',
    srt: 21,
    leverage: 'low-leverage',
    deBand: 'green',
    triScore: 8.3,
    status: 'active',
    createdAt: new Date('2024-02-28'),
    updatedAt: new Date('2024-07-20')
  }
];

// Mock Sprints - Updated for new loop system
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
    loopId: 'loop-meta',
    week: 2,
    totalWeeks: 18,
    tension: 'medium',
    srt: 18,
    leverage: 'high-leverage',
    interventions: [mockInterventions[1]],
    status: 'active',
    createdAt: new Date('2024-06-15')
  },
  {
    id: 'sprint-3',
    loopId: 'loop-5',
    week: 5,
    totalWeeks: 9,
    tension: 'high',
    srt: 9,
    leverage: 'high-leverage',
    interventions: [mockInterventions[0]],
    status: 'planning',
    createdAt: new Date('2024-07-10')
  }
];

// Mock Metrics - Updated for new loop system
export const mockMetrics: Metric[] = [
  {
    id: 'metric-1',
    loopId: 'loop-1',
    name: 'Fertility Rate Stability',
    value: 2.1,
    target: 2.1,
    unit: 'births/woman',
    category: 'population',
    trend: 'stable',
    sparklineData: [2.3, 2.2, 2.15, 2.12, 2.1, 2.08, 2.1],
    lastUpdated: new Date()
  },
  {
    id: 'metric-2',
    loopId: 'loop-meta',
    name: 'Population Development Index',
    value: 7.5,
    target: 8.0,
    unit: 'index',
    category: 'development',
    trend: 'up',
    sparklineData: [6.8, 7.0, 7.2, 7.3, 7.5, 7.4, 7.5],
    lastUpdated: new Date()
  },
  {
    id: 'metric-3',
    loopId: 'loop-2',
    name: 'Resource Market Efficiency',
    value: 82,
    target: 85,
    unit: '%',
    category: 'efficiency',
    trend: 'up',
    sparklineData: [78, 79, 80, 81, 82, 81, 82],
    lastUpdated: new Date()
  },
  {
    id: 'metric-4',
    loopId: 'loop-4',
    name: 'Environmental Quality Score',
    value: 8.1,
    target: 8.5,
    unit: 'score',
    category: 'environment',
    trend: 'up',
    sparklineData: [7.8, 7.9, 8.0, 8.0, 8.1, 8.2, 8.1],
    lastUpdated: new Date()
  },
  {
    id: 'metric-5',
    loopId: 'loop-6',
    name: 'Economic Stability Index',
    value: 6.8,
    target: 7.5,
    unit: 'index',
    category: 'economics',
    trend: 'stable',
    sparklineData: [6.5, 6.6, 6.7, 6.8, 6.8, 6.9, 6.8],
    lastUpdated: new Date()
  }
];

// Mock Insights - Updated for population and development context
export const mockInsights: Insight[] = [
  {
    id: 'insight-1',
    title: 'Population Growth Pattern Optimization',
    summary: 'Analysis shows fertility rate alignment with resource availability could reduce market stress by 34% over next 18 months.',
    category: 'opportunity',
    confidence: 0.87,
    createdAt: new Date('2024-07-19')
  },
  {
    id: 'insight-2',
    title: 'Economic Model Leverage Point Detected',
    summary: 'Meta-loop analysis reveals that demographic composition changes drive 67% of economic stability variance.',
    category: 'pattern',
    confidence: 0.92,
    createdAt: new Date('2024-07-18')
  },
  {
    id: 'insight-3',
    title: 'Migration Flow Risk Assessment',
    summary: 'Current economic opportunities creating unsustainable migration patterns - DE-Band breach likely in 6 months.',
    category: 'risk',
    confidence: 0.89,
    createdAt: new Date('2024-07-17')
  },
  {
    id: 'insight-4',
    title: 'Environmental Quality Feedback Loop',
    summary: 'Resource demand patterns show strong correlation with population development indicators - balancing loop activation recommended.',
    category: 'pattern',
    confidence: 0.84,
    createdAt: new Date('2024-07-16')
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