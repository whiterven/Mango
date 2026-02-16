import React from 'react';
import { Card } from './ui/Card';
import { GeneratedImage } from '../types';

interface Props {
  variantA: GeneratedImage;
  variantB: GeneratedImage;
}

export const ABTestSimulator: React.FC<Props> = ({ variantA, variantB }) => {
  // Mock prediction logic
  const scoreA = Math.floor(Math.random() * 30) + 60;
  const scoreB = Math.floor(Math.random() * 30) + 60;
  const winner = scoreA > scoreB ? 'Variant A' : 'Variant B';
  const uplift = Math.abs(scoreA - scoreB);

  return (
    <Card title="A/B Test Simulation" className="border-indigo-500/20">
      <div className="flex items-center justify-between mb-4 bg-indigo-900/20 p-3 rounded border border-indigo-500/30">
          <div>
              <h4 className="text-xs font-bold text-indigo-300 uppercase">Predicted Winner</h4>
              <p className="text-lg font-black text-white">{winner}</p>
          </div>
          <div className="text-right">
              <span className="text-xs text-slate-400">Est. CTR Uplift</span>
              <p className="text-lg font-bold text-green-400">+{uplift}%</p>
          </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
          <div className={`relative rounded-lg overflow-hidden border-2 ${scoreA > scoreB ? 'border-green-500' : 'border-transparent'}`}>
              <img src={variantA.url} className="w-full h-32 object-cover opacity-80" />
              <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-[10px] font-bold text-white">
                  Var A
              </div>
              <div className="absolute bottom-0 w-full bg-black/80 p-2">
                   <div className="flex justify-between text-[10px] text-slate-300">
                       <span>Win Prob</span>
                       <span className={scoreA > scoreB ? 'text-green-400 font-bold' : ''}>{scoreA}%</span>
                   </div>
                   <div className="w-full bg-slate-700 h-1 mt-1 rounded-full overflow-hidden">
                       <div className="bg-white h-full" style={{width: `${scoreA}%`}}></div>
                   </div>
              </div>
          </div>

          <div className={`relative rounded-lg overflow-hidden border-2 ${scoreB > scoreA ? 'border-green-500' : 'border-transparent'}`}>
              <img src={variantB.url} className="w-full h-32 object-cover opacity-80" />
              <div className="absolute top-2 left-2 bg-black/70 px-2 py-1 rounded text-[10px] font-bold text-white">
                  Var B
              </div>
              <div className="absolute bottom-0 w-full bg-black/80 p-2">
                   <div className="flex justify-between text-[10px] text-slate-300">
                       <span>Win Prob</span>
                       <span className={scoreB > scoreA ? 'text-green-400 font-bold' : ''}>{scoreB}%</span>
                   </div>
                   <div className="w-full bg-slate-700 h-1 mt-1 rounded-full overflow-hidden">
                       <div className="bg-white h-full" style={{width: `${scoreB}%`}}></div>
                   </div>
              </div>
          </div>
      </div>
    </Card>
  );
};