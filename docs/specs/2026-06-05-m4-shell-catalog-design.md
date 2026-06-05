# Milestone 4 — Shared Shell + Homepage Catalog + Patriotic Theme System — Design

- **Date:** 2026-06-05 · **Author:** brainstormed with Britt Legg (visual companion, section-by-section approval)
- **Status:** Design approved (homepage visual **locked**). Awaiting spec review → implementation plan.
- **Parent spec:** [2026-06-03-vub-platform-buildout-design.md](2026-06-03-vub-platform-buildout-design.md) §4, §5.1, §5.3 (Level 1), §7.
- **Predecessor:** M1 preflight, M2 brand foundation (seal + favicons + `brand.css`), M3 structure consolidation (canonical `/courses` + `/instructors`, `courses.json`, build/test toolchain at root). M3 complete at commit `b7ca51b`.
- **Visual reference comp (self-contained, renders the locked design):** [m4-homepage-reference.html](m4-homepage-reference.html). *(Uses preview shortcuts — a CDN font link + base64-inlined seal/flag — purely so it renders standalone; production self-hosts fonts and references files normally per §6.)*

---

## 1. Purpose & scope

M4 builds the **navigational + visual foundation** of the platform: a shared **page shell** (injected app bar / breadcrumb / footer), a rebuilt **homepage catalog**, and a single **theme system** (`brand.css` tokens) that **propagates the patriotic look to every page as each area is rebuilt**.

**In scope (M4):**
- `shared/shell.css` + `shared/shell.js` — the injected shell (app bar, footer, breadcrumb mechanism, text-size control, Help hook).
- Rebuilt `index.html` — a data-driven, adaptive one-page homepage catalog.
- The **patriotic theme system** finalized in `shared/brand.css` (tokens) + shared motifs (flag, stars, stripes, bunting, branch band) — authored so **every future page inherits it**.
- Self-hosted fonts; removal of all CDN dependencies (offline rule).
- `courses.json` gains a small `progressKey` per course.
- Extended Playwright coverage for the shell + homepage + offline check.

