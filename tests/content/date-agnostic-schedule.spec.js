const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const root = path.resolve(__dirname, '..', '..');

const files = [
    'START HERE.md',
    'weekly-curriculum/GOOGLE-DRIVE-COLLECTION.md',
    'intermediate-computer-skills.html',
    'intermediate-computer-skills/syllabus-overview.html',
];

const fixedScheduleDates = [
    'Spring 2026',
    'April 27',
    'May 4',
    'May 11',
    'May 18',
    'May 25',
    'June 1',
    'Feb 9',
    'Feb 16',
    'Feb 23',
    'Mar 2',
    'Mar 9',
    'Mar 16',
    'Mar 23',
    'Mar 30',
    'February 9, 2026',
    'February 16, 2026',
    'February 23, 2026',
    'March 2, 2026',
    'March 9, 2026',
    'March 16, 2026',
    'March 23, 2026',
    'March 30, 2026',
];

test.describe('Date-Agnostic Lesson Schedule', () => {

    test('reusable schedule surfaces do not show fixed cohort dates', async () => {
        const matches = [];

        for (const file of files) {
            const text = fs.readFileSync(path.join(root, file), 'utf8');
            for (const date of fixedScheduleDates) {
                if (text.includes(date)) {
                    matches.push(`${file}: ${date}`);
                }
            }
        }

        expect(matches).toEqual([]);
    });
});

test.describe('Financial Readiness Course Schedule', () => {

    test('course schedule handout reflects the Spring 2026 seven-week calendar', async () => {
        const html = fs.readFileSync(path.join(root, '📘 Handouts/course-schedule.html'), 'utf8');

        for (const expected of [
            '7 Mondays (April 27 &ndash; June 8, 2026; no class May 25)',
            '<td>May 18</td>',
            '<td>Module 4</td>',
            '<td>Managing Retirement Income</td>',
            '<td>May 25</td>',
            '<td>Memorial Day</td>',
            '<td>June 1</td>',
            '<td>Module 5</td>',
            '<td>Legacy Planning</td>',
            '<td>June 8</td>',
            '<td>Review + Post-Test</td>',
        ]) {
            expect(html).toContain(expected);
        }

        expect(html).not.toContain('Modules 4 + 5');
        expect(html).not.toContain('Module 5 is covered during Week 4');
        expect(fs.existsSync(path.join(root, '📘 Handouts/course-schedule.pdf'))).toBe(true);
    });
});
