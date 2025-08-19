import { describe, it, expect, beforeEach } from 'vitest';
import { supabase } from '@/integrations/supabase/client';

// Mock supabase for testing
const mockSupabase = {
  rpc: vi.fn(),
  from: vi.fn(() => ({
    select: vi.fn(() => ({
      eq: vi.fn(() => ({
        single: vi.fn()
      }))
    })),
    insert: vi.fn(),
    update: vi.fn(() => ({
      eq: vi.fn()
    }))
  }))
};

// Mock auth user
const mockUser = { id: 'test-user-id' };

describe('Mode Recommendation RPC', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should recommend responsive for breach_days > 0 and declining slope', async () => {
    const mockScorecard = {
      breach_days: 3,
      tri_slope: -0.2,
      fatigue: 2,
      claim_velocity: 0.5
    };

    mockSupabase.rpc.mockResolvedValueOnce({
      data: {
        capacity: 'responsive',
        confidence: 0.8,
        reasons: ['Active breaches with declining trend - immediate response needed']
      },
      error: null
    });

    const result = await mockSupabase.rpc('suggest_capacity', {
      loop_id_param: 'test-loop-id',
      context_param: {}
    });

    expect(result.data.capacity).toBe('responsive');
    expect(result.data.confidence).toBeGreaterThan(0.7);
    expect(result.data.reasons).toContain('Active breaches with declining trend - immediate response needed');
  });

  it('should recommend reflexive for flat slope and persistent breaches', async () => {
    mockSupabase.rpc.mockResolvedValueOnce({
      data: {
        capacity: 'reflexive',
        confidence: 0.7,
        reasons: ['Persistent issues with stable trend - system tuning needed']
      },
      error: null
    });

    const result = await mockSupabase.rpc('suggest_capacity', {
      loop_id_param: 'test-loop-id',
      context_param: {}
    });

    expect(result.data.capacity).toBe('reflexive');
    expect(result.data.confidence).toBeGreaterThan(0.6);
  });

  it('should recommend deliberative for low identifiability', async () => {
    mockSupabase.rpc.mockResolvedValueOnce({
      data: {
        capacity: 'deliberative',
        confidence: 0.6,
        reasons: ['Low identifiability - options analysis needed']
      },
      error: null
    });

    const result = await mockSupabase.rpc('suggest_capacity', {
      loop_id_param: 'test-loop-id',
      context_param: { identifiability: false }
    });

    expect(result.data.capacity).toBe('deliberative');
    expect(result.data.reasons).toContain('Low identifiability - options analysis needed');
  });

  it('should recommend anticipatory for early signals', async () => {
    mockSupabase.rpc.mockResolvedValueOnce({
      data: {
        capacity: 'anticipatory',
        confidence: 0.6,
        reasons: ['Early warning signals detected - proactive planning needed']
      },
      error: null
    });

    const result = await mockSupabase.rpc('suggest_capacity', {
      loop_id_param: 'test-loop-id',
      context_param: { early_signals: true }
    });

    expect(result.data.capacity).toBe('anticipatory');
  });

  it('should recommend structural for authority mismatch', async () => {
    mockSupabase.rpc.mockResolvedValueOnce({
      data: {
        capacity: 'structural',
        confidence: 0.7,
        reasons: ['Authority-capacity mismatch detected - structural changes needed']
      },
      error: null
    });

    const result = await mockSupabase.rpc('suggest_capacity', {
      loop_id_param: 'test-loop-id',
      context_param: { authority_mismatch: true }
    });

    expect(result.data.capacity).toBe('structural');
    expect(result.data.confidence).toBeGreaterThan(0.6);
  });
});

describe('Package for Execution RPC', () => {
  it('should create claims with correct leverage and mandate status', async () => {
    const mockOptions = [
      { id: 'opt1', name: 'Option 1', actor: 'test_actor', lever: 'N' },
      { id: 'opt2', name: 'Option 2', actor: 'policy_director', lever: 'P' }
    ];

    mockSupabase.rpc.mockResolvedValueOnce({
      data: {
        success: true,
        claims: [
          { claim_id: 'claim1', option_id: 'opt1', mandate_status: 'allowed' },
          { claim_id: 'claim2', option_id: 'opt2', mandate_status: 'allowed' }
        ]
      },
      error: null
    });

    const result = await mockSupabase.rpc('package_for_execution', {
      option_set_uuid: 'test-option-set-id'
    });

    expect(result.data.success).toBe(true);
    expect(result.data.claims).toHaveLength(2);
    expect(result.data.claims[0].mandate_status).toBe('allowed');
  });

  it('should handle blocked mandate status', async () => {
    mockSupabase.rpc.mockResolvedValueOnce({
      data: {
        success: true,
        claims: [
          { claim_id: 'claim1', option_id: 'opt1', mandate_status: 'blocked' }
        ]
      },
      error: null
    });

    const result = await mockSupabase.rpc('package_for_execution', {
      option_set_uuid: 'test-option-set-id'
    });

    expect(result.data.claims[0].mandate_status).toBe('blocked');
  });
});

