# Meeting Agenda: VUB Course Setup and Reporting

**Meeting With:** Alison, VUB Program Coordinator  
**Purpose:** Explain how the VUB courses were built, what tools were used, and how assessment/reporting could be recreated for other areas of the state.  
**Recommended Length:** 30 minutes  

## Desired Outcomes

- Alison understands the difference between the course website, assessments, and reports.
- Alison understands which parts use Google Forms and which parts are custom-built.
- You identify whether she needs individual reports, statewide aggregate reports, or both.
- You agree on a practical next step, such as building a sample reporting template.

## Agenda

### 1. Opening And Context - 3 minutes

**Goal:** Frame the project in plain language.

Talking point:

"The courses are built like small websites. The lessons, slides, handouts, instructor guides, and some assessment reports are HTML/CSS/JavaScript files. Google Forms is used where we need centralized assessment collection."

Clarify that this is not a single packaged course-builder tool. It is a flexible course system assembled from standard web tools plus Google tools.

### 2. Course Walkthrough - 5 minutes

**Goal:** Show what students and instructors actually use.

Show:

- Course landing page
- One lesson presentation
- One handout
- One instructor guide or syllabus
- Pre-test/post-test entry points

Emphasize:

- Simple browser-based access
- Large readable design for adult learners
- Printable support materials
- Offline or flash-drive-friendly design where needed

### 3. Tech Stack Overview - 5 minutes

**Goal:** Explain the tools without getting too technical.

Cover:

- **HTML:** page structure, slides, handouts, assessments
- **CSS:** VUB branding, print layout, accessibility, responsive design
- **JavaScript:** slide navigation, progress tracking, quiz scoring, report generation
- **Google Forms:** student answer collection
- **Google Sheets:** response storage and analysis
- **Google Apps Script:** creates reusable Forms from a question bank
- **Node/npm:** local development, packaging, build scripts
- **Playwright:** link and browser testing
- **Netlify:** optional public hosting
- **Flash drive/travel package:** backup for satellite classrooms

Suggested phrasing:

"The website is the delivery layer. Google Forms and Sheets are the reporting layer."

### 4. Assessment And Report Flow - 7 minutes

**Goal:** Address Alison's exact question about Forms and reports.

Explain the two models:

**Model A: Custom HTML report**

- Used in Intermediate Computer Skills
- Scores in the browser
- Saves pre-test results on the same computer using browser storage
- Compares pre-test and post-test
- Prints or saves an individual PDF-style report
- Best for individual student feedback
- Not ideal for statewide reporting by itself

**Model B: Google Forms + Google Sheets**

- Used for centralized collection
- Students submit answers through Google Forms
- Responses go into Google Sheets
- Easier to compare by location, class, instructor, date, or cohort
- Better fit for statewide program reporting

Recommendation to Alison:

"For other areas of the state, I would use Google Forms and Sheets as the source of truth, then build a summary report or dashboard from the Sheet."

### 5. Development Process - 4 minutes

**Goal:** Explain how courses were created from idea to finished product.

Cover:

- Discovery: audience, goals, constraints, reporting needs
- Curriculum map: modules/weeks, objectives, activities, assessments
- Content build: slides, handouts, instructor guides
- Assessment design: pre/post categories and questions
- Accessibility review: readable text, high contrast, keyboard navigation
- Testing: links, browser behavior, print layout, assessment flow
- Packaging: online version plus local/offline backup

### 6. Workarounds And Lessons Learned - 3 minutes

**Goal:** Be transparent about practical choices.

Mention:

- Static website instead of a full LMS kept the system simple and portable.
- Browser print-to-PDF avoided paid reporting tools for individual reports.
- Google Forms solved central collection better than custom local reports.
- Apps Script reduced manual Form setup.
- A travel package solved unreliable internet at satellite locations.
- AI tools helped draft, organize, and produce materials faster, but instructor review was still necessary.

### 7. Alison's Reporting Needs - 3 minutes

**Goal:** Gather enough information to recommend the right path.

Ask:

- Do you need reports for individual students, class cohorts, state regions, or all three?
- Should reports compare pre-test to post-test by category?
- What identifiers can be collected: name, site, instructor, date, cohort?
- Who should own the Google Forms and response Sheets?
- Who should be able to view raw student responses?
- Do you need PDF reports, spreadsheet summaries, dashboard views, or all of these?
- Will all locations have reliable internet during assessment time?

## Recommended Next Step

Offer to build a small proof of concept:

- One sample pre-test Form
- One sample post-test Form
- One linked Google Sheet
- One summary tab showing pre/post improvement
- Optional PDF-style individual report template

## Closing Script

"The main decision is whether you want reports centered around individual student handouts or centralized program reporting. If this is for multiple areas of the state, I would start with Google Forms and Sheets, then build the reports from that data. The course website can still act as the launchpad, but the Sheet should be the source of truth."

