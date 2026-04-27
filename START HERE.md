# START HERE — VUB Financial Readiness Course

Welcome! This folder holds everything you need to teach the VUB Financial
Readiness course. Here is a map so you can find what you need quickly.

## To launch the course in class

Double-click **`index.html`**. The course opens in your web browser with all 5
modules, the sidebar, dark mode, and every link wired up.

## To teach week by week

Open **`weekly-curriculum/`**. It contains one folder for each Monday meeting:

| Week | Date | Focus |
|---|---|---|
| Week 1 | April 27, 2026 | Pre-test + Module 1 |
| Week 2 | May 4, 2026 | Module 2 |
| Week 3 | May 11, 2026 | Module 3 |
| Week 4 | May 18, 2026 | Modules 4 + 5 compressed into one class |
| Week 5 | May 25, 2026 | No class - Memorial Day |
| Week 6 | June 1, 2026 | Review + post-test |

Each weekly folder includes a README with the teaching flow and copies of the
handouts or assessments needed for that session. The original 📘 folders remain
in place so the web app links keep working.

## To prepare for the satellite classroom

Open **`SATELLITE CLASSROOM SETUP.md`** for the travel checklist, backup plan,
and assessment collection workflow. To create a flash-drive-ready copy, run:

```powershell
npm run package:travel
```

That creates a travel folder and zip backup in `dist/`.

## Teaching folders (look for the 📘)

Anything starting with 📘 is content you'll actually use in class. Windows
Explorer groups these at the top of the folder list.

| Folder | What's inside |
|---|---|
| 📘 Admin Paperwork | Instructor contracts, one-page syllabus |
| 📘 Assessments | Pre-test and post-test HTML pages |
| 📘 Handouts | Printable handouts (10 files — schedule, worksheets, reference sheets) |
| 📘 Study Resources | Flashcards, quiz, podcast, slide deck, study guide, infographic |
| 📘 Teacher Guides | Teacher's guide PDFs |

## Other teaching files (at the top level)

| File | Purpose |
|---|---|
| `index.html` | **Course launcher — open this to teach** |
| `syllabus.html` / `syllabus.pdf` | Full syllabus |
| `syllabus-one-page.pdf` | Printable one-pager |
| `course-description.html` / `course-description.pdf` | Course overview |
| `videos/` | Finished lesson videos (see below) |

### About `videos/`

- Finished MP4s for class: **`videos/output/`** (one per module)
- Supplemental: **`videos/Notebooklm videos/`**
- The `module1-three-streams/` through `module5-legacy-planning/` folders
  inside are the source projects used to render the MP4s — you don't need to
  open them to teach.

## Don't worry about these folders

These are code, config, and build files the computer needs. You should never
have to open them to teach a lesson:

`benchmarks/`, `css/`, `docs/`, `js/`, `node_modules/`, `scripts/`, `skills/`,
`test-results/`, `tests/`, plus any file starting with a dot (`.git`,
`.gitignore`, etc.) or ending in `.json`, `.js`, `.config.js`, or named
`CLAUDE.md`.

---

*If you ever need to rename a 📘 folder, tell Claude — some of them are wired
into `index.html` and renaming by hand will break links.*
