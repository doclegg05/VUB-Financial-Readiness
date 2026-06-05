# M4 — Shared Shell + Homepage Catalog + Patriotic Theme — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the shared page shell (`shell.js`/`shell.css`), a rebuilt data-driven homepage catalog (`index.html`), and finalize the patriotic theme system in `brand.css` so every page inherits it — all offline-capable and accessible.

**Architecture:** Pure static HTML/CSS/JS (no framework), matching the existing IIFE/global pattern of `shared/progress.js` and `shared/glossary.js`. A single included `shell.js` injects the app bar + footer on any page; `brand.css` holds all theme tokens; `index.html` renders course cards from `courses.json` at runtime. The Netlify `build-site.js` copies these into `dist/site`. Playwright gates behavior.

**Tech Stack:** HTML5, CSS custom properties, vanilla JS (ES2017 IIFE), self-hosted woff2 fonts, inline SVG (flag + icons), `@fontsource` for font files, Playwright for tests, existing `scripts/build-site.js` + `netlify.toml`.

**Source of truth for the locked visual:** [docs/specs/m4-homepage-reference.html](../specs/m4-homepage-reference.html) (committed). Several tasks **port markup/CSS from this reference**, with the adaptations each task spells out (self-hosted fonts instead of the CDN link; data-bound cards; shell injection).

**Design spec:** [docs/specs/2026-06-05-m4-shell-catalog-design.md](../specs/2026-06-05-m4-shell-catalog-design.md).

---

## Pre-flight

- [ ] **Confirm clean tree + create a working branch.**

Run:
```bash
cd "/c/Users/Instructor/Dev/curriculum/VUB Lessons"
git status --porcelain        # expect only untracked docs/handoff-m3-phase-d.md
git switch -c feat/m4-shell-catalog
node -v && npm -v
```
Expected: on a new branch `feat/m4-shell-catalog`; node ≥ 18.

- [ ] **Install dev deps + fonts.** (The site is static; `@fontsource` only provides the woff2 files we copy into `assets/fonts/`.)

Run:
```bash
npm install            # restores existing toolchain (Playwright, serve, etc.)
npm install -D @fontsource/playfair-display @fontsource/source-sans-3
```
Expected: `node_modules/@fontsource/playfair-display/files/*.woff2` and `.../source-sans-3/files/*.woff2` exist.

---

## File structure (what each file owns)

| File | Create/Modify | Responsibility |
|---|---|---|
| `shared/brand.css` | Modify | Theme tokens (flag-blue palette), `@font-face` (self-hosted), shared motif helpers (`.vub-tricolor`, `.vub-bunting`) |
| `assets/fonts/*.woff2` | Create | Self-hosted Playfair Display + Source Sans 3 |
| `assets/vub-usflag.svg` | Create | Accurate 50-star US flag w/ ripple filter (generated) |
| `scripts/gen-flag.py` | Create | Reproducible flag-SVG generator |
| `shared/shell.css` | Create | App bar / breadcrumb / footer styling (tokens only) |
| `shared/shell.js` | Create | Inject app bar + footer; Text-Size control; Help hook; reduced-motion gate; optional breadcrumb |
| `courses.json` | Modify | Add `progressKey` per course |
| `index.html` | Replace | Rebuilt homepage: hero (inline flag) + data-bound cards + split + branches |
| `scripts/build-site.js` | Modify | Copy new shared/asset files into `dist/site`; keep REQUIRED_ITEMS honest |
| `tests/functional/shell.spec.js` | Create | Shell injection, Text-Size persist, Help, reduced-motion |
| `tests/content/homepage-catalog.spec.js` | Create | Cards render from `courses.json`; no-CDN/offline check |

---

## Task 1 — Self-host fonts + finalize `brand.css` theme tokens

**Files:**
- Create: `assets/fonts/` (6 woff2)
- Modify: `shared/brand.css`
- Test: manual (verified in Task 8 Playwright no-CDN check)

- [ ] **Step 1: Copy the needed font weights into `assets/fonts/`.**

