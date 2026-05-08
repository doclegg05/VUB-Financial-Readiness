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
            path.join('📘 Teacher Guides', 'module1-teachers-guide.pdf'),
            'student-upload-instructions.html',
            path.join('shared', 'progress.js'),
        ];

        for (const file of required) {
            expect(fs.existsSync(path.join(outDir, file)), `${file} should exist in built output`).toBe(true);
        }
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
});
