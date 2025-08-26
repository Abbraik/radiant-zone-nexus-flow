// Golden Scenario Payload Generator
import type { 
  GoldenScenarioPayload, 
  FertilityChildcarePayload, 
  EducatorPipelinePayload, 
  LabourMatchingPayload, 
  SocialCohesionPayload 
} from '@/types/golden-scenario-payloads';

// Generate realistic data based on time progression and scenario dynamics
export class GoldenScenarioGenerator {
  private static getTimeBasedVariation(baseValue: number, amplitude: number, period: number): number {
    const now = Date.now();
    const variation = Math.sin((now / (1000 * 60 * 60 * 24)) / period) * amplitude;
    return Math.max(0, baseValue + variation + (Math.random() - 0.5) * amplitude * 0.3);
  }

  static generateFertilityChildcarePayload(): FertilityChildcarePayload {
    const waitTimeDays = this.getTimeBasedVariation(25, 8, 14);
    const capacityUtil = this.getTimeBasedVariation(0.85, 0.15, 7);

    return {
      scenario_id: 'fertility',
      loop_code: 'FER-L01',
      capacity: 'responsive',
      last_updated: new Date().toISOString(),
      indicators: {
        childcare_wait_days: waitTimeDays,
        fertility_intention_gap: this.getTimeBasedVariation(0.8, 0.2, 30),
        capacity_utilization: capacityUtil
      },
      context: {
        alert_level: waitTimeDays > 30 ? 'high' : waitTimeDays > 20 ? 'medium' : 'low',
        trending: waitTimeDays - 25 > 0 ? 'increasing' : 'decreasing'
      },
      childcare: {
        wait_time_days: waitTimeDays,
        capacity_utilization: capacityUtil,
        waiting_list_count: Math.floor(this.getTimeBasedVariation(150, 50, 21)),
        facilities: [
          {
            id: 'cc-001',
            name: 'Sunshine Early Learning Center',
            capacity: 120,
            current_occupancy: Math.floor(120 * capacityUtil),
            wait_time_days: Math.floor(waitTimeDays * 0.8),
            location: 'Downtown'
          },
          {
            id: 'cc-002', 
            name: 'Little Explorers Daycare',
            capacity: 80,
            current_occupancy: Math.floor(80 * this.getTimeBasedVariation(0.9, 0.1, 5)),
            wait_time_days: Math.floor(waitTimeDays * 1.2),
            location: 'Westside'
          },
          {
            id: 'cc-003',
            name: 'Community Care Co-op',
            capacity: 60,
            current_occupancy: Math.floor(60 * this.getTimeBasedVariation(0.75, 0.2, 10)),
            wait_time_days: Math.floor(waitTimeDays * 0.9),
            location: 'Eastside'
          }
        ]
      },
      fertility: {
        current_rate: this.getTimeBasedVariation(1.65, 0.1, 365),
        target_rate: 2.1,
        intention_gap: this.getTimeBasedVariation(0.8, 0.15, 90),
        support_programs: [
          {
            program_id: 'sp-001',
            name: 'Family Support Initiative',
            enrollment: Math.floor(this.getTimeBasedVariation(450, 100, 30)),
            effectiveness_score: this.getTimeBasedVariation(0.72, 0.1, 60)
          },
          {
            program_id: 'sp-002',
            name: 'Childcare Subsidy Program',
            enrollment: Math.floor(this.getTimeBasedVariation(320, 80, 45)),
            effectiveness_score: this.getTimeBasedVariation(0.68, 0.12, 40)
          }
        ]
      },
      incidents: waitTimeDays > 25 ? [{
        id: 'inc-' + Date.now(),
        type: 'wait_time_breach',
        severity: waitTimeDays > 35 ? 'high' : 'medium',
        status: 'open',
        created_at: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
        affected_count: Math.floor(this.getTimeBasedVariation(45, 20, 3))
      }] : [],
      recommendations: [
        {
          id: 'rec-001',
          title: 'Expand Evening Care Hours',
          description: 'Extend operating hours to reduce demand pressure during peak times',
          priority: waitTimeDays > 30 ? 'high' : 'medium',
          estimated_impact: '15-20% reduction in wait times',
          resource_requirements: '2 additional staff per facility'
        },
        {
          id: 'rec-002',
          title: 'Mobile Childcare Units',
          description: 'Deploy temporary childcare services in high-demand areas',
          priority: 'medium',
          estimated_impact: '10-15% capacity increase',
          resource_requirements: 'Vehicle, 3 qualified staff, equipment'
        }
      ]
    };
  }

