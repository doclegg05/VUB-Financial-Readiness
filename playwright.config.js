// Playwright config for the VUB Learning platform.
// Tests run against the BUILT output (dist/site) served locally, so always
// `npm run build:site` before `npx playwright test` (the webServer serves dist/site).
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: 0,
  reporter: 'line',
  use: {
    baseURL: 'http://localhost:3939',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'npx serve dist/site -l 3939',
    url: 'http://localhost:3939',
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
