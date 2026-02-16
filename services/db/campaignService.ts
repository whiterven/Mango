
import { getSupabaseClient } from '../../lib/supabase';
import { Campaign, GeneratedImage } from '../../types';
import { mapCampaignFromDb, mapCampaignToDb, mapImageToDb } from './mappers';
import { storageService } from '../storageService';

export const campaignService = {
  getCampaigns: async (userId: string): Promise<Campaign[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    const { data, error } = await supabase
      .from('campaigns')
      .select(`*, generated_images (*)`)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(c => mapCampaignFromDb(c as any, c.generated_images as any));
  },

  createCampaign: async (campaign: Campaign, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    // 1. Asset Pipeline: Upload images first
    const processedImages: GeneratedImage[] = [];
    for (const img of campaign.images) {
        // Create a unique path: userId/campaignId/timestamp.png
        const path = `${userId}/${campaign.id}/${img.id}.png`;
        
        // Ensure we upload to Supabase Storage
        let publicUrl = img.url;
        if (img.url.startsWith('data:')) {
             publicUrl = await storageService.upload(img.url, path);
        }
        
        processedImages.push({
            ...img,
            url: publicUrl,
            storagePath: path
        });
    }
    
    // Update campaign with processed images (URLs instead of Base64)
    const processedCampaign = { ...campaign, images: processedImages };

    // 2. Sync to Cloud
    const dbCampaign = mapCampaignToDb(processedCampaign, userId);
    const { error: campError } = await supabase.from('campaigns').upsert(dbCampaign);
    if (campError) throw campError;

    if (processedImages.length > 0) {
      const dbImages = processedImages.map(img => mapImageToDb(img, campaign.id, userId));
      const { error: imgError } = await supabase.from('generated_images').upsert(dbImages);
      if (imgError) throw imgError;
    }
  },

  updateCampaign: async (campaign: Campaign, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    // Check for base64 images to upload on the fly
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
  },

  deleteCampaign: async (campaignId: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    const { error } = await supabase.from('campaigns').delete().eq('id', campaignId);
    if (error) throw error;
  },

  deleteImage: async (imageId: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    // Attempt to delete from storage first if path exists
    const { data: img } = await supabase
        .from('generated_images')
        .select('storage_path')
        .eq('id', imageId)
        .single();

    if (img?.storage_path) {
        await storageService.delete(img.storage_path);
    }

    const { error } = await supabase.from('generated_images').delete().eq('id', imageId);
    if (error) throw error;
  }
};
