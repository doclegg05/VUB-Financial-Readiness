const { test, expect } = require('@playwright/test');

test.describe('Mobile Responsive', () => {

    test.beforeEach(async ({ page }) => {
        await page.setViewportSize({ width: 375, height: 667 });
        await page.goto('/');
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
        await page.click('.sidebar-overlay');
        const sidebar = page.locator('#sidebar');
        await expect(sidebar).not.toHaveClass(/open/);
    });
});
