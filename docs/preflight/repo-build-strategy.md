# Repo & Build Strategy — VUB Lessons Platform Consolidation

> **Status:** DRAFT — awaiting human approval at the **Milestone 1 exit gate**.
> **Scope:** Decide WHERE the unified platform repo lives, HOW the two existing
> course repos fold in, and WHERE the build/test/Netlify toolchain relocates.
> **No code or git changes are made by this document.** It is a recommendation only.
>
> Date: 2026-06-03 · Author: preflight subagent · Domain target: **vublessons.com**

---

## 0. Why this decision is needed (verified starting state)

| Fact | Detail | Source |
|:-----|:-------|:-------|
| Platform ROOT is **untracked** | `c:\Users\Instructor\Dev\curriculum\VUB Lessons` is NOT its own git repo. It sits inside `C:/Users/Instructor/Dev`, whose `.gitignore` `/*` ignores the whole `curriculum/` subtree. Root platform files (`index.html`, `shared/`, `weeks/`, `classes/`, `intake.html`, `package.json`) are tracked by **no repo today**. | verified |
| FR is a clean, **deployed** repo | `VUB Financial Readiness Course/` = `github.com/doclegg05/VUB-Financial-Readiness`, HEAD `dcd3c56`. Owns the real toolchain (`scripts/build-site.js` → `dist/site`, Playwright `tests/`, `netlify.toml`) and is the live Netlify deploy (`vubcourse.netlify.app`). | verified |
| ICS is its own repo, **frozen** | `VUB Intermediate Computer Course/` = `github.com/doclegg05/VUB-Course`, HEAD `2870359`. Divergent cohort tree frozen on tag/branch `preflight-freeze-2026-06-03` (commit `42619ff`). | verified |
| **ROOT copies are CANONICAL** | `root/index.html` = 47,038 bytes (polished "VUB Learning" catalog) + `root/shared/` has **4** files (glossary.css/js, print.css, progress.js). Deployed `FR/index.html` = 20,801 bytes + `FR/shared/` has only **2**. The build currently ships the **STALE FR-subfolder copies**. Redeploying from ROOT is an **upgrade**, not a regression. | verified |
| Build constants are FR-rooted | `scripts/build-site.js` sets `ROOT = path.resolve(__dirname, "..")` (FR repo root), and hardcodes `LOCAL_INTERMEDIATE_COURSE = ROOT/intermediate-computer-skills`, plus `REQUIRED_ITEMS` and `BUNDLED_COURSES` (`dest: "intermediate-computer-skills"`). These constants must be re-pointed to the new `/courses/...` layout when relocated. | verified |
| Netlify has emoji rewrites | `netlify.toml` rewrites `/assessments/* → /📘 Assessments/:splat` (and Handouts, Study Resources, Teacher Guides). These exist only because course folders use emoji prefixes; they become **unnecessary** after the planned kebab-case renames. | verified |

**Net:** the canonical content lives in an **untracked** location, while the
**toolchain and deploy** live in a sibling repo carrying **stale** content. The
consolidation must put canonical content + toolchain + deploy under ONE roof.

---

## 1. Repo options (3) — tradeoffs + recommendation

### Option A — NEW unified repo at the ROOT *(RECOMMENDED)*

Create one new git repo (suggested name **`vublessons`**, owner `doclegg05`)
initialized **at the platform ROOT** (`.../curriculum/VUB Lessons`).

- Make the **newer ROOT copies the canonical source** (resolves the
  root-canonical finding directly — no stale base inherited).
- Fold both course bodies under a clean `/courses/...` layout:
  - `courses/financial-readiness/` (content from the FR repo working tree)
  - `courses/intermediate-computer-skills/` (content from the frozen ICS tree)
- **Relocate** the build/test/Netlify toolchain from the FR subrepo to root,
  re-pointing the path constants (see §3).
- **Archive** both existing repos (`VUB-Financial-Readiness`, `VUB-Course`)
  read-only on GitHub so their history is preserved off to the side.

**Pros**
- Single source of truth; eliminates the multi-source drift that caused the
  stale-deploy bug. The canonical ROOT copies become the base by construction.
- Clean `/courses/<kebab>/` layout lets the netlify emoji-rewrites be **deleted**.
- The untracked-ROOT problem is fixed at the same stroke (root finally gets a repo).
- New, linear history; migration manifest = provenance (auditable, additive).

