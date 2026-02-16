
import React, { useState, useRef } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useCampaignStore } from '../store/CampaignContext';
import { BrandProfile } from '../types';
import { fileToBase64 } from '../services/geminiService';
import { useToast } from '../store/ToastContext';

export const BrandKit: React.FC = () => {
  const { brands, addBrand, deleteBrand } = useCampaignStore();
  const [isAdding, setIsAdding] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const toast = useToast();
  const [isSaving, setIsSaving] = useState(false);
  
  const [newBrand, setNewBrand] = useState<Partial<BrandProfile>>({
      name: '', 
      primaryColor: '#000000', 
      secondaryColor: '#ffffff', 
      font: 'Sans Serif', 
      tone: 'Professional',
      logo: ''
  });

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const base64 = await fileToBase64(e.target.files[0]);
        setNewBrand(prev => ({ ...prev, logo: `data:image/png;base64,${base64}` }));
      } catch (err) {
        console.error("Logo upload failed", err);
        toast.error("Failed to upload logo");
      }
    }
  };

  const handleSave = async () => {
      if (!newBrand.name) return;
      setIsSaving(true);
      
      try {
        await addBrand({
            id: crypto.randomUUID(),
            ...newBrand as BrandProfile
        });
        
        toast.success("Brand Kit saved successfully");
        setIsAdding(false);
        setNewBrand({ 
            name: '', 
            primaryColor: '#000000', 
            secondaryColor: '#ffffff', 
            font: 'Sans Serif', 
            tone: 'Professional',
            logo: '' 
        });
      } catch (e) {
        console.error(e);
        toast.error("Failed to save Brand Kit");
      } finally {
        setIsSaving(false);
      }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold text-white">Brand DNA</h2>
            <p className="text-slate-500 text-sm">Manage visual identities for your products.</p>
          </div>
          <Button onClick={() => setIsAdding(!isAdding)}>{isAdding ? 'Cancel' : 'New Brand Kit'}</Button>
      </div>

      {isAdding && (
          <Card title="New Brand Identity" className="border-brand-500/50 bg-slate-900/80">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-4">
                      <Input label="Brand Name" value={newBrand.name} onChange={e => setNewBrand({...newBrand, name: e.target.value})} placeholder="e.g. Acme Corp" />
                      <Input label="Tone of Voice" value={newBrand.tone} onChange={e => setNewBrand({...newBrand, tone: e.target.value})} placeholder="e.g. Witty, Professional, Luxury" />
                      <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Typography Style</label>
                          <select 
                            className="w-full bg-slate-800 border border-slate-700/60 rounded-md px-3 py-2 text-sm text-white focus:ring-1 focus:ring-brand-500 outline-none"
                            value={newBrand.font}
                            onChange={e => setNewBrand({...newBrand, font: e.target.value})}
                          >
                              <option>Modern Sans Serif</option>
                              <option>Classic Serif</option>
                              <option>Bold Display</option>
                              <option>Handwritten</option>
                              <option>Tech/Monospace</option>
                          </select>
                      </div>
                  </div>

                  <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                          <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1.5">Primary Color</label>
                              <div className="flex items-center gap-2 bg-slate-800 p-2 rounded border border-slate-700">
                                  <input type="color" className="bg-transparent border-0 w-8 h-8 cursor-pointer" value={newBrand.primaryColor} onChange={e => setNewBrand({...newBrand, primaryColor: e.target.value})} />
                                  <span className="text-xs font-mono text-slate-300">{newBrand.primaryColor}</span>
                              </div>
                          </div>
                          <div>
                              <label className="block text-xs font-medium text-slate-400 mb-1.5">Secondary Color</label>
                              <div className="flex items-center gap-2 bg-slate-800 p-2 rounded border border-slate-700">
                                  <input type="color" className="bg-transparent border-0 w-8 h-8 cursor-pointer" value={newBrand.secondaryColor} onChange={e => setNewBrand({...newBrand, secondaryColor: e.target.value})} />
                                  <span className="text-xs font-mono text-slate-300">{newBrand.secondaryColor}</span>
                              </div>
                          </div>
                      </div>

                      <div>
                          <label className="block text-xs font-medium text-slate-400 mb-1.5">Brand Logo</label>
                          <input 
                            type="file" 
                            accept="image/*" 
                            className="hidden" 
                            ref={fileInputRef}
                            onChange={handleLogoUpload}
                          />
                          <div 
                            onClick={() => fileInputRef.current?.click()}
                            className="h-20 w-full border border-dashed border-slate-600 rounded flex items-center justify-center cursor-pointer hover:border-brand-500 hover:bg-slate-800/50 transition-colors"
                          >
                            {newBrand.logo ? (
                              <div className="flex items-center gap-3">
                                <img src={newBrand.logo} alt="Preview" className="h-12 w-12 object-contain bg-white/5 rounded" />
                                <span className="text-xs text-green-400">Change Logo</span>
                              </div>
                            ) : (
                              <div className="text-center">
                                <span className="text-xs text-slate-500">Upload PNG/JPG</span>
                              </div>
                            )}
                          </div>
                      </div>
                  </div>
              </div>
              <div className="flex justify-end pt-4 border-t border-slate-800">
                  <Button onClick={handleSave} disabled={!newBrand.name || isSaving} isLoading={isSaving}>Save Brand Kit</Button>
              </div>
          </Card>
      )}

      {brands.length === 0 && !isAdding ? (
          <div className="text-center py-20 border-2 border-dashed border-slate-800 rounded-xl">
              <div className="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">🧬</div>
              <h3 className="text-white font-bold mb-2">No Brand Kits Found</h3>
              <p className="text-slate-500 text-sm mb-6">Create a brand profile to ensure consistent colors and tone across all ads.</p>
              <Button onClick={() => setIsAdding(true)} variant="secondary">Create First Brand</Button>
          </div>
      ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {brands.map(brand => (
                  <Card key={brand.id} className="relative group hover:border-brand-500/30 transition-colors">
                      <button 
                        onClick={() => {
                            if(confirm('Delete this brand kit?')) {
                                deleteBrand(brand.id);
                                toast.success("Brand kit deleted");
                            }
                        }}
                        className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity p-1 bg-slate-900/50 rounded"
                        title="Delete Brand"
                      >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                      </button>
                      
                      <div className="flex items-center gap-4 mb-5">
                          <div className="w-14 h-14 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center overflow-hidden shrink-0">
                              {brand.logo ? (
                                  <img src={brand.logo} alt={brand.name} className="w-full h-full object-contain p-1" />
                              ) : (
                                  <span className="text-xl font-bold text-slate-500">{brand.name[0]}</span>
                              )}
                          </div>
                          <div>
                              <h3 className="font-bold text-white text-base truncate">{brand.name}</h3>
                              <p className="text-xs text-slate-400">{brand.tone}</p>
                          </div>
                      </div>
                      
                      <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                              <div>
                                  <div className="h-10 rounded mb-1 border border-white/5" style={{backgroundColor: brand.primaryColor}}></div>
                                  <span className="text-[10px] text-slate-500 font-mono uppercase block text-center">{brand.primaryColor}</span>
                              </div>
                              <div>
                                  <div className="h-10 rounded mb-1 border border-white/5" style={{backgroundColor: brand.secondaryColor}}></div>
                                  <span className="text-[10px] text-slate-500 font-mono uppercase block text-center">{brand.secondaryColor}</span>
                              </div>
                          </div>
                          <div className="flex justify-between items-center pt-2 border-t border-slate-800">
                              <span className="text-[10px] text-slate-500 uppercase font-bold">Typography</span>
                              <span className="text-xs text-slate-300">{brand.font}</span>
                          </div>
                      </div>
                  </Card>
              ))}
          </div>
      )}
    </div>
  );
};
