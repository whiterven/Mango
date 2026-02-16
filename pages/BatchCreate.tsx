
import React from 'react';
import { BatchGenerator } from '../components/BatchGenerator';
import { Button } from '../components/ui/Button';

export const BatchCreate: React.FC<{ onNavigate: (view: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="secondary" size="sm" onClick={() => onNavigate('dashboard')} className="flex items-center gap-1">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            Back
        </Button>
        <div>
            <h2 className="text-xl font-bold text-white">Batch Ad Generator</h2>
            <p className="text-slate-500 text-sm">Generate concepts for multiple products or angles simultaneously.</p>
        </div>
      </div>
      
      <BatchGenerator />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
         <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
             <h4 className="text-brand-400 font-bold text-sm mb-2">Bulk Speed</h4>
             <p className="text-xs text-slate-400">Generates 5x faster than single mode by parallel processing.</p>
         </div>
         <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
             <h4 className="text-brand-400 font-bold text-sm mb-2">Unified Style</h4>
             <p className="text-xs text-slate-400">Apply one Brand Kit to all products for consistent look.</p>
         </div>
         <div className="p-4 bg-slate-900/50 border border-slate-700 rounded-lg">
             <h4 className="text-brand-400 font-bold text-sm mb-2">CSV Export</h4>
             <p className="text-xs text-slate-400">Download all ad copy and image links in one CSV file.</p>
         </div>
      </div>
    </div>
  );
};