**Cons**
- FR/ICS commit history does not live *inside* the new repo (mitigated: archived
  repos keep full history on GitHub; manifest records provenance; ICS divergence
  preserved by the `preflight-freeze-2026-06-03` tag).
- One-time migration effort (copy + re-point constants + new Netlify binding).

### Option B — Promote the existing `VUB-Financial-Readiness` repo to root

Move the FR repo's `.git` up to the platform ROOT and fold the rest in around it.

**Pros**
- Preserves FR history *in place* (no archive step for FR).

**Cons (why not chosen)**
- **Mechanically messy** given the nesting: the `.git` currently sits two levels
  down inside `VUB Financial Readiness Course/`; moving it to root and reparenting
  every tracked path is error-prone, and FR's `.gitignore`/35+ tool-config dirs
  (`.adal/`, `.augment/`, `.roo/`, …) come along for the ride.
- **Inherits the STALE FR copies as the base** — directly conflicts with the
  root-canonical finding. You'd then have to overwrite the just-promoted tree
  with the ROOT copies, producing a confusing "replace canonical with sibling,
  then replace back" history.
- ICS history still has to be archived or subtree-merged anyway, so this only
  half-solves the multi-history question.

### Option C — Keep multiple repos via git submodules *(REJECT)*

Root super-repo references `VUB-Financial-Readiness` and `VUB-Course` as submodules.

**Pros**
- Preserves all histories untouched.

**Cons (why rejected)**
- **Reintroduces the exact multi-source drift we are eliminating** — pinned
  submodule SHAs are a new way for content to go stale (this is how the live site
  ended up shipping the old FR copies in the first place).
- Submodule UX is poor for a static-content site authored by a non-git-expert;
  detached-HEAD foot-guns and "did you push the submodule?" failures are likely.
- Build/Netlify against submodules adds checkout complexity for zero benefit here.

### Recommendation

**Adopt Option A.** It is the only option that makes the **canonical ROOT copies
the base**, fixes the untracked-root problem, removes the emoji-rewrite cruft, and
ends multi-source drift — while still preserving every old history via archive.

---

## 2. History-preservation decision

**Recommended: ARCHIVE the old repos** (do NOT subtree-merge their histories).

| Approach | What happens to history | Complexity | Verdict |
|:---------|:------------------------|:-----------|:--------|
| **Archive (recommended)** | `VUB-Financial-Readiness` and `VUB-Course` are set **read-only/archived** on GitHub. Full commit history stays browsable there. The new `vublessons` repo starts **clean**, with the **migration manifest** as provenance. ICS cohort divergence stays recoverable via the `preflight-freeze-2026-06-03` tag (commit `42619ff`). | Low | **Choose** |
| Subtree-merge both | New repo carries **both** old histories grafted under `courses/financial-readiness/` and `courses/intermediate-computer-skills/`. Nothing leaves GitHub. | Higher — two `git subtree add`/graft operations, larger object store, intertwined history that's harder to bisect/read | Reject for now |

**Tradeoff stated plainly:** archiving trades *in-repo* history continuity for a
clean, readable, single-lineage repo. Because the canonical content is the **ROOT**
copies (not the FR/ICS trees), the old per-repo histories have **limited forward
value** — they describe trees we are deliberately superseding. The archived repos
plus the migration manifest plus the freeze tag give full auditability without
importing two tangled histories. If, later, an in-repo lineage is required, a
subtree-merge can still be performed retroactively from the archived repos.

---

## 3. Build / test / Netlify relocation plan

All toolchain artifacts move from `VUB Financial Readiness Course/` to the new
repo **root**. Concretely:

### 3.1 Build script
- Move `VUB Financial Readiness Course/scripts/build-site.js` → `scripts/build-site.js` at root.
- **Re-point path constants** (current values assume FR repo root):
  - `ROOT = path.resolve(__dirname, "..")` still resolves to repo root — OK once
    `scripts/` is at root, but **verify** after the move.
  - `LOCAL_INTERMEDIATE_COURSE = ROOT/"intermediate-computer-skills"` →
    `ROOT/"courses/intermediate-computer-skills"`.
  - `REQUIRED_ITEMS` entries (`financial-readiness.html`,
    `intermediate-computer-skills.html`, `intermediate-computer-skills/…`,
    `weeks/week-01/presentation.html`, etc.) → rewrite to the new
    `courses/<kebab>/…` paths.
  - `BUNDLED_COURSES` (`dest: "intermediate-computer-skills"`, its `source`/`items`)
    → repoint `source` to `courses/…` and keep `dest` aligned to the published
    `/courses/<kebab>/` URL space.
