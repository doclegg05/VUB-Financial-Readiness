# Design Spec — Digital Literacy: Level 1 (IC3 GS6-aligned)

**Date:** 2026-06-24
**Author:** Britt Legg (PM) + Claude Code
**Status:** Approved design → ready for implementation planning
**Course id:** `digital-literacy-1` · **Progress key:** `dl1` · **Catalog category:** Digital Literacy

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
  domains** (Certiport, released 2020-05-14). The public title is **"Digital Literacy — Level 1"** to
  avoid implying official Certiport certification while preserving the IC3 progression.
- **Knowledge-based cert, hands-on course:** the IC3 GS6 Level 1 exam is knowledge-based
  ("Explain / Identify / Describe / Recognize"), not a hands-on software exam. This course keeps the
  cert's knowledge objectives accurate **and adds guided hands-on labs** on the lab PCs to cement the
  concepts (andragogy: experiential, problem-centered).
- **Additive & non-destructive:** the existing two courses, shared chrome, and build are not modified
  except for small, surgical homepage-wiring edits (Section 9).

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
2. Complete, **provable** coverage of all 7 IC3 GS6 Level 1 objective domains (traceability in §3).
3. Pre-Test (Week 1) and Post-Test (Week 5), each as interactive self-test + printable + optional
   instructor-controlled capture.
4. Per-week **guided hands-on labs** + printable quick-references + in-browser knowledge checks.
5. One **Remotion** course-intro explainer video (~2–3 min), scaffolded for per-week videos later.
6. The course appears as a third card on the homepage catalog, data-driven via `courses.json`.

### Non-goals (YAGNI)
- No official Certiport certification, exam voucher, or proctoring integration.
- No Level 2 / Level 3 content this pass (future courses).
- No per-week videos this pass (scaffold only; one intro video produced).
- No new shared-framework abstractions; reuse `/shared/*` and the established per-course patterns.
- No student PII stored in the repository (see §7 FERPA note).

---

## 3. IC3 GS6 Level 1 objective traceability (authoritative)

Source: **IC3 GS6 Level 1 — Objective Domains, Certiport (A Pearson VUE business), released 2020-05-14.**
Every numbered objective maps to exactly one content week (W5 is review of all).

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
| 2.3 | Respond to inappropriate digital behavior/content (impact, validity of info, anonymity, nonresponse) | W4 |
| **3. Information Management** | | |
| 3.1 | Use & refine criteria for online searches (define need, relevant vs irrelevant, keep sources) | W2 |
| 3.2 | Search within digital content (find in a file, find on a webpage — Ctrl+F) | W2 |
| 3.3 | Copyright & licensing (public domain, Creative Commons) | W2 |
| **4. Content Creation** | | |
| 4.1 | Create basic documents & presentations | W3 |
| 4.2 | Referencing & attribution (define, purpose, locate sources, cite in a document) | W3 |
| 4.3 | Save & back up work (when/where to back up, file management & naming conventions) | W3 |
| 4.4 | Fundamental printing concepts (orientation, double-sided, settings, methods) | W3 |
| **5. Communication** | | |
| 5.1 | Express yourself through digital means (where to post, platform guidelines, acceptable-use policies) | W3 |
| 5.2 | Interact with others (digital interactions, effective vs ineffective, inclusive language, email response options) | W3 |
| **6. Collaboration** | | |
| 6.1 | Identify digital collaboration concepts (benefits, synchronous vs asynchronous, review/feedback) | W3 |
| 6.2 | Digital etiquette standards (written, visual) | W3 |
| **7. Safety & Security** | | |
| 7.1 | Describe digital security threats | W4 |
| 7.2 | Protect devices & content (secure passwords, reset password, lock device, clear browser settings) | W4 |
| 7.3 | Data-collection technology (tracking, security concerns, private browsing) | W4 |
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
presentation ends with a knowledge-check and a handout-prompt slide.

