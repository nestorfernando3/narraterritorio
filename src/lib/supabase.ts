import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = supabaseUrl.length > 0 && supabaseKey.length > 10;

// Create a dummy client if not configured to prevent crashes
const dummyClient = new Proxy({} as SupabaseClient, {
  get() {
    return () => Promise.resolve({ data: null, error: null });
  },
});

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : dummyClient;
