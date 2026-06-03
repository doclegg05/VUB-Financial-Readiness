# VUB Learning Platform — Build-Out Design (v2)

- **Date:** 2026-06-03
- **Status:** Design approved section-by-section. Per PM review (2026-06-03), implementation is **gated**: **Milestone 1 = Preflight & Freeze (a decision gate, no destructive changes)** must pass before any build work. Spec commit is **held** until the platform repo is established (see §10, §12).
- **Owner:** Britt Legg (VUB instructor, West Virginia)
- **Deliverable:** A unified, accessible, self-hosted static course platform that lets multiple teachers reuse VUB lessons + assessments, anchored by a showcase graded-PDF report.
- **Canonical home:** vublessons.com

---

## 1. Purpose & Context

VUB Lessons began as a personal teaching site for a Veterans Upward Bound (TRIO) program and has grown into a multi-course platform ("VUB Learning") with two courses (Financial Readiness, Intermediate Computer Skills), an assessment service kit, a cohort/intake workflow, and shared progress/glossary tooling. The host college wants to expand it so **other teachers can use the materials and tools**.

Three things drive this build-out:

1. **The graded-PDF assessment is the standout feature.** Teachers/auditors love that a web pre/post-test converts to a professional, graded PDF used as evidence for federal grant (TRIO) funding. We make this a showcase.
2. **The dashboard is confusing.** Users can't tell how to open a lesson or which to pick. (Root cause documented in §5.2 — the computer course physically exists in three drifting copies.)
3. **Branding is improvised.** One hand-coded placeholder SVG + an emoji masthead. Replaced with the official VUB seal.

**North star:** the best, most professional, most usable veteran-focused course platform we can build on a lightweight, offline-capable static stack — without breaking what already works.

---

## 2. Goals & Non-Goals

### Goals
- One **familiar, traditional dashboard** (Google-Classroom cards + Canvas breadcrumbs) where "open this lesson" is obvious at a glance.
- A **beautiful, consistent graded PDF** report across every test (layout polish).
- A **real VUB brand identity** built on the official seal, formalized into one design-token system.
- **Self-serve multi-teacher reuse** (copy-a-link library, no accounts).
- **One canonical file structure** (kill the duplicate/drift problem).
- Deploy as the canonical site at **vublessons.com**.
- Accessibility tuned for **older / veteran learners** (AAA contrast, large targets, text-size control).

### Non-Goals (explicit scope guards)
- **No LMS or framework rebuild** (no React/Next/Moodle/Canvas). Stays static HTML/CSS/JS, offline-capable.
- **No audit-hardening this phase** — no report IDs, integrity hashes, signature blocks, grant/CFDA metadata, or central record-of-evidence backend. (Deferred; see §9.)
- **No changes to lesson content or the assessment scoring engine.** Lessons and quizzes are *moved and re-skinned*, not rewritten. Scoring logic is unchanged.
- **No host-school co-brand.** Standalone VUB / WV / TRIO identity only.

---

## 3. Key Decisions

| # | Decision | Choice |
|---|----------|--------|
| 1 | Technical foundation | **Approach A** — enhanced static + a shared `shell.js`/`shell.css`, `courses.json`-driven catalog, consolidated tree |
| 2 | Branding source | Official **VUB seal** (standalone, "For West Virginia Veterans"); 1200px Topaz upscale → traced to SVG; no host co-brand |
| 3 | Graded PDF scope | **Polish layout + consistency only**; audit-hardening deferred |
| 4 | File structure | **Consolidate freely** (archive-not-delete + migration manifest) |
| 5 | Teacher model | **Self-serve shared library** (copy-a-link, no accounts) |
| 6 | Hosting | **vublessons.com** canonical; one source-of-truth repo on Netlify |
| 7 | Lesson card layout | **Hybrid responsive** (2–3 across on wide screens → 1 column on tablet, with list/grid toggle) |
| 8 | Completion certificate | **Yes** — print-to-PDF, branded |
| 9 | Answer key on report | **Show correct answers on both pre & post** |

---

## 4. Architecture (Approach A)

