const { test, expect } = require('@playwright/test');
const { COURSE_URL } = require('../helpers');

test.describe('Content Accuracy', () => {

    test.beforeEach(async ({ page }) => {
        await page.goto(COURSE_URL);
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

    test('Module 4 explains income-system interactions', async ({ page }) => {
        const html = await page.locator('#module4').innerHTML();
        expect(html).toContain('Money flows in from four sources');
        expect(html).toContain('One withdrawal. Four tax events.');
        expect(html).toContain('AGI');
        expect(html).toContain('Medicare');
        expect(html).toContain('IRMAA');
    });

    test('Module 4 links the instructor deep-dive PDF', async ({ page }) => {
        const html = await page.locator('#module4').innerHTML();
        expect(html).toContain('module4-step-by-step-explainer.pdf');
        expect(html).toContain('Instructor Deep-Dive PDF');
    });

    test('Module 4 links the practical scenarios PDF', async ({ page }) => {
        const html = await page.locator('#module4').innerHTML();
        expect(html).toContain('module4-practical-scenarios.pdf');
        expect(html).toContain('Practical Scenarios PDF');
    });

    test('Module 4 links the added student handout PDFs', async ({ page }) => {
        const html = await page.locator('#module4').innerHTML();
        expect(html).toContain('module4-income-stack-worksheet.pdf');
        expect(html).toContain('My Income Stack Worksheet');
        expect(html).toContain('module4-before-december-31-checklist.pdf');
        expect(html).toContain('Before Dec. 31 Checklist');
    });

    test('Module 4 prepares students for Income & Taxes assessment items', async ({ page }) => {
        const html = await page.locator('#module4').innerHTML();
        expect(html).toContain('VA Disability (70%)');
        expect(html).toContain('Tax-free');
        expect(html).toContain('25%');
        expect(html).toContain('Texas, Florida, and Nevada');
        expect(html).toContain('97%');
    });

    test('Module 4 slide buttons link the right PDFs without step-by-step buttons', async ({ page }) => {
        const buttons = await page.locator('#module4 .pres-pdf-button').evaluateAll((links) => {
            return links.map((link) => ({
                text: link.textContent.trim(),
                href: link.getAttribute('href'),
            }));
        });

        expect(buttons).toEqual([
            {
                text: 'My Income Stack Worksheet',
                href: '📘 Handouts/module4-income-stack-worksheet.pdf',
            },
            {
                text: 'Before Dec. 31 Checklist',
                href: '📘 Handouts/module4-before-december-31-checklist.pdf',
            },
            {
                text: 'Practical Scenarios PDF',
                href: '📘 Teacher Guides/module4-practical-scenarios.pdf',
            },
            {
                text: 'Relocation Scenario PDF',
                href: '📘 Teacher Guides/module4-practical-scenarios.pdf',
            },
        ]);
        expect(buttons.some((button) => button.href.includes('module4-step-by-step-explainer.pdf'))).toBe(false);
    });
});
