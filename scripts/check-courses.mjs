#!/usr/bin/env node
/**
 * courses.json <-> courses/ drift check.
 *
 * Two directions:
 *   1. Every path courses.json claims (course path/entry/preTest/postTest and
 *      each lesson path) must exist on disk. Fragments (#module1) and query
 *      strings are stripped before resolving.
 *   2. Every course directory under courses/, and every week-* directory under
 *      a course's weeks/ tree, must be referenced by courses.json. A lesson
 *      that exists on disk but is missing from the catalog never reaches the
 *      homepage — that is drift, and it fails the check.
 *
 * Exit 0 when the catalog and the tree agree; exit 1 with a problem list
 * otherwise. Called by scripts/quality.sh and from scripts/build-site.js so a
 * Netlify build fails on drift too.
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const CATALOG = path.join(ROOT, "courses.json");
const COURSES_DIR = path.join(ROOT, "courses");

/** Strip #fragment / ?query and trailing slash from a catalog path. */
function toDiskPath(ref) {
  const bare = ref.split("#", 1)[0].split("?", 1)[0];
  return bare.endsWith("/") ? bare.slice(0, -1) : bare;
}

function readCatalog() {
  let raw;
  try {
    raw = fs.readFileSync(CATALOG, "utf8");
  } catch (e) {
    return { courses: null, problems: [`cannot read courses.json: ${e.message}`] };
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (e) {
    return { courses: null, problems: [`courses.json is not valid JSON: ${e.message}`] };
  }
  if (!Array.isArray(parsed.courses) || parsed.courses.length === 0) {
    return { courses: null, problems: ['courses.json has no "courses" array'] };
  }
  return { courses: parsed.courses, problems: [] };
}

/** All path-like refs a course makes, as [label, ref] pairs. */
function courseRefs(course) {
  const id = course.id || "<no id>";
  const top = ["path", "entry", "preTest", "postTest"]
    .filter((k) => typeof course[k] === "string")
    .map((k) => [`course ${id}: ${k}`, course[k]]);
  const lessons = (course.lessons || [])
    .filter((l) => typeof l.path === "string")
    .map((l) => [`course ${id}: lesson ${l.n} (${l.title})`, l.path]);
  return [...top, ...lessons];
}

/** Direction 1: every catalog ref resolves to a file or directory on disk. */
function checkRefsExist(courses) {
  return courses
    .flatMap(courseRefs)
    .filter(([, ref]) => !fs.existsSync(path.join(ROOT, toDiskPath(ref))))
    .map(([label, ref]) => `${label} -> ${ref} does not exist on disk`);
}

function subdirs(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((e) => e.isDirectory())
    .map((e) => e.name);
}

/** Direction 2a: every directory under courses/ is a cataloged course. */
function checkCourseDirsCataloged(courses) {
  const known = new Set(courses.map((c) => toDiskPath(c.path || "")));
  return subdirs(COURSES_DIR)
    .filter((name) => !known.has(path.posix.join("courses", name)))
    .map((name) => `courses/${name}/ exists on disk but is not in courses.json`);
}

/** Direction 2b: every weeks/week-* directory is referenced by its course. */
function checkWeekDirsCataloged(courses) {
  return courses.flatMap((course) => {
    const courseDir = toDiskPath(course.path || "");
    const weeksDir = path.join(ROOT, courseDir, "weeks");
    const referenced = courseRefs(course).map(([, ref]) => toDiskPath(ref));
    return subdirs(weeksDir)
      .filter((week) => {
        const weekPath = path.posix.join(courseDir, "weeks", week);
        return !referenced.some((r) => r === weekPath || r.startsWith(`${weekPath}/`));
      })
      .map((week) => `${courseDir}/weeks/${week}/ exists on disk but no lesson in courses.json references it`);
  });
}

const { courses, problems: parseProblems } = readCatalog();
const problems = courses
  ? [...checkRefsExist(courses), ...checkCourseDirsCataloged(courses), ...checkWeekDirsCataloged(courses)]
  : parseProblems;

if (problems.length) {
  console.error(`check-courses: ${problems.length} problem(s):`);
  for (const p of problems) console.error(`  - ${p}`);
  process.exit(1);
}

const lessonCount = courses.reduce((n, c) => n + (c.lessons || []).length, 0);
console.log(`check-courses: OK — ${courses.length} courses, ${lessonCount} lessons, catalog and courses/ tree agree.`);
