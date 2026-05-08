#!/usr/bin/env node
/**
 * Cross-platform build script for the VUB Financial Readiness site.
 * Replaces scripts/build-site.ps1 so Netlify (Linux) can run it.
 *
 * Output: dist/site/ (or first CLI arg if provided)
 */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT_REL = process.argv[2] || path.join("dist", "site");
const SITE_ROOT = path.join(ROOT, OUT_REL);
const LOCAL_INTERMEDIATE_COURSE = path.join(ROOT, "intermediate-computer-skills");

const REQUIRED_ITEMS = [
  "index.html",
  "404.html",
  "financial-readiness.html",
  "assets",
  "css",
  "js",
  "shared",
  "student-upload-instructions.html",
  "intermediate-computer-skills.html",
  "intermediate-computer-skills",
  "intermediate-computer-skills/syllabus-overview.html",
  "intermediate-computer-skills/weeks/week-01/presentation.html",
];

// Files & folders copied into the build verbatim
const ITEMS = [
  "index.html",
  "404.html",
  "financial-readiness.html",
  "intermediate-computer-skills.html",
  "course-description.html",
  "course-description.pdf",
  "syllabus.html",
  "syllabus.pdf",
  "syllabus-one-page.pdf",
  "assets",
  "css",
  "js",
  "shared",
  "student-upload-instructions.html",
  "templates",
  "weekly-curriculum",
];

const BUNDLED_COURSES = [
  {
    source: LOCAL_INTERMEDIATE_COURSE,
    dest: "intermediate-computer-skills",
    items: [
      "syllabus-overview.html",
      "css",
      "js",
      "assets",
      "weeks",
    ],
  },
];

// Folders that may have an emoji prefix (📘 Assessments, etc.)
const PUBLIC_TEACHING_FOLDERS = [
  "Assessments",
  "Handouts",
  "Study Resources",
  "Teacher Guides",
];

const REQUIRED_TEACHING_FOLDERS = PUBLIC_TEACHING_FOLDERS;

function rmrf(target) {
  if (fs.existsSync(target)) {
    fs.rmSync(target, { recursive: true, force: true });
  }
}

function copyRecursive(src, dest) {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const entry of fs.readdirSync(src)) {
      copyRecursive(path.join(src, entry), path.join(dest, entry));
    }
  } else if (stat.isFile()) {
    fs.copyFileSync(src, dest);
  }
}

function copy(src, destDir) {
  const base = path.basename(src);
  const dest = path.join(destDir, base);
  copyRecursive(src, dest);
}

function findFolderSuffix(suffix) {
  // Find a top-level directory in ROOT whose name *ends* with suffix
  // (matches both "Assessments" and "📘 Assessments").
  const entries = fs.readdirSync(ROOT, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && e.name.endsWith(suffix))
    .map((e) => path.join(ROOT, e.name))[0];
}

function walkFiles(dir) {
  const out = [];
  const stack = [dir];
  while (stack.length) {
    const current = stack.pop();
    const entries = fs.readdirSync(current, { withFileTypes: true });
    for (const entry of entries) {
      const full = path.join(current, entry.name);
      if (entry.isDirectory()) {
        stack.push(full);
      } else if (entry.isFile()) {
        out.push(full);
      }
    }
  }
  return out;
}

// ── Build steps ───────────────────────────────────────────────────────────

rmrf(SITE_ROOT);
fs.mkdirSync(SITE_ROOT, { recursive: true });

const missingRequired = REQUIRED_ITEMS.filter((item) => !fs.existsSync(path.join(ROOT, item)));
const missingTeachingFolders = REQUIRED_TEACHING_FOLDERS
  .filter((suffix) => !findFolderSuffix(suffix))
  .map((suffix) => `*${suffix}`);

if (missingRequired.length || missingTeachingFolders.length) {
  throw new Error(`Cannot build site. Missing required item(s): ${missingRequired.concat(missingTeachingFolders).join(", ")}`);
}

for (const item of ITEMS) {
  const source = path.join(ROOT, item);
  if (fs.existsSync(source)) {
    copy(source, SITE_ROOT);
  }
}

for (const suffix of PUBLIC_TEACHING_FOLDERS) {
  const source = findFolderSuffix(suffix);
  if (source) {
    copy(source, SITE_ROOT);
  }
}

for (const course of BUNDLED_COURSES) {
  if (!fs.existsSync(course.source)) {
    console.warn(`Skipped missing sibling course: ${course.source}`);
    continue;
  }

  const courseDest = path.join(SITE_ROOT, course.dest);
  fs.mkdirSync(courseDest, { recursive: true });
  for (const item of course.items) {
    const source = path.join(course.source, item);
    if (fs.existsSync(source)) {
      copy(source, courseDest);
    }
  }
}

// Strip large media (mp3/mp4) from the production output.
// Instructor materials and answer keys are intentionally public for open educational reuse.
let stripped = 0;
for (const file of walkFiles(SITE_ROOT)) {
  const lower = file.toLowerCase();
  const isMedia = lower.endsWith(".mp4") || lower.endsWith(".mp3");
  if (isMedia) {
    fs.rmSync(file, { force: true });
    stripped += 1;
  }
}

console.log(`Built website: ${SITE_ROOT}`);
if (stripped) {
  console.log(`  Stripped ${stripped} large media file(s) from output.`);
}
