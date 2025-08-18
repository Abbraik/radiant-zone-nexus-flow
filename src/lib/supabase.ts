// Simple and safe Supabase configuration
function createMockSupabaseClient() {
  return {
    from: (table: string) => ({
      select: (columns?: string) => ({
        order: (column: string, options?: any) => ({
          limit: (count: number) => ({
            single: () => Promise.reject(new Error(`Mock: ${table} not available`)),
          }),
        }),
        gte: (column: string, value: any) => ({
          order: (column: string, options?: any) => ({
            limit: (count: number) => Promise.reject(new Error(`Mock: ${table} not available`)),
          }),
        }),
        in: (column: string, values: any[]) => Promise.reject(new Error(`Mock: ${table} not available`)),
      }),
    }),
  };
}

// Try to initialize Supabase, fall back to mock if any issues
let supabase: any;

try {
  // Import Supabase with proper ES6 syntax
  import('@supabase/supabase-js').then(module => {
    const { createClient } = module;
    
    const supabaseUrl = import.meta.env?.VITE_SUPABASE_URL;
    const supabaseAnonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY;

    if (supabaseUrl && supabaseAnonKey && supabaseUrl !== 'undefined' && supabaseAnonKey !== 'undefined') {
      supabase = createClient(supabaseUrl, supabaseAnonKey);
      console.log('✅ Supabase client connected');
    } else {
      console.warn('⚠️ Supabase environment variables not configured, using mock mode');
      if (!supabase || typeof supabase.from !== 'function') {
        supabase = createMockSupabaseClient();
      }
    }
  }).catch(error => {
    console.warn('⚠️ Supabase import failed, using mock mode:', error);
    if (!supabase || typeof supabase.from !== 'function') {
      supabase = createMockSupabaseClient();
    }
  });
} catch (error) {
  console.warn('⚠️ Supabase initialization failed, using mock mode:', error);
}

// Initialize with mock client immediately to prevent undefined access
if (!supabase) {
  supabase = createMockSupabaseClient();
}

export { supabase };