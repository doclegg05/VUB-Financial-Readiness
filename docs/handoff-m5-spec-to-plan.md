# HANDOFF — VUB Lessons · M5 spec complete (Codex-reviewed) → writing-plans

> **Authored:** 2026-06-05 · **From:** claude-code (this session) · **For:** next agent picking up M5 after the spec gate.
> **One-line resume:** **The M5 design spec is written, revised via a Codex full-build review, and committed (`f0841c7`) on branch `feat/m5-consoles-lesson-wrap`.** Brainstorming is **done** — all open questions settled, Sections A–F approved. We are at the **final spec-review gate**: once the user approves the written spec, invoke **`writing-plans`** to produce the sequenced TDD plan. **No M5 implementation code exists yet.** Two dependencies are open (FR content export + a data-capture decision) but they block only the FR-assessment phase, not the rest.

---

## 0. Read these first (do not re-derive)
- **THE M5 spec (authoritative; this is the source for the plan):** [docs/specs/2026-06-05-m5-consoles-lesson-wrap-design.md](specs/2026-06-05-m5-consoles-lesson-wrap-design.md). Read it whole — §2 has the full decision log; §6 (Section D+F) carries the FR work; §8 has the risks/blockers.
- **Master design (platform vision):** [docs/specs/2026-06-03-vub-platform-buildout-design.md](specs/2026-06-03-vub-platform-buildout-design.md) — §5.3 (Levels 2/3), §5.4 (assessment — now partially pulled into M5), §11 (SPA-parity risk).
- **M4 spec + locked visual (reuse patterns):** [docs/specs/2026-06-05-m4-shell-catalog-design.md](specs/2026-06-05-m4-shell-catalog-design.md) · [docs/specs/m4-homepage-reference.html](specs/m4-homepage-reference.html).
- **Prior handoff (M5 kickoff, now superseded by this one):** [docs/handoff-m5-consoles-lesson-wrap.md](handoff-m5-consoles-lesson-wrap.md). Older: [docs/handoff-m3-phase-d.md](handoff-m3-phase-d.md) (untracked).
- **Shared layer M5 builds on:** `shared/shell.js` (app bar/footer/breadcrumb; reads `window.VUB_PAGE`), `shared/shell.css`, `shared/brand.css` (token source — `--navy #0A3161`, `--red #B31942`, `--gold #C9A227`, `--cream` bg, `--ink` text; baseline applied via opt-in `.vub-brand`; `html[data-text-size]` hook — dark mode mirrors it). `courses.json` (catalog data).
- **Durable memory:** MemPalace topic `vub-lessons-buildout` (entries through this session summarize the brainstorm + Codex review + scope growth).
- **Operating rules:** brainstorm → spec → plan → build; gate-by-gate; secret-scan (paths-only) before EVERY commit; surface discrepancies (no silent caps); **feature branch, no push** (no remote; outward steps deferred).

---

## 1. Verified current state (2026-06-05)
- **Branch/HEAD:** on **`feat/m5-consoles-lesson-wrap`** at **`f0841c7`**. Branch was cut from `main`@`322263e` (which is M4-complete `e1c5cce` + the kickoff-handoff commit). **`main` is unchanged; no remote configured.**
- **M5 commits so far (both docs-only, no code):**
  - `45d6bef` — initial M5 design spec.
  - `f0841c7` — spec revised per the Codex review (full de-CDN + FR assessment port + 5 refinements + data-capture risk). `102+/85−`.
- **Working tree:** clean except untracked `docs/handoff-m3-phase-d.md` (M3d artifact, out of scope — left as-is).
- **Build:** `npm run build:site` → **exit 0, 123 HTML pages** (re-verified this session).
- **Tests:** `npx playwright test` → **8/8 pass** (the M4 root suite: shell injection, Text-Size persist, Help, reduced-motion, skip-link, instructors-no-404, data-driven cards, homepage no-CDN). Config `playwright.config.js` (testDir `./tests`, baseURL `:3939`, auto-serves `dist/site`).
- **Toolchain:** node v22, npm 11; deps installed; chromium installed.

---

## 2. What is settled (carry into the plan — do NOT relitigate)

**Brainstorm decisions:**
1. **Consoles drop progress/resume** — no progress bar, Resume panel, per-card badges, or reset (shared-lab `localStorage` misleads the next student). The existing ICS console's progress machinery is **removed** in the rebuild.
2. **Full re-skin** of all 9 lesson surfaces (8 ICS decks + FR SPA) through `brand.css` tokens.
3. **Single M5 spec**, but the **plan sequences** the work safest-first.
4. **Cross-lesson nav** = top breadcrumb "Next: Week N →" chip + end-of-deck "Go to next lesson →" handoff; the deck's per-slide prev/next stays at the bottom.
5. **Dark mode is platform-wide** (a `brand.css` token flip toggled from the shell; default **Light**, remembered, ignores OS `prefers-color-scheme`).

**Review-driven decisions (from the Codex full-build review):**
6. **Full platform de-CDN now** (404, all instructors incl. `intake.html`, assessments) + a **global** no-CDN test.
7. **Replace the FR Google-Form assessments with native local client-side-scored + print-to-PDF forms** (no backend, FERPA-safe). **This supersedes the earlier "assessments out (D4)" decision.**
8. **FR test content lives inside the Google Forms → needs export** → the FR-assessment build (F2) is **content-blocked**.
9. **Scoring model:** client-side score + print-to-PDF; no PII stored or transmitted.

