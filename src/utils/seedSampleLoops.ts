// Sample loop seeding utility for quick testing
import { supabase } from '@/integrations/supabase/client';

export const seedSampleLoops = async () => {
  try {
    console.log('Checking for golden path loops...');
    
    // Check if we already have golden path loops
    const { data: existingLoops, error: queryError } = await supabase
      .from('loops')
      .select('id, loop_code, name')
      .eq('source_tag', 'GOLDEN_PATH')
      .limit(10);

    if (queryError) {
      throw queryError;
    }

    if (existingLoops && existingLoops.length >= 5) {
      console.log(`Found ${existingLoops.length} golden path loops:`, existingLoops.map(l => l.loop_code).join(', '));
      return { 
        success: true, 
        count: existingLoops.length,
        message: 'Golden path loops already exist'
      };
    }

    // If no golden path loops exist, inform that they should be seeded via migration
    console.log('No golden path loops found. These should be created via database migration.');
    return { 
      success: false, 
      error: 'Golden path loops not found. Run database migration to seed loops.',
      count: 0
    };

  } catch (error) {
    console.error('Error in seedSampleLoops:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      count: 0
    };
  }
};