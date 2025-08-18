import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';

interface MetaAlignmentData {
  overall_alignment: number;
  population_score: number;
  domains_balance_score: number;
  institutions_adaptivity_score: number;
  updated_at: string;
}

const fetchMetaAlignment = async (): Promise<MetaAlignmentData> => {
  try {
    const { data, error } = await supabase
      .from('meta_alignment_vw')
      .select('*')
      .order('updated_at', { ascending: false })
      .limit(1)
      .single();

    if (error) {
      console.warn('Supabase meta_alignment_vw not available, using mock data:', error.message);
      // Return mock data for demo
      return {
        overall_alignment: 72,
        population_score: 69,
        domains_balance_score: 74,
        institutions_adaptivity_score: 71,
        updated_at: new Date().toISOString(),
      };
    }

    return data;
  } catch (error) {
    console.warn('Failed to connect to Supabase, using mock data:', error);
    // Return mock data for demo
    return {
      overall_alignment: 72,
      population_score: 69,
      domains_balance_score: 74,
      institutions_adaptivity_score: 71,
      updated_at: new Date().toISOString(),
    };
  }
};

export const useMetaAlignment = () => {
  return useQuery({
    queryKey: ['meta-alignment'],
    queryFn: fetchMetaAlignment,
    refetchInterval: 5 * 60 * 1000, // 5 minutes
    staleTime: 4 * 60 * 1000, // 4 minutes
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });
};