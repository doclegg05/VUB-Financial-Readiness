# AGENTS.md - VUB Financial Readiness Course

## Project Overview

**Project Name:** Veterans Upward Bound (VUB) Financial Readiness Course
**Deliverable:** Single-page web application with modular financial education content
**Purpose:** Financial literacy and retirement planning course for military veterans
**Audience:** Male veterans (mostly retired), older generation, learning in computer lab setting

---

## Architecture

### Current Structure

Single-page application with sidebar navigation, 5 content modules, dark/light theme toggle.

| File | Purpose |
|:-----|:--------|
| `index.html` | Single-page app shell with all module content |
| `css/styles.css` | Design system (CSS custom properties, responsive, dark mode) |
| `js/script.js` | Navigation, theme toggle, hash routing |

### External Dependencies

| Dependency | Source | Purpose |
|:-----------|:-------|:--------|
| Playfair Display + Source Sans 3 | Google Fonts CDN | Typography |
| Font Awesome 6.4 | cdnjs CDN | Icons |

---

## Course Modules

| Module | Topic | Focus |
|:-------|:------|:------|
| 1 | Retirement Timelines & Preparation | Social Security claiming strategy, TSP withdrawals |
| 2 | Disability Pay & Compensation | CRSC vs CRDP, VA Waiver, Social Security interaction |
| 3 | Healthcare & Long-Term Care | Medicare/TRICARE integration, Aid & Attendance |
| 4 | Managing Your Retirement Income | Tax-efficient withdrawals, RMDs, state tax impact, debt management |
| 5 | Legacy Planning | Survivor Benefit Plan (SBP), pros/cons analysis |

---

## Design System

### Color Palette (Navy & Gold)
```
Primary Navy:    #1e3a8a (light mode) / #3b82f6 (dark mode)
Primary Light:   #3b82f6
Gold Accent:     #fbbf24
Gold Hover:      #f59e0b
Background:      #f8fafc (light) / #0f172a (dark)
Surface:         #ffffff (light) / #1e293b (dark)
```

### Typography
- Headings: `Outfit` (500/700/800)
- Body: `Inter` (400/500/600)
- Minimum body text: 16px (0.9rem smallest used)

### Component Patterns
- `.glass-panel` — Card containers with border and shadow
- `.info-callout` — Highlighted tips with left border accent
- `.feature-list` — Icon-prefixed list items
- `.grid-2-col` — Two-column responsive grid
- `.card-grid` — Auto-fit card layout (min 300px)

---

## Behavioral Rules

- **DO NOT** break the single-page architecture — all modules live in `index.html`
- **DO NOT** add new CDN dependencies without discussion
- **DO NOT** remove dark mode support from any new content
- **DO** maintain the existing CSS custom property system for all colors
- **DO** ensure all new modules follow the existing HTML pattern (section > content-wrapper > module-header + glass-panels)
- **DO** keep all content veteran/military-focused with accurate benefit information
- **DO** test both light and dark modes when adding content
- **DO** maintain responsive behavior (sidebar collapses at 768px)

---

## Development Standards

### File Naming
- Lowercase with hyphens for any new files
- Keep flat structure — no deep nesting

### Code Style
- 4-space indentation in HTML/CSS/JS (matching existing files)
- CSS custom properties for all colors (never hardcode)
- Semantic HTML5 elements
- Comments for complex logic only

### Content Accuracy
- All financial/benefit information must be current and accurate
- VA, DoD, and federal benefit rules change — verify before adding
- Include disclaimers where appropriate ("consult a financial advisor")
- Cite specific regulations when referencing eligibility rules

---

## Modular Instructions

Additional rules are split into `.Codex/`:
- `code-style.md` — HTML/CSS/JS formatting and naming conventions
- `accessibility.md` — WCAG compliance, keyboard nav, contrast ratios
- `content-guidelines.md` — Veteran content accuracy and tone standards
