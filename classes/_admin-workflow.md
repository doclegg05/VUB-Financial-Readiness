# Admin Workflow — Processing a New Test Submission

When a Netlify Forms email arrives from `intake.html`:

## 1. Download

- Open Netlify dashboard → Forms → `instructor-intake`
- Download the uploaded Word/PDF file
- Note the cohort label (e.g., "Spring 2026 — Beckley")

## 2. Pick the slug

Convention: `<course-slug>-<season-year>-<location>`
- `computer-skills-spring-2026-beckley`
- `financial-readiness-fall-2026-charleston`

Lowercase, hyphenated, no spaces. This becomes the URL.

## 3. Extract questions (Codex)

Open Codex and feed the Word file. Use the prompt template at
`../assessment-service-kit/vibe-code-prompt-pack.md` to extract:
- Question text + 4 options + correct answer
- Category for each question (must match across pre/post)
- Pre vs. post designation

Output: a filled-in `question-bank-template.json`.

## 4. Generate the test HTML

- Copy `../assessment-service-kit/assessment-template.html`
- Paste into `classes/<slug>/pre-test.html` (and `post-test.html` if both)
- Replace the `CONFIG` block at the top with values from the question bank
- Verify scoring, category breakdown, and PDF print preview

## 5. Add a class card

Edit `classes/index.html` and add a `<article class="class-card">` block for
the new cohort (copy the existing one as a template). Update title, cohort
label, dates, and the `href` to `<slug>/`.

## 6. Create the class landing page

- Copy `classes/computer-skills-spring-2026-beckley/index.html` as a template
- Update headline, cohort eyebrow, dates, and the two test `<a href>` targets
  to point at `pre-test.html` and `post-test.html` in the same folder

## 7. Test before sending

- Open `classes/<slug>/` locally and walk through both tests end-to-end
- Click **Print PDF Report** on each to confirm the report renders cleanly
- Check the class link works on mobile

## 8. Reply to the instructor

Send the class URL, the instructor's name confirmation, and a short note about
when to take pre-test (Week 1) and post-test (final week). Mention that
students must click **Print PDF Report** at the end.

---

## Notes

- **No student data is stored.** All results live on the student's device until
  they print the report. Instructors collect printed reports for grant records.
- **Class links are unlisted, not private.** `classes/index.html` has
  `noindex` so search engines skip it, but anyone with a direct URL can view.
  If a cohort needs real privacy, host the class folder on a separate Netlify
  site with basic-auth password protection.
- **Word file storage.** Submissions live in Netlify Forms for 30 days by
  default. Download anything you want to keep long-term.
