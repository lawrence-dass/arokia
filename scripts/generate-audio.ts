/**
 * Story 1.8 — ElevenLabs Tamil voice generation (credit-frugal).
 *
 * Run: node --env-file=.env.local --import tsx scripts/generate-audio.ts [flags]
 *
 * Credits are billed per INPUT character (ElevenLabs). This script is designed to spend as little
 * as possible while you dial in the voice:
 *   • Dry run by default — prints the exact text, character count, and credit estimate. NO API call.
 *   • --voices   list available voices (0 credits) so you can pick one for the Tamil Shepherd's Voice.
 *   • --credits  show your remaining ElevenLabs credits (0 credits).
 *   • --execute  actually generate ONE sample. Needs a voice id (--voice <id> or ELEVENLABS_VOICE_ID).
 *   • --text "…" custom text (defaults to a single short seeded Tamil quote — Matthew 11:28).
 *   • --out <path>  output file (default audio-out/sample.mp3). Skipped if it already exists (--force to redo).
 *   • --force    regenerate even if the output exists / bypass the large-text guard.
 *
 * Produces an MP3 (playable immediately). If ffmpeg is installed, it also transcodes to a 64 kbps
 * mono .m4a (the production format) and runs scripts/validate-aac.ts on it.
 */

import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';
import { spawnSync } from 'child_process';

const API = 'https://api.elevenlabs.io/v1';
const MODEL = 'eleven_multilingual_v2';
const OUTPUT_FORMAT = 'mp3_44100_64'; // 64 kbps MP3 — free-tier safe, close to the .m4a target
const DEFAULT_TEXT =
  'வருத்தப்பட்டுப் பாரஞ்சுமக்கிறவர்களே நீங்கள் எல்லாரும் என்னிடத்தில் வாருங்கள்; நான் உங்களுக்கு இளைப்பாருதல் தருவேன்.'; // Matthew 11:28 (already seeded)
const MAX_CHARS_WITHOUT_FORCE = 2000; // guard against an accidental large spend

function flag(name: string): boolean {
  return process.argv.includes(name);
}
function opt(name: string): string | undefined {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : undefined;
}

const apiKey = process.env.ELEVENLABS_API_KEY;

function requireKey(): string {
  if (!apiKey) {
    console.error(
      'ERROR: ELEVENLABS_API_KEY not set in .env.local (needed for API calls, not for a dry run).'
    );
    process.exit(1);
  }
  return apiKey;
}

async function apiGet(path: string): Promise<any> {
  const res = await fetch(`${API}${path}`, { headers: { 'xi-api-key': requireKey() } });
  if (!res.ok) {
    if (res.status === 401) {
      console.error(
        `\nERROR: 401 — your API key lacks the permission for ${path}. In the ElevenLabs dashboard ` +
          `(Profile → API Keys → edit) grant: user_read, voices_read, text_to_speech. Or copy a voice ` +
          `id from the website and skip --voices.`
      );
    } else {
      console.error(`\nERROR: GET ${path} -> ${res.status} ${res.statusText}\n${await res.text()}`);
    }
    process.exit(1);
  }
  return res.json();
}

// Best-effort: needs the key's `user_read` permission. Returns null (with a hint) if unavailable,
// so a text_to_speech-only key can still generate.
async function showCredits(): Promise<{ used: number; limit: number } | null> {
  const res = await fetch(`${API}/user/subscription`, { headers: { 'xi-api-key': requireKey() } });
  if (!res.ok) {
    console.log(
      `(Could not read credit balance — key lacks 'user_read' permission. Generation still works.)`
    );
    return null;
  }
  const sub = await res.json();
  const used = sub.character_count ?? 0;
  const limit = sub.character_limit ?? 0;
  console.log(`Credits: ${used}/${limit} used (${limit - used} remaining) — tier: ${sub.tier}`);
  return { used, limit };
}

