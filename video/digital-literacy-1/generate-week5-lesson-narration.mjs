// Generates the ElevenLabs voiceover clips for the FULL Week 5 lesson video
// ("Review & Testing Day") and writes them to ./public so Remotion can embed them via
// staticFile(). One clip per scene, in scene order (w5l-01 .. w5l-23).
//
// Usage:
//   1. Set ELEVENLABS_API_KEY (or put the key in %USERPROFILE%\.secrets\elevenlabs-api-key).
//   2. node generate-week5-lesson-narration.mjs
//
// Spoken text is the EXACT narration from video/digital-literacy-1/week5-video-script.md
// (the approved 23-row review script). For the six `question` scenes the spoken text is the
// full "question … answer … why" line. Same voice/model as the intro and the Week 1/2/3/4
// overviews; the #2 voice settings (stability 0.55, use_speaker_boost false). The key is
// never logged. Uses the /with-timestamps endpoint so we can read each clip's exact length
// and also writes public/week5-lesson-durations.json (id → clip seconds) for tightening
// the provisional durationInFrames in src/week5-lesson-data.ts (WEEK5_LESSON, 30fps).

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

// id matches the `audio` field in WEEK5_LESSON (src/week5-lesson-data.ts). `frames` is the
// provisional scene budget there, used only for the fit/overrun report below.
const SCENES = [
  {
    id: 'w5l-01',
    frames: 880,
    text: "Welcome back — and welcome to the last day. Five weeks ago, a lot of this was brand new. Today there's no new material to learn: today is your victory lap. We'll play a friendly review game together, then you'll take the Post-Test so you can see, in black and white, just how far you've come.",
  },
  {
    id: 'w5l-02',
    frames: 948,
    text: "Here's how today works. First, a friendly, game-show-style review of everything from Weeks one through four — we read a question, you think it through, then we reveal the answer together. Then the Post-Test, the same kind of test you took back in Week one. And finally, a look at what comes next. No grades, no pressure — you've already done the hard part.",
  },
  {
    id: 'w5l-03',
    frames: 839,
    text: "One small rule makes the game work: don't peek. When you see a question, take a guess first — out loud or in your head — and only then reveal the answer. That little moment of effort is exactly what helps the answer stick. There's no score-keeping; it's all about remembering. Ready? Let's begin.",
  },
  {
    id: 'w5l-04',
    frames: 416,
    text: "Our first area is the one we started with: the machine itself — its parts, and the software that runs it. Think back to Week one.",
  },
  {
    id: 'w5l-05',
    frames: 839,
    text: "First question. A keyboard, a mouse, and a microphone are all examples of one kind of device — what do we call them, and what's the opposite kind? … They are input devices — they send information into the computer. The opposite is an output device, like a monitor, printer, or speakers, which sends information out to you.",
  },
  {
    id: 'w5l-06',
    frames: 1098,
    text: "Next. What's the difference between memory, also called RAM, and storage — and what is an operating system? … Memory, or RAM, is the short-term workspace the computer uses while it's running; it empties when you shut down. Storage — your hard drive — keeps your files for the long term, even with the power off. And the operating system, like Windows, is the main software that runs the device and lets all your other programs work.",
  },
  {
    id: 'w5l-07',
    frames: 853,
    text: "Here's the easy way to remember it. Memory is like the desk you're working at right now — roomy while you work, but cleared off at the end of the day. Storage is the filing cabinet beside the desk — it holds your papers safely until you need them again, whether the power's on or off.",
  },
  {
    id: 'w5l-08',
    frames: 321,
    text: "Our second area: getting online — browsers, Wi-Fi, and finding good answers on the web. This was Week two.",
  },
  {
    id: 'w5l-09',
    frames: 1235,
    text: "Which keyboard shortcut finds a word on a webpage or in a document — and what does Creative Commons mean? … Control plus F opens 'Find' and jumps straight to a word on a page or in a file. And Creative Commons is a kind of permission a creator adds to their work telling you how you may use it — often free to reuse if you give them credit. That's different from public domain, which is free for anyone because it's no longer under copyright.",
  },
  {
    id: 'w5l-10',
    frames: 812,
    text: "And a few terms that come up again and again: a URL is simply a website's address — the part you type to reach a site. Wi-Fi is your wireless internet connection — check the little signal icon to see if you're connected. Small words, but you'll use them every time you go online.",
  },
  {
    id: 'w5l-11',
    frames: 307,
    text: "Our third area brings two weeks together: creating your own work, and communicating with others — Week three.",
  },
  {
    id: 'w5l-12',
    frames: 989,
    text: "Why is a file named VA-benefits-letter-2026.docx better than document1.docx — and what's a simple backup habit? … A clear name tells you what's inside and when it's from without even opening it, so you can find it again later. And for backups, keep a second copy somewhere else — a USB drive or a cloud folder — so one lost or broken device never costs you your work.",
  },
  {
    id: 'w5l-13',
    frames: 975,
    text: "In email: what's the difference between Reply and Reply All, and what is Bcc for? … Reply sends your message back to just the sender. Reply All sends it to everyone on the email — useful sometimes, but easy to overuse. And Bcc, blind carbon copy, sends a copy to people without the other recipients seeing their addresses — good for protecting privacy when you email a group.",
  },
  {
    id: 'w5l-14',
    frames: 812,
    text: "One more pair worth remembering — how we work together online. Synchronous means at the same time, like a phone call or a video meeting where everyone's present together. Asynchronous means not at the same time, like email or a shared document, where you answer whenever it's convenient. Good manners matter in both.",
  },
  {
    id: 'w5l-15',
    frames: 321,
    text: "Our last area is the one that protects everything else: being a good, safe digital citizen — Week four.",
  },
  {
    id: 'w5l-16',
    frames: 1085,
    text: "What does PII stand for, and why do we say the things you post online are 'permanent'? … PII means Personally Identifiable Information — details that can identify you, like your full name, Social Security number, birth date, or address. Guard it carefully. And we call posts 'permanent' because once something is shared, others can copy, screenshot, or save it — so it can stay around long after you delete it. Post as if it's forever.",
  },
  {
    id: 'w5l-17',
    frames: 1016,
    text: "What makes a password strong, and which shortcut locks your Windows computer when you step away? … A strong password is long and hard to guess — a passphrase of several words, like 'Blue-Coffee-River-forty-two,' works well, and don't reuse the same one everywhere. To lock your Windows PC instantly, press the Windows key plus L — always do it when you walk away from a shared computer.",
  },
  {
    id: 'w5l-18',
    frames: 1357,
    text: "Last review question, and it has three parts. What is phishing, what does private browsing do, and name one way to protect your body at the computer. … Phishing is a fake message that tries to trick you into giving up passwords or personal information — don't click suspicious links. Private browsing, an 'InPrivate' or 'Incognito' window, doesn't save your history or sign-ins on that device — handy on a shared computer, though it doesn't make you anonymous. And for your body: take breaks, sit up straight, and rest your eyes — that's ergonomics.",
  },
  {
    id: 'w5l-19',
    frames: 839,
    text: "Now a lightning round — call these out as a group. The shortcut to copy is Control plus C. To paste, Control plus V. To undo, Control plus Z. The 'www' address you type to reach a website is called the URL. And a secret word that protects an account is a password — better yet, a passphrase.",
  },
  {
    id: 'w5l-20',
    frames: 894,
    text: "Take a breath and look at how much you can do now. You know your computer — its parts, memory versus storage, and what an operating system does. You can get online and find answers. You can create, save, and communicate. And you can stay safe and be a good digital citizen. Every one of those was new five weeks ago.",
  },
  {
    id: 'w5l-21',
    frames: 1112,
    text: "Now, the Post-Test. It's the same kind of test as Week one, so you can measure your growth. A few things to know. It's about twenty questions covering all our topics. There's no time limit — read carefully and take your time. It's not pass or fail — it simply shows how much you've learned. And when you finish, you can print or save your report and compare it to your Week-one Pre-Test.",
  },
  {
    id: 'w5l-22',
    frames: 907,
    text: "And then — what's next. You've finished the foundation: the seven core areas of Level one. Level two builds right on top of it, with deeper, hands-on work in the everyday apps you just learned. Keep your Study Guide and your quick-reference cards, try one new skill at home each week, and keep asking questions — that's how confidence grows.",
  },
  {
    id: 'w5l-23',
    frames: 607,
    text: "But first, today — go take that Post-Test, and be proud of every answer you know now that you didn't before. Thank you for showing up, week after week. You did it. We'll see you in Level two.",
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

// Map of id → measured clip seconds, for tightening durationInFrames in WEEK5_LESSON.
await writeFile(
  join(publicDir, 'week5-lesson-durations.json'),
  JSON.stringify(durations, null, 2) + '\n'
);

console.log(
  `\nDone. ${SCENES.length} clips written to public/, plus week5-lesson-durations.json.` +
    (overruns
      ? ` ${overruns} scene(s) need a larger durationInFrames in src/week5-lesson-data.ts.`
      : ' All clips fit their scenes.')
);
