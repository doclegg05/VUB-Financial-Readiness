# VUB Platform — Milestone 3: Structure Consolidation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax.

**Goal:** Execute the approved migration manifest to produce one canonical platform tree (`/courses/…`, `/instructors/…`, `/assets/…`, `/shared/…`), with duplicates archived (never deleted), emoji folders renamed, all links re-pointed, the build working from the new layout, and every acceptance criterion met.

**Architecture:** **Copy-first, archive-last.** Content is COPIED into the new canonical tree and verified content-identical (line-ending-normalized) before any original is touched. Originals are archived only in the final phase, after build + tests + acceptance checks pass. This keeps the whole milestone reversible until the last gate.

**Tech Stack:** git, Bash (cp/rsync, sha256sum with `tr -d '\r'` normalization), Python (link check + `courses.json`), Node (`build-site.js`), Playwright.

**Sources (read these; do not re-derive):**
- Manifest: [docs/migration/manifest.md](../migration/manifest.md) + `manifest.csv` (99 rows; the canonical map).
- Acceptance criteria: [docs/preflight/acceptance-criteria.md](../preflight/acceptance-criteria.md) (the pass/fail contract — **Criterion 0: compare content with line endings normalized**).
- Decisions: [docs/preflight/decision-log.md](../preflight/decision-log.md) (D2 exclude contracts; root canonical; keep assessments in `weeks/`).
- Repo/build strategy: [docs/preflight/repo-build-strategy.md](../preflight/repo-build-strategy.md) (Option A; build relocates to root).

**Decision-overrides applied on top of the manifest:**
1. **D2 — Instructor contracts EXCLUDED.** From `📘 Admin Paperwork/`, migrate ONLY `student-upload-instructions.html` and `syllabus-one-page.pdf` → `/instructors/admin-paperwork/`. **Do NOT migrate `InstructorContract_6weeks.docx` or `InstructorContract_6weeks.pdf`** (they stay in place, unpublished).
2. **Assessments/handouts stay inside `weeks/`** (no hoist to course-level dirs).
3. **Root copies are source of truth**; FR-subrepo duplicates are EXCLUDEd (not copied).

> **Plan location note:** flattened to `docs/plans/` per the 3-level depth rule.

---

## Phase decomposition (each phase = its own gate)

This document fully details **Phase A (Scaffold)**. Phases B–D are specified at task level here and will be expanded into their own plan files (`…-milestone-3b/3c/3d-…`) when reached, so each executes against a verified prior state.

---

# PHASE A — Scaffold the canonical tree (COPY only; non-destructive)

**Goal:** every canonical file exists at its new path, content-identical to source; emoji folders renamed; contracts excluded; originals untouched.

**Safety invariant for Phase A:** no `rm`, no `mv` of originals, no `git` writes to either subrepo. Only new files/dirs are created under the platform tree, then committed to the platform repo.

### Task A1: Create the canonical directory skeleton

**Files:** new directories only.

- [ ] **Step 1: Make the target dirs**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"
cd "$ROOT"
mkdir -p courses/financial-readiness courses/computer-skills \
         instructors/classes instructors/teacher-guides instructors/admin-paperwork \
         instructors/assessment-service-kit _archive docs/meeting-notes
echo "created:"; for d in courses/financial-readiness courses/computer-skills instructors _archive; do [ -d "$d" ] && echo "  $d"; done
```
Expected: all four key dirs listed.

### Task A2: Copy the canonical ICS course (Copy #1 → `/courses/computer-skills/`)

**Files:** copy under `courses/computer-skills/`.

- [ ] **Step 1: Copy the ICS tree (preserve content exactly)**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
SRC="VUB Financial Readiness Course/intermediate-computer-skills"
cp -r "$SRC/weeks" courses/computer-skills/weeks
cp -r "$SRC/css"   courses/computer-skills/css
cp    "$SRC/syllabus-overview.html" courses/computer-skills/syllabus-overview.html
cp    "VUB Financial Readiness Course/intermediate-computer-skills.html" courses/computer-skills/index.html
echo "weeks dirs: $(ls courses/computer-skills/weeks | wc -l) (expect 8)"
```
Expected: 8 week dirs.

