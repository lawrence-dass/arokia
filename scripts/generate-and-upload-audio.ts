/**
 * Audio content pipeline: generate ElevenLabs audio for seeded quotes, upload to Supabase Storage,
 * and link each to its content_item. Credit-frugal by design.
 *
 * Run: node --env-file=.env.local --import tsx scripts/generate-and-upload-audio.ts --lang en [flags]
 *   --lang ta|en   (required) which language's quotes to voice
 *   --limit N      max quotes to process this run (default 5 — protects the free tier)
 *   --voice <id>   ElevenLabs voice id (default: Brian for en; ta has no default — pass one)
 *   --speed N      voice speed 0.7–1.2 (default 0.85, meditation pacing)
 *   --execute      actually generate/upload/link (default: dry run — shows plan + credit estimate, 0 credits)
 *   --force        re-process quotes that already have audio
 *
 * Only quotes WITHOUT audio are processed (unless --force). Credits are billed per input character;
 * the dry run shows the exact character total before you spend anything.
 */

import { createClient } from '@supabase/supabase-js';

const API = 'https://api.elevenlabs.io/v1';
const MODEL = 'eleven_multilingual_v2';
const OUTPUT_FORMAT = 'mp3_44100_64';
const DEFAULT_VOICE: Record<string, string | undefined> = {
  en: 'nPczCjzI2devNBz1zQrb', // Brian — Deep, Resonant, Comforting (natural for English)
  ta: undefined, // no good default yet — Tamil needs a Voice-Library/cloned Tamil voice
};
const CHAR_CAP_WITHOUT_FORCE = 9000; // keep a single run under the ~10k free tier

function flag(n: string) {
  return process.argv.includes(n);
}
function opt(n: string) {
  const i = process.argv.indexOf(n);
  return i >= 0 ? process.argv[i + 1] : undefined;
}
function slug(ref: string) {
  return ref
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function tts(voiceId: string, text: string, speed: number): Promise<Buffer> {
  const res = await fetch(`${API}/text-to-speech/${voiceId}?output_format=${OUTPUT_FORMAT}`, {
    method: 'POST',
    headers: { 'xi-api-key': process.env.ELEVENLABS_API_KEY!, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability: 0.6, similarity_boost: 0.75, style: 0, speed },
    }),
  });
  if (!res.ok) throw new Error(`ElevenLabs ${res.status}: ${await res.text()}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const lang = opt('--lang');
  if (lang !== 'ta' && lang !== 'en') {
    console.error("ERROR: --lang must be 'ta' or 'en'.");
    process.exit(1);
  }
  const limit = Number(opt('--limit') ?? '5');
  const speed = Number(opt('--speed') ?? '0.85');
  const voiceId = opt('--voice') ?? DEFAULT_VOICE[lang];
  const execute = flag('--execute');

  const url = process.env.EXPO_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) {
    console.error('ERROR: EXPO_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY required.');
    process.exit(1);
  }
  const admin = createClient(url, serviceKey, { auth: { persistSession: false } });

  const { data: quotes, error } = await admin
    .from('content_items')
    .select('id, verse_reference, scripture_text, audio_asset_id')
    .eq('content_type', 'quote')
    .eq('language_code', lang)
    .order('verse_reference');
  if (error) {
    console.error('ERROR: could not read quotes:', error.message);
    process.exit(1);
  }

  const pending = (quotes ?? [])
    .filter((q) => flag('--force') || !q.audio_asset_id)
    .slice(0, limit);
  const totalChars = pending.reduce((n, q) => n + [...q.scripture_text].length, 0);

  console.log(`\nLanguage: ${lang} | voice: ${voiceId ?? '(none)'} | speed: ${speed}`);
  console.log(
    `Quotes without audio: ${(quotes ?? []).filter((q) => !q.audio_asset_id).length} | processing this run: ${pending.length} (limit ${limit})`
  );
  console.log(`Estimated credits: ~${totalChars} (billed per input character)\n`);
  for (const q of pending)
    console.log(`  ${q.verse_reference}  (${[...q.scripture_text].length} chars)`);

  if (!execute) {
    console.log('\nDry run — nothing generated, 0 credits. Add --execute to run.');
    return;
  }
  if (!voiceId) {
    console.error(
      `\nERROR: no voice for '${lang}'. Pass --voice <id> (run generate-audio.ts --voices to list).`
    );
    process.exit(1);
  }
  if (totalChars > CHAR_CAP_WITHOUT_FORCE && !flag('--force')) {
    console.error(
      `\nERROR: this run would spend ~${totalChars} credits (> ${CHAR_CAP_WITHOUT_FORCE}). Lower --limit or pass --force.`
    );
    process.exit(1);
  }
  if (pending.length === 0) {
    console.log('Nothing to do — every quote already has audio.');
    return;
  }

  let done = 0;
  for (const q of pending) {
    const path = `${lang}/quote/${slug(q.verse_reference)}.mp3`;
    try {
      const audio = await tts(voiceId, q.scripture_text, speed);
      const { error: uErr } = await admin.storage
        .from('audio')
        .upload(path, audio, { contentType: 'audio/mpeg', upsert: true });
      if (uErr) throw new Error(`upload: ${uErr.message}`);
      let assetId: string;
      const { data: ex } = await admin
        .from('audio_assets')
        .select('id')
        .eq('storage_path', path)
        .limit(1);
      if (ex && ex.length) assetId = ex[0].id;
      else {
        const { data, error: aErr } = await admin
          .from('audio_assets')
          .insert({ storage_path: path, format: 'mp3', bitrate_kbps: 64, channels: 1 })
          .select('id')
          .single();
        if (aErr) throw new Error(`asset: ${aErr.message}`);
        assetId = data.id;
      }
      const { error: lErr } = await admin
        .from('content_items')
        .update({ audio_asset_id: assetId })
        .eq('id', q.id);
      if (lErr) throw new Error(`link: ${lErr.message}`);
      done++;
      console.log(`  ✓ ${q.verse_reference} -> ${path}`);
    } catch (e) {
      console.error(`  ✗ ${q.verse_reference}: ${(e as Error).message}`);
    }
  }
  console.log(`\nDone: ${done}/${pending.length} generated + linked (~${totalChars} credits).`);
}

main();
