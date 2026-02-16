
import React from 'react';
import { Card } from '../ui/Card';

export const PerformanceChart: React.FC = () => {
  // Mock Data: 7 days
  const data = [45, 62, 58, 81, 75, 88, 92];
  const max = 100;
  
  // Generate path
  const points = data.map((val, i) => {
    const x = (i / (data.length - 1)) * 100;
    const y = 100 - (val / max) * 100;
    return `${x},${y}`;
  }).join(' ');

  return (
    <Card title="Creative Performance Trend">
      <div className="h-32 w-full flex items-end gap-2 relative mt-4">
        <svg className="absolute inset-0 w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 100">
           {/* Gradient definition */}
           <defs>
             <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
               <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
               <stop offset="100%" stopColor="#f97316" stopOpacity="0" />
             </linearGradient>
           </defs>
           
           {/* Area */}
           <path d={`M0,100 ${points.split(' ').map(p => 'L' + p).join(' ')} L100,100 Z`} fill="url(#chartGradient)" />
           
           {/* Line */}
           <polyline points={points} fill="none" stroke="#f97316" strokeWidth="2" strokeLinecap="round" vectorEffect="non-scaling-stroke" />
           
           {/* Dots */}
           {data.map((val, i) => {
             const x = (i / (data.length - 1)) * 100;
             const y = 100 - (val / max) * 100;
             return (
               <circle key={i} cx={x} cy={y} r="1.5" fill="#fff" stroke="#f97316" strokeWidth="1" vectorEffect="non-scaling-stroke" />
             );
           })}
        </svg>
        
        {/* Labels overlay */}
        <div className="absolute bottom-0 w-full flex justify-between text-[9px] text-slate-500 pt-2 border-t border-slate-800">
           <span>Mon</span>
           <span>Tue</span>
           <span>Wed</span>
           <span>Thu</span>
           <span>Fri</span>
           <span>Sat</span>
           <span>Sun</span>
        </div>
      </div>
      <div className="mt-6 flex justify-between items-center text-xs">
         <span className="text-slate-400">Avg. Attention Score</span>
         <span className="text-brand-400 font-bold text-lg">82.4</span>
      </div>
    </Card>
  );
};
