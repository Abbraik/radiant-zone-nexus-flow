import { useState } from 'react';
import { useDatabaseLoops } from '@/hooks/useDatabaseData';
import type { LoopData } from '@/types/loop-registry';
import { atlasStats } from '@/services/atlasData';

// Updated Atlas Registry Hook - Database Priority with Golden Scenario Fallback
export const useUpdatedAtlasRegistry = () => {
  const [isLoading] = useState(false);
  const [error] = useState<Error | null>(null);
  
  // Get loops from database first
  const { data: dbLoops, isLoading: dbLoading } = useDatabaseLoops();

  // Transform database loops to match LoopData interface
  const searchLoops = {
    data: dbLoops?.map(loop => ({
      id: loop.id,
      name: loop.name || 'Untitled Loop',
      synopsis: loop.description || '',
      loop_type: loop.loop_type || 'reactive',
      motif: (loop.motif as 'B' | 'R' | 'N' | 'C' | 'T') || 'N',
      layer: (loop.layer as 'meta' | 'macro' | 'meso' | 'micro') || 'meso',
      scale: (loop.scale as 'micro' | 'meso' | 'macro') || 'meso', 
      leverage_default: (loop.leverage_default as 'N' | 'P' | 'S') || 'N',
      status: (loop.status as 'draft' | 'published' | 'deprecated') || 'draft',
      tags: (loop.metadata as any)?.tags || [],
      node_count: (loop.metadata as any)?.node_count || 0,
      edge_count: (loop.metadata as any)?.edge_count || 0,
      created_at: loop.created_at,
      updated_at: loop.updated_at,
      user_id: loop.user_id,
      metadata: (loop.metadata as Record<string, any>) || {},
      controller: (loop.controller as Record<string, any>) || {},
      thresholds: (loop.metadata as any)?.thresholds || {},
      version: loop.version || 1,
      loop_code: loop.loop_code || '',
      notes: (loop.metadata as any)?.notes || ''
    })) || [],
    isLoading: dbLoading || isLoading,
    error,
    refetch: () => Promise.resolve()
  };

  const getLoop = (id: string) => {
    const loop = dbLoops?.find(l => l.id === id);
    
    return {
      data: loop ? {
        id: loop.id,
        name: loop.name || 'Untitled Loop',
        synopsis: loop.description || '',
        loop_type: loop.loop_type || 'reactive',
        motif: (loop.motif as 'B' | 'R' | 'N' | 'C' | 'T') || 'N', 
        layer: (loop.layer as 'meta' | 'macro' | 'meso' | 'micro') || 'meso',
        scale: (loop.scale as 'micro' | 'meso' | 'macro') || 'meso',
        leverage_default: (loop.leverage_default as 'N' | 'P' | 'S') || 'N',
        status: (loop.status as 'draft' | 'published' | 'deprecated') || 'draft',
        tags: (loop.metadata as any)?.tags || [],
        node_count: (loop.metadata as any)?.node_count || 0,
        edge_count: (loop.metadata as any)?.edge_count || 0,
        created_at: loop.created_at,
        updated_at: loop.updated_at,
        user_id: loop.user_id,
        metadata: (loop.metadata as Record<string, any>) || {},
        controller: (loop.controller as Record<string, any>) || {},
        thresholds: (loop.metadata as any)?.thresholds || {},
        version: loop.version || 1,
        loop_code: loop.loop_code || '',
        notes: (loop.metadata as any)?.notes || ''
      } : null,
      isLoading: false,
      error: null
    };
  };

  // Enhanced search with database data
  const searchWithFilters = (query?: string, filters?: any): LoopData[] => {
    const loops = searchLoops.data;
    
    let filtered = loops;
    
    // Apply text search
    if (query) {
      const searchTerm = query.toLowerCase();
      filtered = loops.filter(loop => 
        loop.name.toLowerCase().includes(searchTerm) ||
        (loop.synopsis || '').toLowerCase().includes(searchTerm) ||
        (loop.tags || []).some(tag => tag.toLowerCase().includes(searchTerm))
      );
    }
    
    // Apply filters
    if (filters?.type && filters.type !== 'all') {
      filtered = filtered.filter(loop => loop.loop_type === filters.type);
    }
    
    if (filters?.layer && filters.layer !== 'all') {
      filtered = filtered.filter(loop => loop.layer === filters.layer);
    }
    
    if (filters?.status && filters.status !== 'all') {
      filtered = filtered.filter(loop => loop.status === filters.status);
    }
    
    return filtered;
  };

  // Enhanced sort function
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

  // Database operations for loops
  const createLoop = {
    mutate: async (loopData: any) => {
      // Implementation for creating loops in database
      console.log('Creating loop:', loopData);
    },
    isPending: false
  };

  const publishLoop = {
    mutate: async (loopId: string) => {
      // Implementation for publishing loops
      console.log('Publishing loop:', loopId);
    },
    isPending: false
  };

  const updateLoop = {
    mutate: async (updates: any) => {
      // Implementation for updating loops
      console.log('Updating loop:', updates);
    },
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
    stats: {
      ...atlasStats,
      totalLoops: searchLoops.data.length
    }
  };
};

// Updated hook for individual loop
export const useUpdatedAtlasLoop = (id?: string) => {
  const { data: dbLoops } = useDatabaseLoops();
  
  const loop = dbLoops?.find(l => l.id === id);

  return {
    data: loop ? {
      id: loop.id,
      name: loop.name || 'Untitled Loop',
      synopsis: loop.description || '',
      loop_type: loop.loop_type || 'reactive',
      motif: (loop.motif as 'B' | 'R' | 'N' | 'C' | 'T') || 'N',
      layer: (loop.layer as 'meta' | 'macro' | 'meso' | 'micro') || 'meso',
      scale: (loop.scale as 'micro' | 'meso' | 'macro') || 'meso', 
      leverage_default: (loop.leverage_default as 'N' | 'P' | 'S') || 'N',
      status: (loop.status as 'draft' | 'published' | 'deprecated') || 'draft',
      tags: (loop.metadata as any)?.tags || [],
      node_count: (loop.metadata as any)?.node_count || 0,
      edge_count: (loop.metadata as any)?.edge_count || 0,
      created_at: loop.created_at,
      updated_at: loop.updated_at,
      user_id: loop.user_id,
      metadata: (loop.metadata as Record<string, any>) || {},
      controller: (loop.controller as Record<string, any>) || {},
      thresholds: (loop.metadata as any)?.thresholds || {},
      version: loop.version || 1,
      loop_code: loop.loop_code || '',
      notes: (loop.metadata as any)?.notes || ''
    } : null,
    isLoading: false,
    error: null
  };
};