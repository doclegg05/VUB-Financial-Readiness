// Generates the ElevenLabs voiceover clips for the Week 1 lesson-overview video
// and writes them to ./public so Remotion can embed them via staticFile().
//
// Usage:
//   1. Set ELEVENLABS_API_KEY (or put the key in %USERPROFILE%\.secrets\elevenlabs-api-key).
//   2. node generate-week1-narration.mjs
//
// Same voice/model as the course intro. The spoken text mirrors the "Week 1
// Lesson Overview" section of narration-scripts.md (reviewed for accuracy against
// courses/digital-literacy-1/weeks/week-01/presentation.html). The key is never logged.
// Each clip is checked against its scene's frame budget in src/weeks-data.ts (30fps).

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

// id -> public/<id>.mp3 and the `audio` reference in src/weeks-data.ts
// frames -> the scene's durationInFrames in src/weeks-data.ts (used to flag overruns)
const SCENES = [
  {
    id: 'w1-1-title',
    frames: 180,
    text: 'Week 1: Inside the Computer. Hardware, devices, software, and operating systems.',
  },
  {
    id: 'w1-2-why',
    frames: 450,
    text: 'Before we go online or create anything, it helps to understand the machine itself. This week is about the computer in front of you — the different forms it takes, from desktops to phones, the parts inside, and the software it runs.',
  },
  {
    id: 'w1-3-goals',
    frames: 630,
    text: 'Today has four goals. First, name the common input and output devices, and the ports they plug into. Second, tell the difference between memory and storage. Third, understand software, and install programs safely. And fourth, recognize the operating systems you’ll meet most — Windows, macOS, Android, and iOS.',
  },
  {
    id: 'w1-4-how',
    frames: 600,
    text: 'We’ll start with a Pre-Test — about twenty questions, with no time limit. It isn’t pass or fail; it simply records where you’re starting, so the Week 5 Post-Test can show how far you’ve come. From there, we’ll walk through the main ideas together, do a quick Knowledge Check, and then practice hands-on with the computer at your station.',
  },
  {
    id: 'w1-5-closing',
    frames: 210,
    text: 'It all starts here — inside the computer. Let’s take a look.',
  },
];

// Env var first; fall back to the user's secrets store. Never logged.
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
