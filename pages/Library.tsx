
import React from 'react';
import { useCampaignStore } from '../store/CampaignContext';
import { Card } from '../components/ui/Card';
import { useToast } from '../store/ToastContext';

export const Library: React.FC = () => {
  const { campaigns, deleteImage } = useCampaignStore();
  const toast = useToast();
  
  const allImages = campaigns.flatMap(c => c.images.map(img => ({ 
      ...img, 
      campaignName: c.name,
      campaignId: c.id 
  })));

  const handleDelete = async (e: React.MouseEvent, imageId: string, campaignId: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (confirm("Are you sure you want to delete this asset? This cannot be undone.")) {
          await deleteImage(imageId, campaignId);
          toast.success("Asset deleted successfully");
      }
  };

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
                    
                    {/* Delete Button */}
                    <button 
                        onClick={(e) => handleDelete(e, img.id, img.campaignId!)}
                        className="absolute top-2 right-2 bg-red-500/90 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-600 hover:scale-110 z-20 shadow-lg"
                        title="Delete Image"
                    >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                    </button>

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                        <p className="text-xs text-slate-300 font-bold mb-1">{img.campaignName}</p>
                        <p className="text-[10px] text-slate-400 line-clamp-2 mb-3">{img.prompt}</p>
                        <a 
                            href={img.url} 
                            download={`mango-${img.id}.png`}
                            className="bg-brand-600 text-white text-xs py-2 px-3 rounded font-bold text-center hover:bg-brand-500"
                            onClick={(e) => e.stopPropagation()}
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