**Out of scope (later milestones, but the theme transfers to them):**
- **M5** — course consoles + per-lesson breadcrumb/back-next wrapping (the shell's breadcrumb is *built* in M4, *applied* in M5).
- **M6** — assessment engine polish (electronic test → printable PDF → auto-grade → result PDF + certificate). *Tracked as its own spec.*
- **M7** — instructors area, copy-link/self-serve, hosting/DNS.
- **New feature (own spec):** "teacher scans a test → interactive testing site + result PDF, no backend" — carries an OCR/AI-vs-no-backend tension to resolve before design.

**Non-goals:** no framework/LMS; no accounts/auth; no per-page restyle work beyond the homepage in M4; no changes to lesson content or scoring.

---

## 2. Goals

- A **familiar one-page dashboard** where "open a course" is obvious at a glance, with **no separate splash/Enter gate**.
- A **single theme system** that makes the patriotic identity consistent and **site-wide by construction** (edit tokens once → whole site updates).
- **Expandable by data:** adding a course/lesson is a `courses.json` edit + a folder, never hand-built catalog HTML.
- **Offline-capable** (computer lab): zero external CDNs.
- **Accessible for older/veteran learners:** AAA body contrast, ≥44px targets, persistent text-size control, visible focus, motion that respects `prefers-reduced-motion`.

---

## 3. Theme system (LOCKED) — `shared/brand.css` is the single source

The theme is **patriotic / military-honor**, built on the U.S. flag palette. `brand.css` holds every value; the shell + every page consume the tokens, so the look transfers everywhere.

### 3.1 Palette (CSS custom properties)
| Token | Value | Use |
|---|---|---|
| `--navy` | `#0A3161` | Old Glory Blue — primary brand / site chrome base |
| `--navy-deep` | `#07223F` | hero/app-bar/footer darkest |
| `--navy-mid` | `#123E72` | gradients, links |
| `--navy-light` | `#2C5AA0` | borders/hover on dark |
| `--blue-soft` | `#5E86C4` | soft accents |
| `--red` | `#B31942` | Old Glory Red — CTAs/accents (hero button, category, test underlines) |
| `--red-dark` | `#8B1432` | red hover |
| `--gold` / `--gold-light` | `#C9A227` / `#E4C45A` | medal/honor accents, focus rings, hairlines, stars |
| `--white` | `#FFFFFF` | cards, workhorse |
| `--cream` | `#FAF7F2` | page background (kinder than stark white) |
| `--ink` | `#16243A` | body text (AAA on cream/white) |
| `--muted` | `#46566D` | secondary text (≥4.5:1 on cream) |
| `--border` | `#E2DECF` | hairlines/dividers |

> **Brand note:** `--navy` moves from the seal's *sampled* indigo `#322E4C` (M2) to **flag blue `#0A3161`** for site chrome — a deliberate patriotic choice. The **seal mark itself keeps its official indigo** (a logo retains its own color); on dark surfaces we use the **white-knockout** seal so it never clashes.

### 3.2 Typography
- **Display:** Playfair Display (700–900) — headings only. **Body/UI:** Source Sans 3 (400–700).
- **Self-hosted** under `assets/fonts/` (woff2). **Remove the Google Fonts CDN.** Base 18px, line-height ~1.7, left-aligned, no justified/italic body.

### 3.3 Seal & iconography
- Seal assets exist (M2): `assets/vub-seal.svg`, `assets/vub-seal-white.png` (white-knockout for dark), favicons, `icon-192/512`, `apple-touch-icon-180`.
- App bar (small), hero **medallion** (gold-ringed), footer use the **white-knockout** seal.
- **Drop Font Awesome CDN** → inline SVG for the few icons.

### 3.4 Patriotic motifs (shared, reusable)
- **Hero waving flag:** accurate **public-domain 50-star US flag SVG** (9-row 6/5 star grid, 13 stripes, official proportions; theme red/blue), animated with an **SVG turbulence + displacement filter** (`feTurbulence` fractalNoise + `feDisplacementMap`, ~18s) for realistic cloth ripple, behind a navy scrim for text legibility.
- **Fan bunting** strip (CSS radial-gradient swags) top and above footer.
- **Star field** (SVG) with a **very subtle independent twinkle** (each star fades 72%→100% of its base opacity, staggered 6–9s).
- **Tricolor** (red/white/navy) divider bars.
- **"Honoring those who served — in every branch"** band: navy star-field with six branch badges.
- **Card accent:** solid navy bar + thin gold hairline (no busy color blocks).

### 3.5 Motion & accessibility rules
- All decorative motion (flag ripple, star twinkle, sheen, hover) is **gated by `prefers-reduced-motion: reduce`** → still flag, no twinkle. *(SMIL on the flag doesn't auto-respect this, so `shell.js`/page JS uses `matchMedia('(prefers-reduced-motion: reduce)')` to pause/replace the SMIL animation with a static frame.)*
- AAA body contrast; status/meaning never by color alone (icon + text + color); ≥44px tap targets; visible gold focus rings; skip-to-content; semantic landmarks.

---

## 4. Shared shell — `shared/shell.js` + `shared/shell.css`

Pattern matches the existing codebase (`progress.js`/`glossary.js`): a plain-JS IIFE that **injects markup on any page that includes it**, reading `brand.css` for theme and `courses.json` for context. Each file = one job.

### 4.1 `shell.js` responsibilities
- **App bar** (sticky, navy, gold underline): white-knockout **seal → links to `/` (home)**; brand wordmark; spacer; a labeled **"Text Size" −/+** control (plain-language label, not bare "A−/A+"); **Help**; **For Instructors** (red).
- **Text-size control:** toggles `html[data-text-size="lg"|"xl"]` (hooks already defined in `brand.css`), **persisted** in `localStorage` and re-applied on load.
- **Help:** calls `VubGlossary.open()`; **suppresses the duplicate floating Help FAB** that `glossary.js` auto-mounts when the shell is present (add a class/flag the shell sets; CSS hides `.vub-help-fab`).
- **Footer:** "A TRIO program · U.S. Department of Education · Veterans Upward Bound" + white-knockout seal + tricolor.
- **Breadcrumb (built in M4, applied in M5):** optional `Home › Course › Lesson` row driven by a small per-page config / `courses.json`; the homepage shows none.
- **Reduced-motion:** sets a flag the theme uses to disable decorative animation.

### 4.2 `shell.css`
- Styles only the shell (app bar, breadcrumb, footer) from `brand.css` tokens — no page-specific layout.

---

## 5. Homepage — rebuilt `index.html` (LOCKED layout)

Adaptive **one page** (no splash/Enter). Everything below the app bar renders from `courses.json` + `progress.js`.

1. **App bar + fan bunting** (shell).
2. **Hero:** waving-flag backdrop + scrim + twinkling stars; eyebrow `★ ★ ★ · A U.S. Department of Education TRIO Program`; headline **"Serve Your Country. Serve Your Future."**; one line of supporting copy; **Browse courses** (red) + **For Instructors** (gold-outline); seal **medallion**. *(One welcoming page for every visitor — no separate splash/"Enter" gate and no per-student progress state; the old "West Virginia" line and the badge chips are removed.)*
3. **Tricolor divider.**
4. **"Choose your course"** — section heading with star rule; **course cards rendered from `courses.json`**, each: category eyebrow (red star), Playfair title, one-line meta, **Open course** (navy CTA), and small **Pre-test · Post-test** links. **No progress counters / no resume banner** (shared-lab `localStorage` is not per-student → would mislead; "every class is different"). Grid **grows automatically** as courses are added.
5. **Students vs Instructors** split (role separation out of the footer).
6. **"Honoring those who served — in every branch"** band (six **placeholder star badges**; official DoD service seals are deferred pending licensing/clearance).
7. **Tricolor + bunting + footer.**

**`courses.json` change:** add `"progressKey": "ics" | "fr"` per course so cards can call `VubProgress` cleanly (the `statusKey` prefixes already imply it). No other data changes; lessons/tests already present.

---

## 6. Offline & assets
- Self-host Playfair Display + Source Sans 3 → `assets/fonts/*.woff2`; reference via `@font-face` in `brand.css`. Remove `fonts.googleapis.com` / `fonts.gstatic.com`.
- Remove the **Font Awesome** CDN; replace its icons with inline SVG.
- Add the production **flag SVG** (`assets/vub-usflag.svg`, generated: 50 stars / 13 stripes / theme colors / ripple filter).
- Favicons already wired (M2).
- **Result:** the homepage has **zero external network dependencies** (restores the offline-capable guarantee the old `index.html` broke).

---

## 7. Testing (extend Playwright)
- Shell **injects** the app bar + footer on the homepage; seal links to `/`.
- The **"Text Size" −/+** control toggles `html[data-text-size]` and **persists** across reload; buttons carry aria-labels ("Increase/Decrease text size").
- **Help** opens the glossary modal; no duplicate FAB when the shell is present.
- Every course in `courses.json` **renders a card** with working **Open course** + Pre/Post-test links.
- **Offline/no-CDN:** built `dist/site` homepage references no `googleapis`/`gstatic`/`cdnjs` URLs.
- `prefers-reduced-motion` → flag animation is static (no SMIL running).
- `npm run build:site` exits 0 and serves the new homepage.

---

## 8. Theme propagation plan (site-wide)
The theme transfers **by construction**, not by hand:
1. **`brand.css`** is the only place colors/type/tokens live — every page links it.
2. **`shell.js`/`shell.css`** put the same app bar/footer/breadcrumb on every page that includes them.
3. **M5** wraps course consoles + lesson decks with the shell (breadcrumb/back-next) and applies `brand.css` → consoles/lessons inherit the theme.
4. **M6** assessment templates + certificate consume `brand.css` (seal, flag-blue/red/gold, Playfair/Source Sans).
5. **M7** instructors area uses the same shell + tokens.
> Editing a token in `brand.css` re-themes the entire platform. Existing migrated pages (FR SPA, ICS slide decks) are re-skinned to `brand.css` in their respective milestones (M5/M6), not all in M4 — but they pull from the same source of truth.

---

## 9. Component boundaries
| File | One job | Depends on |
|---|---|---|
| `shared/brand.css` | theme tokens + `@font-face` + shared motif helpers | — |
| `shared/shell.css` | app-bar/breadcrumb/footer styling | `brand.css` |
| `shared/shell.js` | inject shell; text-size; Help hook; reduced-motion flag | `brand.css`, `glossary.js`, `courses.json` |
| `index.html` | homepage composition (hero/flag/cards/branches) | shell, `brand.css`, `progress.js`, `courses.json` |
| `assets/fonts/`, `assets/vub-usflag.svg` | self-hosted offline assets | — |
| `courses.json` | catalog data (+`progressKey`) | — |

---

## 10. Open items / risks
- **Flag-blue vs seal-indigo divergence** — accepted (chrome = flag blue; seal mark = its indigo). Documented so it isn't "fixed" later by mistake.
- **SMIL + reduced-motion** — must be JS-gated (`matchMedia`) since SMIL ignores the media query.
- **Turbulence filter performance** — one hero element; acceptable, but verify on low-end lab machines; fall back to a static flag if needed.
- **Branch service seals** — official DoD emblems have usage rules; M4 ships **star-badge placeholders**; real emblems require cleared assets (separate to-do, not a blocker).
- **Photo-real flag** — declined in favor of the crisp/offline vector; revisit only with a licensed/public-domain image.

---

*Design doc only. No production code is written until the implementation plan is approved.*
