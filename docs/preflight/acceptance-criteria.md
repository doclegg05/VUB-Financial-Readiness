# Acceptance Criteria — M3 Course Consolidation

> **What this is:** the gate contract that the **M3 consolidation** (folding the duplicate
> course copies into one canonical `/courses/...` tree and rebuilding `dist/site`) is graded
> against. M3 is **NOT done & safe** until every criterion below passes with the exact check shown.
> **Status:** contract — to be satisfied by M3, verified at the M3 exit gate.
> **Date authored:** 2026-06-03 · **Author:** preflight subagent (Milestone 1, Task 2).
>
> This document performs **no mutations**. It only defines verifiable checks.

---

## Scope & the copies in play (from Milestone 1 preflight)

| Copy | Role | Path |
|:-----|:-----|:-----|
| **Copy #1** | GENERIC reusable template — deployed; canonical course body | `...\VUB Lessons\VUB Financial Readiness Course\intermediate-computer-skills\weeks` |
| **Copy #2** | Spring-2026 Beckley cohort DATED variant — to be **archived**, frozen at tag `preflight-freeze-2026-06-03` (commit `42619ff`) | `...\VUB Lessons\VUB Intermediate Computer Course\weeks` |
| **Copy #3** | Dead **0-byte** stub — to be **archived**, never canonical | `...\VUB Lessons\weeks\week-01\presentation.html` |
| **ROOT** | CANONICAL platform copies (newer `index.html` 47,038 B + 4-file `shared/`) | `...\VUB Lessons\` (`index.html`, `shared/`, `weeks/`, `classes/`) |

> **Canonical rule:** the **newer ROOT copies** are the base; for the ICS course body the
> **generic, date-free Copy #1** is canonical (NOT Copy #2's hardcoded-cohort-date variant).

---

## CRITERION 0 (READ FIRST) — Content comparison MUST normalize line endings

**This is the load-bearing lesson from Task 1 and it governs Criterion 1.** A raw
`sha256sum` / raw `diff` over these copies reported **44 of 46 files "different" / "massive
drift."** That was a **measurement artifact**: the copies use different line endings
(**CRLF vs LF**), so every line registers as "changed" at the byte level. Once line endings
are normalized, most files are byte-identical and the rest differ by a handful of real lines.

**Rule:** **NEVER assert "content changed" from a raw byte hash alone.** Every content-identity
check in this contract compares content with **line endings normalized**, using one of:

```bash
# Per-file content identity, line endings normalized (canonical recipe):
tr -d '\r' < "$OLD" | sha256sum
tr -d '\r' < "$NEW" | sha256sum
# CONTENT-IDENTICAL  ⇔  the two hashes match.

