const fs = require('fs');
const path = require('path');
const { test, expect } = require('@playwright/test');

const root = path.resolve(__dirname, '..', '..');

const files = [
    'START HERE.md',
    'weekly-curriculum/README.md',
    'weekly-curriculum/GOOGLE-DRIVE-COLLECTION.md',
    '📘 Handouts/course-schedule.html',
    'weekly-curriculum/week-01-2026-04-27-foundations-and-pre-test/course-schedule.html',
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
