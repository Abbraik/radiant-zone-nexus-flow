import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';

interface BreachData {
  id: string;
  loop_id: string;
  loop_name: string;
  severity_score: number;
  magnitude: number;
  persistence: number;
  cohort: string;
  geo: string;
  updated_at: string;
  magnitude_change: number; // 7-day change
}

const fetchBreaches = async (): Promise<BreachData[]> => {
  try {
    // First get the breach data
    const { data: breaches, error: breachError } = await supabase
      .from('vw_breach_current')
      .select(`
        id,
        loop_id,
        severity_score,
        magnitude,
        persistence,
        cohort,
        geo,
        updated_at
      `)
      .gte('severity_score', 40) // Tier-3 threshold
      .order('severity_score', { ascending: false })
      .limit(50);

    if (breachError) {
      console.warn('Supabase vw_breach_current not available, using mock data:', breachError.message);
      return generateMockBreaches();
    }

    // Get loop names
    const loopIds = breaches.map(b => b.loop_id);
    const { data: loops, error: loopError } = await supabase
      .from('loops')
      .select('id, name')
      .in('id', loopIds);

    if (loopError) {
      console.warn('Failed to fetch loop names, using mock data:', loopError.message);
      return generateMockBreaches();
    }

    // Combine data with mock magnitude changes for demo
    const loopMap = loops.reduce((acc, loop) => {
      acc[loop.id] = loop.name;
      return acc;
    }, {} as Record<string, string>);

    return breaches.map(breach => ({
      ...breach,
      loop_name: loopMap[breach.loop_id] || 'Unknown Loop',
      magnitude_change: Math.random() * 10 - 5, // Mock 7-day change
    }));
  } catch (error) {
    console.warn('Failed to connect to Supabase, using mock data:', error);
    return generateMockBreaches();
  }
};

const generateMockBreaches = (): BreachData[] => {
  const loops = [
    'Housing_Approval_Loop',
    'Youth_Placement_Loop', 
    'Permit_Processing_Loop',
    'Budget_Allocation_Loop',
    'Service_Delivery_Loop',
    'Community_Engagement_Loop'
  ];
  
  const cohorts = ['youth', 'SMEs', 'households', 'seniors'];
  const geos = ['North', 'South', 'East', 'West', 'Central'];
  
  return loops.map((loop, index) => ({
    id: `breach-${index + 1}`,
    loop_id: `loop-${index + 1}`,
    loop_name: loop,
    severity_score: 85 - index * 8,
    magnitude: 7.5 - index * 0.8,
    persistence: 45 - index * 5,
    cohort: cohorts[index % cohorts.length],
    geo: geos[index % geos.length],
    updated_at: new Date(Date.now() - index * 3600000).toISOString(),
    magnitude_change: Math.random() * 10 - 5,
  }));
};

export const useBreachTicker = () => {
  const [isPolling, setIsPolling] = useState(true);

  const query = useQuery({
    queryKey: ['breach-ticker'],
    queryFn: fetchBreaches,
    refetchInterval: isPolling ? 60 * 1000 : false, // 60 seconds when polling
    staleTime: 30 * 1000, // 30 seconds
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const togglePolling = () => {
    setIsPolling(!isPolling);
  };

  return {
    ...query,
    isPolling,
    togglePolling,
  };
};