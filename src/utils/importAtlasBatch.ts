import { supabase } from '@/integrations/supabase/client';
import atlasBatch1 from '@/fixtures/atlas_batch1.json';

interface LoopIndicator {
  id: string;
  name: string;
  kind: string;
  unit: string;
}

interface DEBand {
  indicator_id: string;
  lower_bound: number;
  upper_bound: number;
  asymmetry: number;
  smoothing_alpha: number;
}

interface SRTWindow {
  window_start: string;
  window_end: string;
  reflex_horizon: string;
  cadence: string;
}

interface SharedNodeRef {
  label: string;
  role: string;
}

interface LoopData {
  loop: any;
  nodes: any[];
  edges: any[];
  shared_nodes: SharedNodeRef[];
  indicators: LoopIndicator[];
  de_bands: DEBand[];
  srt: SRTWindow;
}

export async function importAtlasBatch1(): Promise<{ success: boolean; error?: string; count?: number }> {
  try {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
      return { success: false, error: 'User not authenticated' };
    }

    let importedCount = 0;

    // 1. Upsert shared nodes from SNL catalog
    console.log('Importing shared nodes...');
    for (const snlNode of atlasBatch1.snl_catalog) {
      const { error: snlError } = await supabase
        .from('shared_nodes')
        .upsert({
          label: snlNode.label,
          domain: snlNode.domain,
          descriptor: snlNode.descriptor,
        }, {
          onConflict: 'label'
        });

      if (snlError) {
        console.warn('SNL upsert warning:', snlError);
      }
    }

    // 2. Process each loop
    for (const loopData of atlasBatch1.loops as LoopData[]) {
      console.log(`Importing loop: ${loopData.loop.name}`);

      // Upsert loop (using loop_code as unique key)
      const { data: loopResult, error: loopError } = await supabase
        .from('loops')
        .upsert({
          name: loopData.loop.name,
          description: loopData.loop.description,
          loop_type: loopData.loop.loop_type,
          scale: loopData.loop.scale,
          status: loopData.loop.status,
          leverage_default: loopData.loop.leverage_default,
          notes: loopData.loop.notes,
          metadata: loopData.loop.metadata,
          user_id: user.id,
        }, {
          onConflict: 'name,user_id' // Assuming this combination is unique
        })
        .select()
        .single();

      if (loopError) {
        console.error('Loop upsert error:', loopError);
        continue;
      }

      const loopId = loopResult.id;

      // Clear existing related data for clean reimport
      await supabase.from('loop_nodes').delete().eq('loop_id', loopId);
      await supabase.from('loop_edges').delete().eq('loop_id', loopId);
      await supabase.from('loop_shared_nodes').delete().eq('loop_id', loopId);

      // Delete indicators and DE bands for this loop
      const { data: existingIndicators } = await supabase
        .from('indicators')
        .select('id')
        .eq('user_id', user.id)
        .like('name', `%${loopData.loop.name.split(' ')[0]}%`);

      if (existingIndicators?.length) {
        const indicatorIds = existingIndicators.map(i => i.id);
        await supabase.from('de_bands').delete().in('indicator_id', indicatorIds);
        await supabase.from('indicators').delete().in('id', indicatorIds);
      }

      await supabase.from('srt_windows').delete().eq('loop_id', loopId);

      // Insert nodes
      if (loopData.nodes?.length) {
        const nodesWithLoopId = loopData.nodes.map(node => ({
          id: crypto.randomUUID(),
          loop_id: loopId,
          label: node.label,
          kind: node.kind,
          meta: node.meta || {},
        }));

        const { error: nodesError } = await supabase
          .from('loop_nodes')
          .insert(nodesWithLoopId);

        if (nodesError) {
          console.error('Nodes insert error:', nodesError);
        }

        // Get node IDs for edge mapping
        const { data: insertedNodes } = await supabase
          .from('loop_nodes')
          .select('*')
          .eq('loop_id', loopId);

        const nodeMap = new Map();
        insertedNodes?.forEach((node, idx) => {
          nodeMap.set(loopData.nodes[idx].id, node.id);
        });

        // Insert edges
        if (loopData.edges?.length) {
          const edgesWithLoopId = loopData.edges.map(edge => ({
            id: crypto.randomUUID(),
            loop_id: loopId,
            from_node: nodeMap.get(edge.from_node),
            to_node: nodeMap.get(edge.to_node),
            polarity: edge.polarity,
            delay_ms: edge.delay_ms || 0,
            weight: edge.weight || 1.0,
            note: edge.note || null,
          }));

          const { error: edgesError } = await supabase
            .from('loop_edges')
            .insert(edgesWithLoopId);

          if (edgesError) {
            console.error('Edges insert error:', edgesError);
          }
        }
      }

      // Insert shared node links
      if (loopData.shared_nodes?.length) {
        for (const snlRef of loopData.shared_nodes) {
          // Get shared node ID
          const { data: sharedNode } = await supabase
            .from('shared_nodes')
            .select('id')
            .eq('label', snlRef.label)
            .single();

          if (sharedNode) {
            const { error: linkError } = await supabase
              .from('loop_shared_nodes')
              .insert({
                loop_id: loopId,
                node_id: sharedNode.id,
              });

            if (linkError) {
              console.error('Shared node link error:', linkError);
            }
          }
        }
      }

      // Insert indicators
      if (loopData.indicators?.length) {
        const indicatorsWithIds = loopData.indicators.map(indicator => ({
          ...indicator,
          dbId: crypto.randomUUID()
        }));

        const indicatorsData = indicatorsWithIds.map(indicator => ({
          id: indicator.dbId,
          name: indicator.name,
          type: indicator.kind,
          unit: indicator.unit,
          user_id: user.id,
        }));

        const { data: insertedIndicators, error: indicatorsError } = await supabase
          .from('indicators')
          .insert(indicatorsData)
          .select();

        if (indicatorsError) {
          console.error('Indicators insert error:', indicatorsError);
        }

        // Insert DE bands
        if (insertedIndicators && loopData.de_bands?.length) {
          const bandsData = loopData.de_bands.map((band, idx) => {
            const matchingIndicator = insertedIndicators.find(ind => 
              ind.id === indicatorsWithIds[idx]?.dbId
            );
            
            if (!matchingIndicator) return null;

            return {
              indicator_id: matchingIndicator.id,
              loop_id: loopId,
              indicator: matchingIndicator.name || 'primary',
              lower_bound: band.lower_bound,
              upper_bound: band.upper_bound,
              asymmetry: band.asymmetry,
              smoothing_alpha: band.smoothing_alpha,
              user_id: user.id,
            };
          }).filter(Boolean) as any[];

          if (bandsData.length > 0) {
            const { error: bandsError } = await supabase
              .from('de_bands')
              .insert(bandsData);

            if (bandsError) {
              console.error('DE bands insert error:', bandsError);
            }
          }
        }
      }

      // Insert SRT window
      if (loopData.srt) {
        const { error: srtError } = await supabase
          .from('srt_windows')
          .insert({
            loop_id: loopId,
            window_start: loopData.srt.window_start,
            window_end: loopData.srt.window_end,
            reflex_horizon: loopData.srt.reflex_horizon,
            cadence: loopData.srt.cadence,
            user_id: user.id,
          });

        if (srtError) {
          console.error('SRT window insert error:', srtError);
        }
      }

      importedCount++;
    }

    return { success: true, count: importedCount };
  } catch (error) {
    console.error('Import error:', error);
    return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
  }
}