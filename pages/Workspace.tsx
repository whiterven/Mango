
import React, { useState, useEffect } from 'react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { teamService, TeamMember } from '../services/teamService';

export const Workspace: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [team, setTeam] = useState<TeamMember[]>([]);
  const [inviteEmail, setInviteEmail] = useState('');

  useEffect(() => {
    setTeam(teamService.getTeam());
  }, []);

  const handleInvite = () => {
    if (inviteEmail) {
      teamService.inviteMember(inviteEmail, 'editor');
      setTeam(teamService.getTeam());
      setInviteEmail('');
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="sm" onClick={() => onNavigate('dashboard')} className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back
        </Button>
        <div>
            <h2 className="text-xl font-bold text-white">Team Workspace</h2>
            <p className="text-slate-500 text-sm">Manage access and collaborate with your team.</p>
        </div>
      </div>

      <Card title="Invite Members">
        <div className="flex gap-4">
          <Input 
            placeholder="colleague@company.com" 
            value={inviteEmail}
            onChange={e => setInviteEmail(e.target.value)}
          />
          <Button onClick={handleInvite} disabled={!inviteEmail}>Send Invite</Button>
        </div>
      </Card>

      <Card title="Team Members">
        <div className="space-y-4">
          {team.map(member => (
            <div key={member.id} className="flex items-center justify-between p-3 bg-slate-900/50 rounded border border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center font-bold text-white uppercase">
                  {member.name[0]}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-white">{member.name}</h4>
                  <p className="text-xs text-slate-500">{member.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xs uppercase font-bold text-slate-500 bg-slate-800 px-2 py-1 rounded">
                  {member.role}
                </span>
                {member.role !== 'owner' && (
                  <button 
                    onClick={() => {
                        teamService.removeMember(member.id);
                        setTeam(teamService.getTeam());
                    }}
                    className="text-red-400 text-xs hover:underline"
                  >
                    Remove
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
};
