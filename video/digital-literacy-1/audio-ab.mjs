// One-line A/B for the "tunnel voice" fix: regenerates the exact Week 2 line
// `w2-2-why` with CLEANER settings (speaker_boost OFF) so it can be compared,
// in the browser gallery, against the current public/w2-2-why.mp3 (speaker_boost ON)
// and an EQ'd version. Writes out/audio-clean.mp3. The key is never logged.

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const VOICE_ID = 'iKrofGyA12WC0e6AhZ8B';
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_FORMAT = 'mp3_44100_128';
const TEXT =
  'Last week we looked inside the computer. This week we step out onto the internet — how to get there, how to find your way around, and how to find what you’re looking for.';

// Cleaner than the current pipeline: speaker_boost OFF, slightly steadier stability.
const VOICE_SETTINGS = { stability: 0.55, similarity_boost: 0.75, style: 0.0, use_speaker_boost: false };

async function resolveApiKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  try {
    const k = await readFile(join(homedir(), '.secrets', 'elevenlabs-api-key'), 'utf8');
    if (k.trim()) return k.trim();
  } catch {
    /* fall through */
  }
  return '';
}

const apiKey = await resolveApiKey();
if (!apiKey) {
  console.error('No API key found (ELEVENLABS_API_KEY or %USERPROFILE%\\.secrets\\elevenlabs-api-key).');
  process.exit(1);
}

const outDir = join(dirname(fileURLToPath(import.meta.url)), 'out');
await mkdir(outDir, { recursive: true });

const res = await fetch(
  `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}?output_format=${OUTPUT_FORMAT}`,
  {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({ text: TEXT, model_id: MODEL_ID, voice_settings: VOICE_SETTINGS }),
  }
);
if (!res.ok) throw new Error(`TTS failed (HTTP ${res.status}): ${await res.text()}`);

await writeFile(join(outDir, 'audio-clean.mp3'), Buffer.from(await res.arrayBuffer()));
console.log('Wrote out/audio-clean.mp3 (speaker_boost OFF).');
