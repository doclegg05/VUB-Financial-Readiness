// Generates the ElevenLabs voiceover clips for the FULL Week 4 lesson video
// ("Citizenship & Safety") and writes them to ./public so Remotion can embed them via
// staticFile(). One clip per scene, in scene order (w4l-01 .. w4l-25).
//
// Usage:
//   1. Set ELEVENLABS_API_KEY (or put the key in %USERPROFILE%\.secrets\elevenlabs-api-key).
//   2. node generate-week4-lesson-narration.mjs
//
// Spoken text is the EXACT narration from video/digital-literacy-1/week4-video-script.md
// (the approved 25-row script). For the three `question` scenes the spoken text is the
// full "question … answer … why" line. Same voice/model as the intro and the Week 1/2/3
// overviews; the #2 voice settings (stability 0.55, use_speaker_boost false). The key is
// never logged. Uses the /with-timestamps endpoint so we can read each clip's exact length
// and also writes public/week4-lesson-durations.json (id → clip seconds) for tightening
// the provisional durationInFrames in src/week4-lesson-data.ts (WEEK4_LESSON, 30fps).

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

// id matches the `audio` field in WEEK4_LESSON (src/week4-lesson-data.ts). `frames` is the
// provisional scene budget there, used only for the fit/overrun report below.
const SCENES = [
  {
    id: 'w4l-01',
    frames: 785,
    text: "A text arrives: 'Your account is locked — tap here right now to fix it.' Your heart jumps. Here's the good news: that little jump of worry is exactly the warning sign, and by the end of this short video you'll know how to slow down, stay safe, and protect yourself online.",
  },
  {
    id: 'w4l-02',
    frames: 894,
    text: "In the next few minutes, you'll learn four things. First, how to manage your identity and protect your personal information online. Second, how to read online information wisely and handle rude or untrue posts. Third, how to lock down your devices with strong passphrases. And fourth, how to browse more privately and stay healthy at your computer. Let's get started.",
  },
  {
    id: 'w4l-03',
    frames: 457,
    text: "First, your identity online. Everything you do on the internet builds a picture of you — and the good news is, you're in control of most of it.",
  },
  {
    id: 'w4l-04',
    frames: 1112,
    text: "Your digital identity is the picture of you that builds up online — your accounts, your posts, your photos, and the details websites collect about you. You manage it every time you decide what to share. You control what you post, which accounts you create, your privacy settings, and who you connect with. A simple rule before you share anything: would I be comfortable if a stranger, my family, and a future employer all saw this?",
  },
  {
    id: 'w4l-05',
    frames: 1207,
    text: "Now, the part to guard most closely. PII stands for personally identifiable information — any detail that can be used to identify you. That's your Social Security number, your date of birth, your home address and phone, and your bank or VA account numbers. In the wrong hands, it can lead to identity theft. To protect it: never share it in an email or text, only enter it on trusted sites with the little padlock, and shred paper documents you no longer need.",
  },
  {
    id: 'w4l-06',
    frames: 1425,
    text: "Here's something worth remembering: the internet has a long memory. Even after you delete a post, someone may have saved it, shared it, or taken a screenshot. Employers, banks, and new acquaintances may look up your name. So here's a friendly test before you post — the grandkid test: if you wouldn't want your grandchildren, or your old unit, to read it years from now, it's better not to post it. And know that no real bank or the VA will ever ask for your full Social Security number or password in a surprise email, text, or phone call.",
  },
  {
    id: 'w4l-07',
    frames: 635,
    text: "You'll put this into practice in today's lab. Station 6 is a quick privacy self-audit — you'll check the safe habits you already have and pick one new one to start this week. For now, let's talk about reading online wisely.",
  },
  {
    id: 'w4l-08',
    frames: 430,
    text: "Chapter two: reading online wisely. Not everything you read online is true, and not every message deserves a reply. Let's sort the good from the bad.",
  },
  {
    id: 'w4l-09',
    frames: 1180,
    text: "Not everything online is accurate — scams, rumors, and fake news are common. Before you believe or share something, check it. Ask yourself four questions: who wrote it, and are they an expert? Where is it published? When — is it current? And why — to inform you, or to sell or scare you? Watch for red flags: no author or source listed, a shocking headline with an urgent tone, spelling errors, or anything that asks for money or personal information.",
  },
  {
    id: 'w4l-10',
    frames: 1357,
    text: "Some people hide their real name online, and a few use that cover to be cruel — they post rude things just to get a reaction. We call that 'trolling.' Here's the powerful part: trolls want a reaction, so not replying removes their reward and often makes them stop. Instead of answering, you can block the person so they can't contact you, report the post to the website, save a screenshot if it's serious, and walk away to protect your peace of mind. Choosing not to respond isn't weakness — it's the stronger move.",
  },
  {
    id: 'w4l-11',
    frames: 594,
    text: "And you'll practice this too. In the lab's Station 5, you'll run a short checklist on a real web page and decide for yourself whether you can trust it. Next, let's lock down your accounts and your computer.",
  },
  {
    id: 'w4l-12',
    frames: 430,
    text: "Chapter three: lock it down. This is the part with the most practical, everyday payoff — simple habits that keep your accounts and your computer safe.",
  },
  {
    id: 'w4l-13',
    frames: 1466,
    text: "First, know the three common threats so you can spot them. Phishing is a fake email, text, or call that tricks you into giving up a password — it often pretends to be your bank, the VA, or a delivery company. Malware is a harmful program that sneaks on through a bad download or link. And scams are tricks to take your money — fake prizes, 'tech support' calls, or romance scams. The golden rule ties them together: slow down. If a message creates urgency or fear — 'act now!' — that itself is the warning sign. When in doubt, don't click.",
  },
  {
    id: 'w4l-14',
    frames: 1207,
    text: "Now the single best habit: a strong passphrase. A passphrase is just several words strung together — it's long, hard to guess, and easy for you to remember. Something like 'Purple-Trout-Coffee-Sunrise-7.' Aim for at least twelve characters, mix in a capital letter and a number, and use a different one for each important account. The secret is that length beats complexity — a long string of plain words is both harder to crack and easier to recall than a short jumble of symbols.",
  },
  {
    id: 'w4l-15',
    frames: 1330,
    text: "Three skills round out your security. One — reset a password you've forgotten: on the sign-in page, click 'Forgot password,' confirm it's you by email or text code, and make a new passphrase. Two — lock your screen the instant you step away: press the Windows key plus L, and your password unlocks it again. Three — clear your browser data on a shared computer: open the menu, choose 'Clear browsing data,' pick history and cookies, and click clear. Just know that clearing cookies signs you out of websites — that's normal.",
  },
  {
    id: 'w4l-16',
    frames: 621,
    text: "You'll do all three of these yourself in the lab. Stations 1, 2, and 3 walk you through building a passphrase, locking your screen with Windows-plus-L, and clearing your browser data. Last chapter: tracking, privacy, and taking care of yourself.",
  },
  {
    id: 'w4l-17',
    frames: 362,
    text: "Chapter four: tracking, privacy, and your health. A little awareness here keeps both your information and your body in good shape.",
  },
  {
    id: 'w4l-18',
    frames: 1289,
    text: "Most browsers offer a private window — called Incognito in Chrome, or InPrivate in Edge. It does not save your history or keep cookies on that device after you close it, which makes it handy on a shared computer. But here's the honest limit, because it's easy to get wrong: a private window does not make you invisible. Your internet provider, the network you're on, and any website you log into can still see you. It only keeps things tidy on this computer — it is not full anonymity.",
  },
  {
    id: 'w4l-19',
    frames: 1425,
    text: "Finally, take care of yourself at the computer. Your browser and advertisers use small files called cookies to follow what you do — that's why an item you looked at seems to follow you around in ads. And remember that saved passwords and downloaded files live right on your device, so don't save passwords on a shared computer. For your body: keep the screen about an arm's length away with the top at eye level, sit back with your feet flat, and try the twenty-twenty-twenty rule — every twenty minutes, look at something twenty feet away for twenty seconds.",
  },
  {
    id: 'w4l-20',
    frames: 662,
    text: "And you'll finish strong in the lab. Station 4 has you open a private window, Station 7 shows you what's stored on the computer, and Station 8 is a quick desk setup check for comfort and safety. First, let's see what you remember.",
  },
  {
    id: 'w4l-21',
    frames: 512,
    text: "Quick check. Which of these is the strongest password? … A long passphrase like 'Purple-Trout-Coffee-Sunrise-7.' Length and unrelated words make it far harder to guess than a short password or a birthday.",
  },
  {
    id: 'w4l-22',
    frames: 635,
    text: "Next. A stranger posts a rude, insulting comment just to get a reaction. What's usually the best response? … Don't reply. Not responding removes the reaction the troll wants. Then block or report them, and save a screenshot if it's threatening.",
  },
  {
    id: 'w4l-23',
    frames: 648,
    text: "Last one. True or false: a private, Incognito window makes you completely anonymous online? … False. Private mode just avoids saving history and cookies on that device. Your internet provider, the network, and the sites you log into can still see you.",
  },
  {
    id: 'w4l-24',
    frames: 921,
    text: "So, to recap. Guard your PII and think before you post — the internet remembers. Check that information is true, and don't feed the trolls; block, report, walk away. Lock it down with a long passphrase, the Windows-plus-L lock, and clearing data on shared computers. And take care of yourself — browse privately when it helps, and set up a comfortable desk.",
  },
  {
    id: 'w4l-25',
    frames: 989,
    text: "You did it. You now know how to protect your identity, read online with a clear head, lock down your devices, and stay healthy at your computer. Take your handouts home, and this week, try one thing for real — build a passphrase, or press Windows-plus-L when you walk away. Next week is our Review and Testing Day, where it all comes together. We'll see you there.",
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

// Map of id → measured clip seconds, for tightening durationInFrames in WEEK4_LESSON.
await writeFile(
  join(publicDir, 'week4-lesson-durations.json'),
  JSON.stringify(durations, null, 2) + '\n'
);

console.log(
  `\nDone. ${SCENES.length} clips written to public/, plus week4-lesson-durations.json.` +
    (overruns
      ? ` ${overruns} scene(s) need a larger durationInFrames in src/week4-lesson-data.ts.`
      : ' All clips fit their scenes.')
);