**Refinements folded in:** FR `VubProgress` resume calls removed (resolves the "JS untouched" contradiction); `shell.js` `window.VUB_PAGE` made **backward-compatible** (`{course[,lesson]}` *and* `{courseId,n}`); each deck gains a `<main id="vub-main">` (skip-link a11y); "platform-wide dark mode" scoped to `.vub-brand` pages; build/test guards broadened.

---

## 3. The M5 spec at a glance (sections A–F)
- **A — Shared layer:** dark-mode tokens in `brand.css` (`html[data-theme="dark"]`); shell Light/Dark toggle (`localStorage vub:theme:v1`); wrap contract (`class="vub-brand"` + brand/shell assets + `window.VUB_PAGE`); `shell.js` fetches `/courses.json` once for breadcrumb + Next chip (back-compatible).
- **B — Course Consoles ×2:** rebuild `courses/computer-skills/index.html`; **new** `courses/financial-readiness/index.html`. Data-driven, uniform brand cards, ①Pre→②Lessons→③Post guide, **no progress UI**. Additive `courses.json`: per-lesson `secondary{label,path}`; repoint FR `entry` → its console.
- **C — ICS decks ×8:** re-skin (palette → tokens), `<main>` wrap, cross-lesson nav (`{courseId,n}`), end-of-deck `VubShell.showNextLesson()`; remove `VubProgress.saveSlide` (open at slide 1); leave `progress.js` orphaned-not-deleted.
- **D — FR SPA:** re-skin via tokens, remove its dark-mode system + own toggle, de-CDN (fonts + self-host FA subset), shell-wrap with **layout reconcile** (app bar on top, fixed sidebar offset down) — **highest-risk integration**. Course-level breadcrumb only.
- **F — De-CDN + FR assessment port:** F1 strip all CDN asset links platform-wide; F2 port FR pre/post tests to local forms; **F3 = ⛔ content-block gate**; F4 report/certificate polish stays deferred.
- **E — A11y/Testing/Build/Sequence:** AAA contrast in both themes (dark palette is a validated deliverable); extend Playwright (dark toggle, console data-binding, no-progress, cross-lesson nav, **global** no-CDN + broken-link, FR-console exists, FR form scoring); add FA + form assets to `REQUIRED_FILES` + a `courses.json`-target existence check.

---

## 4. Open dependencies / blockers (track these)
- **⛔ FR Google Form export (blocks F2 only):** need the FR pre/post **question text + options + correct-answer key**. Until delivered, F2 is **planned-but-not-built**; steps 1–5 proceed. The milestone cannot fully *close* until this lands. *(The global no-CDN test carries the FR assessment pages as a single documented exception until F2 ships — see spec §7-E2.)*
- **📋 Data-capture decision (stakeholder):** the FR Google Forms currently capture responses to a Google **Sheet** (a central record). Client-side-only scoring **captures nothing centrally** → if TRIO/grant/CFDA reporting or pre→post evidence relies on it, that's lost and a record-of-evidence backend is **deferred (§9)**. Confirm the program does not depend on the Sheet before retiring the Forms.

---

## 5. Process / next steps
1. **User approves the written spec** (final review gate) — or applies changes, then re-review.
2. **`writing-plans`** → `docs/plans/2026-06-05-m5-*.md`. Structure **F2 as a content-gated phase**; order the rest safest-first per spec §7-E4: shared → consoles → ICS decks → FR SPA → F1 de-CDN sweep → F2 (gated) → build+test+whole-impl review.
3. **`superpowers:subagent-driven-development`** (implementer → spec-review → code-quality-review → fix-loop, then a final whole-impl review). Build with `npm run build:site` then `npx playwright test` (auto-serves `dist/site`). TDD the new specs.
4. **`finishing-a-development-branch`** → merge `feat/m5-consoles-lesson-wrap` to `main` locally; **no push**.

---

## 6. Traps / notes (cost time — avoid)
- **Codex is sandbox-blocked from running commands here** ("rejected: blocked by policy") — it does read-only review well, but **run `build:site` / `playwright` yourself** for real pass/fail.
- **Bash quoting:** literal `()` in `$(…)` breaks git-bash; keep grep patterns simple / `grep -F`. Use shape-based secret scans (real key prefixes), NOT the word "token" (CSS tokens are everywhere → false positives).
- **`shell.js` uses absolute root paths** (`/assets`, `/shared`, `href="/"`) → depth-independent but assumes **served-from-root** (the global no-CDN/offline model is "served," not `file://`).
- **CRLF warnings** on commit are benign (Windows autocrlf).
- **`build-site.js`** uses a `PUBLISH` list + a `REQUIRED_FILES` post-copy guard (no `REQUIRED_ITEMS`). New pages under `courses/`/`instructors/` auto-publish; add new critical shared assets (self-hosted FA, FR form assets) to `REQUIRED_FILES`.
- **`.superpowers/` and `test-results/` are git-ignored.**
- **Scope reality:** M5 grew (every review choice maximized scope) into the largest milestone — consoles + 9 lesson wraps + platform dark mode + full de-CDN + an FR assessment-engine port. Lean on per-layer commits + the subagent review loop; FR SPA (D) and F2 can land behind steps 1–5 if they slip.

---

## 7. Deferred (NOT M5)
Assessment report/certificate polish (§5.4/§5.5); central response-capture backend; GitHub repo + push; Netlify retarget; `vublessons.com` domain/TLS; archiving old repos. All gated behind explicit confirmation.

---
*This handoff is a pointer + state snapshot. No course/code file is modified by it. M5 design is complete + committed; implementation is unstarted.*
