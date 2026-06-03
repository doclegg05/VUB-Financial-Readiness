# VUB Platform — Milestone 1: Preflight & Freeze — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Produce a complete, approved decision package (inventory, repo freeze, migration manifest, repo/build strategy, acceptance criteria) that makes the later VUB platform consolidation safe — **with zero destructive changes** to any course content.

**Architecture:** This milestone is a **preflight gate**, not a build. It is read-only and capture-only: it inventories the three drifting course copies, freezes the dirty `VUB-Course` repo on a snapshot branch, drafts a reviewable migration manifest, and decides where the unified platform repo + build/test toolchain will live. It ends in a human approval gate; only after approval is a platform repo created and the spec committed.

**Tech Stack:** git (CLI), PowerShell 7 (`Get-FileHash`, file ops), Markdown artifacts. No application code is written in this milestone.

**Source spec:** [docs/specs/2026-06-03-vub-platform-buildout-design.md](../specs/2026-06-03-vub-platform-buildout-design.md) (see §10 Milestone 1, §12 Verified Topology).

> **Plan location note:** the skill default is `docs/superpowers/plans/`, but the project's 3-level depth rule forbids it; flattened to `docs/plans/`.

---

## Verified facts the executor must assume (from read-only recon 2026-06-03)

- `c:\Users\Instructor\Dev\curriculum\VUB Lessons` (the platform root) is **NOT its own git repo**. Its git toplevel is `C:/Users/Instructor/Dev` (an unrelated vault repo) whose `.gitignore` `/*` rule **ignores the entire `curriculum/` subtree** (0 tracked files). **Never `git add`/`commit` platform files from the enclosing Dev repo.**
- `VUB Financial Readiness Course/` is its own clean repo → `github.com/doclegg05/VUB-Financial-Readiness`. It owns the real build/test/Netlify (`npm run build:site`, Playwright, `netlify.toml`).
- `VUB Intermediate Computer Course/` is its own repo → `github.com/doclegg05/VUB-Course`, with **33 dirty files** including pending deletions (`.gitignore`, `CLAUDE.md`, `index.html`, `syllabus-overview.html`).
- The Intermediate Computer course exists in **3 copies**: (1) deployed canonical `VUB Financial Readiness Course/intermediate-computer-skills/weeks/…`, (2) the `VUB Intermediate Computer Course/weeks/…` repo, (3) a **0-byte dead stub** at `weeks/week-01/presentation.html` (root).
- **Commit attribution is disabled** in the user's global git config — commit messages in this plan carry **no `Co-Authored-By` trailer**.

## File Structure (artifacts this milestone produces)

All artifacts are **new Markdown/CSV files**; no existing content is modified or moved in Milestone 1.

| File | Responsibility |
|---|---|
| `docs/preflight/duplicate-inventory.md` | Every ICS file across the 3 copies, sha256 match/differ, chosen canonical |
| `docs/preflight/freeze-record.md` | Record of the `VUB-Course` freeze (branch/tag, commit sha, file count) |
| `docs/preflight/baseline-state.md` | FR repo HEAD + build/test/netlify inventory; untracked root platform files |
| `docs/migration/manifest.md` | Old→new path for every move/rename/archive/relocate (human-readable) |
| `docs/migration/manifest.csv` | Same, machine-readable, for the M3 executor |
| `docs/preflight/repo-build-strategy.md` | Repo options + recommendation; build/test relocation plan |
| `docs/preflight/acceptance-criteria.md` | "Done & safe" criteria the M3 consolidation must meet |
| `docs/preflight/decision-log.md` | Recorded decisions (repo strategy, answer-key) with timestamps |

> Until the exit gate (Task 8) establishes a platform repo, these artifacts are **uncommitted local files** for review. The enclosing Dev repo ignores them, which is intended.

---

### Task 1: Duplicate & canonical-file inventory

**Files:**
- Create: `docs/preflight/duplicate-inventory.md`

- [ ] **Step 1: Enumerate the two populated ICS copies**

