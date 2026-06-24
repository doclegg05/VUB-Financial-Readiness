# Design Spec — Digital Literacy: Level 1 (IC3 GS6-aligned)

**Date:** 2026-06-24
**Author:** Britt Legg (PM) + Claude Code
**Status:** Approved design → ready for implementation planning
**Course id:** `digital-literacy-1` · **Progress key:** `dl1` · **Catalog category:** Digital Literacy

**Revision history**
- **v3 (2026-06-24):** removed FERPA framing — it is a rule from a different project and does **not**
  apply here. Assessments now match the existing courses' pattern (participant name + `localStorage`
  pre/post comparison) rather than the anonymized approach in v2. All non-FERPA Codex fixes retained
  (the offline-video item stays on its own merit — the `AGENTS.md` "no internet for core viewing" rule).
- **v2 (2026-06-24):** revised per Codex design review — knowledge-vs-proficiency framing (§1), Week 4
  sub-objective coverage (§5), data-driven catalog wiring + genericized hero copy + data-derived catalog
  test (§9, §11), offline-safe enrichment video (§6, §11, §12), verbatim **Appendix A** (§3, §15).
  *(The v2 FERPA/anonymization change was reverted in v3.)*
- **v1 (2026-06-24):** initial approved design.

---

## 1. Overview & framing

A **new, self-contained course** added to the VUB Learning platform alongside the existing
*Intermediate Computer Skills* (8-week) and *Financial Readiness* (5-module) courses. It is the
**foundational rung of a planned IC3-aligned ladder** (Level 1 → Level 2 → Level 3, each its own
future course).

- **Audience:** the same VUB veterans — mostly older, retired, learning in a computer lab with
  individual workstations (Windows). Accessibility for older learners is a first-class requirement.
- **Format:** **5 weekly class meetings, 2 hours each.** Weeks 1–4 deliver content covering all
  seven IC3 GS6 Level 1 objective domains; **Week 5 is a Review & Testing day** (cumulative recap +
  Post-Test, no new content).
- **Alignment, not certification claim:** content maps to the **official IC3 GS6 Level 1 objective
  domains** (Certiport, released 2020-05-14; reproduced verbatim in Appendix A). The public title is
  **"Digital Literacy — Level 1"** to avoid implying official Certiport certification while preserving
  the IC3 progression.
- **Objectives span knowledge *and* basic proficiency:** the IC3 GS6 Level 1 objectives mix
  conceptual verbs ("Explain / Identify / Describe / Recognize") with **proficiency/implementation**
  verbs — e.g. 4.1.1–4.1.2 "Display proficiency in creating basic documents/presentations",
  4.2.4 "Implement appropriate online citations", 4.3.2 "Implement file management principles and naming
  conventions", 5.2.1 "Implement digital interactions", 5.2.3 "Demonstrate the use of inclusive
  language". The course therefore pairs concept slides with **guided hands-on labs that directly
  exercise the proficiency objectives** (andragogy: experiential, problem-centered). The lab-to-
  objective map is called out per week in §5.
- **Additive & non-destructive:** the existing two courses, shared chrome, and build are not modified
  except for small, surgical homepage-wiring edits (§9).

