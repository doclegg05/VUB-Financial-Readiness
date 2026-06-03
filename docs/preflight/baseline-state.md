# Preflight Baseline State

**Generated:** 2026-06-03 (READ-ONLY preflight; no git writes, no file moves)
**Scope:** Baseline the Financial Readiness (FR) subrepo that owns the build/deploy toolchain, and inventory the untracked platform-root files ahead of consolidation.

**Paths**
- Platform root: `C:/Users/Instructor/Dev/curriculum/VUB Lessons`
- FR repo: `C:/Users/Instructor/Dev/curriculum/VUB Lessons/VUB Financial Readiness Course`

---

## 1. FR Repo Baseline

| Item | Value |
|:-----|:------|
| `git rev-parse main` | `dcd3c56cdf316319e13d26278916b4ae52abdd3f` |
| Working tree clean? | **YES** — `git status --porcelain` returned 0 lines |
| Remote (`origin`) | `https://github.com/doclegg05/VUB-Financial-Readiness.git` (fetch + push) |

**Last 3 commits (`git log --oneline -3`):**
```
dcd3c56 feat: expand Module 5 legacy planning materials and spell out abbreviations
ea10c61 Add assessment intake MVP
53b593b Enrich modules 4 and 5
```

Confirms the known facts: FR repo's remote is `github.com/doclegg05/VUB-Financial-Readiness` and the tree is clean at `dcd3c56` on `main`.

---

## 2. Build / Test / Netlify Toolchain

### File → Purpose

| File | Purpose |
|:-----|:--------|
| `netlify.toml` | Netlify deploy config. `command = "npm run build:site"`, `publish = "dist/site"`. Security headers + cache-control headers + redirect/rewrite table + 404 fallback. |
| `package.json` | npm scripts (build/test/pdf/package/benchmark). devDeps: `@playwright/test ^1.58.2`, `serve ^14.2.6`. `"type": "commonjs"`. |
| `package-lock.json` | Lockfile for the above devDeps. |
| `DEPLOYMENT.md` | Human deploy checklist for the Netlify site (prod URL `https://vubcourse.netlify.app`). Documents build command `npm run build:site`, publish dir `dist/site`, `npm test`, preview QA pages, launch + rollback. |
| `playwright.config.js` | Playwright runner config. `testDir: ./tests`, JSON reporter to `test-results/results.json`, webServer `npx serve . -l 3939` on port 3939, baseURL `http://localhost:3939`. |
| `scripts/build-site.js` | **Cross-platform Node build** (executable). Assembles `dist/site/` from a verbatim copy list; declares `REQUIRED_ITEMS` it must produce. Replaces the PowerShell builder so Netlify (Linux) can run it. |
| `scripts/build-site.ps1` | Legacy/Windows PowerShell builder (`build:site:win`). Superseded by `build-site.js` for Netlify but still wired in package.json. |
| `scripts/compare-results.js` | Benchmark comparison (`compare` script) — `benchmarks/baseline.json` vs `benchmarks/fixed.json`. |
| `scripts/run-benchmark.js` | Benchmark runner (`benchmark:baseline` / `benchmark:fixed`). |
| `scripts/create-travel-package.ps1` | Offline "travel package" bundler (`package:travel[:no-videos]`). |
| `scripts/generate-assessment-pdfs.py` | PDF generation for assessments (`pdf:assessments`). |
| `scripts/generate-syllabus-pdf.py` | Syllabus PDF generator (Python). |
| `scripts/generate-module{1..5}-teachers-guide.py` | Per-module teacher-guide PDF generators (Python). |
| `scripts/_teacher_guide_common.py` | Shared Python helper for the teacher-guide generators. |
| `scripts/google-forms-setup.gs` | Google Apps Script for Forms setup (not part of site build). |
| `scripts/__pycache__/` | Python bytecode cache (build artifact; should not relocate). |
| `tests/helpers.js` | Playwright helper (`enterModule`, `COURSE_URL = /financial-readiness.html`). |
| `tests/content/*.spec.js` | Content tests: `build-output`, `content-accuracy`, `dashboard`, `date-agnostic-schedule`, `deployment-config`, `links-integrity`, `modules-present`, `slide-counts`. |
| `tests/functional/*.spec.js` | Functional tests: `confetti`, `mobile`, `navigation`, `sidebar-chapters`, `slide-engine`, `theme`. |
| `test-results/` | Playwright JSON output dir (runtime artifact). |
| `benchmarks/` | Benchmark JSON inputs/outputs for the compare script. |

