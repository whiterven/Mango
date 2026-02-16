
import React from 'react';
import { Card } from '../ui/Card';

export const RecentActivity: React.FC = () => {
  const activities = [
    { type: 'gen', text: 'Generated 5 variations for "Neon Drink"', time: '2 mins ago', icon: '🎨' },
    { type: 'spy', text: 'Competitor analysis completed for Nike', time: '1 hour ago', icon: '🕵️' },
    { type: 'brand', text: 'New Brand Kit "Summer Vibes" created', time: '4 hours ago', icon: '🧬' },
    { type: 'sys', text: 'Weekly credits refreshed', time: '1 day ago', icon: '⚡' },
  ];

  return (
    <Card title="Recent Activity">
      <div className="relative border-l border-slate-800 ml-3 space-y-6 my-2">
        {activities.map((act, i) => (
          <div key={i} className="ml-6 relative">
            <span className="absolute -left-[31px] top-0 flex h-6 w-6 items-center justify-center rounded-full bg-slate-900 border border-slate-700 text-xs shadow-sm">
              {act.icon}
            </span>
            <p className="text-xs text-white font-medium">{act.text}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">{act.time}</p>
          </div>
        ))}
      </div>
    </Card>
  );
};
