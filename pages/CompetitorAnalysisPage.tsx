import React, { useState } from 'react';
import { CompetitorUpload } from '../components/CompetitorUpload';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { CompetitorAnalysis } from '../types';

export const CompetitorAnalysisPage: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  const [image, setImage] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<CompetitorAnalysis | null>(null);

  const handleAnalysisComplete = (img: string, result: CompetitorAnalysis) => {
    setImage(img);
    setAnalysis(result);
  };

  const handleClear = () => {
    setImage(null);
    setAnalysis(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <div>
           <h2 className="text-xl font-bold text-white">Competitor Intelligence</h2>
           <p className="text-slate-500 text-sm">Deconstruct winning ads to find their psychological triggers.</p>
        </div>
        {analysis && (
            <Button onClick={() => onNavigate('create')}>Use Strategy in New Campaign</Button>
        )}
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
                 <div className="mt-4 p-4 bg-brand-900/10 border border-brand-500/20 rounded-lg">
                     <h4 className="text-brand-400 text-xs font-bold uppercase mb-2">Strategic Pivot</h4>
                     <p className="text-sm text-slate-300 leading-relaxed">
                         {analysis.opportunityAngle}
                     </p>
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