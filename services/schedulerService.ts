
import { getSupabaseClient } from '../lib/supabase';
import { Campaign } from "../types";

export interface ScheduledItem {
  id: string;
  campaignId: string;
  campaignName: string;
  scheduledFor: string; // ISO date string
  platform: string;
}

export const schedulerService = {
  scheduleCampaign: async (campaign: Campaign, date: Date, userId: string): Promise<ScheduledItem | null> => {
    const supabase = getSupabaseClient();
    if (!supabase) return null;

    const payload = {
        user_id: userId,
        campaign_id: campaign.id,
        platform: campaign.platform,
        scheduled_for: date.toISOString()
    };

    const { data, error } = await supabase
        .from('scheduled_ads')
        .insert(payload)
        .select()
        .single();

    if (error) {
        console.error("Scheduling failed", error);
        return null;
    }

    return {
        id: data.id,
        campaignId: data.campaign_id,
        campaignName: campaign.name,
        scheduledFor: data.scheduled_for,
        platform: data.platform
    };
  },

  getScheduledAds: async (userId: string): Promise<ScheduledItem[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    // Join with campaigns to get the name
    const { data, error } = await supabase
        .from('scheduled_ads')
        .select(`
            id,
            campaign_id,
            scheduled_for,
            platform,
            campaigns (name)
        `)
        .eq('user_id', userId)
        .order('scheduled_for', { ascending: true });

    if (error) {
        console.error("Fetch scheduled ads failed", error);
        return [];
    }

    return data.map((item: any) => ({
        id: item.id,
        campaignId: item.campaign_id,
        campaignName: item.campaigns?.name || 'Unknown Campaign',
        scheduledFor: item.scheduled_for,
        platform: item.platform
    }));
  },
  
  unschedule: async (id: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.from('scheduled_ads').delete().eq('id', id);
  }
};
