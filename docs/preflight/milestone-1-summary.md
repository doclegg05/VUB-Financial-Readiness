# Milestone 1 — Preflight & Freeze — Summary & Decision Gate

- **Date:** 2026-06-03
- **Status:** All preflight work complete (non-destructive). **Decisions D1–D4 recorded** (see `decision-log.md`); platform repo established locally and preflight package committed. Milestone 1 **closed**. Outward steps (GitHub repo creation/push, old-repo archival, Netlify/DNS cutover) deferred to a separate confirmed step.

## What Milestone 1 did (all read-only / additive — no course file moved or edited)
| Task | Result | Artifact |
|---|---|---|
| T1 Duplicate inventory | The "massive drift" was a CRLF/LF + cohort-date illusion; **Copy #1 (deployed, generic) is canonical** | `duplicate-inventory.md` |
| T2 Freeze `VUB-Course` | Divergent Spring-2026 cohort work snapshotted on branch+tag `preflight-freeze-2026-06-03` (`42619ff`); `main` unchanged (`2870359`); junk excluded | `freeze-record.md` |
| T3 Baseline FR repo | FR `dcd3c56` clean; build/test/Netlify toolchain inventoried for relocation | `baseline-state.md` |
| T4 Migration manifest | Draft old→new map for every item (99 rows); archive-not-delete | `../migration/manifest.md` + `.csv` |
| T5 Repo/build strategy | **Option A recommended** (new `vublessons` repo at root) | `repo-build-strategy.md` |
| T6 Acceptance criteria | "Done & safe" contract for M3, incl. CRLF-normalized zero-change check | `acceptance-criteria.md` |

## Key verified findings
1. **Drift was illusory.** Copy #1 vs Copy #2 differ ~99.7% by line endings; the real differences are 22 files with intentional **cohort-date** edits + 1 genuine non-date diff (week-03 Gmail `before:` example). 23 files (incl. all 4 tests) are content-identical.
2. **Copy #1 (generic, deployed) is canonical**; Copy #2 = archived "Spring 2026 Beckley instance" (frozen).
3. **The deployed site is stale.** `root/index.html` (47 KB, polished) is newer/more complete than the deployed `FR/index.html` (20 KB). Redeploying from root will **upgrade** the live site.
4. **Privacy flag:** `📘 Admin Paperwork/` holds instructor **employment contracts** (`InstructorContract_6weeks.docx/.pdf`) — must NOT be published.

## Decisions required at this gate
- **D1 — Answer key on reports:** show correct answers on both pre & post, post-only, or per-cohort toggle. (Prior lean: both; re-confirming due to cross-cohort answer-key exposure in a self-serve library.)
- **D2 — Instructor contracts:** exclude the contracts from the platform (recommended), or include.
- **D3 — Repo plan (Option A):** new `vublessons` repo at root + root copies canonical + relocate toolchain + archive the two old repos (history preserved on GitHub). Approve / choose B / discuss.
- **D4 — Netlify + domain:** repurpose `vubcourse.netlify.app` → vublessons.com, or new project; cutover timing.
- **Orchestrator defaults (object if wrong):** keep per-week `assessments/`+`handouts/` inside `weeks/` (don't hoist); `assessment-service-kit/` → `/instructors/`; `📘 Admin Paperwork/student-upload-instructions.html` → `/instructors/`.

## On approval (Task 8 execution)
1. Finalize manifest + strategy per the decisions.
2. **Local** `git init` at the platform root, secret-scan, and commit the spec + all preflight/migration docs as the first commit. (Creating/pushing the GitHub `vublessons` repo is a **separate, explicitly-confirmed** outward step.)
3. Milestone 1 closes; M2 (Brand foundation) becomes plannable.
