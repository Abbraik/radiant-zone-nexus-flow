// Mock data for Workspace 5C development
import type { EnhancedTask5C, Claim5C, TRIEvent5C } from '@/5c/types';

export const mockTasks5C: EnhancedTask5C[] = [
  // Responsive Capacity Tasks (2 tasks)
  {
    id: '5c-task-responsive-1',
    capacity: 'responsive',
    loop_id: 'loop-responsive-001',
    type: 'reactive',
    scale: 'micro',
    leverage: 'N',
    tri: { t_value: 0.7, r_value: 0.8, i_value: 0.6 },
    de_band_id: 'de-band-001',
    srt_id: 'srt-001',
    assigned_to: 'user-123',
    status: 'open',
    title: 'Real-time System Monitoring',
    description: 'Set up responsive monitoring and quick reaction protocols for system health indicators',
    payload: {
      monitors: ['cpu', 'memory', 'network'],
      thresholds: { warning: 75, critical: 90 },
      responseTime: '< 30 seconds'
    },
    user_id: 'user-123',
    created_at: '2024-01-15T10:00:00Z',
    updated_at: '2024-01-15T14:30:00Z'
  },
  {
    id: '5c-task-responsive-2',
    capacity: 'responsive',
    loop_id: 'loop-responsive-002',
    type: 'reactive',
    scale: 'micro',
    leverage: 'P',
    tri: { t_value: 0.9, r_value: 0.7, i_value: 0.8 },
    status: 'open',
    title: 'Emergency Response Protocols',
    description: 'Implement rapid response procedures for critical system events',
    payload: {
      escalation: ['level1', 'level2', 'level3'],
      maxResponseTime: '15 seconds',
      automation: true
    },
    user_id: 'user-123',
    created_at: '2024-01-15T11:00:00Z',
    updated_at: '2024-01-15T15:30:00Z'
  },

  // Reflexive Capacity Tasks (2 tasks)
  {
    id: '5c-task-reflexive-1',
    capacity: 'reflexive',
    loop_id: 'loop-reflexive-001',
    type: 'structural',
    scale: 'meso',
    leverage: 'P',
    tri: { t_value: 0.6, r_value: 0.9, i_value: 0.7 },
    status: 'claimed',
    title: 'Band Optimization Analysis',
    description: 'Analyze DE band performance and suggest retuning strategies',
    payload: {
      incidentAnalysis: true,
      patternRecognition: ['frequency', 'severity', 'duration'],
      learningObjectives: ['root cause analysis', 'prevention strategies']
    },
    user_id: 'user-123',
    created_at: '2024-01-14T09:00:00Z',
    updated_at: '2024-01-14T16:45:00Z'
  },
  {
    id: '5c-task-reflexive-2',
    capacity: 'reflexive',
    loop_id: 'loop-reflexive-002',
    type: 'perceptual',
    scale: 'meso',
    leverage: 'S',
    tri: { t_value: 0.4, r_value: 0.8, i_value: 0.6 },
    status: 'open',
    title: 'Historical Pattern Analysis',
    description: 'Deep dive into past system behaviors to improve future responses',
    payload: {
      timeframe: '6 months',
      patterns: ['seasonal', 'cyclic', 'trend'],
      insights: 'pending'
    },
    user_id: 'user-123',
    created_at: '2024-01-14T08:00:00Z',
    updated_at: '2024-01-14T17:20:00Z'
  },

  // Deliberative Capacity Tasks (2 tasks)
  {
    id: '5c-task-deliberative-1',
    capacity: 'deliberative',
    loop_id: 'loop-deliberative-001',
    type: 'perceptual',
    scale: 'macro',
    leverage: 'S',
    tri: { t_value: 0.8, r_value: 0.6, i_value: 0.9 },
    status: 'open',
    title: 'Strategic Architecture Planning',
    description: 'Conduct comprehensive analysis and planning for next-generation system architecture',
    payload: {
      stakeholders: ['engineering', 'product', 'operations'],
      timeline: '6 months',
      criteria: ['scalability', 'maintainability', 'performance', 'cost'],
      decisionFramework: 'multi-criteria analysis'
    },
    user_id: 'user-123',
    created_at: '2024-01-13T08:00:00Z',
    updated_at: '2024-01-13T17:20:00Z'
  },
  {
    id: '5c-task-deliberative-2',
    capacity: 'deliberative',
    loop_id: 'loop-deliberative-002',
    type: 'structural',
    scale: 'macro',
    leverage: 'P',
    tri: { t_value: 0.5, r_value: 0.7, i_value: 0.8 },
    status: 'open',
    title: 'Multi-Criteria Decision Analysis',
    description: 'Evaluate complex intervention options using structured decision frameworks',
    payload: {
      options: 5,
      criteria: ['cost', 'impact', 'risk', 'timeline'],
      methodology: 'AHP',
      consensus: 'pending'
    },
    user_id: 'user-123',
    created_at: '2024-01-13T09:00:00Z',
    updated_at: '2024-01-13T18:30:00Z'
  },

  // Anticipatory Capacity Tasks (2 tasks)
  {
    id: '5c-task-anticipatory-1',
    capacity: 'anticipatory',
    loop_id: 'loop-anticipatory-001',
    type: 'reactive',
    scale: 'macro',
    leverage: 'P',
    tri: { t_value: 0.9, r_value: 0.7, i_value: 0.8 },
    status: 'open',
    title: 'Future Demand Forecasting',
    description: 'Build predictive models to anticipate system load and resource requirements',
    payload: {
      forecastHorizon: '12 months',
      models: ['trend analysis', 'seasonal patterns', 'growth projections'],
      scenarios: ['best case', 'worst case', 'most likely'],
      contingencyPlans: true
    },
    user_id: 'user-123',
    created_at: '2024-01-12T11:00:00Z',
    updated_at: '2024-01-12T15:30:00Z'
  },
  {
    id: '5c-task-anticipatory-2',
    capacity: 'anticipatory',
    loop_id: 'loop-anticipatory-002',
    type: 'perceptual',
    scale: 'meso',
    leverage: 'N',
    tri: { t_value: 0.7, r_value: 0.8, i_value: 0.6 },
    status: 'open',
    title: 'Scenario Planning & Stress Testing',
    description: 'Develop and test scenarios for potential future system states',
    payload: {
      scenarios: ['peak load', 'component failure', 'rapid growth'],
      stressTests: 3,
      contingencies: 'draft',
      playbooks: 'pending'
    },
    user_id: 'user-123',
    created_at: '2024-01-12T10:00:00Z',
    updated_at: '2024-01-12T16:45:00Z'
  },

  // Structural Capacity Tasks (2 tasks)
  {
    id: '5c-task-structural-1',
    capacity: 'structural',
    loop_id: 'loop-structural-001',
    type: 'structural',
    scale: 'meso',
    leverage: 'S',
    tri: { t_value: 0.5, r_value: 0.8, i_value: 0.9 },
    status: 'open',
    title: 'System Architecture Optimization',
    description: 'Redesign core system structures to improve efficiency and maintainability',
    payload: {
      components: ['database layer', 'api gateway', 'microservices'],
      principles: ['modularity', 'loose coupling', 'high cohesion'],
      patterns: ['event sourcing', 'CQRS', 'circuit breaker'],
      migrationStrategy: 'phased approach'
    },
    user_id: 'user-123',
    created_at: '2024-01-11T12:00:00Z',
    updated_at: '2024-01-11T18:15:00Z'
  },
  {
    id: '5c-task-structural-2',
    capacity: 'structural',
    loop_id: 'loop-structural-002',
    type: 'structural',
    scale: 'macro',
    leverage: 'S',
    tri: { t_value: 0.3, r_value: 0.9, i_value: 0.8 },
    status: 'open',
    title: 'Loop Interconnection Design',
    description: 'Design and implement connections between system loops for better coordination',
    payload: {
      loops: ['macro', 'meso', 'micro'],
      connections: 'hierarchical',
      feedback: 'bidirectional',
      governance: 'distributed'
    },
    user_id: 'user-123',
    created_at: '2024-01-11T13:00:00Z',
    updated_at: '2024-01-11T19:20:00Z'
  }
];

