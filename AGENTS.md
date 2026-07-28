# AGENTS.md — VUB Learning Platform

## What this repo is

**VUB Learning** — the Veterans Upward Bound course platform for WV Veterans Upward
Bound. It is a **static site hosting three independent courses**, not a single course.

> **Repo naming:** this repo was renamed `VUB-Financial-Readiness` → **`vublessons`** on
> 2026-07-28, matching the `package.json` name. It carried the old name from when it held
> only the Financial Readiness course — which is now **one of three** courses here.
> GitHub redirects the old URL, so stale clones and links keep working, but use
> `doclegg05/vublessons`. Older `docs/` and `_archive/` references to the previous name
> are historical and were left as-is.

**Live site:** <https://vublessons.com> — Netlify project `vubcourse`, built from `main`.

---

## Courses

| id | Course | Shape | Catalog key | Entry |
|:---|:-------|:------|:------------|:------|
| `computer-skills` | Intermediate Computer Skills | 8 weeks | `ics` | `courses/computer-skills/index.html` |
| `financial-readiness` | VUB Financial Readiness | 5 modules | `fr` | `courses/financial-readiness/financial-readiness.html` |
| `digital-literacy-1` | Digital Literacy — Level 1 (IC3 GS6) | 5 weeks | `dl1` | `courses/digital-literacy-1/index.html` |

`courses.json` at the repo root is the **catalog source of truth**. It drives the homepage
cards and each course console. Adding or renaming a lesson means editing `courses.json`
*and* the course tree — they are not generated from each other.

Digital Literacy L1 is the first rung of a planned Level 1 → 2 → 3 ladder.
Design spec: `docs/specs/2026-06-24-digital-literacy-l1-design.md`.

---

## Layout

```
index.html          # platform homepage (catalog, data-driven from courses.json)
404.html
courses.json        # CATALOG — drives homepage + consoles
courses/            # the three course trees (see table above)
instructors/        # intake form, class rosters, assessment service kit, syllabus overview
shared/             # cross-course CSS/JS — loaded by every page via /shared/... absolute paths
assets/             # brand images, seal, flag, self-hosted fonts
docs/               # specs, plans, handoffs, migration manifest, meeting notes
scripts/            # build-site.js, gen-flag.py
tools/              # link-check.py, brand asset builder
tests/              # Playwright: content/ + functional/
video/              # DL1 lesson-video sources (MP4s are NOT committed)
_archive/           # provenance README only — payload is git-ignored
```

`shared/` is the platform layer: `brand.css`, `shell.css`, `shell.js`, `text-size.js`,
`progress.js`, `glossary.css`, `glossary.js`, `print.css`, `video-ids.js`. Course pages
reference these with **root-absolute** paths (`/shared/text-size.js`), so they only resolve
when served from the site root — not by opening the file directly off disk.

---

## Commands

```bash
npm run build:site      # copy the deployable tree into dist/site (what Netlify runs)
npm run dev             # serve the repo root
npm run serve:dist      # serve the built output
npx playwright test     # functional + content tests
python tools/link-check.py   # internal link integrity (expects 0 broken)
```

The build is a **copy, not a bundler** — the tree is already deployment-shaped.
`scripts/build-site.js` copies `PUBLISH` items, asserts a `REQUIRED_FILES` list survived,
and strips `.mp4`/`.mp3`/`.mov` as a safety net (course video is YouTube-hosted).
If you add a load-bearing top-level file, add it to `PUBLISH`.

**Known failing tests:** the 5 `tests/functional/dl1-sidebar-scroll.spec.js` cases fail on
`main` (resource link not in viewport after scroll). Pre-existing — verify against a clean
checkout before blaming your change.

---

## Deployment

Netlify builds `main` with `npm run build:site` and publishes `dist/site`.
`netlify.toml` also defines the **pretty-URL redirects** (`/financial-readiness`,
`/computer-skills`, `/syllabus`, `/intake`, `/classes`) and the security/cache headers.

Both this repo and the retired `VUB-Course` repo also have **GitHub Pages** enabled.
Pages serves the repo root directly, so it ignores `netlify.toml` — the pretty URLs 404
there. `vublessons.com` is the real site; treat any `github.io` copy as incidental.