### Week 1 — Inside the Computer *(Pre-Test)*
- **Slides:** input/output devices & ports; cables & connectors; computing devices (desktop/laptop/
  tablet/phone); memory vs storage; software (system vs application; proprietary vs open source;
  installing from trusted sources); operating systems (Windows vs macOS vs mobile).
- **Lab — "Meet Your Computer":** identify ports & peripherals on the lab PC; open *This PC*/*Settings*
  to read RAM & storage; list installed apps; identify the OS and version.
- **Quick-ref:** Parts of a computer + ports/connectors card.

### Week 2 — Getting Online
- **Slides:** OS terms & the desktop; web browsers (address bar, tabs, bookmarks, history); accessing &
  navigating digital environments; networking (wired/Wi-Fi/cellular; routers/modems/ISP; "is my device
  connected?"; basic troubleshooting); effective searching (define your need, judge relevant vs
  irrelevant results, keep source references); **Ctrl+F** find-in-page/file; copyright, public domain &
  Creative Commons.
- **Lab — "Search & Connect":** browser navigation drills; check Wi-Fi status & signal; a connectivity
  troubleshooting checklist; a guided web-search task with source capture; Ctrl+F practice.
- **Quick-ref:** Browser + Wi-Fi troubleshooting + smart-search card.

### Week 3 — Creating & Communicating
- **Slides:** create a basic document & a basic presentation; referencing/attribution & citations; save
  & back up (where/when, the 3-2-1 idea at a basic level); file management & naming conventions;
  printing (portrait vs landscape, double-sided, common print settings, print methods); communication
  (where/how to post, acceptable-use policies, inclusive language; **email response options** —
  reply / reply-all / forward / Bcc); collaboration (benefits, synchronous vs asynchronous, giving
  feedback, written & visual etiquette).
- **Lab — "Make, Save & Share":** create + name + save a document with a good filename; set print
  options (no printing required); practice email response options on a sample thread; a short
  reply-all etiquette scenario.
- **Quick-ref:** File-naming + print-settings + email-etiquette card.

### Week 4 — Citizenship & Safety
- **Slides:** digital identity (managing personal data, PII, privacy/security); reputation &
  permanence; legal/ethical behavior; responding to inappropriate content; assessing the validity of
  online information; security threats; **strong passwords/passphrases**, resetting a password, locking
  a device, clearing browser data; data-collection & tracking, private-mode browsing; health risks
  (mental wellbeing online; physical/ergonomics).
- **Lab — "Lock It Down":** build a strong passphrase; set a screen lock; clear browser history/cookies;
  open a private window; evaluate a source for validity; a privacy/identity self-audit checklist; a
  desk ergonomics check.
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

Mirrors the sibling `courses/computer-skills/` layout exactly for maintainability.

```
courses/digital-literacy-1/
├── index.html                       # course console (progressKey "dl1")
├── syllabus-overview.html           # 5-week outline + IC3 domain map
├── css/
│   └── slides.css                   # course-owned slide styles (seeded from computer-skills)
├── assessments/
│   ├── pre-test.html                # interactive local self-test (~20 Q across 7 domains)
│   ├── pre-test-printable.html
│   ├── pre-test-form.html           # optional Google-Form embed wrapper (instructor-configured)
│   ├── post-test.html
│   ├── post-test-printable.html
│   └── post-test-form.html
├── study-resources/
│   ├── flashcards.html              # key terms across all 7 domains
│   └── quiz.html                    # self-check practice quiz
└── weeks/
    ├── week-01/
    │   ├── presentation.html
    │   ├── syllabus.html
    │   └── handouts/
    │       ├── meet-your-computer-lab.html
    │       └── computer-parts-quick-reference.html
    ├── week-02/  (search-connect-lab.html, browser-wifi-quick-reference.html)
    ├── week-03/  (make-save-share-lab.html, files-print-email-quick-reference.html)
    ├── week-04/  (lock-it-down-lab.html, security-ergonomics-quick-reference.html)
    └── week-05/
        ├── presentation.html        # review-game recap
        ├── syllabus.html
        └── handouts/
            └── level-1-study-guide.html

video/digital-literacy-1/            # TOP-LEVEL Remotion source — NOT published by build
├── package.json
├── remotion.config.ts
└── src/
    ├── Root.tsx
    ├── Intro.tsx                     # ~2–3 min Level 1 overview composition
    └── components/
```

**Nesting note (accepted):** handouts sit 5 directory levels deep
(`courses/digital-literacy-1/weeks/week-01/handouts/…`), identical to the existing `computer-skills`
course. This matches what ships and keeps the two courses consistent, at the cost of exceeding the
"3-level" guideline in `CLAUDE.md`. Sibling-course consistency was chosen deliberately.

**Build/deploy note:** `scripts/build-site.js` publishes only
`[index.html, 404.html, courses.json, courses, instructors, shared, assets]` and strips large media.
The Remotion project therefore lives at top-level `video/` (not in the publish list), so its source and
`node_modules` are never deployed. `node_modules/`, `*.mp4`, `*.mp3`, and `dist/` are already
git-ignored.

---

## 7. Assessment design

**All three matched pieces** (per the Financial Readiness pattern), for each of Pre- and Post-Test:

1. **Interactive local self-test** (`pre-test.html` / `post-test.html`): ~20 questions sampling all 7
   domains; in-browser, immediate scoring/feedback; **no data transmitted** (localStorage only).
2. **Printable version** (`*-printable.html`): clean print stylesheet for paper administration; an
   instructor answer key is kept out of the student path (PDF alongside, like FR).
3. **Optional capture wrapper** (`*-form.html`): a thin page embedding a **Google Form** (iframe) whose
   URL the instructor pastes in. This is the only graded-capture path and it is instructor-owned.

**Question design:** items are written to the IC3 GS6 Level 1 objectives and reviewed for factual
accuracy against the objective domains. Pre- and Post-Test use the same blueprint (parallel forms) so
improvement is measurable. Distribution roughly proportional to domain size (Technology Basics weighted
highest).

**FERPA / PII (hard constraint):** **no student PII is ever stored in the repository.** The interactive
self-test is local-only; the printable leaves data on paper with the instructor; graded capture goes to
an instructor-controlled Google Form, never to repo code or a tracked datastore. No cloud-LLM use on any
student data.

---

## 8. Study resources

- `flashcards.html`: key terms across all domains (device types, OS, RAM vs storage, URL, Wi-Fi, public
  domain, Creative Commons, PII, phishing, passphrase, private browsing, ergonomics, etc.), using the
  established flashcard pattern.
- `quiz.html`: a self-check practice quiz (separate item pool from the graded tests) for exam prep,
  usable on the Week 5 review day.

---

## 9. Homepage / platform wiring (surgical edits)

1. **`courses.json`** — add a `digital-literacy-1` entry: `id`, `title` ("Digital Literacy — Level 1"),
   `subtitle`, `type: "weeks"`, `progressKey: "dl1"`, `category: "Digital Literacy"`, `path`, `entry`,
   `preTest`, `postTest`, a `lessons` array (5 entries), and a new **`emphasis`** field
   (e.g. "Hands-on labs").
2. **`index.html`** — three small changes:
   - Replace the hardcoded chip line
     `var emphasis = c.id === 'computer-skills' ? 'Hands-on labs' : 'Planning tools';`
     with a **data-driven** read of `c.emphasis` (fallback to a sensible default). This removes a
     two-course assumption and is required for the third card to render correctly.
   - Add a distinct card accent for `data-course-card="digital-literacy-1"` (within the VUB
     navy/red/gold palette).
   - Update the hero proof chip **"2 course tracks" → "3 course tracks."**
3. **`shell.js` / tests** — verify nothing else enumerates a fixed course list; update any
   course-enumerating test fixtures (see §11).

All edits are additive/parameterizing; no existing course behavior changes.

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

- **Factual accuracy:** every concept traces to the IC3 GS6 Level 1 objective domains (cited §3);
  Windows/OS steps verified against current Windows behavior.
- **Accessibility review:** run the `accessibility-reviewer` agent on built pages; fix CRITICAL/HIGH.
- **Code review:** run the `code-reviewer` agent on new HTML/JS/wiring; fix CRITICAL/HIGH.
- **Automated checks:** extend `tests/content` + `tests/functional` (Playwright) to cover the new
  course (console route, slide nav, progress persistence, pre/post-test load, no-trailing-slash route);
  run `npm run build:site`, `npm run links` (0 broken), `npm test` (all pass).
- **Manual verification:** slide navigation (all input methods), progress save/resume, print preview of
  printable test + quick-refs, homepage card + links resolve, mobile 390px no overflow.
- **Secret/PII gate:** secret scan (paths/key-names only) before each commit; confirm zero student PII
  in the repo.

---

## 12. Build sequence (phased — verify each phase before the next)

1. **Scaffold & wiring** — create `courses/digital-literacy-1/` skeleton, `css/slides.css`, add
   `courses.json` entry, apply the three `index.html` edits → verify the third card renders and all
   links resolve; build/links pass.
2. **Assessments** — Pre/Post interactive + printable + form wrappers, with parallel-form blueprint →
   verify scoring, print, no PII.
3. **Content weeks 1–4** — presentations + syllabi → verify slide engine, progress key `dl1`,
   knowledge checks.
4. **Labs & quick-references** — per-week guided labs + printable cards → verify steps against Windows.
5. **Week 5 review day** — review-game presentation + syllabus + study guide.
6. **Study resources** — flashcards + practice quiz.
7. **Remotion intro video** — scaffold project, author `Intro.tsx`, render MP4 locally; wire a YouTube
   embed with a placeholder ID (user uploads, then supplies the real ID).
8. **Tests, reviews & docs** — extend Playwright, run a11y + code review, update `CLAUDE.md` course
   list + `MEMORY/state.json`; commit per logical layer with the secret gate.

Commits follow the repo convention (one per logical layer; conventional-commit messages; secret scan
before each).

---

## 13. Risks & mitigations

| Risk | Mitigation |
|---|---|
| Content drifts from real IC3 objectives | Traceability table (§3) bound to the official PDF; review each week's slides against it. |
| Student PII leakage (FERPA) | Local-only interactive tests; capture only via instructor-owned Google Form; secret/PII gate before commits. |
| Homepage third-card assumptions (`emphasis` binary) | Make `emphasis` data-driven; add explicit accent; update tests. |
| Remotion render toolchain (npm install, headless Chromium/ffmpeg) heavy/fragile on Windows | Scaffold + composition are the committed deliverable; rendering attempted locally, but a failed render does not block the course; MP4 is git-ignored and YouTube-hosted regardless. |
| Deep `handouts/` nesting vs 3-level guideline | Accepted for sibling-course consistency; documented (§6). |
| Windows directory-move hazard (prior incident) | Create new dirs directly; avoid PowerShell `Move-Item` for directory moves. |

---

## 14. Open items for the user (post-spec)
- **YouTube video ID** for the intro explainer (after you upload the rendered MP4).
- **Google Form URLs** for the optional Pre/Post capture wrappers (instructor-configured; can ship with
  a clear placeholder + instructions, like FR's `SETUP-GOOGLE-FORMS.md`).
- **Class dates** (optional): the course can ship date-agnostic (instructor fills the schedule) or with
  specific Monday dates if you provide a start date.

---

## 15. Source

IC3 GS6 Level 1 — Objective Domains, **Certiport / Pearson VUE**, released 2020-05-14. Retrieved from
Prodigy Learning's published copy:
`https://www.prodigylearning.com/wp-content/uploads/2022/05/IC3_GS6_Level_1_Exam_Domains.pdf`
(cross-checked against certiport.pearsonvue.com and cteresource.org). The seven domains and their
numbered objectives in §3 are transcribed verbatim from this document.
