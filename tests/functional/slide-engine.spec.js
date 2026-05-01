const { test, expect } = require('@playwright/test');
const { enterModule } = require('../helpers');

test.describe('Slide Engine', () => {

    test.beforeEach(async ({ page }) => {
        await enterModule(page, 'module1');
    });

    test('next button advances slide', async ({ page }) => {
        await page.click('.pres-next');
        const counter = page.locator('#module1 .pres-current');
        await expect(counter).toHaveText('2');
    });

    test('prev button goes back', async ({ page }) => {
        await page.click('.pres-next');
        await page.click('.pres-prev');
        const counter = page.locator('#module1 .pres-current');
        await expect(counter).toHaveText('1');
    });

    test('prev is disabled on first slide', async ({ page }) => {
        const prev = page.locator('#module1 .pres-prev');
        await expect(prev).toBeDisabled();
    });

    test('next shows "Finish" on last slide', async ({ page }) => {
        const slideArea = page.locator('#module1 .pres-slide-area');
        await slideArea.focus();
        await page.keyboard.press('End');
        const next = page.locator('#module1 .pres-next');
        await expect(next).toContainText('Finish');
        await expect(next).toHaveClass(/pres-finish/);
    });

    test('Finish button exits presentation', async ({ page }) => {
        const slideArea = page.locator('#module1 .pres-slide-area');
        await slideArea.focus();
        await page.keyboard.press('End');
        await page.click('.pres-next');
        await page.waitForSelector('#home.active');
        await expect(page.locator('body')).not.toHaveClass(/presentation-mode/);
    });

    test('keyboard ArrowRight advances slide', async ({ page }) => {
        const slideArea = page.locator('#module1 .pres-slide-area');
        await slideArea.focus();
        await page.keyboard.press('ArrowRight');
        const counter = page.locator('#module1 .pres-current');
        await expect(counter).toHaveText('2');
    });

    test('keyboard ArrowLeft goes back', async ({ page }) => {
        const slideArea = page.locator('#module1 .pres-slide-area');
        await slideArea.focus();
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowLeft');
        const counter = page.locator('#module1 .pres-current');
        await expect(counter).toHaveText('1');
    });

    test('keyboard Home goes to first slide', async ({ page }) => {
        const slideArea = page.locator('#module1 .pres-slide-area');
        await slideArea.focus();
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('Home');
        const counter = page.locator('#module1 .pres-current');
        await expect(counter).toHaveText('1');
    });

    test('keyboard End goes to last slide', async ({ page }) => {
        const slideArea = page.locator('#module1 .pres-slide-area');
        await slideArea.focus();
        await page.keyboard.press('End');
        const counter = page.locator('#module1 .pres-current');
        const total = page.locator('#module1 .pres-total');
        const currentText = await counter.textContent();
        const totalText = await total.textContent();
        expect(currentText).toBe(totalText);
    });

    test('keyboard Escape exits presentation', async ({ page }) => {
        const slideArea = page.locator('#module1 .pres-slide-area');
        await slideArea.focus();
        await page.keyboard.press('Escape');
        await page.waitForSelector('#home.active');
    });

    test('keyboard Space advances slide', async ({ page }) => {
        const slideArea = page.locator('#module1 .pres-slide-area');
        await slideArea.focus();
        await page.keyboard.press('Space');
        const counter = page.locator('#module1 .pres-current');
        await expect(counter).toHaveText('2');
    });

    test('keyboard PageDown advances slide', async ({ page }) => {
        const slideArea = page.locator('#module1 .pres-slide-area');
        await slideArea.focus();
        await page.keyboard.press('PageDown');
        const counter = page.locator('#module1 .pres-current');
        await expect(counter).toHaveText('2');
    });

    test('keyboard PageUp goes back', async ({ page }) => {
        const slideArea = page.locator('#module1 .pres-slide-area');
        await slideArea.focus();
        await page.keyboard.press('ArrowRight');
        await page.keyboard.press('PageUp');
        const counter = page.locator('#module1 .pres-current');
        await expect(counter).toHaveText('1');
    });

    test('progress bar updates on slide change', async ({ page }) => {
        const fill = page.locator('#module1 .pres-progress-fill');
        const initialWidth = await fill.evaluate(el => el.style.width);
        await page.click('.pres-next');
        const newWidth = await fill.evaluate(el => el.style.width);
        expect(parseFloat(newWidth)).toBeGreaterThan(parseFloat(initialWidth));
    });
});

test.describe('All slides reachable per module', () => {

    const modules = [
        { id: 'module1', expected: 14 },
        { id: 'module2', expected: 12 },
        { id: 'module3', expected: 24 },
        { id: 'module4', expected: 11 },
        { id: 'module5', expected: 13 },
    ];

    for (const { id, expected } of modules) {
        test(`${id} has ${expected} reachable slides`, async ({ page }) => {
            await enterModule(page, id);

            const slideArea = page.locator(`#${id} .pres-slide-area`);
            await slideArea.focus();

            let slideCount = 1;
            for (let i = 0; i < expected + 5; i++) {
                const before = await page.locator(`#${id} .pres-current`).textContent();
                await page.keyboard.press('ArrowRight');
                const after = await page.locator(`#${id} .pres-current`).textContent();
                if (after === before) break;
                slideCount++;
            }

            expect(slideCount).toBe(expected);
        });
    }
});

