const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const root = path.resolve(__dirname, '..', '..');

function read(relativePath) {
    return fs.readFileSync(path.join(root, relativePath), 'utf8');
}

test.describe('Deployment Configuration', () => {

    test('required source entrypoints exist', async () => {
        const required = [
            'index.html',
            '404.html',
            'financial-readiness.html',
            'intermediate-computer-skills.html',
            'netlify.toml',
            'scripts/build-site.js',
        ];

        for (const file of required) {
            expect(fs.existsSync(path.join(root, file)), `${file} should exist`).toBe(true);
        }
    });

    test('Netlify build and publish settings are configured', async () => {
        const toml = read('netlify.toml');
        expect(toml).toContain('command = "npm run build:site"');
        expect(toml).toContain('publish = "dist/site"');
    });

    test('friendly route redirects are configured', async () => {
        const toml = read('netlify.toml');
        const expectedRoutes = [
            'from = "/financial-readiness"',
            'to = "/financial-readiness.html"',
            'from = "/computer-skills"',
            'to = "/intermediate-computer-skills.html"',
            'from = "/syllabus"',
            'to = "/syllabus.html"',
            'from = "/assessments/*"',
            'to = "/📘 Assessments/:splat"',
            'from = "/handouts/*"',
            'to = "/📘 Handouts/:splat"',
            'from = "/study-resources/*"',
            'to = "/📘 Study Resources/:splat"',
            'from = "/teacher-guides/*"',
            'to = "/📘 Teacher Guides/:splat"',
            'to = "/404.html"',
            'status = 404',
        ];

        for (const route of expectedRoutes) {
            expect(toml).toContain(route);
        }
    });

    test('build scripts keep instructor materials public', async () => {
        const nodeScript = read('scripts/build-site.js');
        const powershellScript = read('scripts/build-site.ps1');

        expect(nodeScript).toContain('"Teacher Guides"');
        expect(nodeScript).not.toMatch(/answer-key\.pdf/i);
        expect(powershellScript).not.toMatch(/answer-key\.pdf/i);
    });

    test('build script treats linked deploy inputs as required', async () => {
        const script = read('scripts/build-site.js');
        const requiredBlock = script.slice(
            script.indexOf('const REQUIRED_ITEMS'),
            script.indexOf('// Files & folders copied into the build verbatim')
        );

        expect(requiredBlock).toContain('"index.html"');
        expect(requiredBlock).toContain('"404.html"');
        expect(requiredBlock).toContain('"financial-readiness.html"');
        expect(requiredBlock).toContain('"student-upload-instructions.html"');
        expect(requiredBlock).toContain('"intermediate-computer-skills.html"');
        expect(requiredBlock).toContain('"intermediate-computer-skills"');
        expect(requiredBlock).toContain('"intermediate-computer-skills/syllabus-overview.html"');
        expect(requiredBlock).toContain('"intermediate-computer-skills/weeks/week-01/presentation.html"');
        expect(requiredBlock).toContain('"shared"');
        expect(script).toContain('const REQUIRED_TEACHING_FOLDERS = PUBLIC_TEACHING_FOLDERS');
    });
});
