// React Hooks for Signals Data
// Provides reactive access to signals layer with caching

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { signalsClient } from '@/services/signals/client';
import { useToast } from '@/hooks/use-toast';
import { 
  LoopSignalSummary, 
  IndicatorSeries, 
  DQStatus, 
  IngestionRun, 
  SourceRegistry, 
  IndicatorRegistry,
  TimeWindow 
} from '@/services/signals/types';

// Query keys for consistent caching
export const SIGNALS_QUERY_KEYS = {
  loopSummary: (loopId: string, window: TimeWindow) => ['signals', 'loop-summary', loopId, window],
  indicatorSeries: (indicatorKey: string, from?: string, to?: string) => 
    ['signals', 'indicator-series', indicatorKey, from, to],
  dqStatus: (sourceId?: string, indicatorKey?: string) => 
    ['signals', 'dq-status', sourceId, indicatorKey],
  ingestionRuns: (sourceId?: string) => ['signals', 'ingestion-runs', sourceId],
  sources: () => ['signals', 'sources'],
  indicators: (loopId?: string) => ['signals', 'indicators', loopId],
} as const;

/**
 * Hook for getting loop signal summary with real-time updates
 */
export function useLoopSignalSummary(
  loopId: string | undefined,
  window: TimeWindow = '14d',
  options: { 
    enabled?: boolean;
    refetchInterval?: number;
  } = {}
) {
  return useQuery({
    queryKey: SIGNALS_QUERY_KEYS.loopSummary(loopId || '', window),
    queryFn: () => loopId ? signalsClient.getLoopSummary(loopId, window) : null,
    enabled: !!loopId && (options.enabled ?? true),
    refetchInterval: options.refetchInterval ?? 60000, // 1 minute default
    staleTime: 30000, // 30 seconds
    retry: 3,
  });
}

/**
 * Hook for getting indicator time series data
 */
export function useIndicatorSeries(
  indicatorKey: string | undefined,
  timeRange?: { from?: string; to?: string },
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: SIGNALS_QUERY_KEYS.indicatorSeries(
      indicatorKey || '', 
      timeRange?.from, 
      timeRange?.to
    ),
    queryFn: () => 
      indicatorKey 
        ? signalsClient.getIndicatorSeries(indicatorKey, timeRange?.from, timeRange?.to)
        : null,
    enabled: !!indicatorKey && (options.enabled ?? true),
    staleTime: 120000, // 2 minutes
    retry: 2,
  });
}

/**
 * Hook for data quality status monitoring
 */
export function useDQStatus(
  filters?: { sourceId?: string; indicatorKey?: string },
  options: { 
    enabled?: boolean;
    refetchInterval?: number;
  } = {}
) {
  return useQuery({
    queryKey: SIGNALS_QUERY_KEYS.dqStatus(filters?.sourceId, filters?.indicatorKey),
    queryFn: () => signalsClient.getDQStatus(filters?.sourceId, filters?.indicatorKey),
    enabled: options.enabled ?? true,
    refetchInterval: options.refetchInterval ?? 300000, // 5 minutes
    staleTime: 60000, // 1 minute
  });
}

/**
 * Hook for ingestion runs monitoring
 */
export function useIngestionRuns(
  sourceId?: string,
  options: { 
    enabled?: boolean;
    refetchInterval?: number;
  } = {}
) {
  return useQuery({
    queryKey: SIGNALS_QUERY_KEYS.ingestionRuns(sourceId),
    queryFn: () => signalsClient.getIngestionRuns(sourceId),
    enabled: options.enabled ?? true,
    refetchInterval: options.refetchInterval ?? 30000, // 30 seconds
    staleTime: 15000,
  });
}

/**
 * Hook for source registry
 */
export function useSignalSources(options: { enabled?: boolean } = {}) {
  return useQuery({
    queryKey: SIGNALS_QUERY_KEYS.sources(),
    queryFn: () => signalsClient.getSources(),
    enabled: options.enabled ?? true,
    staleTime: 300000, // 5 minutes
  });
}

/**
 * Hook for indicator registry
 */
export function useIndicators(
  loopId?: string,
  options: { enabled?: boolean } = {}
) {
  return useQuery({
    queryKey: SIGNALS_QUERY_KEYS.indicators(loopId),
    queryFn: () => signalsClient.getIndicators(loopId),
    enabled: options.enabled ?? true,
    staleTime: 300000, // 5 minutes
  });
}

/**
 * Mutation hook for seeding golden paths data
 */
export function useSeedGoldenPaths() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => signalsClient.seedGoldenPaths(),
    onSuccess: (data) => {
      if (data.success) {
        toast({
          title: "Signals Data Seeded",
          description: `Created ${data.sources_created} sources, ${data.indicators_created} indicators, and ${data.observations_created} observations`,
        });
        
        // Invalidate relevant queries
        queryClient.invalidateQueries({ queryKey: ['signals'] });
      } else {
        toast({
          title: "Seeding Failed",
          description: data.error || "Unknown error occurred",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      toast({
        title: "Seeding Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    },
  });
}

/**
 * Combined hook for loop signals overview
 */
export function useLoopSignalsOverview(loopId: string | undefined) {
  const signalSummary = useLoopSignalSummary(loopId);
  const indicators = useIndicators(loopId);
  const dqStatus = useDQStatus(
    loopId ? { sourceId: undefined, indicatorKey: undefined } : undefined,
    { enabled: !!loopId }
  );

  const isLoading = signalSummary.isLoading || indicators.isLoading || dqStatus.isLoading;
  const isError = signalSummary.isError || indicators.isError || dqStatus.isError;

  // Combine data quality issues
  const dataQualityIssues = dqStatus.data?.filter(status => status.quality !== 'good') || [];
  
  // Calculate overall health score
  const healthScore = signalSummary.data ? 
    Math.max(0, 1 - (
      signalSummary.data.scores.severity * 0.4 + 
      signalSummary.data.scores.persistence * 0.3 + 
      signalSummary.data.scores.dispersion * 0.3
    )) : 0;

  return {
    summary: signalSummary.data,
    indicators: indicators.data || [],
    dataQualityIssues,
    healthScore,
    actionBlocked: !signalSummary.data?.action_readiness.auto_ok,
    isLoading,
    isError,
    refetch: () => {
      signalSummary.refetch();
      indicators.refetch();
      dqStatus.refetch();
    },
  };
}

/**
 * Hook for real-time signals monitoring across multiple loops
 */
export function useSignalsMonitoring(loopIds: string[]) {
  const queries = loopIds.map(loopId => 
    useLoopSignalSummary(loopId, '14d', { refetchInterval: 30000 })
  );

  const isLoading = queries.some(q => q.isLoading);
  const summaries = queries.map(q => q.data).filter(Boolean) as LoopSignalSummary[];
  
  // Calculate system-wide metrics
  const systemHealth = summaries.length > 0 
    ? summaries.reduce((avg, summary) => {
        const loopHealth = 1 - (
          summary.scores.severity * 0.4 + 
          summary.scores.persistence * 0.3 + 
          summary.scores.dispersion * 0.3
        );
        return avg + loopHealth / summaries.length;
      }, 0)
    : 0;

  const criticalLoops = summaries.filter(summary => 
    summary.scores.severity > 1.5 || 
    summary.scores.persistence > 0.7 ||
    !summary.action_readiness.auto_ok
  );

  return {
    summaries,
    systemHealth: Math.max(0, Math.min(1, systemHealth)),
    criticalLoops,
    totalLoops: loopIds.length,
    isLoading,
    refetchAll: () => queries.forEach(q => q.refetch()),
  };
}