
import React, { useState } from 'react';
import { useCampaignStore } from '../store/CampaignContext';
import { TextOverlayEditor } from '../components/TextOverlayEditor';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Studio: React.FC = () => {
  const { campaigns } = useCampaignStore();
  const allImages = campaigns.flatMap(c => c.images);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleSaveEdit = (dataUrl: string) => {
    // In a real app, save this to the store as a new variant
    const link = document.createElement('a');
    link.download = 'mango-edited.png';
    link.href = dataUrl;
    link.click();
    setSelectedImage(null);
  };

  if (selectedImage) {
      return (
          <div className="h-[calc(100vh-100px)]">
              <TextOverlayEditor 
                imageUrl={selectedImage} 
                onSave={handleSaveEdit} 
                onCancel={() => setSelectedImage(null)} 
              />
          </div>
      );
  }

  return (
    <div className="space-y-6">
       <div className="flex justify-between items-center">
           <h2 className="text-xl font-bold text-white">Creative Studio</h2>
           <div className="text-xs text-slate-500">Select an asset to edit</div>
       </div>

       <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
           {allImages.map(img => (
               <div key={img.id} className="group relative bg-slate-800 rounded-lg overflow-hidden border border-slate-700 cursor-pointer hover:border-brand-500 transition-all" onClick={() => setSelectedImage(img.url)}>
                   <img src={img.url} className="w-full h-40 object-cover" />
                   <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <span className="bg-white/90 text-black text-[10px] font-bold px-2 py-1 rounded">Edit</span>
                   </div>
               </div>
           ))}
       </div>
       
       {allImages.length === 0 && (
           <div className="text-center py-20 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl">
               No assets available to edit. Generate a campaign first.
           </div>
       )}
    </div>
  );
};
