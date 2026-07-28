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

    await expect(page.locator('.sidebar')).toBeVisible();

    // The chapter list scrolls in an INNER container (.sidebar-scroll-container,
    // `flex: 1; overflow-y: auto`) so the sidebar header and slide counter stay put.
    // The outer .sidebar also carries `overflow-y: auto` but never overflows, so
    // asserting on it proves nothing -- assert on the element that actually scrolls.
    const scroller = page.locator('.sidebar-scroll-container');
    await expect(scroller).toBeVisible();

    const box = await scroller.evaluate((el) => ({
      overflowY: getComputedStyle(el).overflowY,
      clientH: el.clientHeight,
      scrollH: el.scrollHeight,
    }));
    expect(['auto', 'scroll']).toContain(box.overflowY);
    // Genuinely overflowing, not merely styled to be scrollable.
    expect(
      box.scrollH,
      `sidebar scroller should overflow (scrollH ${box.scrollH} > clientH ${box.clientH})`,
    ).toBeGreaterThan(box.clientH);

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
    await scroller.evaluate((el) => { el.scrollTop = el.scrollHeight; });
    await expect(resourceLinks.last()).toBeInViewport();
    expect(await activeSlideSignature(page)).toBe(slideAtStart);

    // Scrolling back to the top still leaves the same slide displayed.
    await scroller.evaluate((el) => { el.scrollTop = 0; });
    await expect(scroller).toHaveJSProperty('scrollTop', 0);
    expect(await activeSlideSignature(page)).toBe(slideAtStart);
  });
}