Run (git-bash):
```bash
cd "/c/Users/Instructor/Dev/curriculum/VUB Lessons"
mkdir -p assets/fonts
PF=node_modules/@fontsource/playfair-display/files
SS=node_modules/@fontsource/source-sans-3/files
cp "$PF/playfair-display-latin-700-normal.woff2" assets/fonts/
cp "$PF/playfair-display-latin-800-normal.woff2" assets/fonts/
cp "$PF/playfair-display-latin-900-normal.woff2" assets/fonts/
cp "$SS/source-sans-3-latin-400-normal.woff2"    assets/fonts/
cp "$SS/source-sans-3-latin-600-normal.woff2"    assets/fonts/
cp "$SS/source-sans-3-latin-700-normal.woff2"    assets/fonts/
ls -1 assets/fonts/
```
Expected: 6 `.woff2` files listed. *(If a filename differs by version, `ls "$PF"` and copy the matching latin/normal weights 700/800/900 and 400/600/700.)*

- [ ] **Step 2: Prepend `@font-face` blocks to `shared/brand.css`** (above `:root`):

```css
/* ── Self-hosted fonts (offline; no CDN) ── */
@font-face{font-family:'Playfair Display';font-style:normal;font-weight:700;font-display:swap;src:url('/assets/fonts/playfair-display-latin-700-normal.woff2') format('woff2')}
@font-face{font-family:'Playfair Display';font-style:normal;font-weight:800;font-display:swap;src:url('/assets/fonts/playfair-display-latin-800-normal.woff2') format('woff2')}
@font-face{font-family:'Playfair Display';font-style:normal;font-weight:900;font-display:swap;src:url('/assets/fonts/playfair-display-latin-900-normal.woff2') format('woff2')}
@font-face{font-family:'Source Sans 3';font-style:normal;font-weight:400;font-display:swap;src:url('/assets/fonts/source-sans-3-latin-400-normal.woff2') format('woff2')}
@font-face{font-family:'Source Sans 3';font-style:normal;font-weight:600;font-display:swap;src:url('/assets/fonts/source-sans-3-latin-600-normal.woff2') format('woff2')}
@font-face{font-family:'Source Sans 3';font-style:normal;font-weight:700;font-display:swap;src:url('/assets/fonts/source-sans-3-latin-700-normal.woff2') format('woff2')}
```

- [ ] **Step 3: Update the `:root` palette in `shared/brand.css`** — replace the navy block (currently `--navy:#312C4C; --navy-deep:#211D38; --navy-mid:#3D3760; --navy-light:#2C4A7C…`) with the flag-blue ramp + add red tokens. Find the existing navy custom properties and set them to:

```css
  /* Brand blue — Old Glory Blue (site chrome). Seal MARK keeps its own indigo. */
  --navy:        #0A3161;
  --navy-deep:   #07223F;
  --navy-mid:    #123E72;
  --navy-light:  #2C5AA0;
  --blue-soft:   #5E86C4;
  /* Old Glory Red (CTA/accents) */
  --red:         #B31942;
  --red-bright:  #C61F4C;
  --red-dark:    #8B1432;
```
Keep existing `--gold #C9A227`, `--gold-light #E4C45A`, `--cream`, `--white`. Update `--ink:#16243A;` `--muted:#46566D;` `--border:#E2DECF;` if present (otherwise add them).

- [ ] **Step 4: Add shared motif helpers at the end of `brand.css`:**

```css
/* ── Shared patriotic motifs (reusable site-wide) ── */
.vub-tricolor{height:8px;background:linear-gradient(90deg,var(--red) 0 33.3%,var(--white) 33.3% 66.6%,var(--navy) 66.6% 100%)}
.vub-bunting{height:30px;background-repeat:repeat-x;background-position:center top;background-size:64px 64px;
  background-image:radial-gradient(circle at 50% 0,var(--navy) 0 11px,var(--white) 11px 16px,var(--red) 16px 23px,var(--white) 23px 27px,var(--navy) 27px 31px,transparent 31px);
  filter:drop-shadow(0 3px 3px rgba(0,0,0,.25))}
@media (prefers-reduced-motion:reduce){.vub-anim{animation:none!important}}
```

- [ ] **Step 5: Verify CSS parses (no syntax error) by loading it in the existing brand preview.**

Run:
```bash
npx serve . -l 5050 >/dev/null 2>&1 &
sleep 2
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5050/assets/brand-preview.html   # 200
curl -s -o /dev/null -w "%{http_code}\n" http://localhost:5050/assets/fonts/source-sans-3-latin-400-normal.woff2  # 200
kill %1 2>/dev/null
```
Expected: both `200`.

