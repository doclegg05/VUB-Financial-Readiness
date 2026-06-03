# Satellite Classroom Setup

Use this checklist before traveling to teach the VUB Financial Readiness Course.

## Best Primary Plan

Host the course online and give students one link or QR code.

Recommended setup:

1. Upload or deploy the course as a static website.
2. Test the link from a computer that is not your normal teaching machine.
3. Use the hosted `index.html` for projection.
4. Have students open the same link from their own desktops.
5. For assessments, students complete the HTML pre-test/post-test, download the CSV results file, and upload it to your Google Drive results folder.

## Best Backup Plan

Bring a full offline copy.

Carry:

- One flash drive with the full travel package
- One second copy on your laptop or external drive
- One cloud copy, such as OneDrive, Google Drive, GitHub, or Netlify
- Printed schedule and a few paper pre/post-test copies in case the lab setup fails
- Printed student upload instructions from `📘 Admin Paperwork/student-upload-instructions.html`

## Create The Travel Package

From this project folder, run:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/create-travel-package.ps1
```

This creates:

- `dist/VUB-Financial-Readiness-Course/`
- `dist/VUB-Financial-Readiness-Course.zip`

Copy both to your flash drive. The folder is for immediate use; the zip is your clean backup.

To make a smaller package without the lesson videos:

```powershell
powershell -ExecutionPolicy Bypass -File scripts/create-travel-package.ps1 -SkipVideos
```

## Instructor Computer Setup

1. Open `index.html` from the hosted course link if internet works.
2. If internet or hosting fails, open `index.html` from the flash drive travel package.
3. Test Module 1, the sidebar, and dark/light mode before students arrive.
4. Open `weekly-curriculum/README.md` to confirm the day’s plan.

## Student Computer Setup

Give students either:

- The hosted course link, or
- A copied local folder from the flash drive if internet fails

For Week 1, students open:

```text
📘 Assessments/pre-test.html
```

For Week 6, students open:

```text
📘 Assessments/post-test.html
```

At the end of each test, students should click:

```text
Download Results (CSV)
```

Collect the downloaded `.csv` file using one of these methods:

1. Google Drive upload folder
2. Email to you
3. Shared network folder or LMS upload
4. Flash drive collection only if the first three are unavailable

See `weekly-curriculum/GOOGLE-DRIVE-COLLECTION.md` for the exact folder structure and classroom workflow.

## Why CSV Download Is The Practical Backup

The HTML tests save results in the browser, but only on that specific computer. The CSV button creates a portable file that you can collect and combine later.

## Day-Of Supplies

- Flash drive with travel folder and zip
- Laptop or external drive with second copy
- Printed short URL or QR code
- Printed schedule
- Paper pre-test and post-test backups
- HDMI/USB-C adapters if needed
- Instructor login credentials for cloud storage or hosting
