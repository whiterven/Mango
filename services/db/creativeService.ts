
import { getSupabaseClient } from '../../lib/supabase';
import { CompetitorEntry } from '../../types';
import { mapCompetitorFromDb, mapCompetitorToDb } from './mappers';

export const creativeService = {
  getCompetitors: async (userId: string): Promise<CompetitorEntry[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    const { data, error } = await supabase
      .from('competitors')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data.map(c => mapCompetitorFromDb(c as any));
  },

  saveCompetitor: async (comp: CompetitorEntry, userId: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    const dbComp = mapCompetitorToDb(comp, userId);
    const { error } = await supabase.from('competitors').upsert(dbComp);
    if (error) throw error;
  },

  deleteCompetitor: async (id: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (!supabase) throw new Error("Database connection required");

    const { error } = await supabase.from('competitors').delete().eq('id', id);
    if (error) throw error;
  }
};
