import type { OverviewScene } from './LessonOverview';

/**
 * Per-week lesson-overview content (on-screen text + narration clip + on-screen
 * duration). On-screen text is intentionally shorter than the spoken narration
 * in narration-scripts.md; the audio carries the fuller sentences.
 *
 * durationInFrames are at 30fps and were set to fit the measured narration
 * clips (see generate-week1-narration.mjs output) with a little headroom.
 */

export const WEEK1_OVERVIEW: OverviewScene[] = [
  {
    kind: 'title',
    audio: 'w1-1-title.mp3',
    durationInFrames: 180,
    eyebrow: 'Week 1',
    heading: 'Inside the Computer',
    subtitle: 'Hardware, Devices, Software & Operating Systems',
  },
  {
    kind: 'centered',
    audio: 'w1-2-why.mp3',
    durationInFrames: 450,
    eyebrow: 'Why this week',
    heading: 'Start with the machine itself',
    body: 'The computer in front of you — the forms it takes, the parts inside, and the software it runs.',
  },
  {
    kind: 'bullets',
    audio: 'w1-3-goals.mp3',
    durationInFrames: 630,
    eyebrow: "What you'll be able to do",
    heading: "Today's four goals",
    items: [
      'Name common devices, ports & connections',
      'Tell memory from storage',
      'Understand software & install safely',
      'Recognize Windows, macOS, Android & iOS',
    ],
  },
  {
    kind: 'bullets',
    audio: 'w1-4-how.mp3',
    durationInFrames: 600,
    eyebrow: 'How today works',
    heading: 'Your path through the lesson',
    items: [
      'Pre-Test — about 20 questions, no time limit, not pass/fail',
      'Walk through the main ideas together',
      'A quick Knowledge Check',
      'Hands-on practice at your station',
    ],
  },
  {
    kind: 'closing',
    audio: 'w1-5-closing.mp3',
    durationInFrames: 210,
    heading: 'It all starts here.',
    body: 'Inside the computer. Let’s take a look.',
  },
];

/**
 * Week 2 — visual experiment: each scene sits on an ElevenLabs-generated
 * background image (w2-bg-N.png in public/) behind a navy scrim. Provisional
 * durations; tighten to the measured narration after generate-week2-narration.mjs.
 */
export const WEEK2_OVERVIEW: OverviewScene[] = [
  {
    kind: 'title',
    audio: 'w2-1-title.mp3',
    bg: 'w2-bg-1.png',
    durationInFrames: 180,
    eyebrow: 'Week 2',
    heading: 'Getting Online',
    subtitle: 'Browsers, Networks & Smart Searching',
  },
  {
    kind: 'centered',
    audio: 'w2-2-why.mp3',
    bg: 'w2-bg-2.png',
    durationInFrames: 300,
    eyebrow: 'Why this week',
    heading: 'Step out onto the internet',
    body: 'How to get there, find your way around, and find what you’re looking for.',
  },
  {
    kind: 'bullets',
    audio: 'w2-3-goals.mp3',
    bg: 'w2-bg-3.png',
    durationInFrames: 630,
    eyebrow: "What you'll be able to do",
    heading: "Today's four goals",
    items: [
      'Navigate the web — tabs, bookmarks & history',
      'Know how you connect — wired, Wi-Fi & cellular',
      'Fix common connection problems yourself',
      'Search smarter & use content fairly',
    ],
  },
  {
    kind: 'bullets',
    audio: 'w2-4-how.mp3',
    bg: 'w2-bg-4.png',
    durationInFrames: 480,
    eyebrow: 'How today works',
    heading: 'Your path through the lesson',
    items: [
      'Get comfortable in a web browser',
      'See what brings the internet to your home',
      'Troubleshoot, step by step',
      'Search smarter + copyright basics',
    ],
  },
  {
    kind: 'closing',
    audio: 'w2-5-closing.mp3',
    bg: 'w2-bg-5.png',
    durationInFrames: 210,
    heading: 'Let’s get online.',
    body: 'The internet — a place you know your way around.',
  },
];

/**
 * Week 2 — FULL lesson video ("Getting Online"). Watched straight through; the
 * hands-on lab follows. Built from the approved week2-video-script.md (27 scenes,
 * theme-aware scene-kinds: chapterCard · uiCallout · compare · steps · question).
 *
 * On-screen text is intentionally SHORT — the full sentences live only in the
 * narration audio (one w2l-NN.mp3 clip per scene, in scene order). durationInFrames
 * are PROVISIONAL, estimated from each clip's narration length
 * (Math.ceil(words / 2.2 * 30) + 75, floor 90); tighten them to the measured
 * clips after running generate-week2-lesson-narration.mjs (writes
 * public/week2-lesson-durations.json).
 *
 * Four scenes carry a user-supplied asset and are rendered built/themed (no `bg`)
 * until the real image is attached: Scene 1 (hook hero), Scene 13 (taskbar
 * screenshot), Scene 20 (Ctrl+F screenshot), Scene 27 (outro hero).
 */