export const mockClaims5C: Claim5C[] = [
  {
    id: 'claim-001',
    task_id: 'task-resp-001',
    loop_id: 'loop-001',
    assignee: 'user-001',
    raci: {
      responsible: ['user-001'],
      accountable: ['user-manager'],
      consulted: ['user-expert'],
      informed: ['user-stakeholder']
    },
    leverage: 'N',
    mandate_status: 'allowed',
    evidence: {
      checkpoint_count: 3,
      last_update: '2024-01-15T10:30:00Z',
      attachment_ids: []
    },
    status: 'active',
    started_at: '2024-01-15T09:15:00Z',
    user_id: 'user-001',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  }
];

export const mockTRIEvents5C: TRIEvent5C[] = [
  {
    id: 'tri-001',
    loop_id: 'loop-001',
    task_id: 'task-resp-001',
    t_value: 0.8,
    r_value: 0.6,
    i_value: 0.7,
    tag: 'checkpoint',
    user_id: 'user-001',
    at: '2024-01-15T10:30:00Z',
    created_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'tri-002',
    loop_id: 'loop-002',
    task_id: 'task-reflex-001',
    t_value: 0.5,
    r_value: 0.9,
    i_value: 0.4,
    tag: 'retune',
    user_id: 'user-001',
    at: '2024-01-15T10:15:00Z',
    created_at: '2024-01-15T10:15:00Z'
  }
];