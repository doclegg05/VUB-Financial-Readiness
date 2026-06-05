# Milestone 5 — Course Consoles + Lesson Shell-Wrap + Platform-Wide Dark Mode + Full De-CDN + FR Assessment Port — Design

- **Date:** 2026-06-05 · **Author:** brainstormed with Britt Legg (section-by-section approval; text-only). **Revised** same day to fold in a Codex full-build review.
- **Status:** Design approved (open questions settled; Sections A–F approved). Awaiting final spec review → implementation plan. **One execution dependency is content-blocked — see §6 / §8.**
- **Parent spec:** [2026-06-03-vub-platform-buildout-design.md](2026-06-03-vub-platform-buildout-design.md) §5.3 (Level 2 + Level 3), §5.4 (assessment — partially pulled in), §11 (SPA-parity risk).
- **Predecessor:** M4 complete at `e1c5cce`. Baseline re-verified this session: `npm run build:site` → 123 pages, `npx playwright test` → 8/8.
- **Review input:** Codex read-only review of the full build (commit `45d6bef`) found 3 High / 3 Medium items; all are reflected below (§2 “Review-driven changes”).
- **Reuse:** `shared/shell.js`, `shared/shell.css`, `shared/brand.css`, `courses.json`. Process per handoff §7.

---

## 1. Purpose & scope

M5 makes the course/lesson pages adopt the shell + patriotic theme, adds lesson-to-lesson navigation, introduces **platform-wide dark mode**, brings the **whole platform offline (full de-CDN)**, and **ports the FR Google-Form assessments to native local forms**.

**In scope (M5):**
- **Shared layer:** platform-wide **dark mode** in `brand.css` (token flip) toggled from `shell.js`; `shell.js` extended for the **breadcrumb + cross-lesson "Next" chip** (`courses.json`-driven) with **backward-compatible `window.VUB_PAGE`**; additive `courses.json` touches.
- **Level 2 — Course Consoles (×2):** rebuild `courses/computer-skills/index.html`; create new `courses/financial-readiness/index.html`. Data-driven, uniform brand cards, ① Pre-Test → ② Lessons → ③ Post-Test guide, **no progress/resume UI**.
- **Level 3 — Lesson surfaces (×9):** shell-wrap + **full re-skin to `brand.css`** of the 8 ICS week decks and the FR SPA; cross-lesson nav; FR SPA de-CDN.
- **Full platform de-CDN:** remove **every** CDN *asset* link (Google Fonts, FontAwesome, etc.) from **every published page** — incl. `404.html`, all `instructors/*` (incl. `intake.html`), and assessment pages. Self-host fonts (via `brand.css`) + a FontAwesome subset.
- **FR assessment port:** rebuild the FR pre/post tests from **Google-Form embeds** into **native local, client-side-scored forms with a print-to-PDF result** (no backend; FERPA-safe). *(ICS tests are already local HTML.)*
- Extended Playwright coverage (dark mode, console data-binding, no-progress, cross-lesson nav, **global** no-CDN + broken-link, FR-console existence, FR local-form scoring).

**Out of scope (deferred):**
- **Assessment report/certificate polish** (§5.4 richer report template, instructor-as-field, pre→post improvement block, branded certificate §5.5). M5 delivers a **functional** local FR test + a **basic** printable result, not the full report suite.
- **Central response capture / record-of-evidence backend** (§9) — see the data-capture risk in §8.
- Outward-facing steps (GitHub repo, Netlify retarget, `vublessons.com`, archiving old repos) — handoff §9.
- Lesson **content** changes; assessment **scoring rules** beyond porting existing items.

**Non-goals:** no framework/LMS; no accounts/auth; no rewrite of FR SPA behavior (routing/calculators stay); no per-student persisted state (shared lab).

---

## 2. Settled decisions

### Brainstorm questions
| # | Question | Decision |
|---|---|---|
| 1 | Console progress/resume? | **Drop it** (match homepage). No bar/Resume/badges/reset; existing ICS console progress machinery removed. |
| 2 | Theme depth on lessons? | **Full re-skin** — 8 ICS decks + FR SPA through `brand.css` tokens. |
| 3 | Decompose M5? | **Single M5 spec**; the plan **sequences** safest-first (shared → consoles → ICS decks → FR SPA → de-CDN/assessments). |
| 4 | Cross-lesson nav placement? | **Top breadcrumb chip** ("Next: Week N →") + **end-of-deck handoff**; deck per-slide prev/next stays bottom. |
| 5 | FR dark mode? | **Add dark mode platform-wide.** |

