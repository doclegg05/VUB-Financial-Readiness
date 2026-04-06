const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Parse --label argument
const args = process.argv.slice(2);
const labelArg = args.find(a => a.startsWith('--label='));
const label = labelArg ? labelArg.split('=')[1] : 'benchmark';

// Get git short SHA
let gitRef = 'unknown';
try {
    gitRef = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim();
} catch {
    // Not a git repo or git not available
}

// Run Playwright tests (allow failures — we capture the results)
const resultsDir = path.join(__dirname, '..', 'test-results');
const resultsFile = path.join(resultsDir, 'results.json');

// Ensure directories exist
fs.mkdirSync(resultsDir, { recursive: true });
fs.mkdirSync(path.join(__dirname, '..', 'benchmarks'), { recursive: true });

console.log(`Running benchmark: ${label} (git: ${gitRef})`);
console.log('─'.repeat(50));

let rawOutput;
try {
    rawOutput = execSync('npx playwright test --reporter=json', {
        cwd: path.join(__dirname, '..'),
        encoding: 'utf-8',
        timeout: 300000
    });
} catch (e) {
    // Tests may fail — that's expected for baseline. Capture stdout from error.
    rawOutput = e.stdout || '';
}

// Write the raw JSON to results file for parsing
if (rawOutput && rawOutput.trim()) {
    fs.writeFileSync(resultsFile, rawOutput);
}

// Parse Playwright JSON results
if (!fs.existsSync(resultsFile)) {
    console.error('No test results found. Playwright may have failed to run.');
    process.exit(1);
}

const raw = JSON.parse(fs.readFileSync(resultsFile, 'utf-8'));

// Extract tests from Playwright JSON format
const tests = [];

function extractTests(suites) {
    for (const suite of suites) {
        if (suite.specs) {
            for (const spec of suite.specs) {
                const filePath = spec.file || suite.file || '';
                const status = spec.ok ? 'passed' : 'failed';
                const duration = spec.tests?.[0]?.results?.[0]?.duration || 0;
                const error = !spec.ok && spec.tests?.[0]?.results?.[0]?.error?.message
                    ? spec.tests[0].results[0].error.message.split('\n')[0]
                    : null;

                tests.push({
                    name: spec.title,
                    file: path.basename(filePath),
                    status,
                    duration,
                    ...(error && { error })
                });
            }
        }
        if (suite.suites) {
            extractTests(suite.suites);
        }
    }
}

extractTests(raw.suites || []);

// Categorize by directory
const categories = {
    functional: { total: 0, passed: 0, failed: 0, tests: [] },
    content: { total: 0, passed: 0, failed: 0, tests: [] }
};

for (const t of tests) {
    // Determine category from the original file path in results
    let category = 'functional';
    const fullSuitePath = findFilePath(raw.suites || [], t.name);
    if (fullSuitePath && fullSuitePath.includes('content')) {
        category = 'content';
    }

    categories[category].total++;
    if (t.status === 'passed') categories[category].passed++;
    else categories[category].failed++;
    categories[category].tests.push(t);
}

function findFilePath(suites, testName) {
    for (const suite of suites) {
        if (suite.specs) {
            for (const spec of suite.specs) {
                if (spec.title === testName) return spec.file || suite.file || '';
            }
        }
        if (suite.suites) {
            const result = findFilePath(suite.suites, testName);
            if (result) return result;
        }
    }
    return null;
}

// Compute scores
for (const cat of Object.values(categories)) {
    cat.score = cat.total > 0
        ? `${((cat.passed / cat.total) * 100).toFixed(1)}%`
        : '0%';
}

const totalTests = tests.length;
const totalPassed = tests.filter(t => t.status === 'passed').length;
const totalFailed = totalTests - totalPassed;

const benchmark = {
    label,
    timestamp: new Date().toISOString(),
    gitRef,
    summary: {
        total: totalTests,
        passed: totalPassed,
        failed: totalFailed,
        score: totalTests > 0 ? `${((totalPassed / totalTests) * 100).toFixed(1)}%` : '0%'
    },
    categories
};

// Write output
const outFile = path.join(__dirname, '..', 'benchmarks', `${label}.json`);
fs.writeFileSync(outFile, JSON.stringify(benchmark, null, 2));

// Print summary
console.log('\n' + '═'.repeat(50));
console.log(`Benchmark: ${label} | Git: ${gitRef}`);
console.log('═'.repeat(50));
console.log(`Total:      ${totalPassed}/${totalTests} (${benchmark.summary.score})`);
console.log(`Functional: ${categories.functional.passed}/${categories.functional.total} (${categories.functional.score})`);
console.log(`Content:    ${categories.content.passed}/${categories.content.total} (${categories.content.score})`);
console.log('═'.repeat(50));
console.log(`Results saved to: ${outFile}`);

if (totalFailed > 0) {
    console.log(`\nFailed tests (${totalFailed}):`);
    for (const t of tests.filter(t => t.status === 'failed')) {
        console.log(`  [-] ${t.name} (${t.file})`);
        if (t.error) console.log(`      ${t.error}`);
    }
}
