
import React, { useState } from 'react';
import { useCampaignStore } from '../store/CampaignContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { PerformanceScore } from '../components/PerformanceScore';
import { CopyPanel } from '../components/CopyPanel';
import { directorAgent } from '../agents/directorAgent';
import { imageAgent } from '../agents/imageAgent';
import { AspectRatio } from '../types';
import { useToast } from '../store/ToastContext';

interface ResultsProps {
  campaignId: string;
  onNavigate: (view: string) => void;
}

export const Results: React.FC<ResultsProps> = ({ campaignId, onNavigate }) => {
  const { campaigns, updateCampaign } = useCampaignStore();
  const campaign = campaigns.find(c => c.id === campaignId);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [showRegenMenu, setShowRegenMenu] = useState(false);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const toast = useToast();

  if (!campaign) return <div>Campaign not found</div>;

  const handleRegenerate = async (feedback: string) => {
      setShowRegenMenu(false);
      setIsRegenerating(true);
      toast.info("Regenerating creative variant...");
      
      try {
          if (!campaign.plannerOutput) throw new Error("Missing planner data");

          // 1. Re-run Director with feedback
          const newDirectorOutput = await directorAgent(
              campaign.plannerOutput, 
              campaign.platform, 
              1, 
              feedback,
              campaign.creativeControls // Persist styles
          );

          // 2. Generate Image
          const imgUrl = await imageAgent(newDirectorOutput.technicalPrompt, campaign.aspectRatio as AspectRatio, '1K');

          const newImage = {
              id: crypto.randomUUID(),
              url: imgUrl,
              prompt: newDirectorOutput.technicalPrompt,
              aspectRatio: campaign.aspectRatio as AspectRatio,
              createdAt: Date.now()
          };

          // 3. Update Campaign
          const updatedCampaign = {
              ...campaign,
              images: [newImage, ...campaign.images], 
              directorOutput: newDirectorOutput 
          };
          updateCampaign(updatedCampaign);
          toast.success("New variation generated!");

      } catch (e) {
          console.error("Regeneration failed", e);
          toast.error("Regeneration failed. Please try again.");
      } finally {
          setIsRegenerating(false);
      }
  };

  const handleExport = (platform: string) => {
      toast.info(`Preparing ${platform} package zip download... (Simulated)`);
      setShowExportMenu(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex justify-between items-center mb-6 relative">
          <div className="flex items-center gap-4">
              <Button variant="secondary" size="sm" onClick={() => onNavigate('dashboard')} className="flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
                  Back
              </Button>
              <div>
                  <h2 className="text-xl font-bold text-white">{campaign.name}</h2>
                  <p className="text-slate-500 text-xs">Generated on {new Date(campaign.createdAt).toLocaleDateString()}</p>
              </div>
          </div>
          <div className="flex gap-2 relative">
              <div className="relative">
                  <Button variant="outline" size="sm" onClick={() => setShowRegenMenu(!showRegenMenu)} isLoading={isRegenerating}>
                      ✨ Regenerate
                  </Button>
                  {showRegenMenu && (
                      <div className="absolute top-full right-0 mt-2 w-48 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
                          <div className="p-2 text-[10px] text-slate-500 font-bold uppercase bg-slate-900/50 border-b border-slate-700">Select Direction</div>
                          <button onClick={() => handleRegenerate("Make it more Luxurious & Minimalist")} className="w-full text-left px-3 py-2 hover:bg-slate-700 text-xs text-white border-b border-slate-700/50">💎 More Luxury</button>
                          <button onClick={() => handleRegenerate("Make it more Urgent & High Contrast")} className="w-full text-left px-3 py-2 hover:bg-slate-700 text-xs text-white border-b border-slate-700/50">🔥 More Urgency</button>
                          <button onClick={() => handleRegenerate("Try a completely different camera angle")} className="w-full text-left px-3 py-2 hover:bg-slate-700 text-xs text-white border-b border-slate-700/50">📸 Different Angle</button>
                          <button onClick={() => handleRegenerate("Make it darker and moody")} className="w-full text-left px-3 py-2 hover:bg-slate-700 text-xs text-white">🌙 Dark & Moody</button>
                      </div>
                  )}
              </div>
              
              <div className="relative">
                  <Button size="sm" onClick={() => setShowExportMenu(!showExportMenu)}>Download Package</Button>
                  {showExportMenu && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-20 overflow-hidden">
                          <div className="p-2 text-[10px] text-slate-500 font-bold uppercase bg-slate-900/50 border-b border-slate-700">Export All Assets</div>
                          <button onClick={() => handleExport('Facebook')} className="w-full text-left px-3 py-2 hover:bg-slate-700 text-xs text-white flex items-center justify-between border-b border-slate-700/50">
                              <span>Facebook Ads (1:1)</span>
                              <span className="text-[10px] text-slate-500">ZIP</span>
                          </button>
                          <button onClick={() => handleExport('Instagram')} className="w-full text-left px-3 py-2 hover:bg-slate-700 text-xs text-white flex items-center justify-between border-b border-slate-700/50">
                              <span>Instagram Story (9:16)</span>
                              <span className="text-[10px] text-slate-500">ZIP</span>
                          </button>
                          <button onClick={() => handleExport('TikTok')} className="w-full text-left px-3 py-2 hover:bg-slate-700 text-xs text-white flex items-center justify-between">
                              <span>TikTok Video (MP4)</span>
                              <span className="text-[10px] text-slate-500">PRO</span>
                          </button>
                      </div>
                  )}
              </div>
          </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Visuals - Grid Layout for Variations */}
          <div className="flex-1">
               <h3 className="text-sm font-bold mb-3 flex items-center gap-2 text-slate-300">
                 Generated Variations
                 <span className="text-[10px] bg-brand-900/50 text-brand-300 px-1.5 py-0.5 rounded-full">{campaign.images.length}</span>
               </h3>
               
               {isRegenerating && (
                   <div className="mb-4 p-4 bg-slate-800/50 border border-brand-500/30 rounded-lg flex items-center justify-center gap-3 animate-pulse">
                       <div className="w-5 h-5 border-2 border-brand-500 border-t-transparent rounded-full animate-spin"></div>
                       <span className="text-brand-400 text-xs font-medium">Creative Director is refining the concept...</span>
                   </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaign.images.map((img, idx) => (
                      <div key={img.id} className="bg-slate-800/30 rounded-lg border border-slate-700/50 p-2 hover:border-brand-500/30 transition-colors group">
                          <div className="relative aspect-auto bg-black rounded overflow-hidden mb-2">
                              <img src={img.url} className="w-full h-auto object-contain" alt={`Variation ${idx + 1}`} />
                              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                  <a href={img.url} download className="bg-white/90 hover:bg-white text-black text-[10px] font-bold py-1.5 px-3 rounded-full shadow-lg">Download PNG</a>
                              </div>
                          </div>
                          <div className="flex justify-between items-center px-1">
                             <span className="text-[10px] font-mono text-slate-500">
                                 {idx === 0 && isRegenerating ? 'Generating...' : `Var ${campaign.images.length - idx}`}
                             </span>
                             <span className="text-[10px] text-brand-400 border border-brand-900/50 bg-brand-900/20 px-1.5 py-0.5 rounded">{img.aspectRatio}</span>
                          </div>
                      </div>
                  ))}
               </div>
          </div>

          {/* Details Sidebar */}
          <div className="w-full lg:w-80 space-y-4 flex-shrink-0">
              {campaign.directorOutput && (
                  <PerformanceScore score={campaign.directorOutput.creativeStrength} />
              )}

              {/* Generated Copy Panel */}
              <CopyPanel copy={campaign.adCopy} />

              <Card title="Strategy Recap">
                  <div className="space-y-3">
                      <div className="bg-slate-900/50 p-2.5 rounded border border-slate-700/50">
                          <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1">Primary Hook</h4>
                          <p className="text-white text-sm font-medium italic">"{campaign.plannerOutput?.hook}"</p>
                      </div>
                      
                      <div>
                         <h4 className="text-[10px] font-bold text-slate-500 uppercase mb-1.5">Visual Angle</h4>
                         <p className="text-xs text-slate-400">{campaign.plannerOutput?.visualConcept}</p>
                      </div>
                  </div>
              </Card>

              {campaign.competitorAnalysis && (
                  <Card title="Competitor Intelligence">
                      <div className="space-y-2">
                           <div className="p-2 border border-red-900/40 bg-red-900/10 rounded">
                               <h4 className="text-[10px] text-red-400 font-bold uppercase mb-1">Identified Weakness</h4>
                               <ul className="list-disc pl-3 text-xs text-slate-400">
                                   {campaign.competitorAnalysis.weaknesses.map((w,i) => <li key={i}>{w}</li>)}
                               </ul>
                           </div>
                           <div className="p-2 border border-green-900/40 bg-green-900/10 rounded">
                               <h4 className="text-[10px] text-green-400 font-bold uppercase mb-1">Winning Angle</h4>
                               <p className="text-xs text-slate-300">{campaign.competitorAnalysis.opportunityAngle}</p>
                           </div>
                      </div>
                  </Card>
              )}
          </div>
      </div>
    </div>
  );
};
