# FR Assessment Capture — Supabase result recording — Design

- **Date:** 2026-06-05 · **Author:** brainstormed with Britt Legg (one-question-at-a-time; decisions in §3).
- **Status:** Design approved (brainstorm complete). Awaiting written-spec review → `writing-plans`.
- **Parent:** [2026-06-05-m5-consoles-lesson-wrap-design.md](2026-06-05-m5-consoles-lesson-wrap-design.md) — this **resolves the §8 data-capture gate** and expands **F2** from "local forms, no capture" to "local forms **+** Supabase capture."
- **Supersedes:** the Google Forms → Sheet pipeline (`assessments/*-form.html`, `submit-tests.html`, `scripts/google-forms-setup.gs`, `SETUP-GOOGLE-FORMS.md`) — retired by this design.

---

## 1. Purpose & scope

Give the FR **pre/post** tests a quiet central-record hookup: the existing local, client-side-scored HTML tests keep working (score + print offline), and **on submit they also POST one row to a Supabase database** so the program can report each student's pre→post improvement. "Subtle" = **seamless for the student** (no separate submit step, no email, no manual export) — disclosed, not covert.

**In scope:**
- A small client module `assessments/capture.js` that (a) loads the class **roster** into a dropdown and (b) POSTs a scored result to Supabase, with an **auto-CSV fallback** on failure.
- Two Supabase tables (`roster`, `results`) + **insert-only / select-only RLS**.
- Wiring `capture.js` into the re-skinned local `pre-test.html` / `post-test.html` (M5-F2).
- Retiring the Google Forms pipeline; repointing `courses.json` FR `preTest`/`postTest` to the local `.html` tests.
- Tests: scoring unchanged, submit payload shape, fallback path, RLS enforcement, roster load + fallback.

**Out of scope (deferred):**
- Instructor dashboard / reporting UI over `results` (query via Supabase directly for now).
- Auth/accounts, anti-abuse beyond RLS (Turnstile/shared-secret — YAGNI).
- ICS (computer-skills) test capture — this milestone wires **FR only**; the same module can be reused for ICS later.
- Certificate/report polish (already deferred in M5 §9).

**Non-goals:** no backend server we host (Supabase REST only); no change to test **items** or **scoring rules**; no per-student persisted state on the shared lab machine.

**Compliance note:** Britt confirmed **FERPA is not a gating consideration for this project** (2026-06-05) — a deliberate, project-scoped decision. Student name + scores may be transmitted to Supabase. This reverses the standing PII-governance default and is recorded as such.

---

## 2. Architecture & data flow

One new client module; no server code we run.

```
Roster dropdown (loaded from Supabase on page load; typed-name fallback if offline)
        │
Student takes test → clicks "See My Results"
        │
        ├─ score computed locally  → results screen + print-to-PDF   (UNCHANGED, fully offline)
        │
        └─ capture.js POSTs ONE row to Supabase /rest/v1/results
                 ├─ success → small "✓ Results recorded" confirmation
                 └─ failure/offline → auto-download CSV of this result + "show your instructor"
```

The test is fully usable offline; only the **recording** step needs the network and it degrades gracefully (no lost data).

### Units (each independently testable)
- **`capture.js` · `VubCapture.loadRoster(cohort)`** → `Promise<Array<{id, display_name}>>`; rejects on network/HTTP error (caller falls back to a typed-name input).
- **`capture.js` · `VubCapture.submit(result)`** → `Promise<void>`; rejects on failure (caller triggers CSV fallback). `result = { testType, rosterId, displayName, scorePercent, categoryScores, answers }`.
- **`capture.js` · `VubCapture.downloadCsv(result)`** → builds + triggers the fallback CSV (reuses the existing `csvEscape`/`safeFileName` logic already in the test files).
- **Config block** (top of `capture.js`): `SUPABASE_URL`, `SUPABASE_ANON_KEY`, `COHORT`. The anon key is **public by design** (ships in client JS) — see §5.

---

## 3. Settled decisions (from the brainstorm)

