
import { getSupabaseClient } from '../../lib/supabase';
import { CompetitorEntry } from '../../types';
import { mapCompetitorFromDb, mapCompetitorToDb } from './mappers';

const LOCAL_KEY = 'mango_competitors';

export const creativeService = {
  getCompetitors: async (userId: string): Promise<CompetitorEntry[]> => {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase
          .from('competitors')
          .select('*')
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (!error && data) return data.map(c => mapCompetitorFromDb(c as any));
      } catch (e) {
        console.warn("Supabase fetch failed", e);
      }
    }

    const local = localStorage.getItem(LOCAL_KEY);
    return local ? JSON.parse(local) : [];
  },

  saveCompetitor: async (comp: CompetitorEntry, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();

    // Local
    const local = localStorage.getItem(LOCAL_KEY);
    const list: CompetitorEntry[] = local ? JSON.parse(local) : [];
    const idx = list.findIndex(c => c.id === comp.id);
    if (idx >= 0) list[idx] = comp;
    else list.push(comp);
    localStorage.setItem(LOCAL_KEY, JSON.stringify(list));

    // Cloud
    if (supabase) {
      try {
        const dbComp = mapCompetitorToDb(comp, userId);
        await supabase.from('competitors').upsert(dbComp);
      } catch (e) {
        console.error("Save competitor failed", e);
      }
    }
  },

  deleteCompetitor: async (id: string): Promise<void> => {
    const supabase = getSupabaseClient();

    // Local
    const local = localStorage.getItem(LOCAL_KEY);
    if (local) {
      const list = JSON.parse(local).filter((c: CompetitorEntry) => c.id !== id);
      localStorage.setItem(LOCAL_KEY, JSON.stringify(list));
    }

    // Cloud
    if (supabase) {
      await supabase.from('competitors').delete().eq('id', id);
    }
  }
};
