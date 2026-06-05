# HANDOFF — VUB Lessons · FR assessment capture design done → written-spec review gate

> **Authored:** 2026-06-05 EOD · **From:** claude-code (this session) · **For:** next agent resuming the FR capture thread.
> **One-line resume:** Two things happened today, both **docs-only on `feat/m5-consoles-lesson-wrap`, no push.** (1) The M5 spec was **de-blocked** after a 2nd Codex review (FR content is already local — F2 is not content-blocked). (2) A new **FR assessment capture design** was brainstormed + written + committed: the local FR pre/post tests will **POST results to Supabase** on submit. **We stopped at the written-spec review gate** — the user has NOT yet reviewed the capture spec. **No implementation code exists.**

---

## 0. Read first
- **NEW capture design (review this):** [docs/specs/2026-06-05-fr-assessment-capture-design.md](specs/2026-06-05-fr-assessment-capture-design.md) — the authoritative source for the capture work.
- **M5 spec (revised twice today):** [docs/specs/2026-06-05-m5-consoles-lesson-wrap-design.md](specs/2026-06-05-m5-consoles-lesson-wrap-design.md) — §6-F2 / §8 now say FR content is local + the data-capture gate is the open item (which the capture spec above resolves).
- **Prior handoff (still mostly valid; F2 superseded):** [docs/handoff-m5-spec-to-plan.md](handoff-m5-spec-to-plan.md).

## 1. Verified state (2026-06-05 EOD)
- **Branch/HEAD:** `feat/m5-consoles-lesson-wrap` @ **`db3d971`**. `main` unchanged; no remote.
- **Today's commits (all docs-only, no code, no push):**
  - `ac37595` — M5 spec revised per **2nd Codex review** (5 findings folded in; FR content confirmed already-local → F3 de-blocked; strict no-CDN; PII guard; hash-route + FA-coverage guards). `+19/−11`.
  - `db3d971` — **NEW** FR assessment capture design spec. `+205`.
- **Working tree:** clean except untracked `docs/handoff-m3-phase-d.md` (out of scope) + this handoff.
- Build/tests NOT re-run today (docs-only session): last known good = `build:site` 123 pages, Playwright 8/8.

## 2. The capture design in one breath (all settled)
- **FERPA is NOT a gating consideration for this project** — Britt's explicit, project-scoped call (reverses the standing PII-governance default; recorded as deliberate).
- **Destination = Supabase** (retire the Google Forms → Sheet pipeline). Org **VisionQuest** `vsmhoizgqfvzsrwudqke`; existing project `erdbdpgfirfbaoswwqby`.
- **Identity = roster dropdown** (`roster_id` is the pre↔post match key). **Granularity = summary + per-question.** **Fallback = auto-CSV** on submit failure. **"Subtle" = seamless + disclosed** (not covert).
- **Shape:** `assessments/capture.js` loads the roster dropdown + POSTs one `results` row on "See My Results"; local score + print unchanged; two tables (`roster`, `results`) with **insert-only / select-only RLS** + public anon key; no-CDN sweep stays strict on assets but allowlists Supabase `fetch`/`xhr` on the FR assessment route; **no name/answers persisted to `localStorage`** (preserves M5 Finding #3).

## 3. Resume HERE (next steps, in order)
1. **Written-spec review gate (brainstorming skill):** ask Britt to review [the capture spec](specs/2026-06-05-fr-assessment-capture-design.md). Apply any edits, then proceed. **Do not skip this gate.**
2. **Confirm the Supabase target** (spec §9): new dedicated `vub-assessments` project (recommended) vs. reuse `erdbdpgfirfbaoswwqby`. One reversible MCP call — confirm before provisioning.
3. **Apply the M5 cross-ref note** (capture spec §12): a one-line update to M5 §8/§6-F2 pointing at the capture spec — **only after** the capture spec is approved.
4. **`writing-plans`** for M5 (now includes capture inside F2): order per M5 §7-E4 (shared → consoles → ICS decks → FR SPA → F1 de-CDN → F2 [local forms + Supabase capture] → build+test+review).
5. Then `subagent-driven-development`; build `npm run build:site` → `npx playwright test`; `finishing-a-development-branch` → merge to `main` locally, **no push**.

## 4. Notes / traps
- Brainstorming HARD-GATE: **no implementation** (no Supabase provisioning, no code) until the written spec is approved.
- Anon key is **public by design** (ships in client JS) — document it in `capture.js`, don't treat it as a leaked secret; but never paste the **service-role** key anywhere.
- Secret-scan (paths-only, shape-based) before EVERY commit; `git grep --no-index -- <path>` mis-parses — scan untracked files with the Grep tool instead.
- Archive-not-delete the retired Google Forms pipeline (`*-form.html`, `submit-tests.html`, `scripts/google-forms-setup.gs`, `SETUP-GOOGLE-FORMS.md`) — no hard delete without explicit approval.

---
*Stopped for the day at the written-spec review gate. Design complete + committed; implementation unstarted.*
