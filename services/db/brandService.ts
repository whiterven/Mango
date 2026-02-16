
import { getSupabaseClient } from '../../lib/supabase';
import { BrandProfile } from '../../types';
import { mapBrandFromDb, mapBrandToDb } from './mappers';
import { storageService } from '../storageService';

const LOCAL_KEY = 'mango_brands';

export const brandService = {
  getBrands: async (userId: string): Promise<BrandProfile[]> => {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('brands')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) {
          const brands = data.map(b => mapBrandFromDb(b as any));
          // Sync to local for cache
          localStorage.setItem(LOCAL_KEY, JSON.stringify(brands));
          return brands;
        }
      } catch (e) {
        console.warn("Supabase fetch failed, using local cache", e);
      }
    }

    const local = localStorage.getItem(LOCAL_KEY);
    return local ? JSON.parse(local) : [];
  },

  saveBrand: async (brand: BrandProfile, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();
    
    // Handle Logo Upload if needed
    let processedBrand = { ...brand };
    if (brand.logo && brand.logo.startsWith('data:')) {
        // Upload base64 to storage to get a URL
        // Path: userId/brandId/logo.png
        const path = `${userId}/brands/${brand.id}/logo.png`;
        const logoUrl = await storageService.upload(
            brand.logo, 
            path
        );
        processedBrand.logo = logoUrl;
    }

    // 1. Save Local (Optimistic)
    const local = localStorage.getItem(LOCAL_KEY);
    const brands: BrandProfile[] = local ? JSON.parse(local) : [];
    const idx = brands.findIndex(b => b.id === brand.id);
    
    if (idx >= 0) brands[idx] = processedBrand;
    else brands.unshift(processedBrand); // Add to top
    
    localStorage.setItem(LOCAL_KEY, JSON.stringify(brands));

    // 2. Save Cloud
    if (supabase) {
      try {
        const dbBrand = mapBrandToDb(processedBrand, userId);
        const { error } = await supabase.from('brands').upsert(dbBrand);
        if (error) {
            console.error("Supabase save error:", error);
            // Optionally revert local change or show error toast via UI
        }
      } catch (e) {
        console.error("Save brand failed", e);
      }
    }
  },

  deleteBrand: async (id: string): Promise<void> => {
    const supabase = getSupabaseClient();

    // Local
    const local = localStorage.getItem(LOCAL_KEY);
    if (local) {
      const brands = JSON.parse(local).filter((b: BrandProfile) => b.id !== id);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(brands));
    }

    // Cloud
    if (supabase) {
      const { error } = await supabase.from('brands').delete().eq('id', id);
      if (error) console.error("Supabase delete error", error);
    }
  }
};
