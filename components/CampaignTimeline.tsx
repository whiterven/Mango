import React from 'react';
import { CampaignStatus } from '../types';

export const CampaignTimeline: React.FC<{ status: CampaignStatus, createdAt: number }> = ({ status, createdAt }) => {
  const stages = ['draft', 'planning', 'directing', 'generating', 'completed'];
  const currentIndex = stages.indexOf(status);

  return (
    <div className="bg-slate-900/30 p-4 rounded-lg border border-slate-800">
       <div className="flex justify-between items-center mb-2">
           <span className="text-[10px] text-slate-500 font-mono">ID: {createdAt}</span>
           <span className="text-[10px] text-brand-400 font-bold uppercase">{status}</span>
       </div>
       <div className="relative pt-2">
          <div className="absolute top-2.5 left-0 w-full h-0.5 bg-slate-800"></div>
          <div className="flex justify-between relative">
              {stages.map((stage, i) => (
                  <div key={stage} className="flex flex-col items-center">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center z-10 text-[8px] transition-colors ${
                          i <= currentIndex ? 'bg-brand-500 text-white' : 'bg-slate-800 text-slate-500 border border-slate-700'
                      }`}>
                          {i <= currentIndex ? '✓' : i + 1}
                      </div>
                      <span className={`text-[9px] mt-1.5 uppercase ${
                          i === currentIndex ? 'text-white font-bold' : 'text-slate-600'
                      }`}>{stage}</span>
                  </div>
              ))}
          </div>
       </div>
    </div>
  );
};