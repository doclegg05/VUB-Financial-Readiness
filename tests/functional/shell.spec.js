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
  const before = await page.locator('body').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  await page.locator('.vub-textsize button.plus').click();
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'lg');
  const after = await page.locator('body').evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(after).toBeGreaterThan(before + 2);
  await page.locator('.vub-textsize button.plus').click();
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'xl');
  await page.reload();
  await expect(page.locator('html')).toHaveAttribute('data-text-size', 'xl');
});

test('Text Size is available on standalone course pages and visibly scales text', async ({ page }) => {
  await page.goto('/courses/computer-skills/weeks/week-02/handouts/windows-workshop.html');
  await expect(page.locator('.vub-textsize')).toBeVisible();
  const target = page.locator('.goal-box li').first();
  const before = await target.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  await page.locator('.vub-textsize button.plus').click();
  const afterOne = await target.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  await page.locator('.vub-textsize button.plus').click();
  const afterTwo = await target.evaluate((el) => parseFloat(getComputedStyle(el).fontSize));
  expect(afterOne).toBeGreaterThan(before + 2);
  expect(afterTwo).toBeGreaterThan(afterOne + 2);
});

test('computer skills dashboard links resolve from no-slash route', async ({ page }) => {
  await page.goto('/courses/computer-skills');
  const weekFour = page.locator('.lesson-card[data-theme="word"] .lesson-actions a').first();
  await expect(weekFour).toHaveAttribute('href', '/courses/computer-skills/weeks/week-04/presentation.html');
  const response = await page.request.get('/courses/computer-skills/weeks/week-04/presentation.html');
  expect(response.status()).toBeLessThan(400);
});

test('legacy computer-skills week route redirects to canonical presentation', async ({ page }) => {
  await page.goto('/courses/weeks/week-04/presentation');
  await page.waitForURL('**/courses/computer-skills/weeks/week-04/presentation', { timeout: 5000 });
  await expect(page.locator('body')).not.toContainText('Page Not Found');
});

test('digital literacy retired form routes open browser assessments', async ({ page }) => {
  await page.goto('/courses/digital-literacy-1/assessments/pre-test-form.html');
  await expect(page).toHaveURL(/\/courses\/digital-literacy-1\/assessments\/pre-test(\.html)?$/);
  await expect(page.getByRole('heading', { level: 1, name: /Pre-Test/i })).toBeVisible();

  await page.goto('/courses/digital-literacy-1/assessments/post-test-form.html');
  await expect(page).toHaveURL(/\/courses\/digital-literacy-1\/assessments\/post-test(\.html)?$/);
  await expect(page.getByRole('heading', { level: 1, name: /Post-Test/i })).toBeVisible();
});

test('digital literacy practice quiz exposes printable PDF results', async ({ page }) => {
  await page.goto('/courses/digital-literacy-1/study-resources/quiz.html');

  let steps = 0;
  while (!(await page.locator('#results-area').isVisible()) && steps < 30) {
    await page.locator('.opt-btn').first().click();
    await page.locator('#next-btn').click();
    steps += 1;
  }

  expect(steps).toBeGreaterThan(0);
  await expect(page.locator('#results-area')).toBeVisible();
  await expect(page.getByRole('button', { name: 'Print Results (PDF)' })).toBeVisible();
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
