// Generates the ElevenLabs voiceover clips for the Week 2 lesson-overview video
// and writes them to ./public so Remotion can embed them via staticFile().
//
// Usage:
//   1. Set ELEVENLABS_API_KEY (or put the key in %USERPROFILE%\.secrets\elevenlabs-api-key).
//   2. node generate-week2-narration.mjs
//
// Same voice/model as the intro and Week 1. Spoken text mirrors the "Week 2"
// section of narration-scripts.md (accurate to courses/digital-literacy-1/weeks/
// week-02/presentation.html). The key is never logged. Each clip is checked
// against its scene's frame budget in src/weeks-data.ts (30fps).

import './load-env.mjs'; // auto-load .env (key never logged)
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const VOICE_ID = 'iKrofGyA12WC0e6AhZ8B';
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_FORMAT = 'mp3_44100_128';
const FPS = 30;

const VOICE_SETTINGS = {
  stability: 0.55,
  similarity_boost: 0.75,
  style: 0.0,
  use_speaker_boost: false,
};

const SCENES = [
  {
    id: 'w2-1-title',
    frames: 180,
    text: 'Week 2: Getting Online. Browsers, networks, and smart searching.',
  },
  {
    id: 'w2-2-why',
    frames: 300,
    text: 'Last week we looked inside the computer. This week we step out onto the internet — how to get there, how to find your way around, and how to find what you’re looking for.',
  },
  {
    id: 'w2-3-goals',
    frames: 630,
    text: 'Today has four goals. First, navigate the web with tabs, bookmarks, and history. Second, understand how you connect — wired, Wi-Fi, and cellular. Third, fix the most common connection problems yourself. And fourth, search smarter, keep track of your sources, and use online content fairly.',
  },
  {
    id: 'w2-4-how',
    frames: 480,
    text: 'We’ll start at the desktop and get comfortable in a web browser. Then we’ll see what brings the internet to your home — and what to try, step by step, when it stops working. We’ll finish by searching smarter and learning what you can and can’t reuse online.',
  },
  {
    id: 'w2-5-closing',
    frames: 210,
    text: 'By the end, the internet will feel like a place you know your way around. Let’s get online.',
  },
];

async function resolveApiKey() {
  if (process.env.ELEVENLABS_API_KEY) return process.env.ELEVENLABS_API_KEY.trim();
  try {
    const fromFile = await readFile(join(homedir(), '.secrets', 'elevenlabs-api-key'), 'utf8');
    if (fromFile.trim()) return fromFile.trim();
  } catch {
    /* no secrets file — fall through to the error below */
  }
  return '';
}

const apiKey = await resolveApiKey();
if (!apiKey) {
  console.error(
    'No API key found. Set ELEVENLABS_API_KEY, or put the key in ' +
      '%USERPROFILE%\\.secrets\\elevenlabs-api-key, then re-run.'
  );
  process.exit(1);
}
if (typeof fetch !== 'function') {
  console.error('Global fetch is unavailable — please use Node 18 or newer.');
  process.exit(1);
}

const publicDir = join(dirname(fileURLToPath(import.meta.url)), 'public');
await mkdir(publicDir, { recursive: true });

let overruns = 0;
for (const scene of SCENES) {
  const url =
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}/with-timestamps` +
    `?output_format=${OUTPUT_FORMAT}`;

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'xi-api-key': apiKey, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      text: scene.text,
      model_id: MODEL_ID,
      voice_settings: VOICE_SETTINGS,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    throw new Error(`TTS failed for ${scene.id} (HTTP ${res.status}): ${detail}`);
  }

  const data = await res.json();
  await writeFile(join(publicDir, `${scene.id}.mp3`), Buffer.from(data.audio_base64, 'base64'));

  const ends = data.alignment?.character_end_times_seconds ?? [];
  const clipSec = ends.length ? ends[ends.length - 1] : 0;
  const sceneSec = scene.frames / FPS;
  const fits = clipSec <= sceneSec;
  if (!fits) overruns += 1;
  console.log(
    `${scene.id}: ${clipSec.toFixed(1)}s audio / ${sceneSec.toFixed(1)}s scene` +
      (fits ? '  OK' : `  ** OVERRUNS by ${(clipSec - sceneSec).toFixed(1)}s **`)
  );
}

console.log(
  `\nDone. ${SCENES.length} clips written to public/.` +
    (overruns
      ? ` ${overruns} scene(s) need a larger durationInFrames in src/weeks-data.ts.`
      : ' All clips fit their scenes.')
);