export const WEEK2_LESSON: OverviewScene[] = [
  // 1 · Hook
  // TODO: user hero image (photoreal: older veteran at a home desk, "can't reach this page" screen)
  {
    kind: 'chapterCard',
    audio: 'w2l-01.mp3',
    durationInFrames: 386,
    heading: 'The internet just stopped.',
    subtitle: 'You didn’t break anything — and by the end, you’ll know exactly what to check.',
  },
  // 2 · Objectives
  {
    kind: 'chapterCard',
    audio: 'w2l-02.mp3',
    durationInFrames: 560,
    kicker: 'Week 2 · Objectives',
    heading: 'Today you’ll be able to…',
    objectives: [
      { icon: '🧭', label: 'Navigate your computer and a web browser' },
      { icon: '📶', label: 'Understand how you connect to the internet' },
      { icon: '🔧', label: 'Fix common connection problems yourself' },
      { icon: '🔍', label: 'Search smarter and use content fairly' },
    ],
  },
  // 3 · Ch.1 — Browsers (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w2l-03.mp3',
    durationInFrames: 229,
    kicker: 'Chapter 1',
    heading: 'Browsers',
    subtitle: 'Get comfortable moving around — start with your home base.',
  },
  // 4 · Ch.1 — Desktop / Taskbar / Start
  {
    kind: 'uiCallout',
    audio: 'w2l-04.mp3',
    durationInFrames: 619,
    heading: 'Desktop · Taskbar · Start',
    callouts: [
      { label: 'Desktop', note: 'The main screen — your icons and background picture.' },
      { label: 'Taskbar', note: 'The bottom strip: open programs, the clock, and Start.' },
      { label: 'Start menu', note: 'Press the Windows key to find any program.' },
    ],
  },
  // 5 · Ch.1 — A browser opens websites
  {
    kind: 'uiCallout',
    audio: 'w2l-05.mp3',
    durationInFrames: 609,
    heading: 'A browser opens websites.',
    callouts: [
      { label: 'Edge · Chrome · Firefox', note: 'Common browsers — all do the same basic job.' },
      { label: 'Address bar', note: 'Type an address like va.gov, then press Enter.' },
      { label: 'Or just search', note: 'Type a question right into the same box.' },
    ],
  },
  // 6 · Ch.1 — The .gov ending, the padlock
  {
    kind: 'uiCallout',
    audio: 'w2l-06.mp3',
    durationInFrames: 508,
    heading: 'The .gov ending. The padlock.',
    callouts: [
      { label: '.gov', note: 'An official U.S. government site — where you want to be.' },
      { label: '🔒 Padlock', note: 'Your connection to that site is secure.' },
    ],
    body: 'Reading a web address tells you a lot — like www.va.gov.',
  },
  // 7 · Ch.1 — Tabs / Bookmarks / History
  {
    kind: 'compare',
    audio: 'w2l-07.mp3',
    durationInFrames: 742,
    heading: 'Tabs · Bookmarks · History',
    columns: [
      { icon: '🗂️', title: 'Tabs', lines: ['Several pages, one window', 'Click between them at the top'] },
      { icon: '⭐', title: 'Bookmarks', lines: ['Saves a site so you don’t retype', 'Click the star to save one'] },
      { icon: '🕘', title: 'History', lines: ['Pages you’ve already visited', 'Press Ctrl + H to find one'] },
    ],
  },
  // 8 · Ch.1 — Back, Forward, and Alt+Tab
  {
    kind: 'compare',
    audio: 'w2l-08.mp3',
    durationInFrames: 822,
    heading: 'Back, Forward — and Alt + Tab',
    columns: [
      {
        icon: '↩️',
        title: 'Within the browser',
        lines: ['← Back to your last page', '→ Forward again', '⟳ Refresh reloads', '🏠 Home start page'],
      },
      {
        icon: '🔁',
        title: 'Between programs',
        lines: ['Click its icon on the taskbar', 'Or hold Alt and tap Tab', 'Same skills move you anywhere'],
      },
    ],
  },
  // 9 · Ch.1 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w2l-09.mp3',
    durationInFrames: 382,
    kicker: 'Lab · Part 1',
    heading: 'You’ll practice this in the lab.',
    subtitle: 'Browser Navigation Drills — tabs, bookmarking va.gov, back/forward/history.',
  },
  // 10 · Ch.2 — Getting Connected (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w2l-10.mp3',
    durationInFrames: 247,
    kicker: 'Chapter 2',
    heading: 'Getting Connected',
    subtitle: 'Three different ways your computer reaches the internet.',
  },
  // 11 · Ch.2 — Wired / Wi-Fi / Cellular
  {
    kind: 'compare',
    audio: 'w2l-11.mp3',
    durationInFrames: 856,
    heading: 'Wired · Wi-Fi · Cellular',
    columns: [
      { icon: '🔌', title: 'Wired', lines: ['A cable to the router', 'Fast and steady', 'Best for desktops'] },
      { icon: '📶', title: 'Wi-Fi', lines: ['A wireless signal', 'No cables', 'Connects through the air'] },
      { icon: '📱', title: 'Cellular', lines: ['Mobile data', 'The phone network', 'Best away from Wi-Fi'] },
    ],
  },
  // 12 · Ch.2 — ISP → Modem → Router → You
  {
    kind: 'steps',
    audio: 'w2l-12.mp3',
    durationInFrames: 938,
    heading: 'How the internet reaches you',
    steps: [
      { label: 'Internet Service Provider', note: 'The company you pay sends the signal to your house.' },
      { label: 'Modem', note: 'A box that brings the signal in through a wall outlet.' },
      { label: 'Router', note: 'Shares the internet with your devices; makes your Wi-Fi name.' },
      { label: 'Your devices', note: 'Often one combined box — check it first when the internet drops.' },
    ],
  },
  // 13 · Ch.2 — Taskbar icon: bars vs globe
  // TODO: user screenshot (taskbar tray Wi-Fi-bars icon by the clock, with a globe "not connected" inset)
  {
    kind: 'uiCallout',
    audio: 'w2l-13.mp3',
    durationInFrames: 654,
    heading: 'Bars = connected. Globe = not.',
    callouts: [
      { label: '📶 Bars', note: 'Wi-Fi connected — more bars, stronger signal.' },
      { label: '🌐 Globe', note: 'You are NOT connected to the internet.' },
    ],
    body: 'Look bottom-right, near the clock. Surest test: open a site you trust — if it loads, you’re online.',
  },
  // 14 · Ch.2 — Troubleshooting ladder
  {
    kind: 'steps',
    audio: 'w2l-14.mp3',
    durationInFrames: 994,
    heading: 'When the internet stops working',
    steps: [
      { label: 'Check the Wi-Fi icon', note: 'Make sure Wi-Fi is on and you’re on the right network.' },
      { label: 'Try a different website', note: 'If only one site fails, the problem is that site.' },
      { label: 'Restart the modem/router', note: 'Unplug, wait 30 seconds, plug back in, wait 2 minutes.' },
      { label: 'Restart your computer', note: 'Clears many small glitches. Nothing here can break it — it’s safe.' },
    ],
  },
  // 15 · Ch.2 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w2l-15.mp3',
    durationInFrames: 689,
    kicker: 'Lab · Parts 2 & 3',
    heading: 'Step 5: now it’s their job.',
    subtitle: 'Still down? You’ve done the steps that fix most problems — call your internet company.',
  },
  // 16 · Ch.3 — Searching Smart (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w2l-16.mp3',
    durationInFrames: 260,
    kicker: 'Chapter 3',
    heading: 'Searching Smart',
    subtitle: 'Good searches start before you ever type a word.',
  },
  // 17 · Ch.3 — Vague vs clear words
  {
    kind: 'compare',
    audio: 'w2l-17.mp3',
    durationInFrames: 648,
    heading: 'Vague words vs. clear words',
    columns: [
      { icon: '🌫️', title: 'Vague', lines: ['“benefits”', '“doctor”', '“taxes”', 'Gives you everything'] },
      {
        icon: '🎯',
        title: 'Clear',
        lines: ['“VA disability benefits eligibility”', '“VA clinic near Charleston, WV”', 'Three or four words work best'],
      },
    ],
  },
  // 18 · Ch.3 — Trust vs be careful
  {
    kind: 'compare',
    audio: 'w2l-18.mp3',
    durationInFrames: 839,
    heading: 'Trust these · Be careful with these',
    columns: [
      {
        icon: '✅',
        title: 'Trust more',
        lines: ['.gov and .edu sites', 'Well-known organizations', 'Recent dates', 'Clear, plain information'],
      },
      {
        icon: '⚠️',
        title: 'Be careful',
        lines: ['“Ad” or “Sponsored” labels', 'Asks for payment or info', 'Pages full of pop-ups', 'Too good to be true'],
      },
    ],
  },
  // 19 · Ch.3 — Keep your source
  {
    kind: 'steps',
    audio: 'w2l-19.mp3',
    durationInFrames: 588,
    heading: 'Keep your source',
    steps: [
      { label: 'Bookmark the page', note: 'Click the star to save it.' },
      { label: 'Copy the web address', note: 'Click the address bar, press Ctrl + C, paste into a note.' },
      { label: 'Note the basics', note: 'The website’s name and the date you visited.' },
    ],
  },
  // 20 · Ch.3 — Ctrl+F
  // TODO: user screenshot (browser Find bar with a typed word + match counter "3 of 8")
  {
    kind: 'uiCallout',
    audio: 'w2l-20.mp3',
    durationInFrames: 761,
    heading: 'Ctrl + F finds any word.',
    callouts: [
      { label: 'Press Ctrl + F', note: 'A small search box appears, usually top-right.' },
      { label: 'Type a word', note: 'The page jumps to it and highlights every match.' },
      { label: '“3 of 8”', note: 'It counts them; Enter or arrows move to the next.' },
    ],
    body: 'Works the same in browsers and in documents like Word and Adobe Reader.',
  },
  // 21 · Ch.3 — Copyright spectrum
  {
    kind: 'compare',
    audio: 'w2l-21.mp3',
    durationInFrames: 860,
    heading: 'Copyright · Public Domain · Creative Commons',
    columns: [
      { icon: '©️', title: 'Copyright', lines: ['Owned by its maker', 'The default online', 'Ask first to reuse'] },
      { icon: '🆓', title: 'Public Domain', lines: ['Free for anyone', 'Often very old or U.S. gov’t', 'No permission needed'] },
      { icon: '🅭', title: 'Creative Commons', lines: ['Creator gives permission', 'Usually credit them', 'Look for a “CC” label'] },
    ],
  },
  // 22 · Ch.3 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w2l-22.mp3',
    durationInFrames: 331,
    kicker: 'Lab · Parts 4 & 5',
    heading: 'You’ll practice this in the lab.',
    subtitle: 'Run a real search and save your source, then try Ctrl + F on a long page.',
  },
  // 23 · Wrap-Up — Q1
  {
    kind: 'question',
    audio: 'w2l-23.mp3',
    durationInFrames: 377,
    question: 'A globe icon means…?',
    answer: 'You are NOT connected to the internet.',
    why: 'Check that Wi-Fi is on and you’ve joined the right network.',
  },
  // 24 · Wrap-Up — Q2
  {
    kind: 'question',
    audio: 'w2l-24.mp3',
    durationInFrames: 365,
    question: 'Find one word on a long page fast?',
    answer: 'Press Ctrl + F, then type the word.',
    why: 'The page jumps to it and highlights every match.',
  },
  // 25 · Wrap-Up — Q3
  {
    kind: 'question',
    audio: 'w2l-25.mp3',
    durationInFrames: 547,
    question: 'No label = free to use?',
    answer: 'No — copyright is the default.',
    why: 'No label means assume it’s owned. Reuse only if it’s public domain, marked Creative Commons, or you have permission.',
  },
  // 26 · Recap
  {
    kind: 'chapterCard',
    audio: 'w2l-26.mp3',
    durationInFrames: 694,
    kicker: 'Recap',
    heading: 'What to remember',
    objectives: [
      { icon: '🧭', label: 'Browsers: tabs, bookmarks, and history' },
      { icon: '📶', label: 'Connect by wired, Wi-Fi, or cellular — the taskbar icon shows if you’re online' },
      { icon: '🔧', label: 'Internet down? Restart the router first, then the computer' },
      { icon: '🔍', label: 'Search clearly, trust .gov/.edu, keep sources, respect copyright' },
    ],
  },
  // 27 · Outro
  // TODO: user hero image (photoreal: the same veteran, relaxed, at a loaded va.gov page; printed handout beside the keyboard)
  {
    kind: 'chapterCard',
    audio: 'w2l-27.mp3',
    durationInFrames: 594,
    heading: 'You did it.',
    subtitle: 'You can get online, stay connected, and search with confidence. Next week: creating documents and communicating online.',
  },
];
