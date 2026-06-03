# Duplicate Inventory — VUB Intermediate Computer Skills (ICS)

**What this is:** Milestone 1 / Task 1 preflight inventory of the three physical copies of the
ICS course, performed before any consolidation. It records file counts, a line-ending-NORMALIZED
content comparison between the two live copies, the dead 0-byte stub, and a canonical-source decision.

**Date:** 2026-06-03
**Mode:** READ-ONLY preflight. No course file was modified, moved, renamed, or deleted. The only
file created/edited by this task is this artifact.

**Revision note (2026-06-03):** This artifact was CORRECTED after an initial raw-byte pass produced
a false "44 of 46 files differ / massive drift" alarm. That difference was almost entirely
**line-ending noise (CRLF vs LF)**, not content. All comparisons below are re-run with line endings
normalized (`diff --strip-trailing-cr` for true changed-line counts; `tr -d '\r' | sha256sum` for
true content identity). The corrected picture is the opposite of drift: the two copies are the
**same course**, and the only systematic difference is **hardcoded Spring-2026 cohort dates** in
Copy #2.

---

## PATH CORRECTION (read first)

The orchestrator's "verified facts" placed Copy #1 and Copy #2 as **siblings** of `VUB Lessons`.
That is incorrect. Both copies actually live **inside** `VUB Lessons`. Verified actual paths used
for every measurement below:

| Copy | Role | Actual path |
|:-----|:-----|:------------|
| **Copy #1** | GENERIC reusable template — deployed | `...\VUB Lessons\VUB Financial Readiness Course\intermediate-computer-skills\weeks` |
| **Copy #2** | Spring-2026 Beckley cohort DATED variant | `...\VUB Lessons\VUB Intermediate Computer Course\weeks` |
| **Copy #3** | Dead 0-byte stub | `...\VUB Lessons\weeks\week-01\presentation.html` |

(Also noted, not part of this task: Copy #1 has four built mirrors of itself under
`VUB Financial Readiness Course\dist\site*\intermediate-computer-skills` — `dist/site`,
`dist/site-audit`, `dist/site-test`, `dist/site-win`. These are build artifacts, not source.)

---

## File counts

Recursive file count of each `weeks` tree (`find -type f`):

| Copy | File count |
|:-----|:-----------|
| Copy #1 (generic/deployed) | **46** |
| Copy #2 (Spring-2026 cohort) | **46** |

Both copies contain the **same 46 relative paths** — identical file inventory, no extra/missing
files on either side. No structural drift.

---

## IMPORTANT: the raw-byte differences are line endings, NOT content

A raw `sha256sum` (and raw `diff`) reported all 42 HTML files as "different" and a multi-thousand-line
diff per file. That was a **measurement artifact**: Copy #1 and Copy #2 use different line endings
(CRLF vs LF), so every line registers as "changed" at the byte level. Once line endings are
normalized, the true picture emerges: most files are byte-for-byte identical, and the rest differ
by only 2–10 real lines — almost all of them hardcoded cohort dates.

Example (week-03/presentation.html): raw diff ≈ 3254 changed lines; normalized diff =
**10 lines**, of which 9 are cohort-date substitutions and 1 is a non-date pedagogical example.

---

## Normalized comparison table

Columns: **file | normalized_diff_lines | content_identical?**
`content_identical? = YES` when `tr -d '\r' | sha256sum` matches on both sides (true content match,
ignoring line endings). `normalized_diff_lines` = `diff --strip-trailing-cr | grep -c '^[<>]'`
(count of true changed lines, i.e. removed + added).

### Core — presentation.html & syllabus.html (16 files)

| File | normalized_diff_lines | content_identical? |
|:-----|:---------------------:|:------------------:|
| week-01/presentation.html | 2 | no (cohort date) |
| week-01/syllabus.html | 2 | no (cohort date) |
| week-02/presentation.html | 2 | no (cohort date) |
| week-02/syllabus.html | 2 | no (cohort date) |
| week-03/presentation.html | 10 | no (8 date lines + **1 non-date**) |
| week-03/syllabus.html | 2 | no (cohort date) |
| week-04/presentation.html | 8 | no (cohort date) |
| week-04/syllabus.html | 2 | no (cohort date) |
| week-05/presentation.html | 6 | no (cohort date) |
| week-05/syllabus.html | 2 | no (cohort date) |
| week-06/presentation.html | 6 | no (cohort date) |
| week-06/syllabus.html | 2 | no (cohort date) |
| week-07/presentation.html | 2 | no (cohort date) |
| week-07/syllabus.html | 2 | no (cohort date) |
| week-08/presentation.html | 2 | no (cohort date) |
| week-08/syllabus.html | 2 | no (cohort date) |

### Test files (4 files)

| File | normalized_diff_lines | content_identical? |
|:-----|:---------------------:|:------------------:|
| week-01/pre-test.html | 0 | **YES** |
| week-01/pre-test-printable.html | 0 | **YES** |
| week-08/post-test.html | 0 | **YES** |
| week-08/post-test-printable.html | 0 | **YES** |

### Handouts (26 files)

