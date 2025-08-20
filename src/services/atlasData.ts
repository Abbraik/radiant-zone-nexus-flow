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
  
  // Create unique ID using loop code and batch
  const uniqueId = loop.metadata?.loop_code ? 
    `atlas-${loop.metadata.loop_code}` : 
    `atlas-batch${batchNumber}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  
  return {
    id: uniqueId,
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
      // Store Atlas structure data for CLD engine
      atlas_data: {
        nodes: atlasLoop.nodes || [],
        edges: atlasLoop.edges || [],
        indicators: atlasLoop.indicators || [],
        shared_nodes: atlasLoop.shared_nodes || [],
        de_bands: atlasLoop.de_bands || [],
        srt: atlasLoop.srt
      }
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
  const loopsByCode = new Map<string, { loop: any, batch: number }>();
  
  // Process each batch - later batches override earlier ones for duplicates
  [
    { data: batch1, number: 1 },
    { data: batch2, number: 2 },
    { data: batch3, number: 3 },
    { data: batch4, number: 4 },
    { data: batch5, number: 5 }
  ].forEach(({ data, number }) => {
    if (data?.loops) {
      data.loops.forEach((atlasLoop: any) => {
        const loopCode = atlasLoop.loop?.metadata?.loop_code;
        
        if (loopCode) {
          // If duplicate, prefer the higher batch number (later batch)
          if (loopsByCode.has(loopCode)) {
            const existing = loopsByCode.get(loopCode)!;
            if (number > existing.batch) {
              console.log(`Replacing ${loopCode} from batch ${existing.batch} with batch ${number}`);
              loopsByCode.set(loopCode, { loop: atlasLoop, batch: number });
            } else {
              console.log(`Keeping ${loopCode} from batch ${existing.batch}, ignoring batch ${number}`);
            }
          } else {
            loopsByCode.set(loopCode, { loop: atlasLoop, batch: number });
          }
        } else {
          // No loop code, treat as unique
          const uniqueKey = `batch${number}-${Math.random().toString(36).substr(2, 9)}`;
          loopsByCode.set(uniqueKey, { loop: atlasLoop, batch: number });
        }
      });
    }
  });
  
  // Transform all unique loops
  for (const [loopCode, { loop: atlasLoop, batch }] of loopsByCode) {
    const transformedLoop = transformAtlasLoop(atlasLoop, batch);
    
    // Debug layer assignment
    let layer = '';
    const code = transformedLoop.metadata?.loop_code || '';
    if (code.startsWith('META-')) layer = 'meta';
    else if (code.startsWith('MAC-')) layer = 'macro';
    else if (code.startsWith('MES-')) layer = 'meso';
    else if (code.startsWith('MIC-')) layer = 'micro';
    
    console.log(`Added loop: ${code} (${transformedLoop.name}) - Layer: ${layer}, Batch: ${batch}`);
    allLoops.push(transformedLoop);
  }
  
  console.log(`Loaded ${allLoops.length} unique loops from atlas batches`);
  
  // Group by layer for debugging
  const byLayer = allLoops.reduce((acc, loop) => {
    const loopCode = loop.metadata?.loop_code || '';
    let layer = 'unknown';
    if (loopCode.startsWith('META-')) layer = 'meta';
    else if (loopCode.startsWith('MAC-')) layer = 'macro';
    else if (loopCode.startsWith('MES-')) layer = 'meso';
    else if (loopCode.startsWith('MIC-')) layer = 'micro';
    
    if (!acc[layer]) acc[layer] = [];
    acc[layer].push(loop.metadata?.loop_code || loop.name);
    return acc;
  }, {} as Record<string, string[]>);
  
  console.log('Loops by layer:', byLayer);
  
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
  }
  
  return filtered;
};

// Get individual atlas loop by ID
export const getAtlasLoop = (id: string): LoopData | null => {
  return atlasLoops.find(loop => loop.id === id) || null;
};