### package.json `scripts` block (verbatim)
```json
"scripts": {
  "build:site": "node scripts/build-site.js",
  "build:site:win": "powershell -ExecutionPolicy Bypass -File scripts/build-site.ps1",
  "pdf:assessments": "python scripts/generate-assessment-pdfs.py",
  "test": "npx playwright test",
  "package:travel": "powershell -ExecutionPolicy Bypass -File scripts/create-travel-package.ps1",
  "package:travel:no-videos": "powershell -ExecutionPolicy Bypass -File scripts/create-travel-package.ps1 -SkipVideos",
  "benchmark:baseline": "node scripts/run-benchmark.js --label=baseline",
  "benchmark:fixed": "node scripts/run-benchmark.js --label=fixed",
  "compare": "node scripts/compare-results.js benchmarks/baseline.json benchmarks/fixed.json"
}
```

### netlify.toml — key directives
- **`build.command`** = `npm run build:site`
- **`build.publish`** = `dist/site`
- **Headers:** `/*` → `X-Content-Type-Options: nosniff`, `Referrer-Policy: strict-origin-when-cross-origin`; `/*.html` → `Cache-Control: public, max-age=0, must-revalidate`; `/assets/*` → immutable 1yr; `/css/*` & `/js/*` → 1hr must-revalidate.
- **Redirects/rewrites:** clean-URL rewrites (200) for `/financial-readiness`, `/computer-skills`, `/intermediate-computer-skills`, `/syllabus`, `/intake`; `301` for `/classes` → `/classes/`; emoji-folder rewrites for `/assessments/*`, `/handouts/*`, `/study-resources/*`, `/teacher-guides/*` → the `📘 …/` dirs; catch-all `/*` → `/404.html` (404).

### scripts/build-site.js — what it assembles
Cross-platform Node build that outputs to `dist/site/` (or `argv[2]`). `ROOT` = repo root. It declares a `REQUIRED_ITEMS` allowlist (the files/dirs the build must produce) and an `ITEMS` copy list copied verbatim into the build. `REQUIRED_ITEMS` includes: `index.html`, `404.html`, `financial-readiness.html`, `intake.html`, `assets`, `css`, `js`, `shared`, `classes`, `student-upload-instructions.html`, `intermediate-computer-skills.html`, the `intermediate-computer-skills/` folder, `intermediate-computer-skills/syllabus-overview.html`, and `intermediate-computer-skills/weeks/week-01/presentation.html`. The header comment notes it replaces `scripts/build-site.ps1` so Netlify (Linux) can run it, and that large media files may be stripped from output.

---

## RELOCATION LIST for M7 (FR subrepo → platform root)

These build/test/deploy files currently live ONLY in the FR subrepo but govern the whole deployed multi-course site. M7 must relocate (or re-root) them at the platform root:

**Deploy / build config**
1. `netlify.toml` — site-wide Netlify config (must move to whatever becomes the deploy root).
2. `package.json` — npm scripts + Playwright/serve devDeps.
3. `package-lock.json` — lockfile for the above.
4. `DEPLOYMENT.md` — deploy checklist.
5. `scripts/build-site.js` — the Node build assembler (paths are relative to repo `ROOT`; will need re-pointing).
6. `scripts/build-site.ps1` — Windows build counterpart.

**Test harness**
7. `playwright.config.js` — runner config (`testDir`, webServer on :3939).
8. `tests/helpers.js`
9. `tests/content/` (8 specs)
10. `tests/functional/` (6 specs)

**Supporting build/automation scripts referenced by package.json**
11. `scripts/compare-results.js` + `scripts/run-benchmark.js` (benchmark scripts) + `benchmarks/` data dir.
12. `scripts/create-travel-package.ps1` (travel-package script).
13. `scripts/generate-assessment-pdfs.py`, `scripts/generate-syllabus-pdf.py`, `scripts/generate-module{1..5}-teachers-guide.py`, `scripts/_teacher_guide_common.py` (PDF generators + shared helper).

**Do NOT relocate (runtime artifacts / regenerated):** `scripts/__pycache__/`, `test-results/`, `dist/`, `node_modules/`.

> **M7 caveat:** `build-site.js` resolves everything from repo `ROOT` (`path.resolve(__dirname, "..")`) and `REQUIRED_ITEMS` expects files like `intermediate-computer-skills.html` and `intermediate-computer-skills/…` to sit beside it. When these move to the platform root, the build's `ROOT`, the `ITEMS` copy list, and the `REQUIRED_ITEMS` paths all need re-pointing to the consolidated layout. `scripts/google-forms-setup.gs` is not part of the site build (relocate only if the assessment workflow needs it).

---

## 3. Untracked Platform-Root Inventory

