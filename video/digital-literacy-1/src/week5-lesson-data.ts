import type { OverviewScene } from './LessonOverview';

/**
 * Week 5 — FULL lesson video ("Review & Testing Day"). Watched straight through;
 * the hands-on review game and the Post-Test follow. Built from the approved
 * week5-video-script.md (23 scenes, theme-aware scene-kinds: chapterCard ·
 * uiCallout · compare · steps · question).
 * Theme: WEEK_THEMES.week5 (green accent) — set where this array is mounted in src/Root.tsx.
 *
 * This is the tailored REVIEW edition. It warmly recaps the four week-by-week
 * areas from Weeks 1–4 framed as a friendly in-class review game, then a calm
 * Post-Test lead-in, then a look ahead to Level 2. The six `question` scenes use
 * the EXACT review-game questions and reveal answers from the presentation.
 *
 * On-screen text is intentionally SHORT — the full sentences live only in the
 * narration audio (one w5l-NN.mp3 clip per scene, in scene order). durationInFrames
 * are PROVISIONAL, estimated from each clip's narration word count with the same
 * formula the Week 2 lesson used: Math.max(90, Math.ceil(words / 2.2 * 30) + 75).
 * Tighten them to the measured clips after running
 * generate-week5-lesson-narration.mjs (writes public/week5-lesson-durations.json).
 *
 * Two scenes carry a user-supplied hero image and are rendered built/themed (no `bg`)
 * until the real image is attached: Scene 1 (hook hero) and Scene 23 (outro hero).
 */
