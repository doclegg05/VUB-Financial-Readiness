const { test, expect } = require('@playwright/test');

test.describe('Navigation', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('#home.active');
    });

    test('homepage loads by default', async ({ page }) => {
        const home = page.locator('#home.active');
        await expect(home).toBeVisible();
    });

    test('hash navigation to each module enters presentation mode', async ({ page }) => {
        const modules = ['module1', 'module2', 'module3', 'module4', 'module5'];
        for (const mod of modules) {
            await page.click(`.nav-links a[data-section="${mod}"]`);
            await page.waitForFunction(
                (id) => document.getElementById(id)?.classList.contains('active'),
                mod, { timeout: 5000 }
            );
            await expect(page.locator('body')).toHaveClass(/presentation-mode/);
            // Use back button to exit presentation (sidebar hidden in pres mode)
            await page.click(`#${mod} .pres-back-btn`);
            await page.waitForFunction(
                () => document.getElementById('home')?.classList.contains('active'),
                { timeout: 5000 }
            );
        }
    });

    test('course cards are anchor elements that navigate correctly', async ({ page }) => {
        const cards = page.locator('#home .course-card');
        const count = await cards.count();
        expect(count).toBe(5);

        for (let i = 0; i < count; i++) {
            const tag = await cards.nth(i).evaluate(el => el.tagName.toLowerCase());
            expect(tag).toBe('a');
        }

        const expectedHrefs = ['#module1', '#module2', '#module3', '#module4', '#module5'];
        for (let i = 0; i < count; i++) {
            const href = await cards.nth(i).getAttribute('href');
            expect(href).toBe(expectedHrefs[i]);
        }
    });

    test('nav links highlight active section', async ({ page }) => {
        await page.click('.nav-links a[data-section="module3"]');
        await page.waitForFunction(
            () => document.getElementById('module3')?.classList.contains('active'),
            { timeout: 5000 }
        );

        const activeLinks = page.locator('.nav-links a.active');
        await expect(activeLinks).toHaveCount(1);
        await expect(activeLinks).toHaveAttribute('data-section', 'module3');
    });

    test('"Start Course" button goes to module1', async ({ page }) => {
        await page.click('.hero-content .btn-primary');
        await page.waitForFunction(
            () => document.getElementById('module1')?.classList.contains('active'),
            { timeout: 5000 }
        );
        expect(page.url()).toContain('#module1');
    });

    test('exit presentation returns to home', async ({ page }) => {
        await page.click('.nav-links a[data-section="module1"]');
        await page.waitForFunction(
            () => document.getElementById('module1')?.classList.contains('active'),
            { timeout: 5000 }
        );
        await page.click('.pres-back-btn');
        await page.waitForSelector('#home.active');
        await expect(page.locator('body')).not.toHaveClass(/presentation-mode/);
    });
});
