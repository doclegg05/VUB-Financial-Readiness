// Digital Literacy — Level 1: the lesson sidebar must scroll independently of the
// slide display, and list this week's handouts at the bottom (reachable by scrolling).
const { test, expect } = require('@playwright/test');

const weeks = ['week-01', 'week-02', 'week-03', 'week-04', 'week-05'];

function activeSlideSignature(page) {
  return page.evaluate(() => {
    const a = document.querySelector('.slide.active');
    return a ? a.outerHTML.slice(0, 60) : null;
  });
}

for (const w of weeks) {
  test(`DL1 ${w}: sidebar scrolls independently and lists handouts`, async ({ page }) => {
    await page.goto(`/courses/digital-literacy-1/weeks/${w}/presentation.html`);

    const sidebar = page.locator('.sidebar');
    await expect(sidebar).toBeVisible();

    // Sidebar is its own scroll container.
    const overflowY = await sidebar.evaluate((el) => getComputedStyle(el).overflowY);
    expect(['auto', 'scroll']).toContain(overflowY);

    // Resources section exists at the bottom with at least one handout link.
    const resourceLinks = page.locator('.resources-section .resource-link');
    expect(await resourceLinks.count()).toBeGreaterThan(0);

    // Every handout link is local to this week's handouts/ folder and resolves (no 404, no cross-lesson).
    const hrefs = await resourceLinks.evaluateAll((els) => els.map((e) => e.getAttribute('href')));
    for (const href of hrefs) {
      expect(href.startsWith('handouts/'), `${href} should be a local week handout`).toBeTruthy();
      const r = await page.request.get(`/courses/digital-literacy-1/weeks/${w}/${href}`);
      expect(r.status(), `${href} resolves`).toBeLessThan(400);
    }

    // Scrolling the sidebar to the bottom reveals the resources but does NOT change the slide.
    const slideAtStart = await activeSlideSignature(page);
    await sidebar.evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await page.waitForTimeout(150);
    await expect(resourceLinks.last()).toBeInViewport();
    expect(await activeSlideSignature(page)).toBe(slideAtStart);

    // Scrolling back to the top still leaves the same slide displayed.
    await sidebar.evaluate((el) => { el.scrollTop = 0; });
    await page.waitForTimeout(100);
    expect(await activeSlideSignature(page)).toBe(slideAtStart);
  });
}
