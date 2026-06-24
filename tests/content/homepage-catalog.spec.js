const { test, expect } = require('@playwright/test');
const fs = require('fs');
const path = require('path');

// Derive expectations from courses.json so the catalog stays self-validating
// as courses are added (no hard-coded course count).
const catalog = JSON.parse(
  fs.readFileSync(path.join(__dirname, '..', '..', 'courses.json'), 'utf8')
);

test('homepage renders one card per course in courses.json', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('[data-course-card]');
  await expect(cards).toHaveCount(catalog.courses.length);

  for (const course of catalog.courses) {
    const card = page.locator('[data-course-card="' + course.id + '"]');
    await expect(card).toHaveCount(1);
    // Each card shows its title, an "Open course" action, and pre/post test links.
    await expect(card.getByRole('heading', { name: course.title })).toBeVisible();
    await expect(card.getByRole('link', { name: /Open course/i })).toBeVisible();
    await expect(card.getByRole('link', { name: /Pre-test/i })).toBeVisible();
    await expect(card.getByRole('link', { name: /Post-test/i })).toBeVisible();
  }
});

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
