
import { GeneratedImage } from "../types";

export const exportService = {
  downloadImage: async (image: GeneratedImage, format: 'png' | 'jpg' = 'png') => {
    // Determine mime type
    const mime = format === 'jpg' ? 'image/jpeg' : 'image/png';
    
    // Create link
    const link = document.createElement('a');
    link.href = image.url;
    link.download = `mango_${image.id}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  },

  downloadPackage: async (campaignName: string, images: GeneratedImage[]) => {
    // In a real app, this would zip the files using JSZip
    alert(`Downloading package for ${campaignName} with ${images.length} assets... (Simulated)`);
  }
};