Pure static HTML/CSS/JS, no framework, offline-capable for the computer lab. Consistency and "LMS-like" behavior come from **single included scripts that inject shared behavior** — the pattern already proven in the codebase (`progress.js` auto-injects `print.css`; `glossary.js` mounts a help modal on any page that loads it).

### Shared components (each one job, well-bounded)
| Component | File | Responsibility | Depends on |
|---|---|---|---|
| Design tokens | `shared/brand.css` | Single source of truth for color/type/spacing/radius/shadow (sampled from the seal) | — |
| Page shell | `shared/shell.js` + `shared/shell.css` | Injects top app bar (seal→home, context, text-size A−/A+, Help, Instructors), breadcrumb, footer on every page | `brand.css`, `courses.json` |
| Progress | `shared/progress.js` (existing) | `VubProgress` localStorage tracker; powers resume/"continue" | — |
| Glossary | `shared/glossary.js` (existing) | `VubGlossary` floating help; plain-language terms for older learners | — |
| Print | `shared/print.css` (existing) | Clean print styling for handouts/reports | — |
| Catalog data | `courses.json` | Declarative course → lesson list (title, topic, path, type, status-key) that the homepage + consoles render from | — |
| Report template | `assessments/report-template` (from service-kit) | The one branded graded-PDF engine used by every test | `brand.css` |
| Certificate | `assessments/certificate.html` | Branded print-to-PDF completion certificate | `brand.css` |

**Why data-driven:** rendering the catalog and consoles from `courses.json` means adding a lesson is a *data edit*, not hand-built HTML — which is also what structurally prevents the duplicate-card drift that caused today's confusion.

---

## 5. Section Designs

### 5.1 Brand System
- Build the identity on the **official VUB seal** (circular navy seal: "VETERANS UPWARD BOUND" / "FOR WEST VIRGINIA VETERANS", central "V" + eagle over a scroll). Source asset: `VUB Logo.png` (1200×1200, Topaz-upscaled, 24-bit, white background).
- **Derivatives produced at build:** trace to a crisp **SVG**; a **transparent** version (white knocked out); a **white-knockout** version for the dark navy nav/footer (a navy seal on navy would vanish); a full **favicon** set.
- **Sample the seal's exact navy** and set `--navy` to match, so site, slide decks, and PDF header all align to the official mark (reads slightly deeper indigo than the current `#0C1A35`).
- Consolidate all color values (currently copy-pasted inline) into one **`shared/brand.css`**.
- **Type usage rules:** Playfair Display for display headings *only*; **Source Sans 3 for all reading text and UI** (18px body / 24px+ slide text; line-height 1.6–1.8; left-aligned; no justified or italic body blocks).
- **Replace** `vub-logo.svg` (referenced by 11 pages — one swap re-brands the site) and hand-fix the two `course-description.html` emoji mastheads.
- Add favicon + a TRIO / U.S. Dept. of Education footer line (credibility, no host-school logo).

### 5.2 Consolidated Structure
**Root cause being fixed:** the Intermediate Computer course exists in **three physical copies** — the deployed copy under `VUB Financial Readiness Course/intermediate-computer-skills/weeks/…`, a separate-repo copy `VUB Intermediate Computer Course/weeks/…`, and a 0-byte dead stub at `weeks/week-01/`. Different homepage buttons point at different copies, and they have **already drifted** (verified non-identical). No dashboard fix is durable while three sources exist.

**Canonical layout** (consolidated repo root → builds to `dist/site`):
```
/                          ← homepage (catalog)
/shared/                   ← brand.css, shell.js/css, progress.js, glossary.js, print.css
/assets/                   ← logo derivatives, favicon
/courses.json              ← catalog/console data
/courses/
   financial-readiness/    ← the SPA + modules
   computer-skills/        ← ONE copy of the 8 weekly lessons
      weeks/week-01 … week-08/
      assessments/         ← pre-test, post-test (was "📘 Assessments")
      handouts/            ← (was emoji folder)
/instructors/              ← syllabi, teacher guides, intake, classes (role-separated)
/_archive/                 ← retired duplicates + manifest (archive, never delete)
```