Run (PowerShell):
```powershell
$c1 = "c:\Users\Instructor\Dev\curriculum\VUB Lessons\VUB Financial Readiness Course\intermediate-computer-skills\weeks"
$c2 = "c:\Users\Instructor\Dev\curriculum\VUB Lessons\VUB Intermediate Computer Course\weeks"
Get-ChildItem $c1 -Recurse -File | Measure-Object | Select-Object Count
Get-ChildItem $c2 -Recurse -File | Measure-Object | Select-Object Count
```
Expected: a file count for each copy (copy #1 is the deployed canonical; copy #2 is the standalone repo).

- [ ] **Step 2: Hash-compare the per-week lesson files across both copies**

Run (PowerShell):
```powershell
1..8 | ForEach-Object {
  $w = "week-{0:00}" -f $_
  $f1 = Join-Path $c1 "$w\presentation.html"
  $f2 = Join-Path $c2 "$w\presentation.html"
  $h1 = if (Test-Path $f1) { (Get-FileHash $f1 -Algorithm SHA256).Hash } else { "MISSING" }
  $h2 = if (Test-Path $f2) { (Get-FileHash $f2 -Algorithm SHA256).Hash } else { "MISSING" }
  [PSCustomObject]@{ Week=$w; Match=($h1 -eq $h2); Canonical_c1=$h1.Substring(0,[Math]::Min(12,$h1.Length)); Repo_c2=$h2.Substring(0,[Math]::Min(12,$h2.Length)) }
} | Format-Table -AutoSize
```
Expected: a per-week table showing where copy #1 and copy #2 differ (`Match=False`). Repeat the same comparison for each week's `syllabus.html` and `handouts/` files.

- [ ] **Step 3: Confirm the 0-byte stub**

Run (PowerShell):
```powershell
$stub = "c:\Users\Instructor\Dev\curriculum\VUB Lessons\weeks\week-01\presentation.html"
if (Test-Path $stub) { (Get-Item $stub).Length } else { "absent" }
```
Expected: `0` (the dead stub) — to be archived in M3, never the canonical.

- [ ] **Step 4: Write the inventory artifact**

Create `docs/preflight/duplicate-inventory.md` containing: the file counts, the per-file sha match/differ table, and a **"Canonical decision" column** declaring copy #1 (deployed) as canonical for every file, with any file where copy #2 is newer/different explicitly flagged for human merge review. Include a "Drift summary" line (e.g., "N of 8 weeks differ between copies").

- [ ] **Step 5: Verify no mutation occurred**

Run: `git -C "c:\Users\Instructor\Dev\curriculum\VUB Lessons\VUB Intermediate Computer Course" status --porcelain | Measure-Object -Line`
Expected: still `33` (Task 1 is read-only; the dirty count is unchanged).

---

### Task 2: Freeze the dirty `VUB-Course` repo (non-destructive snapshot)

**Files:**
- Create: `docs/preflight/freeze-record.md`
- Touch (git only, additive branch): `VUB Intermediate Computer Course/` repo

- [ ] **Step 1: Record the pre-freeze state**

Run:
```powershell
$ics = "c:\Users\Instructor\Dev\curriculum\VUB Lessons\VUB Intermediate Computer Course"
git -C $ics rev-parse main
git -C $ics status --porcelain
```
Expected: the current `main` sha and the 33-line dirty list (capture both for the record).

- [ ] **Step 2: Create a freeze branch capturing the exact working tree**

Run:
```powershell
git -C $ics switch -c freeze/preflight-2026-06-03
git -C $ics add -A
git -C $ics commit -m "chore: freeze working tree before platform consolidation (preflight 2026-06-03)"
```
Expected: a single commit on `freeze/preflight-2026-06-03` recording all 33 changes (including the pending deletions). Nothing is lost; `main` is untouched.

- [ ] **Step 3: Tag the snapshot and return to main**

Run:
```powershell
git -C $ics tag preflight-freeze-2026-06-03 freeze/preflight-2026-06-03
git -C $ics switch main
git -C $ics status --porcelain | Measure-Object -Line
```
Expected: after switching back, `main`'s working tree is clean (`0`); the snapshot lives on the freeze branch + tag.

- [ ] **Step 4: Verify `main` HEAD is unchanged**

Run: `git -C $ics rev-parse main`
Expected: **identical** sha to Step 1 — proof the freeze was additive and non-destructive.

- [ ] **Step 5: Record the freeze**

Create `docs/preflight/freeze-record.md`: pre-freeze `main` sha, freeze commit sha, branch/tag names, the 33-file list, and a note that pushing the freeze branch to `origin` for off-machine backup is **optional and requires user approval** (do NOT push in this milestone).

> ⚠️ This step performs the only git write in the milestone, and it is purely additive (new branch + tag). If the user prefers an even lighter touch, substitute `git stash push -u -m "preflight-freeze-2026-06-03"` and record the stash ref instead. Confirm the approach at the Task 8 gate before running, if unsure.

---

### Task 3: Baseline the FR repo, build toolchain, and untracked root files

**Files:**
- Create: `docs/preflight/baseline-state.md`

- [ ] **Step 1: Record the FR repo baseline**

Run:
```powershell
$fr = "c:\Users\Instructor\Dev\curriculum\VUB Lessons\VUB Financial Readiness Course"
git -C $fr rev-parse main
git -C $fr status --porcelain | Measure-Object -Line
git -C $fr remote -v
```
Expected: FR `main` sha, dirty count `0`, remote `VUB-Financial-Readiness`.

- [ ] **Step 2: Inventory the build/test/Netlify toolchain to be relocated**

Run:
```powershell
Get-ChildItem $fr -File | Where-Object Name -in @("netlify.toml","package.json","DEPLOYMENT.md","playwright.config.js")
Get-ChildItem (Join-Path $fr "scripts") -File -ErrorAction SilentlyContinue | Select-Object Name
Get-ChildItem (Join-Path $fr "tests") -File -ErrorAction SilentlyContinue | Select-Object Name
```
Expected: list of the build script(s), netlify config, deployment doc, and Playwright specs — these define what must move to the platform root in M7.

- [ ] **Step 3: Inventory the untracked platform root files**

Run:
```powershell
$root = "c:\Users\Instructor\Dev\curriculum\VUB Lessons"
Get-ChildItem $root -File | Select-Object Name
Get-ChildItem $root -Directory | Where-Object Name -notin @("node_modules","design.md") | Select-Object Name
```
Expected: the root-level platform files (`index.html`, `intake.html`, `syllabus-overview.html`, the 3 logo files, etc.) and folders (`shared`, `classes`, `assessment-service-kit`, `docs`, `weeks` stub, the two course folders) — none currently in any repo.

- [ ] **Step 4: Write the baseline artifact**

Create `docs/preflight/baseline-state.md` capturing all three inventories, with an explicit "build/test relocation list" (FR files → new root location) for M7.

---

### Task 4: Draft the migration manifest

**Files:**
- Create: `docs/migration/manifest.md`
- Create: `docs/migration/manifest.csv`

- [ ] **Step 1: Define the target canonical layout**

From spec §5.2, the target is: `/courses/financial-readiness/`, `/courses/computer-skills/weeks/week-01..08/` (+ `assessments/`, `handouts/`), `/shared/`, `/assets/`, `/instructors/`, `/_archive/`, `/courses.json`.

- [ ] **Step 2: Author the human-readable manifest**

Create `docs/migration/manifest.md` as a table with columns `Action | Old path | New path | Notes`, one row per move/rename/archive, covering at minimum:
  - Canonical ICS tree → `/courses/computer-skills/weeks/…` (from copy #1).
  - Emoji folders → kebab: `📘 Assessments/` → `…/assessments/`, `📘 Study Resources/` → `…/study-resources/`, `📘 Handouts/` → `…/handouts/`, `📘 Teacher Guides/` → `/instructors/teacher-guides/`.
  - `VUB Intermediate Computer Course/` (copy #2) → `/_archive/VUB-Course-2026-06-03/` (**ARCHIVE**, never delete; freeze tag noted).
  - Root `weeks/` 0-byte stub → `/_archive/dead-stub-week-01/` (**ARCHIVE**).
  - FR build/test/netlify files → root (**RELOCATE**, per Task 3 list).
  - `*.local.md` / `CLAUDE.local.md` → **EXCLUDE** from the shared platform (leave in place; not migrated).
  Every retired item uses an **ARCHIVE** action with an explicit `/_archive/` destination.

- [ ] **Step 3: Export the machine-readable CSV**

Create `docs/migration/manifest.csv` with header `action,old_path,new_path,notes` mirroring the table — this is the file the M3 executor drives moves from.

- [ ] **Step 4: Sanity-check the manifest is complete**

Cross-check the manifest against the Task 1 inventory and Task 3 root inventory: every duplicate copy, emoji folder, the stub, and every relocating build file must appear exactly once. Record a one-line "coverage check: N items, all sources accounted for."

---

### Task 5: Repo / build strategy (options + recommendation)

**Files:**
- Create: `docs/preflight/repo-build-strategy.md`

- [ ] **Step 1: Document the three repo options**

Create `docs/preflight/repo-build-strategy.md` presenting:
  - **Option A (recommended):** new unified GitHub repo (e.g., `vublessons`) initialized at the platform root; import the canonical consolidated tree; relocate the build/test/Netlify toolchain to root; **archive** `VUB-Financial-Readiness` and `VUB-Course` as read-only historical repos on GitHub (their history is preserved remotely; the freeze tag from Task 2 captures the ICS dirty state).
  - **Option B:** promote the existing `VUB-Financial-Readiness` repo to the root (move its `.git`) and fold ICS content in — preserves FR history in place but is mechanically messy given the nested layout.
  - **Option C (reject):** keep multiple repos wired via git submodules — preserves all histories but reintroduces multi-source drift, the exact problem we're eliminating.

- [ ] **Step 2: Document the history-preservation decision**

In the same file, recommend **archive-the-old-repos** (simplest, lowest-risk; histories remain on GitHub) over subtree-merging both histories into the new repo, and state the tradeoff plainly (clean new history + manifest provenance vs. a single repo carrying both old histories).

- [ ] **Step 3: Document the build/test relocation**

Specify how `build:site`, `playwright.config.js`, `tests/`, `netlify.toml`, and the pretty-URL redirects move from the FR subrepo to the root, and how the new Netlify project maps to `vublessons.com` (custom domain + TLS at cutover). Note the existing `vubcourse.netlify.app` project can be repurposed or replaced.

- [ ] **Step 4: Mark the decision as gate-pending**

End the file with a "Decision required at Milestone 1 exit gate" line — this is approved by the user in Task 8, not assumed.

---

### Task 6: Acceptance criteria for the consolidation (M3)

**Files:**
- Create: `docs/preflight/acceptance-criteria.md`

- [ ] **Step 1: Write the "done & safe" criteria**

Create `docs/preflight/acceptance-criteria.md` listing the conditions M3 must satisfy before it is considered complete:
  - **Zero content change:** every migrated lesson/quiz file has an identical sha256 before vs. after the move (table required).
  - **No broken links:** an automated link check over the built site reports 0 broken internal links (no references to old emoji-folder paths or copy #2 paths).
  - **Single source:** no file resolves to more than one canonical path; the 0-byte stub no longer exists outside `/_archive/`.
  - **Archive integrity:** `/_archive/` contains the retired copies + the manifest; nothing was hard-deleted.
  - **Tests green:** the relocated Playwright suite passes; new tests cover the shell + consolidated links.
  - **Build parity:** `npm run build:site` produces a `dist/site` that serves every course/lesson/test/handout the old build did (diff the output file list).
  - **Secret scan clean:** a secret-value scan over the staged set finds nothing before any commit.

- [ ] **Step 2: Define the rollback**

Add a short rollback note: because Task 2 froze ICS and M3 archives (never deletes), recovery = restore from `/_archive/` + the freeze tag; document the exact commands.

---

### Task 7: Re-confirm the answer-key exposure decision

**Files:**
- Modify: `docs/preflight/decision-log.md` (create if absent)
- Possibly modify: spec §5.4 / Decision #9 if the choice changes

- [ ] **Step 1: Present the tradeoff to the user**

State plainly: in a **self-serve, copy-a-link library**, the test HTML and the printed PDFs circulate widely. With "show correct answers on both pre & post," every report and test page effectively **publishes the answer key**, which (a) lets students who see a pre-test report memorize answers, inflating the pre→post gain auditors rely on, and (b) leaks the key across cohorts/teachers. Options:
  - **Show on both** (current decision) — simplest; each report doubles as a review sheet.
  - **Post-test only** — hide the key on the pre-test; show it on the post-test.
  - **Per-cohort toggle** — `showCorrectAnswersInReport` configurable per deployed test.

- [ ] **Step 2: Record the decision**

Write the user's choice, the date, and the rationale to `docs/preflight/decision-log.md`. If it differs from "show on both," update spec §5.4 and the Decision table (#9) to match.

---

### Task 8: Assemble decision package, gate, then establish the platform repo

**Files:**
- Create: `docs/preflight/milestone-1-summary.md`
- On approval only: initialize the platform repo; first commit of spec + preflight artifacts

- [ ] **Step 1: Assemble the summary**

Create `docs/preflight/milestone-1-summary.md` linking all artifacts (Tasks 1–7) with a one-paragraph executive summary and an explicit "Approve to proceed to M2/M3?" prompt.

- [ ] **Step 2: Present the gate to the user**

Show the user: the migration manifest, the repo/build strategy recommendation, the acceptance criteria, and the answer-key decision. **Stop and wait for explicit approval.** Do not proceed to any destructive consolidation (M3) without it.

- [ ] **Step 3: On approval — establish the platform repo (per approved strategy)**

For approved **Option A** (adjust if another option chosen):
```powershell
$root = "c:\Users\Instructor\Dev\curriculum\VUB Lessons"
git -C $root init
# (remote add + branch naming per the approved repo-build-strategy.md)
```
Expected: a new, independent repo at the platform root (the enclosing Dev repo ignores this subtree, so there is no nesting conflict).

- [ ] **Step 4: Secret-scan, then commit the spec + preflight artifacts**

Run a secret-value scan over the staged set (abort on any hit), then:
```powershell
git -C $root add docs/
git -C $root commit -m "docs: add VUB platform build-out spec + Milestone 1 preflight package"
```
Expected: the spec and all `docs/preflight` + `docs/migration` artifacts are committed as the platform repo's first docs commit (no attribution trailer, per global config).

- [ ] **Step 5: Confirm and report**

Run: `git -C $root log --oneline -1` and `git -C $root status`
Expected: the first commit exists; working tree clean. Report the commit hash, file count, and repo status. **Milestone 1 complete; M2 (Brand foundation) may be planned next.**

---

## Self-Review

**Spec coverage (against §10 Milestone 1):** ✅ duplicate inventory (T1), freeze dirty ICS repo (T2), migration manifest draft (T4), repo/build strategy (T5), acceptance criteria (T6), answer-key re-confirm (T7), exit gate + repo establishment + spec commit (T8). Baseline/build-relocation inventory (T3) supports the strategy. All six Milestone-1 deliverables map to tasks.

**Placeholder scan:** No "TBD/TODO/handle appropriately" left; each step has concrete commands and expected outputs. The one intentional human-judgment point (canonical merge for any drifted file) is explicitly flagged for review in T1, not hand-waved.

**Type/path consistency:** Artifact paths are consistent across the File Structure table and the tasks (`docs/preflight/*`, `docs/migration/*`). The `$c1/$c2/$ics/$fr/$root` variables are defined where first used. The freeze branch/tag names match between T2 and the manifest reference in T4.

**Non-destructive guarantee:** T1/T3 are read-only; T2 is additive-only (new branch+tag, verified by unchanged `main` sha in T2S4); T4–T7 only create docs; the sole destructive-capable actions (moves/deletes) are deferred to M3 behind the T8 approval gate.

---

## Execution Handoff

Two execution options for this milestone:

1. **Subagent-Driven (recommended)** — a fresh subagent per task with review between tasks. Good fit here because each task produces a discrete reviewable artifact.
2. **Inline Execution** — run the tasks in-session with checkpoints.

**Note:** even under either mode, Task 8 is a **hard human gate** — no consolidation proceeds without explicit approval of the decision package.
