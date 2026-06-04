# VUB Platform — Milestone 2: Brand Foundation — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the VUB brand foundation — process the official seal into web/print/favicon assets, author one canonical `shared/brand.css` design-token system (navy sampled from the seal, AAA contrast, 44px targets), and ship a visible brand-preview page — all **additive**, touching no course content and neither course subrepo.

**Architecture:** Pure static + a one-shot Python/Pillow generator. A single generator script turns `VUB Logo.png` (1200²) into a circular badge, a white-knockout variant, an SVG wrapper, and a favicon set under `assets/`. `shared/brand.css` consolidates all design tokens (today copy-pasted inline) into one source of truth. `assets/brand-preview.html` is a self-contained style sheet that consumes `brand.css` so the new identity is reviewable in a browser. The site-wide logo swap is intentionally **deferred to M4** (the shared shell centralizes the nav/footer/logo in one place), so M2 does not edit the soon-to-be-archived subrepos.

**Tech Stack:** Python 3.13 + Pillow 12.1 + numpy 2.4 (verified available). NOT available (do not use): ImageMagick/`magick`, `potrace`, `inkscape`, Node `sharp`/`jimp`; the `convert` on PATH is the Windows disk tool — never invoke it. SVG *tracing* is unavailable, so the SVG is a high-res raster wrapper (crisp at all display sizes ≤ source); true vectorization is an optional later enhancement requiring a `potrace` install.

**Source spec:** [2026-06-03-vub-platform-buildout-design.md](../specs/2026-06-03-vub-platform-buildout-design.md) §5.1.

**Repo context:** the platform repo now exists at the root (first commit `d04d382`, docs only). M2 commits new `tools/`, `assets/`, `shared/brand.css` to it. No subrepo is touched.

> **Plan location note:** flattened to `docs/plans/` (skill default `docs/superpowers/plans/` violates the 3-level depth rule).

---

## File Structure (all new; additive)

| File | Responsibility |
|---|---|
| `tools/brand/build-brand-assets.py` | One-shot generator: badge, white-knockout, SVG wrapper, favicons from `VUB Logo.png` |
| `assets/vub-seal-badge.png` | Circular navy-on-white seal badge (transparent corners) — works on light AND dark |
| `assets/vub-seal-white.png` | White-knockout seal (white linework, transparent) — for dark surfaces if needed |
| `assets/vub-seal.svg` | SVG wrapping the badge PNG (valid `.svg`, scales crisply) |
| `assets/favicon.ico` | Multi-size icon (16/32/48) |
| `assets/favicon-16.png` … `icon-512.png` | PNG icons (16/32/48/180/192/512) |
| `shared/brand.css` | The canonical design-token system (colors/type/spacing/radius/shadow/a11y) |
| `assets/brand-preview.html` | Self-contained brand sheet (logo variants on light+dark, palette+contrast, type, components) consuming `brand.css` |

**In M2 (Task 4):** wire the new seal + favicon into the three ROOT-level pages (`index.html`, `intake.html`, `syllabus-overview.html`) for an immediate live win — root-only, no subrepo edits. **Deferred to M4:** the subrepo pages' `vub-logo.svg` swap + the two `course-description.html` emoji mastheads (done when the shared shell centralizes the nav/footer, avoiding edits to the soon-archived subrepos).

---

### Task 1: Brand asset generator

**Files:**
- Create: `tools/brand/build-brand-assets.py`
- Produces: everything under `assets/` listed above

- [ ] **Step 1: Write the generator script**

