// Generates the ElevenLabs voiceover clips for the FULL Week 1 lesson video
// ("Inside the Computer") and writes them to ./public so Remotion can embed them via
// staticFile(). One clip per scene, in scene order (w1l-01 .. w1l-25).
//
// Usage:
//   1. Set ELEVENLABS_API_KEY (or put the key in %USERPROFILE%\.secrets\elevenlabs-api-key).
//   2. node generate-week1-lesson-narration.mjs
//
// Spoken text is the EXACT narration from video/digital-literacy-1/week1-video-script.md
// (the approved 25-row script). For the three `question` scenes the spoken text is the
// full "question … answer … why" line. Same voice/model as the intro and the Week 1/2
// overviews; the #2 voice settings (stability 0.55, use_speaker_boost false). The key is
// never logged. Uses the /with-timestamps endpoint so we can read each clip's exact length
// and also writes public/week1-lesson-durations.json (id → clip seconds) for tightening
// the provisional durationInFrames in src/week1-lesson-data.ts (WEEK1_LESSON, 30fps).

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

// id matches the `audio` field in WEEK1_LESSON (src/week1-lesson-data.ts). `frames` is the
// provisional scene budget there, used only for the fit/overrun report below.
const SCENES = [
  {
    id: 'w1l-01',
    frames: 825,
    text: "Take a look at the computer in front of you. The screen, the box, the keyboard, the cables. If it has ever felt like a mystery, that's about to change. Nobody is born knowing this — and by the end of this short video, you'll know what each part is and what it does.",
  },
  {
    id: 'w1l-02',
    frames: 1140,
    text: "In the next few minutes, you'll learn four things. First, how to name the common devices and the ports they plug into. Second, the difference between memory and storage — two things people often mix up. Third, what software is, and how to install it safely. And fourth, how to recognize the major operating systems, like Windows. Let's get started.",
  },
  {
    id: 'w1l-03',
    frames: 540,
    text: "First, the pieces you can touch. Everything you can pick up or plug in is called hardware — and it all falls into a few simple groups.",
  },
  {
    id: 'w1l-04',
    frames: 1194,
    text: "Start with two simple groups. Input devices send information in to the computer — your keyboard for typing, your mouse for pointing and clicking, a microphone for your voice, a webcam for video. Output devices send information out to you — the monitor that shows the picture, speakers or headphones that play sound, and a printer that puts your work on paper. Here's the easy way to remember it: input goes in, output comes out. A touchscreen does both at once.",
  },
  {
    id: 'w1l-05',
    frames: 1467,
    text: "Devices plug in through ports — the small openings on the back and sides. The most common is USB; it connects a keyboard, mouse, flash drive, or phone charger. USB-A is the flat rectangle, and USB-C is the small oval that fits either way up. HDMI carries picture and sound to a monitor with one cable. Ethernet is a wider plug, like a fat phone jack, for wired internet. And the power connector runs to the wall. Here's the good news: plugs are shaped to fit only the right port — so if a cable won't go in, turn it over or try another port. Never force it.",
  },
  {
    id: 'w1l-06',
    frames: 1140,
    text: "These parts come in every size. A desktop stays on a desk — powerful and easy to repair, with the tower, monitor, keyboard, and mouse as separate pieces. A laptop folds shut and runs on a battery, with the screen and keyboard built in. A tablet is a flat touchscreen, like a big phone. And a smartphone is a pocket computer that also makes calls. The big idea: all four are computers. They take input, do work, store information, and show output — just in different sizes for different jobs.",
  },
  {
    id: 'w1l-07',
    frames: 812,
    text: "You'll do this yourself in today's lab — Part 1 walks you around the real computer at your station, finding the ports and naming one input and one output device. Don't worry — you'll only look, never unplug. For now, let's open the box and see what's inside.",
  },
  {
    id: 'w1l-08',
    frames: 675,
    text: "Chapter two: inside the box. You don't have to memorize this — but three parts do the real work, and knowing their names helps you talk to a store clerk or a repair tech.",
  },
  {
    id: 'w1l-09',
    frames: 867,
    text: "Three main parts. The CPU is the brain — the processor that does the thinking and runs your programs. The RAM is short-term memory — the computer's desk space, holding whatever you're working on right now. And the drive is long-term storage — the filing cabinet that keeps your files, photos, and programs even when the power is off. Brain, desk, filing cabinet.",
  },
  {
    id: 'w1l-10',
    frames: 1467,
    text: "Those last two get mixed up the most, so let's be clear. Memory — RAM — is short-term, like your desk. It holds what's open right now, and it empties when you shut down; more RAM lets you run more at once. It's measured in gigabytes, like 8 or 16. Storage — the drive — is long-term, like a filing cabinet. It keeps your files when the power is off; more storage holds more files. It's measured in gigabytes or terabytes, and a terabyte is about a thousand gigabytes. Memory is the desk; storage is the cabinet.",
  },
  {
    id: 'w1l-11',
    frames: 757,
    text: "You'll find these numbers for yourself in Part 2 of the lab — you'll open Settings and This PC to read how much memory and storage your own computer has. Just reading them can't change a thing. Next, let's look at what runs on all this hardware.",
  },
  {
    id: 'w1l-12',
    frames: 540,
    text: "Chapter three: software. Hardware is what you can touch — software is what it runs. It's the instructions that make the parts do something useful.",
  },
  {
    id: 'w1l-13',
    frames: 1140,
    text: "Software comes in two kinds. System software is the operating system itself — it runs the whole computer, starts up when you turn it on, and manages the hardware for you. On the lab PCs, that's Windows. Application software — apps — are the programs you open to do a task: a web browser like Edge or Chrome, a word processor, a PDF reader, email, a calculator, a game. So: the system runs the computer, and the apps do your work.",
  },
  {
    id: 'w1l-14',
    frames: 1194,
    text: "You'll also hear about two ways software is shared. Proprietary software is owned by one company; you buy it or pay a subscription, and the inner code is private — like Microsoft Office or Windows. Open-source software has public code that's free to use, usually free to download, and maintained by a community — like Firefox, LibreOffice, or VLC. Which is better? Neither — it depends on your needs. Both kinds can be excellent. What matters most is where you get it.",
  },
  {
    id: 'w1l-15',
    frames: 1548,
    text: "So here's how to install a program safely. One: use a trusted source — the Microsoft Store, or the maker's own official website, like microsoft.com. Two: check the web address is the real company, not a look-alike with a slightly wrong name. Three: run the installer and read each screen — click Next carefully, and decline any extra toolbars you didn't ask for. Four: when Windows asks 'Do you want to allow this app to make changes?', click Yes only if you trust the source. And never install from a pop-up ad or an email link — 'your computer is infected, click here' is always a scam.",
  },
  {
    id: 'w1l-16',
    frames: 621,
    text: "In Part 3 of the lab, you'll open the Start menu and spot the apps already installed on your computer — a browser, a word processor, the Calculator. Last, let's meet the master program that ties it all together.",
  },
  {
    id: 'w1l-17',
    frames: 540,
    text: "Chapter four: the operating system. This is the master program that runs the whole computer — and once you know one, the rest feel familiar.",
  },
  {
    id: 'w1l-18',
    frames: 1086,
    text: "The operating system, or OS, starts the moment you power on and stays running the whole time. It shows your desktop, manages your files, and lets every app share the keyboard, screen, and memory. The computers in this lab run Microsoft Windows. The OS is what gives you the desktop, the taskbar, the Start menu, your windows, and File Explorer for finding your files.",
  },
  {
    id: 'w1l-19',
    frames: 1386,
    text: "You'll meet three families. Windows, from Microsoft, is the most common on desktops and laptops — and what this lab uses; look for the Start button in the bottom-left corner. macOS, from Apple, runs only on Mac computers — the same idea, with a slightly different look. And mobile: Android, from Google, runs on many phone brands, while iOS runs on iPhones and iPads — these use taps and swipes instead of a mouse. The reassuring part: learn one, and the others feel familiar. They all open programs, save files, and connect to the internet.",
  },
  {
    id: 'w1l-20',
    frames: 729,
    text: "In Part 4 of the lab, you'll find your own Windows version on the About page — and reading it, remember, can't change or break a thing. That's the whole tour, from the outside in. First, let's check what you remember.",
  },
  {
    id: 'w1l-21',
    frames: 812,
    text: "Quick check. A printer, a monitor, a keyboard, a speaker — which one is an input device? … It's the keyboard. You use it to put information into the computer. A printer, monitor, and speaker are all output devices — they send information out to you.",
  },
  {
    id: 'w1l-22',
    frames: 784,
    text: "Next. What's the difference between memory — RAM — and storage, the drive? … RAM is short-term, like your desk, and it empties when you shut down. Storage is long-term, like a filing cabinet, and it keeps your files even when the power is off.",
  },
  {
    id: 'w1l-23',
    frames: 648,
    text: "Last one. Where is the safest place to download a new program? … From a trusted source — the Microsoft Store, or the maker's official website. Never from a pop-up ad or an email link.",
  },
  {
    id: 'w1l-24',
    frames: 1329,
    text: "So, to recap. Hardware is what you touch — input devices send information in, output devices send it out, and they plug in through ports like USB and HDMI. Memory is the desk; storage is the filing cabinet. Software runs on the hardware — the operating system runs the computer, apps do your tasks, and you install only from trusted sources. And Windows, macOS, and mobile are all operating systems — learn one, and the rest feel familiar.",
  },
  {
    id: 'w1l-25',
    frames: 1194,
    text: "You did it. You can now name the parts of a computer, tell memory from storage, understand software, and recognize the major operating systems. That's a real foundation to build on. Take your handouts home, and in the lab, explore the real computer in front of you — you'll know exactly what you're looking at. Next week, we get online. We'll see you there.",
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

// Map of id → measured clip seconds, for tightening durationInFrames in WEEK1_LESSON.
await writeFile(
  join(publicDir, 'week1-lesson-durations.json'),
  JSON.stringify(durations, null, 2) + '\n'
);

console.log(
  `\nDone. ${SCENES.length} clips written to public/, plus week1-lesson-durations.json.` +
    (overruns
      ? ` ${overruns} scene(s) need a larger durationInFrames in src/week1-lesson-data.ts.`
      : ' All clips fit their scenes.')
);
