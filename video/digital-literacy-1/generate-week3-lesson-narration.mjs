// Generates the ElevenLabs voiceover clips for the FULL Week 3 lesson video
// ("Creating & Communicating") and writes them to ./public so Remotion can embed
// them via staticFile(). One clip per scene, in scene order (w3l-01 .. w3l-24).
//
// Usage:
//   1. Set ELEVENLABS_API_KEY (or put the key in %USERPROFILE%\.secrets\elevenlabs-api-key).
//   2. node generate-week3-lesson-narration.mjs
//
// Spoken text is the EXACT narration from video/digital-literacy-1/week3-video-script.md
// (the approved 24-row script). For the three `question` scenes the spoken text is the
// full "question … answer … why" line. Same voice/model as the intro and the Week 1/2
// overviews; the #2 voice settings (stability 0.55, use_speaker_boost false). The key is
// never logged. Uses the /with-timestamps endpoint so we can read each clip's exact length
// and also writes public/week3-lesson-durations.json (id → clip seconds) for tightening
// the provisional durationInFrames in src/week3-lesson-data.ts (WEEK3_LESSON, 30fps).

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

// id matches the `audio` field in WEEK3_LESSON (src/week3-lesson-data.ts). `frames` is the
// provisional scene budget there (Math.max(90, Math.ceil(words / 2.2 * 30) + 75)), used
// only for the fit/overrun report below.
const SCENES = [
  {
    id: 'w3l-01',
    frames: 785,
    text: "You sat down, you typed a letter, you got it just right — and then it was gone. It happens to almost everyone. The good news: by the end of this short video, you'll know how to make your work, save it so it's never lost, and share it the right way.",
  },
  {
    id: 'w3l-02',
    frames: 580,
    text: "In the next few minutes, you'll learn four things: how to create and save a document, how to give credit for your information, how to print what you want, and how to communicate online. Let's get started.",
  },
  {
    id: 'w3l-03',
    frames: 485,
    text: "First, let's make something and keep it safe. The two everyday tools are a word processor and a presentation program — and if you can type, you're already halfway there.",
  },
  {
    id: 'w3l-04',
    frames: 1003,
    text: "A word processor is simply a program for writing — Microsoft Word is the common one. Making a document takes three steps. One: open Word — press the Windows key, type 'Word,' and choose 'Blank document.' Two: type your text — the blinking line, called the cursor, shows where your words appear. Three: make it look good with the Home tab — bold, a bigger size, or centered.",
  },
  {
    id: 'w3l-05',
    frames: 935,
    text: "There are two kinds of files you'll make most. A document is one long page you write on, like a letter — that's Word. A presentation is a stack of 'slides,' each with one headline and a few points — like the screens in this video. That program is PowerPoint. The rule for slides: one idea per slide, large text, a few words.",
  },
  {
    id: 'w3l-06',
    frames: 907,
    text: "When you use words or facts from somewhere else, you give credit. Referencing means telling your reader where you found your information. A citation is the short line that does it — the author, the title, the website, and the date. A fair warning: copying someone's words or pictures without credit is called plagiarism, so always say where it came from.",
  },
  {
    id: 'w3l-07',
    frames: 1030,
    text: "Now the most important habit of all: save your work. Press Control plus S the moment you start, and again every few minutes — the surest way to never lose anything. For things that matter, remember 3-2-1: three copies, in two places, with one away from home. The cloud just means storage on the internet, like OneDrive or Google Drive. And give every file a clear name with the date.",
  },
  {
    id: 'w3l-08',
    frames: 853,
    text: "A good file name is a gift to your future self. A clear name like 'VA-Benefits-Letter-2026-06' tells you what's inside, and because the date is written year-then-month, your files line up in order. A vague name like 'Document1' tells you nothing a year from now. Use words you'll remember, and put related files together in a folder.",
  },
  {
    id: 'w3l-09',
    frames: 621,
    text: "You'll do all of this in today's lab. Part 1 walks you through making a document and saving it with a good name, and Part 2 has you add a simple citation. For now, let's get your work onto paper.",
  },
  {
    id: 'w3l-10',
    frames: 403,
    text: "Chapter two: printing. Before any paper comes out, you make a couple of simple choices — and you can always check your work first.",
  },
  {
    id: 'w3l-11',
    frames: 866,
    text: "Two choices change how your page looks. The first is orientation — tall or wide. Portrait is tall, like a letter — the usual choice. Landscape is wide, like a calendar — good for a wide table or a photo. The second is sides. Single-sided prints one page per sheet; double-sided prints on both sides, which saves paper.",
  },
  {
    id: 'w3l-12',
    frames: 975,
    text: "So how do you print? One: press Control plus P — a preview appears on the right, showing your page exactly as it will print. Two: choose your settings — the printer, the copies, which pages, and color or black-and-white. Three: choose how — a printer on a cable, a wireless printer on your Wi-Fi, or Save as PDF to make a file instead of paper.",
  },
  {
    id: 'w3l-13',
    frames: 675,
    text: "One habit saves more paper than any other: always look at the preview before you print. It shows whether your text fits — all before a single sheet comes out. If something looks wrong, fix it first. And nothing here can hurt your computer.",
  },
  {
    id: 'w3l-14',
    frames: 457,
    text: "You'll try all of these in the lab's Part 3 — without printing a single page, by using Save as PDF. Now, let's talk about communicating with others.",
  },
  {
    id: 'w3l-15',
    frames: 335,
    text: "Chapter three: communicating and working together online — kindly and clearly. A few small habits make all the difference.",
  },
  {
    id: 'w3l-16',
    frames: 921,
    text: "Whether it's an email or a post, a good message has a clear subject line, a polite greeting and your name, and gets to the point. A poor one has no subject, is written in all capital letters — which reads like shouting — or is sent in anger. When in doubt, wait: save it as a draft and come back later.",
  },
  {
    id: 'w3l-17',
    frames: 948,
    text: "Email has four buttons that work very differently. Reply answers only the person who sent the message — use this most of the time. Reply All answers the sender and everyone who got it — only when they all truly need it. Forward sends the message on to someone new. And Bcc, blind carbon copy, sends a copy without the others seeing that address.",
  },
  {
    id: 'w3l-18',
    frames: 866,
    text: "Two more gentle habits. First, inclusive language — words that welcome everyone and leave no one out. A simple 'Hi everyone' is warmer than assuming everyone is the same. Second, collaboration, which means working together. You can edit the same document at the same time — that's synchronous — or at different times, leaving comments — that's asynchronous.",
  },
  {
    id: 'w3l-19',
    frames: 566,
    text: "You'll put this to work in the lab — Part 4 has you choose the right email button for real situations, and Part 5 walks through the famous 'reply-all' mistake. First, let's check what you remember.",
  },
  {
    id: 'w3l-20',
    frames: 689,
    text: "Quick check. An email was sent to ten people, but only the sender needs your answer. Which button do you use? … Reply. Reply goes to the sender only — Reply All would send it to all ten, which is usually unnecessary and sometimes embarrassing.",
  },
  {
    id: 'w3l-21',
    frames: 498,
    text: "Next. Which file name will be easiest to find next year: 'Document1,' or 'VA-Benefits-Letter-2026-06'? … VA-Benefits-Letter-2026-06. It describes what's inside and includes the date, so it's clear and sorts in order.",
  },
  {
    id: 'w3l-22',
    frames: 594,
    text: "Last one. You want a tall page for a letter — which orientation do you choose? … Portrait. Portrait is tall, like a letter. Landscape is wide, like a calendar, and is better for wide tables or photos.",
  },
  {
    id: 'w3l-23',
    frames: 744,
    text: "So, to recap. Save early and often with Control-S, a clear dated name, and a 3-2-1 backup. Give credit with a simple citation. To print, press Control-P, check the preview, and choose your settings — or Save as PDF. And communicate kindly: Reply for the sender, and welcoming words.",
  },
  {
    id: 'w3l-24',
    frames: 894,
    text: "You did it. You now know how to create your work, save it so it's never lost, print it the way you want, and share it respectfully. Take your handouts home, and this week, try it for real — make one document, give it a good name, and back it up. Next week: citizenship and safety. We'll see you there.",
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

const durations = {};
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
  durations[scene.id] = clipSec;

  const sceneSec = scene.frames / FPS;
  const fits = clipSec <= sceneSec;
  if (!fits) overruns += 1;
  console.log(
    `${scene.id}: ${clipSec.toFixed(1)}s audio / ${sceneSec.toFixed(1)}s scene` +
      (fits ? '  OK' : `  ** OVERRUNS by ${(clipSec - sceneSec).toFixed(1)}s **`)
  );
}

// Map of id → measured clip seconds, for tightening durationInFrames in WEEK3_LESSON.
await writeFile(
  join(publicDir, 'week3-lesson-durations.json'),
  JSON.stringify(durations, null, 2) + '\n'
);

console.log(
  `\nDone. ${SCENES.length} clips written to public/, plus week3-lesson-durations.json.` +
    (overruns
      ? ` ${overruns} scene(s) need a larger durationInFrames in src/week3-lesson-data.ts.`
      : ' All clips fit their scenes.')
);
