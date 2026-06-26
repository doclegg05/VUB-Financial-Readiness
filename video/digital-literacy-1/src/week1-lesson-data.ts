import type { OverviewScene } from './LessonOverview';

/**
 * Week 1 — FULL lesson video ("Inside the Computer"). Watched straight through; the
 * hands-on lab follows. Built from the approved week1-video-script.md (25 scenes,
 * theme-aware scene-kinds: chapterCard · uiCallout · compare · steps · question).
 *
 * On-screen text is intentionally SHORT — the full sentences live only in the
 * narration audio (one w1l-NN.mp3 clip per scene, in scene order). durationInFrames
 * are PROVISIONAL, computed per scene from the spoken-word count with the shared
 * estimate Math.max(90, Math.ceil(words / 2.2 * 30) + 75) (30fps). Tighten them to the
 * measured clips after running generate-week1-lesson-narration.mjs (which writes
 * public/week1-lesson-durations.json).
 *
 * Maps to courses/digital-literacy-1/weeks/week-01/handouts/meet-your-computer-lab.html:
 * Ch.1 → Lab Part 1 · Ch.2 → Lab Part 2 · Ch.3 → Lab Part 3 · Ch.4 → Lab Part 4. The three
 * `question` scenes reuse the real Knowledge-Check questions from presentation.html (Slide 13).
 *
 * Three scenes carry a user-supplied asset and are rendered built/themed (no `bg`) until the
 * real image is attached: Scene 1 (hook hero), Scene 5 (ports screenshot), Scene 25 (outro hero).
 */