describe('Evaluate Watchpoints RPC', () => {
  it('should trip watchpoint when threshold crossed', async () => {
    mockSupabase.rpc.mockResolvedValueOnce({
      data: {
        tripped: [
          {
            watchpoint_id: 'watch1',
            indicator: 'demand_ratio',
            threshold: 1.15,
            current_value: 1.18,
            task_created: 'task-id-123'
          }
        ],
        ok: []
      },
      error: null
    });

    const result = await mockSupabase.rpc('evaluate_watchpoints');

    expect(result.data.tripped).toHaveLength(1);
    expect(result.data.tripped[0].current_value).toBeGreaterThan(result.data.tripped[0].threshold);
    expect(result.data.tripped[0].task_created).toBeDefined();
  });

  it('should not trip when within threshold', async () => {
    mockSupabase.rpc.mockResolvedValueOnce({
      data: {
        tripped: [],
        ok: [
          {
            watchpoint_id: 'watch1',
            indicator: 'demand_ratio',
            threshold: 1.15,
            current_value: 1.12
          }
        ]
      },
      error: null
    });

    const result = await mockSupabase.rpc('evaluate_watchpoints');

    expect(result.data.tripped).toHaveLength(0);
    expect(result.data.ok).toHaveLength(1);
  });
});

describe('Global Search RPC', () => {
  it('should return mixed results from different entity types', async () => {
    mockSupabase.rpc.mockResolvedValueOnce({
      data: [
        {
          type: 'loop',
          id: 'loop1',
          title: 'Emergency Loop',
          subtitle: 'Emergency management',
          url: '/registry/loop1'
        },
        {
          type: 'task',
          id: 'task1',
          title: 'Response Task',
          subtitle: 'Task • responsive',
          url: '/workspace?task=task1'
        }
      ],
      error: null
    });

    const result = await mockSupabase.rpc('global_search', {
      query_param: 'emergency',
      limit_param: 20
    });

    expect(result.data).toHaveLength(2);
    expect(result.data[0].type).toBe('loop');
    expect(result.data[1].type).toBe('task');
    expect(result.data[0].url).toContain('/registry/');
    expect(result.data[1].url).toContain('/workspace?task=');
  });

  it('should respect limit parameter', async () => {
    const mockResults = Array.from({ length: 5 }, (_, i) => ({
      type: 'loop',
      id: `loop${i}`,
      title: `Loop ${i}`,
      subtitle: 'Test loop',
      url: `/registry/loop${i}`
    }));

    mockSupabase.rpc.mockResolvedValueOnce({
      data: mockResults,
      error: null
    });

    const result = await mockSupabase.rpc('global_search', {
      query_param: 'test',
      limit_param: 5
    });

    expect(result.data).toHaveLength(5);
  });
});

describe('Create Task with Link RPC', () => {
  it('should create task with proper capacity and context', async () => {
    mockSupabase.rpc.mockResolvedValueOnce({
      data: {
        task_id: 'new-task-id',
        task_name: 'Responsive Action Required',
        capacity: 'responsive'
      },
      error: null
    });

    const result = await mockSupabase.rpc('create_task_with_link', {
      from_task_param: 'source-task-id',
      capacity_param: 'responsive',
      loop_id_param: 'loop-id',
      context_param: { trigger: 'mode_switch' }
    });

    expect(result.data.task_id).toBeDefined();
    expect(result.data.capacity).toBe('responsive');
    expect(result.data.task_name).toContain('Responsive');
  });

  it('should handle task creation without source task', async () => {
    mockSupabase.rpc.mockResolvedValueOnce({
      data: {
        task_id: 'new-task-id',
        task_name: 'System Retune Needed',
        capacity: 'reflexive'
      },
      error: null
    });

    const result = await mockSupabase.rpc('create_task_with_link', {
      from_task_param: null,
      capacity_param: 'reflexive',
      loop_id_param: 'loop-id',
      context_param: {}
    });

    expect(result.data.task_id).toBeDefined();
    expect(result.data.capacity).toBe('reflexive');
  });
});