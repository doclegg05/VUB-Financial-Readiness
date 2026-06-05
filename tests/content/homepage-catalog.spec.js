const { test, expect } = require('@playwright/test');
test('homepage renders a card per course in courses.json', async ({ page }) => {
  await page.goto('/');
  const cards = page.locator('[data-course-card]');
  await expect(cards).toHaveCount(2);
  await expect(page.getByRole('heading', { name: 'VUB Financial Readiness' })).toBeVisible();
  await expect(page.getByRole('heading', { name: 'Intermediate Computer Skills' })).toBeVisible();
  await expect(cards.first().getByRole('link', { name: /Open course/i })).toBeVisible();
});
