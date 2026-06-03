# Vibe-Code Prompt Pack

Use these prompts with an AI coding assistant when building a new assessment package. Paste the relevant project files first, especially `assessment-template.html`, `question-bank-template.json`, and the completed build brief.

## Prompt 1: Convert Intake To Build Brief

```text
You are helping me build a VUB assessment reporting package.

Use this client intake to create a concise build brief:

[PASTE CLIENT INTAKE]

Return:
- Program/course name
- Assessment purpose
- Report fields
- Categories
- Question count plan
- CONFIG values for the HTML template
- Open questions I must confirm before coding
```

## Prompt 2: Draft A Question Bank

```text
Create a JSON question bank for this assessment package.

Requirements:
- Plain language for adult learners
- Multiple choice, 4 choices per question
- One correct answer per question
- Categories must match the build brief
- Include practical workplace/classroom scenarios
- Avoid trick questions
- Keep questions measurable and audit-friendly

Build brief:
[PASTE BUILD BRIEF]

Use this JSON shape:
[PASTE question-bank-template.json]
```

## Prompt 3: Review Questions For Quality

```text
Review this assessment question bank.

Check for:
- Ambiguous wording
- More than one plausible correct answer
- Questions that do not match the category
- Questions that are too hard or too easy
- Inconsistent answer style
- Sensitive or unnecessary personal information
- Problems for older adult learners

Return a table with issue, question number, risk, and suggested revision.

Question bank:
[PASTE QUESTION BANK]
```

## Prompt 4: Build The Pre-Test HTML

```text
Update this assessment HTML template for the pre-test.

Rules:
- Keep it self-contained.
- Do not add external CDN dependencies.
- Preserve the print report behavior.
- Use the approved question bank exactly unless a syntax fix is required.
- Set assessmentType to "pre".
- Use a stable storageKey for this course.
- Keep report language professional and audit-ready.

Build brief:
[PASTE BUILD BRIEF]

Question bank:
[PASTE APPROVED QUESTION BANK]

HTML template:
[PASTE assessment-template.html]
```

## Prompt 5: Build The Post-Test HTML

```text
Create the post-test HTML from the same template.

Rules:
- Keep the same storageKey as the pre-test.
- Set assessmentType to "post".
- Keep categories aligned with the pre-test.
- Show pre/post comparison when matching pre-test data exists.
- If no pre-test data exists, the report should still print cleanly without comparison.

Build brief:
[PASTE BUILD BRIEF]

Post-test question bank:
[PASTE APPROVED QUESTION BANK]

HTML template:
[PASTE assessment-template.html OR PRE-TEST HTML]
```

## Prompt 6: Verify Scoring

```text
Audit this assessment file for scoring/report risks.

Check:
- Correct answers in the question bank
- Score calculation
- Category breakdown calculation
- Print report fields
- Pre/post localStorage matching
- Accessibility issues
- Any external dependencies
- Any hard-coded client values that should be configurable

Return only findings with file references and fixes.

HTML:
[PASTE HTML]
```

## Prompt 7: Create Instructor Directions

```text
Write one-page instructor directions for this assessment package.

Audience:
VUB instructors who may not be technical.

Include:
- How to open the test
- How students complete it
- How to print or save the report as PDF
- What to do for pre-test and post-test
- What to do if the post-test cannot find pre-test results
- What files to retain for records
- Privacy reminder

Build brief:
[PASTE BUILD BRIEF]
```

## Prompt 8: Create A Client Summary

```text
Write a concise delivery summary for the coordinator.

Include:
- What was built
- What reports include
- How this supports grant/audit records
- What instructors need to do
- Recommended next step for rollout

Tone:
Professional, clear, not overly technical.
```
