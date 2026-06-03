# Migration Manifest — VUB Multi-Course Platform Consolidation (M3)

**This is a DRAFT planning document — it moves, renames, and deletes NOTHING.** It maps every current path in the platform tree to its new home under the single canonical layout from design spec §5.2, so a human can review the plan before any action. All retirements are **ARCHIVE (never delete)**; the actual file operations happen only in milestone **M3** and only after this manifest is explicitly approved.

**Generated:** 2026-06-03 · **Mode:** READ-ONLY (Bash inspection only). The only files created by this task are this `manifest.md` and its sibling `manifest.csv`.

**Honored decisions (from preflight inputs):**
- `docs/preflight/duplicate-inventory.md` — **Copy #1 (deployed, `VUB Financial Readiness Course/intermediate-computer-skills/`) is canonical** for the Intermediate Computer Skills (ICS) course. Copy #2 (`VUB Intermediate Computer Course/`) is an archived Spring-2026 Beckley cohort instance; Copy #3 is the dead 0-byte stub.
- `docs/preflight/baseline-state.md` — the RELOCATION LIST of build/test/Netlify toolchain files (→ platform root) and the root inventory.

**Action vocabulary:** `MOVE` (reposition into canonical tree) · `RENAME` (emoji→kebab) · `ARCHIVE` (retire to `/_archive/…`, never delete) · `RELOCATE` (build/test/deploy → platform root) · `EXCLUDE` (leave in place, not part of shared platform) · `KEEP` (already at correct root path).

> **Target canonical layout (spec §5.2):** `/` homepage · `/shared/` · `/assets/` · `/courses.json` · `/courses/financial-readiness/` · `/courses/computer-skills/` · `/instructors/` · `/_archive/` · build/test/Netlify toolchain at root.

> **Provenance note on "FR course = deploy repo":** Most platform-content items (homepage, shared assets, classes, intake) currently live **twice** — once at the platform root and once inside the FR deploy subrepo (`VUB Financial Readiness Course/`), because the FR repo is the thing Netlify builds. Where the same logical file exists in both places, the **root copy is treated as the platform source of truth (KEEP/MOVE)** and the FR-subrepo copy is flagged. These FR-internal duplicates are called out in the FR section so the human can decide whether to collapse them in M3 (they are NOT independently archived here to avoid double-counting — see Coverage check).

---

## Root / Homepage

| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| KEEP | `index.html` | `/index.html` | Homepage catalog. Spec: "homepage catalog (from root index.html)". Already at correct root path. |
| MOVE | `intake.html` | `/instructors/intake.html` | Assessment intake page → instructors area per §5.2 (`intake.html` lives under `/instructors/`). |
| MOVE | `syllabus-overview.html` | `/instructors/syllabus-overview.html` | Syllabus overview → instructors area (syllabi/teacher guides). |
| KEEP | `courses.json` | `/courses.json` | **Does NOT yet exist** — to be authored in M3 as the catalog manifest. Listed for completeness; flagged below. |

## Shared

| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| KEEP | `shared/glossary.css` | `/shared/glossary.css` | Shared glossary styles. Root `shared/` is the platform source of truth. |
| KEEP | `shared/glossary.js` | `/shared/glossary.js` | Shared glossary behavior. |
| KEEP | `shared/print.css` | `/shared/print.css` | Shared print stylesheet. |
| KEEP | `shared/progress.js` | `/shared/progress.js` | Shared progress tracking. |
| — | (spec also lists `brand.css`, `shell.js`, `shell.css`) | `/shared/brand.css`, `/shared/shell.js`, `/shared/shell.css` | **Do NOT yet exist** in root `shared/`. To be authored/extracted in M3. Flagged in Coverage / Unsure. |

## Assets

| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| MOVE | `VUB Logo.png` | `/assets/VUB Logo.png` | Brand logo (1.88 MB). Source for logo derivatives + favicon per §5.2. Only ONE logo file exists at root (no `.svg`/`.ico` siblings — see baseline divergence #1). |

## FR Course (`VUB Financial Readiness Course/` → `/courses/financial-readiness/`)

> The FR subrepo IS the current deploy repo. Its **SPA + modules + course content** moves under `/courses/financial-readiness/`; its **emoji content folders** rename to kebab and split between the course and `/instructors/`; its **toolchain** RELOCATEs to root (see Build/Test); its **build artifacts, vendored libraries, and AI-tool dotfolders** are EXCLUDEd.

### FR — SPA, modules & course pages
| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| MOVE | `VUB Financial Readiness Course/financial-readiness.html` | `/courses/financial-readiness/financial-readiness.html` | FR single-page course app. |
| MOVE | `VUB Financial Readiness Course/course-description.html` | `/courses/financial-readiness/course-description.html` | Course description page. |
| MOVE | `VUB Financial Readiness Course/course-description.pdf` | `/courses/financial-readiness/course-description.pdf` | Course description PDF. |
| MOVE | `VUB Financial Readiness Course/syllabus.html` | `/courses/financial-readiness/syllabus.html` | FR syllabus (course-facing). |
| MOVE | `VUB Financial Readiness Course/syllabus.pdf` | `/courses/financial-readiness/syllabus.pdf` | FR syllabus PDF. |
| MOVE | `VUB Financial Readiness Course/syllabus-one-page.pdf` | `/courses/financial-readiness/syllabus-one-page.pdf` | One-page syllabus PDF. |
| MOVE | `VUB Financial Readiness Course/module4-income-stack-chart-preview.html` | `/courses/financial-readiness/module4-income-stack-chart-preview.html` | Module 4 chart preview page. |
| MOVE | `VUB Financial Readiness Course/student-upload-instructions.html` | `/courses/financial-readiness/student-upload-instructions.html` | Student upload instructions (also referenced by build REQUIRED_ITEMS). |
| MOVE | `VUB Financial Readiness Course/css/styles.css` | `/courses/financial-readiness/css/styles.css` | FR course styles. |
| MOVE | `VUB Financial Readiness Course/js/script.js` | `/courses/financial-readiness/js/script.js` | FR course script. |
| MOVE | `VUB Financial Readiness Course/weekly-curriculum/` | `/courses/financial-readiness/weekly-curriculum/` | 7 dated week folders + `README.md`, `ASSESSMENT-COLLECTION.md`, `GOOGLE-DRIVE-COLLECTION.md`. FR cohort curriculum (move whole). |
| MOVE | `VUB Financial Readiness Course/videos/` | `/courses/financial-readiness/videos/` | Module videos + thumbnails + NotebookLM videos. Large media (build may strip from deploy output). |
| MOVE | `VUB Financial Readiness Course/templates/vub-assessment-results-tracker.csv` | `/courses/financial-readiness/templates/vub-assessment-results-tracker.csv` | Assessment results tracker template. |
| EXCLUDE | `VUB Financial Readiness Course/404.html` | (regenerated at deploy root) | 404 fallback is a deploy-root concern (netlify catch-all → `/404.html`); re-author at platform root in M3 rather than nest under a course. Flagged. |
| EXCLUDE | `VUB Financial Readiness Course/index.html` | — | FR-subrepo homepage; duplicate of platform root `index.html` (the deploy entry). Root copy is source of truth; collapse decision in M3. |
| EXCLUDE | `VUB Financial Readiness Course/intermediate-computer-skills.html` | — | ICS dashboard — duplicate of the canonical sibling handled in ICS section; keep ONE under `/courses/computer-skills/`. Flagged. |

### FR — emoji content folders (RENAME emoji→kebab)
| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| RENAME | `VUB Financial Readiness Course/📘 Assessments/` | `/courses/financial-readiness/assessments/` | 10 items (pre/post-test html+pdf, answer keys, forms, submit-tests, SETUP-GOOGLE-FORMS.md). `📘 Assessments`→`assessments/`. |
| RENAME | `VUB Financial Readiness Course/📘 Study Resources/` | `/courses/financial-readiness/study-resources/` | 11 items (flashcards, quiz, study-guide, mind-map, podcast.mp3, infographic, slide-deck.pdf). `📘 Study Resources`→`study-resources/`. |
| RENAME | `VUB Financial Readiness Course/📘 Handouts/` | `/courses/financial-readiness/handouts/` | 25 items (worksheets, checklists, reference html+pdf). `📘 Handouts`→`handouts/`. |
| RENAME | `VUB Financial Readiness Course/📘 Teacher Guides/` | `/instructors/teacher-guides/` | 13 items (module1–5 guides + practical-scenarios/tough-questions/step-by-step). `📘 Teacher Guides`→`/instructors/teacher-guides/` (instructors area, per rule). |
| RENAME | `VUB Financial Readiness Course/📘 Admin Paperwork/` | `/instructors/admin-paperwork/` | 4 items (InstructorContract docx+pdf, student-upload-instructions.html, syllabus-one-page.pdf). NOT in brief's emoji list — **mapped by analogy** to instructors area (admin/teacher-facing). **Flagged as UNSURE.** |

### FR — top-level docs/readmes (course-scoped)
| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| MOVE | `VUB Financial Readiness Course/README.md` | `/courses/financial-readiness/README.md` | FR course readme. |
| MOVE | `VUB Financial Readiness Course/START HERE.md` | `/courses/financial-readiness/START HERE.md` | FR onboarding doc. |
| MOVE | `VUB Financial Readiness Course/SATELLITE CLASSROOM SETUP.md` | `/instructors/satellite-classroom-setup.md` | Instructor setup doc → instructors area. |
| MOVE | `VUB Financial Readiness Course/AGENTS.md` | `/courses/financial-readiness/AGENTS.md` | FR-subrepo governance doc (distinct copy from root AGENTS.md). Collapse-vs-keep decision in M3. |
| MOVE | `VUB Financial Readiness Course/CLAUDE.md` | `/courses/financial-readiness/CLAUDE.md` | FR-subrepo project instructions. |
| EXCLUDE | `VUB Financial Readiness Course/CLAUDE.local.md` | — | Local-override file → EXCLUDE from shared (rule: `*.local.md`/`CLAUDE.local.md`). Path-link/summarize only. |

### FR — duplicated platform folders (FR copy NOT independently moved)
| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| EXCLUDE | `VUB Financial Readiness Course/shared/` | — | Duplicate of root `shared/` (subset: glossary.js, progress.js). Root `shared/` is source of truth (see Shared section). Collapse in M3. |
| EXCLUDE | `VUB Financial Readiness Course/assets/` | — | Contains `vub-logo.svg`; root `/assets/` is the canonical assets dir. Decide logo-derivative source in M3. |
| EXCLUDE | `VUB Financial Readiness Course/classes/` | — | Duplicate of root `classes/` (same `_admin-workflow.md`, `computer-skills-spring-2026-beckley/`, `index.html`). Root copy handled in Instructors section. |
| EXCLUDE | `VUB Financial Readiness Course/intake.html` | — | Duplicate of root `intake.html` (→ `/instructors/intake.html`). Root copy is source of truth. |
| EXCLUDE | `VUB Financial Readiness Course/assessment-service-kit/` | — | Duplicate of root `assessment-service-kit/` (EXCLUDEd as platform tooling; root copy handled below). |
| EXCLUDE | `VUB Financial Readiness Course/docs/` | — | FR-subrepo docs = `superpowers/` vendored skill docs. Vendored → EXCLUDE. |
| EXCLUDE | `VUB Financial Readiness Course/MEMORY/` | — | FR-subrepo `state.json` dev-state; not shared platform content. |
| EXCLUDE | `VUB Financial Readiness Course/.git/` | — | Subrepo git dir — handled by repo-merge strategy in M3, not a file move. |
| EXCLUDE | `VUB Financial Readiness Course/.gitignore` | — | Subrepo ignore rules; superseded by platform-root config in M3. |

## ICS Course (canonical Copy #1 → `/courses/computer-skills/`)

| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| MOVE | `VUB Financial Readiness Course/intermediate-computer-skills/weeks/` | `/courses/computer-skills/weeks/` | Canonical ICS weeks (week-01..08): presentations, syllabi, pre/post-tests, handouts — the 46-file canonical tree per duplicate-inventory. |
| MOVE | `VUB Financial Readiness Course/intermediate-computer-skills/css/slides.css` | `/courses/computer-skills/css/slides.css` | ICS slide styles. |
| MOVE | `VUB Financial Readiness Course/intermediate-computer-skills/css/styles.css` | `/courses/computer-skills/css/styles.css` | ICS course styles. |
| MOVE | `VUB Financial Readiness Course/intermediate-computer-skills/syllabus-overview.html` | `/courses/computer-skills/syllabus-overview.html` | ICS syllabus overview (build REQUIRED_ITEMS references this path). |
| MOVE | `VUB Financial Readiness Course/intermediate-computer-skills.html` | `/courses/computer-skills/index.html` | The sibling ICS **dashboard** page. Becomes the course entry. Supersedes the duplicate FR-root `intermediate-computer-skills.html` (EXCLUDEd above). |

> Per spec §5.2 the ICS course presents `weeks/week-01..08`, `assessments/`, `handouts/`. Assessments (pre/post-test) and handouts currently live INSIDE the `weeks/*` tree (e.g. `week-01/pre-test.html`, `week-02/handouts/`), not as top-level course dirs. Whether to hoist them into `/courses/computer-skills/assessments/` + `/handouts/` or leave them under `weeks/*` is a **structure decision flagged for M3** (Unsure).

## Instructors (`/instructors/`)

| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| MOVE | `classes/index.html` | `/instructors/classes/index.html` | Class-instances index. Root `classes/` is platform source of truth. |
| MOVE | `classes/computer-skills-spring-2026-beckley/` | `/instructors/classes/computer-skills-spring-2026-beckley/` | Spring-2026 Beckley class instance (move whole). |
| MOVE | `classes/_admin-workflow.md` | `/instructors/classes/_admin-workflow.md` | Class admin workflow notes (underscore working note, not a `.local.md` override — not auto-excluded). |

## Archive (`/_archive/…` — retire, never delete)

| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| ARCHIVE | `VUB Intermediate Computer Course/` | `/_archive/VUB-Course-2026-06-03/` | **Copy #2** — Spring-2026 Beckley ICS cohort instance (whole dir, incl. its own `.git/`, `node_modules/`, `Remotion/`, `reference-design/`, `CLAUDE.md`). Already frozen on git tag **`preflight-freeze-2026-06-03`** (+ branch `freeze/preflight-2026-06-03`). Differs from canonical only by baked cohort dates + 1 pedagogical line; do NOT merge into canonical. |
| ARCHIVE | `weeks/week-01/presentation.html` (and the `weeks/` stub dir) | `/_archive/dead-stub-week-01/presentation.html` | **Copy #3** — confirmed **0-byte** dead stub. Archive (never delete). Never canonical. Empty parent `weeks/` dir retired with it. |
| KEEP | (this manifest) | `/_archive/migration/manifest.md` | Per §5.2 `/_archive/` holds "retired duplicates + this manifest". Currently authored at `docs/migration/manifest.md`; relocate alongside archive in M3. |

## Build / Test / Netlify (RELOCATE FR subrepo → platform root)

> Per baseline-state RELOCATION LIST. **`build-site.js` path constants must be re-pointed:** its `ROOT`, the `ITEMS` copy list, and `REQUIRED_ITEMS` (which name `intermediate-computer-skills.html`, the `intermediate-computer-skills/` folder, `…/syllabus-overview.html`, `…/weeks/week-01/presentation.html`) must be rewritten to the new `/courses/financial-readiness/` + `/courses/computer-skills/` layout.

| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| RELOCATE | `VUB Financial Readiness Course/netlify.toml` | `/netlify.toml` | Site-wide deploy config; emoji-folder rewrites must be re-pointed to new kebab dirs. |
| RELOCATE | `VUB Financial Readiness Course/package.json` | `/package.json` | npm scripts + Playwright/serve devDeps. **Conflicts with existing root `package.json` stub** (231 B) — reconcile in M3. |
| RELOCATE | `VUB Financial Readiness Course/package-lock.json` | `/package-lock.json` | Lockfile. Conflicts with root stub lockfile — reconcile. |
| RELOCATE | `VUB Financial Readiness Course/DEPLOYMENT.md` | `/DEPLOYMENT.md` | Deploy checklist. |
| RELOCATE | `VUB Financial Readiness Course/playwright.config.js` | `/playwright.config.js` | Test runner config (`testDir: ./tests`, serve :3939, baseURL update needed). |
| RELOCATE | `VUB Financial Readiness Course/scripts/build-site.js` | `/scripts/build-site.js` | **Re-point ROOT + ITEMS + REQUIRED_ITEMS to consolidated layout.** |
| RELOCATE | `VUB Financial Readiness Course/scripts/build-site.ps1` | `/scripts/build-site.ps1` | Windows build counterpart. |
| RELOCATE | `VUB Financial Readiness Course/scripts/compare-results.js` | `/scripts/compare-results.js` | Benchmark compare. |
| RELOCATE | `VUB Financial Readiness Course/scripts/run-benchmark.js` | `/scripts/run-benchmark.js` | Benchmark runner. |
| RELOCATE | `VUB Financial Readiness Course/scripts/create-travel-package.ps1` | `/scripts/create-travel-package.ps1` | Offline travel-package bundler. |
| RELOCATE | `VUB Financial Readiness Course/scripts/generate-assessment-pdfs.py` | `/scripts/generate-assessment-pdfs.py` | Assessment PDF generator. |
| RELOCATE | `VUB Financial Readiness Course/scripts/generate-syllabus-pdf.py` | `/scripts/generate-syllabus-pdf.py` | Syllabus PDF generator. |
| RELOCATE | `VUB Financial Readiness Course/scripts/generate-module1-teachers-guide.py` | `/scripts/generate-module1-teachers-guide.py` | Module 1 teacher-guide PDF generator. |
| RELOCATE | `VUB Financial Readiness Course/scripts/generate-module2-teachers-guide.py` | `/scripts/generate-module2-teachers-guide.py` | Module 2 teacher-guide PDF generator. |
| RELOCATE | `VUB Financial Readiness Course/scripts/generate-module3-teachers-guide.py` | `/scripts/generate-module3-teachers-guide.py` | Module 3 teacher-guide PDF generator. |
| RELOCATE | `VUB Financial Readiness Course/scripts/generate-module4-teachers-guide.py` | `/scripts/generate-module4-teachers-guide.py` | Module 4 teacher-guide PDF generator. |
| RELOCATE | `VUB Financial Readiness Course/scripts/generate-module5-teachers-guide.py` | `/scripts/generate-module5-teachers-guide.py` | Module 5 teacher-guide PDF generator. |
| RELOCATE | `VUB Financial Readiness Course/scripts/_teacher_guide_common.py` | `/scripts/_teacher_guide_common.py` | Shared Python helper for teacher-guide generators. |
| RELOCATE | `VUB Financial Readiness Course/scripts/google-forms-setup.gs` | `/scripts/google-forms-setup.gs` | Google Apps Script (not part of site build; relocate only if assessment workflow needs it). |
| RELOCATE | `VUB Financial Readiness Course/tests/helpers.js` | `/tests/helpers.js` | Playwright helper (`COURSE_URL = /financial-readiness.html` — re-point). |
| RELOCATE | `VUB Financial Readiness Course/tests/content/` | `/tests/content/` | 8 content specs (build-output, content-accuracy, dashboard, date-agnostic-schedule, deployment-config, links-integrity, modules-present, slide-counts). |
| RELOCATE | `VUB Financial Readiness Course/tests/functional/` | `/tests/functional/` | 6 functional specs (confetti, mobile, navigation, sidebar-chapters, slide-engine, theme). |
| RELOCATE | `VUB Financial Readiness Course/benchmarks/` | `/benchmarks/` | Benchmark JSON (baseline, fixed, comparison). |

## Exclusions (leave in place / not shared platform content)

| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| EXCLUDE | `VUB Financial Readiness Course/dist/` | — | Build artifacts (site, site-audit, site-test, site-win, FLASHDRIVE_COPY_ME, backups+zips, serve logs). Regenerated by build. |
| EXCLUDE | `VUB Financial Readiness Course/node_modules/` | — | Vendored deps; regenerated by `npm install`. |
| EXCLUDE | `VUB Financial Readiness Course/scripts/__pycache__/` | — | Python bytecode cache. |
| EXCLUDE | `VUB Financial Readiness Course/test-results/` | — | Playwright runtime output. |
| EXCLUDE | `VUB Financial Readiness Course/skills/` | — | Vendored skill library (adapt, animate, audit, …). Not platform content. |
| EXCLUDE | `VUB Financial Readiness Course/skills-lock.json` | — | Lockfile for vendored skills. |
| EXCLUDE | `VUB Financial Readiness Course/.adal/ .agents/ .augment/ .claude/ .codebuddy/ .commandcode/ .continue/ .cortex/ .crush/ .factory/ .goose/ .iflow/ .junie/ .kilocode/ .kiro/ .kode/ .mcpjam/ .mux/ .neovate/ .openhands/ .pi/ .pochi/ .qoder/ .qwen/ .remember/ .roo/ .trae/ .vibe/ .windsurf/ .zencoder/` | — | 30 local AI-tool/IDE config dotfolders in FR subrepo. Local-only → EXCLUDE (grouped as one row). |
| EXCLUDE | `VUB Intermediate Computer Course/Remotion/` | — | (Inside Copy #2, archived whole.) Vendored — noted; not separately moved. |
| EXCLUDE | `VUB Intermediate Computer Course/reference-design/` | — | (Inside Copy #2, archived whole.) Reference design — noted; not separately moved. |
| EXCLUDE | `.claude/` (root) | — | Local Claude settings; root `.gitignore` already excludes. |
| EXCLUDE | `.playwright-mcp/` (root) | — | Playwright-MCP scratch dir (runtime). |
| EXCLUDE | `design.md/` (root) | — | Vendored junk (a **directory**, not a markdown file) per rule. |
| EXCLUDE | `.gitignore` (root) | — | Root ignore rules; folded into platform config in M3. |
| EXCLUDE | `MEMORY/` (root) | — | Platform dev-state (`state.json`); root `.gitignore` already excludes. Not shared content. |
| EXCLUDE | `package.json` / `package-lock.json` (root stubs) | — | 231 B root npm stubs; superseded by RELOCATEd FR toolchain package.json (reconcile in M3). |

## Platform docs & governance (root) — KEEP / MOVE

| Action | Old path | New path | Notes |
|:--|:--|:--|:--|
| KEEP | `CLAUDE.md` (root) | `/CLAUDE.md` | Canonical platform governance (11432 B). Stays at root. |
| KEEP | `AGENTS.md` (root) | `/AGENTS.md` | Agent/governance doc (identical 11432 B to CLAUDE.md — likely dual-name duplicate; reconcile in M3). |
| KEEP | `docs/` (root) | `/docs/` | Project docs (`plans/`, `specs/`, `preflight/`, and now `migration/`). Stays at root. |
| MOVE | `Meeting Notes/` (root) | `/docs/meeting-notes/` | 10 meeting briefs (md+pdf). Fold into platform docs; kebab the folder. |
| MOVE | `assessment-service-kit/` (root) | `/instructors/assessment-service-kit/` | Reusable assessment kit (8 items). Instructor/service tooling → instructors area. **Flagged UNSURE** (could equally stay a root tool). |

---

## Coverage check

**Total manifest records: 99** (verified by counting action-keyword-leading rows in the sibling `manifest.csv`; the markdown tables also carry 2 non-counted placeholder "—" rows — the not-yet-existing `brand/shell` shared files and the `404.html` re-author note — which are notes, not item records).

Counts per ACTION (recomputed from `manifest.csv`, not estimated): **MOVE 31 · EXCLUDE 28 · RELOCATE 23 · KEEP 10 · RENAME 5 · ARCHIVE 2.**

Sensitive-item confirmation (each represented **exactly once**):
- **Duplicate copies:** Copy #1 (canonical ICS) → MOVE to `/courses/computer-skills/` (✓ ICS section). Copy #2 (`VUB Intermediate Computer Course/`) → **ARCHIVE** `/_archive/VUB-Course-2026-06-03/` with freeze tag `preflight-freeze-2026-06-03` (✓). Copy #3 (0-byte stub) → **ARCHIVE** `/_archive/dead-stub-week-01/` (✓).
- **All 5 emoji folders RENAMEd exactly once:** `📘 Assessments`, `📘 Study Resources`, `📘 Handouts`, `📘 Teacher Guides`, `📘 Admin Paperwork` (✓). *(Brief named 4; a 5th — `📘 Admin Paperwork` — was found and is flagged UNSURE.)*
- **The 0-byte stub** is represented exactly once (ARCHIVE row, ✓).
- **Every RELOCATION-LIST file** (netlify.toml, package.json, package-lock.json, DEPLOYMENT.md, playwright.config.js, build-site.js, build-site.ps1, compare-results.js, run-benchmark.js, create-travel-package.ps1, 7 PDF/py generators + `_teacher_guide_common.py`, google-forms-setup.gs, tests/helpers.js, tests/content/, tests/functional/, benchmarks/) is represented exactly once as RELOCATE (✓ 23 rows).
- FR-internal duplicates of platform folders (shared/, assets/, classes/, intake.html, etc.) are EXCLUDEd (flagged for collapse) so they are **not double-counted** against the root source-of-truth rows.

**Note:** `courses.json`, `/shared/brand.css|shell.js|shell.css`, and a root `/404.html` are spec-required targets that **do not yet exist** and must be authored in M3 (no source file to move).