```python
# tools/brand/build-brand-assets.py
# Generate VUB brand assets from the official seal (Python 3 + Pillow + numpy).
# Run from the platform root:  python tools/brand/build-brand-assets.py
import base64, io, os
from PIL import Image
import numpy as np

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
SRC  = os.path.join(ROOT, "VUB Logo.png")
OUT  = os.path.join(ROOT, "assets")
os.makedirs(OUT, exist_ok=True)

src = Image.open(SRC).convert("RGBA")
# Make it square (it already is 1200x1200, but be safe)
n = min(src.size); src = src.crop((0, 0, n, n)).resize((1200, 1200), Image.LANCZOS)
W = 1200

def circular_alpha(size):
    """Opaque inside the inscribed circle, transparent outside (anti-aliased via supersample)."""
    s = size * 4
    m = Image.new("L", (s, s), 0)
    from PIL import ImageDraw
    ImageDraw.Draw(m).ellipse((0, 0, s - 1, s - 1), fill=255)
    return m.resize((size, size), Image.LANCZOS)

# --- 1) Circular badge: navy-on-white disc, transparent corners ---
badge = src.copy()
badge.putalpha(circular_alpha(W))
badge.save(os.path.join(OUT, "vub-seal-badge.png"))

# --- 2) White-knockout: ink->opaque white, light->transparent, then circular clip ---
rgb = np.asarray(src.convert("RGB")).astype(np.float32)
lum = 0.299 * rgb[..., 0] + 0.587 * rgb[..., 1] + 0.114 * rgb[..., 2]
ink = lum < 140                      # navy linework
white_img = np.zeros((W, W, 4), np.uint8)
white_img[..., 0:3] = 255            # white
white_img[..., 3] = np.where(ink, 255, 0).astype(np.uint8)
white = Image.fromarray(white_img, "RGBA")
ca = np.asarray(circular_alpha(W))
wa = np.asarray(white.split()[3])
white.putalpha(Image.fromarray(np.minimum(wa, ca)))
white.save(os.path.join(OUT, "vub-seal-white.png"))

# --- 3) Favicons / app icons from the badge ---
for px in (512, 192, 180, 48, 32, 16):
    name = {512: "icon-512.png", 192: "icon-192.png", 180: "apple-touch-icon-180.png",
            48: "favicon-48.png", 32: "favicon-32.png", 16: "favicon-16.png"}[px]
    badge.resize((px, px), Image.LANCZOS).save(os.path.join(OUT, name))
badge.save(os.path.join(OUT, "favicon.ico"),
           sizes=[(16, 16), (32, 32), (48, 48)])

# --- 4) SVG wrapper embedding the badge PNG (valid .svg, scales crisply) ---
buf = io.BytesIO(); badge.save(buf, format="PNG")
b64 = base64.b64encode(buf.getvalue()).decode()
svg = (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {W}" '
       f'role="img" aria-label="Veterans Upward Bound seal">'
       f'<image width="{W}" height="{W}" href="data:image/png;base64,{b64}"/></svg>')
open(os.path.join(OUT, "vub-seal.svg"), "w", encoding="utf-8").write(svg)

print("OK: wrote", len(os.listdir(OUT)), "files to", OUT)
```

- [ ] **Step 2: Run the generator**

Run: `python tools/brand/build-brand-assets.py`
Expected: `OK: wrote 10 files to ...assets`

- [ ] **Step 3: Verify outputs (dimensions + validity)**

Run:
```bash
python - <<'PY'
from PIL import Image; import os
A="assets"
for f in ["vub-seal-badge.png","vub-seal-white.png","favicon.ico","icon-512.png","favicon-16.png"]:
    im=Image.open(os.path.join(A,f)); print(f, im.size, im.mode)
print("svg bytes:", os.path.getsize(os.path.join(A,"vub-seal.svg")))
PY
```
Expected: badge 1200×1200 RGBA, white 1200×1200 RGBA, favicon.ico present, icon-512 512×512, favicon-16 16×16, svg non-trivial byte count.

- [ ] **Step 4: Visually sanity-check the knockout** (badge transparent corners + white variant has transparent background) by opening `assets/vub-seal-badge.png` and `assets/vub-seal-white.png`. If the white-knockout threshold (140) clips too much/little of the eagle detail, adjust the `lum < 140` constant and re-run Step 2.

