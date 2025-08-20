// Combined Atlas Data Service - All batches available without import/auth
import { LoopData } from '@/types/loop-registry';

// Import all atlas batches
import batch1 from '@/fixtures/atlas_batch1.json';
import batch2 from '@/fixtures/atlas_batch2.json';
import batch3 from '@/fixtures/atlas_batch3.json';
import batch4 from '@/fixtures/atlas_batch4.json';
import batch5 from '@/fixtures/atlas_batch5.json';

// Transform atlas loop format to LoopData format
const transformAtlasLoop = (atlasLoop: any, batchNumber: number): LoopData => {
  const loop = atlasLoop.loop;
  const nodeCount = atlasLoop.nodes?.length || 0;
  const edgeCount = atlasLoop.edges?.length || 0;
  const indicatorCount = atlasLoop.indicators?.length || 0;
  
  return {
    id: `atlas-${loop.metadata?.loop_code || `batch${batchNumber}-${Math.random()}`}`,
    name: loop.name,
    loop_type: loop.loop_type || 'reactive',
    scale: loop.scale || 'micro',
    status: 'draft', // Make all atlas loops draft status
    leverage_default: loop.leverage_default || 'N',
    notes: `${loop.description || ''}\n\n${loop.notes || ''}`.trim(),
    metadata: {
      ...loop.metadata,
      batch: batchNumber,
      node_count: nodeCount,
      edge_count: edgeCount,
      indicator_count: indicatorCount,
      has_snl: (atlasLoop.shared_nodes?.length || 0) > 0,
      has_de_band: (atlasLoop.de_bands?.length || 0) > 0,
      has_srt: !!atlasLoop.srt
    },
    controller: {},
    thresholds: {},
    tags: loop.metadata?.tags || [],
    node_count: nodeCount,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    user_id: null, // Public data
    source_tag: 'NCF-PAGS-ATLAS',
    loop_code: loop.metadata?.loop_code,
    version: 1
  };
};

// Combine all batches
const getAllAtlasLoops = (): LoopData[] => {
  const allLoops: LoopData[] = [];
  
  // Process each batch
  [
    { data: batch1, number: 1 },
    { data: batch2, number: 2 },
    { data: batch3, number: 3 },
    { data: batch4, number: 4 },
    { data: batch5, number: 5 }
  ].forEach(({ data, number }) => {
    if (data?.loops) {
      data.loops.forEach((atlasLoop: any) => {
        allLoops.push(transformAtlasLoop(atlasLoop, number));
      });
    }
  });
  
  return allLoops;
};

// Export combined atlas data
export const atlasLoops = getAllAtlasLoops();

// Atlas statistics
export const atlasStats = {
  totalLoops: atlasLoops.length,
  batchCounts: {
    batch1: batch1?.loops?.length || 0,
    batch2: batch2?.loops?.length || 0,
    batch3: batch3?.loops?.length || 0,
    batch4: batch4?.loops?.length || 0,
    batch5: batch5?.loops?.length || 0
  },
  scaleDistribution: atlasLoops.reduce((acc, loop) => {
    acc[loop.scale] = (acc[loop.scale] || 0) + 1;
    return acc;
  }, {} as Record<string, number>),
  typeDistribution: atlasLoops.reduce((acc, loop) => {
    acc[loop.loop_type] = (acc[loop.loop_type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>)
};

// Search and filter atlas loops
export const searchAtlasLoops = (query?: string, filters?: any): LoopData[] => {
  let filtered = [...atlasLoops];
  
  // Text search
  if (query && query.trim()) {
    const searchLower = query.toLowerCase();
    filtered = filtered.filter(loop => 
      loop.name.toLowerCase().includes(searchLower) ||
      loop.notes?.toLowerCase().includes(searchLower) ||
      (loop.tags || []).some(tag => tag.toLowerCase().includes(searchLower)) ||
      loop.metadata?.loop_code?.toLowerCase().includes(searchLower) ||
      loop.metadata?.domain?.toLowerCase().includes(searchLower)
    );
  }
  
  // Apply filters
  if (filters) {
    // Loop type filter
    if (filters.loop_type?.length > 0) {
      filtered = filtered.filter(loop => {
        return filters.loop_type.includes(loop.loop_type);
      });
    }
    
    // Scale filter
    if (filters.scale?.length > 0) {
      filtered = filtered.filter(loop => {
        return filters.scale.includes(loop.scale);
      });
    }
    
    // Status filter
    if (filters.status?.length > 0) {
      filtered = filtered.filter(loop => {
        return filters.status.includes(loop.status);
      });
    }
    
    // Tags filter
    if (filters.tags?.length > 0) {
      filtered = filtered.filter(loop => {
        const loopTags = loop.tags || [];
        return filters.tags.some((tag: string) => loopTags.includes(tag));
      });
    }
    
    // Motif filter - check metadata.motif
    if (filters.motif?.length > 0) {
      filtered = filtered.filter(loop => {
        const motif = loop.metadata?.motif;
        return motif && filters.motif.includes(motif);
      });
    }
    
    // Layer filter - derive from loop code prefix
    if (filters.layer?.length > 0) {
      filtered = filtered.filter(loop => {
        const loopCode = loop.metadata?.loop_code || '';
        let layer = '';
        if (loopCode.startsWith('META-')) layer = 'meta';
        else if (loopCode.startsWith('MAC-')) layer = 'macro';
        else if (loopCode.startsWith('MES-')) layer = 'meso';
        else if (loopCode.startsWith('MIC-')) layer = 'micro';
        return layer && filters.layer.includes(layer);
      });
    }
    
    // Boolean filters - only apply if explicitly set to true
    if (filters.has_snl === true) {
      filtered = filtered.filter(loop => loop.metadata?.has_snl === true);
    }
    if (filters.has_de_band === true) {
      filtered = filtered.filter(loop => loop.metadata?.has_de_band === true);
    }
    if (filters.has_srt === true) {
      filtered = filtered.filter(loop => loop.metadata?.has_srt === true);
    }
  }
  
  return filtered;
};

// Get individual atlas loop by ID
export const getAtlasLoop = (id: string): LoopData | null => {
  return atlasLoops.find(loop => loop.id === id) || null;
};