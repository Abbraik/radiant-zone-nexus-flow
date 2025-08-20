import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import atlasBatch3Data from '@/fixtures/atlas_batch3.json';

export const importAtlasBatch3 = async () => {
  try {
    console.log('Starting Atlas Batch 3 import...');
    
    // First, upsert SNL catalog additions
    console.log('Upserting SNL catalog additions...');
    for (const snlNode of atlasBatch3Data.snl_catalog_additions) {
      const { error: snlError } = await supabase
        .from('shared_nodes')
        .upsert({
          label: snlNode.label,
          domain: snlNode.domain,
          descriptor: snlNode.descriptor
        }, {
          onConflict: 'label'
        });
      
      if (snlError) {
        console.error(`Error upserting SNL node ${snlNode.label}:`, snlError);
        throw snlError;
      }
    }
    
    console.log(`Upserted ${atlasBatch3Data.snl_catalog_additions.length} SNL nodes`);
    
    let importedCount = 0;
    let skippedCount = 0;
    
    for (const loopData of atlasBatch3Data.loops) {
      const loopCode = loopData.loop.metadata.loop_code;
      console.log(`Processing loop: ${loopCode}`);
      
      // Check if loop already exists
      const { data: existingLoop } = await supabase
        .from('loops')
        .select('id')
        .eq('loop_code', loopCode)
        .single();
      
      if (existingLoop) {
        console.log(`Loop ${loopCode} already exists, skipping...`);
        skippedCount++;
        continue;
      }
      
      // Insert the loop
      const { data: insertedLoop, error: loopError } = await supabase
        .from('loops')
        .insert({
          description: loopData.loop.description,
          loop_type: loopData.loop.loop_type,
          scale: loopData.loop.scale,
          status: loopData.loop.status,
          leverage_default: loopData.loop.leverage_default,
          notes: loopData.loop.notes,
          metadata: loopData.loop.metadata,
          loop_code: loopCode,
          user_id: (await supabase.auth.getUser()).data.user?.id || '',
          name: loopData.loop.name
        } as any)
        .select('id')
        .single();
      
      if (loopError) {
        console.error(`Error inserting loop ${loopCode}:`, loopError);
        throw loopError;
      }
      
      const loopId = insertedLoop.id;
      console.log(`Inserted loop ${loopCode} with ID: ${loopId}`);
      
      // Map old node IDs to new ones for edge references
      const nodeIdMap: Record<string, string> = {};
      
      // Insert nodes
      for (const node of loopData.nodes) {
        const { data: insertedNode, error: nodeError } = await supabase
          .from('loop_nodes')
          .insert({
            loop_id: loopId,
            label: node.label,
            kind: node.kind,
            meta: node.meta || {}
          })
          .select('id')
          .single();
        
        if (nodeError) {
          console.error(`Error inserting node ${node.label}:`, nodeError);
          throw nodeError;
        }
        
        nodeIdMap[node.id] = insertedNode.id;
      }
      
      // Insert edges
      for (const edge of loopData.edges) {
        const { error: edgeError } = await supabase
          .from('loop_edges')
          .insert({
            loop_id: loopId,
            from_node: nodeIdMap[edge.from_node],
            to_node: nodeIdMap[edge.to_node],
            polarity: edge.polarity,
            weight: edge.weight,
            note: edge.note || null
          });
        
        if (edgeError) {
          console.error(`Error inserting edge:`, edgeError);
          throw edgeError;
        }
      }
      
      // Map indicator IDs for DE bands
      const indicatorIdMap: Record<string, string> = {};
      
      // Insert indicators
      for (const indicator of loopData.indicators) {
        const { data: insertedIndicator, error: indicatorError } = await supabase
          .from('indicators')
          .insert({
            name: indicator.name,
            type: indicator.kind,
            unit: indicator.unit,
            user_id: (await supabase.auth.getUser()).data.user?.id || ''
          })
          .select('id')
          .single();
        
        if (indicatorError) {
          console.error(`Error inserting indicator ${indicator.name}:`, indicatorError);
          throw indicatorError;
        }
        
        indicatorIdMap[indicator.id] = insertedIndicator.id;
      }
      
      // Insert DE bands
      for (const band of loopData.de_bands) {
        const { error: bandError } = await supabase
          .from('de_bands')
          .insert({
            loop_id: loopId,
            indicator: indicatorIdMap[band.indicator_id] || 'primary',
            lower_bound: band.lower_bound,
            upper_bound: band.upper_bound,
            asymmetry: band.asymmetry,
            smoothing_alpha: band.smoothing_alpha,
            user_id: (await supabase.auth.getUser()).data.user?.id || ''
          });
        
        if (bandError) {
          console.error(`Error inserting DE band:`, bandError);
          throw bandError;
        }
      }
      
      // Insert SRT window
      const { error: srtError } = await supabase
        .from('srt_windows')
        .insert({
          loop_id: loopId,
          window_start: loopData.srt.window_start,
          window_end: loopData.srt.window_end,
          reflex_horizon: loopData.srt.reflex_horizon,
          cadence: loopData.srt.cadence,
          user_id: (await supabase.auth.getUser()).data.user?.id || ''
        });
      
      if (srtError) {
        console.error(`Error inserting SRT window:`, srtError);
        throw srtError;
      }
      
      // Link shared nodes
      for (const sharedNode of loopData.shared_nodes) {
        // Find the shared node by label
        const { data: snlNode } = await supabase
          .from('shared_nodes')
          .select('id')
          .eq('label', sharedNode.label)
          .single();
        
        if (snlNode) {
          const { error: linkError } = await supabase
            .from('loop_shared_nodes')
            .insert({
              loop_id: loopId,
              node_id: snlNode.id
            });
          
          if (linkError) {
            console.error(`Error linking shared node ${sharedNode.label}:`, linkError);
            // Don't throw here, just log the error
          }
        }
      }
      
      importedCount++;
      console.log(`Completed import for loop: ${loopCode}`);
    }
    
    console.log(`Atlas Batch 3 import completed! Imported: ${importedCount}, Skipped: ${skippedCount}`);
    
    toast({
      title: "Atlas Batch 3 Import Complete",
      description: `Successfully imported ${importedCount} loops (${skippedCount} skipped as duplicates)`
    });
    
    return { success: true, imported: importedCount, skipped: skippedCount };
    
  } catch (error) {
    console.error('Atlas Batch 3 import failed:', error);
    toast({
      title: "Import Failed",
      description: error instanceof Error ? error.message : "Unknown error occurred",
      variant: "destructive"
    });
    throw error;
  }
};