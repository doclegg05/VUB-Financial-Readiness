const { test, expect } = require('@playwright/test');

test.describe('Slide Counts', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    const modules = [
        { id: 'module1', expected: 14 },
        { id: 'module2', expected: 12 },
        { id: 'module3', expected: 24 },
        { id: 'module4', expected: 11 },
        { id: 'module5', expected: 13 },
    ];

    for (const { id, expected } of modules) {
        test(`${id} has ${expected} slides`, async ({ page }) => {
            const slides = page.locator(`#${id} .pres-slide`);
            await expect(slides).toHaveCount(expected);
        });
    }

    test('total slides across all presentations is 84', async ({ page }) => {
        const allSlides = page.locator('.pres-slide');
        await expect(allSlides).toHaveCount(84);
    });
});