**Four moves:**
1. Pick the **deployed copy as canonical**; merge any unique content from the other two into it.
2. **Archive** the separate-repo copy and the 0-byte stub into `/_archive/` (never delete).
3. **Rename emoji folders** to kebab-case (`assessments/`, `handouts/`, `study-resources/`, `teacher-guides/`) and update every link.
4. **Re-point every entry link** (homepage cards, test strip, resume banner, class pages) to the single canonical path.

**Guardrails:** produce a **migration manifest** (old path → new path for every move/rename); verify **zero content changes** (lessons/quizzes moved, not edited) via byte/sha comparison where applicable; run a secret-value scan before any commit.

### 5.3 Dashboard & Course Console
Three consistent levels, identical across both courses, with one obvious next action at each step.

**Level 1 — Homepage / Catalog (`/`):** course catalog of whole-card-clickable tiles, each with one primary action + its own progress. A **"Continue where you left off"** banner when prior progress exists (`VubProgress.getLastActivity()`). A clear **Students vs Instructors** split replaces today's footer-buried admin links.

**Level 2 — Course Console (`/courses/<course>/`):** the screen that ends the confusion — same layout for both courses (even though Financial Readiness is internally an SPA):
- Course title + overall **progress bar** ("3 of 8 complete").
- A prominent **CONTINUE / Resume** panel (auto-answers "which lesson?").
- The promoted **"Start here: ① Pre-Test → ② Lessons → ③ Post-Test"** 3-step guide.
- **Lessons in a hybrid responsive layout** (2–3 numbered cards across on wide screens, 1 column on tablet, list/grid toggle). Each card: number, title, **status badge** (Not started ○ / In progress ◐ / Done ✓ — icon **+** word **+** color, never color alone), and **one** primary "Open Lesson" button (syllabus/handout demoted to small secondary links).

**Level 3 — Lesson view:** existing slide decks / SPA, **content untouched**, wrapped by `shell.js` to gain the persistent top bar + **breadcrumb** (Home › Computer Skills › Week 3) + Back-to-course / Next-lesson — injected, no per-deck editing.

**Woven throughout:** shared shell on every page; **role split** (`/instructors/` reachable from a clear top-bar link, not the footer); **text-size A−/A+ control** in the app bar (persisted); data-driven from `courses.json`.

