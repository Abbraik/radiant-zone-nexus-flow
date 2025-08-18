import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { LoopScorecard } from '@/types/scorecard';
import { useToast } from '@/hooks/use-toast';

export const useScorecard = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getScorecard = (loopId: string) => useQuery({
    queryKey: ['scorecard', loopId],
    queryFn: async (): Promise<LoopScorecard | null> => {
      const { data, error } = await supabase.rpc('get_scorecard', {
        loop_uuid: loopId
      });
      
      if (error) throw error;
      return data as unknown as LoopScorecard;
    },
    enabled: !!loopId,
  });

  const getAllScorecards = useQuery({
    queryKey: ['scorecards', 'all'],
    queryFn: async (): Promise<LoopScorecard[]> => {
      const { data, error } = await supabase
        .from('mv_loop_metrics')
        .select('*');
      
      if (error) throw error;
      
      // Transform the data to match LoopScorecard interface
      return (data || []).map(item => ({
        loop_id: item.loop_id,
        loop_name: item.loop_name,
        loop_status: item.loop_status,
        latest_tri: {
          t_value: item.latest_t_value,
          r_value: item.latest_r_value,
          i_value: item.latest_i_value,
          at: item.latest_tri_at,
        },
        breach_count: item.breach_count,
        last_breach_at: item.last_breach_at,
        claim_velocity: item.claim_velocity,
        fatigue_score: item.fatigue_score,
        de_state: item.de_state,
        heartbeat_at: item.heartbeat_at,
        breach_days: item.breach_days,
        tri_slope: item.tri_slope,
        sparkline: [], // Will be populated when individual scorecard is fetched
      }));
    },
  });

  const runHeartbeat = useMutation({
    mutationFn: async () => {
      const { data, error } = await supabase.functions.invoke('heartbeat');
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['scorecards'] });
      queryClient.invalidateQueries({ queryKey: ['scorecard'] });
      toast({
        title: "Heartbeat Complete",
        description: "Loop scorecards have been updated.",
      });
    },
    onError: (error) => {
      toast({
        title: "Heartbeat Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const createRedesignTask = useMutation({
    mutationFn: async ({ loopId, reason, capacity = 'reflexive' }: {
      loopId: string;
      reason: string;
      capacity?: string;
    }) => {
      const { data, error } = await supabase.rpc('create_redesign_task', {
        loop_uuid: loopId,
        reason_text: reason,
        task_capacity: capacity
      });
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast({
        title: "Redesign Task Created",
        description: "A new redesign task has been created.",
      });
    },
  });

  return {
    getScorecard,
    getAllScorecards,
    runHeartbeat,
    createRedesignTask,
  };
};