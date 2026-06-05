# HANDOFF — VUB Lessons · M4 complete → M5 (Course Consoles + Lesson Shell-Wrap) kickoff

> **Authored:** 2026-06-05 · **From:** claude-code (this session) · **For:** next agent picking up M5.
> **One-line resume:** **Milestone 4 is DONE, merged to `main` (`e1c5cce`), previewed, and user-approved.** Milestone 5 (course consoles + lesson shell-wrap) is in the **brainstorming** stage — project context explored, the visual-companion offer is on the table (awaiting yes/no), and **no M5 design decision is settled and no M5 code exists yet.** Resume by settling the open M5 questions in §6 (start with the console progress/resume decision), then spec → plan → build.

---

## 0. Read these first (do not re-derive)
- **Master design (the approved platform vision):** [docs/specs/2026-06-03-vub-platform-buildout-design.md](specs/2026-06-03-vub-platform-buildout-design.md) — **§5.3 Level 2 (course console) + Level 3 (lesson view) are M5's design source**; §11 flags the SPA-parity risk.
- **M4 spec + plan + locked visual (reuse these patterns):** [docs/specs/2026-06-05-m4-shell-catalog-design.md](specs/2026-06-05-m4-shell-catalog-design.md) · [docs/plans/2026-06-05-m4-shell-catalog.md](plans/2026-06-05-m4-shell-catalog.md) · [docs/specs/m4-homepage-reference.html](specs/m4-homepage-reference.html).
- **The shell M5 applies (already built, theme-aware):** `shared/shell.js`, `shared/shell.css`, `shared/brand.css`. `shell.js` injects the app bar + footer on any page that includes it, and renders a **breadcrumb from `window.VUB_PAGE = { course, lesson }`** — *built in M4, applied to lessons in M5.*
- **Catalog data:** `courses.json` (each course has `id, title, subtitle, type, progressKey, category, path, entry, preTest, postTest, lessons[]`). Adding content = editing this file.
- **Prior handoff (M3 Phase D):** [docs/handoff-m3-phase-d.md](handoff-m3-phase-d.md) (untracked).
- **Durable memory:** MemPalace topic `vub-lessons-buildout` (latest entries summarize M4 + this M5 kickoff). `MEMORY/state.json` (git-ignored) tracks dev-state.
- **Operating rules that govern this work:** brainstorm → spec → plan → build; gate-by-gate; secret-scan (paths-only) before EVERY commit; surface discrepancies (no silent caps); work on a **feature branch**, not `main`; **no push** (no remote — outward steps deferred).

---

## 1. Verified current state (as of 2026-06-05)
- **Branch/HEAD:** on `main` at **`e1c5cce`**; `main` is the only branch (the M4 feature branch was merged ff and deleted). **No git remote configured.**
- **Working tree:** clean except untracked `docs/handoff-m3-phase-d.md` (an M3d artifact — out of scope; your call to commit/remove).
- **M4 commits:** `e4a821c..e1c5cce` (15) — fonts+tokens, flag SVG, shell.css, shell.js, courses.json, playwright config, homepage rebuild, build guard, tests, instructors landing, skip-link, XSS hardening.
- **Build:** `npm run build:site` → exit 0, **123 HTML pages**; `build-site.js` has a `REQUIRED_FILES` guard.
- **Tests:** `npm test` (`npx playwright test`) → **8/8 pass** (shell injection, Text-Size persist, Help, reduced-motion, skip-link, instructors-no-404, data-driven cards, no-CDN). Config: `playwright.config.js` (testDir `./tests`, baseURL `:3939`, auto webServer `serve dist/site`). **M4 bootstrapped the root test suite** (the FR suite was archived in M3d — it did not relocate).
- **Preview:** built site is being served at **http://localhost:8088** (background task `b9a7x13t3`; `serve` does clean-URL 301→200). May be stopped by the time you read this — relaunch with `npx serve dist/site -l 8088`.
- **Toolchain:** node v22, npm 11; deps installed; chromium installed for Playwright; npm registry reachable.

