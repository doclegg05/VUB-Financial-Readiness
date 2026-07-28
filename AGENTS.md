# AGENTS.md - VUB Intermediate Computer Skills Course

## Project Overview

**Project Name:** Veterans Upward Bound (VUB) Intermediate Computer Skills Course
**Deliverable:** Self-contained HTML Presentations with Supporting Materials
**Purpose:** 8-week intermediate computer skills training for veterans
**Course Dates:** February 9 - March 30, 2026 (Every Monday, 4:30–6:30 PM, 2 hours)

---

## Target Audience

- Male veterans (mostly retired)
- Completed Basic Computer Skills course
- Older generation not raised with technology
- Learning in computer lab with individual workstations

---

## Architecture

### Layer Structure

| Layer | Component | Location | Responsibility |
|:------|:----------|:---------|:---------------|
| **Presentation** | HTML Slides | `weeks/week-XX/presentation.html` | Interactive lesson delivery |
| **Styling** | CSS System | `css/` | VUB branding, accessibility |
| **Interaction** | JavaScript | `js/` | Navigation, quizzes, progress |
| **Content** | Handouts | `weeks/week-XX/handouts/` | Printed support materials |
| **Instructor** | Syllabi | `weeks/week-XX/syllabus.html` | Teaching guides |

---

## The 5 Questions (Discovery Phase)

### 1. North Star
Create professional, accessible HTML presentations that:
- Teach intermediate computer skills to veterans
- Build on Basic Computer Skills foundation
- Apply Adult Learning Theory (Andragogy) principles
- Measure improvement through pre/post assessments
- Provide instructor with comprehensive teaching guides

### 2. Integrations
| Service | Purpose | Status |
|:--------|:--------|:-------|
| VA.gov | VA portal navigation (Week 1) | External (screenshots only) |
| MyHealtheVet | Health portal lessons (Week 1) | External (screenshots only) |
| Windows OS | Keyboard shortcuts, window management, screenshots (Week 2) | Local system |
| Gmail | Email productivity lessons (Week 3) | External (screenshots only) |
| Google Drive | Cloud storage lessons (Week 6) | External (screenshots only) |
| Microsoft Office | Word/Excel lessons (Weeks 4-5) | External (screenshots only) |
| ChatGPT | AI introduction (Week 7) | External (screenshots only) |
| Local File System | Presentation hosting | Primary |
| GitHub Pages | Optional hosting | Secondary |

### 3. Source of Truth
- `MEMORY/state.json` for project development state
- `weeks/` for all lesson content
- `css/` and `js/` for presentation framework

### 4. Delivery Payload
```
VUB Lessons/
├── index.html                    # Course landing page
├── css/
│   ├── styles.css               # VUB design system
│   ├── slides.css               # Presentation styles
│   └── quiz.css                 # Assessment styles
├── js/
│   ├── navigation.js            # Slide navigation
│   └── quiz.js                  # Quiz engine
├── assets/images/               # Screenshots, icons
└── weeks/
    └── week-01 through week-08/ # Weekly content
```

### 5. Behavioral Rules (Do Nots)
- **DO NOT** embed copyrighted software screenshots without educational fair use justification
- **DO NOT** create external API dependencies (all assets local-first)
- **DO NOT** require internet connection for core presentation viewing
- **DO NOT** use fonts smaller than 24pt for slide body text
- **DO NOT** rely on color alone to convey information
- **DO** ensure full keyboard navigation accessibility
- **DO** keep all assets self-contained for offline use
- **DO** test across Chrome, Firefox, and Edge browsers

---

## 8-Week Curriculum

| Week | Date | Topic |
|:-----|:-----|:------|
| 1 | Feb 9 | **VA Online Services + Pre-Test** (VA.gov, MyHealtheVet, eBenefits) |
| 2 | Feb 16 | **Windows Tips & Productivity** (Keyboard Shortcuts, Window Management, Screenshots) |
| 3 | Feb 23 | Email Productivity (Gmail) |
| 4 | Mar 2 | Microsoft Word Intermediate |
| 5 | Mar 9 | Microsoft Excel Intermediate |
| 6 | Mar 16 | Cloud Computing & Google Drive |
| 7 | Mar 23 | Introduction to AI Tools |
| 8 | Mar 30 | Mobile Integration, Review, Post-Test |

