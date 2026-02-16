
import React, { useEffect, useState } from 'react';
import { Card } from '../ui/Card';
import { activityService } from '../../services/db/activityService';
import { useAuth } from '../../hooks/useAuth';
import { ActivityLog } from '../../types/database';

export const RecentActivity: React.FC = () => {
  const { user } = useAuth();
  const [activities, setActivities] = useState<ActivityLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
        activityService.getRecentActivity(user.id)
            .then(setActivities)
            .finally(() => setLoading(false));
    }
  }, [user]);

  const getIcon = (action: string) => {
      if (action.includes('Campaign')) return '🎨';
      if (action.includes('Competitor')) return '🕵️';
      if (action.includes('Brand')) return '🧬';
      if (action.includes('Credit') || action.includes('Subscription')) return '⚡';
      return '📝';
  };

  return (
    <Card title="Recent Activity">
      <div className="relative border-l border-slate-800 ml-3 space-y-6 my-2 min-h-[200px]">
        {loading ? (
            <div className="pl-6 text-xs text-slate-500">Loading activity...</div>
        ) : activities.length === 0 ? (
            <div className="pl-6 pt-2">
                <p className="text-xs text-slate-500">No recent activity found.</p>
                <p className="text-[10px] text-slate-600">Actions you take will appear here.</p>
            </div>
        ) : (
            activities.map((act) => (
            <div key={act.id} className="ml-6 relative animate-in fade-in slide-in-from-left-2 duration-300">
                <span className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-xs shadow-sm">
                {getIcon(act.action)}
                </span>
                <p className="text-xs text-white font-medium">{act.action}</p>
                <p className="text-[10px] text-slate-500 mt-0.5 font-mono">
                    {new Date(act.created_at).toLocaleDateString()} • {new Date(act.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </p>
            </div>
            ))
        )}
      </div>
    </Card>
  );
};