- [ ] **Step 2: Verify content-identical (line-ending-normalized) vs source**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
SRC="VUB Financial Readiness Course/intermediate-computer-skills"
fail=0
while IFS= read -r f; do
  rel="${f#$SRC/}"
  a=$(tr -d '\r' < "$f" | sha256sum | cut -d' ' -f1)
  b=$(tr -d '\r' < "courses/computer-skills/$rel" 2>/dev/null | sha256sum | cut -d' ' -f1)
  [ "$a" != "$b" ] && { echo "MISMATCH: $rel"; fail=1; }
done < <(find "$SRC/weeks" "$SRC/css" -type f; echo "$SRC/syllabus-overview.html")
[ $fail -eq 0 ] && echo "ICS content verify: ALL IDENTICAL (normalized)" || echo "ICS verify FAILED"
```
Expected: `ALL IDENTICAL (normalized)`. (The `index.html` came from `intermediate-computer-skills.html`; verify it separately the same way.)

### Task A3: Copy the FR course content (→ `/courses/financial-readiness/`)

- [ ] **Step 1: Copy FR pages, css/js, and bulk folders**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
FR="VUB Financial Readiness Course"
DST="courses/financial-readiness"
for f in financial-readiness.html course-description.html course-description.pdf \
         syllabus.html syllabus.pdf syllabus-one-page.pdf module4-income-stack-chart-preview.html \
         student-upload-instructions.html README.md "START HERE.md" AGENTS.md CLAUDE.md; do
  cp "$FR/$f" "$DST/$f"
done
cp -r "$FR/css" "$DST/css"; cp -r "$FR/js" "$DST/js"
cp -r "$FR/weekly-curriculum" "$DST/weekly-curriculum"
cp -r "$FR/videos" "$DST/videos"
cp -r "$FR/templates" "$DST/templates"
echo "FR pages copied: $(ls "$DST"/*.html | wc -l) html"
```

- [ ] **Step 2: Verify FR content-identical (normalized)** — same `tr -d '\r' | sha256sum` loop as A2 over the copied FR set; expect all identical.

### Task A4: Copy + RENAME the emoji folders (apply D2 contract exclusion)

- [ ] **Step 1: Rename-copy the four course/instructor emoji folders**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
FR="VUB Financial Readiness Course"
cp -r "$FR/📘 Assessments"     courses/financial-readiness/assessments
cp -r "$FR/📘 Study Resources" courses/financial-readiness/study-resources
cp -r "$FR/📘 Handouts"        courses/financial-readiness/handouts
cp -r "$FR/📘 Teacher Guides"  instructors/teacher-guides
echo "renamed 4 emoji folders"
```

- [ ] **Step 2: Admin Paperwork — copy ONLY the non-contract items (D2)**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
FR="VUB Financial Readiness Course"
cp "$FR/📘 Admin Paperwork/student-upload-instructions.html" instructors/admin-paperwork/
cp "$FR/📘 Admin Paperwork/syllabus-one-page.pdf"            instructors/admin-paperwork/
echo "admin-paperwork migrated (contracts EXCLUDED):"; ls instructors/admin-paperwork/
```
Expected: ONLY `student-upload-instructions.html` + `syllabus-one-page.pdf`. **No `InstructorContract*` files.**