- Keep `OUT_REL` default `dist/site` (unchanged).
- `build-site.ps1` (Windows wrapper) moves alongside; re-check its relative paths.

### 3.2 package.json scripts
- Bring `build:site`, `build:site:win`, `test`, and the PDF/teacher-guide/benchmark
  scripts into the **root** `package.json` (root currently only has `dev: serve .`).
- Bring `@playwright/test` + `serve` into root `devDependencies`; reconcile the
  two `serve` versions (root `^14.0.0` vs FR `^14.2.6` — take the newer).

### 3.3 Tests
- Move `VUB Financial Readiness Course/tests/` (`content/`, `functional/`,
  `helpers.js`) and `playwright.config.js` to root.
- Update any test paths/baseURLs that assumed the FR-rooted layout or the
  emoji-prefixed folders.

### 3.4 netlify.toml
- Move to repo root. Keep `publish = "dist/site"` and the `[build]`
  `command = "npm run build:site"`.
- Keep the security `[[headers]]` and cache-control blocks **as-is**.
- Update the named redirects to the `/courses/...` space (`/financial-readiness`,
  `/computer-skills`, `/intermediate-computer-skills`, `/syllabus`, `/intake`).
- **Delete the emoji-folder rewrites** (`/assessments/* → /📘 Assessments/:splat`
  and the Handouts / Study Resources / Teacher Guides equivalents). After the
  planned kebab-case renames these map to plain folders and the rewrites become
  dead config. Keep the `/* → /404.html` catch-all.

### 3.5 Support scripts
- The Python generators (`generate-module*-teachers-guide.py`,
  `generate-assessment-pdfs.py`, `generate-syllabus-pdf.py`,
  `_teacher_guide_common.py`), `google-forms-setup.gs`, benchmark/compare JS, and
  `create-travel-package.ps1` move into root `scripts/`. Re-check their hardcoded
  course paths against the new `/courses/...` layout.

### 3.6 Verification (build the contract in)
- Run `npm run build:site` and assert `dist/site/` contains **the ROOT
  `index.html` (47,038 bytes) and the 4-file `shared/`**, not the stale FR copies
  — this is the proof the canonical-content swap took effect.
- Run `npx playwright test`; fix path-dependent failures.
- Diff the generated `dist/site` file tree against an approved manifest
  (files == manifest rows) before any deploy.

---

## 4. Deploy / domain

- **Netlify project:** either (a) **repurpose** the existing project behind
  `vubcourse.netlify.app` by re-pointing it at the new `vublessons` repo + root
  `netlify.toml`, or (b) create a **new** Netlify project. Recommendation leans
  **repurpose** (keeps build history/settings, one fewer moving part) — but this is
  a gate decision (§5d).
- **Domain:** bind the chosen project to the custom domain **vublessons.com**
  (add domain in Netlify, configure DNS to Netlify, provision TLS) at cutover.
- **Intended upgrade — call it out:** the deployed site **will change** to the
  newer ROOT build (polished 47 KB "VUB Learning" catalog + 4-file `shared/`).
  This is the **intended upgrade** that fixes the stale-deploy bug — **not a
  regression**. Communicate this to the stakeholder before cutover so the visual
  change is expected.
- **Cutover safety:** deploy to a Netlify preview/branch URL first, verify the
  upgraded catalog renders and both course routes work, then flip DNS for
  vublessons.com. Keep `vubcourse.netlify.app` resolving during the transition.

---

## Decisions required at the Milestone 1 exit gate

1. **(a) Repo option** — Approve **Option A** (new `vublessons` repo at root,
   ROOT copies canonical, archive both old repos) vs. Option B (promote FR repo)
   or Option C (submodules). *Recommendation: A.*
2. **(b) History preservation** — Approve **ARCHIVE** the old repos (clean new
   history + manifest provenance + freeze tag) vs. **subtree-merge** both
   histories into the new repo. *Recommendation: Archive.*
3. **(c) Repo name + owner** — Confirm new repo name **`vublessons`** and GitHub
   owner **`doclegg05`**.
4. **(d) Netlify project + domain timing** — Confirm **repurpose existing
   `vubcourse.netlify.app`** vs. **new Netlify project**, and confirm the
   **vublessons.com** DNS/TLS cutover timing (preview-first, then flip).

---

*No mutations performed. This document is the sole artifact produced.*