  static generateEducatorPipelinePayload(): EducatorPipelinePayload {
    const processingDays = this.getTimeBasedVariation(45, 15, 21);
    
    return {
      scenario_id: 'educator-pipeline',
      loop_code: 'FER-L02',
      capacity: 'deliberative',
      last_updated: new Date().toISOString(),
      indicators: {
        credential_processing_days: processingDays,
        certification_backlog: Math.floor(this.getTimeBasedVariation(28, 12, 14)),
        qualification_completion_rate: this.getTimeBasedVariation(0.78, 0.1, 30)
      },
      context: {
        processing_efficiency: processingDays < 40 ? 'good' : processingDays < 50 ? 'fair' : 'poor',
        seasonal_factor: 'pre_semester_rush'
      },
      pipeline: {
        credential_processing_days: processingDays,
        certification_backlog: Math.floor(this.getTimeBasedVariation(28, 12, 14)),
        qualification_completion_rate: this.getTimeBasedVariation(0.78, 0.1, 30)
      },
      workforce: {
        active_educators: Math.floor(this.getTimeBasedVariation(1240, 80, 180)),
        pending_certifications: Math.floor(processingDays * 0.8),
        vacancy_rate: this.getTimeBasedVariation(0.12, 0.05, 90),
        training_programs: [
          {
            program_id: 'tp-001',
            name: 'Early Childhood Education Certificate',
            participants: Math.floor(this.getTimeBasedVariation(85, 25, 60)),
            completion_rate: this.getTimeBasedVariation(0.82, 0.08, 45),
            placement_rate: this.getTimeBasedVariation(0.74, 0.1, 30)
          },
          {
            program_id: 'tp-002',
            name: 'Advanced Pedagogy Workshop',
            participants: Math.floor(this.getTimeBasedVariation(45, 15, 30)),
            completion_rate: this.getTimeBasedVariation(0.89, 0.05, 20),
            placement_rate: this.getTimeBasedVariation(0.91, 0.06, 25)
          }
        ]
      },
      quality_indicators: {
        student_outcomes: this.getTimeBasedVariation(0.76, 0.08, 120),
        satisfaction_score: this.getTimeBasedVariation(0.83, 0.1, 60),
        retention_rate: this.getTimeBasedVariation(0.88, 0.07, 90)
      }
    };
  }

  static generateLabourMatchingPayload(): LabourMatchingPayload {
    const fillTime = this.getTimeBasedVariation(35, 12, 28);
    
    return {
      scenario_id: 'labour-matching',
      loop_code: 'LAB-L01',
      capacity: 'anticipatory',
      last_updated: new Date().toISOString(),
      indicators: {
        vacancy_fill_time_days: fillTime,
        unemployment_rate: this.getTimeBasedVariation(0.078, 0.02, 90),
        skills_mismatch_index: this.getTimeBasedVariation(1.2, 0.3, 60)
      },
      context: {
        market_conditions: fillTime > 40 ? 'tight' : fillTime < 25 ? 'loose' : 'balanced',
        economic_cycle: 'growth_phase'
      },
      labour_market: {
        vacancy_fill_time_days: fillTime,
        unemployment_rate: this.getTimeBasedVariation(0.078, 0.02, 90),
        skills_mismatch_index: this.getTimeBasedVariation(1.2, 0.3, 60),
        job_postings: [
          {
            id: 'job-001',
            title: 'Early Childhood Educator',
            sector: 'Education',
            skill_level: 'Professional',
            duration_posted_days: Math.floor(this.getTimeBasedVariation(28, 15, 7)),
            applications_count: Math.floor(this.getTimeBasedVariation(12, 8, 5))
          },
          {
            id: 'job-002',
            title: 'Community Outreach Coordinator',
            sector: 'Social Services',
            skill_level: 'Professional',
            duration_posted_days: Math.floor(this.getTimeBasedVariation(22, 10, 4)),
            applications_count: Math.floor(this.getTimeBasedVariation(18, 12, 6))
          },
          {
            id: 'job-003',
            title: 'Family Support Worker',
            sector: 'Health & Social Care',
            skill_level: 'Skilled',
            duration_posted_days: Math.floor(this.getTimeBasedVariation(19, 8, 3)),
            applications_count: Math.floor(this.getTimeBasedVariation(25, 15, 8))
          }
        ]
      },
      skills_data: {
        in_demand_skills: [
          'Early Childhood Development',
          'Family Counseling',
          'Community Engagement',
          'Digital Literacy',
          'Crisis Intervention'
        ],
        skill_gaps: [
          {
            skill: 'Special Needs Care',
            gap_severity: this.getTimeBasedVariation(0.7, 0.2, 30),
            training_availability: true
          },
          {
            skill: 'Multilingual Communication',
            gap_severity: this.getTimeBasedVariation(0.6, 0.15, 45),
            training_availability: false
          }
        ],
        training_programs: [
          {
            program_id: 'train-001',
            name: 'Special Needs Certification',
            duration_weeks: 8,
            success_rate: this.getTimeBasedVariation(0.85, 0.1, 60),
            job_placement_rate: this.getTimeBasedVariation(0.78, 0.12, 40)
          }
        ]
      }
    };
  }

