// Generates ElevenLabs voiceover clips for the "Digital Literacy — Level 1" intro
// and writes them to ./public so Remotion can embed them via staticFile().
//
// Usage:
//   1. Set ELEVENLABS_API_KEY in your environment (never paste it into a chat).
//   2. node generate-narration.mjs
//
// The API key is read from the environment and is never logged. One clip is
// generated per scene; the spoken text mirrors
// courses/digital-literacy-1/intro-video-transcript.html (with IC3 -> "I-C-3"
// and VA -> "V-A" so the narration is read aloud cleanly). Each clip is checked
// against its scene's frame budget in src/Intro.tsx (30fps) so we know whether a
// scene needs to be lengthened before rendering.

import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { homedir } from 'node:os';

const VOICE_ID = 'iKrofGyA12WC0e6AhZ8B';
const MODEL_ID = 'eleven_multilingual_v2';
const OUTPUT_FORMAT = 'mp3_44100_128';
const FPS = 30;

const VOICE_SETTINGS = {
  stability: 0.5,
  similarity_boost: 0.75,
  style: 0.0,
  use_speaker_boost: true,
};

// id      -> output filename (public/<id>.mp3) and <Audio> reference in Intro.tsx
// start/end -> the scene's frame range in src/Intro.tsx, used to flag overruns
// text    -> spoken narration (mirrors the transcript)
const SCENES = [
  {
    id: 'vo-1-welcome',
    start: 0,
    end: 240,
    text: 'Digital Literacy — Level 1. Veterans Upward Bound, a U.S. Department of Education TRIO program.',
  },
  {
    id: 'vo-2-what',
    start: 240,
    end: 720,
    text: 'Digital literacy is being able to use computers, the internet, and everyday digital tools comfortably and safely — for your health, your benefits, your family, and your goals.',
  },
  {
    id: 'vo-3-ic3',
    start: 720,
    end: 1170,
    text: 'This course follows the I-C-3 Digital Literacy objectives, Level 1. It is the first step of a Level 1, Level 2, Level 3 path — so you can keep building from here.',
  },
  {
    id: 'vo-4-roadmap',
    start: 1170,
    end: 2670,
    text:
      'Here is your roadmap — five weeks, two hours each. ' +
      'Week 1, Inside the Computer: devices, hardware, software, and operating systems. ' +
      'Week 2, Getting Online: browsers, networks and Wi-Fi, searching, and copyright. ' +
      'Week 3, Creating and Communicating: documents, files, printing, email, and teamwork. ' +
      'Week 4, Citizenship and Safety: identity, privacy, passwords, and online safety. ' +
      'Week 5, Review and Testing Day: a review game, then the Post-Test.',
  },
  {
    id: 'vo-5-how',
    start: 2670,
    end: 3420,
    text: 'We meet once a week for two hours, in the computer lab. Every week has a hands-on lab so you practice on a real computer. A Pre-Test in Week 1 and a Post-Test in Week 5 show how much you have grown.',
  },
  {
    id: 'vo-6-why',
    start: 3420,
    end: 4170,
    text: 'These are skills that serve you: manage your V-A benefits and health care online, stay connected with family and your community, and protect your identity, your devices, and your money.',
  },
  {
    id: 'vo-7-closing',
    start: 4170,
    end: 4800,
    text: 'Open Week 1 in your course dashboard, and take the Pre-Test when you are ready. You have got this.',
  },
];

// Env var first; fall back to the user's secrets store so a long-running shell
// that missed a freshly-set env var can still find the key. Never logged.
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

  // Exact clip length = end time of the final character in the alignment data.
  const ends = data.alignment?.character_end_times_seconds ?? [];
  const clipSec = ends.length ? ends[ends.length - 1] : 0;
  const sceneSec = (scene.end - scene.start) / FPS;
  const fits = clipSec <= sceneSec;
  if (!fits) overruns += 1;
  console.log(
    `${scene.id}: ${clipSec.toFixed(1)}s audio / ${sceneSec.toFixed(1)}s scene` +
      (fits ? '  OK' : `  ** OVERRUNS by ${(clipSec - sceneSec).toFixed(1)}s **`)
  );
}

console.log(
  `\nDone. ${SCENES.length} clips written to public/.` +
    (overruns ? ` ${overruns} scene(s) need lengthening before render.` : ' All clips fit their scenes.')
);
