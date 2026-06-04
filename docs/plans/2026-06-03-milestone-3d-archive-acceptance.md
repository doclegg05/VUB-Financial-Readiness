# VUB Platform — Milestone 3 / Phase D: Archive Originals + Final Acceptance — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans. Steps use checkbox (`- [ ]`) syntax. This is the **first and only destructive phase** of M3 — every step is an **archive move (never a delete)** except the explicitly-approved pruning of regenerable build artifacts. Execute **gate-by-gate**; STOP + report (commit hash where applicable, counts, repo status) after each gate.

**Goal:** retire the duplicate course copies + the dead stub + the duplicate root originals into `/_archive/…` (never delete), preserving the freeze tag and full provenance, then satisfy every M3 acceptance criterion and commit.

**Predecessor state (verified 2026-06-04):** Phases A/B/C committed at `c5d2b6a`. `_archive/` exists but is **empty**. Freeze tag `preflight-freeze-2026-06-03 → 42619ff` is resolvable inside Copy #2. `dist/site` is clean (Criterion 2 path-greps = 0; Criterion 5 = 0). Both subrepos + root `VUB Logo.png` are git-ignored by the platform repo.

**Sources (do not re-derive):** [acceptance-criteria.md](../preflight/acceptance-criteria.md) (Criteria 3/4/5/8 are this phase's gates) · [manifest.md](../migration/manifest.md) (2 ARCHIVE rows) · [decision-log.md](../preflight/decision-log.md) (D3 Option A) · master plan [milestone-3-structure-consolidation.md](2026-06-03-milestone-3-structure-consolidation.md) (Phase D outline).

**Decisions locked at the Phase-D gate (2026-06-04, user-approved):**
- **D-1 — FR subrepo local disposition:** ARCHIVE LOCAL, **prune regenerable cruft** (`node_modules/`, `dist/`, `test-results/`) before the move → `/_archive/VUB-Financial-Readiness-2026-06-03/`. Source + `.git` history preserved on disk; GitHub remote `doclegg05/VUB-Financial-Readiness` also retains it. (Read-only GitHub archiving is a separate, deferred outward step — NOT done here.)
- **D-2 — Duplicate root originals:** ARCHIVE FOR PROVENANCE → `/_archive/root-originals-2026-06-03/`. Nothing destroyed.
- **D-3 — Housekeeping:** YES — a **separate additive commit** for the canonical KEEP-files that A/B/C never committed.
- **D-4 — `/_archive/` × git (mechanical default, no separate ask):** `/_archive/` is currently *tracked* by the platform repo. To avoid embedded-repo gitlinks (the archived subrepos each carry their own `.git/`) and duplicate-binary bloat (the 1.88 MB logo, HTML already committed canonically), **git-ignore the archive payload and track only a lightweight `/_archive/README.md` provenance index.** Archived content lives on disk for recovery (Criterion 4 checks disk, not tracking); the tracked originals (`intake.html`, `syllabus-overview.html`) remain recoverable via git history after `git rm`.

---

## Safety invariants for Phase D
- **No `rm` of course content.** The only `rm -rf` permitted targets the three **regenerable** FR dirs in D-1 (node_modules/dist/test-results), which are git-ignored inside the FR subrepo and rebuildable. Everything else is **moved**, never deleted.
- **Copy-before-remove for tracked files:** the two tracked root duplicates are **copied into the archive first**, then `git rm`-ed.
- **Canonical twin verified present** for every retired duplicate (done in preview; re-asserted in D4).
- **Secret scan (paths-only) before every commit;** abort on any hit.
- **STOP + report after every gate.**

---

# GATE D1 — Pre-flight re-verification (READ-ONLY)

- [ ] **Step 1: Re-assert the starting invariants** (no mutation)

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
echo "archive empty: $([ -z "$(ls -A _archive)" ] && echo YES || echo NO)"
echo "stub bytes: $(stat -c %s weeks/week-01/presentation.html)"   # expect 0
echo "freeze tag: $(git -C 'VUB Intermediate Computer Course' rev-list -n1 preflight-freeze-2026-06-03 | cut -c1-7)"  # expect 42619ff
echo "FR head/clean: $(git -C 'VUB Financial Readiness Course' rev-parse --short HEAD) / $(git -C 'VUB Financial Readiness Course' status --porcelain | wc -l)"  # dcd3c56 / 0
grep -rIc "InstructorContract" dist/site 2>/dev/null | grep -v ':0$' && echo "ABORT: contract in build" || echo "Criterion5 OK"
```
Expected: `YES / 0 / 42619ff / dcd3c56 / 0`, Criterion5 OK. **Any deviation ⇒ STOP.**

---

# GATE D2 — Archive Copy #2, the dead stub, and the manifest (provenance)

- [ ] **Step 1: Create archive subdirs + move Copy #2 and the stub**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
mkdir -p _archive/migration "_archive/root-originals-2026-06-03"
mv "VUB Intermediate Computer Course" "_archive/VUB-Course-2026-06-03"
mv weeks "_archive/dead-stub-week-01"            # root weeks/ holds ONLY the 0-byte stub
cp docs/migration/manifest.md docs/migration/manifest.csv _archive/migration/
```

- [ ] **Step 2: Verify the move preserved integrity (Criterion 4)**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
echo "tag in archive: $(git -C '_archive/VUB-Course-2026-06-03' rev-list -n1 preflight-freeze-2026-06-03 | cut -c1-7)"  # 42619ff
echo "archived stub bytes: $(stat -c %s _archive/dead-stub-week-01/week-01/presentation.html)"   # 0
find . -name presentation.html -size 0 -not -path '*/_archive/*' -not -path '*/node_modules/*' | grep . && echo "ABORT: live stub remains" || echo "Criterion3 stub OK"
[ -d "VUB Intermediate Computer Course" ] && echo "ABORT: Copy#2 still live" || echo "Copy#2 retired OK"
```
Expected: `42619ff / 0 / Criterion3 stub OK / Copy#2 retired OK`. **STOP + report.**

---

# GATE D3 — Archive the FR subrepo (pruned)

- [ ] **Step 1: Prune regenerable dirs, then move (D-1)**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
FR="VUB Financial Readiness Course"
# confirm clean BEFORE prune (untracked-only removal keeps history clean):
git -C "$FR" status --porcelain | wc -l                 # expect 0
rm -rf "$FR/node_modules" "$FR/dist" "$FR/test-results" # regenerable, git-ignored inside FR
mv "$FR" "_archive/VUB-Financial-Readiness-2026-06-03"
```

- [ ] **Step 2: Verify FR history intact inside the archive**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
echo "FR head in archive: $(git -C '_archive/VUB-Financial-Readiness-2026-06-03' rev-parse --short HEAD)"  # dcd3c56
echo "FR clean in archive: $(git -C '_archive/VUB-Financial-Readiness-2026-06-03' status --porcelain | wc -l)"  # 0 (prune removed only ignored dirs)
[ -d "VUB Financial Readiness Course" ] && echo "ABORT: FR still live" || echo "FR retired OK"
```
Expected: `dcd3c56 / 0 / FR retired OK`. **STOP + report.**

---

# GATE D4 — Archive the duplicate root originals (D-2)

- [ ] **Step 1: Re-confirm each canonical twin exists (safety) then archive**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
ARCH="_archive/root-originals-2026-06-03"
# safety: canonical twin must exist for every item before we retire the original
for pair in "docs/meeting-notes|Meeting Notes" "instructors/assessment-service-kit|assessment-service-kit" \
            "instructors/classes|classes" "instructors/intake.html|intake.html" \
            "instructors/syllabus-overview.html|syllabus-overview.html" "assets/VUB Logo.png|VUB Logo.png"; do
  canon="${pair%%|*}"; [ -e "$canon" ] || { echo "ABORT: canonical missing for $pair"; exit 1; }
done
# untracked dirs + git-ignored binary -> move
mv "Meeting Notes" "$ARCH/Meeting Notes"
mv assessment-service-kit "$ARCH/assessment-service-kit"
mv classes "$ARCH/classes"
mv "VUB Logo.png" "$ARCH/VUB Logo.png"
# tracked files -> copy into archive FIRST, then git rm
cp intake.html "$ARCH/intake.html"
cp syllabus-overview.html "$ARCH/syllabus-overview.html"
git rm -q intake.html syllabus-overview.html
echo "root originals archived; canonical twins intact"
```

- [ ] **Step 2: Verify single-source (Criterion 3)**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
for f in "Meeting Notes" assessment-service-kit classes intake.html syllabus-overview.html "VUB Logo.png"; do
  [ -e "$f" ] && echo "ABORT: $f still live at root"
done
# duplicate-content hash query over LIVE (non-archive) tree must be empty:
find dist/site courses -type f \( -name '*.html' -o -name '*.pdf' \) -print0 \
  | while IFS= read -r -d '' f; do printf '%s  %s\n' "$(tr -d '\r' < "$f" | sha256sum | cut -d' ' -f1)" "$f"; done \
  | sort | awk '{print $1}' | uniq -d | head
echo "Criterion3 dup-hash query above should be EMPTY"
```
Expected: no "still live" lines; empty dup-hash output. **STOP + report.**

---

# GATE D5 — gitignore + provenance, acceptance gates, archive commit

- [ ] **Step 1: Append `/_archive/` ignore rules (D-4) + author the provenance index**

Append to `.gitignore`:
```
# --- M3-D archive (retired copies live on disk for provenance; payload not tracked) ---
/_archive/*
!/_archive/README.md
```
Author `_archive/README.md` documenting: what each archived dir is, its source path, the freeze tag (`preflight-freeze-2026-06-03` → `42619ff`) and how to recover (restore-from-archive + `git checkout` tag, per acceptance-criteria Rollback).

- [ ] **Step 2: Acceptance gates 4/5, then secret scan (Criterion 8) on the staged set**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
# Criterion 4: archive members present + tag resolves
git -C "_archive/VUB-Course-2026-06-03" tag --list preflight-freeze-2026-06-03
find _archive -name presentation.html -size 0 | head -1
ls _archive/migration/manifest.*
# Criterion 5: privacy
grep -rIl "InstructorContract" dist/site 2>/dev/null && echo "ABORT" || echo "Criterion5 OK"
# Stage the archive commit (gitignore change, README, the two git rm's already staged):
git add .gitignore _archive/README.md
git status --porcelain
# Criterion 8: paths-only secret scan over the staged set (real-key shapes); abort on hit
git diff --cached -U0 | grep -nE '(AKIA[0-9A-Z]{16}|gh[oprsu]_[0-9A-Za-z]{36}|-----BEGIN [A-Z ]*PRIVATE KEY-----|AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{32,})' && echo "ABORT: secret" || echo "secret scan CLEAN"
git diff --cached --name-only | grep -iE 'InstructorContract' && echo "ABORT: contract staged" || echo "no contract staged"
```
Expected: tag prints; one 0-byte stub; manifest present; Criterion5 OK; clean scan; no contract staged. **Any ABORT ⇒ STOP, do not commit.**

- [ ] **Step 3: Commit the archive phase**

```bash
git commit -m "chore(M3d): archive retired copies (Copy#2 + FR subrepo + stub + root dupes); consolidation acceptance verified"
git log --oneline -1
```
Report committed file count + hash. **STOP + report.**

---

# GATE D6 — Housekeeping: commit canonical KEEP-files (D-3)

- [ ] **Step 1: Stage the canonical keep-files A/B/C left untracked, scan, commit**

```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"; cd "$ROOT"
git add AGENTS.md CLAUDE.md \
        shared/glossary.css shared/glossary.js shared/print.css shared/progress.js \
        package-lock.json \
        docs/plans/2026-06-03-milestone-2-brand-foundation.md \
        docs/plans/2026-06-03-milestone-3-structure-consolidation.md \
        docs/plans/2026-06-03-milestone-3d-archive-acceptance.md
git diff --cached -U0 | grep -nE '(AKIA[0-9A-Z]{16}|gh[oprsu]_[0-9A-Za-z]{36}|-----BEGIN [A-Z ]*PRIVATE KEY-----|AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{32,})' && echo "ABORT: secret" || echo "secret scan CLEAN"
git commit -m "chore(M3d): commit canonical keep-files (governance, shared assets, lockfile, plan docs)"
git log --oneline -3
```
Report. **STOP + report.**

---

# GATE D7 — Final M3 acceptance summary

- [ ] **Step 1: Roll up the full acceptance contract** and report PASS/FAIL per criterion:
  - C2 (paths): 0 emoji / 0 Copy#2-path refs in `dist/site` (re-grep).
  - C3 (single source): dup-hash query empty; 0-byte stub only under `/_archive/`.
  - C4 (archive integrity): all three members present; freeze tag resolves inside archive.
  - C5 (privacy): 0 `InstructorContract` in `dist/site`.
  - C8 (secret scan): clean on both commits.
  - (C1/C6/C7 were verified in A/C; re-assert `npm run build:site` exit 0 + `npx playwright test` green as a final smoke if cheap.)
- [ ] **Step 2:** Update `MEMORY/state.json` + MemPalace `vub-lessons-buildout`; mark M3 complete. Note next milestone **M4 (shared shell + dashboard/catalog)**.

> **End of Phase D / Milestone 3.** Everything retired is recoverable from `/_archive/` (on disk) + the freeze tag + git history. No course content was deleted.

---

## Self-Review
- **Coverage:** the 2 manifest ARCHIVE rows (Copy #2, stub) + the gated FR-subrepo + the 6 duplicate root originals + provenance manifest are each handled exactly once. EXCLUDE rows (contracts, dotfolders, build artifacts) are untouched.
- **Destructiveness:** only `rm -rf` of 3 regenerable FR dirs (explicitly approved D-1); all course content is moved, never deleted; tracked dupes copied-then-`git rm` (recoverable via history + archive).
- **Gates:** Criteria 3/4/5/8 each have an explicit check; every commit is secret-scanned; STOP+report after each gate.
- **Reversibility:** archive-on-disk + freeze tag + git history give three independent recovery paths.
