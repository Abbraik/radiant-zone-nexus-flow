// Mock data for Teams chat, goals, and collaboration

export interface TeamsMessage {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  content: string;
  timestamp: Date;
  mentions?: string[];
  reactions?: { emoji: string; users: string[] }[];
  threadId?: string;
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  status: 'on-track' | 'at-risk' | 'off-track';
  progress: number;
  okrs: OKR[];
  parentId?: string;
  children?: Goal[];
}

export interface OKR {
  id: string;
  goalId: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  status: 'on-track' | 'at-risk' | 'off-track';
  tasks: TaskReference[];
  dueDate: Date;
}

export interface TaskReference {
  id: string;
  title: string;
  status: 'available' | 'claimed' | 'in-progress' | 'completed';
  assignee?: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
}

export interface CollabUser {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  cursor?: { x: number; y: number; widget?: string };
}

// Mock Teams Messages
export const mockTeamsMessages: TeamsMessage[] = [
  {
    id: '1',
    userId: 'user-1',
    userName: 'Sarah Chen',
    content: 'Just updated the SRT parameters for Loop A. The tension seems to be stabilizing around 0.65.',
    timestamp: new Date(Date.now() - 15 * 60 * 1000),
    reactions: [{ emoji: '👍', users: ['Marcus Rodriguez', 'Alex Kim'] }]
  },
  {
    id: '2',
    userId: 'user-2',
    userName: 'Marcus Rodriguez',
    content: '@Sarah Chen Great work! The new parameters are showing positive impact on the TRI scores. Should we proceed with Bundle B publication?',
    timestamp: new Date(Date.now() - 10 * 60 * 1000),
    mentions: ['Sarah Chen']
  },
  {
    id: '3',
    userId: 'user-3',
    userName: 'Alex Kim',
    content: 'I\'ve reviewed the intervention proposals. The smart roles allocation looks optimal. Ready to publish when you are.',
    timestamp: new Date(Date.now() - 5 * 60 * 1000)
  },
  {
    id: '4',
    userId: 'user-1',
    userName: 'Sarah Chen',
    content: 'Perfect! Let\'s schedule the publication for 2 PM today. I\'ll coordinate with the stakeholders.',
    timestamp: new Date(Date.now() - 2 * 60 * 1000)
  }
];

// Mock Goals Hierarchy
export const mockGoals: Goal[] = [
  {
    id: 'G1',
    title: 'Stabilize Global Fertility Rate',
    description: 'Achieve sustainable population growth through optimized loop management',
    status: 'on-track',
    progress: 72,
    okrs: [
      {
        id: 'KR1',
        goalId: 'G1',
        title: 'Loop A TFR within DE-Band',
        description: 'Maintain Total Fertility Rate between 2.0-2.2',
        target: 100,
        current: 85,
        unit: '%',
        status: 'on-track',
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        tasks: [
          { id: 'T1', title: 'Define tension for Loop A', status: 'completed', priority: 'high' },
          { id: 'T2', title: 'Set SRT horizon parameters', status: 'completed', priority: 'medium' },
          { id: 'T3', title: 'Publish intervention bundle', status: 'in-progress', assignee: 'Sarah Chen', priority: 'high' },
          { id: 'T4', title: 'Review TRI scores', status: 'available', priority: 'medium' }
        ]
      },
      {
        id: 'KR2',
        goalId: 'G1',
        title: 'Regional Loop Synchronization',
        description: 'Achieve 95% sync across all regional loops',
        target: 95,
        current: 78,
        unit: '%',
        status: 'at-risk',
        dueDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        tasks: [
          { id: 'T5', title: 'Analyze cross-loop dependencies', status: 'available', priority: 'critical' },
          { id: 'T6', title: 'Implement sync protocols', status: 'available', priority: 'high' }
        ]
      }
    ]
  },
  {
    id: 'G2',
    title: 'Optimize Resource Allocation',
    description: 'Enhance efficiency through smart intervention scheduling',
    status: 'at-risk',
    progress: 45,
    okrs: [
      {
        id: 'KR3',
        goalId: 'G2',
        title: 'Reduce Intervention Overlap',
        description: 'Decrease redundant interventions by 40%',
        target: 40,
        current: 22,
        unit: '%',
        status: 'off-track',
        dueDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        tasks: [
          { id: 'T7', title: 'Map intervention dependencies', status: 'available', priority: 'high' },
          { id: 'T8', title: 'Optimize scheduling algorithm', status: 'available', priority: 'critical' }
        ]
      }
    ]
  }
];

// Mock Collaboration Users
export const mockCollabUsers: CollabUser[] = [
  {
    id: 'user-1',
    name: 'Sarah Chen',
    role: 'Lead Analyst',
    status: 'online',
    cursor: { x: 320, y: 180, widget: 'SRTRangeSlider' }
  },
  {
    id: 'user-2',
    name: 'Marcus Rodriguez',
    role: 'Champion',
    status: 'online',
    cursor: { x: 580, y: 240, widget: 'BundlePreview' }
  },
  {
    id: 'user-3',
    name: 'Alex Kim',
    role: 'Reviewer',
    status: 'away'
  },
  {
    id: 'user-4',
    name: 'Jordan Smith',
    role: 'Stakeholder',
    status: 'busy'
  }
];

