
import React, { useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { AgentPipeline } from '../components/AgentPipeline';
import { CreativeControls } from '../components/CreativeControls';
import { SceneBuilder } from '../components/SceneBuilder';
import { CompetitorUpload } from '../components/CompetitorUpload';
import { useCampaignStore } from '../store/CampaignContext';
import { plannerAgent } from '../agents/plannerAgent';
import { directorAgent } from '../agents/directorAgent';
import { imageAgent } from '../agents/imageAgent';
import { scraperAgent } from '../agents/scraperAgent';
import { copyAgent } from '../agents/copyAgent';
import { Campaign, CampaignStatus, PlannerOutput, DirectorOutput, AspectRatio, BrandProfile, ImageSize, CreativeControls as CreativeControlsType, CompetitorAnalysis, SceneConfiguration, AdCopy } from '../types';
import { Skeleton } from '../components/ui/Skeleton';
import { SuccessConfetti } from '../components/SuccessConfetti';

export const CreateCampaign: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { addCampaign, brands } = useCampaignStore();
  
  // Wizard State
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [logs, setLogs] = useState<string[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);

  // Form State
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [formData, setFormData] = useState({
    productName: '',
    description: '',
    audience: '',
    goal: 'Sales',
    platform: 'Instagram',
    brandId: '',
    aspectRatio: '1:1' as AspectRatio,
    variationCount: 3,
    imageSize: '1K' as ImageSize
  });

  // Creative & Competitor State
  const [creativeControls, setCreativeControls] = useState<CreativeControlsType>({
    minimalism: 50,
    vibrancy: 50,
    lightingDrama: 50,
    mood: 'energetic'
  });
  const [sceneConfig, setSceneConfig] = useState<SceneConfiguration>({
      background: '', lighting: '', cameraAngle: '', props: [], subjectPose: ''
  });
  const [competitorImage, setCompetitorImage] = useState<string | null>(null);
  const [competitorAnalysis, setCompetitorAnalysis] = useState<CompetitorAnalysis | null>(null);
  const [scrapedBrand, setScrapedBrand] = useState<Partial<BrandProfile> | null>(null);

  // Pipeline Data
  const [plannerResult, setPlannerResult] = useState<PlannerOutput | null>(null);
  const [directorResult, setDirectorResult] = useState<DirectorOutput | null>(null);

  const addLog = (msg: string) => setLogs(prev => [...prev, msg]);

  const handleScrape = async () => {
      if (!websiteUrl) return;
      setLoading(true);
      addLog(`🕵️ Scraper: Analyzing ${websiteUrl} for brand signals...`);
      try {
          const data = await scraperAgent(websiteUrl);
          setFormData(prev => ({
              ...prev,
              productName: data.productName,
              description: data.description,
              audience: data.audience
          }));
          if (data.brandProfile) {
              setScrapedBrand(data.brandProfile);
              addLog(`🎨 Brand Memory: Extracted colors ${data.brandProfile.primaryColor} & ${data.brandProfile.secondaryColor}`);
          }
          addLog("✅ Data extracted successfully.");
      } catch (e) {
          addLog(`❌ Scrape Error: ${e}`);
      } finally {
          setLoading(false);
      }
  };

  const handleCompetitorAnalysisComplete = (image: string, analysis: CompetitorAnalysis) => {
      setCompetitorImage(image);
      setCompetitorAnalysis(analysis);
      addLog(`🕵️ Competitor Agent: I found a weakness in their strategy. They missed "${analysis.opportunityAngle.slice(0, 20)}...".`);
  };

  const handleCompetitorClear = () => {
      setCompetitorImage(null);
      setCompetitorAnalysis(null);
  };

  const handleRunPlanner = async () => {
    setLoading(true);
    // Move visual state to step 2 immediately to show skeletons
    setStep(2);
    addLog("🧠 Planner Agent: Initializing deep psychographic scan...");
    try {
      let activeBrand: BrandProfile | undefined = brands.find(b => b.id === formData.brandId);
      
      if (!activeBrand && scrapedBrand && scrapedBrand.primaryColor) {
         activeBrand = {
             id: 'temp-scraped',
             name: scrapedBrand.name || 'Scraped Brand',
             primaryColor: scrapedBrand.primaryColor!,
             secondaryColor: scrapedBrand.secondaryColor!,
             font: scrapedBrand.font || 'Modern',
             tone: scrapedBrand.tone || 'Professional',
             additionalGuidelines: 'Derived from website analysis'
         };
      }

      if (activeBrand) {
          addLog(`🧬 Brand DNA: Loading identity for ${activeBrand.name}...`);
      }

      const res = await plannerAgent(
        formData.productName, 
        formData.description, 
        formData.audience, 
        activeBrand
      );

      setPlannerResult(res);
      addLog(`💡 Planner Agent: I've found a "${res.angle}" angle that triggers ${res.emotion}.`);
    } catch (e) {
      addLog(`❌ Error: ${e}`);
      setStep(1); // Go back on error
    } finally {
      setLoading(false);
    }
  };

  const handleRunDirector = async () => {
    if (!plannerResult) return;
    setLoading(true);
    setStep(3); // Move visual state to step 3 immediately
    addLog(`🎬 Director Agent: Translating strategy into ${formData.variationCount} distinct visual concepts...`);
    addLog(`⚙️ Applying Creative Controls: ${creativeControls.mood} mood, ${creativeControls.minimalism}% minimalism.`);
    try {
      const res = await directorAgent(
        plannerResult, 
        formData.platform, 
        Number(formData.variationCount), 
        undefined, // No feedback initially
        creativeControls
      );
      setDirectorResult(res);
      addLog(`✨ Director Agent: Concepts optimized. Predicted attention score: ${res.creativeStrength.overall}/100.`);
    } catch (e) {
      addLog(`❌ Error: ${e}`);
      setStep(2); // Go back
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateImages = async () => {
    if (!directorResult || !plannerResult) return;
    setLoading(true);
    addLog("🚀 Production Agent: Spinning up render engine...");
    
    try {
        // Parallel: Image Generation AND Copywriting
        addLog("✍️ Copywriter Agent: Drafting high-conversion primary text...");
        
        const copyPromise = copyAgent(
            formData.productName, 
            plannerResult, 
            formData.platform,
            formData.audience
        ).then(res => {
            addLog("✅ Copy generated.");
            return res;
        });

        const imagePromise = (async () => {
            const generatedImages = [];
            const prompts = directorResult.generationPrompts;
            for (let i = 0; i < prompts.length; i++) {
                 addLog(`🎨 Production Agent: Rendering asset ${i + 1}/${prompts.length} [1K Resolution]...`);
                 try {
                    const imgUrl = await imageAgent(prompts[i], formData.aspectRatio, formData.imageSize);
                    generatedImages.push({
                        id: crypto.randomUUID(),
                        url: imgUrl,
                        prompt: prompts[i],
                        aspectRatio: formData.aspectRatio,
                        createdAt: Date.now()
                    });
                 } catch (err) {
                     addLog(`⚠️ Failed to render var ${i+1}: ${err}`);
                 }
            }
            if (generatedImages.length === 0) throw new Error("All image generations failed.");
            return generatedImages;
        })();

        const [adCopy, generatedImages] = await Promise.all([copyPromise, imagePromise]);

        const newCampaign: Campaign = {
            id: crypto.randomUUID(),
            name: `${formData.productName} Campaign`,
            ...formData,
            status: 'completed' as CampaignStatus,
            createdAt: Date.now(),
            plannerOutput: plannerResult,
            directorOutput: directorResult,
            images: generatedImages,
            adCopy: adCopy,
            creativeControls: creativeControls,
            sceneConfiguration: sceneConfig,
            competitorAnalysis: competitorAnalysis || undefined
        };

        addCampaign(newCampaign);
        addLog("🎉 System: Campaign finalized. Saving assets...");
        setShowConfetti(true);
        setTimeout(() => {
          onComplete();
        }, 3000);
    } catch (e) {
        addLog(`❌ Critical Error: ${e}`);
        setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto pb-20 relative">
      {showConfetti && <SuccessConfetti />}
      
      <AgentPipeline steps={[
        { id: '1', label: 'Brief', status: step === 1 && !loading ? 'active' : step > 1 ? 'completed' : 'pending', agent: 'Planner' },
        { id: '2', label: 'Strategy', status: (step === 2 && !loading) || (step === 1 && loading) ? 'active' : step > 2 ? 'completed' : 'pending', agent: 'Director' },
        { id: '3', label: 'Production', status: (step === 3 && !loading) || (step === 2 && loading) ? 'active' : step > 3 ? 'completed' : 'pending', agent: 'Generator' },
      ]} />

      {/* Step 1: Input & Planner */}
      {step === 1 && !loading && (
        <Card title="Campaign Brief & Strategy">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Left Col: Core Input */}
            <div className="lg:col-span-2 space-y-5">
              {/* Scraper */}
              <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-700/50">
                  <label className="block text-xs font-medium text-brand-400 mb-1.5">Auto-Fill from Website</label>
                  <div className="flex gap-2">
                      <Input 
                          placeholder="https://your-product-page.com" 
                          value={websiteUrl}
                          onChange={e => setWebsiteUrl(e.target.value)}
                          className="bg-slate-900 !py-1.5"
                      />
                      <Button variant="secondary" onClick={handleScrape} isLoading={loading} disabled={!websiteUrl} size="sm">
                          Analyze
                      </Button>
                  </div>
              </div>

              {/* Main Inputs */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input 
                  label="Product Name" 
                  value={formData.productName} 
                  onChange={e => setFormData({...formData, productName: e.target.value})}
                  placeholder="e.g. Neon Energy Drink"
                />
                 <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Brand Profile</label>
                    <select 
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
                      value={formData.brandId}
                      onChange={e => setFormData({...formData, brandId: e.target.value})}
                    >
                      <option value="">No Brand Kit (Use Scraped or Generic)</option>
                      {brands.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Input 
                      label="Target Audience" 
                      value={formData.audience} 
                      onChange={e => setFormData({...formData, audience: e.target.value})}
                      placeholder="e.g. Gamers 18-35"
                  />
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Platform</label>
                    <select 
                      className="w-full bg-slate-800 border border-slate-700/60 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
                      value={formData.platform}
                      onChange={e => setFormData({...formData, platform: e.target.value})}
                    >
                      <option value="Facebook">Facebook</option>
                      <option value="Instagram">Instagram</option>
                      <option value="TikTok">TikTok</option>
                    </select>
                  </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Description & Value Prop</label>
                <textarea 
                  className="w-full bg-slate-800 border border-slate-700/60 rounded-md px-3 py-2 text-sm text-white h-24 focus:ring-1 focus:ring-brand-500 outline-none placeholder-slate-500"
                  value={formData.description}
                  onChange={e => setFormData({...formData, description: e.target.value})}
                  placeholder="Describe the product features and main benefit..."
                />
              </div>

              {/* Gen Settings */}
              <div className="grid grid-cols-3 gap-3 bg-slate-900/30 p-3 rounded-lg border border-slate-700/30">
                  <div className="col-span-1">
                    <label className="block text-[10px] font-medium text-slate-400 mb-1.5">Format</label>
                    <div className="flex gap-1">
                        {['1:1', '4:5', '9:16'].map(ratio => (
                            <button
                              key={ratio}
                              onClick={() => setFormData({...formData, aspectRatio: ratio as AspectRatio})}
                              className={`flex-1 px-1 py-1.5 rounded text-[10px] border ${
                                  formData.aspectRatio === ratio 
                                  ? 'bg-brand-600 border-brand-500 text-white' 
                                  : 'bg-slate-800 border-slate-700/60 text-slate-400'
                              }`}
                            >
                                {ratio}
                            </button>
                        ))}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-medium text-slate-400 mb-1.5">Size</label>
                    <div className="flex gap-1">
                        {['1K', '2K', '4K'].map(size => (
                            <button
                              key={size}
                              onClick={() => setFormData({...formData, imageSize: size as ImageSize})}
                              className={`flex-1 px-1 py-1.5 rounded text-[10px] border ${
                                  formData.imageSize === size 
                                  ? 'bg-brand-600 border-brand-500 text-white' 
                                  : 'bg-slate-800 border-slate-700/60 text-slate-400'
                              }`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                  </div>
                  <div className="col-span-1">
                    <label className="block text-[10px] font-medium text-slate-400 mb-1.5">Variations</label>
                    <div className="flex gap-1">
                        {[1, 3, 5].map(count => (
                            <button
                              key={count}
                              onClick={() => setFormData({...formData, variationCount: count})}
                              className={`flex-1 px-1 py-1.5 rounded text-[10px] border ${
                                  formData.variationCount === count 
                                  ? 'bg-brand-600 border-brand-500 text-white' 
                                  : 'bg-slate-800 border-slate-700/60 text-slate-400'
                              }`}
                            >
                                {count}
                            </button>
                        ))}
                    </div>
                  </div>
              </div>
              
              <SceneBuilder value={sceneConfig} onChange={setSceneConfig} />

            </div>

            {/* Right Col: Competitor & Controls */}
            <div className="space-y-5">
               {/* Competitor Upload */}
               <CompetitorUpload 
                 onAnalysisComplete={handleCompetitorAnalysisComplete}
                 onClear={handleCompetitorClear}
                 image={competitorImage}
                 analysis={competitorAnalysis}
               />

               {/* Creative Controls */}
               <CreativeControls value={creativeControls} onChange={setCreativeControls} />
               
               <div className="pt-2">
                  <Button onClick={handleRunPlanner} isLoading={loading} className="w-full" size="md">
                    Generate Strategy
                  </Button>
               </div>
            </div>
          </div>
        </Card>
      )}

      {/* Step 2: Review Strategy & Director */}
      {step === 2 && (
        <Card title={loading ? "Generating Strategy..." : "Marketing Strategy"}>
          {loading ? (
             <div className="space-y-6">
                <div className="grid grid-cols-2 gap-6">
                    <Skeleton className="h-20 w-full" />
                    <Skeleton className="h-20 w-full" />
                </div>
                <Skeleton className="h-32 w-full" />
                <div className="flex justify-between">
                    <Skeleton className="h-8 w-20" />
                    <Skeleton className="h-10 w-40" />
                </div>
             </div>
          ) : plannerResult ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700/50">
                    <h4 className="text-brand-400 text-[10px] font-bold uppercase mb-1">The Hook</h4>
                    <p className="text-base font-bold text-white">"{plannerResult.hook}"</p>
                </div>
                <div className="bg-slate-900/50 p-3 rounded-md border border-slate-700/50">
                    <h4 className="text-brand-400 text-[10px] font-bold uppercase mb-1">Emotional Angle</h4>
                    <p className="text-base font-bold text-white">{plannerResult.emotion}</p>
                </div>
              </div>
              <div className="mb-6">
                <h4 className="text-slate-400 text-[10px] font-bold uppercase mb-1">Visual Concept</h4>
                <p className="text-slate-200 text-sm leading-relaxed">{plannerResult.visualConcept}</p>
              </div>
              
              {competitorAnalysis && (
                <div className="mb-6 p-3 bg-red-900/10 border border-red-900/30 rounded-lg">
                  <h4 className="text-red-400 text-[10px] font-bold uppercase mb-1">Competitor Weakness Detected</h4>
                  <p className="text-xs text-slate-300">{competitorAnalysis.opportunityAngle}</p>
                </div>
              )}

              <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(1)} size="sm">Back</Button>
                  <Button onClick={handleRunDirector} isLoading={loading} size="md">
                    Optimize & Direct ({formData.variationCount} Vars)
                  </Button>
              </div>
            </>
          ) : null}
        </Card>
      )}

      {/* Step 3: Review Creative & Generate */}
      {step === 3 && (
        <Card title={loading ? (directorResult ? "Production in Progress..." : "Optimizing Creative...") : "Creative Direction"}>
          {loading && !directorResult ? (
             <div className="space-y-6">
                 <div className="flex gap-4">
                     <Skeleton className="w-24 h-24 rounded-lg" />
                     <div className="flex-1 space-y-3">
                         <Skeleton className="h-4 w-1/3" />
                         <Skeleton className="h-16 w-full" />
                     </div>
                 </div>
                 <Skeleton className="h-20 w-full" />
                 <div className="space-y-2">
                     <Skeleton className="h-8 w-full" />
                     <Skeleton className="h-8 w-full" />
                 </div>
             </div>
          ) : loading && directorResult ? (
             <div className="space-y-8 py-8">
                 <div className="text-center">
                     <div className="w-16 h-16 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                     <h3 className="text-lg font-bold text-white">Rendering Assets</h3>
                     <p className="text-slate-400 text-sm mt-2">Generating {formData.variationCount} high-resolution images...</p>
                 </div>
                 <div className="grid grid-cols-3 gap-4">
                     {[...Array(formData.variationCount)].map((_, i) => (
                         <div key={i} className="aspect-square bg-slate-800 rounded-lg animate-pulse border border-slate-700"></div>
                     ))}
                 </div>
             </div>
          ) : directorResult ? (
            <>
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 mb-6 bg-slate-900/50 p-3 rounded-md border border-slate-700/50">
                  <div className="text-center px-4 border-r border-slate-700/50 min-w-[80px]">
                      <div className="text-xl font-black text-green-400">{directorResult.creativeStrength.overall}</div>
                      <div className="text-[10px] text-slate-500 uppercase">Score</div>
                  </div>
                  <div className="flex-1">
                      <h4 className="font-bold text-white text-sm mb-1">Director's Note</h4>
                      <p className="text-xs text-slate-400 leading-relaxed">{directorResult.improvedConcept}</p>
                  </div>
              </div>

              <div className="mb-6">
                  <h4 className="text-slate-500 text-[10px] font-bold uppercase mb-2">Champion Prompt</h4>
                  <div className="bg-black/30 p-2.5 rounded-md font-mono text-[11px] text-brand-200 border border-brand-900/30 overflow-x-auto whitespace-nowrap">
                      {directorResult.technicalPrompt}
                  </div>
                  
                  {directorResult.generationPrompts.length > 1 && (
                      <div className="mt-4">
                          <h4 className="text-slate-500 text-[10px] font-bold uppercase mb-2">Challenger Variations ({directorResult.generationPrompts.length - 1})</h4>
                          <div className="space-y-1.5">
                              {directorResult.generationPrompts.slice(1).map((p, i) => (
                                  <div key={i} className="bg-black/20 p-2 rounded-md text-[10px] text-slate-400 truncate">
                                      Variant {i+1}: {p}
                                  </div>
                              ))}
                          </div>
                      </div>
                  )}
              </div>

              <div className="flex justify-between">
                  <Button variant="outline" onClick={() => setStep(2)} size="sm">Back</Button>
                  <Button onClick={handleGenerateImages} isLoading={loading} size="md">
                    Run Production ({directorResult.generationPrompts.length} Images)
                  </Button>
              </div>
            </>
          ) : null}
        </Card>
      )}

      {/* Logs Console */}
      {logs.length > 0 && (
          <div className="mt-6 bg-black/40 p-3 rounded-md font-mono text-[10px] text-slate-400 max-h-24 overflow-y-auto border border-slate-800">
              {logs.map((l, i) => <div key={i} className="mb-0.5">{l}</div>)}
              {loading && <div className="animate-pulse text-brand-500">{`> Processing...`}</div>}
          </div>
      )}
    </div>
  );
};
