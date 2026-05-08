# Deployment Checklist

This checklist is for deploying the VUB Learning Lab static site to Netlify.

Production URL: https://vubcourse.netlify.app

## 1. Preflight

- Confirm the working tree contains only intended changes.
- Review public teaching materials and verify they are intended for open classroom use.
- Confirm no private student information, credentials, or account-specific values are present.
- Confirm license language still says license selection is pending unless a final license has been chosen.
- Verify the Netlify configuration uses:

```text
Build command: npm run build:site
Publish directory: dist/site
```

## 2. Build

From the repository root, run:

```powershell
npm install
npm run build:site
```

Expected build output includes:

```text
Built website: ...\dist\site
```

If large media files are stripped, the build may also report:

```text
Stripped ... large media file(s) from output.
```

Instructor materials and answer keys are intentionally public for open educational reuse. Do not treat answer-key files as private unless the course policy changes.

## 3. Tests

Run:

```powershell
npm test
```

Expected result:

```text
... passed
```

If a test fails, fix the issue before launching unless the failure is documented and accepted by the instructor.

## 4. Preview QA

Deploy to a Netlify preview first. In the preview URL, check:

- `/` opens the Learning Lab dashboard.
- `/financial-readiness.html` opens the Financial Readiness course.
- `/intermediate-computer-skills.html` opens the Intermediate Computer Skills course.
- `/syllabus.html` opens the syllabus.
- Missing pages show the custom 404 page.
- Links to handouts, assessments, study resources, and teacher guides open as expected.
- Layout is usable on desktop, tablet, and phone widths.
- Light and dark mode still work on course pages that support theme switching.

## 5. Launch

- Promote the tested preview to production, or trigger the production deploy from the approved branch.
- Open the production URL after deploy completion.
- Repeat the key page checks from preview QA.
- Share the production URL with instructors only after the production check passes.

## 6. Rollback

If production is broken:

- Use Netlify deploy history to restore the last known good deploy.
- Record the failed deploy time and the visible issue.
- Rebuild and retest locally before another production launch.
