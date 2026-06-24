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
npm run start      # opens Remotion Studio to preview/tweak the "Intro" composition
npm run render     # writes out/dl1-intro.mp4 (1920x1080, 30fps, ~2:40)
```

Rendering needs a headless Chromium (Remotion downloads one on first run) and ffmpeg
(bundled with Remotion). On Windows, run from a normal PowerShell/CMD prompt.

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
`durationInFrames` in `src/Root.tsx` (currently 4800 = 160s at 30fps).