### 5.4 Assessment & Graded PDF (polish)
Layout polish + consistency only (per Decision #3).

**In scope:**
1. **One report template for every test** — standardize on the service-kit `assessment-template.html`; retire the two weaker bespoke course tests. **Same questions, same scoring**, better/uniform report.
2. **Brand the report:** official seal, sampled navy, Playfair/Source-Sans type.
3. **Instructor becomes a field** (fixes hard-coded "Britt Legg") — required for self-serve multi-teacher; a correctness fix, not hardening.
4. **Prouder layout:** standardized header (program · course · PRE/POST badge), tidy student-info strip with **long-form date**, bold score banner, prominent **pre→post improvement block**, clean category bars.
5. **Richer detailed results:** every question in order, showing the question, the **student's answer in full text**, the **correct answer in full text (always shown)**, and a clear **✓ Correct / ✗ Incorrect** marker (icon + word + color). `showCorrectAnswersInReport = on`, on **both** pre & post.
6. Consistent **letter print CSS** (margins, page-break-safe rows, color-accurate navy/gold).

**Out of scope (deferred — see §9):** unique Report ID + integrity hash, authoritative start/finish timestamps, student/instructor signature blocks, CFDA/grant metadata, central record-of-evidence backend.

### 5.5 Multi-Teacher Catalog + Hosting
**Self-serve shared library:**
- The **homepage catalog is the teacher browse surface**; every lesson/test now has one **stable canonical URL** (from §5.2).
- **"Share / Copy link"** affordance on each lesson and test card — paste into a syllabus/email/any system. No accounts.
- **Instructors area** (`/instructors/`): syllabi, teacher guides, printable handouts, the **intake form** (submit a Word test → coordinator builds a cohort test), and class/cohort pages — separated from the student experience.
- Keep the **reusable question bank** (`question-bank-template.json`) so pre/post share items and new cohort tests spin up fast.

**Completion certificate (Decision #8 = yes):** branded print-to-PDF certificate at course completion (student name, course, VUB seal, completion date, instructor) via the same `window.print()` technique — motivator + completion record.

**Hosting → vublessons.com:**
- Establish the **consolidated tree as the single source-of-truth repo**. ⚠️ Verified topology (§12): the `VUB Lessons` root is **not its own repo** — it sits inside the unrelated `C:/Users/Instructor/Dev` repo, which **ignores the entire `curriculum/` subtree**, so the platform's root files are currently **untracked by any repo**. The two courses are **separate GitHub repos** (`VUB-Financial-Readiness`, clean; `VUB-Course`, 33 dirty files). Unifying these is the riskiest work and is handled in **Milestone 1**, not assumed.
- **Reuse the proven Netlify build** (`build-site.js` → `dist/site`, pretty-URL redirects, security headers, custom 404, Playwright test gate) and **Netlify Forms** intake, retargeted at the new structure.
- Point **vublessons.com** at the Netlify site as the custom domain.

---

## 6. Data Model — `courses.json` (sketch)
```json
{
  "courses": [
    {
      "id": "computer-skills",
      "title": "Intermediate Computer Skills",
      "type": "weeks",
      "path": "courses/computer-skills/",
      "lessons": [
        { "n": 1, "title": "VA Online Services", "topic": "VA portals",
          "path": "courses/computer-skills/weeks/week-01/presentation.html",
          "statusKey": "ics:w1" }
      ],
      "preTest":  "courses/computer-skills/assessments/pre-test.html",
      "postTest": "courses/computer-skills/assessments/post-test.html"
    }
  ]
}
```
`statusKey` maps to the existing `VubProgress` namespaces so progress/resume "just work."

---

## 7. Accessibility Standards (older / veteran learners)
- **AAA contrast (7:1)** for body text; soft off-white backgrounds (not stark white).
- **24px+** on-screen reading text; resizes to 200% without breaking.
- **44×44px** minimum buttons/answer controls; ≥8px spacing.
- Visible focus rings; skip-to-content; descriptive headings/titles; breadcrumbs.
- Status/meaning never by color alone (icon + text + color).
- In-page **text-size control** (persisted); no auto-advance, blink, or timed content.
- Forgiving forms: labels above fields, review-before-submit, plain specific error messages.

---

## 8. Migration & Safety
- **Archive, never delete** — retired copies go to `/_archive/` with a manifest.
- **Migration manifest** records every move/rename (old → new path).
- **Zero-content-change verification** — lessons/quizzes compared (sha/byte) before/after where applicable.
- **Secret-value scan** before every commit; abort on a hit.
- **One commit per logical layer** (brand assets, structure migration, shell, consoles, assessments, hosting) — never one giant commit.
- Keep **Playwright tests** green; extend them to cover the new shell + consolidated links.

---

## 9. Deferred — Optional "Audit-Hardening" Phase
Available later if the college requests tamper-evidence/provenance:
unique Report ID + SHA-256 integrity hash (via `crypto.subtle`, no backend), authoritative start/finish timestamps + duration, student attestation + instructor sign-off blocks, standardized grant header (program, CFDA 84.047V, grantee, cohort/term, instrument version), scoring-rubric statement, cohort roll-up CSV for the APR, and (if ever desired) a small serverless record-of-evidence with verification lookup.

---

## 10. Implementation Gating & Phasing
Per PM review, implementation is **gated**. Do **not** green-light a broad "redesign & polish" build. Green-light **only Milestone 1**; the rest proceeds after it passes.

### Milestone 1 — Preflight & Freeze (decision gate; NO destructive changes)
Read-only / capture-only work that ends in an approval gate. Deliverables:
1. **Duplicate inventory** — enumerate all course copies; identify the canonical file for each (sha/byte comparison where copies overlap).
2. **Freeze the dirty ICS repo** — capture the 33 modified/untracked files in `VUB-Course` (commit, or tag/stash on a freeze branch) **before** anything is archived or moved; explicitly record the pending deletions (`.gitignore`, `CLAUDE.md`, `index.html`, `syllabus-overview.html`).
3. **Migration manifest (draft)** — old path → new path for every move/rename/archive, reviewed before any execution.
4. **Repo / build strategy** — recommend where the unified platform repo lives, how `VUB-Financial-Readiness` + `VUB-Course` are folded in (with or without history), and where the Netlify build/test toolchain relocates to (today it lives only in the FR subrepo). Present options + a recommendation for approval.
5. **Acceptance criteria** — define what "done & safe" means for the consolidation before any file moves.
6. **Confirm the answer-key decision** — re-confirm "show correct answers on both pre & post," given it exposes answer keys across cohorts in a self-serve, copy-a-link library (see §5.4).

**Exit gate:** user approves the manifest, repo/build strategy, and acceptance criteria. The spec is committed into the newly-established platform repo at this point.

### Milestones 2–7 — Build (only after Milestone 1 passes)
- **M2 — Brand foundation:** trace/process the seal → SVG + transparent + white-knockout + favicon; author `shared/brand.css` (sample navy; reconcile the two conflicting palettes/font stacks — root Playfair/Source-Sans/`#0C1A35` vs FR Outfit/Inter/`#1e3a8a`); swap `vub-logo.svg` + emoji mastheads.
- **M3 — Structure consolidation:** execute the approved manifest — canonical tree, archive duplicates, rename emoji folders, re-point links, verify zero content change.
- **M4 — Shell + catalog:** `shell.js`/`shell.css`, `courses.json`, new homepage catalog.
- **M5 — Course consoles + lesson wrap:** unified console (hybrid layout, 3-step guide, resume), breadcrumb on every lesson.
- **M6 — Assessment polish:** standardize on one report template, brand it, instructor field, richer detailed results (answers on both), certificate.
- **M7 — Instructors area, self-serve & hosting:** role-split area, copy-link affordances; repo/Netlify retarget; vublessons.com custom domain; extend Playwright tests.

---

## 11. Open Items / Risks
- **Logo vector:** 1200px raster traces well for a flat seal, but a true vector (SVG/AI/EPS) would be the gold standard for large print; nice-to-have, not a blocker.
- **Repo consolidation mechanics (highest risk):** the root is not a repo (ignored by the enclosing Dev/vault repo); two subfolder repos (`VUB-Financial-Readiness` clean; `VUB-Course` with 33 dirty files incl. pending deletions) must be **frozen**, then unified into one source of truth. Decide history-preservation vs archive. Handled in Milestone 1, not assumed.
- **DNS / domain:** point vublessons.com at Netlify (custom domain + TLS) — coordinate at cutover.
- **SPA vs week-grid parity:** Financial Readiness is internally an SPA; the console wrapper must present it with the same model as the week-grid course without rewriting the SPA.

---

## 12. Verified Git Topology (read-only recon, 2026-06-03)

| Location | Repo toplevel | Remote | State |
|---|---|---|---|
| `VUB Lessons/` (root) | `C:/Users/Instructor/Dev` (enclosing, unrelated) | none | **Not its own repo**; Dev `.gitignore` `/*` makes it **ignore all of `curriculum/`** → 0 tracked files; platform root files untracked by any repo |
| `VUB Financial Readiness Course/` | self | `github.com/doclegg05/VUB-Financial-Readiness` | clean; **owns the real build/test/Netlify** (`build:site`, Playwright, `netlify.toml`) |
| `VUB Intermediate Computer Course/` | self | `github.com/doclegg05/VUB-Course` | **33 dirty files** (modified weeks + pending deletions) — must be frozen first |

**Implications:**
- The spec must **not** be committed into the enclosing Dev/vault repo (wrong scope; the subtree is ignored anyway). It is committed once Milestone 1 establishes the platform repo.
- The root `package.json` has only a `dev` (`serve .`) script; the build/test toolchain lives in the FR subrepo and must be **relocated** as part of the repo strategy.
- **Design-system conflict to reconcile (M2):** root pages use Playfair Display / Source Sans 3 with navy `#0C1A35`; the FR subrepo's own CLAUDE.md specifies Outfit / Inter with navy `#1e3a8a` plus a dark-mode system. `brand.css` must establish **one** reconciled token set (sampled from the official seal) rather than inherit both.
