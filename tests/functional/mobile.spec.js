const { test, expect } = require('@playwright/test');
const { COURSE_URL } = require('../helpers');

async function enterMobileModule(page, moduleId) {
    await page.goto(`${COURSE_URL}#${moduleId}`);
    await page.waitForSelector(`#${moduleId} .pres-slide.active`);
}

test.describe('Mobile Responsive', () => {

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto(COURSE_URL);
        await page.waitForSelector('#home.active');
    });

    test('hamburger is visible at mobile width', async ({ page }) => {
        const hamburger = page.locator('#hamburger');
        await expect(hamburger).toBeVisible();
    });

    test('sidebar is hidden by default on mobile', async ({ page }) => {
        const sidebar = page.locator('#sidebar');
        await expect(sidebar).not.toHaveClass(/open/);
    });

    test('clicking hamburger opens sidebar', async ({ page }) => {
        await page.click('#hamburger');
        const sidebar = page.locator('#sidebar');
        await expect(sidebar).toHaveClass(/open/);
    });

    test('clicking hamburger again closes sidebar', async ({ page }) => {
        await page.click('#hamburger');
        await page.click('#hamburger');
        const sidebar = page.locator('#sidebar');
        await expect(sidebar).not.toHaveClass(/open/);
    });

    test('overlay click closes sidebar', async ({ page }) => {
        await page.click('#hamburger');
        await page.locator('.sidebar-overlay').click({ position: { x: 350, y: 100 } });
        const sidebar = page.locator('#sidebar');
        await expect(sidebar).not.toHaveClass(/open/);
    });

    test('slide menu opens inside presentation mode', async ({ page }) => {
        await enterMobileModule(page, 'module4');

        const menuButton = page.locator('#module4 .pres-slide-menu-toggle');
        await expect(menuButton).toBeVisible();
        await menuButton.click();

        await expect(page.locator('body')).toHaveClass(/pres-mobile-nav-open/);
        await expect(page.locator('#module4 .pres-sidebar')).toBeVisible();
    });

    test('choosing a mobile slide closes the slide menu', async ({ page }) => {
        await enterMobileModule(page, 'module4');

        await page.click('#module4 .pres-slide-menu-toggle');
        await page.click('#module4 .pres-chapter[data-chapter="taxes"] .pres-chapter-header');
        await expect(page.locator('#module4 .pres-chapter[data-chapter="taxes"]')).toHaveClass(/expanded/);
        await page.click('#module4 .pres-slide-item[data-slide="6"]');

        await expect(page.locator('#module4 .pres-current')).toHaveText('7');
        await expect(page.locator('body')).not.toHaveClass(/pres-mobile-nav-open/);
    });
});