### Curriculum Differentiation Note
Weeks 1-2 were redesigned to differentiate from the Basic Computer Skills course:
- **Old Week 1:** Advanced File Management (overlapped with Basic Session 2)
- **Old Week 2:** Internet Safety & Browser Features (overlapped with Basic Session 3)
- **New Week 1:** VA Online Services - highly relevant to veteran audience, builds on basic browser skills
- **New Week 2:** Windows Tips & Productivity - keyboard shortcuts, window snapping, screenshots, accessibility settings; builds foundational skills used every subsequent week

---

## Design System

### Color Palette (Navy/Patriotic Theme)
```css
--color-navy: #1B365D;           /* Primary brand */
--color-navy-dark: #0D1B2A;      /* Headers/footers */
--color-navy-light: #2C4A7C;     /* Hover states */
--color-red: #B31942;            /* CTA/highlights */
--color-red-dark: #8B1432;       /* Hover states */
--color-gold: #C9A227;           /* Achievements/accents */
--color-gold-light: #E6C65C;     /* Highlights */
--color-white: #FFFFFF;
--color-off-white: #F5F7FA;
--color-success: #28A745;
--color-danger: #DC3545;
--color-warning: #FFC107;
--color-info: #17A2B8;
```

### Typography (Accessibility for Older Learners)
```css
--font-primary: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
--font-heading: Georgia, 'Times New Roman', serif;
--font-size-base: 18px;          /* Minimum body text */
--font-size-slide: 24px;         /* Slide body text */
--font-size-heading: 36px;       /* Slide headings */
--line-height: 1.8;              /* Enhanced readability */
```

### Accessibility Standards (WCAG 2.1 AA)
- Minimum 4.5:1 contrast ratio for normal text
- Minimum 3:1 contrast ratio for large text (24px+)
- Full keyboard navigation support
- Visible focus indicators
- Screen reader compatible structure
- No auto-advancing content

---

## Development Standards

### File Depth
- **Never nest files or folders more than 3 levels deep** from the project root.
  - OK: `project/category/file.md`
  - OK: `project/category/subcategory/file.md`
  - NOT OK: `project/category/subcategory/deep/file.md`
- When creating new files or directories, check current depth first and flatten the structure if needed.

### File Naming
- Directories: lowercase with hyphens (`week-01`, `handouts`)
- HTML files: lowercase with hyphens (`presentation.html`, `pre-test.html`)
- CSS/JS files: lowercase with hyphens (`styles.css`, `navigation.js`)

### Code Style
- Semantic HTML5 elements
- CSS custom properties for theming
- No external CDN dependencies
- Comments for complex logic
- Consistent indentation (2 spaces)

### Presentation Structure
Each weekly presentation includes:
1. Title slide with learning objectives
2. Content slides (15-20 per week)
3. Handout prompt slides
4. Knowledge check slides
5. Summary slide
6. Completion celebration slide

### Navigation Features Required
- Forward/backward arrow buttons on screen
- Keyboard: Arrow keys, Page Up/Down, Home, End
- Chapter tabs for section jumping
- Progress bar with percentage
- Slide counter (X of Y)
- Touch/swipe support for tablets
- localStorage progress persistence

---

## Execution Protocol

### Before Any Work
1. Check `MEMORY/state.json` for current project state
2. Review this AGENTS.md for standards
3. Verify file paths exist before modifications

### When Building Content
1. **Plan First** - Outline slide content before coding
2. **Accessibility Check** - Verify font sizes, contrast, keyboard nav
3. **Test Navigation** - Confirm all navigation methods work
4. **Review Content** - Ensure 2-hour pacing per lesson
5. **Update State** - Log completion in MEMORY/state.json

### Weekly Deliverables Checklist
- [ ] `presentation.html` - 15-20 slides
- [ ] `syllabus.html` - Instructor guide with timing
- [ ] `handouts/` - 2-4 support materials
- [ ] Knowledge check questions embedded
- [ ] Completion celebration functional

---

## Adult Learning Theory Application

