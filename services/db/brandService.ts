
import { getSupabaseClient } from '../../lib/supabase';
import { BrandProfile } from '../../types';
import { mapBrandFromDb, mapBrandToDb } from './mappers';
import { storageService } from '../storageService';

export const brandService = {
  getBrands: async (userId: string): Promise<BrandProfile[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    const { data, error } = await supabase
      .from('brands')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(b => mapBrandFromDb(b as any));
  },

  saveBrand: async (brand: BrandProfile, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");
    
    // Handle Logo Upload if needed
    let processedBrand = { ...brand };
    if (brand.logo && brand.logo.startsWith('data:')) {
        const path = `${userId}/brands/${brand.id}/logo.png`;
        const logoUrl = await storageService.upload(brand.logo, path);
        processedBrand.logo = logoUrl;
    }

    const dbBrand = mapBrandToDb(processedBrand, userId);
    const { error } = await supabase.from('brands').upsert(dbBrand);
    if (error) throw error;
  },

  deleteBrand: async (id: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    const { error } = await supabase.from('brands').delete().eq('id', id);
    if (error) throw error;
  }
};