- [ ] **Step 6: Commit.**
```bash
git add shared/brand.css assets/fonts package.json package-lock.json
git commit -m "feat(M4): self-host fonts + finalize flag-blue theme tokens in brand.css"
```

---

## Task 2 — Generate the flag asset

**Files:**
- Create: `scripts/gen-flag.py`, `assets/vub-usflag.svg`

- [ ] **Step 1: Create `scripts/gen-flag.py`:**

```python
#!/usr/bin/env python3
"""Generate an accurate public-domain 50-star US flag SVG with a wind-ripple filter."""
import math, pathlib
W, H, UW, UH = 1235, 650, 494, 350
RED, BLUE = "#B31942", "#0A3161"   # theme Old Glory Red / Blue
r, ir = 18.0, 18.0 * 0.382
pts = " ".join(
    f"{(r if k%2==0 else ir)*math.cos(math.radians(-90+k*36)):.2f},"
    f"{(r if k%2==0 else ir)*math.sin(math.radians(-90+k*36)):.2f}" for k in range(10))
L = ['<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1235 650" preserveAspectRatio="xMidYMid slice">',
     '<defs>',
     '<filter id="flagwave" x="-12%" y="-12%" width="124%" height="124%">',
     '<feTurbulence type="fractalNoise" baseFrequency="0.006 0.018" numOctaves="2" seed="6" result="n">',
     '<animate attributeName="baseFrequency" dur="18s" repeatCount="indefinite" calcMode="spline"'
     ' keyTimes="0;0.5;1" values="0.006 0.016;0.010 0.024;0.006 0.016"'
     ' keySplines="0.45 0 0.55 1;0.45 0 0.55 1"/>',
     '</feTurbulence>',
     '<feDisplacementMap in="SourceGraphic" in2="n" scale="26" xChannelSelector="R" yChannelSelector="G"/>',
     '</filter>',
     f'<polygon id="s" points="{pts}" fill="#fff"/>',
     '</defs>',
     '<g filter="url(#flagwave)">']
sh = H / 13
for i in range(13):
    L.append(f'<rect x="0" y="{i*sh:.3f}" width="{W}" height="{sh:.3f}" fill="{RED if i%2==0 else "#ffffff"}"/>')
L.append(f'<rect x="0" y="0" width="{UW}" height="{UH}" fill="{BLUE}"/>')
csp, rsp = UW/12, UH/10
for row in range(1, 10):
    for c in (range(1, 12, 2) if row % 2 else range(2, 11, 2)):
        L.append(f'<use href="#s" x="{c*csp:.2f}" y="{row*rsp:.2f}"/>')
L.append('</g></svg>')
pathlib.Path("assets/vub-usflag.svg").write_text("\n".join(L), encoding="utf-8")
print("wrote assets/vub-usflag.svg")
```

- [ ] **Step 2: Run it.**
```bash
python scripts/gen-flag.py
grep -c '<use ' assets/vub-usflag.svg   # expect 50
```
Expected: prints path; `50` stars.

- [ ] **Step 3: Commit.**
```bash
git add scripts/gen-flag.py assets/vub-usflag.svg
git commit -m "feat(M4): add accurate 50-star US flag SVG (rippling) + generator"
```

---

## Task 3 — `shared/shell.css`

**Files:**
- Create: `shared/shell.css`

- [ ] **Step 1: Create `shared/shell.css`** (app bar, breadcrumb, footer — tokens only):

