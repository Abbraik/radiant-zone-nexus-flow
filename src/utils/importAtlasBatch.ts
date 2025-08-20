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
          onConflict: 'name,user_id'
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
      await supabase.from('srt_windows').delete().eq('loop_id', loopId);

      // Clean up indicators by name pattern (simple approach)
      await supabase
        .from('indicators')
        .delete()
        .eq('user_id', user.id)
        .like('name', `%${loopData.loop.name.split(' ')[0]}%`);

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
          .select('id, label')
          .eq('loop_id', loopId);

        const nodeMap = new Map<string, string>();
        if (insertedNodes) {
          // Match by label since we might not have perfect order
          loopData.nodes.forEach(originalNode => {
            const matchingNode = insertedNodes.find(n => n.label === originalNode.label);
            if (matchingNode) {
              nodeMap.set(originalNode.id, matchingNode.id);
            }
          });
        }

        // Insert edges
        if (loopData.edges?.length) {
          const edgesWithLoopId = loopData.edges
            .map(edge => ({
              id: crypto.randomUUID(),
              loop_id: loopId,
              from_node: nodeMap.get(edge.from_node) || null,
              to_node: nodeMap.get(edge.to_node) || null,
              polarity: edge.polarity,
              delay_ms: edge.delay_ms || 0,
              weight: edge.weight || 1.0,
              note: edge.note || null,
            }))
            .filter(edge => edge.from_node && edge.to_node);

          if (edgesWithLoopId.length > 0) {
            const { error: edgesError } = await supabase
              .from('loop_edges')
              .insert(edgesWithLoopId);

            if (edgesError) {
              console.error('Edges insert error:', edgesError);
            }
          }
        }
      }

      // Insert shared node links
      if (loopData.shared_nodes?.length) {
        for (const snlRef of loopData.shared_nodes) {
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

      // Insert indicators and DE bands
      if (loopData.indicators?.length) {
        for (let i = 0; i < loopData.indicators.length; i++) {
          const indicator = loopData.indicators[i];
          const indicatorId = crypto.randomUUID();

          const { error: indicatorError } = await supabase
            .from('indicators')
            .insert({
              id: indicatorId,
              name: indicator.name,
              type: indicator.kind,
              unit: indicator.unit,
              user_id: user.id,
            });

          if (indicatorError) {
            console.error('Indicator insert error:', indicatorError);
            continue;
          }

          // Insert corresponding DE band if exists
          if (loopData.de_bands?.[i]) {
            const band = loopData.de_bands[i];
            const { error: bandError } = await supabase
              .from('de_bands')
              .insert({
                indicator_id: indicatorId,
                loop_id: loopId,
                indicator: indicator.name,
                lower_bound: band.lower_bound,
                upper_bound: band.upper_bound,
                asymmetry: band.asymmetry,
                smoothing_alpha: band.smoothing_alpha,
                user_id: user.id,
              });

            if (bandError) {
              console.error('DE band insert error:', bandError);
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