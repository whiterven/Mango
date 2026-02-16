
export interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: 'owner' | 'editor' | 'viewer';
  avatar?: string;
}

const KEY = 'mango_team';

const DEFAULT_TEAM: TeamMember[] = [
  { id: 'u1', name: 'You', email: 'you@company.com', role: 'owner' },
];

export const teamService = {
  getTeam: (): TeamMember[] => {
    try {
      const data = localStorage.getItem(KEY);
      return data ? JSON.parse(data) : DEFAULT_TEAM;
    } catch {
      return DEFAULT_TEAM;
    }
  },

  inviteMember: (email: string, role: TeamMember['role']) => {
    const team = teamService.getTeam();
    team.push({
      id: crypto.randomUUID(),
      name: email.split('@')[0], // Mock name
      email,
      role
    });
    localStorage.setItem(KEY, JSON.stringify(team));
  },

  removeMember: (id: string) => {
    const team = teamService.getTeam().filter(m => m.id !== id);
    localStorage.setItem(KEY, JSON.stringify(team));
  }
};
