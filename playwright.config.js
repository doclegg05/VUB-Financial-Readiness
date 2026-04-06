const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
    testDir: './tests',
    timeout: 30000,
    expect: { timeout: 5000 },
    fullyParallel: false,
    retries: 0,
    reporter: [
        ['list'],
        ['json', { outputFile: 'test-results/results.json' }]
    ],
    use: {
        baseURL: 'http://localhost:3939',
        headless: true,
        viewport: { width: 1280, height: 720 },
        actionTimeout: 5000,
    },
    webServer: {
        command: 'npx serve . -l 3939 --no-clipboard',
        port: 3939,
        reuseExistingServer: true,
    },
});
