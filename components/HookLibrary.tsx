
import React, { useState } from 'react';
import { adHooks, AdHook } from '../data/hooks';
import { Card } from './ui/Card';
import { Badge } from './ui/Badge';

export const HookLibrary: React.FC = () => {
  const [filter, setFilter] = useState<AdHook['category'] | 'all'>('all');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const filteredHooks = filter === 'all' ? adHooks : adHooks.filter(h => h.category === filter);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div className="flex gap-2 overflow-x-auto pb-2">
        {['all', 'fear', 'curiosity', 'benefit', 'social_proof', 'urgency'].map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat as any)}
            className={`px-3 py-1.5 rounded-full text-xs font-bold uppercase transition-colors whitespace-nowrap ${
              filter === cat 
                ? 'bg-brand-500 text-white' 
                : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
            }`}
          >
            {cat.replace('_', ' ')}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredHooks.map(hook => (
          <div 
            key={hook.id} 
            onClick={() => handleCopy(hook.id, hook.text)}
            className="bg-slate-900 border border-slate-800 p-4 rounded-xl cursor-pointer hover:border-brand-500/50 hover:bg-slate-800 transition-all group relative"
          >
            <div className="flex justify-between items-start mb-2">
              <Badge color="brand">{hook.category}</Badge>
              <span className="text-[10px] text-green-400 font-mono font-bold">Score: {hook.performanceScore}</span>
            </div>
            <p className="text-sm text-white font-medium pr-8">"{hook.text}"</p>
            
            <div className="absolute right-4 bottom-4 opacity-0 group-hover:opacity-100 transition-opacity">
               <span className="text-[10px] bg-white text-black px-2 py-1 rounded font-bold">
                 {copiedId === hook.id ? 'Copied!' : 'Copy'}
               </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
