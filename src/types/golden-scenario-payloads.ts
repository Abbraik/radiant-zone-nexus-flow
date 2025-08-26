// Golden Scenario Payload Types
export interface BaseScenarioPayload {
  scenario_id: string;
  loop_code: string;
  capacity: string;
  last_updated: string;
  indicators: Record<string, any>;
  context: Record<string, any>;
}

export interface FertilityChildcarePayload extends BaseScenarioPayload {
  scenario_id: 'fertility';
  childcare: {
    wait_time_days: number;
    capacity_utilization: number;
    waiting_list_count: number;
    facilities: Array<{
      id: string;
      name: string;
      capacity: number;
      current_occupancy: number;
      wait_time_days: number;
      location: string;
    }>;
  };
  fertility: {
    current_rate: number;
    target_rate: number;
    intention_gap: number;
    support_programs: Array<{
      program_id: string;
      name: string;
      enrollment: number;
      effectiveness_score: number;
    }>;
  };
  incidents: Array<{
    id: string;
    type: 'wait_time_breach' | 'capacity_shortage' | 'service_disruption';
    severity: 'low' | 'medium' | 'high';
    status: 'open' | 'investigating' | 'resolved';
    created_at: string;
    location?: string;
    affected_count?: number;
  }>;
  recommendations: Array<{
    id: string;
    title: string;
    description: string;
    priority: 'low' | 'medium' | 'high';
    estimated_impact: string;
    resource_requirements: string;
  }>;
}

export interface EducatorPipelinePayload extends BaseScenarioPayload {
  scenario_id: 'educator-pipeline';
  pipeline: {
    credential_processing_days: number;
    certification_backlog: number;
    qualification_completion_rate: number;
  };
  workforce: {
    active_educators: number;
    pending_certifications: number;
    vacancy_rate: number;
    training_programs: Array<{
      program_id: string;
      name: string;
      participants: number;
      completion_rate: number;
      placement_rate: number;
    }>;
  };
  quality_indicators: {
    student_outcomes: number;
    satisfaction_score: number;
    retention_rate: number;
  };
}

export interface LabourMatchingPayload extends BaseScenarioPayload {
  scenario_id: 'labour-matching';
  labour_market: {
    vacancy_fill_time_days: number;
    unemployment_rate: number;
    skills_mismatch_index: number;
    job_postings: Array<{
      id: string;
      title: string;
      sector: string;
      skill_level: string;
      duration_posted_days: number;
      applications_count: number;
    }>;
  };
  skills_data: {
    in_demand_skills: string[];
    skill_gaps: Array<{
      skill: string;
      gap_severity: number;
      training_availability: boolean;
    }>;
    training_programs: Array<{
      program_id: string;
      name: string;
      duration_weeks: number;
      success_rate: number;
      job_placement_rate: number;
    }>;
  };
}

export interface SocialCohesionPayload extends BaseScenarioPayload {
  scenario_id: 'social-cohesion';
  service_reliability: {
    outage_rate: number;
    avg_resolution_time_hours: number;
    citizen_satisfaction: number;
    service_incidents: Array<{
      id: string;
      service_type: string;
      affected_areas: string[];
      duration_hours: number;
      impact_severity: 'low' | 'medium' | 'high';
      status: 'active' | 'resolved';
    }>;
  };
  community_trust: {
    trust_index: number;
    participation_rate: number;
    community_feedback: Array<{
      id: string;
      category: string;
      sentiment: 'positive' | 'neutral' | 'negative';
      priority: number;
      source: string;
      timestamp: string;
    }>;
  };
  engagement_metrics: {
    town_halls_attended: number;
    digital_participation: number;
    community_initiatives: number;
  };
}

export type GoldenScenarioPayload = 
  | FertilityChildcarePayload 
  | EducatorPipelinePayload 
  | LabourMatchingPayload 
  | SocialCohesionPayload;