async function main() {
  if (flag('--credits')) {
    await showCredits();
    return;
  }

  if (flag('--voices')) {
    const data = await apiGet('/voices');
    console.log(
      '\nAvailable voices (pick one and set ELEVENLABS_VOICE_ID or pass --voice <id>):\n'
    );
    for (const v of data.voices ?? []) {
      const labels = Object.values(v.labels ?? {}).join(', ');
      console.log(`  ${v.voice_id}  ${v.name}${labels ? `  [${labels}]` : ''}`);
    }
    console.log('\n(Listing voices costs 0 credits.)');
    return;
  }

  const text = opt('--text') ?? DEFAULT_TEXT;
  const chars = [...text].length;
  const voiceId = opt('--voice') ?? process.env.ELEVENLABS_VOICE_ID;
  const out = opt('--out') ?? 'audio-out/sample.mp3';

  console.log('\n--- ElevenLabs generation ---');
  console.log(`model:        ${MODEL}`);
  console.log(`format:       ${OUTPUT_FORMAT}`);
  console.log(`voice:        ${voiceId ?? '(none — run --voices to pick one)'}`);
  console.log(`text (${chars} chars): ${text}`);
  console.log(`est. credits: ~${chars} (billed per input character)`);
  console.log(`output:       ${out}`);

  if (!flag('--execute')) {
    console.log('\nDry run — no API call, 0 credits spent. Add --execute to generate.');
    if (!voiceId)
      console.log('First set a voice: run with --voices, then ELEVENLABS_VOICE_ID=<id>.');
    return;
  }

  if (!voiceId) {
    console.error(
      '\nERROR: --execute needs a voice. Run --voices, then set ELEVENLABS_VOICE_ID or pass --voice <id>.'
    );
    process.exit(1);
  }
  if (chars > MAX_CHARS_WITHOUT_FORCE && !flag('--force')) {
    console.error(
      `\nERROR: text is ${chars} chars (> ${MAX_CHARS_WITHOUT_FORCE}). Pass --force to spend that many credits.`
    );
    process.exit(1);
  }
  if (existsSync(out) && !flag('--force')) {
    console.log(
      `\n${out} already exists — skipping (pass --force to regenerate and re-spend credits).`
    );
    return;
  }

  console.log('');
  const before = await showCredits();
  const beforeUsed = before?.used ?? null;

  // Meditation-tuned: slower pacing + high stability for a calm, unhurried, consistent read.
  // speed 0.7–1.2 (1 = normal); --speed overrides.
  const speed = Number(opt('--speed') ?? '0.85');
  const res = await fetch(`${API}/text-to-speech/${voiceId}?output_format=${OUTPUT_FORMAT}`, {
    method: 'POST',
    headers: { 'xi-api-key': requireKey(), 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text,
      model_id: MODEL,
      voice_settings: { stability: 0.6, similarity_boost: 0.75, style: 0, speed },
    }),
  });
  if (!res.ok) {
    console.error(
      `\nERROR: generation failed -> ${res.status} ${res.statusText}\n${await res.text()}`
    );
    process.exit(1);
  }
  const audio = Buffer.from(await res.arrayBuffer());
  mkdirSync(dirname(out), { recursive: true });
  writeFileSync(out, audio);
  console.log(`\nSaved ${out} (${(audio.length / 1024).toFixed(0)} KB).`);

  const after = await showCredits();
  if (beforeUsed !== null && after) {
    console.log(`Spent this run: ${after.used - beforeUsed} credits.`);
  } else {
    console.log(
      `Spent this run: ~${chars} credits (estimated; grant 'user_read' for exact figures).`
    );
  }

  // Optional: transcode to the production 64 kbps mono .m4a if ffmpeg is available.
  const ffmpeg = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  if (ffmpeg.status === 0) {
    const m4a = out.replace(/\.mp3$/, '.m4a');
    const t = spawnSync(
      'ffmpeg',
      ['-y', '-i', out, '-ac', '1', '-c:a', 'aac', '-b:a', '64k', m4a],
      {
        stdio: 'inherit',
      }
    );
    if (t.status === 0) {
      console.log(`Transcoded -> ${m4a} (64 kbps mono AAC).`);
      console.log(
        `Validate: npx tsx scripts/validate-aac.ts ${m4a} --duration-sec ${Math.round(chars / 15)}`
      );
    }
  } else {
    console.log(
      '\nffmpeg not found — MP3 is ready to listen. For the production .m4a: brew install ffmpeg, then re-run.'
    );
  }

  console.log(`\nListen: open ${out}\n`);
}

main();