export const WEEK1_LESSON: OverviewScene[] = [
  // 1 · Hook
  // TODO: user hero image (photoreal: older veteran at a lab workstation, hand near a desktop PC)
  {
    kind: 'chapterCard',
    audio: 'w1l-01.mp3',
    durationInFrames: Math.max(90, Math.ceil(55 / 2.2 * 30) + 75),
    heading: 'The machine in front of you.',
    subtitle: 'Nobody is born knowing this — by the end you’ll know what each part does.',
  },
  // 2 · Objectives
  {
    kind: 'chapterCard',
    audio: 'w1l-02.mp3',
    durationInFrames: Math.max(90, Math.ceil(78 / 2.2 * 30) + 75),
    kicker: 'Week 1 · Objectives',
    heading: 'Today you’ll be able to…',
    objectives: [
      { icon: '🔌', label: 'Name common devices and the ports they plug into' },
      { icon: '🧠', label: 'Tell memory from storage' },
      { icon: '💿', label: 'Understand software and install it safely' },
      { icon: '🪟', label: 'Recognize the major operating systems, like Windows' },
    ],
  },
  // 3 · Ch.1 — Devices & Hardware (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w1l-03.mp3',
    durationInFrames: Math.max(90, Math.ceil(34 / 2.2 * 30) + 75),
    kicker: 'Chapter 1',
    heading: 'Devices & Hardware',
    subtitle: 'The pieces you can touch — and the few simple groups they fall into.',
  },
  // 4 · Ch.1 — Input vs Output
  {
    kind: 'compare',
    audio: 'w1l-04.mp3',
    durationInFrames: Math.max(90, Math.ceil(82 / 2.2 * 30) + 75),
    heading: 'Input vs. Output',
    columns: [
      {
        icon: '⌨️',
        title: 'Input (you → computer)',
        lines: ['Keyboard — type', 'Mouse — point & click', 'Microphone — your voice', 'Webcam — video'],
      },
      {
        icon: '🖥️',
        title: 'Output (computer → you)',
        lines: ['Monitor — shows the picture', 'Speakers — play sound', 'Printer — work on paper'],
      },
    ],
  },
  // 5 · Ch.1 — Ports, cables & connectors
  // TODO: user screenshot (the ports on the back/side of a lab PC, with USB + HDMI ringed)
  {
    kind: 'uiCallout',
    audio: 'w1l-05.mp3',
    durationInFrames: Math.max(90, Math.ceil(102 / 2.2 * 30) + 75),
    heading: 'USB · HDMI · Ethernet · Power',
    callouts: [
      { label: 'USB', note: 'The most common plug. A-flat rectangle or C-small oval (fits either way).' },
      { label: 'HDMI', note: 'Picture and sound to a monitor, one cable.' },
      { label: 'Ethernet', note: 'A wider plug for wired internet.' },
      { label: 'Power', note: 'Runs to the wall.' },
    ],
    body: 'Plugs fit only the right port — if a cable won’t go in, turn it over. Never force it.',
  },
  // 6 · Ch.1 — Types of computing devices
  {
    kind: 'compare',
    audio: 'w1l-06.mp3',
    durationInFrames: Math.max(90, Math.ceil(78 / 2.2 * 30) + 75),
    heading: 'Same idea, different sizes',
    columns: [
      { icon: '🖥️', title: 'Desktop', lines: ['Stays on a desk', 'Separate pieces', 'Easy to repair'] },
      { icon: '💻', title: 'Laptop', lines: ['Folds shut', 'Runs on a battery', 'Built-in screen'] },
      { icon: '📱', title: 'Tablet', lines: ['A flat touchscreen', 'Like a big phone'] },
      { icon: '📞', title: 'Smartphone', lines: ['A pocket computer', 'Also makes calls'] },
    ],
  },
  // 7 · Ch.1 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w1l-07.mp3',
    durationInFrames: Math.max(90, Math.ceil(54 / 2.2 * 30) + 75),
    kicker: 'Lab · Part 1',
    heading: 'You’ll practice this in the lab.',
    subtitle: 'Find the Ports & Devices — name one input and one output. You’ll only look, never unplug.',
  },
  // 8 · Ch.2 — Inside the Box (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w1l-08.mp3',
    durationInFrames: Math.max(90, Math.ceil(44 / 2.2 * 30) + 75),
    kicker: 'Chapter 2',
    heading: 'Inside the Box',
    subtitle: 'You don’t have to memorize this — but three parts do the real work.',
  },
  // 9 · Ch.2 — CPU / RAM / Drive
  {
    kind: 'compare',
    audio: 'w1l-09.mp3',
    durationInFrames: Math.max(90, Math.ceil(58 / 2.2 * 30) + 75),
    heading: 'The three parts that do the work',
    columns: [
      { icon: '⚙️', title: 'CPU', lines: ['The “brain”', 'Does the thinking', 'Runs your programs'] },
      { icon: '🧠', title: 'RAM', lines: ['Short-term memory', 'The computer’s “desk”', 'Holds what’s open now'] },
      { icon: '💾', title: 'Drive', lines: ['Long-term storage', 'The “filing cabinet”', 'Keeps files when off'] },
    ],
  },
  // 10 · Ch.2 — Memory vs Storage
  {
    kind: 'compare',
    audio: 'w1l-10.mp3',
    durationInFrames: Math.max(90, Math.ceil(102 / 2.2 * 30) + 75),
    heading: 'Memory vs. Storage',
    columns: [
      {
        icon: '🧠',
        title: 'Memory (RAM)',
        lines: ['Short-term, like your desk', 'Empties when you shut down', 'Measured in GB (8, 16)'],
      },
      {
        icon: '💾',
        title: 'Storage (the Drive)',
        lines: ['Long-term, like a cabinet', 'Keeps files when power is off', 'GB or TB (1 TB ≈ 1,000 GB)'],
      },
    ],
  },
  // 11 · Ch.2 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w1l-11.mp3',
    durationInFrames: Math.max(90, Math.ceil(50 / 2.2 * 30) + 75),
    kicker: 'Lab · Part 2',
    heading: 'You’ll practice this in the lab.',
    subtitle: 'How Much Memory & Storage? Open Settings and This PC to read your own numbers.',
  },
  // 12 · Ch.3 — Software (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w1l-12.mp3',
    durationInFrames: Math.max(90, Math.ceil(34 / 2.2 * 30) + 75),
    kicker: 'Chapter 3',
    heading: 'Software',
    subtitle: 'Hardware is what you touch — software is what it runs.',
  },
  // 13 · Ch.3 — System vs Application
  {
    kind: 'compare',
    audio: 'w1l-13.mp3',
    durationInFrames: Math.max(90, Math.ceil(78 / 2.2 * 30) + 75),
    heading: 'Two kinds of software',
    columns: [
      {
        icon: '🪟',
        title: 'System software',
        lines: ['The operating system itself', 'Runs the whole computer', 'On the lab PCs: Windows'],
      },
      {
        icon: '📂',
        title: 'Applications (“apps”)',
        lines: ['Programs you open for a task', 'Browser, Word, a PDF reader', 'Email, a calculator, a game'],
      },
    ],
  },
  // 14 · Ch.3 — Paid vs Free
  {
    kind: 'compare',
    audio: 'w1l-14.mp3',
    durationInFrames: Math.max(90, Math.ceil(82 / 2.2 * 30) + 75),
    heading: 'Paid vs. Free — both are safe',
    columns: [
      {
        icon: '🔒',
        title: 'Proprietary',
        lines: ['Owned by one company', 'You buy it or subscribe', 'Office, Windows'],
      },
      {
        icon: '🔓',
        title: 'Open Source',
        lines: ['Public code, free to use', 'Maintained by a community', 'Firefox, LibreOffice, VLC'],
      },
    ],
  },
  // 15 · Ch.3 — Installing safely
  {
    kind: 'steps',
    audio: 'w1l-15.mp3',
    durationInFrames: Math.max(90, Math.ceil(108 / 2.2 * 30) + 75),
    heading: 'Install safely — where matters most',
    steps: [
      { label: 'Use a trusted source', note: 'The Microsoft Store, or the maker’s official site (microsoft.com).' },
      { label: 'Check the web address', note: 'The real company — not a look-alike with a wrong name.' },
      { label: 'Read each screen', note: 'Click Next carefully; decline extra toolbars you didn’t ask for.' },
      { label: 'Approve the prompt', note: '“Allow this app to make changes?” — Yes only if you trust it.' },
    ],
  },
  // 16 · Ch.3 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w1l-16.mp3',
    durationInFrames: Math.max(90, Math.ceil(40 / 2.2 * 30) + 75),
    kicker: 'Lab · Part 3',
    heading: 'You’ll practice this in the lab.',
    subtitle: 'Which Apps Are Installed? Open the Start menu and spot the apps already on your PC.',
  },
  // 17 · Ch.4 — Operating Systems (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w1l-17.mp3',
    durationInFrames: Math.max(90, Math.ceil(34 / 2.2 * 30) + 75),
    kicker: 'Chapter 4',
    heading: 'Operating Systems',
    subtitle: 'The master program that runs the whole computer.',
  },
  // 18 · Ch.4 — What is an OS
  {
    kind: 'uiCallout',
    audio: 'w1l-18.mp3',
    durationInFrames: Math.max(90, Math.ceil(74 / 2.2 * 30) + 75),
    heading: 'The OS runs everything.',
    callouts: [
      { label: 'Starts at power-on', note: 'And stays running the whole time.' },
      { label: 'Manages files & hardware', note: 'Lets every app share the keyboard, screen, and memory.' },
      { label: 'Gives you the desktop', note: 'Taskbar, Start menu, windows, File Explorer.' },
    ],
    body: 'The computers in this lab run Microsoft Windows.',
  },
  // 19 · Ch.4 — Windows / macOS / Mobile
  {
    kind: 'compare',
    audio: 'w1l-19.mp3',
    durationInFrames: Math.max(90, Math.ceil(96 / 2.2 * 30) + 75),
    heading: 'Windows · macOS · Mobile',
    columns: [
      {
        icon: '🪟',
        title: 'Windows',
        lines: ['Microsoft', 'Most common — and this lab', 'Start button, bottom-left'],
      },
      { icon: '🍎', title: 'macOS', lines: ['Apple', 'Mac computers only', 'Same idea, different look'] },
      {
        icon: '📱',
        title: 'Mobile',
        lines: ['Android (Google) — many brands', 'iOS — iPhone & iPad', 'Taps and swipes, no mouse'],
      },
    ],
  },
  // 20 · Ch.4 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w1l-20.mp3',
    durationInFrames: Math.max(90, Math.ceil(48 / 2.2 * 30) + 75),
    kicker: 'Lab · Part 4',
    heading: 'You’ll practice this in the lab.',
    subtitle: 'Which Operating System? Find your Windows version on the About page — reading it can’t break a thing.',
  },
  // 21 · Wrap-Up — Q1
  {
    kind: 'question',
    audio: 'w1l-21.mp3',
    durationInFrames: Math.max(90, Math.ceil(54 / 2.2 * 30) + 75),
    heading: 'Which of these is an input device?',
    question: 'Which of these is an input device?',
    answer: 'A keyboard.',
    why: 'You use it to put information into the computer. A printer, monitor, and speaker are outputs.',
  },
  // 22 · Wrap-Up — Q2
  {
    kind: 'question',
    audio: 'w1l-22.mp3',
    durationInFrames: Math.max(90, Math.ceil(52 / 2.2 * 30) + 75),
    heading: 'Memory (RAM) vs. storage (the drive)?',
    question: 'Memory (RAM) vs. storage (the drive)?',
    answer: 'RAM is short-term; storage is long-term.',
    why: 'RAM empties when you shut down. Storage keeps your files when the power is off.',
  },
  // 23 · Wrap-Up — Q3
  {
    kind: 'question',
    audio: 'w1l-23.mp3',
    durationInFrames: Math.max(90, Math.ceil(42 / 2.2 * 30) + 75),
    heading: 'Safest place to download a program?',
    question: 'Safest place to download a program?',
    answer: 'From a trusted source.',
    why: 'The Microsoft Store or the maker’s official website — never a pop-up ad or an email link.',
  },
  // 24 · Recap
  {
    kind: 'chapterCard',
    audio: 'w1l-24.mp3',
    durationInFrames: Math.max(90, Math.ceil(92 / 2.2 * 30) + 75),
    kicker: 'Recap',
    heading: 'What to remember',
    objectives: [
      { icon: '🔌', label: 'Hardware: input goes in, output comes out — through ports like USB and HDMI' },
      { icon: '🧠', label: 'Memory is the desk; storage is the filing cabinet' },
      { icon: '💿', label: 'The OS runs the computer; apps do your tasks — install only from trusted sources' },
      { icon: '🪟', label: 'Windows, macOS, and mobile are all operating systems — learn one, the rest feel familiar' },
    ],
  },
  // 25 · Outro
  // TODO: user hero image (photoreal: the same veteran, relaxed, at the lab PC; printed lab handout beside the keyboard)
  {
    kind: 'chapterCard',
    audio: 'w1l-25.mp3',
    durationInFrames: Math.max(90, Math.ceil(82 / 2.2 * 30) + 75),
    heading: 'You did it.',
    subtitle: 'You can name the parts, tell memory from storage, understand software, and know the operating systems. Next week: getting online.',
  },
];
