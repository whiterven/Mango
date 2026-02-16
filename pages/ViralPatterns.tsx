
import React, { useState } from 'react';
import { patterns } from '../data/adPatterns';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const ViralPatterns: React.FC = () => {
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-xl font-bold text-white">Viral Pattern Explorer</h2>
        <p className="text-slate-500 text-sm">Proven visual frameworks that stop the scroll.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Pattern List */}
        <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
          {patterns.map(p => (
            <Card 
              key={p.id} 
              className={`cursor-pointer transition-all hover:-translate-y-1 ${selectedPattern === p.id ? 'border-brand-500 ring-1 ring-brand-500 bg-slate-800' : 'hover:border-slate-600'}`}
            >
              <div onClick={() => setSelectedPattern(p.id)}>
                <div className="flex justify-between items-start mb-3">
                   <span className={`text-[10px] font-bold px-2 py-1 rounded uppercase ${
                     p.category === 'visual' ? 'bg-purple-900/30 text-purple-400' :
                     p.category === 'hook' ? 'bg-blue-900/30 text-blue-400' :
                     'bg-orange-900/30 text-orange-400'
                   }`}>{p.category}</span>
                </div>
                <h3 className="font-bold text-white mb-2">{p.name}</h3>
                <p className="text-xs text-slate-400 line-clamp-2">{p.description}</p>
              </div>
            </Card>
          ))}
        </div>

        {/* Detail View */}
        <div className="lg:col-span-1">
          <div className="sticky top-6">
            {selectedPattern ? (
              (() => {
                const p = patterns.find(pat => pat.id === selectedPattern)!;
                return (
                  <Card className="border-brand-500/30 bg-slate-900/90 backdrop-blur">
                    <h3 className="text-lg font-black text-white mb-4">{p.name}</h3>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="text-[10px] font-bold text-slate-500 uppercase">The Concept</label>
                        <p className="text-sm text-slate-300 mt-1">{p.description}</p>
                      </div>

                      <div className="bg-black/30 p-4 rounded-lg border border-slate-800">
                        <label className="text-[10px] font-bold text-brand-400 uppercase mb-2 block">Real World Example</label>
                        <p className="text-sm text-white italic">"{p.example}"</p>
                      </div>

                      <Button className="w-full">Use this Pattern</Button>
                    </div>
                  </Card>
                );
              })()
            ) : (
              <div className="h-64 flex items-center justify-center border-2 border-dashed border-slate-800 rounded-xl text-slate-600 text-sm">
                Select a pattern to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
