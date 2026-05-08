const { test, expect } = require('@playwright/test');
const { COURSE_URL } = require('../helpers');

test.describe('Modules Present', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(COURSE_URL);
    });

    const sections = ['home', 'module1', 'module2', 'module3', 'module4', 'module5', 'resources'];

    for (const id of sections) {
        test(`section#${id} exists`, async ({ page }) => {
            const section = page.locator(`section#${id}`);
            await expect(section).toHaveCount(1);
        });
    }
});
