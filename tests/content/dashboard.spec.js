const { test, expect } = require('@playwright/test');

test.describe('Learning Dashboard', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('dashboard loads as the deployment entrypoint', async ({ page }) => {
        await expect(page).toHaveTitle(/VUB Learning Lab/);
        await expect(page.locator('h1')).toContainText('Classroom Launchpad');
    });

    test('primary Financial Readiness path is visible', async ({ page }) => {
        await expect(page.locator('text=Financial Readiness Path')).toBeVisible();
        await expect(page.locator('a[href="financial-readiness.html"]')).toHaveCount(3);
        await expect(page.locator('a[href="financial-readiness.html#module4"]')).toBeVisible();
    });

    test('dashboard assessment links are available', async ({ page }) => {
        await expect(page.locator('a[href="📘 Assessments/pre-test-form.html"]')).toBeVisible();
        await expect(page.locator('a[href="📘 Assessments/post-test-form.html"]')).toBeVisible();
    });

    test('upload instructions link works from the source server', async ({ page }) => {
        const response = await page.goto('/student-upload-instructions.html');
        expect(response.status()).toBe(200);
        await expect(page).toHaveTitle(/Student Upload Instructions/);
    });

    test('legacy root module hashes redirect into Financial Readiness', async ({ page }) => {
        await page.goto('/#module4');
        await expect(page).toHaveURL(/\/financial-readiness(?:\.html)?#module4$/);
        await expect(page.locator('body')).toHaveClass(/presentation-mode/);
        await expect(page.locator('#module4')).toHaveClass(/active/);
    });
});