# True changed-line count (ignore CR), used to explain any non-match:
diff --strip-trailing-cr "$OLD" "$NEW" | grep -c '^[<>]'
```

Equivalently, a `git diff --stat` run under a CRLF-aware setup (`.gitattributes`
`* text=auto` or `core.autocrlf=true`) is acceptable, **provided** line-ending differences
do not register as changes. A raw-byte hash mismatch is **expected and acceptable** when the
move normalizes line endings — what must hold is **CONTENT** identity (the `tr -d '\r' | sha256sum`
hashes match), not raw-byte identity.

---

## CRITERION 1 — Zero content change

**Statement:** every migrated lesson / quiz / handout file is **content-identical** before vs
after the move, compared with **line endings normalized**.

**Check (run for every migrated file):**

```bash
# OLD = pre-move source path; NEW = post-move canonical path
old_hash=$(tr -d '\r' < "$OLD" | sha256sum | cut -d' ' -f1)
new_hash=$(tr -d '\r' < "$NEW" | sha256sum | cut -d' ' -f1)
[ "$old_hash" = "$new_hash" ] && echo "OK $NEW" || echo "CONTENT-DIFF $NEW"
```

**Pass condition:** **0** files report `CONTENT-DIFF`. For every migrated file the
normalized-content hash matches old vs new.

**Required artifact — before/after table.** M3 must produce a table with one row per migrated file:

| file (new canonical path) | old path | old_norm_sha256 (`tr -d '\r' | sha256sum`) | new_norm_sha256 | content_identical? |
|:--------------------------|:---------|:-------------------------------------------|:----------------|:------------------:|

**Notes baked in (do not re-litigate):**
- **Raw sha WILL differ if line endings are normalized during the move — that is ACCEPTABLE.**
  Only the **normalized-content** hashes (`tr -d '\r' | sha256sum`) must match.
- The 22 known cohort-date-only deltas live in **Copy #2** and are **intentionally NOT merged**
  into canonical (merging would re-bake a one-time schedule into the reusable template). Because
  canonical = Copy #1, those files are migrated **from Copy #1** and will be content-identical to
  Copy #1; Copy #2's dated versions are archived, not migrated.
- The single genuine non-date difference (`week-03/presentation.html` Gmail example, line ~956)
  is a **human decision**, not an automated pass/fail; whichever version is chosen, the migrated
  file must equal its chosen source under the normalized hash.

---

## CRITERION 2 — No broken links

**Statement:** an automated internal-link check over the built `dist/site` reports **0 broken links**.

**Check:**

```bash
npm run build:site
# Crawl the built output for broken internal links (any link-checker that walks dist/site):
npx linkinator "dist/site" --recurse --silent   # or equivalent internal-link crawler
```

**Pass condition:** **0** broken internal links. **Additionally**, grep the built output for
**zero surviving references** to retired paths:

```bash
# No surviving emoji-folder references (📘 …):
grep -rl $'\xf0\x9f\x93\x98' dist/site && echo "FAIL: emoji-folder ref" || echo "OK: no emoji refs"
# No surviving references to the copy #2 path:
grep -rl "VUB Intermediate Computer Course/" dist/site && echo "FAIL: copy#2 ref" || echo "OK"
```

**Pass condition (paths):** **0 hits** for `📘 …` paths and **0 hits** for
`VUB Intermediate Computer Course/`. (Per the relocation plan, the kebab-case renames make the
Netlify emoji-rewrites dead config — there must be nothing left pointing at the emoji folders.)

---

## CRITERION 3 — Single source

**Statement:** no file resolves to more than one canonical path; duplicates are collapsed.

**Checks:**
- **One canonical path per file.** Build a list of canonical content files; assert no logical
  lesson/quiz/handout maps to two live locations.

  ```bash
  # Normalized-content hash → list of paths. Any hash mapping to >1 LIVE (non-archive) path is a duplicate.
  find dist/site courses -type f \( -name '*.html' -o -name '*.pdf' \) -print0 \
    | while IFS= read -r -d '' f; do
        printf '%s  %s\n' "$(tr -d '\r' < "$f" | sha256sum | cut -d' ' -f1)" "$f"
      done | sort | awk '{print $1}' | uniq -d
  # Expected: empty (no duplicate canonical content outside /_archive/).
  ```

- **The 0-byte stub (Copy #3) exists ONLY under `/_archive/`.**

  ```bash
  find . -name presentation.html -size 0 -not -path '*/_archive/*' \
    && echo "FAIL: live 0-byte stub" || echo "OK: stub only in _archive"
  ```

- **Copy-#1-vs-Copy-#2 (ROOT-vs-FR) duplication collapsed to the canonical newer ROOT versions.**
  Verify the published ICS body comes from Copy #1 (generic, date-free), and Copy #2's dated tree
  does not appear as a second live copy.

**Pass condition:** the duplicate-hash query is **empty** (no content resolves to >1 live path),
the 0-byte stub appears **only** under `/_archive/`, and the FR/cohort duplicates are collapsed to
the canonical ROOT/Copy-#1 versions.

---

## CRITERION 4 — Archive integrity

**Statement:** `/_archive/` retains the retired copies and provenance; **nothing was hard-deleted**.

**Checks — `/_archive/` must contain all of:**
1. **Retired Copy #2** (the Spring-2026 Beckley cohort tree), with its git tag **intact**:

   ```bash
   git -C "/_archive/VUB Intermediate Computer Course" tag --list "preflight-freeze-2026-06-03"
   # Expected: prints  preflight-freeze-2026-06-03   (tag present; commit 42619ff)
   ```

2. **The dead 0-byte stub** (Copy #3), preserved (not deleted):

   ```bash
   find "/_archive" -name presentation.html -size 0 | head -1   # expected: one match
   ```

3. **A copy of the migration manifest** (provenance) — e.g. `/_archive/manifest.csv` (or `.md`).

**No hard-delete proof:** every retired item is recoverable from `/_archive/` and/or the freeze
tag. No `git rm`/filesystem delete removed source content (`git log --diff-filter=D` for the
consolidation commits should show only archive *moves*, never destructive removals of course content).

**Pass condition:** all three archive members present, the freeze tag resolves, and there is **no
evidence of hard deletion** of any course content.

---

## CRITERION 5 — Privacy hold (instructor employment contracts)

**Statement:** the instructor **employment contracts** in `📘 Admin Paperwork/`
(`InstructorContract_6weeks.docx` / `InstructorContract_6weeks.pdf`) are **excluded, not migrated**,
and appear **nowhere** in the published `dist/site`.

> Context: the migration manifest currently maps `📘 Admin Paperwork/` → `/instructors/admin-paperwork/`
> and **flags it UNSURE**. These are employment contracts — they must be kept out of the public build.

**Check:**

```bash
# Expect ZERO hits anywhere in the built site:
grep -rl "InstructorContract" dist/site && echo "FAIL: contract in build" || echo "OK: no contract"
find dist/site -iname 'InstructorContract*' | head   # expected: no output
```

**Pass condition:** **0 hits** for `InstructorContract*.docx` and `InstructorContract*.pdf`
(by filename and by reference) anywhere under `dist/site`. The contracts were excluded from the
published output (they may live in a private/instructor-only or archived location, but never in the
public build).

---

## CRITERION 6 — Tests green

**Statement:** the relocated Playwright suite passes, and new tests cover the consolidated shell + links.

**Check:**

```bash
npx playwright test          # from the new repo root
```

**Pass condition:** **all** Playwright tests pass (exit 0). New tests exist that cover:
- the **shared shell** (consolidated `shared/` — glossary, print, progress assets render on both courses), and
- the **consolidated links** (the `/courses/...` routes and cross-course navigation resolve; ties to Criterion 2).

---

## CRITERION 7 — Build parity

**Statement:** `npm run build:site` succeeds from the new root, and `dist/site` serves **every**
course / lesson / test / handout the old build did (additions allowed; **removals flagged**).

**Check:**

```bash
npm run build:site                                   # from new root — must exit 0
# Capture file lists (relative paths, sorted) for OLD and NEW builds:
( cd OLD_dist_site && find . -type f | sort ) > /tmp/old.list
( cd dist/site     && find . -type f | sort ) > /tmp/new.list
comm -23 /tmp/old.list /tmp/new.list   # lines = REMOVED in new build  → MUST be empty (or justified)
comm -13 /tmp/old.list /tmp/new.list   # lines = ADDED in new build    → allowed
```

**Pass condition:** build exits **0**; the OLD-only set (removals) is **empty** — or every removal
is an explicitly justified retirement (e.g. an emoji-folder path replaced 1:1 by its kebab equivalent).
Additions are fine. Tie-in: the canonical ROOT `index.html` (47,038 B) and 4-file `shared/` must be
present (proof the canonical-content swap took effect, not the stale FR copies).

---

## CRITERION 8 — Secret scan clean

**Statement:** a secret-value scan over the **staged** set finds nothing **before any commit**.

**Check (paths / key-names only — NEVER print values):**

```bash
# Over the staged set only, pre-commit:
git diff --cached --name-only        # review WHAT is staged (paths only)
# Scan staged content for real-key shapes; report PATHS / key-names, never values:
gitleaks protect --staged --redact   # or equivalent value-shape scanner, redacted output
```

**Pass condition:** scan reports **0** findings. On **any** hit: **STOP**, do not commit, report
path + key-name only (never the value), and quarantine per policy. The scan runs **before every
commit** in the consolidation (docs-only and content commits alike).

---

## Rollback

Recovery is **cheap and non-destructive by construction**: M3 **archives rather than deletes**, and
Copy #2 is **frozen** at tag `preflight-freeze-2026-06-03` (commit `42619ff`). If any criterion fails
post-merge, recovery = **restore from `/_archive/`** + **`git checkout` the freeze tag**.

**Exact commands:**

```bash
# 1) Recover the frozen Spring-2026 Beckley cohort (Copy #2) from its repo + tag:
git -C "C:\Users\Instructor\Dev\curriculum\VUB Lessons\VUB Intermediate Computer Course" \
    switch freeze/preflight-2026-06-03
# or, detached at the exact tagged commit:
git -C "C:\Users\Instructor\Dev\curriculum\VUB Lessons\VUB Intermediate Computer Course" \
    checkout preflight-freeze-2026-06-03            # tag → commit 42619ff

# 2) Restore any retired artifact (Copy #2 tree, 0-byte stub, manifest) from the archive:
#    nothing was hard-deleted, so a copy back from /_archive/ is sufficient:
cp -a "/_archive/VUB Intermediate Computer Course/." "<restore-target>/"
cp -a "/_archive/<stub-path>/presentation.html"      "<restore-target>/"

# 3) If the consolidation commit itself must be undone, revert it (non-destructive history):
git revert <m3-consolidation-commit>
```

Because the freeze tag and `/_archive/` both exist, **no recovery path requires un-deleting anything** —
the source is always retrievable from the archive copy or the tagged commit.

---

*Contract only. No course file is created, moved, renamed, or deleted by this document.*
