# VUB Learning Lab

Veterans Upward Bound (VUB) Learning Lab is a static course site for classroom-based instruction. It gives instructors and students a simple launchpad for course pages, handouts, study resources, and financial readiness lessons.

Production site: https://vubcourse.netlify.app

## Audience

The site is built for VUB students, especially adult learners and military veterans working in a computer lab setting. Copy and navigation should stay direct, readable, and classroom-friendly.

## Current Pages

- `index.html` - Learning Lab dashboard and course launchpad
- `financial-readiness.html` - Financial Readiness course
- `intermediate-computer-skills.html` - Intermediate Computer Skills course
- `syllabus.html` - Course syllabus
- `course-description.html` - Course description

Instructor materials, study resources, and answer keys are public by design. This project is intended to support open educational use by instructors and students, so the presence of teaching materials in the repository should not be treated as an accidental leak.

## License Status

License selection is pending. Do not assume the current package metadata is the final project license.

Common choices to consider:

- Course content: Creative Commons Attribution 4.0 International (CC BY 4.0)
- Site code: MIT or Apache License 2.0

Choose and document final licensing before broad public distribution.

## Local Setup

Prerequisites:

- Node.js
- npm

Install dependencies:

```powershell
npm install
```

Run the static site locally from the project root with any local static server. For example:

```powershell
npx serve .
```

## Build And Test

Build the deployable site:

```powershell
npm run build:site
```

Expected output includes:

```text
Built website: ...\dist\site
```

Run the Playwright test suite:

```powershell
npm test
```

Optional Windows build wrapper:

```powershell
npm run build:site:win
```

## Deployment Overview

Netlify is configured to build with:

```text
npm run build:site
```

The publish directory is:

```text
dist/site
```

Before publishing, run the build and tests locally, then review the generated `dist/site` output in a browser. See `DEPLOYMENT.md` for the deployment checklist.

