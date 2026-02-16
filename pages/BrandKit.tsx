import React, { useState } from 'react';
import { Card } from '../components/ui/Card';
import { Input } from '../components/ui/Input';
import { Button } from '../components/ui/Button';
import { useCampaignStore } from '../store/CampaignContext';
import { BrandProfile } from '../types';

export const BrandKit: React.FC = () => {
  const { brands, addBrand, deleteBrand } = useCampaignStore();
  const [isAdding, setIsAdding] = useState(false);
  const [newBrand, setNewBrand] = useState<Partial<BrandProfile>>({
      name: '', primaryColor: '#000000', secondaryColor: '#ffffff', font: 'Sans Serif', tone: 'Professional'
  });

  const handleSave = () => {
      if (!newBrand.name) return;
      addBrand({
          id: crypto.randomUUID(),
          ...newBrand as BrandProfile
      });
      setIsAdding(false);
      setNewBrand({ name: '', primaryColor: '#000000', secondaryColor: '#ffffff', font: 'Sans Serif', tone: 'Professional' });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Saved Identities</h2>
          <Button onClick={() => setIsAdding(!isAdding)}>{isAdding ? 'Cancel' : 'New Brand Kit'}</Button>
      </div>

      {isAdding && (
          <Card title="New Brand Identity" className="border-brand-500/50">
              <div className="grid grid-cols-2 gap-6 mb-6">
                  <Input label="Brand Name" value={newBrand.name} onChange={e => setNewBrand({...newBrand, name: e.target.value})} />
                  <Input label="Tone of Voice" value={newBrand.tone} onChange={e => setNewBrand({...newBrand, tone: e.target.value})} />
                  <div>
                      <label className="block text-sm text-slate-400 mb-1">Primary Color</label>
                      <div className="flex items-center gap-2">
                          <input type="color" className="bg-transparent border-0" value={newBrand.primaryColor} onChange={e => setNewBrand({...newBrand, primaryColor: e.target.value})} />
                          <span className="text-sm font-mono">{newBrand.primaryColor}</span>
                      </div>
                  </div>
                   <div>
                      <label className="block text-sm text-slate-400 mb-1">Secondary Color</label>
                      <div className="flex items-center gap-2">
                          <input type="color" className="bg-transparent border-0" value={newBrand.secondaryColor} onChange={e => setNewBrand({...newBrand, secondaryColor: e.target.value})} />
                          <span className="text-sm font-mono">{newBrand.secondaryColor}</span>
                      </div>
                  </div>
              </div>
              <div className="flex justify-end">
                  <Button onClick={handleSave}>Save Brand Kit</Button>
              </div>
          </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {brands.map(brand => (
              <Card key={brand.id} className="relative group">
                  <button 
                    onClick={() => deleteBrand(brand.id)}
                    className="absolute top-4 right-4 text-slate-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                  <div className="flex items-center gap-4 mb-4">
                      <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-slate-700 to-slate-800 border border-slate-600 flex items-center justify-center text-xl font-bold">
                          {brand.name[0]}
                      </div>
                      <div>
                          <h3 className="font-bold text-white">{brand.name}</h3>
                          <p className="text-xs text-slate-400">{brand.tone}</p>
                      </div>
                  </div>
                  <div className="flex gap-2">
                      <div className="h-8 flex-1 rounded" style={{backgroundColor: brand.primaryColor}}></div>
                      <div className="h-8 flex-1 rounded" style={{backgroundColor: brand.secondaryColor}}></div>
                  </div>
              </Card>
          ))}
      </div>
    </div>
  );
};