---

### Task 2: Canonical design tokens — `shared/brand.css`

**Files:**
- Create: `shared/brand.css`

- [ ] **Step 1: Write `shared/brand.css`** (navy sampled from the seal = `#312C4C`)

```css
/* shared/brand.css — VUB design tokens (single source of truth).
   Navy sampled from the official seal ink (#312C4C). Targets WCAG AAA for body text. */
:root {
  /* Brand navy (from the seal) */
  --navy:        #312C4C;   /* primary brand / body text on light (AAA on white & cream) */
  --navy-deep:   #211D38;   /* hero / footer backgrounds */
  --navy-mid:    #3D3760;
  --navy-light:  #4A4470;   /* hover states on dark */
  /* Gold accents — large text / accents ONLY, never small body */
  --gold:        #C9A227;
  --gold-light:  #E4C45A;
  --gold-pale:   #F5E9C0;
  /* Patriotic accent */
  --crimson:     #B31942;
  --crimson-dark:#8B1432;
  /* Neutrals / surfaces */
  --white:       #FFFFFF;
  --cream:       #FDF9F4;   /* soft page bg (kinder to older eyes than stark white) */
  --off-white:   #F5F7FA;
  --ink:         #1A2230;   /* default body text (AAA on cream) */
  --muted:       #51606E;   /* secondary text — keep >=4.5:1 on cream */
  --border:      #D8D0C0;
  /* Status (icon + text always accompany color) */
  --success:#1E7F44; --danger:#C2283C; --warning:#B5840B; --info:#1A6E86;
  /* Focus */
  --focus:       #F5C84C;

  /* Typography */
  --font-display:'Playfair Display', Georgia, 'Times New Roman', serif;
  --font-body:   'Source Sans 3', 'Segoe UI', Tahoma, Verdana, sans-serif;
  --fs-base: 18px;    /* min reading size */
  --fs-slide: 24px;   /* on-screen lesson body */
  --fs-h1: clamp(2rem, 4vw, 3rem);
  --fs-h2: clamp(1.6rem, 3vw, 2.25rem);
  --fs-h3: 1.3rem;
  --fs-small: 0.95rem;
  --lh: 1.7;          /* generous line-height */

  /* Spacing / shape */
  --space-1:.25rem; --space-2:.5rem; --space-3:.75rem; --space-4:1rem;
  --space-6:1.5rem; --space-8:2rem; --space-12:3rem;
  --radius: 12px; --radius-sm: 6px;
  --shadow-card: 0 8px 40px rgba(33,29,56,.12), 0 2px 8px rgba(33,29,56,.06);
  --shadow-hover:0 20px 60px rgba(33,29,56,.20), 0 4px 16px rgba(33,29,56,.10);

  /* Accessibility */
  --tap-min: 44px;    /* min interactive target */
}

/* Older-learner text-size control hook: set data-text-size on <html> */
html[data-text-size="lg"]  { --fs-base: 20px; --fs-slide: 28px; --lh: 1.8; }
html[data-text-size="xl"]  { --fs-base: 22px; --fs-slide: 32px; --lh: 1.85; }

/* Baseline applications (opt-in via class to avoid disturbing existing pages in M2) */
.vub-brand, .vub-brand body {
  font-family: var(--font-body);
  font-size: var(--fs-base);
  line-height: var(--lh);
  color: var(--ink);
  background: var(--cream);
}
.vub-brand :is(a,button):focus-visible { outline: 3px solid var(--focus); outline-offset: 3px; border-radius: 4px; }
.vub-brand :is(button,.btn,[role="button"]) { min-height: var(--tap-min); }
.vub-brand h1,.vub-brand h2,.vub-brand h3 { font-family: var(--font-display); color: var(--navy); line-height: 1.15; }

@media (prefers-reduced-motion: reduce) { * { animation: none !important; transition: none !important; } }
```

