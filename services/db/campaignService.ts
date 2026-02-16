
import { getSupabaseClient } from '../../lib/supabase';
import { Campaign, GeneratedImage } from '../../types';
import { mapCampaignFromDb, mapCampaignToDb, mapImageToDb } from './mappers';
import { storageService } from '../storageService';

const CAMPAIGN_KEY = 'mango_campaigns';

export const campaignService = {
  getCampaigns: async (userId: string): Promise<Campaign[]> => {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('campaigns')
          .select(`*, generated_images (*)`)
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        return data.map(c => mapCampaignFromDb(c as any, c.generated_images as any));
      } catch (e) {
        console.error("Supabase fetch error:", e);
      }
    }

    try {
      const local = localStorage.getItem(CAMPAIGN_KEY);
      return local ? JSON.parse(local) : [];
    } catch {
      return [];
    }
  },

  createCampaign: async (campaign: Campaign, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();

    // 1. Asset Pipeline: Upload images first
    const processedImages: GeneratedImage[] = [];
    for (const img of campaign.images) {
        // Create a unique path: userId/campaignId/timestamp.png
        const path = `${userId}/${campaign.id}/${img.id}.png`;
        const publicUrl = await storageService.upload(img.url, path);
        
        processedImages.push({
            ...img,
            url: publicUrl,
            storagePath: path
        });
    }
    
    // Update campaign with processed images (URLs instead of Base64)
    const processedCampaign = { ...campaign, images: processedImages };

    // 2. Save Locally (Optimistic)
    const local = localStorage.getItem(CAMPAIGN_KEY);
    const campaigns = local ? JSON.parse(local) : [];
    campaigns.unshift(processedCampaign);
    localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaigns));

    // 3. Sync to Cloud
    if (supabase) {
      try {
        const dbCampaign = mapCampaignToDb(processedCampaign, userId);
        const { error: campError } = await supabase.from('campaigns').upsert(dbCampaign);
        if (campError) throw campError;

        if (processedImages.length > 0) {
          const dbImages = processedImages.map(img => mapImageToDb(img, campaign.id, userId));
          const { error: imgError } = await supabase.from('generated_images').upsert(dbImages);
          if (imgError) throw imgError;
        }
      } catch (e) {
        console.error("Sync to Supabase failed:", e);
      }
    }
  },

  updateCampaign: async (campaign: Campaign, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();

    // 1. Save Locally
    const local = localStorage.getItem(CAMPAIGN_KEY);
    if (local) {
      const campaigns = JSON.parse(local).map((c: Campaign) => 
        c.id === campaign.id ? campaign : c
      );
      localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaigns));
    }

    // 2. Cloud Update
    if (supabase) {
      try {
        // Ensure new images are uploaded if they are Base64
        // Note: For a full update logic, we'd check each image. 
        // For simplicity, we assume the UI handles uploading via createCampaign for the main batch,
        // or specialized handlers for additions. 
        // If 'Results.tsx' calls this with a new Base64 image, we should ideally upload it here too.
        
        // Quick check for base64 images to upload on the fly
        const processedImages: GeneratedImage[] = [];
        for (const img of campaign.images) {
            if (img.url.startsWith('data:')) {
                const path = `${userId}/${campaign.id}/${img.id}.png`;
                const publicUrl = await storageService.upload(img.url, path);
                processedImages.push({ ...img, url: publicUrl, storagePath: path });
            } else {
                processedImages.push(img);
            }
        }
        
        const finalCampaign = { ...campaign, images: processedImages };
        const dbCampaign = mapCampaignToDb(finalCampaign, userId);
        
        const { error } = await supabase
          .from('campaigns')
          .update(dbCampaign)
          .eq('id', campaign.id);

        if (error) throw error;

        // Upsert images
        if (processedImages.length > 0) {
           const dbImages = processedImages.map(img => mapImageToDb(img, campaign.id, userId));
           await supabase.from('generated_images').upsert(dbImages);
        }
      } catch (e) {
        console.error("Update to Supabase failed:", e);
      }
    }
  },

  deleteCampaign: async (campaignId: string): Promise<void> => {
    const supabase = getSupabaseClient();

    // Local
    const local = localStorage.getItem(CAMPAIGN_KEY);
    if (local) {
      const campaigns = JSON.parse(local).filter((c: Campaign) => c.id !== campaignId);
      localStorage.setItem(CAMPAIGN_KEY, JSON.stringify(campaigns));
    }

    // Cloud
    if (supabase) {
      await supabase.from('campaigns').delete().eq('id', campaignId);
    }
  }
};