---

## 2. What M4 shipped (so you don't redo it)
- **Theme system** in `shared/brand.css` — **single source**, Old Glory Blue `#0A3161` + tints, Old Glory Red `#B31942`, gold `#C9A227` accent; **self-hosted fonts (assets/fonts/, NO CDN)**; motif helpers `.vub-tricolor`, `.vub-bunting`; `html[data-text-size="lg"|"xl"]` hooks. Editing tokens re-themes the whole site.
- **Shared shell** (`shell.js`/`shell.css`): injected app bar (seal→`/`, **"Text Size" −/+** persisted via `localStorage vub:textsize:v1`, Help→`VubGlossary.open()` + FAB suppression via `body.vub-has-shell`, "For Instructors"→`/instructors/`), footer, **breadcrumb (from `window.VUB_PAGE`)**, **skip-to-content** (`a.vub-skip` → `#vub-main`; `init()` sets first `<main>` id), reduced-motion JS gate (pauses `svg.vub-flag` SMIL + adds `html.vub-reduced-motion`), idempotent `init()`, XSS-hardened breadcrumb (`safeTxt`).
- **Homepage** `index.html`: data-driven cards from `courses.json` (card `href` set via **DOM property**, not innerHTML — XSS fix `e1c5cce`), animated 50-star flag hero (`assets/vub-usflag.svg` via `scripts/gen-flag.py`, inlined for SMIL), Students/Instructors split, branches band. No static shell (injected), no CDN.
- **`instructors/index.html`** — shell-wrapped landing (links syllabus-overview, intake, classes/).

---

## 3. M5 goal (from the master spec §5.3)
Make the course/lesson pages — which still show the **old (pre-shell) design** in the preview — adopt the shell + patriotic theme, and add lesson-to-lesson navigation:
- **Level 2 — Course Console** (one per course, same model for both): course title; the promoted **"Start here: ① Pre-Test → ② Lessons → ③ Post-Test"** 3-step guide; lessons in a hybrid responsive card grid (status badge per spec — *but see the progress decision in §6*); one primary "Open Lesson" per card; syllabus/handouts demoted to secondary.
- **Level 3 — Lesson view:** existing slide decks / the FR SPA, **content untouched**, wrapped by `shell.js` to gain the persistent app bar + **breadcrumb** (Home › Course › Lesson) + **Back-to-course / Next-lesson** — injected, no per-deck rewrite.

---

## 4. The M5 targets (verified structure)
- **ICS console:** `courses/computer-skills/index.html` — a standalone dashboard ("Select the weekly slideshow"), includes `../../shared/progress.js` + inline script; **no brand.css/shell yet**. → rebuild/re-skin as the Level-2 console (data-driven from `courses.json` `computer-skills.lessons[]`).
- **ICS lesson decks (×8):** `courses/computer-skills/weeks/week-01..08/presentation.html` — slide decks with chapter nav + a `.nav-footer` **prev/next (per-slide)**; include `shared/progress.js` + `glossary.js`; call `VubProgress.saveSlide('ics', N, slide, total)`; **no brand.css/shell**. → wrap with shell (app bar/footer/breadcrumb + cross-lesson back/next); keep the deck's own slide nav; decide theme-depth (§6).
- **FR course:** `courses/financial-readiness/financial-readiness.html` — a **231 KB SPA** (`js/script.js`, tabbed modules, `VubProgress.get('fr', moduleId)` resume hints); **no brand.css/shell**. → **§11 risk:** present with the same console model **without rewriting the SPA**.
- **Cross-lesson nav data:** `courses.json` `lessons[]` (ordered, with `path`, `statusKey`) + `window.VUB_PAGE` per page → drives breadcrumb + next/prev-lesson.

---