| # | Question | Decision |
|---|----------|----------|
| 1 | Data posture | **Vetted cloud OK; FERPA not gating** (project-scoped, confirmed). Name + scores may be transmitted. |
| 2 | Destination | **Supabase** (real Postgres; MCP-managed). Retire Google Forms → Sheet. |
| 3 | Student identity / pre↔post match | **Roster dropdown** — student picks their name; `roster_id` is the stable match key (no typo breakage). |
| 4 | Capture granularity | **Summary + per-question** — overall %, per-category, and each answer vs. correct (jsonb). |
| 5 | Offline / failed submit | **Auto-CSV fallback** — download the result locally so nothing is lost. |
| 6 | "Subtle" meaning | **Seamless for the student** (auto-capture on the results action), **disclosed not covert**. |
| 7 | Spec location | **Dedicated spec** (this file), referenced by a short M5 §8 note. |

---

## 4. Data model (Supabase)

```sql
create table roster (
  id           bigint generated always as identity primary key,
  cohort       text not null,
  display_name text not null,
  active       boolean not null default true,
  created_at   timestamptz not null default now()
);

create table results (
  id              bigint generated always as identity primary key,
  created_at      timestamptz not null default now(),
  roster_id       bigint references roster(id),
  display_name    text not null,                 -- denormalized snapshot at submit time
  test_type       text not null check (test_type in ('pre','post')),
  score_percent   integer not null check (score_percent between 0 and 100),
  category_scores jsonb not null,                -- { "<category>": { correct, total } }
  answers         jsonb not null                 -- [ { id, student, correct } ]
);
```

**Pre→post improvement** (the reporting payoff) is a single query:

```sql
select r.display_name,
       max(x.score_percent) filter (where x.test_type = 'pre')  as pre,
       max(x.score_percent) filter (where x.test_type = 'post') as post
from results x
join roster r on r.id = x.roster_id
group by r.display_name
order by r.display_name;
```

---

## 5. Security (RLS)

The browser uses the Supabase **anon** key — public by design (it is in the shipped JS; this is the documented Supabase client pattern, **not** a leaked secret). All protection is at the row-policy layer:

```sql
alter table roster  enable row level security;
alter table results enable row level security;

-- anon may READ active roster rows (to fill the dropdown) — nothing else
create policy "roster anon select" on roster
  for select to anon using (active = true);

-- anon may INSERT results — no select/update/delete (denied by default)
create policy "results anon insert" on results
  for insert to anon with check (
    test_type in ('pre','post')
    and score_percent between 0 and 100
  );
```

Net: a student can read the roster and submit a result; they cannot read anyone's results, edit, or delete. Spam risk on a lab tool is negligible; a Turnstile/shared-secret is deferred. The anon key is documented in `capture.js` with a comment marking it intentionally public.

---

## 6. Roster source & load behavior

- Roster lives in the `roster` table (single source; managed by the instructor / via MCP — no per-cohort JSON editing).
- On test load, `capture.js` GETs `…/rest/v1/roster?select=id,display_name&cohort=eq.<COHORT>&active=eq.true&order=display_name` and fills the dropdown.
- **Fallback:** if the fetch fails (offline / error), the dropdown is replaced by a typed-name `<input>` so the test never blocks; the result still captures (and still hits the CSV fallback if the submit also fails).

---

## 7. Submit UX ("subtle") & fallback

