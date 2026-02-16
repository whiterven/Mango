
import { getSupabaseClient } from '../../lib/supabase';
import { ActivityLog } from '../../types/database';

export const activityService = {
  logActivity: async (userId: string, action: string, details?: any): Promise<void> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      // Fire and forget
      supabase.from('activity_logs').insert({ user_id: userId, action, details }).then(({ error }) => {
        if (error) console.warn("Failed to log activity remotely", error);
      });
    }
  },

  getRecentActivity: async (userId: string): Promise<ActivityLog[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20);
      
    return data || [];
  }
};
