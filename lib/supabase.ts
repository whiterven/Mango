
import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safely access environment variables
const getEnv = (key: string) => {
  // Check process.env (Node/Webpack/Polyfilled)
  if (typeof process !== 'undefined' && process.env && process.env[key]) {
    return process.env[key];
  }
  // Check import.meta.env (Vite) safely
  try {
    const meta = import.meta as any;
    return meta.env?.[key];
  } catch (e) {
    return undefined;
  }
};

// Use provided credentials as default fallback
const supabaseUrl = getEnv('VITE_SUPABASE_URL') || 'https://ryzbiptghbiejqbzorfc.supabase.co';
const supabaseAnonKey = getEnv('VITE_SUPABASE_ANON_KEY') || 'sb_publishable_KbRLPSR__som_DPUXM60SQ_FXTyvH21';

let supabaseInstance: SupabaseClient | null = null;

export const getSupabaseClient = (): SupabaseClient | null => {
  if (supabaseInstance) return supabaseInstance;

  if (supabaseUrl && supabaseAnonKey) {
    try {
      supabaseInstance = createClient(supabaseUrl, supabaseAnonKey);
      return supabaseInstance;
    } catch (error) {
      console.warn("Failed to initialize Supabase client:", error);
      return null;
    }
  }

  // Only warn once in development
  if (!window.hasWarnedSupabase) {
    console.warn("Supabase credentials missing. App running in offline/demo mode.");
    window.hasWarnedSupabase = true;
  }
  
  return null;
};

export const isSupabaseConnected = (): boolean => {
  return !!(supabaseUrl && supabaseAnonKey);
};

export const testSupabaseConnection = async (): Promise<boolean> => {
  const client = getSupabaseClient();
  if (!client) return false;
  
  try {
    const { error } = await client.from('profiles').select('count').limit(1).single();
    // If the table doesn't exist, we might get a 404 or specific error, but a connection error is distinct.
    // We treat 'PGRST116' (JSON object requested, multiple (or no) rows returned) as success because it means the DB responded.
    if (error && error.code !== 'PGRST116') {
        console.error("Supabase connection test failed:", error);
        return false;
    }
    return true;
  } catch (e) {
    return false;
  }
};

declare global {
  interface Window {
    hasWarnedSupabase?: boolean;
  }
}
