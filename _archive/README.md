# `/_archive/` — Provenance Index (M3 · Phase D)

**Authored:** 2026-06-04 · **Phase:** Milestone 3 / Phase D (Archive + Final Acceptance).

This directory holds the **retired** duplicate course copies, the dead stub, the duplicate
root originals, and the migration manifest. **Nothing here was hard-deleted** — every item is
an *archive move* (never a delete), and each is recoverable three independent ways:
**(1)** this on-disk archive, **(2)** the freeze tag `preflight-freeze-2026-06-03` (commit
`42619ff`), and **(3)** git history.

> **Git tracking (decision D-4):** the archive **payload is git-ignored** (`.gitignore`:
> `/_archive/*` + `!/_archive/README.md`). Only this README is tracked. Rationale: the archived
> subrepos each carry their own `.git/` (embedded-repo gitlinks), plus a 1.88 MB duplicate logo
> and HTML already committed canonically — none of which belongs in the platform repo.

---

## Members

| Dir | What it is | Original source path | Git anchors / notes |
|:----|:-----------|:---------------------|:--------------------|
| `VUB-Course-2026-06-03/` | **Copy #2** — Spring-2026 Beckley ICS cohort instance (dated variant; NOT canonical) | `VUB Intermediate Computer Course/` | Repo intact: HEAD `2870359` (`main`); branch `freeze/preflight-2026-06-03`; **tag `preflight-freeze-2026-06-03` → `42619ff`**; `fsck` clean. Differs from canonical only by baked cohort dates + 1 pedagogical line. |
| `VUB-Financial-Readiness-2026-06-03/` | **FR deploy subrepo** (former Netlify build repo) | `VUB Financial Readiness Course/` | Repo intact: HEAD `dcd3c56` (`main`); remote `https://github.com/doclegg05/VUB-Financial-Readiness.git`. **Pruned before archiving** of regenerable, git-ignored dirs: `node_modules/` (21 MB), `dist/` (4.4 GB), `test-results/` (125 KB). |
| `dead-stub-week-01/` | **Copy #3** — dead **0-byte** stub (never canonical) | root `weeks/week-01/presentation.html` (+ empty `weeks/` parent) | `week-01/presentation.html` = 0 bytes. |
| `root-originals-2026-06-03/` | Duplicate **root originals**, retired for provenance | (see per-item table below) | Canonical twins all verified present before retirement. |
| `migration/` | Consolidation **manifest** (provenance of the M3 plan) | `docs/migration/manifest.{md,csv}` | Copies kept alongside the archive per spec §5.2. |

### `root-originals-2026-06-03/` — item → canonical twin

| Archived original | Canonical (live) twin | Note |
|:------------------|:----------------------|:-----|
| `Meeting Notes/` | `docs/meeting-notes/` | untracked dir, moved |
| `assessment-service-kit/` | `instructors/assessment-service-kit/` | untracked dir, moved |
| `classes/` | `instructors/classes/` | untracked dir, moved |
| `VUB Logo.png` | `assets/VUB Logo.png` | git-ignored binary, moved |
| `intake.html` | `instructors/intake.html` | was tracked → copied here, then `git rm`. Root original differs from canonical (Phase B re-pointed the canonical's internal links). |
| `syllabus-overview.html` | `instructors/syllabus-overview.html` | was tracked → copied here, then `git rm`. Same link-repoint note. |

---

## Recovery

```bash
ROOT="C:/Users/Instructor/Dev/curriculum/VUB Lessons"

# Copy #2 (frozen Spring-2026 Beckley cohort) — restore the tagged commit:
git -C "$ROOT/_archive/VUB-Course-2026-06-03" switch freeze/preflight-2026-06-03
#   or detached at the exact freeze: ... checkout preflight-freeze-2026-06-03   # -> 42619ff

# Any retired tree — copy back from the archive (nothing was hard-deleted):
cp -a "$ROOT/_archive/VUB-Course-2026-06-03/."           "<restore-target>/"
cp -a "$ROOT/_archive/VUB-Financial-Readiness-2026-06-03/." "<restore-target>/"
cp -a "$ROOT/_archive/root-originals-2026-06-03/<item>"  "<restore-target>/"

# FR regenerable dirs (pruned) rebuild from source:
( cd "<restored-FR>" && npm install && npm run build:site )

# The two tracked root dupes are also recoverable from git history:
git -C "$ROOT" show <commit-before-M3d>:intake.html > intake.html
```

No recovery path requires un-deleting anything — the source is always retrievable from the
archive copy, the freeze tag, or git history.
