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
  loop: { id: string; name: string; loop_code: string; description?: string | null };
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
      // Fetch task data from tasks_5c table
      const { data: task, error: taskError } = await supabase
        .from('tasks_5c')
        .select('*')
        .eq('id', taskId)
        .single();

      if (taskError) {
        throw new Error(`Failed to fetch task: ${taskError.message}`);
      }

      if (!task) {
        throw new Error('Task not found');
      }

      // Fetch loop data separately
      const { data: loop } = await supabase
        .from('loops')
        .select('id, name, description, metadata')
        .eq('id', task.loop_id)
        .single();

      // Parse payload as JSON object
      const payload = (typeof task.payload === 'string' ? JSON.parse(task.payload) : task.payload) || {};
      
      // Parse TRI as JSON object
      const tri = task.tri && typeof task.tri === 'object' ? task.tri as { T: number; R: number; I: number } : null;

      // Get loop code from metadata
      const loopMetadata = loop?.metadata && typeof loop.metadata === 'object' ? loop.metadata as any : {};
      const loopCode = loopMetadata?.loop_code || 'UNKNOWN';

      // Map task status to expected format
      const mapStatus = (status: string): 'available' | 'claimed' | 'in_progress' | 'review_due' | 'completed' | 'cancelled' => {
        switch (status) {
          case 'open': return 'available';
          case 'claimed': return 'claimed';
          case 'in_progress': return 'in_progress';
          case 'review_due': return 'review_due';
          case 'completed': return 'completed';
          case 'cancelled': return 'cancelled';
          default: return 'available';
        }
      };

      // Build the response in the expected format
      const claimTaskData: ClaimTaskData = {
        task: {
          task_id: task.id,
          title: task.title,
          capacity: task.capacity,
          priority: 1, // Default priority since not in tasks_5c
          status: mapStatus(task.status),
          open_route: `/playbooks/${task.capacity}`,
          due_at: null, // Not in tasks_5c schema
          review_at: null, // Not in tasks_5c schema
          payload: payload
        },
        loop: {
          id: loop?.id || task.loop_id,
          name: loop?.name || 'Unknown Loop',
          loop_code: loopCode,
          description: loop?.description || null
        },
        template: payload?.template ? {
          template_title: payload.template.title || `${task.capacity} Template`,
          default_sla_hours: payload.template.default_sla_hours || 24,
          default_payload: payload.template.default_payload
        } : undefined,
        checklist: Array.isArray(payload?.checklist) ? payload.checklist : [],
        artifacts: Array.isArray(payload?.artifacts) ? payload.artifacts : [],
        guardrails: payload?.guardrails || undefined,
        owner: task.assigned_to ? { user_id: task.assigned_to } : null,
        tri: tri,
        signal: payload?.signal || null,
        source: payload?.source || null
      };

      return claimTaskData;
    },
    enabled: !!taskId,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 3,
  });
};