## 5. Locked decisions carried from M4 (apply to M5)
- **Theme is site-wide by construction** — every M5 page links `brand.css` + `shell.css` and includes `shell.js`. Do NOT redefine tokens per page.
- **Offline / no CDN** — self-hosted fonts; inline SVG icons; no Google Fonts / Font Awesome.
- **Accessibility** — AAA body contrast, ≥44px targets, visible gold focus, semantic landmarks (single h1, `<main id="vub-main">` for the skip link), status never by color alone, **all motion reduced-motion-gated** (SMIL needs JS gating).
- **HOMEPAGE has NO progress counters and NO resume banner** — because the lab uses **shared computers** (`localStorage` isn't per-student) and **"every class is different"** (user's words). **OPEN: whether this extends to the course console — see §6.**
- **Branch + review discipline** — feature branch; `superpowers:subagent-driven-development` (implementer → spec-review → code-quality-review → fix-loop, then a final whole-impl review). This caught real bugs in M4 (a pre-emptive XSS sink, dead `/instructors/` links). Keep it.

---

## 6. OPEN M5 questions to settle in brainstorming (resume here)
1. **Console progress/resume (FIRST, pivotal):** the master spec's Level-2 console shows an overall progress bar ("3 of 8 complete") + a CONTINUE/Resume panel. But M4 dropped both on the homepage for the shared-lab / every-class-differs reasons. **Does the same reasoning apply to the per-course console?** (Controller's lean: likely yes → console = a clean lesson catalog + the 3-step guide, no progress/resume; confirm with user.)
2. **Lesson-wrap mechanics:** how the injected shell **Back-to-course / Next-lesson** coexists with each deck's existing per-slide prev/next (they're different axes). Likely: shell provides cross-lesson nav (from `courses.json` order + `VUB_PAGE`); deck keeps slide nav. Confirm placement so it's not confusing.
3. **Theme-depth on decks:** full re-skin of 8 decks + the FR SPA to `brand.css` (big) **vs** shell-frame (app bar/footer/breadcrumb gives the branded frame) + light token alignment, with deeper deck re-skin deferred. Scope decision.
4. **FR SPA parity:** present the SPA with the same console model without rewriting it — wrap its home tab, or a light console shim?
5. **Decomposition:** M5 may be too big for one spec/plan (console×2 + wrap 9 lesson surfaces + SPA parity). Consider splitting into **(a) lesson shell-wrap** and **(b) course consoles** as sequential sub-specs.
6. **Visual companion:** offer was made; awaiting yes/no (console layout + lesson-frame are genuinely visual).

---

## 7. Process to follow (same as M4)
brainstorm (settle §6) → **spec** `docs/specs/2026-06-05-m5-*.md` (commit, docs-only + secret-scan) → user review gate → **writing-plans** `docs/plans/2026-06-05-m5-*.md` → **subagent-driven-development** (TDD via Playwright; build with `npm run build:site` then `npx playwright test` — the config auto-serves `dist/site`) → final whole-impl review → **finishing-a-development-branch** (merge to `main` locally; no push).

## 8. Traps / notes (cost time in M4 — avoid)
- **Bash quoting:** literal `()` inside `$(...)` or unescaped parens break git-bash (`eval: syntax error near (`). Keep grep patterns simple / use `grep -F`.
- **Preview server serves only the newest HTML / static files** for the *visual companion* — but the production `serve dist/site` serves everything; don't confuse the two.
- **CRLF warnings** on commit are benign (Windows autocrlf).
- **No `REQUIRED_ITEMS` in build-site.js** — it uses `PUBLISH` (copies `index.html,404.html,courses.json,courses,instructors,shared,assets` recursively) + a `REQUIRED_FILES` post-copy guard. New M5 pages under `courses/`/`instructors/` are auto-published; add critical new shared files to `REQUIRED_FILES`.
- **`.superpowers/` and `test-results/` are git-ignored.**

## 9. Deferred (outward-facing, NOT M5)
Create the GitHub `vublessons` repo + push; archive the two old GitHub repos read-only; Netlify retarget; `vublessons.com` custom domain + TLS. All gated behind explicit confirmation (decision log §"Deferred").

---
*This handoff is a pointer + state snapshot. No course file is modified by this document. M4 is complete; M5 is unstarted beyond exploration.*