```css
/* shared/shell.css — injected app bar / breadcrumb / footer. Theme via brand.css tokens. */
.vub-appbar{position:sticky;top:0;z-index:40;background:linear-gradient(180deg,#0C2E55,var(--navy-deep));border-bottom:2px solid var(--gold);box-shadow:0 2px 18px rgba(0,0,0,.35)}
.vub-appbar .in{max-width:1080px;margin:0 auto;padding:0 24px;display:flex;align-items:center;gap:16px;height:70px}
.vub-appbar a.home{display:flex;align-items:center;gap:12px;text-decoration:none}
.vub-appbar img.seal{height:46px;width:auto;display:block;filter:drop-shadow(0 1px 3px rgba(0,0,0,.5))}
.vub-appbar .bn{font-family:var(--font-display);font-weight:800;color:#fff;font-size:20px;line-height:1.05}
.vub-appbar .bt{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:var(--gold-light)}
.vub-appbar .sp{flex:1}
.vub-controls{display:flex;align-items:center;gap:10px}
.vub-textsize{display:inline-flex;align-items:center;gap:8px;border:1px solid var(--navy-light);border-radius:10px;padding:5px 8px 5px 12px;color:#EAF0FA}
.vub-textsize .lab{font-size:13px;font-weight:600}
.vub-textsize button{all:unset;cursor:pointer;color:#fff;min-width:34px;min-height:38px;display:inline-flex;align-items:center;justify-content:center;border:1px solid var(--navy-light);border-radius:8px;font-weight:700}
.vub-textsize button.plus{font-size:19px}.vub-textsize button.minus{font-size:15px}
.vub-help,.vub-instr{display:inline-flex;align-items:center;gap:7px;height:42px;padding:0 16px;border-radius:10px;font-size:14.5px;font-weight:700;text-decoration:none}
.vub-help{border:1px solid var(--navy-light);color:#EAF0FA}.vub-help .i{color:var(--gold-light)}
.vub-instr{background:var(--red);border:1px solid var(--red-dark);color:#fff;box-shadow:0 2px 10px rgba(179,25,66,.45)}
.vub-help:hover{background:rgba(94,134,196,.28)}.vub-instr:hover{background:var(--red-dark)}
/* breadcrumb (used by lessons in M5) */
.vub-crumb{background:#F3EFE7;border-bottom:1px solid var(--border);font-size:14px;color:var(--muted)}
.vub-crumb .in{max-width:1080px;margin:0 auto;padding:8px 24px}
.vub-crumb b{color:var(--navy)} .vub-crumb a{color:var(--navy-mid)}
/* footer */
.vub-footer{background:linear-gradient(180deg,#0C2E55,#05192F);color:#AEC0DA;border-top:2px solid var(--gold)}
.vub-footer .in{max-width:1080px;margin:0 auto;padding:24px;display:flex;gap:14px;align-items:center;justify-content:center;text-align:center;font-size:.95rem}
.vub-footer img{height:30px;width:auto}
/* suppress glossary's own floating FAB when the shell provides Help */
body.vub-has-shell .vub-help-fab{display:none!important}
.vub-appbar :focus-visible,.vub-footer :focus-visible{outline:3px solid var(--gold-light);outline-offset:3px;border-radius:6px}
@media (max-width:640px){.vub-appbar .bt{display:none}.vub-textsize .lab{display:none}}
```

- [ ] **Step 2: Commit.**
```bash
git add shared/shell.css
git commit -m "feat(M4): add shell.css (app bar, breadcrumb, footer)"
```

---

## Task 4 — `shared/shell.js`

**Files:**
- Create: `shared/shell.js`

- [ ] **Step 1: Create `shared/shell.js`** (IIFE, mirrors `progress.js`/`glossary.js` style):

