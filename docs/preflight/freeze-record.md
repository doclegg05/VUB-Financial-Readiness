# Preflight Freeze Record — Spring 2026 Beckley Cohort

**Date:** 2026-06-03
**Repo (ICS):** `C:\Users\Instructor\Dev\curriculum\VUB Lessons\VUB Intermediate Computer Course`
**Operation:** Non-destructive freeze of the divergent "Spring 2026 Beckley cohort" working tree before later platform consolidation.

## SHAs

| Item | SHA |
|:-----|:----|
| PRE `main` HEAD | `2870359f9d766560070bb88e4f8be1bb660a1e44` |
| POST `main` HEAD | `2870359f9d766560070bb88e4f8be1bb660a1e44` |
| **Match (main unchanged)** | **YES** |
| Freeze commit | `42619ff5c0735422649da917f001f1cb6481c2fa` |

- **Branch:** `freeze/preflight-2026-06-03`
- **Tag:** `preflight-freeze-2026-06-03`

## Staged name-status (29 files)

```
D	.gitignore
D	CLAUDE.md
D	index.html
D	syllabus-overview.html
M	weeks/week-01/presentation.html
M	weeks/week-01/syllabus.html
A	weeks/week-02/handouts/keyboard-shortcuts-reference.html
A	weeks/week-02/handouts/windows-workshop.html
M	weeks/week-02/presentation.html
M	weeks/week-02/syllabus.html
A	weeks/week-03/handouts/gmail-workshop.html
M	weeks/week-03/presentation.html
M	weeks/week-03/syllabus.html
A	weeks/week-04/handouts/word-workshop.html
M	weeks/week-04/presentation.html
M	weeks/week-04/syllabus.html
A	weeks/week-05/handouts/excel-workshop.html
M	weeks/week-05/presentation.html
M	weeks/week-05/syllabus.html
A	weeks/week-06/handouts/cloud-workshop.html
M	weeks/week-06/presentation.html
M	weeks/week-06/syllabus.html
M	weeks/week-07/handouts/ai-quick-start.html
A	weeks/week-07/handouts/ai-workshop.html
M	weeks/week-07/presentation.html
M	weeks/week-07/syllabus.html
A	weeks/week-08/handouts/review-workshop.html
M	weeks/week-08/presentation.html
M	weeks/week-08/syllabus.html
```

Breakdown: 4 deletions (D), 17 modifications (M), 8 additions (A) = 29 files.

## Intentionally EXCLUDED (junk, never staged)

The following were deliberately NOT committed and remain untouched on disk:

- `node_modules/`
- `.claude/`
- `Remotion/`
- `reference-design/`

JUNK GUARD result during Phase A: **guard clean** (no excluded paths appeared in the staged set).
After returning to `main`, the only working-tree entries are the untracked, intentionally-excluded
`Remotion/` and `reference-design/` directories (`node_modules/` and `.claude/` are covered by ignore rules).
Main's tracked tree is clean; nothing was deleted from disk.

## Recovery

To recover this frozen cohort version:

```
git -C "C:\Users\Instructor\Dev\curriculum\VUB Lessons\VUB Intermediate Computer Course" switch freeze/preflight-2026-06-03
```

(Or check out the tag: `git -C "<ICS>" checkout preflight-freeze-2026-06-03`.)

## Push status

**Nothing was pushed to origin.** The freeze branch and tag exist only in the local repo.
Pushing is gated separately and was not performed.
