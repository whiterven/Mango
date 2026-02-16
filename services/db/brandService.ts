
import { getSupabaseClient } from '../../lib/supabase';
import { BrandProfile } from '../../types';
import { mapBrandFromDb, mapBrandToDb } from './mappers';

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
          return data.map(b => mapBrandFromDb(b as any));
        }
      } catch (e) {
        console.warn("Supabase fetch failed", e);
      }
    }

    const local = localStorage.getItem(LOCAL_KEY);
    return local ? JSON.parse(local) : [];
  },

  saveBrand: async (brand: BrandProfile, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();

    // Local
    const local = localStorage.getItem(LOCAL_KEY);
    const brands: BrandProfile[] = local ? JSON.parse(local) : [];
    const idx = brands.findIndex(b => b.id === brand.id);
    if (idx >= 0) brands[idx] = brand;
    else brands.push(brand);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(brands));

    // Cloud
    if (supabase) {
      try {
        const dbBrand = mapBrandToDb(brand, userId);
        await supabase.from('brands').upsert(dbBrand);
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
      await supabase.from('brands').delete().eq('id', id);
    }
  }
};
