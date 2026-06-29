# Digital Literacy — Level 1: Intro Video (Remotion)

Source for the ~2:40 course-intro explainer. **This folder is source only — it is NOT
deployed.** The platform build (`scripts/build-site.js`) publishes only
`index.html, 404.html, courses.json, courses, instructors, shared, assets`, so `video/`
never ships, and `node_modules/` + `*.mp4` are git-ignored.

The course itself stays **offline-first**: the rendered video is **not** embedded. Instead
it is delivered as a click-out link (to YouTube) plus a local transcript at
`courses/digital-literacy-1/intro-video-transcript.html`.

## Render

```bash
cd video/digital-literacy-1
npm install
node generate-narration.mjs   # writes public/*.mp3 voiceover — needs an API key; see "Narration" below
npm run start      # opens Remotion Studio to preview/tweak the "Intro" composition
npm run render     # writes out/dl1-intro.mp4 (1920x1080, 30fps, ~2:40)
```

Rendering needs a headless Chromium (Remotion downloads one on first run) and ffmpeg
(bundled with Remotion). On Windows, run from a normal PowerShell/CMD prompt.

## Narration (voiceover)

The spoken voiceover is generated with the ElevenLabs API by `generate-narration.mjs`,
which writes one MP3 per scene to `public/` (embedded at render time via `staticFile`).
The script holds the narration text and each scene's frame budget inline, and prints
whether any clip overruns its scene.

```bash
node generate-narration.mjs
```

It reads the key from `ELEVENLABS_API_KEY`, falling back to
`%USERPROFILE%\.secrets\elevenlabs-api-key`; the key is never logged. The MP3s are
git-ignored (like the rendered MP4), so regenerate them on a fresh clone before
`npm run render` — otherwise the video renders silent. Voice `iKrofGyA12WC0e6AhZ8B`,
model `eleven_multilingual_v2`.

## After rendering

1. Upload `out/dl1-intro.mp4` to YouTube (your VUB account), set visibility as desired.
2. Copy the video ID (the `v=...` part of the watch URL).
3. In `courses/digital-literacy-1/intro-video-transcript.html`, replace the placeholder
   YouTube URL (`REPLACE_WITH_VIDEO_ID`) in the "Watch the intro video" link.

The link is a plain `<a href>` (a click-out), not an embedded iframe, so the course pages
keep loading zero external resources and stay offline-capable.

## Editing the content

`src/Intro.tsx` holds the scenes and narration. **Keep it in sync with the transcript**
(`courses/digital-literacy-1/intro-video-transcript.html`) — the transcript is the
accessible, offline copy of the same script. If you change scene durations, update
`durationInFrames` in `src/Root.tsx` (currently 4800 = 160s at 30fps). If you change the
spoken wording, also update the `SCENES` array in `generate-narration.mjs` and re-run it
so the audio matches.

---

## Per-week lesson videos (Weeks 1–5)

Each week also has a full theme-aware **lesson video** built from a shared engine
(`src/LessonOverview.tsx`) and a per-week data file (`src/weekN-lesson-data.ts`). The
compositions are wired in `src/Root.tsx` (`Week1Lesson` … `Week5Lesson`) and bundle cleanly.
**Week 3 and Week 4 are complete in source** (24 and 25 scenes; full narration written) and
**ship with offline transcripts** at
`courses/digital-literacy-1/weeks/week-0{3,4}/video-transcript.html` (linked from the course
console). Producing the rendered MP4s is the only remaining step and needs two inputs not in
the repo: an ElevenLabs API key and a few photoreal/screenshot assets (below).

### Render a week's lesson video

```bash
cd video/digital-literacy-1
npm install
export ELEVENLABS_API_KEY=...                  # required — see "Narration" above
node generate-week3-lesson-narration.mjs       # writes public/w3l-01.mp3 … and week3-lesson-durations.json
npm run render:week3lesson                      # writes out/dl1-week3-lesson.mp4
# Week 4: node generate-week4-lesson-narration.mjs ; npm run render:week4lesson
```

The narration generators print whether any clip overruns its scene. The `durationInFrames`
in the data files are **provisional** (estimated from word counts); after the generator writes
`public/weekN-lesson-durations.json`, tighten any flagged scene's `durationInFrames` so the
visuals match the measured audio, then re-render. The `w*l-*.mp3` clips are git-ignored, so
regenerate them on a fresh clone (otherwise the video renders silent).

### User-supplied assets (4 per video)

Four scenes per video render in a built/themed style (no background) until you drop the real
image into `public/` and set its filename on the scene's `bg` field in the data file. None are
required to render — they're polish — but the script was written around them.

**Week 3** (`src/week3-lesson-data.ts`):
- **Scene 1 — hook hero** (photoreal): older veteran at a home desk, a finished letter on screen, a USB drive on the desk.
- **Scene 9 — screenshot**: Word "Save As" screen with a clear file name typed in (e.g. `VA-Notes-2026-06`).
- **Scene 13 — screenshot**: the Ctrl+P print screen — orientation dropdown + the page preview on the right.
- **Scene 24 — outro hero** (photoreal): the same veteran, relaxed, holding a printed page; a "VA Documents" folder on screen.

**Week 4** (`src/week4-lesson-data.ts`):
- **Scene 1 — hook hero** (photoreal): older veteran at a home desk looking at a phone showing a suspicious "account locked" text.
- **Scene 15 — screenshot**: the "Clear browsing data" window with history & cookies checked.
- **Scene 18 — screenshot**: a private/Incognito window showing its dark theme and the private-mode icon.
- **Scene 25 — outro hero** (photoreal): the same veteran, relaxed and confident, the suspicious text now closed; printed handout beside the keyboard.

### After rendering

Same as the intro: the rendered MP4 is **not** embedded (offline-first). The offline copy is
the transcript page (already shipped). Optionally upload the MP4 to YouTube and add a click-out
"Watch the video" link to the matching `video-transcript.html`. **Keep the data file's narration
in sync with its `generate-weekN-lesson-narration.mjs` and the transcript page** — all three
carry the same script.
