
import React from 'react';
import { useCampaignStore } from '../store/CampaignContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { useToast } from '../store/ToastContext';

export const CompetitorLibrary: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const { competitors, deleteCompetitor } = useCampaignStore();
  const toast = useToast();

  const handleUse = () => {
      onNavigate('create');
      toast.info("Select this competitor from the dropdown in Step 1.");
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      <div className="flex justify-between items-end">
          <div>
              <h2 className="text-xl font-bold text-white">Competitor Library</h2>
              <p className="text-slate-500 text-sm">Saved strategic analyses for future campaigns.</p>
          </div>
          <Button onClick={() => onNavigate('competitor')}>Analyze New Ad</Button>
      </div>

      {competitors.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🕵️</div>
              <h3 className="text-white font-bold mb-2">No Saved Competitors</h3>
              <p className="text-slate-500 text-sm mb-6">Analyze competitor ads to build your intelligence library.</p>
              <Button onClick={() => onNavigate('competitor')} variant="secondary">Go to Spy Tool</Button>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {competitors.map(comp => (
                  <Card key={comp.id} className="relative group flex flex-col h-full">
                      <div className="flex justify-between items-start mb-4">
                          <h3 className="font-bold text-white text-sm line-clamp-1">{comp.name}</h3>
                          <button 
                             onClick={() => deleteCompetitor(comp.id)}
                             className="text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                          </button>
                      </div>

                      {comp.imageUrl && (
                          <div className="h-32 mb-4 bg-slate-900 rounded overflow-hidden relative">
                              <img src={comp.imageUrl} className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 to-transparent"></div>
                          </div>
                      )}

                      <div className="flex-1 space-y-3 mb-4">
                          <div className="bg-red-900/10 border border-red-900/20 p-2 rounded">
                              <label className="text-[9px] font-bold text-red-400 uppercase block mb-1">Their Weakness</label>
                              <p className="text-xs text-slate-300 line-clamp-2">{comp.analysis.weaknesses[0]}</p>
                          </div>
                          <div className="bg-green-900/10 border border-green-900/20 p-2 rounded">
                              <label className="text-[9px] font-bold text-green-400 uppercase block mb-1">Our Angle</label>
                              <p className="text-xs text-slate-300 line-clamp-3">{comp.analysis.opportunityAngle}</p>
                          </div>
                      </div>

                      <div className="pt-3 border-t border-slate-800 text-right">
                          <Button size="sm" variant="secondary" onClick={handleUse} className="w-full">Use in Campaign</Button>
                      </div>
                  </Card>
              ))}
          </div>
      )}
    </div>
  );
};