The platform root sits inside the enclosing `C:/Users/Instructor/Dev` git repo, which ignores the whole subtree. **Verified:** from the Dev repo, `git check-ignore -v "curriculum/VUB Lessons/index.html"` → matched by `.gitignore:2:/*`. So these root files are tracked by **no repo** (the two course subfolders are their own separate repos).

Excluded per instructions: `node_modules` (not present at root anyway) and `design.md` (vendored junk — note it is a **directory** named `design.md/`, not a file).

### Top-level items

| Item | Type | Classification |
|:-----|:-----|:---------------|
| `index.html` | file | **Platform content** — course landing/dashboard page. |
| `intake.html` | file | **Platform content** — assessment intake page. |
| `syllabus-overview.html` | file | **Platform content** — syllabus overview page. |
| `VUB Logo.png` | file | **Platform content** — brand logo. *(See divergence note: only ONE logo file exists, not 3 `VUB Logo.*`.)* |
| `shared/` | dir | **Platform content** — shared assets (`glossary.css`, `glossary.js`, `print.css`, `progress.js`) used across courses. |
| `classes/` | dir | **Platform content** — class instances (`index.html`, `computer-skills-spring-2026-beckley/`, `_admin-workflow.md`). |
| `assessment-service-kit/` | dir | **Platform content** — reusable assessment kit (README, template HTML, intake/offer/checklist `.md`, question-bank JSON, prompt pack). |
| `docs/` | dir | **Platform content** — project docs (`plans/`, `specs/`, `preflight/` — this artifact lives here). |
| `weeks/` | dir | **Platform content (stub)** — contains only an empty `week-01/`. Likely a relocation target/placeholder. |
| `VUB Financial Readiness Course/` | dir | **Course repo (own git)** — the FR subrepo baselined in §1; owns the toolchain to relocate. |
| `VUB Intermediate Computer Course/` | dir | **Course repo (own git)** — second course; has its own `.git/`, `.gitignore`, `CLAUDE.md`, `node_modules/`, `Remotion/`, `reference-design/`. |
| `package.json` / `package-lock.json` | files | **Platform content (stub, 231 B json)** — root-level npm stub, distinct from the FR toolchain package.json. Review during consolidation. |
| `AGENTS.md` | file | **Platform content** — agent/governance doc (11432 B). |
| `CLAUDE.md` | file | **Platform content** — project governance (identical size 11432 B to AGENTS.md; likely the canonical project instructions). |
| `Meeting Notes/` | dir | **Platform content (project docs)** — Alison/VUB meeting `.md` + `.pdf` briefs, flowcharts, demo script. |
| `MEMORY/` | dir | **Platform state** — `state.json`. Note: root `.gitignore` lists `MEMORY/` as ignored-if-this-were-tracked. |
| `.gitignore` | file | **Config** — root ignore rules (`node_modules/`, `.claude/`, `MEMORY/`, IDE/OS files). |
| `.claude/` | dir | **Config (EXCLUDE from shared)** — local Claude settings; root `.gitignore` already excludes `.claude/`. |
| `.playwright-mcp/` | dir | **Runtime artifact (EXCLUDE)** — Playwright-MCP scratch dir. |
| `design.md/` | dir | **EXCLUDE (vendored junk)** — per instructions; note it is a directory, not a markdown file. |

### `*.local.md` / `CLAUDE.local.md` scan
- **None found at the platform root** (recursive search excluding `node_modules` and the FR subrepo returned zero hits).
- The FR subrepo contains its own `CLAUDE.local.md` (inside `VUB Financial Readiness Course/`), which per shared-content rules is **EXCLUDE-from-shared**, but it is out of the platform-root scope.
- `classes/_admin-workflow.md` and other `_`-prefixed docs are underscore-prefixed working notes, **not** `.local.md` overrides — they are not auto-excluded by the local-override rule.

---

## Divergences from the task brief (surfaced, not absorbed)

1. **Logo files:** brief expected three `VUB Logo.*` files; only **one** exists — `VUB Logo.png` (1.88 MB). No `.svg`/`.ico`/`.jpg` siblings at root.
2. **`node_modules` at platform root:** none present (only `package.json`/`package-lock.json` stubs). `node_modules/` DOES exist inside both course subrepos.
3. **`design.md`:** it is a **directory** (`design.md/`), not a file — still excluded as vendored junk per instructions.
4. **Second course folder name:** the actual directory is `VUB Intermediate Computer Course/` (a separate git repo with its own `node_modules/`, `Remotion/`, `reference-design/`), distinct from the root-level `intermediate-computer-skills*` HTML that the FR build references. The root `weeks/` stub and this course repo are separate items.
5. **`AGENTS.md` vs `CLAUDE.md`:** identical byte size (11432) at root — likely duplicates of the same governance content under two filenames.
