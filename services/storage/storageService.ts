
import { getSupabaseClient } from '../../lib/supabase';

export const storageService = {
  /**
   * Uploads an image (base64 or blob) to storage.
   * Returns a public URL.
   */
  uploadImage: async (file: File | Blob, path: string): Promise<string> => {
    const supabase = getSupabaseClient();

    if (supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('campaign-assets')
          .upload(path, file, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('campaign-assets')
          .getPublicUrl(data.path);

        return publicUrl;
      } catch (err) {
        console.error("Supabase upload failed, falling back to local object URL", err);
        // Fallback to local URL if upload fails but we have the file
        return URL.createObjectURL(file);
      }
    }

    // Offline fallback: Create a local Object URL
    // Note: These expire when the browser session ends, suitable for demo
    return URL.createObjectURL(file);
  },

  /**
   * Helper to convert Base64 to Blob for uploading
   */
  base64ToBlob: (base64: string, mimeType: string = 'image/png'): Blob => {
    const byteCharacters = atob(base64.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 512) {
      const slice = byteCharacters.slice(offset, offset + 512);
      const byteNumbers = new Array(slice.length);
      
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, { type: mimeType });
  },

  deleteImage: async (path: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.storage.from('campaign-assets').remove([path]);
    }
  }
};
