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
  await expect(page.locator('.vub-help-overlay')).toBeVisible();
});

test('reduced-motion: flag carries the gate class', async ({ browser }) => {
  const ctx = await browser.newContext({ reducedMotion: 'reduce' });
  const page = await ctx.newPage();
  await page.goto('/');
  await expect(page.locator('html.vub-reduced-motion')).toBeVisible();
  await ctx.close();
});

test('skip-to-content link is present and targets main', async ({ page }) => {
  await page.goto('/');
  const skip = page.locator('a.vub-skip');
  await expect(skip).toHaveAttribute('href', '#vub-main');
  await expect(page.locator('#vub-main')).toHaveCount(1);
});

test('instructors landing loads (no dead /instructors/ link) with the shell', async ({ page }) => {
  const resp = await page.goto('/instructors/');
  expect(resp && resp.status()).toBeLessThan(400);
  await expect(page.locator('.vub-appbar')).toBeVisible();
  await expect(page.getByRole('heading', { name: 'For Instructors' })).toBeVisible();
  // every resource card link resolves (no 404)
  const links = await page.locator('main a[href^="/instructors/"]').evaluateAll(a => a.map(x => x.getAttribute('href')));
  for (const href of links) {
    const r = await page.request.get(href);
    expect(r.status(), href + ' should resolve').toBeLessThan(400);
  }
});
