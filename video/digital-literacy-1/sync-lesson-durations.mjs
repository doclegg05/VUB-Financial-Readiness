// Generalized: bakes measured narration lengths into a week's lesson data.
// Usage: node sync-lesson-durations.mjs <weekNumber>
// Reads public/week<N>-lesson-durations.json and rewrites each scene's
// durationInFrames = round(seconds*30) + HOLD in src/week<N>-lesson-data.ts,
// matched by its `audio: 'w<N>l-NN.mp3'` id. (Week 2 lives in weeks-data.ts; use sync-week2-durations.mjs for it.)

import { readFile, writeFile } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const FPS = 30;
const HOLD = 45; // ~1.5s on-screen hold after the last spoken word

const week = process.argv[2];
if (!week) {
  console.error('usage: node sync-lesson-durations.mjs <weekNumber>');
  process.exit(1);
}

const here = dirname(fileURLToPath(import.meta.url));
const durations = JSON.parse(
  await readFile(join(here, 'public', `week${week}-lesson-durations.json`), 'utf8')
);
const dataPath = join(here, 'src', `week${week}-lesson-data.ts`);
let src = await readFile(dataPath, 'utf8');

let changed = 0;
const total = Object.keys(durations).length;
for (const [id, sec] of Object.entries(durations)) {
  const frames = Math.max(90, Math.round(sec * FPS) + HOLD);
  // Value may be a literal (594) or the provisional formula (Math.max(90, Math.ceil(.../2.2*30)+75)).
  const re = new RegExp(
    `(audio: '${id}\\.mp3',[\\s\\S]{0,200}?durationInFrames: )(?:Math\\.max\\([^\\n]*\\)|\\d+)`
  );
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
  `Week ${week}: synced ${changed}/${total} durations (HOLD=${HOLD}f). ` +
    `Total ${totalFrames} frames = ${(totalFrames / FPS / 60).toFixed(2)} min.`
);