  static generateSocialCohesionPayload(): SocialCohesionPayload {
    const outageRate = this.getTimeBasedVariation(0.02, 0.01, 7);
    const trustIndex = this.getTimeBasedVariation(0.7, 0.2, 30);
    
    return {
      scenario_id: 'social-cohesion',
      loop_code: 'SOC-L01',
      capacity: 'structural',
      last_updated: new Date().toISOString(),
      indicators: {
        service_outage_rate: outageRate,
        community_trust_index: trustIndex,
        citizen_satisfaction: this.getTimeBasedVariation(0.72, 0.15, 45)
      },
      context: {
        service_health: outageRate < 0.015 ? 'excellent' : outageRate < 0.025 ? 'good' : 'concerning',
        trust_trend: trustIndex > 0.75 ? 'positive' : trustIndex < 0.6 ? 'negative' : 'stable'
      },
      service_reliability: {
        outage_rate: outageRate,
        avg_resolution_time_hours: this.getTimeBasedVariation(4.2, 2, 10),
        citizen_satisfaction: this.getTimeBasedVariation(0.72, 0.15, 45),
        service_incidents: outageRate > 0.02 ? [{
          id: 'si-' + Date.now(),
          service_type: 'Digital Services',
          affected_areas: ['Downtown', 'Westside'],
          duration_hours: this.getTimeBasedVariation(6, 4, 2),
          impact_severity: outageRate > 0.03 ? 'high' : 'medium',
          status: Math.random() > 0.3 ? 'resolved' : 'active'
        }] : []
      },
      community_trust: {
        trust_index: trustIndex,
        participation_rate: this.getTimeBasedVariation(0.34, 0.1, 60),
        community_feedback: [
          {
            id: 'fb-001',
            category: 'Service Quality',
            sentiment: trustIndex > 0.7 ? 'positive' : trustIndex < 0.6 ? 'negative' : 'neutral',
            priority: Math.floor(this.getTimeBasedVariation(3, 2, 5)),
            source: 'Community Survey',
            timestamp: new Date(Date.now() - Math.random() * 14 * 24 * 60 * 60 * 1000).toISOString()
          },
          {
            id: 'fb-002',
            category: 'Communication',
            sentiment: this.getTimeBasedVariation(0.65, 0.3, 20) > 0.6 ? 'positive' : 'neutral',
            priority: Math.floor(this.getTimeBasedVariation(2, 1, 3)),
            source: 'Online Portal',
            timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ]
      },
      engagement_metrics: {
        town_halls_attended: Math.floor(this.getTimeBasedVariation(125, 40, 30)),
        digital_participation: Math.floor(this.getTimeBasedVariation(890, 200, 14)),
        community_initiatives: Math.floor(this.getTimeBasedVariation(12, 5, 90))
      }
    };
  }

  static generatePayloadForScenario(scenarioId: string): GoldenScenarioPayload | null {
    switch (scenarioId) {
      case 'fertility':
        return this.generateFertilityChildcarePayload();
      case 'educator-pipeline':
        return this.generateEducatorPipelinePayload();
      case 'labour-matching':
        return this.generateLabourMatchingPayload();
      case 'social-cohesion':
        return this.generateSocialCohesionPayload();
      default:
        return null;
    }
  }
}