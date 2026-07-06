import type { OverviewScene } from './LessonOverview';

/**
 * Week 3 — FULL lesson video ("Creating & Communicating"). Watched straight
 * through; the hands-on lab follows. Built from the approved week3-video-script.md
 * (24 scenes, theme-aware scene-kinds: chapterCard · uiCallout · compare · steps ·
 * question). Theme: WEEK_THEMES.week3 (blue accent) — set where this array is
 * mounted in src/Root.tsx.
 *
 * On-screen text is intentionally SHORT — the full sentences live only in the
 * narration audio (one w3l-NN.mp3 clip per scene, in scene order). durationInFrames
 * are PROVISIONAL, estimated from each clip's narration word count with the same
 * formula the Week 2 lesson used: Math.max(90, Math.ceil(words / 2.2 * 30) + 75).
 * Tighten them to the measured clips after running
 * generate-week3-lesson-narration.mjs (writes public/week3-lesson-durations.json).
 *
 * Chapters map to the existing lab make-save-share-lab.html:
 *   Ch.1 (Make & Save) → Lab Parts 1 & 2 · Ch.2 (Printing) → Lab Part 3 ·
 *   Ch.3 (Communicate) → Lab Parts 4 & 5.
 *
 * Four scenes carry a user-supplied asset and are rendered built/themed (no `bg`)
 * until the real image is attached: Scene 1 (hook hero), Scene 9 (Save As
 * screenshot), Scene 13 (Ctrl+P print screen), Scene 24 (outro hero).
 */
