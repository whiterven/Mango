
import { getSupabaseClient } from '../lib/supabase';

export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
}

export const teamService = {
  getTeam: async (ownerId: string): Promise<TeamMember[]> => {
    const supabase = getSupabaseClient();
    if (!supabase) return [];

    const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('owner_id', ownerId);

    if (error) return [];

    return data.map((m: any) => ({
        id: m.id,
        name: m.name || m.email.split('@')[0],
        email: m.email,
        role: m.role as any
    }));
  },

  inviteMember: async (email: string, role: TeamMember['role'], ownerId: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;

    await supabase.from('team_members').insert({
        owner_id: ownerId,
        email,
        role,
        name: email.split('@')[0]
    });
  },

  removeMember: async (id: string) => {
    const supabase = getSupabaseClient();
    if (!supabase) return;
    await supabase.from('team_members').delete().eq('id', id);
  }
};
