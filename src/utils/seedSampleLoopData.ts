import { supabase } from '@/integrations/supabase/client';

// Quick helper to seed sample loop data for testing the Loop Editor
export async function seedSampleLoopData() {
  try {
    // Check if we already have loops
    const { data: existingLoops } = await supabase
      .from('loops')
      .select('id')
      .limit(1);
    
    if (existingLoops && existingLoops.length > 0) {
      console.log('✅ Sample data already exists');
      return;
    }

    // Create a sample loop for testing
    const sampleLoop = {
      name: 'Test Loop - Customer Satisfaction',
      description: 'A sample loop for testing the editor functionality',
      loop_type: 'reactive' as const,
      scale: 'micro' as const,
      status: 'draft' as const,
      leverage_default: 'N' as const,
      loop_code: 'TEST-L01',
      domain: 'service',
      motif: 'B',
      metadata: {
        tags: ['test', 'sample'],
        atlas: false
      }
    };

    const { data: loop, error: loopError } = await supabase
      .from('loops')
      .insert([sampleLoop])
      .select()
      .single();

    if (loopError) {
      console.error('❌ Error creating sample loop:', loopError);
      return;
    }

    console.log('✅ Created sample loop:', loop.id);

    // Add some sample nodes
    const sampleNodes = [
      {
        loop_id: loop.id,
        label: 'Customer Satisfaction',
        kind: 'indicator',
        pos: { x: 100, y: 100 }
      },
      {
        loop_id: loop.id,
        label: 'Service Quality',
        kind: 'stock',
        pos: { x: 300, y: 100 }
      },
      {
        loop_id: loop.id,
        label: 'Response Time',
        kind: 'aux',
        pos: { x: 200, y: 200 }
      }
    ];

    const { data: nodes, error: nodesError } = await supabase
      .from('loop_nodes')
      .insert(sampleNodes)
      .select();

    if (nodesError) {
      console.error('❌ Error creating sample nodes:', nodesError);
      return;
    }

    console.log('✅ Created sample nodes:', nodes.length);

    // Add some sample edges
    if (nodes && nodes.length >= 3) {
      const sampleEdges = [
        {
          loop_id: loop.id,
          from_node: nodes[1].id, // Service Quality
          to_node: nodes[0].id,   // Customer Satisfaction
          polarity: 1,
          weight: 1.0
        },
        {
          loop_id: loop.id,
          from_node: nodes[2].id, // Response Time
          to_node: nodes[0].id,   // Customer Satisfaction
          polarity: -1,
          weight: 0.8
        }
      ];

      const { data: edges, error: edgesError } = await supabase
        .from('loop_edges')
        .insert(sampleEdges)
        .select();

      if (edgesError) {
        console.error('❌ Error creating sample edges:', edgesError);
        return;
      }

      console.log('✅ Created sample edges:', edges.length);
    }

    console.log('🎉 Sample loop data seeded successfully!');
    return loop;

  } catch (error) {
    console.error('❌ Error seeding sample data:', error);
    throw error;
  }
}

// Quick test to populate the database with one loop for testing
export async function quickSeed() {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.log('❌ User not authenticated');
      return;
    }

    // Insert the META-L03 loop that the user is trying to access
    const testLoop = {
      name: 'Escalation Governance (N→P→S Ladder)',
      description: 'Structural loop managing escalation from natural to policy to structural interventions',
      loop_type: 'structural' as const,
      scale: 'macro' as const, 
      status: 'published' as const,
      leverage_default: 'S' as const,
      loop_code: 'META-L03',
      domain: 'governance',
      motif: 'C',
      layer: 'meta',
      metadata: {
        tags: ['atlas', 'meta', 'governance'],
        atlas: true,
        layer: 'meta'
      }
    };

    const { data: loop, error: loopError } = await supabase
      .from('loops')
      .upsert([testLoop], { onConflict: 'loop_code' })
      .select()
      .single();

    if (loopError) {
      console.error('❌ Error creating test loop:', loopError);
      return;
    }

    console.log('✅ Created/updated test loop:', loop.loop_code);
    return loop;

  } catch (error) {
    console.error('❌ Error in quickSeed:', error);
    throw error;
  }
}

// Auto-run quickSeed when importing this module in development
if (typeof window !== 'undefined' && import.meta.env.DEV) {
  quickSeed().catch(console.error);
}