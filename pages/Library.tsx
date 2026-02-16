
import React from 'react';
import { useCampaignStore } from '../store/CampaignContext';
import { Card } from '../components/ui/Card';

export const Library: React.FC = () => {
  const { campaigns } = useCampaignStore();
  const allImages = campaigns.flatMap(c => c.images.map(img => ({ ...img, campaignName: c.name })));

  return (
    <div className="space-y-6">
        <div className="flex gap-4 mb-8">
            <input 
                type="text" 
                placeholder="Search assets..." 
                className="bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-white w-64 focus:outline-none focus:ring-1 focus:ring-brand-500"
            />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {allImages.map(img => (
                <div key={img.id} className="group relative aspect-square bg-slate-800 rounded-lg overflow-hidden border border-slate-700 hover:border-brand-500 transition-all">
                    <img src={img.url} alt="Generated Asset" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <p className="text-xs text-slate-300 font-bold mb-1">{img.campaignName}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mb-3">{img.prompt}</p>
                        <a 
                            href={img.url} 
                            download={`mango-${img.id}.png`}
                            className="bg-brand-600 text-white text-xs py-2 px-3 rounded font-bold text-center hover:bg-brand-500"
                        >
                            Download
                        </a>
                    </div>
                </div>
            ))}
        </div>
        {allImages.length === 0 && (
            <div className="text-center py-20 text-slate-500">
                No assets generated yet.
            </div>
        )}
    </div>
  );
};
