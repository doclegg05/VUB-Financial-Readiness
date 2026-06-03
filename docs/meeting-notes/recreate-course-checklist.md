# Checklist: How To Recreate A Course Like The VUB Courses

## Purpose

Use this as a practical build checklist for recreating a course like the VUB Intermediate Computer Skills or Financial Readiness courses.

## Phase 1: Define The Course

- [ ] Name the course.
- [ ] Define the target audience.
- [ ] Identify what students already know.
- [ ] Identify what students should be able to do by the end.
- [ ] Decide course length: weeks, modules, or one-day workshop.
- [ ] Decide whether the course must work offline.
- [ ] Decide whether students need printed materials.
- [ ] Decide what data must be reported.

## Phase 2: Define Reporting Needs

- [ ] Decide whether reports are for individual students, program staff, leadership, or all three.
- [ ] Decide whether results need to be grouped by site, county, instructor, cohort, or date.
- [ ] Decide whether student names can be collected.
- [ ] Choose a student identifier strategy.
- [ ] Define pre-test and post-test categories.
- [ ] Decide whether each question needs an answer key.
- [ ] Decide whether reports must be printable PDFs.

## Phase 3: Build The Curriculum Map

- [ ] Create a module or weekly outline.
- [ ] Write learning objectives for each session.
- [ ] Estimate timing for each activity.
- [ ] Identify hands-on practice tasks.
- [ ] Identify discussion prompts.
- [ ] Identify handouts needed.
- [ ] Identify instructor guide sections.
- [ ] Map each assessment question to a course category.

## Phase 4: Build Course Materials

- [ ] Create the course launch page.
- [ ] Create one presentation page per week or module.
- [ ] Create printable handouts.
- [ ] Create instructor guides.
- [ ] Create pre-test and post-test questions.
- [ ] Create answer keys if needed.
- [ ] Create printable versions of assessments if needed.
- [ ] Add clear links between the course page and all resources.

## Phase 5: Choose The Assessment Model

### Option A: Custom HTML Assessment

Use this when the priority is immediate student feedback.

- [ ] Build the assessment as an HTML page.
- [ ] Store questions and answer keys in JavaScript.
- [ ] Score the assessment in the browser.
- [ ] Show category breakdown.
- [ ] Create a print-ready report section.
- [ ] Add a Print Report button.
- [ ] Test save-as-PDF in the browser.

### Option B: Google Forms Assessment

Use this when the priority is centralized reporting.

- [ ] Create a Pre-Test Google Form.
- [ ] Create a Post-Test Google Form.
- [ ] Enable quiz mode if automatic scoring is needed.
- [ ] Link each Form to a Google Sheet.
- [ ] Add site, cohort, instructor, and date fields if needed.
- [ ] Add Form links to the course website.
- [ ] Test a fake student submission.
- [ ] Confirm the response appears in the Sheet.

## Phase 6: Build Reports

- [ ] Create a raw responses tab.
- [ ] Create a scoring tab.
- [ ] Create a category summary tab.
- [ ] Create a pre/post comparison tab.
- [ ] Create filters for location, instructor, cohort, and date.
- [ ] Create charts if leadership needs a visual report.
- [ ] Create a PDF export process if needed.
- [ ] Decide who owns and maintains the reporting Sheet.

## Phase 7: Make It Accessible

- [ ] Use large readable fonts.
- [ ] Maintain strong color contrast.
- [ ] Do not rely on color alone.
- [ ] Use clear headings.
- [ ] Use plain language.
- [ ] Keep instructions step-by-step.
- [ ] Make keyboard navigation possible.
- [ ] Test printed handouts.
- [ ] Avoid cluttered screens.

## Phase 8: Test The Course

- [ ] Open the course homepage.
- [ ] Check every lesson link.
- [ ] Check every handout link.
- [ ] Check every assessment link.
- [ ] Submit a fake pre-test.
- [ ] Submit a fake post-test.
- [ ] Confirm scoring works.
- [ ] Confirm reports are accurate.
- [ ] Print or save a sample PDF.
- [ ] Test on the classroom browser.
- [ ] Test on a backup browser if possible.

## Phase 9: Package For Delivery

- [ ] Create an online version if needed.
- [ ] Create an offline folder or flash-drive version.
- [ ] Include all handouts and PDFs.
- [ ] Include the instructor guide.
- [ ] Include a setup checklist.
- [ ] Include assessment links.
- [ ] Include backup printable assessments.
- [ ] Verify the package opens on a different computer.

## Phase 10: Maintain And Reuse

- [ ] Keep one master copy of the course.
- [ ] Keep one reusable question bank.
- [ ] Keep one reusable Google Forms setup process.
- [ ] Keep one reporting template.
- [ ] Document what files can be edited safely.
- [ ] Document who owns Forms and Sheets.
- [ ] Review dates, links, and policy-sensitive content before each new cohort.

## Simple Replication Formula

```text
Audience + Outcomes
        |
        v
Curriculum Map
        |
        v
Slides + Handouts + Instructor Guides
        |
        v
Pre-Test + Post-Test
        |
        v
Google Forms / Sheets Or Custom HTML Reports
        |
        v
Tested Course Website
        |
        v
Online Launch + Offline Backup
```

## Recommended Minimum Template

For each new course, create:

- `index.html` or course launch page.
- One page per lesson/module.
- One instructor guide.
- Two to four handouts per course or module.
- Pre-test.
- Post-test.
- Answer key.
- Google Form response Sheet.
- Summary report tab.
- Offline backup copy.

