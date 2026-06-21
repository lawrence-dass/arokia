import { File, Paths } from 'expo-file-system';
import * as Sentry from '@sentry/react-native';
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

export async function downloadTrack(contentItemId: string): Promise<string> {
  const { data, error } = await supabase
    .from('audio_assets')
    .select('storage_path')
    .eq('content_item_id', contentItemId)
    .single();
  if (error) throw error;
  if (!data?.storage_path) throw new Error(`no audio asset for content item: ${contentItemId}`);

  const { data: urlData } = supabase.storage.from('audio').getPublicUrl(data.storage_path);
  if (!urlData.publicUrl) throw new Error(`could not resolve public URL for: ${data.storage_path}`);

  // Flatten storage path to a safe filename (e.g. "ta/quote/abc.m4a" → "ta_quote_abc.m4a")
  const filename = data.storage_path.replace(/\//g, '_');
  const cachedFile = new File(Paths.document, filename);

  if (cachedFile.exists) return cachedFile.uri;

  const downloaded = await File.downloadFileAsync(urlData.publicUrl, cachedFile);
  return downloaded.uri;
}

export async function prefetchQueue(contentItemIds: string[]): Promise<void> {
  for (const id of contentItemIds) {
    try {
      await downloadTrack(id);
    } catch (e) {
      Sentry.captureException(e);
      console.warn('[audio] prefetchQueue: failed to prefetch', id, e);
    }
  }
}
