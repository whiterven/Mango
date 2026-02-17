
import React, { useState } from 'react';
import { useCampaignStore } from '../store/CampaignContext';
import { Card } from '../components/ui/Card';
import { useToast } from '../store/ToastContext';
import { AdCopy, GeneratedImage } from '../types';
import { CopyPanel } from '../components/CopyPanel';

interface DetailedAsset extends GeneratedImage {
    campaignName: string;
    campaignId: string;
    adCopy?: AdCopy;
}

export const Library: React.FC = () => {
  const { campaigns, deleteImage } = useCampaignStore();
  const toast = useToast();
  const [selectedAsset, setSelectedAsset] = useState<DetailedAsset | null>(null);
  
  const allImages: DetailedAsset[] = campaigns.flatMap(c => c.images.map(img => ({ 
      ...img, 
      campaignName: c.name,
      campaignId: c.id,
      adCopy: c.adCopy 
  })));

  const handleDelete = async (e: React.MouseEvent, imageId: string, campaignId: string) => {
      e.preventDefault();
      e.stopPropagation();
      if (confirm("Are you sure you want to delete this asset? This cannot be undone.")) {
          await deleteImage(imageId, campaignId);
          toast.success("Asset deleted successfully");
          if (selectedAsset?.id === imageId) setSelectedAsset(null);
      }
  };

  const closeModal = () => setSelectedAsset(null);

  return (
    <div className="space-y-6 relative">
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

                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 backdrop-blur-[1px]">
                        <p className="text-xs text-slate-300 font-bold mb-1">{img.campaignName}</p>
                        <div className="flex gap-2 mt-2">
                            <button 
                                onClick={() => setSelectedAsset(img)}
                                className="flex-1 bg-slate-700 text-white text-[10px] py-2 px-2 rounded font-bold hover:bg-slate-600 border border-slate-600"
                            >
                                View Details
                            </button>
                            <a 
                                href={img.url} 
                                download={`mango-${img.id}.png`}
                                className="flex-1 bg-brand-600 text-white text-[10px] py-2 px-2 rounded font-bold text-center hover:bg-brand-500"
                                onClick={(e) => e.stopPropagation()}
                            >
                                Download
                            </a>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        {allImages.length === 0 && (
            <div className="text-center py-20 text-slate-500">
                No assets generated yet.
            </div>
        )}

        {/* Detail Modal */}
        {selectedAsset && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm" onClick={closeModal}>
                <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col md:flex-row overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
                    {/* Left: Image */}
                    <div className="flex-1 bg-black flex items-center justify-center p-4 relative">
                        <img src={selectedAsset.url} alt="Full Detail" className="max-w-full max-h-full object-contain" />
                        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur px-3 py-1.5 rounded-full text-xs text-slate-300 font-mono border border-white/10">
                            {selectedAsset.aspectRatio} • {selectedAsset.campaignName}
                        </div>
                    </div>

                    {/* Right: Info */}
                    <div className="w-full md:w-96 bg-slate-900 border-l border-slate-800 flex flex-col">
                        <div className="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-800/50">
                            <h3 className="font-bold text-white text-sm">Asset Details</h3>
                            <button onClick={closeModal} className="text-slate-400 hover:text-white">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>
                        </div>
                        
                        <div className="flex-1 overflow-y-auto p-4 space-y-6">
                            {/* Copy Section */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ad Copy</h4>
                                {selectedAsset.adCopy ? (
                                    <CopyPanel copy={selectedAsset.adCopy} />
                                ) : (
                                    <div className="p-4 rounded bg-slate-800/50 text-xs text-slate-500 italic text-center">
                                        No ad copy associated with this campaign.
                                    </div>
                                )}
                            </div>

                            {/* Prompt Section */}
                            <div className="space-y-2">
                                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Generation Prompt</h4>
                                <div className="p-3 bg-black/30 rounded border border-slate-800 font-mono text-[10px] text-slate-400 leading-relaxed max-h-32 overflow-y-auto">
                                    {selectedAsset.prompt}
                                </div>
                            </div>
                        </div>

                        <div className="p-4 border-t border-slate-800 bg-slate-800/30">
                            <a 
                                href={selectedAsset.url} 
                                download={`mango-${selectedAsset.id}.png`}
                                className="flex w-full items-center justify-center gap-2 bg-brand-600 hover:bg-brand-500 text-white font-bold py-2.5 rounded-lg transition-colors text-sm"
                            >
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                                Download Full Resolution
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        )}
    </div>
  );
};