### Review-driven changes (Codex full-build review)
| # | Item | Decision |
|---|---|---|
| 6 | CDN beyond homepage (404/instructors/FR all use CDN; test only covers `/`) | **Full platform de-CDN now** + a **global** no-CDN test. |
| 7 | Embedded Google Forms (FR assessments) | **Replace with local client-side-scored forms + print-to-PDF (no backend).** **This supersedes the earlier D4 "assessments out" decision.** |
| 8 | FR test content source | **Inside the Google Forms — needs export.** F2 (below) is **content-blocked** until the questions + answer key are exported. |
| 9 | FR scoring/response model | **Client-side score + print-to-PDF; no PII stored/transmitted.** |

### Spec refinements applied (from the review)
- **FR progress vs "JS untouched":** FR keeps routing/calculators untouched **but its `VubProgress` resume calls are removed** (like the decks' C3a) — resolves the contradiction.
- **`window.VUB_PAGE` contract:** `shell.js` stays **backward-compatible** — accepts display strings `{ course[, lesson] }` (M4) **and** `{ courseId, n }` (M5, catalog-enriched); degrades gracefully if the `courses.json` fetch fails.
- **Skip-link a11y:** each deck re-skin **wraps content in `<main id="vub-main">`** (some decks start with bare `<body>`; the shell only assigns the id when a `<main>` exists).
- **Dark-mode wording:** "platform-wide" = every page that adopts `.vub-brand` tokens; a page not yet tokenized keeps its current styling until tokenized.
- **Guards:** broaden tests + `REQUIRED_FILES` (see §7-E).

---

## 3. Section A — Shared layer (foundation)

### A1. Dark mode = `brand.css` token flip
`html[data-theme="dark"]` re-values **surface/text tokens only**: `--cream`→deep navy-black, `--ink`/`--muted`→light text, `--border`→low-contrast line, `--white` panels→elevated dark, darker `--shadow-*`. Brand hues hold (`--navy`,`--red`,`--gold`); on-dark accent variants added only where AAA contrast needs it. Mirrors the `html[data-text-size]` hook (single source). **"Platform-wide" = every `.vub-brand` page inherits it automatically;** non-tokenized pages keep current styling until tokenized.

### A2. Toggle is a shell control
`shell.js` adds a **Light/Dark** button beside "Text Size", persisted at `localStorage['vub:theme:v1']`, setting `html[data-theme]`. The FR SPA's own theme toggle is removed and defers to this one.

### A3. Default behavior (confirmed)
Default **Light**; remember the toggle. Do **not** auto-follow OS `prefers-color-scheme` (shared-lab surprise). Reduced-motion stays OS-driven. Theme preference is cosmetic → safe to persist per-machine (unlike progress).

### A4. Lesson-wrap contract
Each Level-3 surface: `class="vub-brand"` on `<html>`; link `/shared/brand.css` + `/shared/shell.css`; include `/shared/shell.js`; set `window.VUB_PAGE`. Absolute root paths → depth-independent (served-from-root; same offline caveat as M4).

### A5. Cross-lesson nav + backward-compatible page contract
`shell.js` fetches `/courses.json` once; for `window.VUB_PAGE = { courseId, n }` it derives the breadcrumb (course + lesson titles) **and** the "Next: Week N+1 →" chip from `lessons[]` order — no per-page duplication. **Back-compat:** pages may instead pass display strings `{ course[, lesson] }` (M4 behavior) or `{ courseId }` only (course-level crumb, no Next chip — used by consoles + the FR SPA). If the fetch fails, fall back to any provided display strings; pages with no `VUB_PAGE` are unaffected.

---

## 4. Section B — Course Consoles (Level 2)

### B1. Two pages, one model, data-driven
- `courses/computer-skills/index.html` — **rebuilt** (old-theme markup + progress UI removed).
- `courses/financial-readiness/index.html` — **new** (lessons link to SPA modules `financial-readiness.html#module1…`).
- Both: `.vub-brand` + shared assets; `window.VUB_PAGE = { course }` (breadcrumb = Home › Course). App bar = Text-Size, Dark/Light, Help, For Instructors.

### B2. Layout (top → bottom)
1. Course title + subtitle (from `courses.json`); patriotic header (navy + `.vub-tricolor`).
2. **"Start here" 3-step guide:** ① Pre-Test (→ `course.preTest`) → ② Lessons (jumps to grid) → ③ Post-Test (→ `course.postTest`).
3. **Lesson grid** — hybrid responsive (2–3 wide / 1 narrow). Per `lessons[]` card: **number badge**, title, **topic** (one line), primary **"Open Lesson →"**, one small **secondary** link. **No status badges.**

### B3. `courses.json` touches (additive)
- Optional **`secondary: { label, path }`** per lesson (omit where none).
- **Repoint FR `entry`** → `…/financial-readiness/index.html` so the data-driven homepage routes to the FR console first. ICS `entry` already → its console.

### B4. Card style (confirmed)
**Uniform brand cards** (not per-week bespoke art) — identical model for both courses, fully data-driven.

---

## 5. Section C — ICS Lesson Decks ×8 (Level 3)

### C1. Re-skin method (×8, repeatable)
- `class="vub-brand"`; link `/shared/brand.css` + `/shared/shell.css`; include `/shared/shell.js`.
- **Replace each deck's inline `:root` palette** so every color references brand tokens (sidebar gradient, week indicator, slide accents, `.nav-footer`) → dark mode flows through. Decks already use `#C9A227`/`#1B365D` (≈ brand) → re-point, not teardown.
- **Ensure a `<main id="vub-main">` landmark** wraps slide content (skip-link target; a11y).
- Slide content + per-slide nav JS otherwise untouched.

### C2. Cross-lesson nav
`window.VUB_PAGE = { courseId: 'computer-skills', n: <weekNum> }` → breadcrumb **Home › Intermediate Computer Skills › Week N: Title** + **"Next: Week N+1 →"**. **End-of-deck handoff:** a one-line hook calls `VubShell.showNextLesson()` on the last slide → prominent "Go to next lesson →".

### C3. Progress removal (Decision #1)
- **(a)** Remove `VubProgress.saveSlide('ics', …)` save/restore → each deck **opens at slide 1**.
- **(b)** `shared/progress.js` orphaned → **left in place (archive-not-delete)**, references removed, marked retired.

---

## 6. Section D — FR SPA + Section F — De-CDN & Assessment Port

### D. FR SPA (Level 3) · sequenced after the decks
- **D1. Re-skin via tokens:** re-point `courses/financial-readiness/css/styles.css` colors/fonts to brand tokens; **remove the SPA's `light/dark-mode` class system + its theme-toggle** (dark mode now from the shell). SPA behavior untouched **except** its `VubProgress` resume calls are removed (consistent with C3a).
- **D2. De-CDN:** drop Google Fonts `<link>` (brand fonts self-hosted); **self-host a trimmed FontAwesome subset** under `assets/` so every `<i class="fa-…">` stays unchanged.
- **D3. Shell-wrap + layout reconcile (main FR risk):** app bar full-width on top; SPA fixed sidebar + content **offset down by app-bar height**; redundant SPA sidebar logo + toggle removed. Breadcrumb course-level only (`{ courseId: 'financial-readiness' }`); SPA sidebar handles module nav (no injected Next chip).

### F. Full platform de-CDN + FR assessment port
- **F1. De-CDN every published page** (Decision #6): remove all CDN *asset* links from `404.html`, `instructors/*` (incl. `intake.html`), assessment pages, and any deck/console still referencing one. Fonts → `brand.css`; icons → self-hosted FA subset. Enforced by the global no-CDN test (§7-E2).
- **F2. Port FR assessments** (Decision #7/9): rebuild FR **pre/post** tests as native local HTML forms mirroring the existing ICS local-test / `assessment-template` pattern — **client-side auto-score → results screen → print-to-PDF**; **no backend, no PII stored or transmitted**. The console 3-step guide links to these new local pages (repoint `courses.json` `preTest`/`postTest` for FR once built).
- **F3. ⛔ Dependency gate (content-blocked, Decision #8):** F2 needs the FR **question text, options, and correct-answer key exported from the live Google Forms**. Until delivered, **F2 is planned-but-not-built**; all other M5 work (A–E, D, F1) proceeds. **The milestone cannot fully close until this content arrives.**
- **F4. Polish deferred:** the §5.4 richer report template, instructor-as-field, improvement block, and §5.5 certificate stay deferred — M5 = functional test + basic printable result.

---

## 7. Section E — Accessibility · Testing · Build · Execution

**E1. Accessibility:** AAA body contrast in **both** light *and* dark → the dark palette is a **validated deliverable**. ≥44px targets, visible gold focus, single `h1` + `<main id="vub-main">` on every wrapped page, status by icon+word+color, all motion reduced-motion-gated.

**E2. Testing (Playwright; extend the 8/8 suite, TDD):**
- Dark toggle persists (`vub:theme:v1`) + applies `html[data-theme]` across console / deck / SPA.
- Console data-driven (card count == `courses.json` `lessons[]`), **no** progress UI, 3-step guide links resolve.
- **FR console exists; global broken-link check (no dead links anywhere).**
- Deck shows breadcrumb + correct "Next" chip and **opens at slide 1**.
- **Global no-CDN sweep across ALL published pages** (every page emits zero external asset requests) — replaces the homepage-only check. *(While F2 is content-blocked, the FR assessment pages still embed Google Forms + CDN; they're listed as the single known-open exception so the suite stays green, and the exception is removed when F2 lands — at which point the sweep is fully strict.)*
- FR SPA hash routing still works (smoke).
- **FR local forms: known answers → expected score; print-to-PDF result renders.** *(Runs once F2 is unblocked.)*
- M4 homepage + instructors still pass, incl. dark mode.

**E3. Build:** `build-site.js` auto-publishes new pages. **Add self-hosted FontAwesome assets + FR local-form assets to `REQUIRED_FILES`;** add a build/test check that every `courses.json` target (`entry`/`preTest`/`postTest`/`lessons[].path`) exists. Gate: `npm run build:site` → `npx playwright test`.

**E4. Execution sequence (single spec; plan orders safest-first):**
1. **Shared layer** — `brand.css` dark tokens + `shell.js` (dark toggle, back-compat cross-lesson nav) + `courses.json` touches → re-verify M4 homepage/instructors in dark.
2. **Consoles ×2.**
3. **ICS decks ×8.**
4. **FR SPA** (re-skin + de-CDN + shell-wrap + layout reconcile).
5. **F1 full de-CDN sweep** (404, instructors, intake, stragglers) + global guards.
6. **F2 FR assessment port** — *gated on F3 content*; if blocked, ship steps 1–5 and hold F2.
7. **Full build + test + whole-impl review.**

Feature branch `feat/m5-consoles-lesson-wrap`; one commit per logical layer; **secret-scan (paths-only) before every commit**; **no push**.

---

## 8. Risks / watch-items
- **⛔ FR assessment content-block (F3):** schedule dependency on the Google-Form export; F2 is isolated so it doesn't block steps 1–5.
- **📋 Data-capture regression (raise with stakeholder):** FR Google Forms currently capture responses to a Google **Sheet** (a central record). Client-side-only scoring **captures nothing centrally** — if TRIO/grant/CFDA reporting or pre→post evidence relies on those records, this is lost, and a record-of-evidence backend is **deferred (§9)**. Confirm the program doesn't depend on the Sheet before retiring the Forms.
- **FR layout reconcile (D3):** fixed sidebar vs injected app bar — verify mobile hamburger + offset in both themes.
- **Dark-mode contrast:** every reused brand hue must clear AAA on dark surfaces.
- **`shell.js` `courses.json` fetch:** async; must degrade gracefully and not regress M4 pages with no `courseId`.
- **Milestone size:** largest yet; rely on the safest-first sequence, per-layer commits, and the subagent review loop. The FR SPA and F2 can land behind steps 1–5 if they slip.

## 9. Deferred (NOT M5)
Assessment report/certificate polish (§5.4/§5.5); central response-capture backend; GitHub repo + push; Netlify retarget; `vublessons.com` domain/TLS; archiving old repos. All gated behind explicit confirmation.

---
*Design approved section-by-section 2026-06-05; revised same day to incorporate the Codex full-build review (de-CDN expansion + FR assessment port + 5 refinements). Next: final spec review → `writing-plans`.*
