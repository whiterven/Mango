
import { getSupabaseClient } from '../../lib/supabase';
import { Profile } from '../../types/database';

const LOCAL_KEY = 'mango_user_profile';

export const userService = {
  getProfile: async (userId: string): Promise<Profile | null> => {
    const supabase = getSupabaseClient();
    
    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
        
      if (!error && data) return data;
    }

    // Fallback
    const local = localStorage.getItem(LOCAL_KEY);
    return local ? JSON.parse(local) : null;
  },

  updateProfile: async (userId: string, updates: Partial<Profile>): Promise<Profile> => {
    const supabase = getSupabaseClient();

    if (supabase) {
      const { data, error } = await supabase
        .from('profiles')
        .update(updates)
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;
      return data;
    }

    // Fallback
    const current = await userService.getProfile(userId) || { 
        id: userId, 
        email: 'demo@user.com', 
        role: 'owner', 
        created_at: new Date().toISOString(), 
        updated_at: new Date().toISOString() 
    };
    const updated = { ...current, ...updates, updated_at: new Date().toISOString() };
    localStorage.setItem(LOCAL_KEY, JSON.stringify(updated));
    return updated as Profile;
  }
};