| File | normalized_diff_lines | content_identical? |
|:-----|:---------------------:|:------------------:|
| week-01/handouts/myhealthevet-guide.html | 0 | **YES** |
| week-01/handouts/va-login-checklist.html | 0 | **YES** |
| week-01/handouts/va-portals-quick-reference.html | 0 | **YES** |
| week-02/handouts/keyboard-shortcuts-reference.html | 0 | **YES** |
| week-02/handouts/telehealth-tips.html | 0 | **YES** |
| week-02/handouts/video-call-checklist.html | 0 | **YES** |
| week-02/handouts/windows-workshop.html | 2 | no (cohort date) |
| week-02/handouts/zoom-quick-start.html | 0 | **YES** |
| week-03/handouts/email-etiquette-guide.html | 0 | **YES** |
| week-03/handouts/gmail-quick-reference.html | 0 | **YES** |
| week-03/handouts/gmail-setup-activity.html | 0 | **YES** |
| week-03/handouts/gmail-workshop.html | 0 | **YES** |
| week-04/handouts/word-activity.html | 4 | no (cohort date) |
| week-04/handouts/word-quick-reference.html | 0 | **YES** |
| week-04/handouts/word-workshop.html | 4 | no (cohort date) |
| week-05/handouts/excel-budget-activity.html | 0 | **YES** |
| week-05/handouts/excel-quick-reference.html | 0 | **YES** |
| week-05/handouts/excel-workshop.html | 2 | no (cohort date) |
| week-06/handouts/cloud-activity.html | 0 | **YES** |
| week-06/handouts/cloud-workshop.html | 2 | no (cohort date) |
| week-06/handouts/google-drive-quick-reference.html | 0 | **YES** |
| week-07/handouts/ai-quick-start.html | 0 | **YES** |
| week-07/handouts/ai-workshop.html | 2 | no (cohort date) |
| week-07/handouts/chatgpt-activity.html | 0 | **YES** |
| week-08/handouts/mobile-setup-guide.html | 0 | **YES** |
| week-08/handouts/review-workshop.html | 2 | no (cohort date) |

---

## Corrected drift summary

After line-ending normalization, across all 46 files:

- **(a) Content-identical (0 real diff lines): 23 files.** 4 test files + 19 handouts.
- **(b) Differ ONLY by cohort dates: 22 files.** 16 core (8 presentation + 8 syllabus) + 6 handouts
  (week-02 windows-workshop, week-04 word-activity, week-04 word-workshop, week-05 excel-workshop,
  week-06 cloud-workshop, week-07 ai-workshop, week-08 review-workshop — 7 handouts; note one of
  the 16 core files, week-03/presentation.html, also carries the single non-date diff below).
  *(Exact tally: 15 core files are date-only; week-03/presentation.html is date-lines + 1 non-date;
  7 handouts are date-only. = 22 files whose ONLY differences are cohort dates, plus 1 file that is
  date differences PLUS one genuine non-date line.)*
- **(c) Files with a genuine NON-date content difference: 1 file** — `week-03/presentation.html`.

There is **no content drift**. The two copies are the same course. Copy #2 is Copy #1 with
hardcoded Spring-2026 Beckley cohort dates substituted into header/footer/"coming up" labels (and
a couple of "Today's Date" placeholders filled in), plus one small pedagogical example difference.

### What the cohort-date deltas look like (representative)

| Copy #1 (generic template) | Copy #2 (Spring-2026 cohort) |
|:---------------------------|:-----------------------------|
| `Week 1 of 8` | `February 9, 2026` |
| `Week 2 of 8` | `Week 2 of 8 • February 16, 2026` |
| `Coming Up: Week 4` | `Coming Up: March 2, 2026` |
| `before the next class meeting` | `before next Monday` |
| `See you next class!` | `See you next Monday!` |
| `Your Name | Today's Date` (word-activity) | `Your Name | March 2, 2026` |
| `Week N | VUB Intermediate Computer Skills` (handout headers) | `... | <Mon DD, 2026>` |

The Spring-2026 dates (Feb 9, Feb 16, Feb 23, Mar 2, Mar 9, Mar 16, Mar 23, Mar 30) match the
documented course schedule (Mondays, Feb 9 – Mar 30, 2026), confirming Copy #2 = Spring-2026 Beckley
cohort instance.

---

## Canonical decision

**Copy #1 (generic, deployed — `VUB Financial Readiness Course\intermediate-computer-skills\weeks`)
is canonical** for the self-serve, multi-teacher reusable library. Its generic, date-free labels
("Week N of 8", "Coming Up: Week N+1", "the next class meeting", "next class") are exactly what a
reusable template needs — any future cohort can run it without editing baked-in dates.

**Copy #2's deltas are intentional cohort-date customizations, not divergent content.** Recommendation:
- **ARCHIVE Copy #2** as the "Spring 2026 Beckley instance" (a frozen record of the dated run).
- **Do NOT merge Copy #2's cohort dates into canonical** — that would re-bake a one-time schedule
  into the reusable template and defeat its purpose.
- The 23 content-identical files need no action. The 22 date-only files are fully covered by keeping
  Copy #1 as-is.

### HUMAN REVIEW — genuine NON-date differences only

Exactly **one** non-date content difference exists across all 46 files. A person should decide
whether Copy #1 (canonical) should adopt Copy #2's version:

1. **`week-03/presentation.html`, line 956** — Gmail search-operator teaching example:
   - Copy #1 (canonical): `<code>before:YYYY/MM/DD</code> - Before a date you choose`
   - Copy #2: `<code>before:2025/06/01</code> - Before June 1, 2025`
   - This is a **pedagogical choice** (abstract placeholder vs concrete worked example), unrelated to
     the class schedule. Not a cohort-date customization. **Decision needed:** keep canonical's
     placeholder form, or adopt Copy #2's concrete example. (Note: `2025/06/01` is a past date and
     would not change between cohorts, so adopting it would not re-introduce schedule coupling.)

No other non-date differences were found. All remaining differing lines are cohort dates.

---

## 0-byte stub confirmation (Copy #3)

- Path: `...\VUB Lessons\weeks\week-01\presentation.html`
- Byte length (`stat -c %s` ≡ PowerShell `(Get-Item ...).Length`): **0 bytes** — confirmed dead stub.
- Disposition: to be **archived** in a later milestone (never delete without explicit approval).
  **Never canonical.**