// Mock Workflow Templates
export const workflowTemplates = {
  sprintCycle: [
    'define_tension',
    'set_srt_horizon', 
    'choose_leverage',
    'publish_bundle',
    'review_tri'
  ],
  goalReview: [
    'analyze_metrics',
    'update_okr_progress',
    'identify_blockers',
    'plan_interventions'
  ]
};

// Mock Notifications
export const mockNotifications = [
  {
    id: 'n1',
    type: 'teams-mention',
    title: 'Mentioned in Teams',
    message: 'Marcus mentioned you in "Loop A Discussion"',
    timestamp: new Date(Date.now() - 5 * 60 * 1000),
    actionUrl: '/teams/thread/123'
  },
  {
    id: 'n2', 
    type: 'cascade-alert',
    title: 'OKR At Risk',
    message: 'Regional Loop Synchronization is falling behind target',
    timestamp: new Date(Date.now() - 20 * 60 * 1000),
    priority: 'high'
  },
  {
    id: 'n3',
    type: 'task-assigned',
    title: 'New Task Available',
    message: 'Analyze cross-loop dependencies is ready to claim',
    timestamp: new Date(Date.now() - 35 * 60 * 1000)
  }
];

// Simplified exports for cascade sidebar
export const goals = [
  {
    id: 'goal1',
    title: 'Stabilize Global Fertility Rate',
    description: 'Achieve sustainable population growth through targeted interventions',
    status: 'in_progress' as const,
    progress: 72,
    owner: 'Sarah Chen',
    timeline: '2024-2025'
  },
  {
    id: 'goal2', 
    title: 'Optimize Resource Distribution',
    description: 'Enhance efficiency of critical resource allocation systems',
    status: 'in_progress' as const,
    progress: 45,
    owner: 'Mike Rodriguez',
    timeline: '2024-2025'
  }
];

export const okrs = [
  {
    id: 'okr1',
    goalId: 'goal1',
    title: 'Loop A TFR within DE-Band',
    description: 'Maintain Total Fertility Rate between 2.0-2.2',
    target: 100,
    current: 85,
    progress: 85
  },
  {
    id: 'okr2',
    goalId: 'goal1',
    title: 'Regional Loop Synchronization',
    description: 'Achieve 95% sync across all regional loops',
    target: 95,
    current: 78,
    progress: 82
  },
  {
    id: 'okr3',
    goalId: 'goal2',
    title: 'Reduce Intervention Overlap',
    description: 'Decrease redundant interventions by 40%',
    target: 40,
    current: 22,
    progress: 55
  }
];

export const cascadeTasks = [
  {
    id: 'task1',
    title: 'Define tension for Loop A',
    description: 'Set up tension parameters for the current sprint cycle focusing on fertility rate optimization',
    status: 'available',
    zone: 'think',
    type: 'define_tension',
    okrId: 'okr1',
    difficulty: 'medium',
    assignee: null,
    dueDate: '2024-07-30',
    requiredSkills: ['Systems Thinking', 'Data Analysis'],
    prerequisites: ['Loop A initialization complete', 'Baseline metrics established'],
    impact: 'Establishes foundation for effective intervention targeting'
  },
  {
    id: 'task2',
    title: 'Set SRT horizon parameters',
    description: 'Configure strategic response timeframe for Loop A interventions',
    status: 'blocked',
    zone: 'think',
    type: 'set_srt_horizon',
    okrId: 'okr1',
    difficulty: 'low',
    assignee: null,
    dueDate: '2024-08-02',
    requiredSkills: ['Strategic Planning'],
    prerequisites: ['Tension definition complete'],
    impact: 'Optimizes intervention timing and resource allocation'
  },
  {
    id: 'task3',
    title: 'Choose leverage intervention',
    description: 'Select optimal intervention strategy based on current system state',
    status: 'blocked',
    zone: 'act',
    type: 'choose_leverage',
    okrId: 'okr1',
    difficulty: 'high',
    assignee: null,
    dueDate: '2024-08-05',
    requiredSkills: ['Decision Analysis', 'Systems Engineering'],
    prerequisites: ['SRT horizon parameters set', 'Intervention options analyzed'],
    impact: 'Ensures maximum effectiveness of resource deployment'
  },
  {
    id: 'task4',
    title: 'Review TRI scoring',
    description: 'Analyze and validate Tension-Response-Impact metrics for Loop C',
    status: 'in_progress',
    zone: 'monitor',
    type: 'review_tri',
    okrId: 'okr2',
    difficulty: 'medium',
    assignee: 'Alex Kim',
    dueDate: '2024-07-28',
    requiredSkills: ['Data Analysis', 'Quality Assurance'],
    prerequisites: ['TRI data collection complete'],
    impact: 'Validates intervention effectiveness and guides future decisions'
  },
  {
    id: 'task5',
    title: 'Publish intervention bundle',
    description: 'Deploy validated intervention package to production systems',
    status: 'available',
    zone: 'act',
    type: 'publish_bundle',
    okrId: 'okr2',
    difficulty: 'low',
    assignee: null,
    dueDate: '2024-08-01',
    requiredSkills: ['System Administration', 'Change Management'],
    prerequisites: ['TRI review approved', 'Stakeholder sign-off received'],
    impact: 'Implements proven interventions at scale across target regions'
  }
];