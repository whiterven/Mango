
import React from 'react';
import { Card } from '../ui/Card';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { name: 'Mon', score: 45 },
  { name: 'Tue', score: 62 },
  { name: 'Wed', score: 58 },
  { name: 'Thu', score: 81 },
  { name: 'Fri', score: 75 },
  { name: 'Sat', score: 88 },
  { name: 'Sun', score: 92 },
];

export const PerformanceChart: React.FC = () => {
  return (
    <Card title="Creative Performance Trend" className="h-full flex flex-col min-h-[320px]">
      <div className="flex-1 w-full mt-4 min-h-[200px]">
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
      </div>
      <div className="mt-6 flex justify-between items-center text-xs border-t border-slate-800 pt-4">
         <span className="text-slate-400 font-medium">Avg. Attention Score</span>
         <span className="text-brand-400 font-black text-xl">82.4</span>
      </div>
    </Card>
  );
};