> Note: `brand.css` is scoped under `.vub-brand` so authoring it in M2 changes NO existing page. M4 applies it globally via the shared shell.

- [ ] **Step 2: Confirm AAA contrast of the key pairs**

Run:
```bash
python - <<'PY'
def L(h):
    h=h.lstrip('#'); r,g,b=[int(h[i:i+2],16)/255 for i in (0,2,4)]
    f=lambda c:(c/12.92) if c<=.03928 else ((c+.055)/1.055)**2.4
    return .2126*f(r)+.7152*f(g)+.0722*f(b)
def ratio(a,b):
    la,lb=L(a),L(b); hi,lo=max(la,lb),min(la,lb); return round((hi+.05)/(lo+.05),2)
for fg,bg,label in [("#312C4C","#FFFFFF","navy/white"),("#312C4C","#FDF9F4","navy/cream"),
                    ("#1A2230","#FDF9F4","ink/cream"),("#51606E","#FDF9F4","muted/cream")]:
    print(f"{label:14} {ratio(fg,bg)}:1")
PY
```
Expected: navy/white and navy/cream ≥ 7:1 (AAA); ink/cream ≥ 7:1; muted/cream ≥ 4.5:1 (AA for secondary). If `muted` falls below 4.5:1, darken `--muted` until it passes and re-run.

---

### Task 3: Visible brand sheet — `assets/brand-preview.html`

**Files:**
- Create: `assets/brand-preview.html`

- [ ] **Step 1: Write the brand-preview page** (self-contained; loads `../shared/brand.css` + the seal variants)

```html
<!DOCTYPE html>
<html lang="en" class="vub-brand" data-text-size="">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>VUB Brand Sheet</title>
<link rel="icon" href="favicon.ico">
<link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;800&family=Source+Sans+3:wght@400;600;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../shared/brand.css">
<style>
  body{margin:0;padding:var(--space-8);}
  .wrap{max-width:1000px;margin:0 auto;}
  .row{display:flex;gap:var(--space-6);flex-wrap:wrap;align-items:center;margin:var(--space-6) 0;}
  .chip{display:flex;align-items:center;justify-content:center;width:160px;height:160px;border-radius:var(--radius);}
  .on-light{background:var(--cream);border:1px solid var(--border);}
  .on-dark{background:var(--navy-deep);}
  .chip img{width:120px;height:120px;}
  .swatches{display:grid;grid-template-columns:repeat(auto-fill,minmax(150px,1fr));gap:var(--space-3);}
  .sw{border:1px solid var(--border);border-radius:var(--radius-sm);overflow:hidden;font-size:var(--fs-small);}
  .sw .fill{height:64px;} .sw .lbl{padding:.4rem .6rem;}
  .btn{display:inline-flex;align-items:center;gap:.5rem;padding:.75rem 1.5rem;border-radius:8px;
       font-weight:700;border:none;cursor:pointer;text-decoration:none;}
  .btn-gold{background:var(--gold);color:var(--navy);}
  .btn-navy{background:var(--navy);color:#fff;}
  .card{background:#fff;border:1px solid var(--border);border-radius:var(--radius);
        box-shadow:var(--shadow-card);padding:var(--space-6);max-width:360px;}
</style>
</head>
<body>
<div class="wrap">
  <h1>Veterans Upward Bound — Brand Sheet</h1>
  <p style="color:var(--muted)">Generated for Milestone 2. Logo, palette, type, and components from <code>shared/brand.css</code>.</p>

  <h2>Logo</h2>
  <div class="row">
    <div class="chip on-light"><img src="vub-seal.svg" alt="VUB seal on light"></div>
    <div class="chip on-dark"><img src="vub-seal-badge.png" alt="VUB seal badge on dark"></div>
    <div class="chip on-dark"><img src="vub-seal-white.png" alt="VUB seal white knockout on dark"></div>
  </div>

  <h2>Palette</h2>
  <div class="swatches" id="sw"></div>

  <h2>Type</h2>
  <p style="font-family:var(--font-display);font-size:var(--fs-h1)">Playfair Display — Display H1</p>
  <p style="font-family:var(--font-display);font-size:var(--fs-h2)">Playfair Display — H2</p>
  <p style="font-size:var(--fs-slide)">Source Sans 3 — slide/body 24px. Practical, accessible, built around the skills that matter.</p>
  <p style="font-size:var(--fs-base)">Source Sans 3 — base reading 18px, line-height 1.7.</p>

  <h2>Components</h2>
  <div class="row">
    <a class="btn btn-navy" href="#">Enter Course</a>
    <a class="btn btn-gold" href="#">Take Pre-Test</a>
  </div>
  <div class="card"><h3>Course card</h3><p style="color:var(--muted)">Sample card using brand tokens, shadow, and radius.</p></div>

  <h2>Text-size control (older-learner hook)</h2>
  <div class="row">
    <button class="btn btn-navy" onclick="document.documentElement.dataset.textSize=''">A (default)</button>
    <button class="btn btn-navy" onclick="document.documentElement.dataset.textSize='lg'">A+ (large)</button>
    <button class="btn btn-navy" onclick="document.documentElement.dataset.textSize='xl'">A++ (x-large)</button>
  </div>
</div>
<script>
  const tokens=[["--navy","Navy (seal)"],["--navy-deep","Navy deep"],["--gold","Gold"],
    ["--gold-light","Gold light"],["--crimson","Crimson"],["--cream","Cream"],
    ["--ink","Ink"],["--muted","Muted"]];
  const cs=getComputedStyle(document.documentElement);
  document.getElementById('sw').innerHTML=tokens.map(([v,n])=>{
    const c=cs.getPropertyValue(v).trim();
    return `<div class="sw"><div class="fill" style="background:${c}"></div><div class="lbl"><b>${n}</b><br>${c}</div></div>`;
  }).join('');
</script>
</body>
</html>
```

