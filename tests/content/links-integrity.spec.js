const { test, expect } = require('@playwright/test');

test.describe('Links Integrity', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('all internal hash links have matching IDs', async ({ page }) => {
        const broken = await page.evaluate(() => {
            const links = document.querySelectorAll('a[href^="#"]');
            const missing = [];
            links.forEach(link => {
                const target = link.getAttribute('href').slice(1);
                if (target && !document.getElementById(target)) {
                    missing.push(target);
                }
            });
            return missing;
        });

        expect(broken).toEqual([]);
    });

    test('all nav links map to existing sections', async ({ page }) => {
        const broken = await page.evaluate(() => {
            const navLinks = document.querySelectorAll('.nav-links a[href]');
            const missing = [];
            navLinks.forEach(link => {
                const target = link.getAttribute('href').replace('#', '');
                if (!document.getElementById(target)) {
                    missing.push(target);
                }
            });
            return missing;
        });

        expect(broken).toEqual([]);
    });
});
