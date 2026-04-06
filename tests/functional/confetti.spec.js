const { test, expect } = require('@playwright/test');
const { enterModule } = require('../helpers');

async function goToLastSlide(page) {
    await enterModule(page, 'module1');
    const slideArea = page.locator('#module1 .pres-slide-area');
    await slideArea.focus();
    await page.keyboard.press('End');
}

test.describe('Confetti', () => {

    test('confetti fires on completion slide', async ({ page }) => {
        await goToLastSlide(page);
        const confetti = page.locator('#confetti-container.active');
        await expect(confetti).toBeVisible({ timeout: 3000 });
    });

    test('confetti container has particles', async ({ page }) => {
        await goToLastSlide(page);
        await page.waitForSelector('#confetti-container.active', { timeout: 3000 });
        const pieces = page.locator('#confetti-container .confetti-piece');
        const count = await pieces.count();
        expect(count).toBe(100);
    });

    test('confetti clears after timeout', async ({ page }) => {
        await goToLastSlide(page);
        await page.waitForSelector('#confetti-container.active', { timeout: 3000 });
        await page.waitForFunction(
            () => !document.querySelector('#confetti-container.active'),
            { timeout: 7000 }
        );
    });
});
