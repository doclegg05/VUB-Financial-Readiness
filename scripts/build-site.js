#!/usr/bin/env node
/**
 * VUB platform build.
 * The consolidated tree is already deployment-shaped, so the build simply copies
 * the public top-level items into dist/site/ (excluding dev tooling, docs,
 * node_modules, and the archived legacy subrepos) and strips any large media as a
 * safety net (course videos are YouTube-hosted).
 * Output: dist/site/  (or the first CLI arg).
 */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const SITE_ROOT = path.join(ROOT, process.argv[2] || path.join("dist", "site"));

// Public, deployable top-level items — everything a learner or teacher needs.
const PUBLISH = ["index.html", "404.html", "courses.json", "courses", "instructors", "shared", "assets"];

function rmrf(t) { if (fs.existsSync(t)) fs.rmSync(t, { recursive: true, force: true }); }

function copyRecursive(src, dest) {
  const st = fs.statSync(src);
  if (st.isDirectory()) {
    fs.mkdirSync(dest, { recursive: true });
    for (const e of fs.readdirSync(src)) copyRecursive(path.join(src, e), path.join(dest, e));
  } else if (st.isFile()) {
    fs.copyFileSync(src, dest);
  }
}

function walk(dir) {
  const out = [], stack = [dir];
  while (stack.length) {
    const cur = stack.pop();
    for (const e of fs.readdirSync(cur, { withFileTypes: true })) {
      const full = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(full); else out.push(full);
    }
  }
  return out;
}

const missing = PUBLISH.filter((i) => !fs.existsSync(path.join(ROOT, i)));
if (missing.length) throw new Error(`Cannot build site. Missing: ${missing.join(", ")}`);

rmrf(SITE_ROOT);
fs.mkdirSync(SITE_ROOT, { recursive: true });
for (const item of PUBLISH) copyRecursive(path.join(ROOT, item), path.join(SITE_ROOT, item));

// Safety net: strip large media (videos/podcasts are externally hosted on YouTube).
let stripped = 0;
for (const f of walk(SITE_ROOT)) {
  const l = f.toLowerCase();
  if (l.endsWith(".mp4") || l.endsWith(".mp3") || l.endsWith(".mov")) { fs.rmSync(f, { force: true }); stripped += 1; }
}

const pages = walk(SITE_ROOT).filter((f) => f.toLowerCase().endsWith(".html")).length;
console.log(`Built site: ${SITE_ROOT}`);
console.log(`  ${pages} HTML pages published.` + (stripped ? `  Stripped ${stripped} media file(s).` : ""));