### Andragogy Principles (Malcolm Knowles)
1. **Self-Direction** - Clear objectives, learner choice
2. **Experience** - Build on prior knowledge, use examples
3. **Relevance** - Real-world veteran scenarios
4. **Problem-Centered** - Task-based learning, not theory
5. **Internal Motivation** - Independence, achievement

### Practical Applications
- Use veteran-specific scenarios (VA benefits, military records)
- Reference Basic Computer Skills knowledge
- Provide immediate hands-on practice
- Celebrate progress and achievements
- Connect skills to personal goals

---

## Project Structure

```
VUB Lessons/
├── AGENTS.md                     # Canonical agent briefing (project governance)
├── CLAUDE.md                     # Thin wrapper that imports AGENTS.md
├── index.html                    # Course landing page
├── css/
│   ├── styles.css               # VUB design system
│   ├── slides.css               # Presentation styles
│   └── quiz.css                 # Assessment styles
├── js/
│   ├── navigation.js            # Slide navigation system
│   └── quiz.js                  # Quiz/assessment engine
├── assets/
│   └── images/                  # Screenshots, icons, logos
├── weeks/
│   ├── week-01/
│   │   ├── presentation.html    # Week 1 slides
│   │   ├── syllabus.html        # Instructor guide
│   │   ├── pre-test.html        # Baseline assessment
│   │   └── handouts/            # Support materials
│   ├── week-02/ through week-07/
│   │   ├── presentation.html
│   │   ├── syllabus.html
│   │   └── handouts/
│   └── week-08/
│       ├── presentation.html
│       ├── syllabus.html
│       ├── post-test.html       # Final assessment
│       └── handouts/
└── MEMORY/
    └── state.json               # Project development state
```

---

## Current Status

**Phase:** Implementation Complete (All 8 Weeks)
**Last Update:** February 2026

> **Related course (June 2026):** A separate **Digital Literacy — Level 1** course (IC3 GS6-aligned; 5 weeks = 4 lessons + a review/testing day) was added to the platform at `courses/digital-literacy-1/` and the catalog (`courses.json`). It is the first rung of a planned Level 1 → 2 → 3 ladder and is independent of this 8-week Intermediate course. Design spec: `docs/specs/2026-06-24-digital-literacy-l1-design.md`. (The Remotion intro video is complete — rendered with an ElevenLabs voiceover at `video/digital-literacy-1/out/dl1-intro.mp4`. Per-week lesson-video sources are built and bundle cleanly; **Weeks 3 & 4 ship offline `video-transcript.html` pages** linked from the console. Rendering the per-week MP4s is the only outstanding video step — it needs an ElevenLabs API key + a few user-supplied hero/screenshot assets; see `video/digital-literacy-1/README.md` for the render runbook + asset checklist.)

### Completed Work
- [x] Week 1: VA Online Services presentation, syllabus, and 3 handouts
- [x] Week 1: Pre-test with updated question categories (VA Services, Video Conferencing)
- [x] Week 2: Windows Tips & Productivity presentation, syllabus, and 2 handouts
- [x] Week 8: Post-test updated to match pre-test categories

### Pre/Post Test Categories (20 questions total)
| Category | Questions |
|:---------|:----------|
| VA Online Services | 3 |
| Video Conferencing | 3 |
| Email (Gmail) | 3 |
| Microsoft Office (Word/Excel) | 5 |
| Cloud Computing | 3 |
| AI Tools | 3 |

### Week 1 Handouts
- `va-portals-quick-reference.html` - Overview of VA.gov, MyHealtheVet, eBenefits
- `va-login-checklist.html` - Step-by-step ID.me verification guide
- `myhealthevet-guide.html` - Secure messaging and prescription refills

### Week 2 Handouts
- `windows-workshop.html` - 4-part guided workshop (shortcuts, window management, screenshots, accessibility)
- `keyboard-shortcuts-reference.html` - Printable quick reference card for essential shortcuts

### Week 2 Legacy Handouts (used during Week 1 class, retained for reference)
- `zoom-quick-start.html` - Joining meetings, interface guide
- `video-call-checklist.html` - Pre-call preparation checklist
- `telehealth-tips.html` - VA Video Connect guide

---

*VUB Intermediate Computer Skills Course - Building Technology Confidence for Veterans*
