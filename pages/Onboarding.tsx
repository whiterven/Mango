
import React, { useState, useRef } from 'react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useCampaignStore } from '../store/CampaignContext';
import { fileToBase64 } from '../services/geminiService';
import { useAuth } from '../hooks/useAuth';
import { Campaign } from '../types';

export const Onboarding: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { addBrand, addCampaign } = useCampaignStore();
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [isSaving, setIsSaving] = useState(false);
  const [data, setData] = useState({
    brandName: '',
    industry: '',
    primaryColor: '#000000',
    productName: '',
    goal: 'Sales',
    logo: '' as string
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        // Ensure proper data URI format
        const logoUrl = `data:image/png;base64,${base64}`;
        setData({ ...data, logo: logoUrl });
      } catch (err) {
        console.error("Logo upload failed", err);
      }
    }
  };

  const handleNext = async () => {
    if (step === 3) {
      if (!user) {
          console.error("No user found during onboarding save.");
          return;
      }
      
      setIsSaving(true);
      try {
          const brandId = crypto.randomUUID();
          
          // 1. Save Brand
          await addBrand({
            id: brandId,
            name: data.brandName,
            primaryColor: data.primaryColor,
            secondaryColor: '#ffffff',
            font: 'Sans Serif',
            tone: 'Professional',
            logo: data.logo,
            additionalGuidelines: `Industry: ${data.industry}`
          });

          // 2. Create First Draft Campaign (so product name & goal aren't lost)
          if (data.productName) {
              const newCampaign: Campaign = {
                  id: crypto.randomUUID(),
                  name: `${data.productName} Launch`,
                  productName: data.productName,
                  description: `Initial campaign for ${data.productName}`,
                  targetAudience: 'General Audience', 
                  goal: data.goal,
                  platform: 'Instagram',
                  brandProfileId: brandId,
                  status: 'draft',
                  createdAt: Date.now(),
                  images: []
              };
              await addCampaign(newCampaign);
          }

          onComplete();
      } catch (e) {
          console.error("Onboarding save failed", e);
      } finally {
          setIsSaving(false);
      }
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <div className="max-w-xl w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 shadow-2xl relative overflow-hidden">
        {/* Progress Bar */}
        <div className="absolute top-0 left-0 w-full h-1 bg-slate-800">
          <div 
            className="h-full bg-brand-500 transition-all duration-500"
            style={{ width: `${(step / 3) * 100}%` }}
          ></div>
        </div>

        <div className="mb-8 text-center">
           <div className="inline-block p-3 rounded-full bg-brand-900/20 mb-4">
             {step === 1 && <span className="text-2xl">👋</span>}
             {step === 2 && <span className="text-2xl">🎨</span>}
             {step === 3 && <span className="text-2xl">🚀</span>}
           </div>
           <h1 className="text-2xl font-bold text-white mb-2">
             {step === 1 ? "Welcome to Mango" : step === 2 ? "Define Your Brand" : "Ready for Liftoff"}
           </h1>
           <p className="text-slate-400 text-sm">
             {step === 1 ? "Let's set up your workspace for success." : step === 2 ? "Teach the AI about your visual identity." : "What is your main focus right now?"}
           </p>
        </div>

        <div className="space-y-6">
          {step === 1 && (
            <>
              <Input 
                label="Brand / Company Name" 
                value={data.brandName} 
                onChange={e => setData({...data, brandName: e.target.value})}
                placeholder="e.g. Acme Fitness"
              />
              <div>
                <label className="block text-xs font-medium text-slate-400 mb-1.5">Industry</label>
                <select 
                  className="w-full bg-slate-800 border border-slate-700 rounded-md px-3 py-2 text-sm text-white"
                  value={data.industry}
                  onChange={e => setData({...data, industry: e.target.value})}
                >
                  <option value="">Select Industry...</option>
                  <option value="Ecommerce">Ecommerce</option>
                  <option value="SaaS">SaaS / Software</option>
                  <option value="Agency">Agency</option>
                  <option value="Local Business">Local Business</option>
                </select>
              </div>
            </>
          )}

          {step === 2 && (
            <>
              <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Primary Brand Color</label>
                    <div className="flex gap-3">
                      <input 
                        type="color" 
                        className="h-10 w-10 rounded cursor-pointer bg-transparent border-0"
                        value={data.primaryColor}
                        onChange={e => setData({...data, primaryColor: e.target.value})}
                      />
                      <Input 
                        value={data.primaryColor}
                        onChange={e => setData({...data, primaryColor: e.target.value})}
                        className="flex-1"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs font-medium text-slate-400 mb-1.5">Brand Logo (Optional)</label>
                    <input 
                      type="file" 
                      accept="image/*" 
                      className="hidden" 
                      ref={fileInputRef}
                      onChange={handleLogoUpload}
                    />
                    <div 
                      onClick={() => fileInputRef.current?.click()}
                      className="h-10 w-full border border-dashed border-slate-600 rounded flex items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-slate-800 transition-colors"
                    >
                      {data.logo ? (
                        <div className="flex items-center gap-2">
                           <img src={data.logo} alt="Logo" className="h-6 w-6 object-contain" />
                           <span className="text-[10px] text-green-400">Uploaded</span>
                        </div>
                      ) : (
                        <span className="text-[10px] text-slate-500">Upload PNG</span>
                      )}
                    </div>
                  </div>
              </div>

              <Input 
                label="First Product Name" 
                value={data.productName} 
                onChange={e => setData({...data, productName: e.target.value})}
                placeholder="e.g. Pro Protein Powder"
              />
            </>
          )}

          {step === 3 && (
            <div className="grid grid-cols-2 gap-4">
               {['Sales', 'Leads', 'Awareness', 'Traffic'].map(g => (
                 <button
                   key={g}
                   onClick={() => setData({...data, goal: g})}
                   className={`p-4 rounded-xl border text-center transition-all ${
                     data.goal === g 
                     ? 'bg-brand-600 border-brand-500 text-white shadow-lg shadow-brand-500/20' 
                     : 'bg-slate-800 border-slate-700 text-slate-400 hover:border-slate-600'
                   }`}
                 >
                   <div className="font-bold text-sm">{g}</div>
                 </button>
               ))}
            </div>
          )}

          <Button onClick={handleNext} className="w-full py-3" disabled={(step === 1 && !data.brandName) || isSaving} isLoading={isSaving}>
            {step === 3 ? "Launch Workspace" : "Continue"}
          </Button>
        </div>
      </div>
    </div>
  );
};