export const WEEK5_LESSON: OverviewScene[] = [
  // 1 · Hook
  // TODO: user hero image (photoreal: warm computer-lab moment, older veterans smiling, "Week 5" on the projector)
  {
    kind: 'chapterCard',
    audio: 'w5l-01.mp3',
    durationInFrames: Math.max(90, Math.ceil(59 / 2.2 * 30) + 75),
    heading: 'You made it to the last day.',
    subtitle: 'No new material today — this is your victory lap: a review game, then the Post-Test.',
  },
  // 2 · How today works (objectives)
  {
    kind: 'chapterCard',
    audio: 'w5l-02.mp3',
    durationInFrames: Math.max(90, Math.ceil(64 / 2.2 * 30) + 75),
    kicker: 'Week 5 · How today works',
    heading: 'Today you’ll…',
    objectives: [
      { icon: '🎲', label: 'Play a friendly review game of Weeks 1–4' },
      { icon: '📝', label: 'Take the Post-Test — same kind as Week 1' },
      { icon: '📋', label: 'Keep your Level 1 Study Guide' },
      { icon: '🚀', label: 'See what comes next in Level 2' },
    ],
  },
  // 3 · Game rules signpost
  {
    kind: 'chapterCard',
    audio: 'w5l-03.mp3',
    durationInFrames: Math.max(90, Math.ceil(56 / 2.2 * 30) + 75),
    kicker: 'The one rule',
    heading: 'Guess first, then reveal.',
    subtitle: 'No score-keeping. That little moment of effort is what helps the answer stick.',
  },
  // 4 · Area 1 — Hardware & Operating Systems (title)
  {
    kind: 'chapterCard',
    audio: 'w5l-04.mp3',
    durationInFrames: Math.max(90, Math.ceil(25 / 2.2 * 30) + 75),
    kicker: 'Area 1 · From Week 1',
    heading: 'Hardware & Operating Systems',
    subtitle: 'The machine itself — its parts, and the software that runs it.',
  },
  // 5 · Area 1 — Q: input vs output devices
  {
    kind: 'question',
    audio: 'w5l-05.mp3',
    durationInFrames: Math.max(90, Math.ceil(56 / 2.2 * 30) + 75),
    question: 'A keyboard, mouse, and microphone are which kind of device?',
    answer: 'Input devices — they send information into the computer.',
    why: 'The opposite is an output device: a monitor, printer, or speakers, which sends information out to you.',
  },
  // 6 · Area 1 — Q: memory vs storage + OS
  {
    kind: 'question',
    audio: 'w5l-06.mp3',
    durationInFrames: Math.max(90, Math.ceil(75 / 2.2 * 30) + 75),
    question: 'Memory (RAM) vs. storage — and what is an operating system?',
    answer: 'RAM is the short-term workspace; storage keeps your files long-term.',
    why: 'RAM empties at shutdown; storage holds files even with the power off. The operating system — like Windows — is the main software that runs the device.',
  },
  // 7 · Area 1 — recap compare
  {
    kind: 'compare',
    audio: 'w5l-07.mp3',
    durationInFrames: Math.max(90, Math.ceil(57 / 2.2 * 30) + 75),
    heading: 'Memory vs. Storage',
    columns: [
      { icon: '🧠', title: 'Memory (RAM)', lines: ['The desk you work at', 'Roomy while you work', 'Cleared off at shutdown'] },
      { icon: '💾', title: 'Storage', lines: ['The filing cabinet', 'Holds your files safely', 'Kept whether power’s on or off'] },
    ],
  },
  // 8 · Area 2 — Getting Online (title)
  {
    kind: 'chapterCard',
    audio: 'w5l-08.mp3',
    durationInFrames: Math.max(90, Math.ceil(18 / 2.2 * 30) + 75),
    kicker: 'Area 2 · From Week 2',
    heading: 'Getting Online',
    subtitle: 'Browsers, Wi-Fi, and finding good answers on the web.',
  },
  // 9 · Area 2 — Q: Ctrl+F + Creative Commons
  {
    kind: 'question',
    audio: 'w5l-09.mp3',
    durationInFrames: Math.max(90, Math.ceil(85 / 2.2 * 30) + 75),
    question: 'Which shortcut finds a word — and what is Creative Commons?',
    answer: 'Ctrl + F opens “Find.” Creative Commons tells you how you may reuse a work.',
    why: 'Creative Commons is often free to reuse if you give credit. Public domain is free for anyone because it’s no longer under copyright.',
  },
  // 10 · Area 2 — recap callout
  {
    kind: 'uiCallout',
    audio: 'w5l-10.mp3',
    durationInFrames: Math.max(90, Math.ceil(54 / 2.2 * 30) + 75),
    heading: 'Words you’ll use every time',
    callouts: [
      { label: '🔍 Ctrl + F', note: 'Find a word on a page or in a file.' },
      { label: '🌐 URL', note: 'A website’s address — the part you type.' },
      { label: '📶 Wi-Fi', note: 'Wireless internet — check the signal icon.' },
    ],
  },
  // 11 · Area 3 — Creating & Communicating (title)
  {
    kind: 'chapterCard',
    audio: 'w5l-11.mp3',
    durationInFrames: Math.max(90, Math.ceil(17 / 2.2 * 30) + 75),
    kicker: 'Area 3 · From Week 3',
    heading: 'Creating & Communicating',
    subtitle: 'Making your own work — and reaching other people.',
  },
  // 12 · Area 3 — Q: file names + backup
  {
    kind: 'question',
    audio: 'w5l-12.mp3',
    durationInFrames: Math.max(90, Math.ceil(67 / 2.2 * 30) + 75),
    question: 'Why is “VA-benefits-letter-2026.docx” a better name than “document1”?',
    answer: 'A clear name tells you what’s inside and when it’s from — without opening it.',
    why: 'For backups, keep a second copy elsewhere — a USB drive or a cloud folder — so a lost device never costs you your work.',
  },
  // 13 · Area 3 — Q: Reply vs Reply All + Bcc
  {
    kind: 'question',
    audio: 'w5l-13.mp3',
    durationInFrames: Math.max(90, Math.ceil(66 / 2.2 * 30) + 75),
    question: 'Reply vs. Reply All — and what is Bcc for?',
    answer: 'Reply goes to the sender; Reply All goes to everyone.',
    why: 'Bcc (blind carbon copy) sends a copy without the other recipients seeing each other’s addresses — good for privacy when emailing a group.',
  },
  // 14 · Area 3 — recap compare
  {
    kind: 'compare',
    audio: 'w5l-14.mp3',
    durationInFrames: Math.max(90, Math.ceil(54 / 2.2 * 30) + 75),
    heading: 'Same time vs. any time',
    columns: [
      { icon: '☎️', title: 'Synchronous', lines: ['At the same time', 'A call or video meeting', 'Everyone present together'] },
      { icon: '📨', title: 'Asynchronous', lines: ['Not at the same time', 'Email or a shared document', 'Answer when it’s convenient'] },
    ],
  },
  // 15 · Area 4 — Citizenship & Safety (title)
  {
    kind: 'chapterCard',
    audio: 'w5l-15.mp3',
    durationInFrames: Math.max(90, Math.ceil(18 / 2.2 * 30) + 75),
    kicker: 'Area 4 · From Week 4',
    heading: 'Citizenship & Safety',
    subtitle: 'Being a good, safe digital citizen — it protects everything else.',
  },
  // 16 · Area 4 — Q: PII + permanence
  {
    kind: 'question',
    audio: 'w5l-16.mp3',
    durationInFrames: Math.max(90, Math.ceil(74 / 2.2 * 30) + 75),
    question: 'What is PII — and why are posts “permanent”?',
    answer: 'PII is Personally Identifiable Information. Posts can be copied or saved.',
    why: 'PII — name, SSN, birth date, address — identifies you, so guard it. Once shared, a post can stay around long after you delete it. Post as if it’s forever.',
  },
  // 17 · Area 4 — Q: strong password + Win+L
  {
    kind: 'question',
    audio: 'w5l-17.mp3',
    durationInFrames: Math.max(90, Math.ceil(69 / 2.2 * 30) + 75),
    question: 'What makes a password strong — and which shortcut locks your PC?',
    answer: 'Long and hard to guess — a passphrase of several words. Lock with Win + L.',
    why: 'Don’t reuse the same password everywhere. Always lock your computer when you walk away from a shared station.',
  },
  // 18 · Area 4 — Q: phishing + private browsing + ergonomics
  {
    kind: 'question',
    audio: 'w5l-18.mp3',
    durationInFrames: Math.max(90, Math.ceil(94 / 2.2 * 30) + 75),
    question: 'Phishing, private browsing — and one way to protect your body?',
    answer: 'Phishing is a fake message after your info — don’t click suspicious links.',
    why: 'Private browsing (InPrivate / Incognito) doesn’t save history on that device, but isn’t anonymous. For your body: take breaks, sit up straight, rest your eyes — ergonomics.',
  },
  // 19 · Lightning round
  {
    kind: 'uiCallout',
    audio: 'w5l-19.mp3',
    durationInFrames: Math.max(90, Math.ceil(56 / 2.2 * 30) + 75),
    heading: 'Lightning round — call them out',
    callouts: [
      { label: '📋 Ctrl + C / V / Z', note: 'Copy · Paste · Undo.' },
      { label: '🌐 URL', note: 'The “www” web address you type.' },
      { label: '🔑 Password', note: 'Protects an account — better yet, a passphrase.' },
    ],
  },
  // 20 · Recap — You Made It
  {
    kind: 'chapterCard',
    audio: 'w5l-20.mp3',
    durationInFrames: Math.max(90, Math.ceil(60 / 2.2 * 30) + 75),
    kicker: 'Recap',
    heading: 'Look how much you can do',
    objectives: [
      { icon: '🖥️', label: 'Know your computer — parts, memory vs. storage, the OS' },
      { icon: '🌐', label: 'Get online and find answers' },
      { icon: '✍️', label: 'Create, save, and communicate' },
      { icon: '🔒', label: 'Stay safe and be a good digital citizen' },
    ],
  },
  // 21 · Post-Test lead-in
  {
    kind: 'steps',
    audio: 'w5l-21.mp3',
    durationInFrames: Math.max(90, Math.ceil(76 / 2.2 * 30) + 75),
    heading: 'About the Post-Test',
    steps: [
      { label: 'About 20 questions', note: 'Covering all of our topics from the course.' },
      { label: 'No time limit', note: 'Read carefully and take your time.' },
      { label: 'Not pass or fail', note: 'It simply shows how much you’ve learned.' },
      { label: 'Print & compare', note: 'Save your report and compare it to your Week 1 Pre-Test.' },
    ],
  },
  // 22 · Level 2 look-ahead
  {
    kind: 'chapterCard',
    audio: 'w5l-22.mp3',
    durationInFrames: Math.max(90, Math.ceil(61 / 2.2 * 30) + 75),
    kicker: 'What’s next',
    heading: 'Digital Literacy — Level 2',
    subtitle: 'You finished the foundation. Level 2 builds on it — keep your Study Guide, try one new skill a week.',
  },
  // 23 · Outro
  // TODO: user hero image (photoreal: the same veterans, proud; a certificate and the Level 1 Study Guide on the desk)
  {
    kind: 'chapterCard',
    audio: 'w5l-23.mp3',
    durationInFrames: Math.max(90, Math.ceil(39 / 2.2 * 30) + 75),
    heading: 'You did it.',
    subtitle: 'Go take that Post-Test, and be proud of every answer you know now. We’ll see you in Level 2.',
  },
];