- [ ] **Step 2: Open the preview** (`assets/brand-preview.html`) in a browser and confirm: seal renders on light + dark, swatches show the sampled colors, both fonts load, A+/A++ buttons visibly enlarge text. Note any visual fix needed and adjust `brand.css`.

---

### Task 4: Homepage wire-in (root-level pages only)

**Files:**
- Modify: `index.html`, `intake.html`, `syllabus-overview.html` (all at the platform root — NOT subrepo files)

- [ ] **Step 1: Inventory current logo references in each root page**

Run:
```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"
for f in index.html intake.html syllabus-overview.html; do
  echo "== $f =="; grep -nE 'vub-logo\.svg|rel="icon"|<head' "$ROOT/$f" | head
done
```
Record each `vub-logo.svg` `src` (paths vary, e.g. `VUB Financial Readiness Course/assets/vub-logo.svg`) and whether a favicon `<link rel="icon">` already exists.

- [ ] **Step 2: Repoint each logo `<img src>` to the new root asset**

In each file, replace every `src=".../vub-logo.svg"` (whatever relative prefix it uses) with `src="assets/vub-seal.svg"`. Use exact-string replacement per occurrence; do not alter surrounding markup, `alt`, classes, width/height, or the emoji-shield mastheads (those are M4). Report the replacement count per file.

- [ ] **Step 3: Add a favicon link to each `<head>`** (only if none present)

Insert immediately after the existing `<title>…</title>` line:
```html
  <link rel="icon" href="assets/favicon.ico">
  <link rel="apple-touch-icon" href="assets/apple-touch-icon-180.png">
```

- [ ] **Step 4: Verify**