```javascript
/**
 * VubShell — injects the shared app bar + footer on any page that includes it.
 * Owns the Text-Size control (persisted) and the Help hook (VubGlossary).
 * Reads optional window.VUB_PAGE = { course, lesson } for the breadcrumb (M5).
 */
(function (global) {
  'use strict';
  var TS_KEY = 'vub:textsize:v1';
  var SIZES = ['', 'lg', 'xl'];                 // '' = default
  var SEAL = '/assets/vub-seal-white.png';

  function el(html) { var t = document.createElement('template'); t.innerHTML = html.trim(); return t.content.firstChild; }

  function applyTextSize(v) {
    if (v) document.documentElement.setAttribute('data-text-size', v);
    else document.documentElement.removeAttribute('data-text-size');
  }
  function readSize() { try { return localStorage.getItem(TS_KEY) || ''; } catch (e) { return ''; } }
  function writeSize(v) { try { localStorage.setItem(TS_KEY, v); } catch (e) {} }
  function step(dir) {
    var i = SIZES.indexOf(readSize()); if (i < 0) i = 0;
    i = Math.min(SIZES.length - 1, Math.max(0, i + dir));
    writeSize(SIZES[i]); applyTextSize(SIZES[i]);
  }

  function buildAppBar() {
    var bar = el(
      '<header class="vub-appbar"><div class="in">' +
        '<a class="home" href="/" aria-label="VUB Learning home">' +
          '<img class="seal" src="' + SEAL + '" alt="Veterans Upward Bound seal">' +
          '<span><span class="bn">VUB Learning</span><br><span class="bt">Veterans Upward Bound</span></span>' +
        '</a>' +
        '<span class="sp"></span>' +
        '<nav class="vub-controls" aria-label="Site controls">' +
          '<span class="vub-textsize"><span class="lab">Text Size</span>' +
            '<button type="button" class="minus" aria-label="Decrease text size">−</button>' +
            '<button type="button" class="plus" aria-label="Increase text size">+</button></span>' +
          '<a class="vub-help" href="#" role="button"><span class="i" aria-hidden="true">?</span> Help</a>' +
          '<a class="vub-instr" href="/instructors/">For Instructors <span aria-hidden="true">▸</span></a>' +
        '</nav>' +
      '</div></header>');
    bar.querySelector('.minus').addEventListener('click', function () { step(-1); });
    bar.querySelector('.plus').addEventListener('click', function () { step(1); });
    bar.querySelector('.vub-help').addEventListener('click', function (e) {
      e.preventDefault();
      if (global.VubGlossary && global.VubGlossary.open) global.VubGlossary.open();
    });
    return bar;
  }

  function buildBreadcrumb() {
    var p = global.VUB_PAGE; if (!p || !p.course) return null;
    var html = '<div class="vub-crumb"><div class="in"><a href="/">Home</a> › <b>' +
      p.course + '</b>' + (p.lesson ? ' › ' + p.lesson : '') + '</div></div>';
    return el(html);
  }

  function buildFooter() {
    return el('<footer class="vub-footer"><div class="in">' +
      '<img src="' + SEAL + '" alt=""> A TRIO program · U.S. Department of Education · Veterans Upward Bound' +
      '</div></footer>');
  }

  function init() {
    document.body.classList.add('vub-has-shell');     // hides glossary's duplicate FAB (see shell.css)
    applyTextSize(readSize());
    var bar = buildAppBar();
    document.body.insertBefore(bar, document.body.firstChild);
    var crumb = buildBreadcrumb();
    if (crumb) bar.insertAdjacentElement('afterend', crumb);
    document.body.appendChild(buildFooter());
    // reduced-motion: pause SMIL flag animation so motion-off users get a still flag
    if (global.matchMedia && global.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      try { (document.querySelector('svg.vub-flag') || document).pauseAnimations && document.querySelector('svg.vub-flag').pauseAnimations(); } catch (e) {}
      document.documentElement.classList.add('vub-reduced-motion');
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
  else init();

  global.VubShell = { applyTextSize: applyTextSize, init: init };
})(window);
```

- [ ] **Step 2: Sanity-load in a scratch page.**
```bash
printf '%s' '<!doctype html><html><head><link rel="stylesheet" href="/shared/brand.css"><link rel="stylesheet" href="/shared/shell.css"></head><body><main style="height:1200px"></main><script src="/shared/glossary.js"></script><script src="/shared/shell.js"></script></body></html>' > _shelltest.html
npx serve . -l 5050 >/dev/null 2>&1 & sleep 2
curl -s http://localhost:5050/_shelltest.html | grep -c "shell.js"   # 1
kill %1 2>/dev/null; rm _shelltest.html
```
Expected: `1` (page references shell.js). *(Full visual/behavior is asserted by Playwright in Task 8.)*

- [ ] **Step 3: Commit.**
```bash
git add shared/shell.js
git commit -m "feat(M4): add shell.js (inject app bar/footer, Text-Size control, Help hook, reduced-motion)"
```

---

## Task 5 — `courses.json`: add `progressKey`

**Files:**
- Modify: `courses.json`

- [ ] **Step 1: Add `"progressKey"` to each course object** (right after `"type"`):
  - computer-skills → `"progressKey": "ics",`
  - financial-readiness → `"progressKey": "fr",`

- [ ] **Step 2: Validate JSON.**
```bash
node -e "const c=require('./courses.json');console.log(c.courses.map(x=>x.id+':'+x.progressKey).join(' '))"
```
Expected: `computer-skills:ics financial-readiness:fr`

- [ ] **Step 3: Commit.**
```bash
git add courses.json
git commit -m "feat(M4): add progressKey to courses.json for catalog progress mapping"
```

---

## Task 6 — Rebuild `index.html` (homepage)

**Files:**
- Replace: `index.html`
- Reference (port styles from): `docs/specs/m4-homepage-reference.html`

