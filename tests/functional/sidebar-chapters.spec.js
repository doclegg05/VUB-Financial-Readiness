const { test, expect } = require('@playwright/test');
const { enterModule } = require('../helpers');

test.describe('Sidebar Chapters', () => {

    test.beforeEach(async ({ page }) => {
        await enterModule(page, 'module1');
    });

    test('chapter expands on click', async ({ page }) => {
        const secondChapter = page.locator('#module1 .pres-chapter').nth(1);
        await secondChapter.locator('.pres-chapter-header').click();
        await expect(secondChapter).toHaveClass(/expanded/);
    });

    test('chapter collapses on second click', async ({ page }) => {
        const firstChapter = page.locator('#module1 .pres-chapter').first();
        await expect(firstChapter).toHaveClass(/expanded/);
        await firstChapter.locator('.pres-chapter-header').click();
        await expect(firstChapter).not.toHaveClass(/expanded/);
    });

    test('active slide chapter auto-expands on navigation', async ({ page }) => {
        const slideArea = page.locator('#module1 .pres-slide-area');
        await slideArea.focus();
        for (let i = 0; i < 5; i++) {
            await page.keyboard.press('ArrowRight');
        }

        const counter = page.locator('#module1 .pres-current');
        await expect(counter).toHaveText('6');

        const activeSlideChapter = await page.evaluate(() => {
            const activeSlide = document.querySelector('#module1 .pres-slide.active');
            return activeSlide ? activeSlide.dataset.chapter : null;
        });

        const expandedChapter = page.locator(`#module1 .pres-chapter.expanded[data-chapter="${activeSlideChapter}"]`);
        await expect(expandedChapter).toHaveCount(1);
    });

    test('clicking slide item jumps to correct slide', async ({ page }) => {
        const secondChapter = page.locator('#module1 .pres-chapter').nth(1);
        await secondChapter.locator('.pres-chapter-header').click();

        const slideItem = page.locator('#module1 .pres-slide-item[data-slide="3"]');
        await slideItem.click();
        const counter = page.locator('#module1 .pres-current');
        await expect(counter).toHaveText('4');
    });
});
