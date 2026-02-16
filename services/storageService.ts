
import { getSupabaseClient } from '../lib/supabase';

export const storageService = {
  /**
   * Uploads a file or Base64 string to storage.
   * Returns a Public URL (Web) or Object URL (Local).
   */
  upload: async (fileOrBase64: File | Blob | string, path: string): Promise<string> => {
    const supabase = getSupabaseClient();
    let blob: Blob;

    // Convert Base64 to Blob if necessary
    if (typeof fileOrBase64 === 'string') {
      if (fileOrBase64.startsWith('data:')) {
        blob = base64ToBlob(fileOrBase64);
      } else {
        return fileOrBase64; // Already a URL
      }
    } else {
      blob = fileOrBase64;
    }

    // 1. Try Supabase Storage
    if (supabase) {
      try {
        const { data, error } = await supabase.storage
          .from('campaign-assets')
          .upload(path, blob, { upsert: true });

        if (error) throw error;

        const { data: { publicUrl } } = supabase.storage
          .from('campaign-assets')
          .getPublicUrl(data.path);

        return publicUrl;
      } catch (err) {
        console.warn("Cloud upload failed, falling back to local.", err);
      }
    }

    // 2. Fallback: Create local Object URL (Session only)
    // In a real production PWA, you might use IndexedDB here for persistence.
    return URL.createObjectURL(blob);
  },

  delete: async (path: string): Promise<void> => {
    const supabase = getSupabaseClient();
    if (supabase) {
      await supabase.storage.from('campaign-assets').remove([path]);
    }
  }
};

/**
 * Helper: Convert Base64 Data URI to Blob
 */
function base64ToBlob(base64: string): Blob {
  const arr = base64.split(',');
  const mime = arr[0].match(/:(.*?);/)![1];
  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }
  return new Blob([u8arr], { type: mime });
}