### Relationship to the existing "Intermediate Computer Skills" course
The user described this as a "condensed version of Intermediate Computer Skills." In practice, IC3 GS6
Level 1 content (hardware, OS, networking, digital citizenship, safety) is **more foundational** than
the existing ICS course (Word/Excel/Gmail/Cloud/AI — which maps closer to IC3 Level 2/3 "Key
Applications"). So this is a **distinct, more foundational track**, complementary to ICS, not a
replacement. The "condensed" intent is satisfied by the tighter 4+1-week format and the L1→L2→L3
ladder.

---

## 2. Goals & non-goals

### Goals
1. A fully functional, accessible course matching the look, feel, and functionality of the existing
   courses (with quality improvements where reasonable).
2. Complete, **provable** coverage of all 7 IC3 GS6 Level 1 objective domains down to the
   sub-objective (traceability §3 + verbatim Appendix A).
3. Pre-Test (Week 1) and Post-Test (Week 5), each as interactive self-test + printable + optional
   instructor-controlled capture (§7), matching the existing courses' behavior.
4. Per-week **guided hands-on labs** (exercising the proficiency objectives) + printable
   quick-references + in-browser knowledge checks.
5. One **Remotion** course-intro explainer video (~2–3 min) as **optional, offline-safe enrichment**,
   scaffolded for per-week videos later.
6. The course appears as a third card on the homepage catalog, data-driven via `courses.json`, without
   breaking existing pages or tests.

### Non-goals (YAGNI)
- No official Certiport certification, exam voucher, or proctoring integration.
- No Level 2 / Level 3 content this pass (future courses).
- No per-week videos this pass (scaffold only; one intro video produced).
- No new shared-framework abstractions; reuse `/shared/*` and the established per-course patterns.
- No changes to the existing two courses (additive/surgical only).

---

## 3. IC3 GS6 Level 1 objective traceability

Source: **IC3 GS6 Level 1 — Objective Domains, Certiport (A Pearson VUE business), released 2020-05-14**
(verbatim text in **Appendix A**). The table below maps each sub-area to its content week; the
specific sub-objectives Codex flagged as easy-to-drop are called out explicitly in §5.

| # | Objective domain / area | Week |
|---|---|---|
| **1. Technology Basics** | | |
| 1.1 | Access & navigate between digital environments (OS terms, browsers, accessing/navigating) | W2 |
| 1.2 | Identify digital devices & connections (input, output, cables/connectors) | W1 |
| 1.3 | Fundamental software concepts (applications, proprietary vs open source, installing) | W1 |
| 1.4 | Fundamental hardware concepts (computing devices, memory, data storage) | W1 |
| 1.5 | Fundamental operating system concepts (mobile vs computer OS) | W1 |
| 1.6 | Fundamental networking concepts (connectivity, types, infrastructure, connected?, troubleshooting) | W2 |
| **2. Digital Citizenship** | | |
| 2.1 | Create & manage a digital identity (personal data, PII, privacy/security) | W4 |
| 2.2 | Cultivate/manage/protect digital reputation (permanence, legal/ethical) | W4 |
| 2.3 | Respond to inappropriate content (2.3.1 negative-comm impact, 2.3.2 validity, 2.3.3 anonymity, 2.3.4 nonresponse) | W4 |
| **3. Information Management** | | |
| 3.1 | Use & refine criteria for online searches (define need, relevant vs irrelevant, keep sources) | W2 |
| 3.2 | Search within digital content (find in a file, find on a webpage — Ctrl+F) | W2 |
| 3.3 | Copyright & licensing (public domain, Creative Commons) | W2 |
| **4. Content Creation** | | |
| 4.1 | Create basic documents & presentations *(proficiency)* | W3 |
| 4.2 | Referencing & attribution (define, purpose, locate sources, 4.2.4 implement citation *(proficiency)*) | W3 |
| 4.3 | Save & back up work (when/where, 4.3.2 file management & naming *(proficiency)*) | W3 |
| 4.4 | Fundamental printing concepts (orientation, double-sided, settings, methods) | W3 |
| **5. Communication** | | |
| 5.1 | Express yourself through digital means (where to post, platform guidelines, acceptable-use policies) | W3 |
| 5.2 | Interact with others (5.2.1 implement interactions, 5.2.2 effective vs ineffective, 5.2.3 inclusive language, 5.2.4 email response options) | W3 |
| **6. Collaboration** | | |
| 6.1 | Identify digital collaboration concepts (benefits, synchronous vs asynchronous, review/feedback) | W3 |
| 6.2 | Digital etiquette standards (written, visual) | W3 |
| **7. Safety & Security** | | |
| 7.1 | Describe digital security threats | W4 |
| 7.2 | Protect devices & content (secure passwords, reset password, lock device, clear browser settings) | W4 |
| 7.3 | Data-collection technology (7.3.1–7.3.2 tracking, **7.3.3 stored-on-device risks**, 7.3.4 private browsing) | W4 |
| 7.4 | Health risks (mental, physical/ergonomics) | W4 |

---

## 4. Course structure (4 content weeks + review/testing week)

| Week | Title | Domains | Assessment |
|---|---|---|---|
| **1** | Inside the Computer: Hardware, Devices, Software & OS | 1.2, 1.3, 1.4, 1.5 | **Pre-Test** at session start |
| **2** | Getting Online: Browsers, Networks & Searching | 1.1, 1.6, 3 | — |
| **3** | Creating & Communicating: Documents, Email & Teamwork | 4, 5, 6 | — |
| **4** | Citizenship & Safety: Identity, Privacy & Security | 2, 7 | — |
| **5** | **Review & Testing Day** (recap all domains) | all (review) | **Post-Test** |

**Pacing rationale:** browsing/networking → searching (W2); making content → communicating →
collaborating (W3); responsible & protected digital citizen pairs Citizenship + Safety (W4). The large
Domain 1 receives ~1.5 weeks (all of W1 + part of W2).

---

## 5. Per-week content outline

Each content week = a 16–20 slide `presentation.html`, an instructor `syllabus.html` with a 2-hour
timing breakdown, one guided `*-lab.html`, and one printable `*-quick-reference.html`. Each
presentation ends with a knowledge-check and a handout-prompt slide. **Lab → objective** mappings are
called out so proficiency objectives are demonstrably exercised.

### Week 1 — Inside the Computer *(Pre-Test)*
- **Slides:** input/output devices & ports; cables & connectors (1.2); computing devices
  (desktop/laptop/tablet/phone); memory vs storage (1.4); software — system vs application;
  proprietary vs open source; installing from trusted sources (1.3); operating systems — Windows vs
  macOS vs mobile (1.5).
- **Lab — "Meet Your Computer":** identify ports & peripherals on the lab PC; open *This PC*/*Settings*
  to read RAM & storage; list installed apps; identify the OS and version. *(Exercises 1.2, 1.4, 1.5.)*
- **Quick-ref:** Parts of a computer + ports/connectors card.

### Week 2 — Getting Online
- **Slides:** OS terms & the desktop; web browsers — address bar, tabs, bookmarks, history (1.1);
  accessing & navigating digital environments; networking — wired/Wi-Fi/cellular; routers/modems/ISP;
  "is my device connected?"; basic troubleshooting (1.6); effective searching — define your need,
  judge relevant vs irrelevant results, keep source references (3.1); **Ctrl+F** find-in-page/file
  (3.2); copyright, public domain & Creative Commons (3.3).
- **Lab — "Search & Connect":** browser navigation drills; check Wi-Fi status & signal; a connectivity
  troubleshooting checklist; a guided web-search task with source capture; Ctrl+F practice.
  *(Exercises 1.1, 1.6.5–1.6.6, 3.1.3, 3.2.)*
- **Quick-ref:** Browser + Wi-Fi troubleshooting + smart-search card.

### Week 3 — Creating & Communicating
- **Slides:** create a basic document & a basic presentation (4.1); referencing/attribution &
  citations (4.2); save & back up — where/when, the 3-2-1 idea at a basic level (4.3.1); file
  management & naming conventions (4.3.2); printing — portrait vs landscape, double-sided, common
  settings, print methods (4.4); communication — where/how to post, acceptable-use policies (5.1),
  inclusive language (5.2.3); **email response options** — reply / reply-all / forward / Bcc (5.2.4);
  effective vs ineffective interaction (5.2.2); collaboration — benefits, synchronous vs asynchronous,
  giving feedback (6.1), written & visual etiquette (6.2).
- **Lab — "Make, Save & Share":** create + name + save a document with a good filename; add a simple
  citation; set print options (no printing required); practice email response options on a sample
  thread; a short reply-all etiquette + inclusive-language scenario.
  *(Exercises proficiency objectives 4.1.1, 4.2.4, 4.3.2, 5.2.1, 5.2.3, 5.2.4.)*
- **Quick-ref:** File-naming + print-settings + email-etiquette card.

### Week 4 — Citizenship & Safety
- **Slides:** digital identity — managing personal data, PII, privacy/security (2.1); reputation &
  permanence; legal/ethical behavior (2.2); **responding to inappropriate content** — the impact of
  negative digital communication (2.3.1), assessing the validity of online information (2.3.2), the
  importance of online anonymity (2.3.3), and the value of nonresponse (2.3.4); security threats (7.1);
  **strong passwords/passphrases**, resetting a password, locking a device, clearing browser data
  (7.2); data-collection & tracking, **risks of information stored on a device** (7.3.3), private-mode
  browsing (7.3.4); health risks — mental wellbeing online; physical/ergonomics (7.4).
- **Lab — "Lock It Down":** build a strong passphrase; set a screen lock; clear browser history/cookies
  (7.2.3–7.2.4); open a private window (7.3.4); evaluate a source for validity (2.3.2); a
  privacy/identity self-audit checklist (2.1); a "what's stored on this PC?" check (7.3.3); a
  desk ergonomics check (7.4.2). *(Covers the full 2.3 and 7.3 sub-objective sets.)*
- **Quick-ref:** Password & security checklist + spot-fake-info + ergonomics card.

### Week 5 — Review & Testing Day *(Post-Test)*
- **Review presentation:** a cumulative recap across all 7 domains, delivered as a review game
  (Jeopardy-style categories mapped to the domains) for active engagement.
- **Syllabus:** 2-hour plan — review activity → Post-Test administration → wrap-up/next steps (Level 2
  preview).
- **Cumulative study-guide handout:** one-page-per-domain summary for exam prep (complements
  `study-resources/`).
- **Post-Test:** interactive + printable + optional capture wrapper.

---

## 6. File architecture

A **deliberate hybrid** of the two existing courses (not an exact mirror of either):
- **From `computer-skills`:** the per-week console (`index.html`), the `weeks/week-XX/` layout, and the
  inline slide-engine + `/shared/progress.js` pattern.
- **From `financial-readiness`:** the root **`assessments/`** folder (interactive + printable + form
  wrappers) and the root **`study-resources/`** folder (flashcards + quiz).

```
courses/digital-literacy-1/
├── index.html                       # course console (progressKey "dl1") — ICS pattern
├── syllabus-overview.html           # 5-week outline + IC3 domain map
├── css/
│   └── slides.css                   # course-owned slide styles (seeded from computer-skills)
├── assessments/                     # FR pattern
│   ├── pre-test.html                # interactive self-test (~20 Q across 7 domains)
│   ├── pre-test-printable.html
│   ├── pre-test-form.html           # optional Google-Form embed wrapper (instructor-configured)
│   ├── post-test.html
│   ├── post-test-printable.html
│   └── post-test-form.html
├── study-resources/                 # FR pattern
│   ├── flashcards.html              # key terms across all 7 domains
│   └── quiz.html                    # self-check practice quiz
└── weeks/                           # ICS pattern
    ├── week-01/ (presentation.html, syllabus.html, handouts/meet-your-computer-lab.html, handouts/computer-parts-quick-reference.html)
    ├── week-02/ (… search-connect-lab.html, browser-wifi-quick-reference.html)
    ├── week-03/ (… make-save-share-lab.html, files-print-email-quick-reference.html)
    ├── week-04/ (… lock-it-down-lab.html, security-ergonomics-quick-reference.html)
    └── week-05/ (presentation.html [review game], syllabus.html, handouts/level-1-study-guide.html)

video/digital-literacy-1/            # TOP-LEVEL Remotion source — NOT published by build
├── package.json
├── remotion.config.ts
└── src/ (Root.tsx, Intro.tsx ~2–3 min, components/)
```

**Nesting note (accepted):** handouts sit 5 directory levels deep
(`courses/digital-literacy-1/weeks/week-01/handouts/…`), identical to the existing `computer-skills`
course. This matches what ships and keeps the two courses consistent, at the cost of exceeding the
"3-level" guideline in `CLAUDE.md`. Sibling-course consistency was chosen deliberately.

**Build/deploy note:** `scripts/build-site.js` publishes only
`[index.html, 404.html, courses.json, courses, instructors, shared, assets]` and strips large media.
The Remotion project therefore lives at top-level `video/` (not in the publish list), so its source and
`node_modules` are never deployed. `node_modules/`, `*.mp4`, `*.mp3`, and `dist/` are already
git-ignored. The rendered MP4 is **not** auto-embedded into any course page (offline-first rule, §11) —
it is optional enrichment delivered via a click-out link plus a local transcript.

---

## 7. Assessment design

**All three matched pieces** (per the Financial Readiness pattern), for each of Pre- and Post-Test:

1. **Interactive self-test** (`pre-test.html` / `post-test.html`): ~20 questions sampling all 7
   domains; in-browser, immediate scoring/feedback. Follows the **existing courses' established
   pattern** — a participant-name field plus results saved to `localStorage` so the Post-Test can show
   a pre→post improvement comparison for the student (mirrors
   `courses/computer-skills/weeks/week-01/pre-test.html` and
   `courses/financial-readiness/assessments/pre-test.html`). Results stay on the local machine; nothing
   is transmitted by the self-test itself.
2. **Printable version** (`*-printable.html`): clean print stylesheet for paper administration; the
   instructor answer key is a separate PDF kept out of the student path.
3. **Optional capture wrapper** (`*-form.html`): a thin page embedding an instructor-owned **Google
   Form** (iframe) whose URL the instructor pastes in — the graded-capture path, like FR's
   `assessments/SETUP-GOOGLE-FORMS.md`.

**Question design:** items are written to the IC3 GS6 Level 1 objectives and reviewed for factual
accuracy against Appendix A. Pre- and Post-Test use the same blueprint (parallel forms) so improvement
is measurable. Distribution is roughly proportional to domain size (Technology Basics weighted
highest).

*(Note: FERPA / student-PII handling is **not** a constraint for this project — that rule belongs to a
different project and was removed from this spec in v3.)*

---

## 8. Study resources

- `flashcards.html`: key terms across all domains (device types, OS, RAM vs storage, URL, Wi-Fi, public
  domain, Creative Commons, PII, phishing, passphrase, private browsing, ergonomics, etc.), using the
  established flashcard pattern.
- `quiz.html`: a self-check practice quiz (separate item pool from the graded tests) for exam prep,
  usable on the Week 5 review day.

---

## 9. Homepage / platform wiring (surgical edits, regression-safe)

1. **`courses.json`** — add a `digital-literacy-1` entry: `id`, `title` ("Digital Literacy — Level 1"),
   `subtitle`, `type: "weeks"`, `progressKey: "dl1"`, `category: "Digital Literacy"`, `path`, `entry`,
   `preTest`, `postTest`, a `lessons` array (5 entries), and an **`emphasis`** field
   (e.g. "Hands-on labs"). **Also add an explicit `emphasis` to the two existing entries**
   ("Hands-on labs" for computer-skills, "Planning tools" for financial-readiness) so the render is
   fully data-driven and nothing regresses.
2. **`index.html`** — four small changes:
   - Replace the hardcoded chip line
     `var emphasis = c.id === 'computer-skills' ? 'Hands-on labs' : 'Planning tools';`
     with `var emphasis = c.emphasis || 'Self-paced';` (data-driven, safe fallback).
   - Add a distinct card accent for `data-course-card="digital-literacy-1"` (within the VUB
     navy/red/gold palette).
   - Update the hero proof chip **"2 course tracks" → "3 course tracks."**
   - Genericize the hero subhead currently reading *"Free, self-paced computer and financial-readiness
     courses…"* (`index.html:236`) to a course-count-agnostic line (e.g. "Free, self-paced courses to
     build digital and financial confidence — built to honor those who served.").
3. **`shell.js` / other chrome** — verify nothing else enumerates a fixed course list; update if needed.

---

## 10. Design system & accessibility

- Reuse `/shared/{brand,shell,glossary,progress,text-size,print}.*` for platform chrome, glossary
  tooltips, progress persistence, sitewide text-size control, and print styles.
- Follow the VUB design system in `CLAUDE.md`: navy/patriotic palette, serif display headings, ≥24px
  slide body text, line-height 1.8, visible focus rings, no color-only information.
- **WCAG 2.1 AA:** ≥4.5:1 contrast (normal), ≥3:1 (large), full keyboard navigation (arrows, Page
  Up/Down, Home/End), screen-reader-friendly semantic structure, no auto-advance, 44px+ touch targets,
  `prefers-reduced-motion` respected.
- Slide engine: inline `<script>` per `presentation.html` (nav, keyboard, touch/swipe, progress bar)
  plus `/shared/progress.js` (`VubProgress.saveSlide('dl1', week, slide, total)`); per-card and
  course-level progress on the console, mirroring `computer-skills/index.html`.

---

## 11. Quality gates & testing

- **Factual accuracy:** every concept traces to the IC3 GS6 Level 1 objective domains (§3 + Appendix A);
  Windows/OS steps verified against current Windows behavior.
- **Accessibility review:** run the `accessibility-reviewer` agent on built pages; fix CRITICAL/HIGH.
- **Code review:** run the `code-reviewer` agent on new HTML/JS/wiring; fix CRITICAL/HIGH.
- **Automated checks — including the catalog test that currently hardcodes two courses:**
  - `tests/content/homepage-catalog.spec.js` currently asserts `toHaveCount(2)` and checks the two
    course headings by name (`tests/content/homepage-catalog.spec.js:5`). **Update it to derive the
    expected count from `courses.json`** (read the JSON, assert one `[data-course-card]` per entry)
    rather than hardcoding a number, so the catalog stays self-validating as courses are added.
  - Keep the existing **"zero external CDN dependencies (offline-capable)"** assertion green — the intro
    video must NOT introduce an auto-loading external request on any tested page (§6, §12).
  - Add coverage for the new course: console route (incl. no-trailing-slash), slide nav, `dl1` progress
    persistence, pre/post-test load + scoring.
  - Run `npm run build:site`, `npm run links` (0 broken), `npm test` (all pass).
- **Manual verification:** slide navigation (all input methods), progress save/resume, print preview of
  printable test + quick-refs, homepage card + links resolve, mobile 390px no overflow.
- **Secret gate:** secret scan (paths/key-names only) before each commit.

---

## 12. Build sequence (phased — verify each phase before the next)

1. **Scaffold & wiring** — create `courses/digital-literacy-1/` skeleton, `css/slides.css`, add the
   `courses.json` entry **and `emphasis` on all three entries**, apply the four `index.html` edits,
   and update the catalog test to be data-derived → verify the third card renders, links resolve,
   build/links/tests pass (catalog + offline-CDN tests green).
2. **Assessments** — Pre/Post interactive + printable + form wrappers, parallel-form blueprint,
   matching the existing courses' name + `localStorage` pre/post comparison → verify scoring, print,
   links.
3. **Content weeks 1–4** — presentations + syllabi → verify slide engine, `dl1` progress, knowledge
   checks, and per-week sub-objective coverage against §3/Appendix A.
4. **Labs & quick-references** — per-week guided labs (exercising the proficiency objectives) +
   printable cards → verify steps against Windows.
5. **Week 5 review day** — review-game presentation + syllabus + study guide.
6. **Study resources** — flashcards + practice quiz.
7. **Remotion intro video (optional enrichment)** — scaffold project, author `Intro.tsx`, render MP4
   locally. Deliver as: (a) a **local transcript/summary** handout (offline, core), and (b) an optional
   **click-out "Watch the intro" link** to YouTube once the user uploads it (no auto-loading iframe on
   tested pages). A failed render does not block the course.
8. **Tests, reviews & docs** — extend Playwright, run a11y + code review, update `CLAUDE.md` course
   list + `MEMORY/state.json`; commit per logical layer with the secret gate.

Commits follow the repo convention (one per logical layer; `type(scope): …` messages; secret scan
before each; no co-author trailer, matching repo history).

---

## 13. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Content drifts from real IC3 objectives | Traceability (§3) + verbatim Appendix A; review each week against it. |
| Sub-objectives silently dropped (e.g. 2.3.1/2.3.3/2.3.4, 7.3.3) | Per-week sub-objective call-outs (§5); coverage check in Phase 3. |
| Homepage third-card / `emphasis` regression | `emphasis` on all three entries + `c.emphasis \|\| default`; explicit accent; genericized hero copy (§9). |
| Catalog test hardcodes 2 cards → breaks on add | Rewrite test to derive count from `courses.json` (§11). |
| Intro video breaks offline-first / CDN test | Video is optional enrichment: local transcript + click-out link, never an auto-loading embed (§6, §11, §12). |
| Remotion render toolchain heavy/fragile on Windows | Scaffold + composition are the committed deliverable; render attempted but non-blocking; MP4 git-ignored + external-hosted. |
| Deep `handouts/` nesting vs 3-level guideline | Accepted for sibling-course consistency; documented (§6). |
| Windows directory-move hazard (prior incident) | Create new dirs directly; avoid PowerShell `Move-Item` for directory moves. |

---

## 14. Open items for the user (post-spec)
- **YouTube video ID** for the intro explainer (after you upload the rendered MP4) — used only for the
  optional click-out link.
- **Google Form URLs** for the optional Pre/Post capture wrappers (instructor-configured; can ship with
  a placeholder + instructions like FR's `assessments/SETUP-GOOGLE-FORMS.md`).
- **Class dates** (optional): ship date-agnostic (instructor fills the schedule) or with specific Monday
  dates if you provide a start date.

---

## 15. Source

IC3 GS6 Level 1 — Objective Domains, **Certiport / Pearson VUE**, released 2020-05-14. Retrieved from
Prodigy Learning's published copy:
`https://www.prodigylearning.com/wp-content/uploads/2022/05/IC3_GS6_Level_1_Exam_Domains.pdf`
(cross-checked against certiport.pearsonvue.com and cteresource.org). **Appendix A reproduces the
official objective text verbatim.** The §3 table uses readable summaries of that text for planning;
Appendix A is the authoritative reference for coverage audits.

---

## Appendix A — IC3 GS6 Level 1 objective domains (verbatim)

> Source: Certiport, *IC3 GS6 Level 1 — Objective Domains*, © 2020 Certiport, Inc., released
> 2020-05-14. Reproduced for curriculum-alignment auditing.

**1. Technology Basics**
- 1.1 Access and navigate between digital environments
  - 1.1.1 Recognize operating system terms and concepts
  - 1.1.2 Explain basic functions of web browsers
  - 1.1.3 Explain processes and requirements for accessing digital environments
  - 1.1.4 Explain methods of navigating between digital environments
- 1.2 Identify digital devices and connections
  - 1.2.1 Identify input devices
  - 1.2.2 Identify output devices
  - 1.2.3 Identify cables, connectors, and connections
- 1.3 Explain fundamental software concepts
  - 1.3.1 Explain basic software application concepts
  - 1.3.2 Compare and contrast proprietary and open source software
  - 1.3.3 Describe processes for installing software from online sources
- 1.4 Explain fundamental hardware concepts
  - 1.4.1 Describe concepts related to computing devices
  - 1.4.2 Describe concepts related to memory
  - 1.4.3 Describe concepts related to data storage
- 1.5 Explain fundamental operating system concepts
  - 1.5.1 Compare and contrast features of mobile device operating systems
  - 1.5.2 Compare and contrast features of computer operating systems
- 1.6 Explain fundamental networking concepts
  - 1.6.1 Describe network connectivity concepts
  - 1.6.2 Describe online connectivity concepts
  - 1.6.3 Compare and contrast network and connection types
  - 1.6.4 Describe networking infrastructure
  - 1.6.5 Identify whether a device is connected
  - 1.6.6 Describe basic network troubleshooting techniques

**2. Digital Citizenship**
- 2.1 Create and manage a digital identity
  - 2.1.1 Explain how to manage personal data online
  - 2.1.2 Explain how to manage personally identifiable information
  - 2.1.3 Explain how to maintain digital privacy and security
- 2.2 Cultivate, manage, and protect your digital reputation
  - 2.2.1 Recognize the permanence of actions in the digital world
  - 2.2.2 Recognize legal and ethical behavior when using technology
- 2.3 Respond to inappropriate digital behavior and content
  - 2.3.1 Explain the impact of negative digital communication
  - 2.3.2 Assess the validity of online information
  - 2.3.3 Explain the importance of online anonymity
  - 2.3.4 Explain the value of nonresponse to negative communication

**3. Information Management**
- 3.1 Use and refine criteria for online searches
  - 3.1.1 Define the information required to complete a given task
  - 3.1.2 Distinguish between relevant and irrelevant search results
  - 3.1.3 Collect and retain source reference information for search and research results
- 3.2 Understand methods for searching within digital content
  - 3.2.1 Explain features that enable you to locate information in a file
  - 3.2.2 Explain features that enable you to locate information on a webpage
- 3.3 Understand copyright and licensing restrictions for digital content
  - 3.3.1 Explain the basics of public domain content
  - 3.3.2 Explain the basics of Creative Commons content

**4. Content Creation**
- 4.1 Create basic documents and presentations
  - 4.1.1 Display proficiency in creating basic documents
  - 4.1.2 Display proficiency in creating basic presentations
- 4.2 Understand accepted referencing and attribution practices
  - 4.2.1 Define referencing and attribution
  - 4.2.2 Explain the purpose of referencing and attribution
  - 4.2.3 Locate online referencing and attribution sources
  - 4.2.4 Implement appropriate online citations in a given document
- 4.3 Save and back up work
  - 4.3.1 Determine how, when and where to back up data in a typical digital work setting
  - 4.3.2 Implement file management principles and naming conventions
- 4.4 Understand fundamental printing concepts
  - 4.4.1 Describe portrait vs landscape orientation
  - 4.4.2 Describe double-sided printing
  - 4.4.3 Explain common print settings
  - 4.4.4 Explain printing methods

**5. Communication**
- 5.1 Express yourself through digital means
  - 5.1.1 Know where you can post or share in the digital world
  - 5.1.2 Be aware of platform-specific guidelines for posting and sharing
  - 5.1.3 Understand and follow acceptable use policies for posting and sharing
- 5.2 Interact with others in a digital environment
  - 5.2.1 Implement digital interactions in a given digital technology
  - 5.2.2 Differentiate between effective and ineffective digital interaction methods
  - 5.2.3 Demonstrate the use of inclusive language
  - 5.2.4 Differentiate among email response options

**6. Collaboration**
- 6.1 Identify digital collaboration concepts
  - 6.1.1 Identify the benefits of digital collaboration
  - 6.1.2 Define synchronous and asynchronous communications
  - 6.1.3 Identify methods to review work and provide feedback to peers
- 6.2 Identify digital etiquette standards for collaborative processes
  - 6.2.1 For written digital collaboration
  - 6.2.2 For visual digital collaboration

**7. Safety and Security**
- 7.1 Describe digital security threats
- 7.2 Protect devices and digital content
  - 7.2.1 Identify features of secure passwords
  - 7.2.2 Identify when and how to reset a password
  - 7.2.3 Identify when and how to lock a device
  - 7.2.4 Explain how to clear saved browser settings
- 7.3 Be aware of data-collection technology
  - 7.3.1 Describe how navigation tracking works
  - 7.3.2 Describe security concerns related to navigation tracking
  - 7.3.3 Describe security concerns related to storing information on a device
  - 7.3.4 Describe the benefits of private mode browsing
- 7.4 Identify health risks associated with the use of digital technologies
  - 7.4.1 Identify mental health risks associated with online technologies
  - 7.4.2 Identify physical health threats associated with computer and device usage
