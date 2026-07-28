# Project Memory

## Project Overview
- **Name**: VUB Learning platform (`vublessons`)
- **Description**: Static site hosting three Veterans Upward Bound courses — Intermediate Computer Skills (8 wks), Financial Readiness (5 modules), Digital Literacy L1 (5 wks)
- **Tech stack**: Static HTML/CSS/JS, no framework. Node build script (copy-only), Playwright tests, Python link checker
- **Repo**: https://github.com/doclegg05/VUB-Financial-Readiness — **name is misleading**, this is the whole platform, not one course
- **Live**: https://vublessons.com (Netlify project `vubcourse`, builds `main` → `dist/site`)

## Current Status
Consolidated and healthy. All three courses live and serving 200. Build clean (152 pages), link check 0 broken, 13/18 Playwright tests passing (5 known DL1 failures, pre-existing).

## Last Session
- **Date**: 2026-07-28
- **What we worked on**: Investigated a request to "merge VUB-Course and VUB-Financial-Readiness". Found the merge was already done in June 2026 (M1–M3 consolidation) — `VUB-Course` was a superseded duplicate. Retired it, and fixed a live content defect the earlier consolidation left behind.
- **What we decided**:
  - Week 2 of Computer Skills stays **Windows Tips & Productivity**; the standalone repo's Video Conferencing lesson is retired (preserved in the archived `VUB-Course` repo at commit `2870359`).
  - Retire `VUB-Course` rather than merge it — nothing in it was newer.
  - Do **not** rename this repo to `vublessons` for now (deploy risk); documented the misleading name in `AGENTS.md` instead.
- **Where we left off**: `VUB-Course` fully retired — Pages off, repo archived read-only, local clone removed. `VUB-Financial-Readiness` is now the single source for everything on vublessons.com. Remaining items are pre-existing, not from this session.

### Deploy facts (verified, not inferred)
vublessons.com is Netlify project `vubcourse`, building **`doclegg05/VUB-Financial-Readiness` branch `main`** — confirmed by the Netlify deploy record's `commit_url`, by `VUB-Course` having had no `netlify.toml`/`package.json`/`scripts/` at all, and by a push landing live in ~20s. `VUB-Course` never fed vublessons.com; it published a *separate* copy via GitHub Pages, now disabled.

## Open Items
- [x] ~~Disable GitHub Pages on `doclegg05/VUB-Course`~~ — done 2026-07-28. `doclegg05.github.io/VUB-Course/` now 404s.
- [x] ~~Re-archive `doclegg05/VUB-Course` read-only~~ — done 2026-07-28. Archived, public, content preserved at `2870359` (includes the retired Video Conferencing Week 2).
- [ ] **⚠️ ON THE WINDOWS MACHINE: push the VUB-Course freeze refs.** Britt asked to be reminded (2026-07-28).

  `preflight-freeze-2026-06-03` (`42619ff`) and branch `freeze/preflight-2026-06-03` exist **only** in the Windows machine's local `_archive/VUB-Course-2026-06-03/`. `git ls-remote doclegg05/VUB-Course` returns `refs/heads/main` and nothing else. That commit captured ~33 files never merged to `main` — this is the sole copy. If that machine dies, so does the snapshot.

  **`doclegg05/VUB-Course` is archived read-only, and archived repos reject pushes.** Unarchive first or the push fails confusingly:

  ```bash
  gh api -X PATCH repos/doclegg05/VUB-Course -f archived=false
  cd "C:/Users/Instructor/Dev/curriculum/VUB Lessons/_archive/VUB-Course-2026-06-03"   # verify path
  git push origin preflight-freeze-2026-06-03 freeze/preflight-2026-06-03
  gh api -X PATCH repos/doclegg05/VUB-Course -f archived=true
  ```

  Verify with `git ls-remote --tags origin`, then tick this box.
- [ ] 5 failing `tests/functional/dl1-sidebar-scroll.spec.js` cases (resource link not in viewport after sidebar scroll). Pre-existing, untouched this session.
- [ ] Consider renaming repo → `vublessons` (deferred; verify Netlify survives the rename).

## Key Decisions Log
| Date | Decision | Rationale |
|------|----------|-----------|
| 2026-07-28 | Keep Windows Tips as Week 2; rewrite the 6 Video Conferencing test questions | Windows was the deployed canonical curriculum; the tests were the thing out of sync, not the lesson |
| 2026-07-28 | Delete the 3 Zoom/telehealth handouts | Orphaned under a Windows lesson after the topic swap; nothing else linked them |
| 2026-07-28 | Retire `VUB-Course` instead of merging | Platform copy was strictly ahead (a11y fixes, resources sections, shared/ integration); only Week 2 differed, and that was a deliberate curriculum change |
| 2026-07-28 | Defer repo rename | Only step with real deploy risk; no functional benefit today |

## Architecture Notes
- `courses.json` is the **catalog source of truth** — drives the homepage and course consoles. It is *not* generated from the course trees; adding a lesson means editing both.
- `scripts/build-site.js` is a **copy, not a bundler**. New load-bearing top-level files must be added to its `PUBLISH` array or they silently won't deploy.
- `shared/` (brand.css, shell.js, text-size.js, progress.js, glossary.js…) is referenced with **root-absolute** paths, so pages only work when served from the site root — not opened off disk.
- **GitHub Pages is also enabled on this repo** and serves the repo root, ignoring `netlify.toml`. The pretty URLs (`/financial-readiness`, `/computer-skills`, `/syllabus`, `/intake`) 404 there. `vublessons.com` is the real site.
- Docs under `docs/` are historical and contain dead Windows paths (`C:/Users/Instructor/Dev/...`). Treat as history, not instructions.

## Known Issues
- **Assessment drift is the recurring failure mode here.** Week 2's lesson changed in June 2026 but its pre/post questions weren't updated until 2026-07-28 — veterans were tested on Zoom and VA Video Connect for a lesson that taught Windows shortcuts. `AGENTS.md` now carries a rule: changing what a week teaches means updating the interactive test, the printable test, the printable **answer key**, the intro topic list, and `syllabus-overview.html` in the same commit.
- The `_archive/README.md` claim that Copy #2 "differs from canonical only by baked cohort dates + 1 pedagogical line" is **wrong** — Week 2 was an entirely different lesson. Don't trust that assessment for other files without re-diffing.
- DL1 per-week lesson MP4s still unrendered (needs ElevenLabs key + hero assets; see `video/digital-literacy-1/README.md`).
