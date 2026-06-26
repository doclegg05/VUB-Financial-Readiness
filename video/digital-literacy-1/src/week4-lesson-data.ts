import type { OverviewScene } from './LessonOverview';

/**
 * Week 4 — FULL lesson video ("Citizenship & Safety"). Watched straight through;
 * the hands-on lab follows. Built from the approved week4-video-script.md (25 scenes,
 * theme-aware scene-kinds: chapterCard · uiCallout · compare · steps · question).
 * Theme: WEEK_THEMES.week4 (red accent) — set where this array is mounted in src/Root.tsx.
 *
 * On-screen text is intentionally SHORT — the full sentences live only in the
 * narration audio (one w4l-NN.mp3 clip per scene, in scene order). durationInFrames
 * are PROVISIONAL, estimated from each clip's narration word count with the same
 * formula the Week 2 lesson used: Math.max(90, Math.ceil(words / 2.2 * 30) + 75).
 * Tighten them to the measured clips after running
 * generate-week4-lesson-narration.mjs (writes public/week4-lesson-durations.json).
 *
 * Chapters map to the existing lab lock-it-down-lab.html (8 stations):
 *   Ch.1 (Your Identity Online) → Lab Station 6 · Ch.2 (Reading Online Wisely) → Lab Station 5 ·
 *   Ch.3 (Lock It Down) → Lab Stations 1-3 · Ch.4 (Tracking & Staying Healthy) → Lab Stations 4, 7 & 8.
 *
 * Four scenes carry a user-supplied asset and are rendered built/themed (no `bg`)
 * until the real image is attached: Scene 1 (hook hero), Scene 15 (Clear browsing
 * data screenshot), Scene 18 (private/Incognito window screenshot), Scene 25 (outro hero).
 */
