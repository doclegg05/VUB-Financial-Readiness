const { test, expect } = require('@playwright/test');

test.describe('Theme Toggle', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.evaluate(() => localStorage.clear());
        await page.reload();
        await page.waitForSelector('#home.active');
    });

    test('default theme is light mode', async ({ page }) => {
        await expect(page.locator('body')).toHaveClass(/light-mode/);
    });

    test('clicking toggle switches to dark mode', async ({ page }) => {
        await page.click('#theme-toggle');
        await expect(page.locator('body')).toHaveClass(/dark-mode/);
        await expect(page.locator('body')).not.toHaveClass(/light-mode/);
    });

    test('clicking toggle again restores light mode', async ({ page }) => {
        await page.click('#theme-toggle');
        await page.click('#theme-toggle');
        await expect(page.locator('body')).toHaveClass(/light-mode/);
    });

    test('theme persists via localStorage after reload', async ({ page }) => {
        await page.click('#theme-toggle');
        await page.reload();
        await expect(page.locator('body')).toHaveClass(/dark-mode/);
    });

    test('localStorage stores correct theme value', async ({ page }) => {
        await page.click('#theme-toggle');
        const stored = await page.evaluate(() => localStorage.getItem('theme'));
        expect(stored).toBe('dark');
    });

    test('presentation theme toggle syncs with main toggle', async ({ page }) => {
        await page.click('.nav-links a[data-section="module1"]');
        await page.waitForFunction(
            () => document.getElementById('module1')?.classList.contains('active'),
            { timeout: 5000 }
        );

        await page.click('#module1 .pres-theme-toggle');
        await expect(page.locator('body')).toHaveClass(/dark-mode/);

        const mainIcon = page.locator('#theme-toggle i');
        await expect(mainIcon).toHaveClass(/fa-sun/);
    });
});
