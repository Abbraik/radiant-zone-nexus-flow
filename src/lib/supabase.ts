import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Create supabase client or mock fallback
let supabase: any;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase environment variables not configured, using mock data mode');
  // Create a mock client that will throw predictable errors for graceful fallback
  supabase = {
    from: () => ({
      select: () => ({
        order: () => ({
          limit: () => ({
            single: () => Promise.reject(new Error('Supabase not configured')),
          }),
        }),
        gte: () => ({
          order: () => ({
            limit: () => Promise.reject(new Error('Supabase not configured')),
          }),
        }),
        in: () => Promise.reject(new Error('Supabase not configured')),
      }),
    }),
  };
} else {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
}

export { supabase };