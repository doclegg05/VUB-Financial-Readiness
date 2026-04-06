# Accessibility Rules

## Target: WCAG 2.1 AA

## Color & Contrast
- Minimum 4.5:1 contrast ratio for normal text (< 24px)
- Minimum 3:1 contrast ratio for large text (24px+)
- Never rely on color alone to convey information — pair with icons or text
- Both light and dark modes must meet contrast requirements

## Keyboard Navigation
- All interactive elements must be keyboard-accessible
- Visible focus indicators on all focusable elements
- Logical tab order following visual layout
- Sidebar nav links, theme toggle, and module cards must all be tabbable

## Screen Readers
- Use semantic heading hierarchy (h1 > h2 > h3, no skipping)
- `aria-label` on icon-only buttons (e.g., theme toggle)
- Meaningful link text (not "click here")
- Section landmarks with proper roles

## Audience Considerations
- Target audience is older veterans — prioritize readability
- Minimum body font: 16px (current smallest is 0.9rem ~14.4px at base 16)
- Line height: 1.6 minimum
- Avoid auto-playing content or timed interactions
- High-contrast mode should remain functional

## Testing Checklist
- [ ] Tab through entire page — all modules reachable
- [ ] Screen reader announces section changes
- [ ] Dark mode contrast passes
- [ ] Light mode contrast passes
- [ ] No information lost at 200% zoom
