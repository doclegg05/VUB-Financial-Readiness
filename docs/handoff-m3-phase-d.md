# HANDOFF — VUB Lessons · Milestone 3 · Phase D (Archive + Final Acceptance)

> **Authored:** 2026-06-04 · **From:** claude-code (prior session) · **For:** next agent picking up Phase D.
> **One-line resume:** Everything is verified, decided, and written. **Wait for the user to say "go" (or "go D2"), then execute the gate-by-gate plan, ONE gate at a time, reporting after each. Nothing has been moved/deleted/staged yet.**

---

## 0. Read these first (do not re-derive)
- **The contract you execute:** [docs/plans/2026-06-03-milestone-3d-archive-acceptance.md](plans/2026-06-03-milestone-3d-archive-acceptance.md) — exact bash, gates D1→D7.
- **Master plan (Phase D outline):** [docs/plans/2026-06-03-milestone-3-structure-consolidation.md](plans/2026-06-03-milestone-3-structure-consolidation.md)
- **Gate contract (your pass/fail):** [docs/preflight/acceptance-criteria.md](preflight/acceptance-criteria.md) — **Criteria 3/4/5/8 are Phase D's gates**; Criterion 0 = always compare content with line endings normalized (`tr -d '\r' | sha256sum`).
- **Manifest (2 ARCHIVE rows):** [docs/migration/manifest.md](migration/manifest.md)
- **Decisions:** [docs/preflight/decision-log.md](preflight/decision-log.md) (D3 = Option A)
- **Prior session diary:** MemPalace `mempalace_diary_write` id `diary_wing_claude-code_20260604_103202_88e37560`, topic `vub-lessons-buildout`.
- **Operating rules that govern this work:** read-only/dry-run FIRST; **archive, never delete**; secret-scan (paths-only) before EVERY commit; gate-by-gate (preview→approve→execute→verify→commit→report); STOP+report after each gate; surface discrepancies, never silent-cap.

---

