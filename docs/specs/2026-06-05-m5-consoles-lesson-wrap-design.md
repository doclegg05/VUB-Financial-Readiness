# Milestone 5 — Course Consoles + Lesson Shell-Wrap + Platform-Wide Dark Mode — Design

- **Date:** 2026-06-05 · **Author:** brainstormed with Britt Legg (section-by-section approval; text-only).
- **Status:** Design approved (all five open questions settled; Sections A–E approved). Awaiting spec review → implementation plan.
- **Parent spec:** [2026-06-03-vub-platform-buildout-design.md](2026-06-03-vub-platform-buildout-design.md) §5.3 (Level 2 console + Level 3 lesson view), §11 (SPA-parity risk).
- **Predecessor:** M4 complete at `e1c5cce` (shared shell, data-driven homepage, `brand.css` theme system, self-hosted fonts, Playwright suite 8/8). M5 *applies* the shell that M4 *built*.
- **Reuse:** `shared/shell.js`, `shared/shell.css`, `shared/brand.css`, `courses.json`. Process per handoff §7.

---

## 1. Purpose & scope

M5 makes the **course/lesson pages adopt the shell + patriotic theme** (today they still show the pre-shell design), adds **lesson-to-lesson navigation**, and **introduces a platform-wide dark mode**. It completes Levels 2 and 3 of the master-spec dashboard model.

**In scope (M5):**
- **Shared layer:** platform-wide **dark mode** in `brand.css` (token flip) toggled from `shell.js`; `shell.js` extended to render the **breadcrumb + cross-lesson "Next" chip** from `courses.json`; additive `courses.json` data touches.
- **Level 2 — Course Consoles (×2):** rebuild `courses/computer-skills/index.html`; create **new** `courses/financial-readiness/index.html`. Data-driven, uniform brand cards, the ① Pre-Test → ② Lessons → ③ Post-Test guide, **no progress/resume UI**.
- **Level 3 — Lesson surfaces (×9):** shell-wrap + **full re-skin to `brand.css`** of the 8 ICS week decks and the FR SPA; cross-lesson nav; FR SPA **de-CDN** (fonts + FontAwesome).
- Extended Playwright coverage (dark mode, console data-binding, no-progress, cross-lesson nav, FR no-CDN, M4 regression).

**Out of scope (deferred):**
- **Assessment forms** (ICS pre/post tests, FR `assessments/…`) — re-skin/polish belongs to the master spec **§5.4 (its own milestone)**. The consoles *link* to the existing tests; M5 does **not** restyle them.
- Outward-facing steps (GitHub repo, Netlify retarget, `vublessons.com`, archiving old repos) — deferred per handoff §9.
- Any change to **lesson content** or **assessment scoring**.

**Non-goals:** no framework/LMS; no accounts/auth; no rewrite of the FR SPA's behavior (hash routing, calculators/sliders stay); no per-student state (shared lab).

---

## 2. Settled decisions (this brainstorm)

| # | Question | Decision |
|---|---|---|
| 1 | Console progress/resume? | **Drop it** — match the homepage. Consoles have **no** progress bar, Resume panel, per-card badges, or reset. The existing ICS console's progress machinery is **removed** in the rebuild. (Shared-lab `localStorage` misleads the next student.) |
| 2 | Theme depth on lessons? | **Full re-skin everything** — 8 ICS decks + FR SPA routed through `brand.css` tokens. |
| 3 | Decompose M5? | **Single M5 spec**, but the implementation **plan sequences** the work safest-first (shared → consoles → ICS decks → FR SPA last). |
| 4 | Cross-lesson nav placement? | **Top breadcrumb chip** ("Next: Week N →") + **end-of-deck handoff** on *Finish*. The deck's per-slide prev/next stays at the bottom — separated by placement + wording. |
| 5 | FR dark mode? | **Add dark mode platform-wide** (not FR-only). Touches `brand.css` + every page, including M4's homepage/instructors. |

**Section approvals:** A (shared layer), B (consoles), C (ICS decks), D (FR SPA), E (a11y/testing/build/sequence) — all approved, incl. D4 (assessments out) and D2 (FontAwesome self-host subset).

---

## 3. Section A — Shared layer (foundation)

### A1. Dark mode = `brand.css` token flip
Add an `html[data-theme="dark"]` block that **re-values surface/text tokens only**: `--cream` → deep navy-black surface, `--ink`/`--muted` → light text, `--border` → low-contrast line, `--white` card surfaces → elevated dark panels, darker `--shadow-*`. **Brand hues hold** (`--navy`, `--red`, `--gold`); on-dark accent variants are introduced only where AAA contrast requires (large-text/accents — same rule as `--blue-soft`/`--gold` today). Mirrors the existing `html[data-text-size]` hook → single-source, familiar pattern. Any `.vub-brand` page inherits dark mode automatically.

