
import React, { useMemo } from 'react';
import { Card } from '../ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useCampaignStore } from '../../store/CampaignContext';

export const PerformanceChart: React.FC = () => {
  const { campaigns } = useCampaignStore();

  const data = useMemo(() => {
      // Sort campaigns by date (oldest first for chart)
      const sorted = [...campaigns].sort((a, b) => a.createdAt - b.createdAt);
      
      // Map to chart format, filtering out those without scores
      // Taking the last 15 campaigns to show trend
      return sorted
        .filter(c => c.directorOutput?.creativeStrength?.overall)
        .map(c => ({
            name: new Date(c.createdAt).toLocaleDateString(undefined, { day: 'numeric', month: 'short' }),
            score: c.directorOutput?.creativeStrength.overall || 0,
            campaign: c.name
        }))
        .slice(-15);
  }, [campaigns]);

  const avgScore = useMemo(() => {
      if (data.length === 0) return 0;
      const sum = data.reduce((acc, curr) => acc + curr.score, 0);
      return (sum / data.length).toFixed(1);
  }, [data]);

  return (
    <Card title="Creative Performance Trend" className="h-full flex flex-col min-h-[320px]">
      <div className="flex-1 w-full mt-4 min-h-[200px]">
        {data.length > 1 ? (
            <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#f97316" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#334155" opacity={0.3} />
                <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 10 }} 
                dy={10}
                />
                <YAxis 
                hide 
                domain={[0, 100]} 
                />
                <Tooltip 
                contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155', borderRadius: '8px', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}
                itemStyle={{ color: '#f97316' }}
                labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
                cursor={{ stroke: '#475569', strokeDasharray: '3 3' }}
                />
                <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#f97316" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
                activeDot={{ r: 6, strokeWidth: 0, fill: '#fff' }}
                />
            </AreaChart>
            </ResponsiveContainer>
        ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-4 border border-dashed border-slate-800 rounded-lg">
                <span className="text-2xl mb-2">📊</span>
                <p className="text-xs text-slate-500">
                    {data.length === 0 
                     ? "Launch your first campaign to see performance trends." 
                     : "Launch more campaigns to build a trend line."}
                </p>
            </div>
        )}
      </div>
      <div className="mt-6 flex justify-between items-center text-xs border-t border-slate-800 pt-4">
         <span className="text-slate-400 font-medium">Avg. Attention Score</span>
         <span className="text-brand-400 font-black text-xl">{avgScore}</span>
      </div>
    </Card>
  );
};