export const WEEK4_LESSON: OverviewScene[] = [
  // 1 · Hook
  // TODO: user hero image (photoreal: older veteran at a home desk looking at a phone showing a suspicious "account locked" text)
  {
    kind: 'chapterCard',
    audio: 'w4l-01.mp3',
    durationInFrames: Math.max(90, Math.ceil(52 / 2.2 * 30) + 75),
    heading: 'A text says your account is locked.',
    subtitle: 'That little jump of worry is the warning sign — by the end, you’ll know how to stay safe.',
  },
  // 2 · Objectives
  {
    kind: 'chapterCard',
    audio: 'w4l-02.mp3',
    durationInFrames: Math.max(90, Math.ceil(60 / 2.2 * 30) + 75),
    kicker: 'Week 4 · Objectives',
    heading: 'Today you’ll be able to…',
    objectives: [
      { icon: '🪪', label: 'Manage your identity and protect your personal information' },
      { icon: '🧭', label: 'Read online wisely and handle rude or untrue posts' },
      { icon: '🔐', label: 'Lock down your devices with strong passphrases' },
      { icon: '💚', label: 'Browse more privately and stay healthy at your computer' },
    ],
  },
  // 3 · Ch.1 — Your Identity Online (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w4l-03.mp3',
    durationInFrames: Math.max(90, Math.ceil(28 / 2.2 * 30) + 75),
    kicker: 'Chapter 1',
    heading: 'Your Identity Online',
    subtitle: 'Everything you do builds a picture of you — and you’re in control of most of it.',
  },
  // 4 · Ch.1 — Your digital identity
  {
    kind: 'uiCallout',
    audio: 'w4l-04.mp3',
    durationInFrames: Math.max(90, Math.ceil(76 / 2.2 * 30) + 75),
    heading: 'Your digital identity.',
    callouts: [
      { label: '🪪 You control it', note: 'Your accounts, posts, photos, and what you share.' },
      { label: '🔒 Your privacy settings', note: 'Review them, and share less, not more.' },
      { label: '🤝 Who you connect with', note: 'You decide who’s in your circle.' },
    ],
    body: 'Before you share, ask: would a stranger, my family, and a future employer all be okay seeing this?',
  },
  // 5 · Ch.1 — PII and how to protect it
  {
    kind: 'compare',
    audio: 'w4l-05.mp3',
    durationInFrames: Math.max(90, Math.ceil(83 / 2.2 * 30) + 75),
    heading: 'Protect your personal information',
    columns: [
      {
        icon: '🪪',
        title: 'PII — examples',
        lines: ['Social Security number', 'Date of birth', 'Home address & phone', 'Bank or VA account numbers'],
      },
      {
        icon: '🛡️',
        title: 'How to protect it',
        lines: ['Never share it by email or text', 'Only on trusted sites (look for 🔒)', 'Shred old paper documents'],
      },
    ],
  },
  // 6 · Ch.1 — Reputation & permanence
  {
    kind: 'uiCallout',
    audio: 'w4l-06.mp3',
    durationInFrames: Math.max(90, Math.ceil(99 / 2.2 * 30) + 75),
    heading: 'The internet has a long memory.',
    callouts: [
      { label: '📌 Posts can last forever', note: 'Deleted ≠ gone — others may have saved a screenshot.' },
      { label: '🔎 People look you up', note: 'Employers, banks, and new acquaintances search your name.' },
      { label: '🌟 You build your reputation', note: 'Kind, honest posts shape how people see you.' },
    ],
    body: 'The grandkid test: if you wouldn’t want family or your old unit to read it, don’t post it. And no real bank or the VA asks for your SSN or password in a surprise message.',
  },
  // 7 · Ch.1 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w4l-07.mp3',
    durationInFrames: Math.max(90, Math.ceil(41 / 2.2 * 30) + 75),
    kicker: 'Lab · Station 6',
    heading: 'You’ll practice this in the lab.',
    subtitle: 'Privacy & Identity Self-Audit — check your safe habits and pick one new one to start.',
  },
  // 8 · Ch.2 — Reading Online Wisely (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w4l-08.mp3',
    durationInFrames: Math.max(90, Math.ceil(26 / 2.2 * 30) + 75),
    kicker: 'Chapter 2',
    heading: 'Reading Online Wisely',
    subtitle: 'Not everything you read is true — and not every message deserves a reply.',
  },
  // 9 · Ch.2 — Is it true? Ask yourself / red flags
  {
    kind: 'compare',
    audio: 'w4l-09.mp3',
    durationInFrames: Math.max(90, Math.ceil(81 / 2.2 * 30) + 75),
    heading: 'Is this information true?',
    columns: [
      {
        icon: '❓',
        title: 'Ask yourself',
        lines: ['Who wrote it — an expert?', 'Where is it published?', 'When — is it current?', 'Why — to inform, or sell/scare?'],
      },
      {
        icon: '🚩',
        title: 'Red flags',
        lines: ['No author or source listed', 'Shocking headline, urgent tone', 'Spelling and grammar errors', 'Asks for money or PII'],
      },
    ],
  },
  // 10 · Ch.2 — Anonymity & the power of nonresponse
  {
    kind: 'uiCallout',
    audio: 'w4l-10.mp3',
    durationInFrames: Math.max(90, Math.ceil(94 / 2.2 * 30) + 75),
    heading: 'When the best reply is no reply.',
    callouts: [
      { label: '🚫 Block', note: 'Stop them from contacting you.' },
      { label: '🚩 Report', note: 'Flag the post to the website.' },
      { label: '📸 Save', note: 'Screenshot it if it’s serious.' },
      { label: '🚶 Walk away', note: 'Protect your peace of mind.' },
    ],
    body: 'Trolls want a reaction. Not replying removes their reward — and that’s the stronger move, not weakness.',
  },
  // 11 · Ch.2 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w4l-11.mp3',
    durationInFrames: Math.max(90, Math.ceil(38 / 2.2 * 30) + 75),
    kicker: 'Lab · Station 5',
    heading: 'You’ll practice this in the lab.',
    subtitle: 'Is This Source Trustworthy? — run a short checklist on a real page and decide for yourself.',
  },
  // 12 · Ch.3 — Lock It Down (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w4l-12.mp3',
    durationInFrames: Math.max(90, Math.ceil(26 / 2.2 * 30) + 75),
    kicker: 'Chapter 3',
    heading: 'Lock It Down',
    subtitle: 'Simple habits that keep your accounts and your computer safe.',
  },
  // 13 · Ch.3 — Common security threats
  {
    kind: 'compare',
    audio: 'w4l-13.mp3',
    durationInFrames: Math.max(90, Math.ceil(102 / 2.2 * 30) + 75),
    heading: 'Phishing · Malware · Scams',
    columns: [
      { icon: '🎣', title: 'Phishing', lines: ['Fake email, text, or call', 'Pretends to be a bank or the VA', 'Wants your password or PII'] },
      { icon: '🦠', title: 'Malware', lines: ['A harmful program', 'Sneaks in via bad downloads/links', 'Can steal or lock your files'] },
      { icon: '💸', title: 'Scams', lines: ['Tricks to take your money', 'Fake prizes, “tech support” calls', 'Slow down — urgency is the red flag'] },
    ],
  },
  // 14 · Ch.3 — Strong passphrases
  {
    kind: 'uiCallout',
    audio: 'w4l-14.mp3',
    durationInFrames: Math.max(90, Math.ceil(83 / 2.2 * 30) + 75),
    heading: 'A passphrase: longer is stronger.',
    callouts: [
      { label: '✅ Several words joined', note: 'Like Purple-Trout-Coffee-Sunrise-7.' },
      { label: '🔢 12+ characters', note: 'Add a capital letter and a number.' },
      { label: '🔁 One per account', note: 'A different passphrase for each.' },
    ],
    body: 'Length beats complexity — a long string of plain words is harder to crack and easier to remember.',
  },
  // 15 · Ch.3 — Reset / Lock / Clear data
  // TODO: user screenshot (the "Clear browsing data" window with history & cookies checked, behind/around the built steps)
  {
    kind: 'steps',
    audio: 'w4l-15.mp3',
    durationInFrames: Math.max(90, Math.ceil(92 / 2.2 * 30) + 75),
    heading: 'Reset · Lock · Clear data',
    steps: [
      { label: 'Reset a forgotten password', note: 'Click “Forgot password,” confirm by email/text code, make a new one.' },
      { label: 'Lock your screen', note: 'Press Windows + L when you step away; your password unlocks it.' },
      { label: 'Clear your browser data', note: 'Open the menu → Clear browsing data → history and cookies → Clear.' },
    ],
  },
  // 16 · Ch.3 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w4l-16.mp3',
    durationInFrames: Math.max(90, Math.ceil(40 / 2.2 * 30) + 75),
    kicker: 'Lab · Stations 1–3',
    heading: 'You’ll practice this in the lab.',
    subtitle: 'Build a passphrase, lock your screen with Windows + L, and clear your browser data.',
  },
  // 17 · Ch.4 — Tracking & Staying Healthy (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w4l-17.mp3',
    durationInFrames: Math.max(90, Math.ceil(21 / 2.2 * 30) + 75),
    kicker: 'Chapter 4',
    heading: 'Tracking & Staying Healthy',
    subtitle: 'A little awareness keeps both your information and your body in good shape.',
  },
  // 18 · Ch.4 — Private browsing: does / does NOT
  // TODO: user screenshot (a private/Incognito window showing its dark theme and the private-mode icon)
  {
    kind: 'compare',
    audio: 'w4l-18.mp3',
    durationInFrames: Math.max(90, Math.ceil(89 / 2.2 * 30) + 75),
    heading: 'Private browsing — and its limits',
    columns: [
      {
        icon: '✅',
        title: 'What it does',
        lines: ['Doesn’t save history on the device', 'Doesn’t keep cookies after you close', 'Great on a shared computer'],
      },
      {
        icon: '⚠️',
        title: 'What it does NOT do',
        lines: ['It does not make you invisible', 'Your provider & network still see sites', 'Sites you log into still know it’s you'],
      },
    ],
  },
  // 19 · Ch.4 — Tracking + staying healthy
  {
    kind: 'uiCallout',
    audio: 'w4l-19.mp3',
    durationInFrames: Math.max(90, Math.ceil(99 / 2.2 * 30) + 75),
    heading: 'Take care of yourself, too.',
    callouts: [
      { label: '🍪 Cookies follow you', note: 'Small files track what you do — that’s why ads “follow” you.' },
      { label: '💾 Data lives on the device', note: 'Don’t save passwords on a shared computer.' },
      { label: '💺 Arm’s length, eye level', note: 'Sit back, feet flat, wrists straight.' },
      { label: '👀 20-20-20', note: 'Every 20 min, look 20 feet away for 20 seconds.' },
    ],
  },
  // 20 · Ch.4 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w4l-20.mp3',
    durationInFrames: Math.max(90, Math.ceil(43 / 2.2 * 30) + 75),
    kicker: 'Lab · Stations 4, 7 & 8',
    heading: 'You’ll finish strong in the lab.',
    subtitle: 'Open a private window, see what’s stored on the PC, and run a quick desk setup check.',
  },
  // 21 · Wrap-Up — Q1
  {
    kind: 'question',
    audio: 'w4l-21.mp3',
    durationInFrames: Math.max(90, Math.ceil(32 / 2.2 * 30) + 75),
    question: 'Which is the strongest password?',
    answer: 'A long passphrase like Purple-Trout-Coffee-Sunrise-7.',
    why: 'Length and unrelated words make it far harder to guess than a short password or a birthday.',
  },
  // 22 · Wrap-Up — Q2
  {
    kind: 'question',
    audio: 'w4l-22.mp3',
    durationInFrames: Math.max(90, Math.ceil(41 / 2.2 * 30) + 75),
    question: 'A troll posts a rude comment for a reaction. Best response?',
    answer: 'Don’t reply — then block or report.',
    why: 'Not responding removes the reaction the troll wants. Save a screenshot if it’s threatening.',
  },
  // 23 · Wrap-Up — Q3
  {
    kind: 'question',
    audio: 'w4l-23.mp3',
    durationInFrames: Math.max(90, Math.ceil(42 / 2.2 * 30) + 75),
    question: 'True or false: Incognito makes you anonymous?',
    answer: 'False — it only stops saving data on that device.',
    why: 'Your internet provider, the network, and sites you log into can still see you.',
  },
  // 24 · Recap
  {
    kind: 'chapterCard',
    audio: 'w4l-24.mp3',
    durationInFrames: Math.max(90, Math.ceil(62 / 2.2 * 30) + 75),
    kicker: 'Recap',
    heading: 'What to remember',
    objectives: [
      { icon: '🪪', label: 'Guard your PII and think before you post — the internet remembers' },
      { icon: '🧭', label: 'Check that information is true; don’t feed the trolls — block, report, walk away' },
      { icon: '🔐', label: 'Lock it down: a long passphrase, Windows + L, and clear data on shared PCs' },
      { icon: '💚', label: 'Take care of yourself — browse privately when it helps, set up a comfortable desk' },
    ],
  },
  // 25 · Outro
  // TODO: user hero image (photoreal: the same veteran, relaxed and confident, the suspicious text now closed; printed handout beside the keyboard)
  {
    kind: 'chapterCard',
    audio: 'w4l-25.mp3',
    durationInFrames: Math.max(90, Math.ceil(67 / 2.2 * 30) + 75),
    heading: 'You did it.',
    subtitle: 'You can protect your identity, read online with a clear head, lock down your devices, and stay healthy. Next week: Review & Testing Day.',
  },
];