## 1. Verified current state (as of 2026-06-04, read-only confirmed)
- **Platform repo** (`.git` at root) HEAD = **`c5d2b6a`** (Phase C committed). Branch `main`.
- **`/_archive/` exists but is EMPTY** → Phase D has **not** run.
- **Copy #2** subrepo `VUB Intermediate Computer Course/` present; freeze tag **`preflight-freeze-2026-06-03` → `42619ff`** resolvable (branch `freeze/preflight-2026-06-03`). Working HEAD is `2870359` (=main) by design; the tag/branch hold the frozen `42619ff`. → Criterion 4 pre-OK.
- **FR subrepo** `VUB Financial Readiness Course/` clean at **`dcd3c56`**, GitHub remote `doclegg05/VUB-Financial-Readiness`.
- **Dead stub (Copy #3):** root `weeks/week-01/presentation.html` = **0 bytes** confirmed (only file under root `weeks/`).
- Both subrepos + root `VUB Logo.png` are **git-ignored** by the platform repo (`.gitignore` comment: *"Legacy course subrepos (archived in M3-D)"*).
- **Duplicate root originals — canonical twins all VERIFIED present (file counts match):**
  | root original | tracking | canonical twin |
  |---|---|---|
  | `Meeting Notes/` (12) | untracked | `docs/meeting-notes/` (12) |
  | `assessment-service-kit/` (8) | untracked | `instructors/assessment-service-kit/` (8) |
  | `classes/` (3) | untracked | `instructors/classes/` (3) |
  | `intake.html` | **tracked** | `instructors/intake.html` (re-pointed in Phase B) |
  | `syllabus-overview.html` | **tracked** | `instructors/syllabus-overview.html` |
  | `VUB Logo.png` | git-ignored | `assets/VUB Logo.png` |
- **Acceptance pre-checks already green:** C2 (paths) = **0** emoji refs + **0** `VUB Intermediate Computer Course/` refs in `dist/site`; C5 (privacy) = **0** `InstructorContract` in `dist/site`. C3 flips to pass once the live stub leaves root.

---

## 2. Locked decisions (user-approved 2026-06-04 — DO NOT re-ask)
- **D-1 FR subrepo:** archive **local, pruned** — `rm -rf` the regenerable `node_modules/ dist/ test-results/` first, then `mv` → `/_archive/VUB-Financial-Readiness-2026-06-03/`. (`.git` history + GitHub remote both preserve it. Read-only GitHub archiving is a SEPARATE deferred outward step — NOT done in Phase D.)
- **D-2 root duplicates:** archive **for provenance** → `/_archive/root-originals-2026-06-03/`.
- **D-3 housekeeping:** **YES** — a separate additive commit for canonical KEEP-files A/B/C never committed (`AGENTS.md`, `CLAUDE.md`, `shared/{glossary.css,glossary.js,print.css,progress.js}`, `package-lock.json`, the M2/M3/M3d plan docs).
- **D-4 `/_archive/` × git (mechanical default — VETOABLE by user):** git-ignore the archive payload, track only a lightweight `_archive/README.md` provenance index (`/_archive/*` + `!/_archive/README.md`). Rationale: avoid embedded-repo gitlinks (archived subrepos carry their own `.git/`) and 1.88 MB duplicate-logo bloat. Recovery = on-disk archive + freeze tag + git history. *If the user prefers to TRACK the full archive in-repo, adjust before Gate D5.*

---

## 3. Execution sequence (from the contract — run ONE gate, then STOP + report)
| Gate | What | Type | Key verify |
|---|---|---|---|
| **D1** | Re-assert invariants | read-only | `_archive` empty, stub=0B, tag→42619ff, FR dcd3c56/clean, C5=0 |
| **D2** | `mv` Copy #2 → `_archive/VUB-Course-2026-06-03/`; `mv weeks` → `_archive/dead-stub-week-01/`; `cp` manifest.md/csv → `_archive/migration/` | move | tag resolves in archive; no live stub; Copy#2 retired (C3/C4) |
| **D3** | prune FR regenerable dirs; `mv` FR → `_archive/VUB-Financial-Readiness-2026-06-03/` | move+prune | FR head dcd3c56 in archive; no live FR |
| **D4** | archive 6 root dupes → `_archive/root-originals-2026-06-03/` (untracked `mv`; tracked `cp`-then-`git rm intake.html syllabus-overview.html`) | move | canonical twins intact; dup-hash query empty (C3) |
| **D5** | append `.gitignore` archive rules + author `_archive/README.md`; run C4/C5/C8; **commit** `chore(M3d): archive retired copies…` | commit | secret scan clean; no contract staged |
| **D6** | stage canonical keep-files; secret-scan; **commit** `chore(M3d): commit canonical keep-files…` | commit | — |
| **D7** | acceptance roll-up (C2/C3/C4/C5/C8; re-smoke build+playwright if cheap); update `MEMORY/state.json` + MemPalace; mark M3 done | verify | all criteria PASS |

**Tooling note:** the bash in the contract uses git-bash style (`/c/Users/...`). This is Windows — the Bash tool runs git-bash; the platform `.gitignore` & subrepo paths assume it.

---

## 4. ABORT / STOP conditions (any one ⇒ halt, do not commit, report paths-only)
secret-value hit · file-count divergence vs the verified twins above · a canonical twin missing before retiring its original · `InstructorContract*` staged or appearing in `dist/site` · an embedded-repo/binary unexpectedly staged · any gate verify mismatch.

## 5. Known trap (cost a false alarm last session)
A predictive check `grep … | head -N && echo "FAIL"` **always fires FAIL** because `head` exits 0 on empty input. Use `grep -rIc … | grep -v ':0$'` (or check grep's own exit code) — never gate on a piped `head`. This is why C2 looked broken and was actually clean. Re-check any validation FAILure for script-scope bugs before reporting it as real.

## 6. After M3
M4 = shared shell + familiar dashboard/catalog → then assessment-PDF polish + certificate. Progress tracked in MemPalace `vub-lessons-buildout`.

---
*This handoff is a pointer + state snapshot. The authoritative step-by-step lives in the linked Phase-D plan. No course file is moved, renamed, or deleted by this document.*
