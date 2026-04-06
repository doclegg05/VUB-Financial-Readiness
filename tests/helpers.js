/**
 * Navigate to a module by clicking its nav link and waiting for presentation mode.
 */
async function enterModule(page, moduleId) {
    await page.goto('/');
    await page.evaluate(() => localStorage.clear());
    await page.waitForSelector('#home.active');
    await page.click(`.nav-links a[data-section="${moduleId}"]`);
    await page.waitForFunction(
        (id) => document.getElementById(id)?.classList.contains('active'),
        moduleId, { timeout: 5000 }
    );
    await page.waitForSelector(`#${moduleId} .pres-slide.active`);
}

module.exports = { enterModule };
