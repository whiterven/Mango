import React, { useRef, useState } from 'react';
import { fileToBase64 } from '../services/geminiService';
import { competitorAgent } from '../agents/competitorAgent';
import { CompetitorAnalysis } from '../types';
import { Input } from './ui/Input';
import { Button } from './ui/Button';

interface Props {
  onAnalysisComplete: (image: string, analysis: CompetitorAnalysis) => void;
  onClear: () => void;
  image: string | null;
  analysis: CompetitorAnalysis | null;
}

export const CompetitorUpload: React.FC<Props> = ({ onAnalysisComplete, onClear, image, analysis }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mode, setMode] = useState<'upload' | 'url'>('upload');
  const [url, setUrl] = useState('');

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setLoading(true);
      setError(null);
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        const result = await competitorAgent(base64, 'image');
        onAnalysisComplete(base64, result);
      } catch (err) {
        console.error(err);
        setError("Failed to analyze image. Please try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  const handleUrlAnalyze = async () => {
    if (!url) return;
    setLoading(true);
    setError(null);
    try {
      // Pass a placeholder image for the URL mode or handle strictly as metadata
      const result = await competitorAgent(url, 'url');
      // For URL mode, we don't have an image to display, so we pass a placeholder or null
      // Re-using the image prop to store the URL context if needed, or just ""
      onAnalysisComplete("", result); 
    } catch (err) {
      console.error(err);
      setError("Failed to analyze URL. Ensure it is accessible.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-900/50 p-4 rounded-lg border border-slate-700/50">
      <div className="flex justify-between items-center mb-3">
         <h4 className="text-xs font-bold text-slate-400 uppercase">Competitor Intelligence</h4>
         <div className="flex bg-slate-800 rounded p-0.5">
            <button 
               onClick={() => setMode('upload')}
               className={`px-2 py-0.5 text-[10px] rounded ${mode === 'upload' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
            >Image</button>
            <button 
               onClick={() => setMode('url')}
               className={`px-2 py-0.5 text-[10px] rounded ${mode === 'url' ? 'bg-brand-600 text-white' : 'text-slate-400'}`}
            >Link</button>
         </div>
      </div>

      <input 
        type="file" 
        accept="image/*" 
        className="hidden" 
        ref={fileInputRef}
        onChange={handleUpload}
      />
      
      {!analysis ? (
        mode === 'upload' ? (
            <div 
            onClick={() => !loading && fileInputRef.current?.click()}
            className={`border-2 border-dashed border-slate-700 rounded-lg p-6 text-center cursor-pointer hover:border-brand-500/50 transition-colors ${loading ? 'opacity-50 cursor-wait' : ''}`}
            >
            {loading ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                    <div className="text-xs text-brand-400 animate-pulse">Deconstructing Visuals...</div>
                </div>
            ) : (
                <>
                <div className="text-xs text-slate-500">Click to Upload Ad Image</div>
                <div className="text-[10px] text-slate-600 mt-1">AI will find weaknesses</div>
                </>
            )}
            </div>
        ) : (
            <div className="space-y-2">
                <Input 
                   placeholder="https://competitor.com/landing-page" 
                   value={url} 
                   onChange={(e) => setUrl(e.target.value)}
                   className="text-xs"
                />
                <Button 
                   onClick={handleUrlAnalyze} 
                   isLoading={loading} 
                   className="w-full" 
                   size="sm"
                   disabled={!url}
                >
                   Analyze Strategy
                </Button>
            </div>
        )
      ) : (
          <div className="relative group">
            {image ? (
                <img src={`data:image/jpeg;base64,${image}`} className="w-full h-32 object-cover rounded-lg opacity-50 transition-opacity group-hover:opacity-30" />
            ) : (
                <div className="w-full h-32 bg-slate-800 rounded-lg flex items-center justify-center border border-slate-700">
                    <div className="text-center px-4">
                        <span className="text-xs text-brand-400 font-bold block mb-1">URL Analyzed</span>
                        <span className="text-[10px] text-slate-500 truncate block max-w-[200px]">{url}</span>
                    </div>
                </div>
            )}
            
            <div className="absolute inset-0 flex items-center justify-center p-2">
                <div className="bg-black/80 p-2 rounded text-[10px] text-green-400 border border-green-900 shadow-lg backdrop-blur-sm">
                    ✓ Opportunity: {analysis.opportunityAngle.substring(0, 40)}...
                </div>
            </div>
            <button 
                onClick={onClear} 
                className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md transition-colors"
            >
                ×
            </button>
          </div>
      )}
      {error && <p className="text-[10px] text-red-400 mt-2 text-center">{error}</p>}
    </div>
  );
};