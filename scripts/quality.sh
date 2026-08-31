#!/usr/bin/env bash
# The quality gate for vublessons (education-toolkit contract).
# CI (.github/workflows/quality.yml -> the toolkit's reusable workflow) runs a
# gitleaks secret scan and then this script; run it locally before pushing.
#
# Checks, in order:
#   1. npm run build:site        — copy the PUBLISH tree to dist/site, assert
#                                  REQUIRED_FILES, and (via build-site.js) run
#                                  the courses.json drift check
#   2. tools/link-check.py       — internal links across courses/, instructors/,
#                                  index.html; exits 1 on any broken link
#   3. scripts/check-courses.mjs — courses.json <-> courses/ tree drift check
#   4. Playwright suite          — the full 18-test suite against the built
#                                  dist/site. Nothing is quarantined: the 5
#                                  dl1-sidebar-scroll cases were fixed
#                                  2026-07-28 (see .claude/MEMORY.md) and pass.
#   5. scripts/a11y-check.mjs    — axe-core WCAG A/AA scan (computed contrast)
#                                  of the homepage + one lesson page per course
#                                  in dist/site. Report-only ratchet: fails only
#                                  on violations beyond the committed shrink-only
#                                  allowlist scripts/a11y-baseline.json.
set -euo pipefail
cd "$(dirname "$0")/.."

if [ ! -d node_modules ]; then
  npm ci
fi

echo "==> 1/5 build:site"
npm run build:site

echo "==> 2/5 link check"
python3 tools/link-check.py

echo "==> 3/5 courses.json drift check"
node scripts/check-courses.mjs

echo "==> 4/5 playwright"
if [ "${CI:-}" = "true" ]; then
  npx playwright install --with-deps chromium
fi
npx playwright test

echo "==> 5/5 a11y check (axe-core, ratchet vs committed baseline)"
node scripts/a11y-check.mjs

# REPORT-ONLY: prints per-deck Flesch-Kincaid grades (grade-8 ceiling) and
# always exits 0. Turning this into a blocking check is a later, deliberate
# calibration decision — do not drop --baseline without one.
echo "==> readability baseline (report-only)"
node scripts/readability-gate.mjs --baseline --format html \
  --allowlist config/readability-allowlist.json \
  courses/*/weeks/*/presentation.html \
  || echo "readability baseline step failed (non-blocking)"

echo "quality gate: PASS"
