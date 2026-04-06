const { test, expect } = require('@playwright/test');

test.describe('Content Accuracy', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto('/');
    });

    test('disclaimer text is present', async ({ page }) => {
        const found = await page.evaluate(() => {
            return document.body.innerHTML.includes('Consult a qualified financial advisor');
        });
        expect(found).toBe(true);
    });

    const acronyms = [
        { short: 'CRSC', full: 'Combat-Related Special Compensation' },
        { short: 'CRDP', full: 'Concurrent Retirement and Disability Pay' },
        { short: 'SBP', full: 'Survivor Benefit Plan' },
        { short: 'TSP', full: 'Thrift Savings Plan' },
    ];

    for (const { short, full } of acronyms) {
        test(`${short} is defined (${full})`, async ({ page }) => {
            const found = await page.evaluate((text) => {
                return document.body.innerHTML.includes(text);
            }, full);
            expect(found).toBe(true);
        });
    }

    test('RMD age correctly states 73 (not 72)', async ({ page }) => {
        // Check that the page HTML contains "73" in an RMD context
        const hasCorrectAge = await page.evaluate(() => {
            const html = document.body.innerHTML;
            return html.includes('73') && html.includes('RMD');
        });
        expect(hasCorrectAge).toBe(true);

        // Verify the old incorrect "age 72 (RMD)" pattern is NOT present
        const hasOldAge = await page.evaluate(() => {
            return document.body.innerHTML.includes('age 72 (RMD)');
        });
        expect(hasOldAge).toBe(false);
    });

    test('SBP-DIC offset correctly states eliminated', async ({ page }) => {
        const hasEliminated = await page.evaluate(() => {
            const html = document.body.innerHTML;
            return html.includes('eliminated') && html.includes('SBP') && html.includes('DIC');
        });
        expect(hasEliminated).toBe(true);

        // Verify old "may be offset by the DIC amount" language is gone
        const hasOldText = await page.evaluate(() => {
            return document.body.innerHTML.includes('may be offset by the DIC amount');
        });
        expect(hasOldText).toBe(false);
    });
});
