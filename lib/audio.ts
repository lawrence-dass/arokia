import { supabase } from '@/lib/supabase';

export async function resolveAudioUrl(audioAssetId: string): Promise<string> {
  const { data, error } = await supabase
    .from('audio_assets')
    .select('storage_path')
    .eq('id', audioAssetId)
    .single();
  if (error) throw error;
  if (!data) throw new Error(`audio asset not found: ${audioAssetId}`);
  if (!data.storage_path) throw new Error(`audio asset has no storage_path: ${audioAssetId}`);
  const { data: urlData } = supabase.storage.from('audio').getPublicUrl(data.storage_path);
  if (!urlData.publicUrl) throw new Error(`could not resolve public URL for: ${data.storage_path}`);
  return urlData.publicUrl;
}

export async function downloadTrack(_contentItemId: string): Promise<string> {
  // TODO Story 1.6: implement with expo-file-system after RNTP spike validates managed workflow
  throw new Error('downloadTrack: requires expo-file-system — implement in Story 1.6');
}

export async function prefetchQueue(_queue: string[]): Promise<void> {
  // TODO Story 1.6: implement progressive prefetch after expo-file-system is installed
  console.warn('[audio] prefetchQueue: stub — implement in Story 1.6');
}