`dist/` is git-ignored. Never commit build output.

---

## Rules

- **DO NOT** embed copyrighted software screenshots without a fair-use justification.
- **DO NOT** add external CDN dependencies — a content test asserts the homepage has zero.
  Fonts are self-hosted in `assets/fonts/`.
- **DO NOT** use fonts smaller than 24pt for slide body text.
- **DO NOT** rely on colour alone to convey information.
- **DO NOT** change pricing, positioning, or learner-facing policy without being asked.
- **DO** keep assessments aligned with the lesson that teaches them (see below).
- **DO** ensure full keyboard navigation and visible focus indicators.
- **DO** run `link-check.py` after moving or renaming anything.

### Assessment alignment

Each course's pre-test and post-test must cover **the topics its lessons actually teach**,
and pre/post must stay **parallel** — same categories, same counts — or the gain
comparison in the results screen is meaningless.

This has broken once already: Computer Skills Week 2 was changed from Video Conferencing
to Windows Tips & Productivity during the M3 consolidation, but the six Zoom/telehealth
questions were left in the tests for months. When you change what a week teaches, update
in the same commit: the interactive test, the printable test, the printable **answer key**,
the topic list on the intro screen, and `syllabus-overview.html`.

**Computer Skills pre/post categories (20 questions):**

| Category | Questions |
|:---------|:----------|
| VA Online Services | 3 |
| Windows Tips & Productivity | 3 |
| Email (Gmail) | 3 |
| Microsoft Office (Word/Excel) | 5 |
| Cloud Computing | 3 |
| AI Tools | 3 |

---

## Audience & pedagogy

Veterans, mostly older adults, many retired; they have completed a Basic Computer Skills
course and work in a lab with individual workstations. Design for that reader.

Apply Knowles' andragogy: respect prior experience, keep it problem-centred and
task-based rather than theoretical, make relevance explicit (VA benefits, telehealth,
household budgets), and give immediate hands-on practice. Celebrate progress.

### Accessibility (WCAG 2.1 AA)

- 4.5:1 contrast for normal text, 3:1 for large text (24px+)
- Full keyboard navigation; visible focus indicators
- Screen-reader-compatible structure; no auto-advancing content
- Semantic controls — interactive elements are `<button>`, not styled `<div>`
- The sitewide text-size control (`shared/text-size.js`) must load on every learner page

---

## Design system

```css
--primary:      #1B365D;   /* VUB navy */
--primary-light:#2C4A7C;
--primary-dark: #0D1B2A;
--accent:       #C9A227;   /* gold */
--accent-light: #E6C65C;
--red:          #B31942;
--off-white:    #F5F7FA;
--gray:         #5A6A7A;
--success:      #28A745;
--danger:       #DC3545;
```

Typography: `'Segoe UI', Tahoma, Geneva, Verdana, sans-serif`; base 18px, slide body 24px,
line-height 1.8. Headings use Georgia in print/syllabus contexts.

---

## Conventions

- Directories and files: lowercase with hyphens (`week-01`, `pre-test.html`)
- Semantic HTML5; CSS custom properties for theming; 2-space indent
- Each weekly presentation: title slide with objectives → content slides → handout prompts
  → knowledge checks → summary → completion slide
- Navigation: arrow buttons, arrow/PageUp/PageDown/Home/End keys, chapter tabs, progress
  bar, slide counter, touch/swipe, and `localStorage` progress persistence

---

## History

This repo is the result of a three-milestone consolidation (June 2026) that folded three
drifting copies of the Computer Skills course, plus the Financial Readiness deploy repo,
into one canonical tree. Plans and acceptance contracts are in `docs/plans/`; the
provenance index is `_archive/README.md`.

The standalone `doclegg05/VUB-Course` repo is **retired** — its content lives here under
`courses/computer-skills/`. Do not restore it as a source of truth.

Docs under `docs/` describe the state at the time they were written and include stale
Windows paths (`C:/Users/Instructor/Dev/...`). Treat them as history, not instructions.

---

*VUB Learning — building technology confidence for veterans.*