> **Approach:** the homepage *layout/visual* (hero, flag, cards, split, branches) is the locked reference comp. We reproduce it as the production page with three adaptations: (a) **no Google Fonts `<link>`** — fonts come from `brand.css` `@font-face`; (b) **course cards render from `courses.json`** at runtime instead of being hard-coded; (c) the **app bar + footer are injected by `shell.js`**, so they are *removed* from the page body. The hero **flag SVG is inlined** (SMIL animation does not run from `<img>`).

- [ ] **Step 1: Write the failing test first (drives the data-binding contract).** *(full test lives in Task 8; create just this case now)* — create `tests/content/homepage-catalog.spec.js`:

```javascript
const { test, expect } = require('@playwright/test');
test('homepage renders a card per course in courses.json', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('[data-course-card]');
  await expect(cards).toHaveCount(2);                       // 2 courses today; grows with courses.json
  await expect(page.getByRole('heading', { name: 'VUB Financial Readiness' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Intermediate Computer Skills' })).toBeVisible();
  await expect(cards.first().getByRole('link', { name: /Open course/i })).toBeVisible();
});
```

- [ ] **Step 2: Run it; verify it fails.**
```bash
npm run build:site && npx playwright test tests/content/homepage-catalog.spec.js -g "card per course"
```
Expected: FAIL (no `[data-course-card]` yet / old homepage).

- [ ] **Step 3: Replace `index.html`** with the structure below. Copy the `<style>` block for `.welcome/.hero*/.section/.cards/.card/.split/.branches/.cta-row/etc.` **verbatim from `docs/specs/m4-homepage-reference.html`** (the `:root` token duplication there is NOT needed — tokens come from `brand.css`; keep only the layout/component rules). Copy the **inline `<svg class="usflag">`** flag from the reference into the hero and **add `class="vub-flag"`** to it (so `shell.js` can pause it for reduced-motion). Wire the head + scripts + the card renderer exactly as:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>VUB Learning — Veterans Upward Bound</title>
  <link rel="icon" href="/assets/favicon.ico">
  <link rel="apple-touch-icon" href="/assets/apple-touch-icon-180.png">
  <link rel="stylesheet" href="/shared/brand.css">
  <link rel="stylesheet" href="/shared/shell.css">
  <style>
    /* PORT the homepage layout rules (.welcome, .hero*, .section, .cards, .card,
       .split, .branches, .cta-row, .bunting top, .vub-tricolor usage, .stars, .medal,
       .badge, etc.) from docs/specs/m4-homepage-reference.html here.
       Do NOT copy its :root{} (tokens live in brand.css) or its Google Fonts <link>. */
  </style>
