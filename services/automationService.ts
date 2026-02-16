
import { getSupabaseClient } from '../lib/supabase';

export interface AutoGenConfig {
  id: string;
  brandId: string;
  frequency: 'daily' | 'weekly' | 'monthly';
  productName: string;
  active: boolean;
  lastRun: number;
}

export const automationService = {
  getConfigs: async (userId: string): Promise<AutoGenConfig[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('automation_configs')
        .select('*')
        .eq('user_id', userId);

    if (error) return [];

    return data.map((c: any) => ({
        id: c.id,
        brandId: c.brand_id,
        productName: c.product_name,
        frequency: c.frequency,
        active: c.active,
        lastRun: Number(c.last_run)
    }));
  },

  addConfig: async (config: Omit<AutoGenConfig, 'id' | 'lastRun'>, userId: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase.from('automation_configs').insert({
        user_id: userId,
        brand_id: config.brandId,
        product_name: config.productName,
        frequency: config.frequency,
        active: config.active,
        last_run: 0
    });
  },

  toggleConfig: async (id: string, currentState: boolean) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase
        .from('automation_configs')
        .update({ active: !currentState })
        .eq('id', id);
  },

  deleteConfig: async (id: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.from('automation_configs').delete().eq('id', id);
  }
};
