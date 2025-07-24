import type { 
  GlobalHealth, 
  KPIMetric, 
  Alert, 
  AIPrediction, 
  TimelineEvent, 
  ResourceMetric, 
  DigitalTwinData, 
  GoalTreeNode, 
  PresenceData, 
  MissionControlData 
} from './types';

// Mock Global Health Data
export const mockGlobalHealth: GlobalHealth = {
  overall: 87,
  pillars: {
    think: 92,
    act: 84,
    monitor: 89,
    innovate: 83
  },
  trend: 'up',
  lastUpdated: new Date()
};

// Mock KPI Metrics
export const mockKPIs: KPIMetric[] = [
  {
    id: 'active-sprints',
    label: 'Active Sprints',
    value: 12,
    icon: 'Activity',
    trend: 'stable',
    changePercent: 0
  },
  {
    id: 'critical-issues',
    label: 'Critical Issues',
    value: 3,
    target: 5,
    icon: 'AlertTriangle',
    trend: 'down',
    changePercent: -25
  },
  {
    id: 'avg-response',
    label: 'Avg Response',
    value: '2.4h',
    target: 4,
    unit: 'hours',
    icon: 'Clock',
    trend: 'up',
    changePercent: 15
  },
  {
    id: 'pending-approvals',
    label: 'Pending Approvals',
    value: 8,
    target: 10,
    icon: 'CheckSquare',
    trend: 'down',
    changePercent: -20
  },
  {
    id: 'sim-runs',
    label: 'Sim Runs Today',
    value: 156,
    target: 200,
    icon: 'Zap',
    trend: 'up',
    changePercent: 45
  }
];

// Mock Alerts
export const mockAlerts: Alert[] = [
  {
    id: 'alert-1',
    type: 'warning',
    title: 'Sprint Velocity Declining',
    message: 'Team Alpha sprint velocity has decreased by 15% over the last 2 weeks',
    timestamp: new Date(Date.now() - 2 * 60 * 1000),
    severity: 'medium',
    source: 'Sprint Analytics',
    actionable: true,
    deepLink: '/dashboard?team=alpha'
  },
  {
    id: 'alert-2',
    type: 'info',
    title: 'Digital Twin Completed',
    message: 'Process optimization simulation for Loop-7 has completed with 12% efficiency gain',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    severity: 'low',
    source: 'Digital Twin Engine',
    actionable: false
  },
  {
    id: 'alert-3',
    type: 'error',
    title: 'Budget Threshold Exceeded',
    message: 'Project Beta has exceeded 85% of allocated budget with 6 weeks remaining',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    severity: 'high',
    source: 'Resource Monitor',
    actionable: true,
    deepLink: '/monitor?project=beta'
  },
  {
    id: 'alert-4',
    type: 'success',
    title: 'OKR Milestone Achieved',
    message: 'Q1 customer satisfaction target reached 2 weeks ahead of schedule',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    severity: 'low',
    source: 'OKR Tracker',
    actionable: false
  }
];

// Mock AI Predictions
export const mockPredictions: AIPrediction[] = [
  {
    id: 'pred-1',
    prediction: 'Resource bottleneck likely in Q2',
    confidence: 85,
    timeframe: '6-8 weeks',
    impact: 'negative',
    category: 'resource'
  },
  {
    id: 'pred-2',
    prediction: 'Sprint completion rate may improve',
    confidence: 72,
    timeframe: '2-3 weeks',
    impact: 'positive',
    category: 'timeline'
  },
  {
    id: 'pred-3',
    prediction: 'Budget variance expected next month',
    confidence: 91,
    timeframe: '3-4 weeks',
    impact: 'negative',
    category: 'risk'
  }
];