</head>
<body class="vub-brand">
  <div class="vub-bunting" aria-hidden="true"></div>
  <!-- app bar injected by shell.js -->

  <section class="welcome">
    <!-- PASTE inline <svg class="usflag vub-flag" ...>…ripple flag…</svg> from the reference -->
    <div class="scrim" aria-hidden="true"></div>
    <!-- PASTE the twinkling <svg class="stars">…</svg> from the reference -->
    <div class="container grid">
      <div>
        <span class="eyebrow"><span class="st">★ ★ ★</span> A U.S. Department of Education TRIO Program</span>
        <h1>Serve Your Country.<br><span class="ac">Serve Your Future.</span></h1>
        <p>Free, self-paced computer and financial-readiness courses — built to honor those who served.</p>
        <div class="cta-row">
          <a class="hero-primary" href="#courses">Browse courses <span aria-hidden="true">→</span></a>
          <a class="hero-ghost" href="/instructors/">For Instructors ▸</a>
        </div>
      </div>
      <div class="medal"><img src="/assets/vub-seal-white.png" alt=""></div>
    </div>
  </section>
  <div class="vub-tricolor"></div>

  <main class="container">
    <section class="section" id="courses">
      <div class="sectionhead"><h2>Choose Your Course</h2><p>Open a course to begin — start wherever your class is working.</p></div>
      <div class="cards" id="courseCards"><!-- rendered from courses.json --></div>
    </section>
    <section class="split">
      <div class="panel"><span class="ic">🎓</span><div><h4>For Students</h4><p>Open a course, work at your own pace, and take your pre/post tests right in the browser.</p></div></div>
      <div class="panel instr2"><span class="ic">🧑‍🏫</span><div><h4>For Instructors</h4><p>Syllabi, teacher guides, printable handouts, the intake form, and class pages.</p><a class="go" href="/instructors/">Enter the instructor area ▸</a></div></div>
    </section>
  </main>

  <!-- PASTE the <section class="branches">…six badges…</section> from the reference -->

  <div class="vub-tricolor"></div>
  <div class="vub-bunting" aria-hidden="true" style="transform:scaleY(-1)"></div>
  <!-- footer injected by shell.js -->

  <script src="/shared/progress.js"></script>
  <script src="/shared/glossary.js" defer></script>
  <script src="/shared/shell.js" defer></script>
  <script>
  /* Render course cards from courses.json (data-driven; add a course = edit JSON) */
  (function () {
    fetch('/courses.json').then(function (r) { return r.json(); }).then(function (data) {
      var wrap = document.getElementById('courseCards');
      (data.courses || []).forEach(function (c) {
        var card = document.createElement('article');
        card.className = 'card';
        card.setAttribute('data-course-card', c.id);
        card.innerHTML =
          '<div class="accent"></div><div class="pad">' +
          '<span class="cat"><span class="s">★</span> ' + (c.id === 'financial-readiness' ? 'Finance' : 'Computer Skills') + '</span>' +
          '<h3>' + c.title + '</h3>' +
          '<p class="meta">' + (c.subtitle || '') + '</p>' +
          '<div class="actions">' +
            '<a class="btn" href="/' + c.entry + '">Open course <span class="arrow" aria-hidden="true">→</span></a>' +
            '<span class="testlinks">Tests: <a href="/' + c.preTest + '">Pre-test</a><span class="sep">·</span><a href="/' + c.postTest + '">Post-test</a></span>' +
          '</div></div>';
        wrap.appendChild(card);
      });
    });
  })();
  </script>
</body>
</html>
```

- [ ] **Step 4: Run the test; verify it passes.**
```bash
npm run build:site && npx playwright test tests/content/homepage-catalog.spec.js -g "card per course"
```
Expected: PASS (2 cards, both course headings + Open course visible).

- [ ] **Step 5: Commit.**
```bash
git add index.html tests/content/homepage-catalog.spec.js
git commit -m "feat(M4): rebuild homepage — patriotic hero + data-driven course cards from courses.json"
```

---

## Task 7 — Build integration (`scripts/build-site.js`)

**Files:**
- Modify: `scripts/build-site.js`

- [ ] **Step 1: Inspect what the build copies.**
```bash
grep -nE "shared|assets|courses\.json|index\.html|ITEMS|REQUIRED_ITEMS|fonts" scripts/build-site.js
```
Expected: find the `ITEMS`/copy list + `REQUIRED_ITEMS` array.

- [ ] **Step 2: Ensure these paths are in the copy list (`ITEMS`)** (add any missing, matching the file's existing entry style):
`shared/` (whole dir, so `shell.css`/`shell.js` ride along), `assets/` (whole dir, so `fonts/` + `vub-usflag.svg` ride along), `courses.json`, `index.html`. If the build copies `shared/` and `assets/` as directories already, no change is needed beyond confirming.

- [ ] **Step 3: Add to `REQUIRED_ITEMS`** (so the build *fails loudly* if they go missing): `shared/shell.js`, `shared/shell.css`, `shared/brand.css`, `assets/vub-usflag.svg`, `assets/fonts/source-sans-3-latin-400-normal.woff2`, `courses.json`.

- [ ] **Step 4: Build and confirm assets land in `dist/site`.**
```bash
npm run build:site
for f in shared/shell.js shared/shell.css shared/brand.css assets/vub-usflag.svg assets/fonts/source-sans-3-latin-400-normal.woff2 courses.json index.html; do
  test -f "dist/site/$f" && echo "OK $f" || echo "MISSING $f"
done
```
Expected: all `OK`.

- [ ] **Step 5: Commit.**
```bash
git add scripts/build-site.js
git commit -m "feat(M4): build copies shell/fonts/flag/courses.json; REQUIRED_ITEMS guards them"
```

---

## Task 8 — Playwright: shell behavior + offline/no-CDN

**Files:**
- Create: `tests/functional/shell.spec.js`
- Modify: `tests/content/homepage-catalog.spec.js` (add the no-CDN case)

- [ ] **Step 1: Create `tests/functional/shell.spec.js`:**

```javascript
const { test, expect } = require('@playwright/test');

