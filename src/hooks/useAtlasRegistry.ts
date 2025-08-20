// Atlas Registry Hook - No authentication required
import { useState, useMemo } from 'react';
import { LoopData } from '@/types/loop-registry';
import { atlasLoops, searchAtlasLoops, getAtlasLoop, atlasStats } from '@/services/atlasData';

export const useAtlasRegistry = () => {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);

  // Simulate async query interface for compatibility
  const searchLoops = {
    data: atlasLoops,
    isLoading,
    error,
    refetch: () => Promise.resolve()
  };

  const getLoop = (id: string) => {
    const loop = useMemo(() => {
      return id ? getAtlasLoop(id) : null;
    }, [id]);

    return {
      data: loop,
      isLoading: false,
      error: null
    };
  };

  // Filter and search function
  const searchWithFilters = (query?: string, filters?: any): LoopData[] => {
    return searchAtlasLoops(query, filters);
  };

  // Sort function
  const sortLoops = (loops: LoopData[], sortBy: 'name' | 'nodes' | 'updated' | 'indicators' = 'updated'): LoopData[] => {
    return [...loops].sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'nodes':
          return (b.node_count || 0) - (a.node_count || 0);
        case 'indicators':
          return (b.metadata?.indicator_count || 0) - (a.metadata?.indicator_count || 0);
        case 'updated':
        default:
          return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
      }
    });
  };

  // No-op functions for compatibility (atlas data is read-only)
  const createLoop = {
    mutate: () => {},
    isPending: false
  };

  const publishLoop = {
    mutate: () => {},
    isPending: false
  };

  const updateLoop = {
    mutate: () => {},
    isPending: false
  };

  return {
    searchLoops,
    getLoop,
    publishLoop,
    createLoop,
    updateLoop,
    searchWithFilters,
    sortLoops,
    stats: atlasStats
  };
};

// Hook for individual atlas loop
export const useAtlasLoop = (id?: string) => {
  const loop = useMemo(() => {
    return id ? getAtlasLoop(id) : null;
  }, [id]);

  return {
    data: loop,
    isLoading: false,
    error: null
  };
};