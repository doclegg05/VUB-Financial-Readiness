# START HERE — VUB Financial Readiness Course

Welcome! This folder holds everything you need to teach the VUB Financial
Readiness course. Here is a map so you can find what you need quickly.

## To launch the course in class

Double-click **`index.html`**. The Learning Lab dashboard opens in your web
browser with course links, assessments, handouts, and study resources wired up.

## To teach week by week

Open **`weekly-curriculum/`**. It contains one folder for each week in the teaching sequence:

| Week | Sequence | Focus |
|---|---|---|
| Week 1 | First class meeting | Pre-test + Module 1 |
| Week 2 | Second class meeting | Module 2 |
| Week 3 | Third class meeting | Module 3 |
| Week 4 | Fourth class meeting | Module 4: income systems and retirement cash flow |
| Week 5 | No-class week | Memorial Day break |
| Week 6 | Sixth class meeting | Module 5 |
| Week 7 | Final class meeting | Review + post-test |

Each weekly folder includes a README with the teaching flow and copies of the
handouts or assessments needed for that session. The original folders remain
in place so the web app links keep working.

## To prepare for the satellite classroom

Open **`SATELLITE CLASSROOM SETUP.md`** for the travel checklist, backup plan,
and assessment collection workflow. To create a flash-drive-ready copy, run:

```powershell
npm run package:travel
```

That creates a travel folder and zip backup in `dist/`.

## Teaching folders

Anything starting with is content you'll actually use in class. Windows
Explorer groups these at the top of the folder list.

| Folder | What's inside |
|---|---|
| admin-paperwork | Instructor contracts, one-page syllabus |
| assessments | Pre-test and post-test HTML pages |
| handouts | Printable handouts (11 files — schedule, worksheets, reference sheets) |
| study-resources | Flashcards, quiz, podcast, slide deck, study guide, infographic |
| teacher-guides | Teacher's guide PDFs, including the Module 4 step-by-step explainer and practical scenarios |

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

*If you ever need to rename a folder, tell Claude — some of them are wired
into `index.html` and renaming by hand will break links.*