test('app bar is injected with seal-home link and controls', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('.vub-appbar')).toBeVisible();
  await expect(page.locator('.vub-appbar a.home')).toHaveAttribute('href', '/');
  await expect(page.locator('.vub-textsize')).toContainText('Text Size');
  await expect(page.locator('.vub-footer')).toContainText('U.S. Department of Education');
});

test('Text Size + persists across reload via data-text-size', async ({ page }) => {
  await page.goto('/');
  await page.locator('.vub-textsize button.plus').click();
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'lg');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'lg');
});

test('Help opens the glossary modal and the duplicate FAB is hidden', async ({ page }) => {
  await page.goto('/');
  await expect(page.locator('body.vub-has-shell')).toBeVisible();
  await page.locator('.vub-help').click();
  await expect(page.locator('.vub-help-overlay, .vub-help-modal')).toBeVisible();
});

test('reduced-motion: flag carries the gate class', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('html.vub-reduced-motion')).toBeVisible();
  await ctx.close();
});
```

- [ ] **Step 2: Add the no-CDN/offline case to `tests/content/homepage-catalog.spec.js`:**

```javascript
test('homepage has zero external CDN dependencies (offline-capable)', async ({ page }) => {
  const external = [];
  page.on('request', (req) => {
    const u = req.url();
    if (/^https?:\/\//.test(u) && !u.includes('localhost') && !u.startsWith('http://127.0.0.1')) external.push(u);
  });
  await page.goto('/');
  await page.waitForLoadState('networkidle');
  expect(external, 'no googleapis/gstatic/cdnjs requests').toEqual([]);
});
```

- [ ] **Step 3: Run the full suite.**
```bash
npm run build:site && npx playwright test tests/functional/shell.spec.js tests/content/homepage-catalog.spec.js
```
Expected: all PASS. *(If the glossary modal selector differs, confirm it against `shared/glossary.js` — it builds `.vub-help-overlay`/`.vub-help-modal`.)*

- [ ] **Step 4: Commit.**
```bash
git add tests/functional/shell.spec.js tests/content/homepage-catalog.spec.js
git commit -m "test(M4): shell injection, Text-Size persistence, Help, reduced-motion, no-CDN"
```

---

## Task 9 — Full build + regression smoke + finish

**Files:** none (verification)

- [ ] **Step 1: Full build + full Playwright suite (catch regressions in migrated pages).**
```bash
npm run build:site         # exit 0
npx playwright test        # all green
```
Expected: build exit 0; all tests pass.

- [ ] **Step 2: Manual offline check of the built homepage.**
```bash
npx serve dist/site -l 5060 >/dev/null 2>&1 & sleep 2
curl -s http://localhost:5060/ | grep -ciE 'fonts.googleapis|gstatic|cdnjs'   # expect 0
kill %1 2>/dev/null
```
Expected: `0`.

- [ ] **Step 3: Finish the development branch.** Announce and use **superpowers:finishing-a-development-branch** to verify tests and choose merge/PR.

---

## Self-Review

- **Spec coverage:** §3 theme tokens → Task 1; fonts offline → Task 1/7/8; flag motif → Task 2/6; shell (app bar/Text-Size/Help/footer/breadcrumb/reduced-motion) → Tasks 3–4/8; homepage adaptive one-page, no progress/resume, data-driven cards, Pre/Post links, split, branches → Task 6; `courses.json` progressKey → Task 5; build/no-CDN → Task 7/8; tests → Task 8/9; site-wide propagation → brand.css+shell.css+shell.js are reused (Tasks 1/3/4) and consumed by future milestones (out of M4 scope, noted in spec §8). **No gaps.**
- **Placeholders:** the only "paste from reference" steps point at a **committed** source file (`docs/specs/m4-homepage-reference.html`) with explicit adaptations — not vague TODOs. All JS/CSS/test code is complete.
- **Type/name consistency:** `data-course-card`, `.vub-appbar`, `.vub-textsize`, `.vub-flag`, `.vub-has-shell`, `data-text-size`, `VubShell`, `VubGlossary.open()`, `progressKey` are used identically across tasks. Glossary modal class (`.vub-help-overlay`/`.vub-help-modal`) matches `shared/glossary.js`.

---

*Plan only. No production code is written until execution begins under the chosen execution skill.*
