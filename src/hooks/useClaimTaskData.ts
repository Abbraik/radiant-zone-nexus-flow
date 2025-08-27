import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export type ClaimTaskData = {
  task: {
    task_id: string;
    title: string;
    capacity: 'responsive' | 'reflexive' | 'deliberative' | 'anticipatory' | 'structural';
    priority: number;
    status: 'available' | 'claimed' | 'in_progress' | 'review_due' | 'completed' | 'cancelled';
    open_route: string;
    due_at: string | null;
    review_at: string | null;
    payload: any;
  };
  loop: { id: string; name: string; loop_code: string };
  template?: { template_title: string; default_sla_hours: number; default_payload?: any };
  checklist: Array<{ id: string; label: string; required: boolean; done: boolean; order_index: number }>;
  artifacts: Array<{ id: string; title: string; url: string | null; kind: string }>;
  guardrails?: {
    name: string;
    timebox_hours: number | null;
    daily_delta_limit: number | null;
    coverage_limit_pct: number | null;
    concurrent_substeps_limit: number | null;
    renewal_limit: number;
    evaluation_required_after_renewals: number;  
  };
  owner?: { user_id: string } | null;
  tri?: { T: number; R: number; I: number } | null;
  signal?: {
    indicator: string | null;
    status: 'below' | 'in_band' | 'above' | null;
    severity: number | null;
    value: number | null;
    ts: string | null;
    band?: { lower: number | null; upper: number | null };
  };
  source?: { label: string; fired_at?: string | null };
};

export const useClaimTaskData = (taskId: string) => {
  return useQuery({
    queryKey: ['claim-task-data', taskId],
    queryFn: async (): Promise<ClaimTaskData> => {
      // For now, return mock data that matches the expected structure
      // In production, this would be a single comprehensive query to fetch all related data
      
      // Mock task data based on the taskId from console logs
      const mockTask: ClaimTaskData = {
        task: {
          task_id: taskId,
          title: "Childcare Wait Time Surge",
          capacity: "responsive",
          priority: 2,
          status: "available",
          open_route: "/playbooks/responsive-childcare",
          due_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          review_at: null,
          payload: {
            description: "Monitor and respond to increasing childcare wait times affecting fertility decisions",
            urgency: "medium",
            scenario: "golden",
            estimated_hours: 4,
            scenario_id: "fertility",
            loop_code: "FER-L01",
            capacity: "responsive",
            indicators: {
              childcare_wait_days: 29.94307346395721,
              fertility_intention_gap: 0.6172483570048783,
              capacity_utilization: 0.9833356836158554
            },
            context: {
              alert_level: "medium",
              trending: "increasing"
            },
            primary_indicator: "childcare_wait_days",
            expected_outputs: ["situation_report", "intervention_recommendation"]
          }
        },
        loop: {
          id: "029968e3-9650-4b2a-acab-0c371a0bae8d",
          name: "Fertility Support Loop",
          loop_code: "FER-L01"
        },
        template: {
          template_title: "Responsive Capacity Template",
          default_sla_hours: 24,
          default_payload: {
            capacity: "responsive",
            estimated_duration: 4
          }
        },
        checklist: [
          {
            id: "check-1",
            label: "Review current childcare capacity metrics",
            required: true,
            done: false,
            order_index: 1
          },
          {
            id: "check-2", 
            label: "Analyze wait time trends and patterns",
            required: true,
            done: false,
            order_index: 2
          },
          {
            id: "check-3",
            label: "Assess impact on fertility intentions",
            required: true,
            done: false,
            order_index: 3
          },
          {
            id: "check-4",
            label: "Prepare intervention recommendations",
            required: false,
            done: false,
            order_index: 4
          },
          {
            id: "check-5",
            label: "Submit situation report",
            required: true,
            done: false,
            order_index: 5
          }
        ],
        artifacts: [
          {
            id: "artifact-1",
            title: "Childcare Capacity Dashboard",
            url: "https://dashboard.childcare.gov/capacity",
            kind: "dashboard"
          },
          {
            id: "artifact-2",
            title: "Fertility Trends Report Q4",
            url: null,
            kind: "report"
          }
        ],
        guardrails: {
          name: "Standard Responsive Guardrails",
          timebox_hours: 8,
          daily_delta_limit: 0.1,
          coverage_limit_pct: 75,
          concurrent_substeps_limit: 3,
          renewal_limit: 2,
          evaluation_required_after_renewals: 1
        },
        owner: null, // Task is available
        tri: {
          T: 0.700569265360428,
          R: 0.9,
          I: 0.7
        },
        signal: {
          indicator: "childcare_wait_days",
          status: "above",
          severity: 0.85,
          value: 29.94307346395721,
          ts: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          band: {
            lower: 15,
            upper: 25
          }
        },
        source: {
          label: "Golden Scenario Generator - Fertility Domain",
          fired_at: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString() // 3 hours ago
        }
      };

      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 300));
      
      return mockTask;
    },
    enabled: !!taskId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};