### A2. Toggle is a shell control
`shell.js` gains a **Light/Dark** button in the app bar beside "Text Size", persisted under `localStorage` key **`vub:theme:v1`**, setting `html[data-theme]`. The FR SPA's own theme toggle is **removed** and defers to this one.

### A3. Default behavior (confirmed)
Default to **Light** on first visit; remember the user's toggle. **Do not** auto-follow OS `prefers-color-scheme` (a shared lab machine set to dark would surprise students). Reduced-motion remains OS-driven as today. Theme preference is **cosmetic** → persisting it per-machine is acceptable (unlike progress, which misleads).

### A4. Lesson-wrap contract
Every Level-3 surface: add `class="vub-brand"` to `<html>`; link `/shared/brand.css` + `/shared/shell.css`; include `/shared/shell.js`; set `window.VUB_PAGE`. `shell.js` uses absolute root paths, so it works at any folder depth (served-from-root model; offline caveat = same as M4).

### A5. Cross-lesson nav data source
`shell.js` **fetches `/courses.json` once**, locates the current lesson by `window.VUB_PAGE = { courseId, n }`, and derives the breadcrumb (course + lesson titles) **and** the "Next: Week N+1 →" chip from `lessons[]` order — no per-page duplication, nothing drifts. Pages that supply only `{ courseId }` (no `n`) get a course-level breadcrumb and no Next chip (used by the FR SPA).

---

## 4. Section B — Course Consoles (Level 2)

### B1. Two pages, one model, data-driven
- `courses/computer-skills/index.html` — **rebuilt** (bespoke old-theme markup, progress banner, badges, reset all removed).
- `courses/financial-readiness/index.html` — **new** (FR has no console today; the SPA is the entry). Lessons link to the SPA modules (`financial-readiness.html#module1…`).
- Both: `class="vub-brand"` + shared assets, `window.VUB_PAGE = { course }` (breadcrumb = Home › Course). App bar provides Text-Size, Dark/Light, Help, For Instructors.

### B2. Layout (top → bottom)
1. Course title + subtitle (from `courses.json`), patriotic header (navy + `.vub-tricolor`).
2. **"Start here" 3-step guide** — prominent band: **① Pre-Test** (→ `course.preTest`) → **② Lessons** (jumps to grid) → **③ Post-Test** (→ `course.postTest`).
3. **Lesson grid** — hybrid responsive (2–3 across wide / 1 column narrow). One card per `lessons[]` entry: **number badge**, **title**, **topic** (one line), one primary **"Open Lesson →"**, one small **secondary** link (demoted). **No status badges.**

### B3. `courses.json` touches (additive)
- Optional **`secondary: { label, path }`** per lesson for the demoted syllabus/handout link (omit where none exists, e.g. FR modules).
- **Repoint FR `entry`** from `…/financial-readiness.html` to **`…/financial-readiness/index.html`** so the (data-driven) homepage card routes veterans to the FR console first. ICS `entry` already points at its console.

### B4. Card style (confirmed)
**Uniform brand cards** (not per-week bespoke art) — clean numbered cards, identical model for both courses, fully data-driven, easiest to maintain.

---

## 5. Section C — ICS Lesson Decks ×8 (Level 3)

### C1. Re-skin method (repeatable across all 8)
- Add `class="vub-brand"`; link `/shared/brand.css` + `/shared/shell.css`; include `/shared/shell.js`.
- **Replace each deck's inline `:root` palette** so every color references brand tokens (sidebar gradient, week indicator, slide accents, `.nav-footer` buttons). This is what makes **dark mode flow through**. Decks already use `#C9A227` (brand gold) and `#1B365D` (≈ brand navy), so this is a re-point, not a teardown.
- **Slide content + per-slide nav JS untouched** (chrome only).

### C2. Cross-lesson nav
Each deck sets `window.VUB_PAGE = { courseId: 'computer-skills', n: <weekNum> }`. `shell.js` (per A5) renders **Home › Intermediate Computer Skills › Week N: Title** (course crumb = back to console) + **"Next: Week N+1 →"**. **End-of-deck handoff:** a **one-line hook** in each deck's slide JS calls a shell helper (`VubShell.showNextLesson()`) when the last slide is reached → surfaces a prominent "Go to next lesson →". (Small, surgical per-deck addition.)

### C3. Progress removal (consistency with Decision #1)
- **(a)** Remove the `VubProgress.saveSlide('ics', …)` save/restore calls so **each deck opens at slide 1** (shared-lab consistency; small per-deck JS edit).
- **(b)** `shared/progress.js` becomes orphaned → **left in place (archive-not-delete)**, references removed, noted as retired.

---

## 6. Section D — FR SPA (Level 3) · riskiest surface, sequenced last