// Mock Timeline Events
export const mockTimeline: TimelineEvent[] = [
  {
    id: 'event-1',
    title: 'Sprint 12: User Experience Enhancement',
    description: 'Focus on improving user interface and accessibility features across all platforms. This sprint includes redesigning key workflows and implementing user feedback from the previous quarter.',
    startDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 16 * 24 * 60 * 60 * 1000),
    type: 'sprint',
    status: 'planned',
    progress: 0,
    assignees: ['team-alpha', 'ux-team'],
    priority: 'high',
    objectives: [
      'Redesign the main dashboard interface',
      'Implement accessibility features for screen readers',
      'Optimize mobile responsiveness',
      'Conduct user testing sessions',
      'Update design system components'
    ],
    team: ['Sarah Chen', 'Marcus Johnson', 'Emily Rodriguez', 'Alex Kim'],
    milestones: [
      {
        id: 'm1',
        title: 'Design mockups completed',
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false
      },
      {
        id: 'm2',
        title: 'Accessibility audit completed',
        dueDate: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false
      },
      {
        id: 'm3',
        title: 'User testing session conducted',
        dueDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false
      }
    ]
  },
  {
    id: 'event-2',
    title: 'Q1 Review Milestone',
    startDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    type: 'milestone',
    status: 'planned',
    progress: 45,
    assignees: ['leadership'],
    priority: 'critical'
  },
  {
    id: 'event-3',
    title: 'Sprint 11: Performance Optimization',
    description: 'Current sprint focused on improving system performance and reducing load times across all modules.',
    startDate: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000),
    endDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
    type: 'sprint',
    status: 'active',
    progress: 73,
    assignees: ['team-beta', 'infrastructure'],
    priority: 'critical',
    objectives: [
      'Optimize database queries and indexes',
      'Implement caching strategies',
      'Reduce bundle sizes for frontend applications',
      'Setup performance monitoring dashboards',
      'Conduct load testing'
    ],
    team: ['David Wilson', 'Lisa Park', 'James Thompson'],
    milestones: [
      {
        id: 'm4',
        title: 'Database optimization completed',
        dueDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true
      },
      {
        id: 'm5',
        title: 'Caching implementation done',
        dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        completed: true
      },
      {
        id: 'm6',
        title: 'Load testing completed',
        dueDate: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString(),
        completed: false
      }
    ]
  }
];

// Mock Resource Metrics
export const mockResources: ResourceMetric[] = [
  {
    id: 'budget-main',
    name: 'Main Budget',
    category: 'budget',
    allocated: 500000,
    utilized: 342000,
    available: 158000,
    unit: 'USD',
    burnRate: 12000,
    forecast: [342000, 354000, 366000, 378000, 390000],
    status: 'healthy'
  },
  {
    id: 'dev-team',
    name: 'Development Team',
    category: 'personnel',
    allocated: 12,
    utilized: 10,
    available: 2,
    unit: 'people',
    burnRate: 0.5,
    forecast: [10, 10.5, 11, 11, 12],
    status: 'warning'
  },
  {
    id: 'cloud-infra',
    name: 'Cloud Infrastructure',
    category: 'infrastructure',
    allocated: 100,
    utilized: 67,
    available: 33,
    unit: '%',
    burnRate: 3.2,
    forecast: [67, 70, 73, 76, 79],
    status: 'healthy'
  }
];

