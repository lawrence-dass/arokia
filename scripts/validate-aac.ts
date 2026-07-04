import fs from 'node:fs';
import path from 'node:path';

const MAX_SIZE_BYTES = 3.5 * 1024 * 1024;
const DEFAULT_DURATION_SECONDS = 420;

function usage(): never {
  console.error('Usage: npx tsx scripts/validate-aac.ts <file.m4a> [--duration-sec 420]');
  process.exit(2);
}

const args = process.argv.slice(2);
const fileArg = args[0];
if (!fileArg || fileArg.startsWith('--')) usage();

let durationSeconds = DEFAULT_DURATION_SECONDS;
for (let i = 1; i < args.length; i += 1) {
  if (args[i] === '--duration-sec') {
    const value = Number(args[i + 1]);
    if (!Number.isFinite(value) || value <= 0) usage();
    durationSeconds = value;
    i += 1;
  } else {
    usage();
  }
}

const filePath = path.resolve(fileArg);
if (!fs.existsSync(filePath)) {
  console.error(JSON.stringify({ ok: false, error: 'FILE_NOT_FOUND', filePath }, null, 2));
  process.exit(1);
}

const stat = fs.statSync(filePath);
const extension = path.extname(filePath).toLowerCase();
const sizeMb = stat.size / (1024 * 1024);
const estimatedKbps = (stat.size * 8) / 1000 / durationSeconds;
const checks = {
  extensionIsM4a: extension === '.m4a',
  sizeWithinLimit: stat.size <= MAX_SIZE_BYTES,
  estimatedBitrateAtOrBelow64Kbps: estimatedKbps <= 64,
};
const ok = Object.values(checks).every(Boolean);

console.log(
  JSON.stringify(
    {
      ok,
      filePath,
      durationSeconds,
      sizeBytes: stat.size,
      sizeMb: Number(sizeMb.toFixed(3)),
      estimatedKbps: Number(estimatedKbps.toFixed(2)),
      maxSizeMb: 3.5,
      checks,
      note: 'This helper validates file size and estimated average bitrate. Confirm mono AAC codec with the audio provider export settings or ffprobe if available.',
    },
    null,
    2
  )
);

if (!ok) process.exit(1);
