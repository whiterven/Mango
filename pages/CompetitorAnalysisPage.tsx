
import React, { useState } from 'react';
import { CompetitorUpload } from '../components/CompetitorUpload';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { CompetitorAnalysis } from '../types';
import { useCampaignStore } from '../store/CampaignContext';
import { useToast } from '../store/ToastContext';

export const CompetitorAnalysisPage: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [saveName, setSaveName] = useState('');
  const { addCompetitor } = useCampaignStore();
  const toast = useToast();

  const handleAnalysisComplete = (img: string, result: CompetitorAnalysis) => {
    setImage(img);
    setAnalysis(result);
  };

  const handleClear = () => {
    setImage(null);
    setAnalysis(null);
    setSaveName('');
  };

  const handleSave = () => {
    if (!analysis || !saveName) {
        toast.error("Please provide a name for this competitor analysis.");
        return;
    }
    
    addCompetitor({
        id: crypto.randomUUID(),
        name: saveName,
        analysis: analysis,
        createdAt: Date.now(),
        imageUrl: image || undefined
    });
    
    toast.success("Competitor analysis saved to library.");
    setSaveName('');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
           <Button variant="secondary" size="sm" onClick={() => onNavigate('dashboard')} className="flex items-center gap-1">
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
              Back
           </Button>
           <div>
              <h2 className="text-xl font-bold text-white">Competitor Intelligence</h2>
              <p className="text-slate-500 text-sm">Deconstruct winning ads to find their psychological triggers.</p>
           </div>
        </div>
        <Button variant="outline" onClick={() => onNavigate('competitors')}>View Library</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
             <CompetitorUpload 
               onAnalysisComplete={handleAnalysisComplete} 
               onClear={handleClear}
               image={image}
               analysis={analysis}
             />
             
             {analysis && (
                 <div className="mt-4 space-y-4">
                     <div className="p-4 bg-brand-900/10 border border-brand-500/20 rounded-lg">
                         <h4 className="text-brand-400 text-xs font-bold uppercase mb-2">Strategic Pivot</h4>
                         <p className="text-sm text-slate-300 leading-relaxed">
                             {analysis.opportunityAngle}
                         </p>
                     </div>
                     
                     <div className="bg-slate-900 p-4 rounded-lg border border-slate-800">
                         <h4 className="text-xs font-bold text-slate-400 uppercase mb-2">Save to Library</h4>
                         <div className="flex gap-2">
                             <Input 
                                placeholder="e.g. Nike Black Friday Ad" 
                                value={saveName}
                                onChange={(e) => setSaveName(e.target.value)}
                                className="!py-1.5"
                             />
                             <Button onClick={handleSave} disabled={!saveName} size="sm">Save</Button>
                         </div>
                     </div>
                 </div>
             )}
        </div>

        {analysis ? (
             <div className="space-y-4">
                 <Card title="Ad DNA Deconstruction">
                     <div className="space-y-4">
                         <div>
                             <label className="text-[10px] font-bold text-slate-500 uppercase">Visual Style</label>
                             <p className="text-sm text-white">{analysis.visualStyle}</p>
                         </div>
                         <div>
                             <label className="text-[10px] font-bold text-slate-500 uppercase">Implied Hook</label>
                             <p className="text-sm text-white font-medium italic">"{analysis.detectedHook}"</p>
                         </div>
                     </div>
                 </Card>
                 
                 <Card title="Identified Weaknesses">
                     <ul className="space-y-2">
                         {analysis.weaknesses.map((weakness, i) => (
                             <li key={i} className="flex items-start gap-2 text-sm text-slate-300">
                                 <span className="text-red-400 mt-1">●</span>
                                 {weakness}
                             </li>
                         ))}
                     </ul>
                 </Card>
                 
                 <Button className="w-full" onClick={() => onNavigate('create')}>Use Strategy in New Campaign</Button>
             </div>
        ) : (
             <div className="h-full flex flex-col items-center justify-center p-8 border-2 border-dashed border-slate-800 rounded-xl text-slate-600">
                 <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                 </div>
                 <p className="text-sm">Upload an ad to reveal its secrets.</p>
             </div>
        )}
      </div>
    </div>
  );
};
