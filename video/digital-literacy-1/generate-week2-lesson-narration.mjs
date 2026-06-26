// Generates the ElevenLabs voiceover clips for the FULL Week 2 lesson video
// ("Getting Online") and writes them to ./public so Remotion can embed them via
// staticFile(). One clip per scene, in scene order (w2l-01 .. w2l-27).
//
// Usage:
//   1. Set ELEVENLABS_API_KEY (or put the key in %USERPROFILE%\.secrets\elevenlabs-api-key).
//   2. node generate-week2-lesson-narration.mjs
//
// Spoken text is the EXACT narration from video/digital-literacy-1/week2-video-script.md
// (the approved 27-row script). For the three `question` scenes the spoken text is the
// full "question … answer … why" line. Same voice/model as the intro and the Week 1/2
// overviews; the #2 voice settings (stability 0.55, use_speaker_boost false). The key is
// never logged. Uses the /with-timestamps endpoint so we can read each clip's exact length
// and also writes public/week2-lesson-durations.json (id → clip seconds) for tightening
// the provisional durationInFrames in src/weeks-data.ts (WEEK2_LESSON, 30fps).

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

// id matches the `audio` field in WEEK2_LESSON (src/weeks-data.ts). `frames` is the
// provisional scene budget there, used only for the fit/overrun report below.
const SCENES = [
  {
    id: 'w2l-01',
    frames: 594,
    text: "The internet just stopped working. The page won't load, and you're not sure what you did. Here's the good news: you didn't break anything — and by the end of this short video, you'll know exactly what to check.",
  },
  {
    id: 'w2l-02',
    frames: 785,
    text: "In the next few minutes, you'll learn four things. First, how to move around your computer and a web browser. Second, the ways your computer connects to the internet. Third, simple steps to fix a lost connection. And fourth, how to search smarter and use what you find fairly. Let's get started.",
  },
  {
    id: 'w2l-03',
    frames: 403,
    text: "First, let's get comfortable moving around. Before you can go online, it helps to know your home base — the screen you see every day.",
  },
  {
    id: 'w2l-04',
    frames: 962,
    text: "When you sign in to a Windows computer, the main screen you see is called the desktop — it holds your icons and your background picture. Along the bottom is the taskbar, the strip that shows your open programs, the clock, and the Start button. Press the Windows key, at the bottom-left of your keyboard, and the Start menu opens so you can find any program.",
  },
  {
    id: 'w2l-05',
    frames: 935,
    text: "A web browser is simply a program that opens websites. The common ones are Microsoft Edge, Google Chrome, and Mozilla Firefox — and they all do the same basic job. The box at the very top is the address bar. You type a website's address there — like va.gov — and press Enter to go. You can also type a question right into it to search.",
  },
  {
    id: 'w2l-06',
    frames: 689,
    text: "Reading a web address tells you a lot. In www.va.gov, the dot-gov ending means it's an official U.S. government site — exactly where you want to be for your benefits. And a small padlock next to the address means your connection to that site is secure.",
  },
  {
    id: 'w2l-07',
    frames: 1194,
    text: "Three tools make browsing easier. Tabs let you open several pages in one window — each tab is like a page in a folder, and you click between them at the top. A bookmark, also called a favorite, saves a website so you don't have to retype it; click the star in the address bar to save one. And history is a list of pages you've already visited — press Control plus H to find a site you saw earlier but forgot to bookmark.",
  },
  {
    id: 'w2l-08',
    frames: 1194,
    text: "Moving around works two ways. Inside the browser, the Back arrow returns to your last page, Forward goes ahead again, Refresh reloads the page, and Home takes you to your start page. To move between programs — say, a browser and a document open at once — click its icon on the taskbar, or hold Alt and tap Tab to switch windows. A website, an app, your desktop — these are all just 'digital environments,' and the same skills move you around all of them.",
  },
  {
    id: 'w2l-09',
    frames: 553,
    text: "You'll do all of this yourself in today's lab — Part 1 walks you through opening tabs, bookmarking va-dot-gov, and using back, forward, and history. For now, let's see how your computer actually reaches the internet.",
  },
  {
    id: 'w2l-10',
    frames: 348,
    text: "Chapter two: getting connected. There are three different ways your computer can reach the internet — let's look at each one.",
  },
  {
    id: 'w2l-11',
    frames: 1207,
    text: "The first way is wired, also called Ethernet — a cable plugs your computer straight into the router. It's very fast and steady, and common for desktop computers. The second is Wi-Fi — a wireless signal in your home or in this lab, so no cables; your device connects through the air. The third is cellular, or mobile data — the same network that carries your phone calls, which your phone uses for internet when you're away from Wi-Fi. All three reach the very same internet.",
  },
  {
    id: 'w2l-12',
    frames: 1398,
    text: "So how does the internet get into your home? It travels in order. First, your Internet Service Provider — the company you pay, like a cable or phone company — sends the signal to your house. That signal arrives at a modem, a box that brings it in through a wall outlet. The modem hands it to a router, which shares the internet with all your devices and creates your Wi-Fi network's name. Many homes have one box that is both modem and router combined — and when the internet goes out, that box is the first place to check.",
  },
  {
    id: 'w2l-13',
    frames: 975,
    text: "Now, am I connected? Look at the bottom-right of the taskbar, near the clock. Curved bars mean Wi-Fi is connected, and more bars means a stronger signal. But if you see a globe instead of the bars, that means you are not connected to the internet. The surest test of all: open your browser and visit a website you trust — if it loads, you're truly online.",
  },
  {
    id: 'w2l-14',
    frames: 1494,
    text: "When the internet stops, try these in order — and stop the moment it works again. One: check the Wi-Fi icon — make sure Wi-Fi is on and you're on the right network. Two: try a different website — if only one site fails, the problem is that site, not your connection. Three: restart your modem or router — unplug it, wait thirty seconds, plug it back in, and wait two minutes. This single step fixes most problems. Four: restart your computer, which clears many small glitches. And remember — nothing you do here can break the computer. Unplugging the box and plugging it back in is completely safe.",
  },
  {
    id: 'w2l-15',
    frames: 975,
    text: "And if none of those steps work? Then it may be an outage in your area. Here's the important part: you've already done the steps that fix most problems — so if those didn't work, now it's genuinely the provider's job. Call your internet company. You'll practice checking your signal in the lab's Part 2, and you'll keep this troubleshooting checklist from Part 3 to take home.",
  },
  {
    id: 'w2l-16',
    frames: 335,
    text: "Chapter three: searching smart, and using what you find fairly. Good searches start before you ever type a word.",
  },
  {
    id: 'w2l-17',
    frames: 948,
    text: "Before you type, ask yourself: what am I actually trying to find out? The clearer your question, the better your results. A vague search like 'benefits' or 'doctor' gives you everything. A clear search like 'VA disability benefits eligibility' or 'VA clinic near Charleston, West Virginia' gives you what you need. You don't need full sentences — three or four well-chosen words usually work best.",
  },
  {
    id: 'w2l-18',
    frames: 1112,
    text: "Not every result is worth your time. Trust these more: sites ending in dot-gov or dot-edu, well-known organizations, recent dates, and clear, plain information. Be careful with: results labeled 'Ad' or 'Sponsored,' pages that ask for payment or personal information, pages full of pop-ups, and promises that sound too good to be true. Ads usually appear first — so read the web address under each result, and look a little further down for the most useful answer.",
  },
  {
    id: 'w2l-19',
    frames: 989,
    text: "When you find a good answer, keep track of where it came from. Bookmark the page with the star. Or copy the web address — click in the address bar and press Control plus C — then paste it into a note. And note the basics: the website's name and the date you visited. That's enough to find it again later, or to prove where your information came from.",
  },
  {
    id: 'w2l-20',
    frames: 1153,
    text: "Here's a shortcut you'll use constantly. Press Control plus F and a small search box appears, usually in the top-right corner. Type the word you want, and the page jumps straight to it and highlights every match. The box even counts them for you — like '3 of 8' — and you press Enter or the arrows to move to the next one. Best of all, Control-F works the same way in browsers and in documents like Word and Adobe Reader.",
  },
  {
    id: 'w2l-21',
    frames: 1330,
    text: "Last, a word on using what you find. Copyright means most photos, music, and writing online belong to whoever made them — by default, you may not reuse it without permission. Public domain is work that's free for anyone, often because it's very old or made by the U.S. government — no permission needed. And Creative Commons is when the creator gives permission to reuse their work, usually if you credit them — look for a 'C-C' label. When in doubt: give credit and link back, or look for content clearly marked free to use.",
  },
  {
    id: 'w2l-22',
    frames: 607,
    text: "You'll put all of this to work in the lab — Part 4 has you run a real search and save your source, and Part 5 lets you try Control-F on a long page. First, let's check what you remember.",
  },
  {
    id: 'w2l-23',
    frames: 662,
    text: "Quick check. You look at the taskbar and see a globe icon instead of the Wi-Fi bars. What does that tell you? … It means your device is not connected to the internet. Check that Wi-Fi is on and you've joined the right network.",
  },
  {
    id: 'w2l-24',
    frames: 525,
    text: "Next. You want to find one specific word on a long webpage — what's the fastest way? … Press Control plus F, type the word, and the page jumps to it and highlights every match.",
  },
  {
    id: 'w2l-25',
    frames: 689,
    text: "Last one. A photo online has no special label. Can you assume it's free to copy and reuse? … No — copyright is the default. No label means you assume it's owned. Only reuse it if it's clearly public domain, marked Creative Commons, or you have permission.",
  },
  {
    id: 'w2l-26',
    frames: 812,
    text: "So, to recap. Browsers have three helpers — tabs, bookmarks, and history. You connect by wired, Wi-Fi, or cellular, and the taskbar icon tells you if you're online. When the internet drops, restarting fixes most problems — the router first, then the computer. And search clearly, trust dot-gov and dot-edu, keep your sources, and respect copyright.",
  },
  {
    id: 'w2l-27',
    frames: 825,
    text: "You did it. You now know how to get online, stay connected, and search the web with confidence. Take your handouts home, and this week, try it for real — open a browser, bookmark one site, and run one Control-F search. Next week, we move on to creating documents and communicating online. We'll see you there.",
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

// Map of id → measured clip seconds, for tightening durationInFrames in WEEK2_LESSON.
await writeFile(
  join(publicDir, 'week2-lesson-durations.json'),
  JSON.stringify(durations, null, 2) + '\n'
);

console.log(
  `\nDone. ${SCENES.length} clips written to public/, plus week2-lesson-durations.json.` +
    (overruns
      ? ` ${overruns} scene(s) need a larger durationInFrames in src/weeks-data.ts.`
      : ' All clips fit their scenes.')
);
