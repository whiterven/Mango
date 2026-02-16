
import { getSupabaseClient } from '../../lib/supabase';
import { ActivityLog } from '../../types/database';

const LOG_KEY = 'mango_activity';

export const activityService = {
  logActivity: async (userId: string, action: string, details?: any): Promise<void> => {
    const supabase = getSupabaseClient();
    
    // We don't await activity logs to prevent blocking UI
    if (supabase) {
      supabase.from('activity_logs').insert({ user_id: userId, action, details }).then(({ error }) => {
        if (error) console.warn("Failed to log activity remotely", error);
      });
      return;
    }

    const entry: ActivityLog = {
      id: crypto.randomUUID(),
      user_id: userId,
      action,
      details,
      created_at: new Date().toISOString()
    };

    try {
      const local = localStorage.getItem(LOG_KEY);
      const logs = local ? JSON.parse(local) : [];
      logs.unshift(entry);
      // Keep only last 50 logs locally
      localStorage.setItem(LOG_KEY, JSON.stringify(logs.slice(0, 50)));
    } catch (e) {
      console.warn("Failed to log activity locally", e);
    }
  },

  getRecentActivity: async (userId: string): Promise<ActivityLog[]> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      const { data } = await supabase
        .from('activity_logs')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(20);
      return data || [];
    }

    const local = localStorage.getItem(LOG_KEY);
    return local ? JSON.parse(local) : [];
  }
};
