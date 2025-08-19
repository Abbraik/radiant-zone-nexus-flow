// Mock data for Workspace 5C development
import type { EnhancedTask5C, Claim5C, TRIEvent5C } from '@/5c/types';

export const mockTasks5C: EnhancedTask5C[] = [
  {
    id: 'task-resp-001',
    capacity: 'responsive',
    loop_id: 'loop-001',
    type: 'reactive',
    scale: 'micro',
    leverage: 'N',
    title: 'Alert Triage & Response',
    description: 'Handle incoming system alerts and coordinate immediate response',
    status: 'active',
    tri: { t_value: 0.8, r_value: 0.6, i_value: 0.7 },
    payload: {
      alert_count: 3,
      priority: 'high',
      last_checkpoint: '2024-01-15T10:30:00Z'
    },
    user_id: 'user-001',
    created_at: '2024-01-15T09:00:00Z',
    updated_at: '2024-01-15T10:30:00Z'
  },
  {
    id: 'task-reflex-001',
    capacity: 'reflexive',
    loop_id: 'loop-002',
    type: 'structural',
    scale: 'meso',
    leverage: 'P',
    title: 'Band Optimization Analysis',
    description: 'Analyze DE band performance and suggest retuning strategies',
    status: 'claimed',
    tri: { t_value: 0.5, r_value: 0.9, i_value: 0.4 },
    payload: {
      band_crossings: 7,
      optimization_score: 0.82,
      suggested_adjustments: ['lower_bound', 'asymmetry']
    },
    user_id: 'user-001',
    created_at: '2024-01-15T08:00:00Z',
    updated_at: '2024-01-15T10:15:00Z'
  },
  {
    id: 'task-delib-001',
    capacity: 'deliberative',
    loop_id: 'loop-003',
    type: 'perceptual',
    scale: 'macro',
    leverage: 'S',
    title: 'Strategic Option Evaluation',
    description: 'Multi-criteria analysis of intervention options',
    status: 'open',
    tri: { t_value: 0.3, r_value: 0.7, i_value: 0.9 },
    payload: {
      option_count: 5,
      mcda_complete: false,
      decision_pending: true
    },
    user_id: 'user-001',
    created_at: '2024-01-15T07:00:00Z',
    updated_at: '2024-01-15T09:45:00Z'
  },
  {
    id: 'task-antic-001',
    capacity: 'anticipatory',
    loop_id: 'loop-004',
    type: 'reactive',
    scale: 'micro',
    leverage: 'N',
    title: 'Scenario Planning Session',
    description: 'Develop contingency playbooks for identified risk scenarios',
    status: 'done',
    tri: { t_value: 0.9, r_value: 0.8, i_value: 0.6 },
    payload: {
      scenarios_developed: 3,
      playbooks_created: 2,
      stress_tests_queued: 1
    },
    user_id: 'user-001',
    created_at: '2024-01-14T14:00:00Z',
    updated_at: '2024-01-15T11:00:00Z'
  },
  {
    id: 'task-struct-001',
    capacity: 'structural',
    loop_id: 'loop-005',
    type: 'structural',
    scale: 'macro',
    leverage: 'S',
    title: 'System Architecture Review',
    description: 'Evaluate loop interconnections and leverage point effectiveness',
    status: 'blocked',
    tri: { t_value: 0.2, r_value: 0.4, i_value: 0.8 },
    payload: {
      architecture_mapping: 'in_progress',
      dependency_analysis: 'pending',
      leverage_assessment: 'blocked'
    },
    user_id: 'user-001',
    created_at: '2024-01-15T06:00:00Z',
    updated_at: '2024-01-15T10:00:00Z'
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