- No extra step: capture fires on the existing **"See My Results"** action, alongside the local score render.
- On success: a small, non-blocking **"✓ Your results were recorded"** line on the results screen (disclosed, honest).
- On failure/offline: `downloadCsv()` auto-saves `vub-<pre|post>-test-<name>-<date>.csv` and the screen shows **"Couldn't reach the server — your results were saved as a file; please show your instructor."**
- **PII handling (preserves M5 Finding #3):** the student name is sent in the POST payload but is **never written to `localStorage`/`sessionStorage`** — the existing `localStorage['vub_financial_*_results']` writes are removed as part of M5-F2. No named results persist on the shared machine.

---

## 8. No-CDN / offline reconciliation (preserves M5 Finding #2)

The strict global no-CDN sweep targets external **asset** resource types (`stylesheet`, `font`, `script`, `image`, `media`, sub-frame `document`). The Supabase calls are **`fetch`/`xhr` data requests on the FR assessment route**, a different category — and they are the one **documented** data dependency for that route. The sweep test:
- stays **strict** on assets for every page (no external CSS/font/script/iframe), and
- **allowlists** `fetch`/`xhr` to the configured `SUPABASE_URL` origin **only on the FR assessment pages**.

So Finding #2's intent (no external **assets** sneaking onto a learner route) holds, while the deliberate capture call is permitted and explicit.

---

## 9. Supabase target

- **Org:** VisionQuest (`vsmhoizgqfvzsrwudqke`).
- **Project:** recommend a **dedicated** project `vub-assessments` (clean isolation from `doclegg05's Project` `erdbdpgfirfbaoswwqby`). Fallback: reuse the existing project with the `roster`/`results` tables if a new project hits a plan limit. **Confirm at implementation start** before provisioning (one reversible infra call via Supabase MCP `create_project` or `apply_migration`).
- Provisioning + the two `create table` + RLS migrations are an implementation step (via `apply_migration`), gated on that confirmation.

---

## 10. Testing

**Supabase / RLS (via MCP or a fetch harness):**
- anon **insert** into `results` succeeds; anon **select** from `results` is denied/empty; anon **select** from `roster` returns active rows.
- check constraints reject `test_type` ∉ {pre,post} and out-of-range `score_percent`.

**Playwright (extend the M5 suite):**
- Roster dropdown populates from a stubbed roster response; **falls back to a typed-name input** when the roster fetch fails.
- Known answers → expected score (unchanged) **and** the submit fires a POST to `…/rest/v1/results` with the correct payload (intercept the request).
- Forced POST failure → **CSV auto-downloads**; results screen shows the fallback message.
- No-CDN sweep: FR assessment pages emit **zero external asset requests**, and the only external `fetch`/`xhr` is to `SUPABASE_URL`.
- No student name/answers written to `localStorage`/`sessionStorage` after scoring (M5 Finding #3 guard).

---

## 11. Migration — retire the Google Forms pipeline

- Repoint `courses.json` FR `preTest`/`postTest`: `assessments/pre-test-form.html` / `post-test-form.html` → `assessments/pre-test.html` / `post-test.html`.
- Remove from the linked/published set: `pre-test-form.html`, `post-test-form.html`, `submit-tests.html`, `scripts/google-forms-setup.gs`, `SETUP-GOOGLE-FORMS.md` (archive-not-delete per house rule — move under `_archive/` or mark retired; do not hard-delete without explicit approval).
- Add `capture.js` (+ any FR-form assets) to `build-site.js` `REQUIRED_FILES`.

---

## 12. M5 cross-reference (small edit, applied after this spec is approved)

M5 §8 / §6-F2 gets a one-line note: *"The data-capture decision is resolved by [2026-06-05-fr-assessment-capture-design.md] — FR results POST to Supabase on submit (roster-matched, summary+per-question, CSV fallback). F2 wires `capture.js` into the local tests and retires the Google Forms pipeline."*

---

## 13. Open items / risks
- **Roster maintenance:** someone keeps `roster` current per cohort (MCP/instructor). Low effort (small N), but it is a recurring task.
- **Anon-key abuse:** public key + insert-only policy = a motivated actor could insert junk rows. Acceptable for a lab tool; revisit with Turnstile if it ever matters.
- **Online-at-submit:** capture needs network at submit; the CSV fallback covers outages, but the central record then depends on the instructor entering the fallback CSV.
- **Project choice** (§9) must be confirmed before provisioning.

---
*Brainstormed + approved 2026-06-05. Next: written-spec review → `writing-plans`. Implementation lands inside M5-F2 on branch `feat/m5-consoles-lesson-wrap`; one commit per layer; secret-scan (paths-only) before every commit; no push.*
