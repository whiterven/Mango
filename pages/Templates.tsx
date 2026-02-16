import React from 'react';
import { Card } from '../components/ui/Card';
import { patterns } from '../data/adPatterns';

export const Templates: React.FC = () => {
  return (
    <div className="space-y-8">
       <div>
           <h2 className="text-xl font-bold text-white mb-4">Viral Pattern Library</h2>
           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
               {patterns.map(p => (
                   <Card key={p.id} className="hover:border-brand-500/50 transition-colors">
                       <div className="flex items-center justify-between mb-2">
                           <span className="text-[10px] uppercase font-bold text-brand-400 bg-brand-900/20 px-1.5 py-0.5 rounded">{p.category}</span>
                       </div>
                       <h3 className="font-bold text-white mb-2">{p.name}</h3>
                       <p className="text-xs text-slate-400 mb-3">{p.description}</p>
                       <div className="bg-slate-900 p-2 rounded text-[10px] text-slate-300 italic border border-slate-800">
                           "{p.example}"
                       </div>
                   </Card>
               ))}
           </div>
       </div>

       <div>
           <h2 className="text-xl font-bold text-white mb-4">Saved Prompt Templates</h2>
           <div className="bg-slate-900/50 rounded-lg p-8 text-center border border-slate-800">
               <p className="text-slate-500 text-sm">Save your best performing prompts here to reuse them later.</p>
           </div>
       </div>
    </div>
  );
};