export const WEEK3_LESSON: OverviewScene[] = [
  // 1 · Hook
  // TODO: user hero image (photoreal: older veteran at a home desk, a finished letter on screen, a USB drive on the desk)
  {
    kind: 'chapterCard',
    audio: 'w3l-01.mp3',
    durationInFrames: 456,
    heading: 'You made something. Now keep it.',
    subtitle: 'Make your work, save it so it’s never lost, and share it the right way — none of it is hard.',
  },
  // 2 · Objectives
  {
    kind: 'chapterCard',
    audio: 'w3l-02.mp3',
    durationInFrames: 339,
    kicker: 'Week 3 · Objectives',
    heading: 'Today you’ll be able to…',
    objectives: [
      { icon: '📄', label: 'Create and save a document you can always find again' },
      { icon: '🔖', label: 'Give credit to where your information came from' },
      { icon: '🖨️', label: 'Print exactly what you want' },
      { icon: '💬', label: 'Communicate and work with others, with good manners' },
    ],
  },
  // 3 · Ch.1 — Make & Save (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w3l-03.mp3',
    durationInFrames: 319,
    kicker: 'Chapter 1',
    heading: 'Make & Save',
    subtitle: 'Make something and keep it safe — if you can type, you’re halfway there.',
  },
  // 4 · Ch.1 — Create a document (3 steps)
  {
    kind: 'steps',
    audio: 'w3l-04.mp3',
    durationInFrames: 769,
    heading: 'Make a document in three steps',
    steps: [
      { label: 'Open Word', note: 'Press the Windows key, type “Word,” press Enter, choose “Blank document.”' },
      { label: 'Type your text', note: 'The blinking line — the cursor — shows where your words appear.' },
      { label: 'Make it look good', note: 'Use the Home tab to make text bold, change its size, or center it.' },
    ],
  },
  // 5 · Ch.1 — Document vs. presentation
  {
    kind: 'compare',
    audio: 'w3l-05.mp3',
    durationInFrames: 669,
    heading: 'A document vs. a presentation',
    columns: [
      { icon: '📄', title: 'Document', lines: ['One long page you write on', 'Like a letter', 'Made in Word'] },
      { icon: '🖥️', title: 'Presentation', lines: ['A stack of “slides”', 'One idea per slide', 'Made in PowerPoint'] },
    ],
  },
  // 6 · Ch.1 — Give credit (referencing, citation, plagiarism)
  {
    kind: 'uiCallout',
    audio: 'w3l-06.mp3',
    durationInFrames: 673,
    heading: 'Give credit to your source.',
    callouts: [
      { label: '🔖 Referencing', note: 'Telling your reader where you found your information.' },
      { label: '✍️ Citation', note: 'The short line: author · title · website · date you visited.' },
      { label: '⚠️ Plagiarism', note: 'Copying words or pictures without credit — always say where it came from.' },
    ],
  },
  // 7 · Ch.1 — Save: Ctrl+S, 3-2-1, good name (3 steps)
  {
    kind: 'steps',
    audio: 'w3l-07.mp3',
    durationInFrames: 730,
    heading: 'Save it so you never lose it',
    steps: [
      { label: 'Press Ctrl + S', note: 'The moment you start, and again every few minutes.' },
      { label: 'The 3-2-1 backup idea', note: '3 copies, in 2 places (PC + USB), with 1 away from home — like the cloud.' },
      { label: 'Give it a clear name', note: 'Say what it is, and add the date, so future-you can find it.' },
    ],
  },
  // 8 · Ch.1 — Good vs vague file names
  {
    kind: 'compare',
    audio: 'w3l-08.mp3',
    durationInFrames: 619,
    heading: 'A name you’ll understand next year',
    columns: [
      {
        icon: '✅',
        title: 'Clear names',
        lines: ['VA-Benefits-Letter-2026-06.docx', 'Says what’s inside', 'Date YEAR-MONTH sorts in order'],
      },
      {
        icon: '❌',
        title: 'Hard to find later',
        lines: ['Document1.docx', 'untitled.docx', 'Tells you nothing in a year'],
      },
    ],
  },
  // 9 · Ch.1 → Lab signpost
  // TODO: user screenshot (Word "Save As" screen with a clear file name typed in, e.g. VA-Notes-2026-06)
  {
    kind: 'chapterCard',
    audio: 'w3l-09.mp3',
    durationInFrames: 370,
    kicker: 'Lab · Parts 1 & 2',
    heading: 'You’ll practice this in the lab.',
    subtitle: 'Make a document and save it with a good name, then add a simple citation.',
  },
  // 10 · Ch.2 — Printing (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w3l-10.mp3',
    durationInFrames: 255,
    kicker: 'Chapter 2',
    heading: 'Printing',
    subtitle: 'A couple of simple choices — and you can always check your work first.',
  },
  // 11 · Ch.2 — Orientation & sides
  {
    kind: 'compare',
    audio: 'w3l-11.mp3',
    durationInFrames: 632,
    heading: 'Tall or wide · One side or two',
    columns: [
      {
        icon: '📄',
        title: 'Orientation',
        lines: ['Portrait — tall, like a letter (usual)', 'Landscape — wide, like a calendar', 'Good for wide tables or photos'],
      },
      {
        icon: '🔁',
        title: 'Sides',
        lines: ['Single-sided — one page per sheet', 'Double-sided — both sides', 'Saves paper'],
      },
    ],
  },
  // 12 · Ch.2 — How to print (3 steps)
  {
    kind: 'steps',
    audio: 'w3l-12.mp3',
    durationInFrames: 799,
    heading: 'How to print',
    steps: [
      { label: 'Press Ctrl + P', note: 'A preview on the right shows your page exactly as it will print.' },
      { label: 'Choose your settings', note: 'Printer, copies, which pages (all or 1-3), color or black-and-white.' },
      { label: 'Choose how', note: 'A cabled printer, a wireless printer, or Save as PDF instead of paper.' },
    ],
  },
  // 13 · Ch.2 — Always check the preview
  // TODO: user screenshot (Ctrl+P print screen — orientation dropdown + the page preview on the right)
  {
    kind: 'uiCallout',
    audio: 'w3l-13.mp3',
    durationInFrames: 427,
    heading: 'Always check the preview.',
    callouts: [
      { label: '🔍 The preview', note: 'The picture of your page on the print screen — before any paper comes out.' },
      { label: '✔️ Fix it first', note: 'It shows page numbers, margins, and whether your text fits.' },
    ],
    body: 'Nothing here can hurt your computer — and you never have to actually print to practice.',
  },
  // 14 · Ch.2 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w3l-14.mp3',
    durationInFrames: 294,
    kicker: 'Lab · Part 3',
    heading: 'You’ll practice this in the lab.',
    subtitle: 'Try every print setting — without printing a single page, using Save as PDF.',
  },
  // 15 · Ch.3 — Communicate (chapter title)
  {
    kind: 'chapterCard',
    audio: 'w3l-15.mp3',
    durationInFrames: 230,
    kicker: 'Chapter 3',
    heading: 'Communicate',
    subtitle: 'Working together online, kindly and clearly — small habits, big difference.',
  },
  // 16 · Ch.3 — Effective vs ineffective messages
  {
    kind: 'compare',
    audio: 'w3l-16.mp3',
    durationInFrames: 538,
    heading: 'Effective vs. ineffective messages',
    columns: [
      {
        icon: '✅',
        title: 'Effective',
        lines: ['Clear subject line', 'A greeting and your name', 'Gets to the point', 'Re-read before sending'],
      },
      {
        icon: '❌',
        title: 'Ineffective',
        lines: ['No subject, or a vague one', 'ALL CAPS reads like shouting', 'Too long and rambling', 'Sent in anger'],
      },
    ],
  },
  // 17 · Ch.3 — Reply / Reply All / Forward / Bcc
  {
    kind: 'uiCallout',
    audio: 'w3l-17.mp3',
    durationInFrames: 611,
    heading: 'Reply · Reply All · Forward · Bcc',
    callouts: [
      { label: '↩️ Reply', note: 'Answers only the person who sent it. Use this most of the time.' },
      { label: '↪️ Reply All', note: 'Answers the sender AND everyone — only when all truly need it.' },
      { label: '➡️ Forward', note: 'Sends the message on to someone new who wasn’t on it.' },
      { label: '🙈 Bcc', note: 'Blind carbon copy — a hidden copy others can’t see.' },
    ],
  },
  // 18 · Ch.3 — Inclusive language & collaboration
  {
    kind: 'compare',
    audio: 'w3l-18.mp3',
    durationInFrames: 626,
    heading: 'Welcome everyone · Work together',
    columns: [
      {
        icon: '🤝',
        title: 'Inclusive language',
        lines: ['Words that welcome everyone', '“Hi everyone” / “Hi team”', 'Leave no one out'],
      },
      {
        icon: '🌐',
        title: 'Collaboration',
        lines: ['Same time (synchronous)', 'Different times (asynchronous)', 'Kind, specific comments'],
      },
    ],
  },
  // 19 · Ch.3 → Lab signpost
  {
    kind: 'chapterCard',
    audio: 'w3l-19.mp3',
    durationInFrames: 385,
    kicker: 'Lab · Parts 4 & 5',
    heading: 'You’ll practice this in the lab.',
    subtitle: 'Choose the right email button for real situations, then handle the “reply-all” trap.',
  },
  // 20 · Wrap-Up — Q1
  {
    kind: 'question',
    audio: 'w3l-20.mp3',
    durationInFrames: 470,
    question: 'Only the sender needs your answer — which button?',
    answer: 'Reply.',
    why: 'Reply goes to the sender only. Reply All would send it to all ten — usually unnecessary.',
  },
  // 21 · Wrap-Up — Q2
  {
    kind: 'question',
    audio: 'w3l-21.mp3',
    durationInFrames: 488,
    question: 'Which file name is easiest to find next year?',
    answer: 'VA-Benefits-Letter-2026-06.',
    why: 'It describes what’s inside and includes the date, so it’s clear and sorts in order.',
  },
  // 22 · Wrap-Up — Q3
  {
    kind: 'question',
    audio: 'w3l-22.mp3',
    durationInFrames: 457,
    question: 'A tall page for a letter — which orientation?',
    answer: 'Portrait.',
    why: 'Portrait is tall, like a letter. Landscape is wide, better for wide tables or photos.',
  },
  // 23 · Recap
  {
    kind: 'chapterCard',
    audio: 'w3l-23.mp3',
    durationInFrames: 534,
    kicker: 'Recap',
    heading: 'What to remember',
    objectives: [
      { icon: '📄', label: 'Save early and often — Ctrl + S, a clear dated name, 3-2-1 backup' },
      { icon: '🔖', label: 'Give credit with a simple citation' },
      { icon: '🖨️', label: 'Print: Ctrl + P, check the preview, choose settings — or Save as PDF' },
      { icon: '💬', label: 'Communicate kindly: Reply for the sender, inclusive words' },
    ],
  },
  // 24 · Outro
  // TODO: user hero image (photoreal: the same veteran, relaxed, holding a printed page; a "VA Documents" folder on screen)
  {
    kind: 'chapterCard',
    audio: 'w3l-24.mp3',
    durationInFrames: 491,
    heading: 'You did it.',
    subtitle: 'You can create, save, print, and share your work. Next week: citizenship and safety — keeping you and your information safe online.',
  },
];