- [ ] **Step 3: Privacy assertion**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
find courses instructors -iname 'InstructorContract*' | grep . && echo "!!! CONTRACT LEAKED — ABORT" || echo "privacy OK: no contracts in platform tree"
```
Expected: `privacy OK`.

### Task A5: Copy the Instructors + root-moved content

- [ ] **Step 1: Copy classes, intake, syllabus-overview, setup doc, service kit, meeting notes**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
FR="VUB Financial Readiness Course"
cp -r classes/. instructors/classes/
cp intake.html instructors/intake.html                       # root copy (M2-wired with the seal)
cp syllabus-overview.html instructors/syllabus-overview.html # root copy (M2-wired favicon)
cp "$FR/SATELLITE CLASSROOM SETUP.md" instructors/satellite-classroom-setup.md
cp -r assessment-service-kit/. instructors/assessment-service-kit/
cp -r "Meeting Notes/." docs/meeting-notes/
cp "VUB Logo.png" assets/"VUB Logo.png"
echo "instructors + assets populated"
```

- [ ] **Step 2: Verify the M2-wired root pages copied with their seal references intact**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
echo "intake seal refs: $(grep -c 'assets/vub-seal.svg' instructors/intake.html)"
echo "intake favicon:   $(grep -c 'rel=\"icon\"' instructors/intake.html)"
```
Expected: seal refs ≥ 1 (note: paths will be re-pointed in Phase B — `assets/` is now one level up from `/instructors/`).

### Task A6: Full Phase-A verification + commit

- [ ] **Step 1: Whole-tree normalized content audit** — for every file under `courses/` and `instructors/` that has a known source, assert the normalized sha matches its source (extend the A2/A3 loop to all copied roots). Produce a short report: `N files copied, M verified identical, 0 mismatches`. Any mismatch ABORTS the phase.

- [ ] **Step 2: Confirm originals untouched**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"
git -C "$ROOT/VUB Financial Readiness Course" rev-parse --short HEAD   # expect dcd3c56
git -C "$ROOT/VUB Financial Readiness Course" status --porcelain | wc -l   # expect 0
git -C "$ROOT/VUB Intermediate Computer Course" rev-parse --short main # expect 2870359
```
Expected: FR `dcd3c56`/clean, ICS `2870359` — originals untouched by the copy.

