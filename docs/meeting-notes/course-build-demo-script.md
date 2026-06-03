# Demo Script: Explaining How The VUB Course Was Built

## Purpose

Use this script if Alison asks, "Can you show me how it works?" The goal is to explain the system clearly without getting buried in code.

## Setup Before The Meeting

Have these ready:

- Course homepage open in a browser.
- One lesson presentation ready.
- One handout ready.
- One instructor guide ready.
- One assessment page or Google Form ready.
- Meeting notes folder open with the agenda and brief.

## 1. Start With The Big Picture

Say:

"This is easiest to understand as a small course website. The course website launches the lessons, handouts, instructor guides, assessments, and reports. Some assessments are custom HTML pages, and some use Google Forms when we need centralized data."

Show:

- Course launch page.
- Navigation links to lessons, handouts, and assessments.

Key point:

The website is the classroom launchpad.

## 2. Show A Lesson Presentation

Say:

"Each lesson is a browser-based presentation. It is not PowerPoint. It is an HTML page styled to work like a slide deck."

Show:

- Slide title.
- Previous/next controls.
- Progress bar or slide number.
- Chapter/section navigation if visible.

Mention:

- Large readable text.
- Keyboard navigation.
- No required internet for static lesson pages.
- Can be projected in class or opened by students individually.

## 3. Show A Handout

Say:

"The handouts are also web pages or PDFs. We made them printable because the students benefit from having paper beside the computer."

Show:

- One quick reference handout.
- One workshop or checklist handout.

Mention:

- Print-friendly layout.
- Step-by-step instructions.
- Large fonts and clear sections.
- Designed for older adult learners.

## 4. Show An Instructor Guide

Say:

"The instructor guides are there so another instructor can teach the lesson without having to reverse-engineer the slides."

Show:

- Timing blocks.
- Learning objectives.
- Materials list.
- Instructor notes.
- Assessment notes.

Mention:

- The guide connects the slide deck to classroom pacing.
- It documents what to prepare before class.
- It reduces dependence on one instructor.

## 5. Explain The Custom HTML Report

Say:

"For the computer skills course, the pre-test and post-test can score inside the browser. The page calculates the score, breaks it down by category, and can print a report."

Show:

- Assessment page.
- Results section if available.
- Print Report button.

Explain:

- The score is calculated by JavaScript.
- The report is an HTML section designed for printing.
- The browser print dialog saves it as a PDF.
- This is good for individual feedback.

Important caution:

"This local report is not the best statewide data system because the results live on that machine unless we collect them."

## 6. Explain Google Forms Reporting

Say:

"For statewide reporting, Google Forms and Sheets are the better path. Students submit through Forms, and every response lands in a Sheet."

Show:

- Google Form or embedded Form page.
- Response Sheet if appropriate.
- Setup document if needed.

Explain:

- Forms collect answers centrally.
- Sheets become the source of truth.
- Reports can summarize by location, cohort, instructor, date, or category.
- Apps Script can create repeatable Forms from the same question bank.

## 7. Explain The Build Process

Say:

"The process starts with curriculum design, not technology. We define the audience, the outcomes, the lesson flow, and what we need to measure. Then we build the web pages and reporting tools around that."

Cover:

- Audience and goals.
- Weekly/module map.
- Slides.
- Handouts.
- Assessments.
- Instructor guides.
- Reporting.
- Testing.
- Hosting and offline backup.

## 8. Close With The Recommendation

Say:

"If you want to recreate this for other areas of the state, I would start with the Google Forms and Sheets model. The course website can still be the launchpad, but the Sheet should be the reporting source of truth."

Then ask:

- "Do you need individual reports, aggregate reports, or both?"
- "Do you need results by county, site, instructor, or cohort?"
- "Would a sample pre/post report template help?"

## If Alison Asks About AI

Say:

"AI helped speed up drafting and production, especially for slide structure, handouts, assessment wording, and code. It did not replace instructor judgment. I still reviewed the content, corrected it, and adapted it for the VUB audience."

## If Alison Asks Whether This Is Hard To Maintain

Say:

"The easiest version to maintain is a template: one folder structure, one design system, one Form setup script, and one reporting Sheet. The more custom the reports become, the more technical maintenance they need."

## Suggested Closing

"The main thing to decide is the reporting goal. Once we know what report Alison needs, we can choose the simplest tool: Google Sheets for centralized reports, custom PDFs for student handouts, or both."

