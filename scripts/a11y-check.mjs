// Computed accessibility check: axe-core (WCAG A/AA, real computed contrast)
// over the BUILT site, on the homepage plus one representative lesson page per
// course in courses.json.
//
// Usage:  node scripts/a11y-check.mjs            — check against the baseline
//         node scripts/a11y-check.mjs --update   — rewrite the baseline (review
//                                                  the diff; it may only shrink)
//
// Ratchet contract: scripts/a11y-baseline.json is a committed, shrink-only
// allowlist keyed by page then axe rule id, holding the node count observed
// when the baseline was cut. The check FAILS only on violations outside it:
// a rule not in the baseline for that page, or more nodes than it allows.
// Counts that drop are reported so the baseline can be tightened; they never
// grow back without a human editing the file.
//
// Run `npm run build:site` first — this serves dist/site, same as the
// Playwright suite.

import { createServer } from "node:http";
import { readFile, writeFile } from "node:fs/promises";
import { existsSync, createReadStream, statSync } from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { AxeBuilder } from "@axe-core/playwright";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const siteRoot = path.join(repoRoot, "dist", "site");
const baselinePath = path.join(repoRoot, "scripts", "a11y-baseline.json");
const AXE_TAGS = ["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"];

const MIME = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
  ".ttf": "font/ttf",
  ".pdf": "application/pdf",
};

// ---------- page selection ----------

async function selectPages() {
  const catalog = JSON.parse(await readFile(path.join(repoRoot, "courses.json"), "utf8"));
  const lessonPages = catalog.courses.map((course) => {
    const first = course.lessons[0];
    // financial-readiness lesson paths carry #moduleN fragments; one page.
    const clean = first.path.split("#")[0];
    return { label: `${course.id} (lesson 1: ${first.title})`, urlPath: `/${clean}` };
  });
  return [{ label: "homepage", urlPath: "/" }, ...lessonPages];
}

// ---------- static server over dist/site ----------

function serveSite() {
  const server = createServer((req, res) => {
    const urlPath = decodeURIComponent(new URL(req.url, "http://localhost").pathname);
    const rel = urlPath.endsWith("/") ? `${urlPath}index.html` : urlPath;
    const filePath = path.join(siteRoot, path.normalize(rel));
    if (!filePath.startsWith(siteRoot) || !existsSync(filePath) || !statSync(filePath).isFile()) {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found");
      return;
    }
    res.writeHead(200, { "content-type": MIME[path.extname(filePath).toLowerCase()] ?? "application/octet-stream" });
    createReadStream(filePath).pipe(res);
  });
  return new Promise((resolve, reject) => {
    server.on("error", reject);
    server.listen(0, "127.0.0.1", () => resolve(server));
  });
}

// ---------- axe run ----------

async function auditPages(pages, origin) {
  const browser = await chromium.launch();
  // AxeBuilder opens a sibling page in the same context, which a page-owned
  // context (browser.newPage()) refuses — so create the context explicitly.
  const context = await browser.newContext();
  const results = [];
  try {
    for (const pageDef of pages) {
      const page = await context.newPage();
      // Animations mid-transition and half-loaded web fonts make axe's computed
      // contrast flaky; settle both before analyzing.
      await page.emulateMedia({ reducedMotion: "reduce" });
      const response = await page.goto(origin + pageDef.urlPath, { waitUntil: "load" });
      if (!response || !response.ok()) {
        throw new Error(`${pageDef.urlPath}: HTTP ${response ? response.status() : "no response"}`);
      }
      await page.evaluate(() => document.fonts.ready);
      const axe = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze();
      const ruleCounts = Object.fromEntries(
        axe.violations
          .map((v) => [v.id, v.nodes.length])
          .sort(([a], [b]) => a.localeCompare(b))
      );
      results.push({ ...pageDef, ruleCounts, violations: axe.violations });
      await page.close();
    }
  } finally {
    await browser.close();
  }
  return results;
}

// ---------- baseline compare ----------

async function loadBaseline() {
  if (!existsSync(baselinePath)) return null;
  const parsed = JSON.parse(await readFile(baselinePath, "utf8"));
  if (typeof parsed.pages !== "object" || parsed.pages === null) {
    throw new Error(`${baselinePath}: expected a "pages" object`);
  }
  return parsed;
}

function compareToBaseline(results, baseline) {
  const failures = [];
  const shrinkNotes = [];
  for (const result of results) {
    const allowed = baseline.pages[result.urlPath] ?? {};
    for (const [rule, count] of Object.entries(result.ruleCounts)) {
      const allowedCount = allowed[rule];
      if (allowedCount === undefined) {
        failures.push(`${result.urlPath}: NEW rule "${rule}" (${count} node${count === 1 ? "" : "s"}) not in baseline`);
      } else if (count > allowedCount) {
        failures.push(`${result.urlPath}: "${rule}" grew ${allowedCount} -> ${count} nodes`);
      } else if (count < allowedCount) {
        shrinkNotes.push(`${result.urlPath}: "${rule}" shrank ${allowedCount} -> ${count} — tighten the baseline`);
      }
    }
    for (const rule of Object.keys(allowed)) {
      if (!(rule in result.ruleCounts)) {
        shrinkNotes.push(`${result.urlPath}: "${rule}" no longer observed — remove it from the baseline`);
      }
    }
  }
  return { failures, shrinkNotes };
}

// ---------- main ----------

async function main() {
  const update = process.argv.includes("--update");
  if (!existsSync(siteRoot)) {
    console.error(`a11y-check: ${siteRoot} missing — run \`npm run build:site\` first`);
    process.exit(2);
  }

  const pages = await selectPages();
  const server = await serveSite();
  const origin = `http://127.0.0.1:${server.address().port}`;
  let results;
  try {
    results = await auditPages(pages, origin);
  } finally {
    server.close();
  }

  for (const result of results) {
    const rules = Object.entries(result.ruleCounts);
    const summary = rules.length === 0
      ? "clean"
      : rules.map(([rule, n]) => `${rule}: ${n}`).join(", ");
    console.log(`  ${result.urlPath} [${result.label}] — ${summary}`);
  }

  if (update) {
    const baseline = {
      $comment:
        "Shrink-only allowlist for scripts/a11y-check.mjs (axe-core WCAG A/AA). " +
        "Keyed by page path then axe rule id -> allowed node count at baseline time. " +
        "Entries may be removed or lowered as violations are fixed; never raised or added " +
        "to admit a new violation. Regenerate with: node scripts/a11y-check.mjs --update",
      axeCoreTags: AXE_TAGS,
      pages: Object.fromEntries(results.map((r) => [r.urlPath, r.ruleCounts])),
    };
    await writeFile(baselinePath, JSON.stringify(baseline, null, 2) + "\n");
    console.log(`a11y-check: baseline written to ${path.relative(repoRoot, baselinePath)}`);
    return;
  }

  const baseline = await loadBaseline();
  if (baseline === null) {
    console.error("a11y-check: no baseline — run `node scripts/a11y-check.mjs --update` and commit it");
    process.exit(2);
  }
  const { failures, shrinkNotes } = compareToBaseline(results, baseline);
  for (const note of shrinkNotes) console.log(`  note: ${note}`);
  if (failures.length > 0) {
    console.error("a11y-check: FAIL — new accessibility violations beyond the committed baseline:");
    for (const failure of failures) console.error(`  ${failure}`);
    process.exit(1);
  }
  console.log("a11y-check: PASS (no violations beyond the committed baseline)");
}

main().catch((err) => {
  console.error(`a11y-check: fatal — ${err.message}`);
  process.exit(2);
});
