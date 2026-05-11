const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');
const { test, expect } = require('@playwright/test');

const root = path.resolve(__dirname, '..', '..');
const outDir = path.join(root, 'dist', 'site-test');

function walkFiles(dir) {
    const files = [];
    const stack = [dir];

    while (stack.length) {
        const current = stack.pop();
        for (const entry of fs.readdirSync(current, { withFileTypes: true })) {
            const full = path.join(current, entry.name);
            if (entry.isDirectory()) {
                stack.push(full);
            } else if (entry.isFile()) {
                files.push(full);
            }
        }
    }

    return files;
}

function isExternal(value) {
    return /^(https?:|mailto:|tel:|data:|javascript:)/i.test(value);
}

function localTarget(htmlFile, value) {
    const withoutHash = value.split('#')[0].split('?')[0];
    if (!withoutHash || isExternal(withoutHash)) return null;

    const decoded = decodeURI(withoutHash);
    if (decoded.startsWith('/')) {
        return path.join(outDir, decoded.slice(1));
    }

    return path.resolve(path.dirname(htmlFile), decoded);
}

test.describe('Built Output', () => {

    test.beforeAll(() => {
        execFileSync('node', ['scripts/build-site.js', path.join('dist', 'site-test')], {
            cwd: root,
            stdio: 'pipe',
        });
    });

    test('required deploy files are present in built output', async () => {
        const required = [
            'index.html',
            '404.html',
            'financial-readiness.html',
            'intermediate-computer-skills.html',
            path.join('intermediate-computer-skills', 'weeks', 'week-01', 'presentation.html'),
            path.join('📘 Assessments', 'pre-test-answer-key.pdf'),
            path.join('📘 Assessments', 'post-test-answer-key.pdf'),
            path.join('📘 Handouts', 'course-schedule.pdf'),
            path.join('📘 Handouts', 'retirement-income-systems-map.html'),
            path.join('📘 Handouts', 'module4-income-stack-worksheet.html'),
            path.join('📘 Handouts', 'module4-income-stack-worksheet.pdf'),
            path.join('📘 Handouts', 'module4-before-december-31-checklist.html'),
            path.join('📘 Handouts', 'module4-before-december-31-checklist.pdf'),
            path.join('📘 Teacher Guides', 'module4-step-by-step-explainer.pdf'),
            path.join('📘 Teacher Guides', 'module4-practical-scenarios.pdf'),
            path.join('📘 Teacher Guides', 'module1-teachers-guide.pdf'),
            'student-upload-instructions.html',
            path.join('shared', 'progress.js'),
        ];

        for (const file of required) {
            expect(fs.existsSync(path.join(outDir, file)), `${file} should exist in built output`).toBe(true);
        }
    });

    test('Module 4 PDF resources are distinct and correctly generated', async () => {
        const stepByStepPath = path.join(outDir, '📘 Teacher Guides', 'module4-step-by-step-explainer.pdf');
        const scenariosPath = path.join(outDir, '📘 Teacher Guides', 'module4-practical-scenarios.pdf');
        const stepByStep = fs.readFileSync(stepByStepPath, 'latin1');
        const scenarios = fs.readFileSync(scenariosPath, 'latin1');

        expect(fs.statSync(stepByStepPath).size).toBeGreaterThan(100000);
        expect(fs.statSync(scenariosPath).size).toBeGreaterThan(100000);
        expect(stepByStep).toContain('Module 4 Step-by-Step Instructor Explainer');
        expect(scenarios).toContain('Module 4 Practical Scenarios');
        expect(scenarios).not.toContain('Module 4 Step-by-Step Instructor Explainer');
    });

    test('Module 4 scenario source includes instructor answer guidance', async () => {
        const scenariosHtml = fs.readFileSync(path.join(outDir, '📘 Teacher Guides', 'module4-practical-scenarios.html'), 'utf8');

        expect(scenariosHtml).toContain('Answer Key: Instructor Guidance');
        expect(scenariosHtml).toContain('Expected answer');
        expect(scenariosHtml).toContain('Scenario 10: Inflation and the Flat Pension');
    });

    test('Module 4 student handout PDFs are created', async () => {
        const worksheetHtml = fs.readFileSync(path.join(outDir, '📘 Handouts', 'module4-income-stack-worksheet.html'), 'utf8');
        const checklistHtml = fs.readFileSync(path.join(outDir, '📘 Handouts', 'module4-before-december-31-checklist.html'), 'utf8');
        const worksheetPdfPath = path.join(outDir, '📘 Handouts', 'module4-income-stack-worksheet.pdf');
        const checklistPdfPath = path.join(outDir, '📘 Handouts', 'module4-before-december-31-checklist.pdf');

        expect(worksheetHtml).toContain('My Income Stack Worksheet');
        expect(checklistHtml).toContain('Before December 31 Checklist');
        expect(fs.statSync(worksheetPdfPath).size).toBeGreaterThan(20000);
        expect(fs.statSync(checklistPdfPath).size).toBeGreaterThan(20000);
    });

    test('local href and src references resolve in built HTML', async () => {
        const htmlFiles = walkFiles(outDir).filter(file => file.toLowerCase().endsWith('.html'));
        const missing = [];
        const attrPattern = /\s(?:href|src)=["']([^"']+)["']/gi;

        for (const htmlFile of htmlFiles) {
            const html = fs.readFileSync(htmlFile, 'utf8');
            let match;
            while ((match = attrPattern.exec(html)) !== null) {
                const target = localTarget(htmlFile, match[1]);
                if (!target) continue;

                if (!fs.existsSync(target)) {
                    missing.push(`${path.relative(outDir, htmlFile)} -> ${match[1]}`);
                }
            }
        }

        expect(missing).toEqual([]);
    });

    test('project instructions require answer keys for question-based materials', async () => {
        const agents = fs.readFileSync(path.join(root, 'AGENTS.md'), 'utf8');

        expect(agents).toContain('Answer Keys & Instructor Guidance');
        expect(agents).toContain('asks a question');
        expect(agents).toContain('answer key');
    });
});