### D1. Re-skin via tokens
Re-point `courses/financial-readiness/css/styles.css` colors/fonts to brand tokens (`var(--navy)`, `var(--ink)`, `var(--cream)`, `var(--font-display/body)`). **Remove the SPA's `light-mode`/`dark-mode` class system + its sidebar theme-toggle** — dark mode comes from the shell's `html[data-theme]` flip. SPA **JS/behavior untouched** (hash routing, sliders, Module-4 calculators).

### D2. De-CDN (closes the offline/no-CDN violation)
- **Fonts:** drop the Google Fonts `<link>`; Playfair Display + Source Sans 3 already self-hosted via `brand.css`.
- **FontAwesome:** **self-host a trimmed FA subset** (webfont + only-used icon CSS) under `assets/` — keeps every `<i class="fa-…">` in the markup **unchanged**. (Confirmed tactic.)

### D3. Shell-wrap + layout reconcile (main FR risk)
Shell **app bar full-width on top**; the SPA's fixed left sidebar + content area **offset down by app-bar height**. The SPA's redundant sidebar logo + theme-toggle are removed (logo → app bar; toggle → shell). Breadcrumb is **course-level only** (`window.VUB_PAGE = { courseId: 'financial-readiness' }`, no `n`); the SPA's internal sidebar handles module-to-module nav, so **no** courses.json "Next" chip is injected (would fight hash routing).

### D4. Assessments out (confirmed)
FR pre/post-test forms and ICS tests are **not** re-skinned in M5 (master spec §5.4, separate milestone). Consoles link to them as-is.

---

## 7. Section E — Accessibility · Testing · Build · Execution

### E1. Accessibility
AAA body contrast must hold in **both light and dark** → the **dark token palette is a validated deliverable**, not eyeballed. Keep ≥44px targets, visible gold focus, single `h1` + `<main id="vub-main">`, status by icon+word+color, all motion reduced-motion-gated.

### E2. Testing (Playwright; extend the 8/8 root suite, TDD)
- Dark toggle persists (`vub:theme:v1`) + applies `html[data-theme]` across a console / a deck / the SPA.
- Console is data-driven (rendered card count == `courses.json` `lessons[]`), shows **no** progress UI, and the 3-step guide links to `preTest`/`postTest`.
- **FR console exists; no dead links.**
- Deck shows breadcrumb + correct "Next" chip and **opens at slide 1** (no resume).
- **FR SPA emits no CDN requests** (existing no-CDN test now covers FR too); hash routing still works (smoke).
- M4 homepage + instructors still pass — incl. in dark mode.

### E3. Build
`build-site.js` already publishes `index.html, 404.html, courses.json, courses, instructors, shared, assets` recursively → new pages auto-ship. **Add the self-hosted FontAwesome assets to the `REQUIRED_FILES` guard.** Gate: `npm run build:site` (page count rises by the new FR console) → `npx playwright test`.

### E4. Execution sequence (single spec, plan orders safest-first)
1. **Shared layer** — `brand.css` dark tokens + `shell.js` dark toggle + cross-lesson nav (`courses.json` fetch) + `courses.json` data touches → **re-verify M4 homepage/instructors in dark**.
2. **Consoles ×2** (ICS rebuild + FR new).
3. **ICS decks ×8** (re-skin + wrap + remove slide-resume + end-of-deck hook).
4. **FR SPA** last (re-skin + de-CDN + shell-wrap + layout reconcile).
5. **Full build + test + whole-impl review.**

Feature branch `feat/m5-consoles-lesson-wrap`; one commit per logical layer; **secret-scan (paths-only) before every commit**; **no push** (no remote; outward steps deferred).

---

## 8. Risks / watch-items

- **FR layout reconcile (D3)** — fixed sidebar vs injected app bar is the highest-risk integration; verify mobile hamburger + content offset in both themes.
- **Dark-mode contrast** — every reused brand hue must clear AAA on the new dark surfaces; treat the dark palette as a first-class deliverable with explicit contrast checks.
- **`shell.js` courses.json fetch** — async; ensure breadcrumb degrades gracefully if the fetch fails (fall back to any `window.VUB_PAGE` display strings) and that it doesn't regress M4 pages that set no `courseId`.
- **Single-spec size** — large surface; the plan's safest-first sequence + per-layer commits keep it reviewable. The FR SPA can be merged behind the rest if it slips.
- **Scope creep into assessments** — explicitly fenced out (D4); the 3-step guide only links.

---

## 9. Deferred (NOT M5)
Assessment-form re-skin/polish (§5.4); GitHub repo + push; Netlify retarget; `vublessons.com` domain/TLS; archiving old repos. All gated behind explicit confirmation.

---
*Design approved section-by-section on 2026-06-05. Next: spec self-review → user spec review → `writing-plans`.*
