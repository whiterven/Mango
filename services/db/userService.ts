
import { getSupabaseClient } from '../../lib/supabase';
import { Profile } from '../../types/database';

export const userService = {
  getProfile: async (userId: string): Promise<Profile | null> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");
    
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();
      
    if (error) return null;
    return data;
  },

  updateProfile: async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    const { data, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', userId)
      .select()
      .single();

    if (error) throw error;
    return data;
  }
};