- [ ] **Step 3: Secret scan (paths-only) over the new tree**, then stage + commit

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
grep -rIlE '(AKIA[0-9A-Z]{16}|gh[oprsu]_[0-9A-Za-z]{36}|-----BEGIN [A-Z ]*PRIVATE KEY-----|AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{32,})' courses instructors 2>/dev/null && echo "ABORT: secret" || echo "secret scan CLEAN"
git add courses/ instructors/ assets/ docs/meeting-notes/
git diff --cached --name-only | grep -iE 'InstructorContract' && echo "!!! CONTRACT STAGED — ABORT" || echo "no contract staged"
git commit -m "feat(M3a): scaffold canonical /courses + /instructors tree (copy-first; contracts excluded)"
git log --oneline -1
```
Expected: clean scan, no contract staged, a new commit. **Report the committed file count.**

> **End of Phase A.** Originals still in place; new tree verified. STOP for review before Phase B.

---

# PHASE B — Re-point internal links (detailed in its own plan when reached)

**Goal:** every internal reference in the copied pages resolves to the new layout.

Key tasks (against acceptance Criterion 2):
- Rewrite emoji-folder references (`📘 Assessments/` → `assessments/`, etc.) in all copied FR pages.
- Rewrite ICS references (`intermediate-computer-skills/weeks/` → `computer-skills/weeks/`; the dashboard `intermediate-computer-skills.html` → `computer-skills/`).
- Fix relative depth changes for pages that moved deeper (e.g. `/instructors/intake.html` now reaches `assets/` via `../assets/`; logo `src` becomes `../assets/vub-seal.svg`).
- Fix the two `course-description.html` emoji-shield mastheads → the seal (the M4-deferred item can fold in here since these pages are now in the canonical tree).
- **Gate:** a Python/Node internal-link checker over the new tree reports **0 broken links** and **0 surviving `📘`/`intermediate-computer-skills/`/`VUB Intermediate Computer Course/` references**. Commit `fix(M3b): re-point internal links to canonical layout`.

---

# PHASE C — Build, courses.json, and tests (own plan when reached)

**Goal:** a working build + green tests from the new layout.

Key tasks (acceptance Criteria 6 & 7):
- RELOCATE the toolchain (manifest Build/Test section): `netlify.toml`, `package.json`/`package-lock.json` (reconcile with root stubs), `DEPLOYMENT.md`, `playwright.config.js`, `scripts/*`, `tests/*`, `benchmarks/` → platform root.
- **Re-point `build-site.js`** `ROOT`/`ITEMS`/`REQUIRED_ITEMS` to `/courses/financial-readiness/` + `/courses/computer-skills/`; re-point `netlify.toml` emoji rewrites to the kebab dirs; re-author a root `/404.html`.
- **Author `courses.json`** (the catalog data: both courses → lessons, paths, statusKeys) per spec §6.
- Re-point Playwright `tests/helpers.js` `COURSE_URL` + `playwright.config.js` baseURL.
- **Gate:** `npm run build:site` succeeds; OLD vs NEW `dist/site` file-list diff shows no removals (additions OK); `npx playwright test` green. Commit `feat(M3c): relocate build/test toolchain + courses.json; build parity verified`.

---

# PHASE D — Archive originals + final acceptance (own plan when reached)

**Goal:** retire duplicates safely; meet every acceptance criterion.

Key tasks (acceptance Criteria 3, 4, 5, 8):
- `mv` Copy #2 → `/_archive/VUB-Course-2026-06-03/` (whole dir incl. `.git`, freeze tag preserved).
- `mv` the 0-byte stub + empty `weeks/` → `/_archive/dead-stub-week-01/`.
- Copy the manifest → `/_archive/migration/manifest.md`.
- Decide the FR-subrepo folder disposition (archive locally vs rely on the GitHub archive per Option A) — **gated decision** with the user.
- **Gates:** Criterion 3 (single source — no dup paths; stub only under `/_archive/`); Criterion 4 (archive integrity — freeze tag `preflight-freeze-2026-06-03` resolvable inside the archive); Criterion 5 (privacy — `grep -ri InstructorContract dist/site` = 0); Criterion 8 (secret scan clean). Commit `chore(M3d): archive retired copies; consolidation acceptance verified`.

---

## Self-Review

**Spec/manifest coverage:** Phase A covers all MOVE/RENAME/KEEP content rows + the D2 contract exclusion + the assessments-stay-in-weeks decision; Phase B covers link re-pointing (manifest link notes + Criterion 2); Phase C covers all 23 RELOCATE rows + `courses.json`/`404` authoring + Criteria 6–7; Phase D covers the 2 ARCHIVE rows + Criteria 3/4/5/8. EXCLUDE rows are, by definition, not copied (verified by the "originals untouched" + privacy checks).

**Placeholder scan:** Phase A is fully concrete (exact `cp`/verify/commit commands). Phases B–D are deliberately task-level outlines to be expanded into their own plans against a verified prior state — each names its acceptance gate and commit, so none is a vague "TBD."

**Safety:** Phase A is copy-only (no `rm`/`mv` of originals, no subrepo git writes), verified by the "originals untouched" check (A6 S2). The only destructive operations (archiving moves) are isolated to Phase D, behind Criteria 3/4/5/8. Every phase ends in a secret-scanned commit and a review STOP.

**Consistency:** new paths match the manifest's New-path column and spec §5.2 exactly; the normalized-sha verification matches acceptance Criterion 0.

---

## Execution Handoff

1. **Subagent-Driven (recommended)** — execute Phase A task-by-task; I verify each `cp` with the normalized-sha audit and the "originals untouched" check before the Phase-A commit; then STOP for your review before Phase B.
2. **Inline** — same, in-session.

**Phase A is non-destructive**; the first destructive step is Phase D, which is separately gated. Recommend executing **Phase A only**, then reviewing before B–D are expanded and run.
