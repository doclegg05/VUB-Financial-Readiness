# VUB Course Build Tech Stack Diagram

## Plain-English Summary

The VUB courses are built like lightweight websites. The website delivers the lessons, handouts, instructor guides, and assessment links. Google Forms and Sheets handle centralized assessment collection when reporting across multiple sites is needed.

## Main Stack

```text
Students and Instructor
        |
        v
Course Launch Page
index.html / financial-readiness.html / intermediate-computer-skills.html
        |
        +----------------------+----------------------+----------------------+
        |                      |                      |                      |
        v                      v                      v                      v
Lesson Slides           Handouts and Guides     Assessments            Hosting / Backup
HTML pages              HTML and PDF files      HTML or Google Forms   Netlify or flash drive
CSS styling             Printable layouts       Pre-test/post-test     Local browser access
JS navigation           Instructor notes        Reports and scores     Travel package
```

## Layer View

| Layer | What It Does | Tools Or Files |
|---|---|---|
| Course delivery | Gives students and instructors one place to launch lessons and resources | `index.html`, course pages |
| Presentation | Runs slide-style lessons in the browser | HTML, CSS, JavaScript |
| Learning materials | Provides printed and digital supports | Handouts, syllabi, teacher guides |
| Interaction | Handles slide navigation, progress, quizzes, and buttons | JavaScript, browser localStorage |
| Assessment collection | Captures student answers centrally | Google Forms |
| Data storage | Stores submitted responses | Google Sheets |
| Report generation | Shows individual or group results | Browser PDF reports, Sheets summaries, dashboards |
| Build and testing | Packages and checks the course | Node/npm, Playwright, Python scripts |
| Delivery backup | Lets the course run even when internet is weak | Flash drive package, local HTML files |

## What Each Tool Is For

| Tool | Purpose | Why We Used It |
|---|---|---|
| HTML | Page structure | Easy to open in any browser |
| CSS | Visual design and print formatting | Keeps the course readable and branded |
| JavaScript | Interactivity | Handles slides, scoring, reports, and progress |
| Google Forms | Student assessment submission | Familiar, centralized, easy to share |
| Google Sheets | Response database | Good for filtering, comparing, and exporting |
| Google Apps Script | Form setup automation | Avoids manually rebuilding identical tests |
| Netlify | Optional web hosting | Simple static website deployment |
| Node/npm | Development utilities | Runs build, package, and test commands |
| Playwright | Browser testing | Checks that links and browser behavior work |
| Browser print to PDF | Individual reports | Avoids paid reporting software |

## How To Explain It In The Meeting

"The course is not one single app. It is a small website made from standard web files. The website delivers the lessons and resources. Google Forms and Sheets are used when we need centralized assessment data. For individual student feedback, we can also generate print-ready reports directly in the browser."

## Best Model For Statewide Use

For statewide reporting, use this stack:

```text
Course Website
    |
    v
Google Form Pre-Test and Post-Test
    |
    v
Google Sheets Response Data
    |
    v
Summary Tab / Pivot Table / Dashboard
    |
    v
Program Report By Location, Cohort, Category, Or Date
```

