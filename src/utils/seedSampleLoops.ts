// Sample loop seeding utility for quick testing
import { supabase } from '@/integrations/supabase/client';

export const seedSampleLoops = async () => {
  try {
    console.log('Starting to seed sample loops...');
    
    // First create some shared nodes
    const sharedNodes = [
      { label: 'Residents', domain: 'population', descriptor: 'People living in jurisdiction' },
      { label: 'Developers', domain: 'institution', descriptor: 'Property developers' },
      { label: 'Finance Ministry', domain: 'institution', descriptor: 'Budget & fiscal authority' },
      { label: 'Grid Operator', domain: 'institution', descriptor: 'Electricity transmission operator' },
      { label: 'Hospitals', domain: 'institution', descriptor: 'Secondary/tertiary care facilities' },
    ];

    // Try to create shared nodes (if RPC function exists)
    for (const node of sharedNodes) {
      try {
        const { error } = await supabase.rpc('upsert_snl', node);
        if (error) console.error('Error creating shared node:', error);
      } catch (error) {
        console.log('Skipping shared node creation - RPC function not available');
      }
    }

    // Create sample loops directly in the database
    const sampleLoops = [
      {
        name: 'Affordable Housing Availability',
        loop_type: 'reactive',
        motif: 'B',
        layer: 'macro',
        scale: 'macro',
        leverage_default: 'N',
        status: 'published',
        notes: 'Balancing loop for housing affordability dynamics',
        metadata: { tags: ['housing', 'affordability', 'policy'] }
      },
      {
        name: 'ER Wait Time Stabilization',
        loop_type: 'reactive',
        motif: 'B',
        layer: 'micro',
        scale: 'micro',
        leverage_default: 'P',
        status: 'published',
        notes: 'Emergency room wait time balancing feedback',
        metadata: { tags: ['health', 'emergency', 'operations'] }
      },
      {
        name: 'Food Price Inflation',
        loop_type: 'reactive',
        motif: 'R',
        layer: 'macro',
        scale: 'macro',
        leverage_default: 'P',
        status: 'published',
        notes: 'Reinforcing food price inflation dynamics',
        metadata: { tags: ['prices', 'inflation', 'economics'] }
      },
      {
        name: 'Digital Service Latency',
        loop_type: 'reactive',
        motif: 'B',
        layer: 'meso',
        scale: 'meso',
        leverage_default: 'P',
        status: 'published',
        notes: 'Service latency balancing loop',
        metadata: { tags: ['digital', 'services', 'performance'] }
      },
      {
        name: 'Meta-Loop Supervisory Control',
        loop_type: 'reactive',
        motif: 'B',
        layer: 'meta',
        scale: 'macro',
        leverage_default: 'N',
        status: 'published',
        notes: 'Top-level supervisory control loop',
        metadata: { tags: ['control', 'supervision', 'meta'] }
      }
    ];

    // Try to get authenticated user, otherwise use system user for atlas loops
    const { data: { user } } = await supabase.auth.getUser();
    const systemUserId = '00000000-0000-0000-0000-000000000000'; // System user for atlas loops
    const userId = user?.id || systemUserId;
    
    console.log('Using user ID:', userId, user ? '(authenticated)' : '(system user)');

    const createdLoops = [];
    for (const loop of sampleLoops) {
      const { data, error } = await supabase
        .from('loops')
        .insert({
          ...loop,
          leverage_default: loop.leverage_default as 'N' | 'P' | 'S',
          loop_type: loop.loop_type as 'reactive' | 'structural' | 'perceptual',
          scale: loop.scale as 'micro' | 'meso' | 'macro',
          user_id: userId
        })
        .select()
        .single();
      
      if (error) {
        console.error('Error creating loop:', error);
      } else {
        createdLoops.push(data);
        console.log('Created loop:', data.name);
        
        // Add some sample nodes and edges for each loop
        const loopId = data.id;
        
        // Create sample nodes
        const nodes = [
          { id: `${loopId}-node-1`, loop_id: loopId, label: 'State Variable', kind: 'stock', meta: {} },
          { id: `${loopId}-node-2`, loop_id: loopId, label: 'Flow Rate', kind: 'flow', meta: {} },
          { id: `${loopId}-node-3`, loop_id: loopId, label: 'Control Policy', kind: 'aux', meta: {} },
        ];
        
        // Note: loop_nodes table may not exist in the current schema
        // Skipping node creation for now
        console.log('Skipping node creation - table not available');
        
        // Create sample edges
        const edges = [
          { 
            loop_id: loopId, 
            from_node: `${loopId}-node-1`, 
            to_node: `${loopId}-node-2`, 
            polarity: 1, 
            delay_ms: 0,
            weight: 0.5,
            note: 'Positive feedback'
          },
          { 
            loop_id: loopId, 
            from_node: `${loopId}-node-2`, 
            to_node: `${loopId}-node-3`, 
            polarity: -1, 
            delay_ms: 1000,
            weight: 0.7,
            note: 'Negative feedback with delay'
          }
        ];
        
        // Note: loop_edges table may not exist in the current schema
        // Skipping edge creation for now
        console.log('Skipping edge creation - table not available');
        
        // Create sample indicators and DE bands
        const { error: indicatorError } = await supabase
          .from('indicators')
          .insert({
            user_id: userId,
            name: `${loop.name} Performance`,
            type: 'quantity',
            unit: 'units',
            target_value: 75,
            lower_bound: 50,
            upper_bound: 100
          });
        
        if (indicatorError) {
          console.error('Error creating indicator:', indicatorError);
        }
        
        // Create DE band
        const { error: bandError } = await supabase
          .from('de_bands')
          .insert({
            loop_id: loopId,
            indicator: `${loop.name} Performance`,
            lower_bound: 50,
            upper_bound: 100,
            asymmetry: 0,
            user_id: userId
          });
        
        if (bandError) {
          console.error('Error creating DE band:', bandError);
        }
        
        // Create SRT window (if table exists)
        try {
          const { error: srtError } = await supabase
            .from('srt_windows')
            .insert({
              loop_id: loopId,
              window_start: new Date().toISOString(),
              window_end: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
              reflex_horizon: '30 days',
              cadence: '1 week',
              user_id: userId
            });
          
          if (srtError) {
            console.error('Error creating SRT window (table may not exist):', srtError);
          }
        } catch (srtError) {
          console.log('Skipping SRT window creation - table not available');
        }
      }
    }
    
    console.log(`Successfully seeded ${createdLoops.length} sample loops!`);
    return { success: true, count: createdLoops.length };
    
  } catch (error) {
    console.error('Error seeding sample loops:', error);
    return { success: false, error: error.message };
  }
};