// Mock Digital Twin Data
export const mockDigitalTwins: DigitalTwinData[] = [
  {
    id: 'twin-1',
    name: 'Loop Optimizer',
    type: 'loop',
    status: 'running',
    metrics: {
      efficiency: 87,
      quality: 92,
      velocity: 78,
      satisfaction: 85
    },
    lastRun: new Date(Date.now() - 30 * 60 * 1000),
    nextRun: new Date(Date.now() + 30 * 60 * 1000),
    responseData: [65, 72, 78, 85, 87, 89, 87]
  },
  {
    id: 'twin-2',
    name: 'Sprint Predictor',
    type: 'sprint',
    status: 'completed',
    metrics: {
      efficiency: 94,
      quality: 88,
      velocity: 91,
      satisfaction: 87
    },
    lastRun: new Date(Date.now() - 2 * 60 * 60 * 1000),
    responseData: [75, 81, 88, 91, 94, 96, 94]
  },
  {
    id: 'twin-3',
    name: 'Risk Analyzer',
    type: 'system',
    status: 'running',
    metrics: {
      efficiency: 76,
      quality: 83,
      velocity: 69,
      satisfaction: 72
    },
    lastRun: new Date(Date.now() - 15 * 60 * 1000),
    nextRun: new Date(Date.now() + 45 * 60 * 1000),
    responseData: [60, 65, 69, 72, 76, 78, 76]
  },
  {
    id: 'twin-4',
    name: 'Resource Optimizer',
    type: 'intervention',
    status: 'paused',
    metrics: {
      efficiency: 82,
      quality: 79,
      velocity: 85,
      satisfaction: 81
    },
    lastRun: new Date(Date.now() - 4 * 60 * 60 * 1000),
    responseData: [70, 74, 79, 82, 85, 84, 82]
  }
];

// Mock Goal Tree
export const mockGoalTree: GoalTreeNode[] = [
  {
    id: 'goal-1',
    title: 'Improve Operational Excellence',
    type: 'goal',
    progress: 67,
    status: 'in-progress',
    priority: 'critical',
    dueDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
    assignees: ['leadership'],
    children: [
      {
        id: 'okr-1',
        title: 'Reduce Process Inefficiencies by 25%',
        type: 'okr',
        parentId: 'goal-1',
        progress: 78,
        status: 'in-progress',
        priority: 'high',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        assignees: ['team-alpha']
      },
      {
        id: 'okr-2',
        title: 'Increase Team Satisfaction to 90%',
        type: 'okr',
        parentId: 'goal-1',
        progress: 56,
        status: 'in-progress',
        priority: 'medium',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        assignees: ['hr-team']
      }
    ]
  },
  {
    id: 'goal-2',
    title: 'Accelerate Digital Transformation',
    type: 'goal',
    progress: 45,
    status: 'in-progress',
    priority: 'high',
    dueDate: new Date(Date.now() + 120 * 24 * 60 * 60 * 1000),
    assignees: ['tech-leadership']
  }
];

// Mock Presence Data
export const mockPresence: PresenceData = {
  onlineUsers: [
    {
      id: 'user-1',
      name: 'Alex Chen',
      avatar: '👨‍💼',
      currentTask: 'Sprint Planning',
      zone: 'act',
      lastActive: new Date(Date.now() - 5 * 60 * 1000)
    },
    {
      id: 'user-2',
      name: 'Sarah Rodriguez',
      avatar: '👩‍💻',
      currentTask: 'Performance Review',
      zone: 'monitor',
      lastActive: new Date(Date.now() - 2 * 60 * 1000)
    },
    {
      id: 'user-3',
      name: 'Marcus Johnson',
      avatar: '👨‍🎨',
      currentTask: 'Strategy Session',
      zone: 'think',
      lastActive: new Date(Date.now() - 1 * 60 * 1000)
    },
    {
      id: 'user-4',
      name: 'Lisa Wang',
      avatar: '👩‍🔬',
      currentTask: 'Innovation Workshop',
      zone: 'innovate',
      lastActive: new Date()
    }
  ],
  activeSessions: 4,
  pairWorkSessions: 1
};

// Complete Mock Data
export const mockMissionControlData: MissionControlData = {
  globalHealth: mockGlobalHealth,
  kpis: mockKPIs,
  alerts: mockAlerts,
  predictions: mockPredictions,
  timeline: mockTimeline,
  resources: mockResources,
  digitalTwins: mockDigitalTwins,
  goalTree: mockGoalTree,
  presence: mockPresence,
  systemStatus: {
    online: true,
    latency: 45,
    uptime: 99.7,
    lastSync: new Date(Date.now() - 30 * 1000)
  }
};