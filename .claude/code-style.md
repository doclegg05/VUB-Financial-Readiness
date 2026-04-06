# Code Style Rules

## HTML
- Use semantic HTML5 elements (`<section>`, `<nav>`, `<main>`, `<article>`)
- 4-space indentation (matches existing codebase)
- Double quotes for attributes
- Include `lang="en"` on `<html>`
- All new sections follow the pattern:
  ```html
  <section id="moduleN" class="section-pane">
      <div class="content-wrapper">
          <div class="module-header">
              <span class="module-eyebrow">Module N</span>
              <h1 class="module-title">Title Here</h1>
          </div>
          <!-- glass-panel blocks for content -->
      </div>
  </section>
  ```

## CSS
- All colors through CSS custom properties (`var(--clr-*)`)
- Never hardcode color values in component styles
- Dark mode support required: define overrides in `body.dark-mode` block
- Use existing utility classes: `.mt-3`, `.mt-4`, `.mt-6`, `.text-gold`, `.text-blue`
- BEM-lite naming: `.component`, `.component-element`, `.component--modifier`
- Mobile breakpoint: 768px (sidebar collapse)
- Tablet breakpoint: 1024px (padding reduction)

## JavaScript
- Vanilla JS only — no frameworks
- `'use strict'` or module scope
- `const` by default, `let` when mutation needed, never `var`
- DOM queries cached in variables at the top of scope
- Event delegation preferred over per-element listeners
- localStorage keys prefixed with app context (e.g., `'theme'`)