Run:
```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"
for f in index.html intake.html syllabus-overview.html; do
  echo "== $f =="; echo "old refs left: $(grep -c 'vub-logo.svg' "$ROOT/$f")"; echo "new refs: $(grep -c 'assets/vub-seal.svg' "$ROOT/$f")"; echo "favicon: $(grep -c 'rel=\"icon\"' "$ROOT/$f")"
done
[ -f "$ROOT/assets/vub-seal.svg" ] && echo "asset present" || echo "MISSING asset"
```
Expected: `old refs left: 0` in each; `new refs` ≥ 1; `favicon: 1`; asset present.

---

### Task 5: Verify & commit

**Files:** none new

- [ ] **Step 1: Secret scan (paths-only) over the new files**

Run:
```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"
grep -rIlE '(AKIA[0-9A-Z]{16}|gh[oprsu]_[0-9A-Za-z]{36}|-----BEGIN [A-Z ]*PRIVATE KEY-----|AIza[0-9A-Za-z_-]{35}|sk-[A-Za-z0-9]{32,})' "$ROOT/tools" "$ROOT/shared/brand.css" "$ROOT/assets" && echo "ABORT" || echo "secret scan: CLEAN"
```
Expected: `secret scan: CLEAN`.

- [ ] **Step 2: Stage ONLY the new brand files (no junk, no subrepos)**

Run:
```bash
ROOT="/c/Users/Instructor/Dev/curriculum/VUB Lessons"
git -C "$ROOT" add tools/brand/build-brand-assets.py shared/brand.css assets/ index.html intake.html syllabus-overview.html
git -C "$ROOT" diff --cached --name-only
git -C "$ROOT" diff --cached --name-only | grep -vE '^(tools/brand/|shared/brand.css|assets/|index\.html|intake\.html|syllabus-overview\.html)$' && echo "!!! UNEXPECTED STAGED" || echo "scope ok"
```
Expected: only the brand files (`tools/brand/build-brand-assets.py`, `shared/brand.css`, `assets/*`) and the three wired root pages staged; `scope ok`. (No subrepo files, no `VUB Logo.png`, no junk.)

- [ ] **Step 3: Commit**

Run:
```bash
git -C "$ROOT" commit -m "feat: add VUB brand foundation (seal assets, favicons, brand.css tokens, brand sheet)"
git -C "$ROOT" log --oneline -1
```
Expected: a new commit; report its hash + the staged file count + `git status` (course content + subrepos untouched).

---

## Self-Review

**Spec coverage (§5.1):** ✅ official seal → derivatives (T1: badge, white-knockout, SVG, favicons); ✅ sample seal navy → `--navy` `#312C4C` (done; T2); ✅ one `shared/brand.css` token system with AAA + 44px + text-size hook (T2); ✅ favicon (T1); ✅ visible brand identity (T3). **Deferred by design:** the live `vub-logo.svg` site-wide swap + the two emoji mastheads — moved to M4 (shared shell) to avoid editing the soon-archived subrepos; this deviation from §5.1's "swap now" is intentional and noted.

**Placeholder scan:** none — the generator, `brand.css`, and preview are complete; the one tunable constant (white-knockout `lum < 140`) has an explicit adjust-and-re-run step.

**Type/path consistency:** asset filenames are identical across the generator, the File Structure table, and `brand-preview.html` (`vub-seal-badge.png`, `vub-seal-white.png`, `vub-seal.svg`, `favicon.ico`). `--navy` `#312C4C` is consistent between the sampling result, `brand.css`, and the contrast check.

**Safety:** every task is additive (new files only); no existing page, course file, or subrepo is modified; `brand.css` is class-scoped (`.vub-brand`) so it changes nothing until M4 wires it.

---

## Execution Handoff

Two options:
1. **Subagent-Driven (recommended)** — one subagent for T1 (generation), one for T2–T3 (CSS + preview), I verify each artifact (open the images, run the contrast check) and the final commit.
2. **Inline** — run the four tasks in-session with checkpoints.

Either way, **Task 4's commit** is the only mutation, it is additive, and it touches neither course subrepo.
