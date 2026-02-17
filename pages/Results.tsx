
import React, { useState } from 'react';
import { useCampaignStore } from '../store/CampaignContext';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PerformanceScore } from '../components/PerformanceScore';
import { CopyPanel } from '../components/CopyPanel';
import { directorAgent } from '../agents/directorAgent';
import { imageAgent } from '../agents/imageAgent';
import { AspectRatio } from '../types';
import { useToast } from '../store/ToastContext';
import { exportService } from '../services/exportService';

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

  if (!campaign) return <div className="p-8 text-center text-slate-500">Campaign not found</div>;

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
      exportService.downloadPackage(campaign.name, campaign.images);
      setShowExportMenu(false);
  };

  return (
    <div className="max-w-[1600px] mx-auto pb-20">
      
      {/* 1. Header Section */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
              <button 
                onClick={() => onNavigate('dashboard')} 
                className="w-10 h-10 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-400 hover:text-white hover:border-slate-500 transition-all group"
              >
                  <svg className="w-5 h-5 transform group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </button>
              <div>
                  <div className="flex items-center gap-3">
                    <h1 className="text-3xl font-bold text-white tracking-tight">{campaign.name}</h1>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${campaign.platform === 'Instagram' ? 'bg-pink-500/10 text-pink-400 border-pink-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
                        {campaign.platform}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 mt-1 text-xs text-slate-500 font-medium">
                      <span>Created {new Date(campaign.createdAt).toLocaleDateString()}</span>
                      <span>•</span>
                      <span>{campaign.images.length} Variations</span>
                  </div>
              </div>
          </div>

          <div className="flex items-center gap-3 relative">
              <div className="relative">
                  <Button variant="outline" onClick={() => setShowRegenMenu(!showRegenMenu)} isLoading={isRegenerating}>
                      ✨ Regenerate
                  </Button>
                  {showRegenMenu && (
                      <div className="absolute top-full right-0 mt-2 w-56 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden ring-1 ring-white/10">
                          <div className="p-3 text-[10px] text-slate-500 font-bold uppercase bg-slate-950/50 border-b border-slate-800">Select Direction</div>
                          <button onClick={() => handleRegenerate("Make it more Luxurious & Minimalist")} className="w-full text-left px-4 py-3 hover:bg-slate-800 text-xs text-white border-b border-slate-800/50 transition-colors">💎 More Luxury</button>
                          <button onClick={() => handleRegenerate("Make it more Urgent & High Contrast")} className="w-full text-left px-4 py-3 hover:bg-slate-800 text-xs text-white border-b border-slate-800/50 transition-colors">🔥 More Urgency</button>
                          <button onClick={() => handleRegenerate("Try a completely different camera angle")} className="w-full text-left px-4 py-3 hover:bg-slate-800 text-xs text-white border-b border-slate-800/50 transition-colors">📸 Different Angle</button>
                          <button onClick={() => handleRegenerate("Make it darker and moody")} className="w-full text-left px-4 py-3 hover:bg-slate-800 text-xs text-white transition-colors">🌙 Dark & Moody</button>
                      </div>
                  )}
              </div>
              
              <div className="relative">
                  <Button onClick={() => setShowExportMenu(!showExportMenu)}>Download Package</Button>
                  {showExportMenu && (
                      <div className="absolute top-full right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-xl shadow-2xl z-20 overflow-hidden ring-1 ring-white/10">
                          <div className="p-3 text-[10px] text-slate-500 font-bold uppercase bg-slate-950/50 border-b border-slate-800">Export All Assets</div>
                          <button onClick={() => handleExport('Facebook')} className="w-full text-left px-4 py-3 hover:bg-slate-800 text-xs text-white flex items-center justify-between border-b border-slate-800/50 transition-colors">
                              <span>Facebook Ads (1:1)</span>
                              <span className="text-[10px] text-slate-500 font-mono">ZIP</span>
                          </button>
                          <button onClick={() => handleExport('Instagram')} className="w-full text-left px-4 py-3 hover:bg-slate-800 text-xs text-white flex items-center justify-between border-b border-slate-800/50 transition-colors">
                              <span>Instagram Story (9:16)</span>
                              <span className="text-[10px] text-slate-500 font-mono">ZIP</span>
                          </button>
                          <button onClick={() => handleExport('TikTok')} className="w-full text-left px-4 py-3 hover:bg-slate-800 text-xs text-white flex items-center justify-between transition-colors">
                              <span>TikTok Video (MP4)</span>
                              <span className="text-[10px] text-slate-500 font-mono">PRO</span>
                          </button>
                      </div>
                  )}
              </div>
          </div>
      </header>

      {/* 2. Main Layout Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
          
          {/* Left Column: Visual Assets (8 cols) */}
          <div className="xl:col-span-8 space-y-10">
              
              {/* Generated Variations */}
              <section>
                  <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-white flex items-center gap-3">
                          Visual Assets
                          <span className="bg-slate-800 text-slate-400 text-xs px-2 py-1 rounded-full">{campaign.images.length}</span>
                      </h2>
                      {isRegenerating && (
                          <div className="flex items-center gap-2 text-xs text-brand-400 bg-brand-900/20 px-3 py-1.5 rounded-full border border-brand-500/30 animate-pulse">
                              <div className="w-2 h-2 bg-brand-500 rounded-full"></div>
                              Rendering new variant...
                          </div>
                      )}
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {campaign.images.map((img, idx) => (
                          <div key={img.id} className="group relative bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-sm hover:shadow-2xl hover:border-brand-500/50 transition-all duration-300">
                              {/* Image Display */}
                              <div className={`relative w-full bg-black/50 ${img.aspectRatio === '9:16' ? 'aspect-[9/16]' : 'aspect-square'}`}>
                                  <img src={img.url} className="w-full h-full object-contain" alt="Ad Creative" />
                                  
                                  {/* Hover Actions Overlay */}
                                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-3 backdrop-blur-[2px]">
                                      <Button size="sm" onClick={() => exportService.downloadImage(img)}>
                                          <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                          Download PNG
                                      </Button>
                                      <Button size="sm" variant="secondary" onClick={() => { navigator.clipboard.writeText(img.url); toast.success("Link copied!"); }}>
                                          Copy Link
                                      </Button>
                                  </div>
                                  
                                  {/* Info Badges */}
                                  <div className="absolute top-4 left-4 flex gap-2">
                                      <span className="bg-black/60 backdrop-blur-md text-white text-[10px] font-bold px-2 py-1 rounded border border-white/10 shadow-lg">
                                          Var {campaign.images.length - idx}
                                      </span>
                                      <span className="bg-black/60 backdrop-blur-md text-slate-300 text-[10px] font-mono px-2 py-1 rounded border border-white/10 shadow-lg">
                                          {img.aspectRatio}
                                      </span>
                                  </div>
                              </div>
                              
                              {/* Footer */}
                              <div className="p-4 border-t border-slate-800 bg-slate-950/30">
                                  <p className="text-[10px] text-slate-500 font-mono line-clamp-2 leading-relaxed" title={img.prompt}>
                                      <span className="text-slate-600 font-bold mr-2">PROMPT:</span>{img.prompt}
                                  </p>
                              </div>
                          </div>
                      ))}
                  </div>
              </section>

              {/* Strategy & Intel Cards */}
              <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card title="Strategy Blueprint" className="h-full bg-slate-900/50">
                      <div className="space-y-5">
                          <div className="bg-slate-950/50 p-3 rounded border border-slate-800">
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-2">Primary Hook</label>
                              <p className="text-sm font-medium text-white italic">"{campaign.plannerOutput?.hook}"</p>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4">
                              <div>
                                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Psychology</label>
                                  <Badge color="blue">{campaign.plannerOutput?.angle}</Badge>
                              </div>
                              <div>
                                  <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Emotion</label>
                                  <Badge color="brand">{campaign.plannerOutput?.emotion}</Badge>
                              </div>
                          </div>
                          
                          <div>
                              <label className="text-[9px] font-bold text-slate-500 uppercase tracking-wider block mb-1">Visual Directive</label>
                              <p className="text-xs text-slate-400 leading-relaxed">{campaign.plannerOutput?.visualConcept}</p>
                          </div>
                      </div>
                  </Card>

                  {campaign.competitorAnalysis && (
                      <Card title="Competitor Intel" className="h-full border-red-900/20 bg-red-900/5">
                          <div className="space-y-5">
                              <div>
                                  <label className="text-[9px] font-bold text-red-400 uppercase tracking-wider block mb-2">Exploited Weakness</label>
                                  <div className="bg-red-900/10 p-2 rounded border border-red-900/20">
                                      <p className="text-xs text-red-200">{campaign.competitorAnalysis.weaknesses[0]}</p>
                                  </div>
                              </div>
                              
                              <div className="relative pt-4">
                                  <div className="absolute top-0 left-0 w-full border-t border-dashed border-red-900/30"></div>
                                  <label className="text-[9px] font-bold text-green-400 uppercase tracking-wider block mb-2">Our Counter-Strategy</label>
                                  <p className="text-xs text-slate-300 leading-relaxed">{campaign.competitorAnalysis.opportunityAngle}</p>
                              </div>
                          </div>
                      </Card>
                  )}
              </section>
          </div>

          {/* Right Column: Copy & Score (Sticky) */}
          <div className="xl:col-span-4 space-y-6 xl:sticky xl:top-6">
              
              {/* Performance Score */}
              {campaign.directorOutput && (
                  <PerformanceScore score={campaign.directorOutput.creativeStrength} />
              )}

              {/* Ad Copy */}
              <CopyPanel copy={campaign.adCopy} />

              {/* Quick Actions */}
              <Card className="bg-slate-900 border-slate-800">
                  <h4 className="text-xs font-bold text-slate-400 uppercase mb-4">Quick Actions</h4>
                  <div className="space-y-3">
                      <Button variant="secondary" className="w-full justify-between group h-10 border-slate-700 bg-slate-800 hover:bg-slate-700" onClick={() => onNavigate('studio')}>
                          <span className="flex items-center gap-2"><span className="text-lg">🎨</span> Open in Creative Studio</span>
                          <span className="text-slate-500 group-hover:text-white transition-colors">→</span>
                      </Button>
                      <Button variant="secondary" className="w-full justify-between group h-10 border-slate-700 bg-slate-800 hover:bg-slate-700" onClick={() => onNavigate('schedule')}>
                          <span className="flex items-center gap-2"><span className="text-lg">📅</span> Schedule Launch</span>
                          <span className="text-slate-500 group-hover:text-white transition-colors">→</span>
                      </Button>
                  </div>
              </Card>

          </div>

      </div>
    </div>
  );
};
