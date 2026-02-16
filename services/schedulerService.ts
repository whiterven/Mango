
import { Campaign } from "../types";

const KEY = 'mango_scheduled';

export interface ScheduledItem {
  id: string;
  campaignId: string;
  campaignName: string;
  scheduledFor: string; // ISO date string
  platform: string;
}

export const schedulerService = {
  scheduleCampaign: (campaign: Campaign, date: Date): ScheduledItem => {
    const items = schedulerService.getScheduledAds();
    const newItem: ScheduledItem = {
        id: crypto.randomUUID(),
        campaignId: campaign.id,
        campaignName: campaign.name,
        scheduledFor: date.toISOString(),
        platform: campaign.platform
    };
    items.push(newItem);
    // Sort by date
    items.sort((a, b) => new Date(a.scheduledFor).getTime() - new Date(b.scheduledFor).getTime());
    localStorage.setItem(KEY, JSON.stringify(items));
    return newItem;
  },

  getScheduledAds: (): ScheduledItem[] => {
    try {
      const data = localStorage.getItem(KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  },
  
  unschedule: (id: string) => {
    const items = schedulerService.getScheduledAds().filter(i => i.id !== id);
    localStorage.setItem(KEY, JSON.stringify(items));
  }
};
