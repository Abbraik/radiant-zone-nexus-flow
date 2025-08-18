export interface LoopScorecard {
  loop_id: string;
  loop_name: string;
  loop_status: string;
  latest_tri: {
    t_value: number;
    r_value: number;
    i_value: number;
    at: string;
  };
  breach_count: number;
  last_breach_at: string | null;
  claim_velocity: number;
  fatigue_score: number;
  de_state: string;
  heartbeat_at: string | null;
  breach_days: number;
  tri_slope: number;
  sparkline: Array<{
    at: string;
    t_value: number;
    r_value: number;
    i_value: number;
  }>;
}

export interface TriggerAlert {
  id: string;
  type: 'breach' | 'fatigue' | 'slope' | 'override' | 'srt';
  severity: 'low' | 'medium' | 'high';
  message: string;
  loop_id: string;
  created_at: string;
}