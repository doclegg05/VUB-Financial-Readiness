// Bakes the measured narration lengths into WEEK2_LESSON's durationInFrames.
// Reads public/week2-lesson-durations.json (written by generate-week2-lesson-narration.mjs)
// and rewrites each scene's durationInFrames = round(seconds*30) + HOLD in src/weeks-data.ts,
// matched by its `audio: 'w2l-NN.mp3'` id. Run after generating the narration.

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FPS = 30;
const HOLD = 45; // ~1.5s on-screen hold after the last spoken word

const here = dirname(fileURLToPath(import.meta.url));
const durations = JSON.parse(
  await readFile(join(here, 'public', 'week2-lesson-durations.json'), 'utf8')
);
const dataPath = join(here, 'src', 'weeks-data.ts');
let src = await readFile(dataPath, 'utf8');

let changed = 0;
const total = Object.keys(durations).length;
for (const [id, sec] of Object.entries(durations)) {
  const frames = Math.max(90, Math.round(sec * FPS) + HOLD);
  const re = new RegExp(`(audio: '${id}\\.mp3',[\\s\\S]{0,120}?durationInFrames: )\\d+`);
  if (re.test(src)) {
    src = src.replace(re, `$1${frames}`);
    changed += 1;
  } else {
    console.warn(`! no match for ${id}`);
  }
}

await writeFile(dataPath, src);
const totalFrames = Object.values(durations).reduce(
  (s, sec) => s + Math.max(90, Math.round(sec * FPS) + HOLD),
  0
);
console.log(
  `Synced ${changed}/${total} durations into weeks-data.ts (HOLD=${HOLD}f). ` +
    `Total ${totalFrames} frames = ${(totalFrames / FPS / 60).toFixed(2)} min.`
);
