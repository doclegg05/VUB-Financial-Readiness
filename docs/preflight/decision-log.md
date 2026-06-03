# Milestone 1 — Decision Log

Decisions recorded at the Milestone 1 exit gate. Date: 2026-06-03.

| ID | Decision | Choice | Notes |
|----|----------|--------|-------|
| Freeze method | How to freeze the dirty `VUB-Course` repo | **Surgical freeze** | Branch+tag `preflight-freeze-2026-06-03` (`42619ff`); `git add -u` + 8 named handouts; `node_modules/.claude/Remotion/reference-design` excluded; `main` unchanged (`2870359`). |
| D1 | Correct answers on graded reports | **Show on both pre & post** | Confirmed despite cross-cohort key exposure; each report doubles as a review sheet. Matches spec Decision #9. |
| D2 | Instructor employment contracts (`📘 Admin Paperwork/InstructorContract_6weeks.docx/.pdf`) | **Exclude (keep private)** | Contracts NOT published; only `student-upload-instructions.html` migrates → `/instructors/`. Acceptance Criterion 5 (privacy hold) enforces 0 hits in `dist/site`. |
| D3 | Repo / build strategy | **Option A** | New `vublessons` repo at platform root; newer ROOT copies canonical; relocate build/test/Netlify toolchain to root; archive `VUB-Financial-Readiness` + `VUB-Course` read-only on GitHub (history preserved). |
| D4 | Hosting for vublessons.com | **Repurpose existing Netlify** | Point `vubcourse.netlify.app` at the new repo; bind vublessons.com (custom domain + TLS) at cutover. |

## Orchestrator defaults (stated at gate; not objected to)
- Keep per-week `assessments/` + `handouts/` INSIDE `weeks/week-XX/` (do not hoist to course-level).
- `assessment-service-kit/` → `/instructors/`.
- `📘 Admin Paperwork/student-upload-instructions.html` → `/instructors/`.

## Deferred to a separate, explicitly-confirmed step (outward-facing)
- Creating the GitHub `vublessons` repo and pushing.
- Archiving the two old GitHub repos read-only.
- Repurposing the Netlify project + DNS/TLS cutover for vublessons.com.

These outward actions are NOT performed during Milestone 1; only a LOCAL repo + commit is created.
