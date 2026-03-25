# Add a New Module

Add a new module section to the Financial Readiness Course. Follow this process:

1. **Read existing modules** in `index.html` to match the HTML pattern
2. **Add sidebar nav link** with appropriate Font Awesome icon
3. **Create section** following the pattern:
   - `section#moduleN.section-pane` wrapper
   - `.content-wrapper` > `.module-header` with eyebrow + title
   - Content in `.glass-panel` blocks
   - Use `.grid-2-col` for side-by-side comparisons
   - Use `.info-callout` for tips, `.alert-warning` for cautions
   - Use `.feature-list` for bulleted items with icons
4. **Update navigation** in `script.js` if needed
5. **Test** dark mode, responsive layout, and keyboard navigation

Arguments:
- $ARGUMENTS: Module number, title, and topic description
