const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
if (args.length < 2) {
    console.error('Usage: node compare-results.js <baseline.json> <fixed.json>');
    process.exit(1);
}

const baselinePath = args[0];
const fixedPath = args[1];

if (!fs.existsSync(baselinePath)) {
    console.error(`Baseline file not found: ${baselinePath}`);
    process.exit(1);
}
if (!fs.existsSync(fixedPath)) {
    console.error(`Fixed file not found: ${fixedPath}`);
    process.exit(1);
}

const baseline = JSON.parse(fs.readFileSync(baselinePath, 'utf-8'));
const fixed = JSON.parse(fs.readFileSync(fixedPath, 'utf-8'));

// Build test maps for comparison
function buildTestMap(benchmark) {
    const map = {};
    for (const [catName, cat] of Object.entries(benchmark.categories)) {
        for (const t of cat.tests) {
            map[`${catName}::${t.name}`] = t.status;
        }
    }
    return map;
}

const baselineMap = buildTestMap(baseline);
const fixedMap = buildTestMap(fixed);

// Find newly passing and regressions
const newlyPassing = [];
const regressions = [];

for (const key of Object.keys(fixedMap)) {
    const bStatus = baselineMap[key];
    const fStatus = fixedMap[key];
    const [cat, name] = key.split('::');

    if (bStatus === 'failed' && fStatus === 'passed') {
        newlyPassing.push({ name, category: cat });
    }
    if (bStatus === 'passed' && fStatus === 'failed') {
        regressions.push({ name, category: cat });
    }
}

// Also check for tests only in fixed (new tests)
const newTests = Object.keys(fixedMap).filter(k => !(k in baselineMap));

// Print comparison
const line = '─'.repeat(62);
console.log('');
console.log('═══ VUB Financial Readiness — Benchmark Comparison ═══');
console.log('');
console.log(`Baseline: ${baseline.label} (${baseline.gitRef}, ${baseline.timestamp.split('T')[0]})`);
console.log(`Fixed:    ${fixed.label} (${fixed.gitRef}, ${fixed.timestamp.split('T')[0]})`);
console.log('');

// Category table
const pad = (s, n) => String(s).padEnd(n);
const padL = (s, n) => String(s).padStart(n);

console.log(`${pad('Category', 18)}${pad('Baseline', 18)}${pad('Fixed', 18)}Delta`);
console.log(line);

const cats = ['functional', 'content'];
for (const catName of cats) {
    const bCat = baseline.categories[catName] || { passed: 0, total: 0, score: '0%' };
    const fCat = fixed.categories[catName] || { passed: 0, total: 0, score: '0%' };
    const delta = fCat.passed - bCat.passed;
    const deltaStr = delta >= 0 ? `+${delta}` : `${delta}`;
    const label = catName.charAt(0).toUpperCase() + catName.slice(1);

    console.log(
        `${pad(label, 18)}${pad(`${bCat.passed}/${bCat.total} (${bCat.score})`, 18)}${pad(`${fCat.passed}/${fCat.total} (${fCat.score})`, 18)}${deltaStr}`
    );
}

console.log(line);

const bTotal = baseline.summary;
const fTotal = fixed.summary;
const totalDelta = fTotal.passed - bTotal.passed;
const totalDeltaStr = totalDelta >= 0 ? `+${totalDelta}` : `${totalDelta}`;

console.log(
    `${pad('TOTAL', 18)}${pad(`${bTotal.passed}/${bTotal.total} (${bTotal.score})`, 18)}${pad(`${fTotal.passed}/${fTotal.total} (${fTotal.score})`, 18)}${totalDeltaStr}`
);

console.log('');

if (newlyPassing.length > 0) {
    console.log(`Newly Passing (${newlyPassing.length}):`);
    for (const t of newlyPassing) {
        console.log(`  [+] ${t.name} (${t.category})`);
    }
    console.log('');
}

if (regressions.length > 0) {
    console.log(`Regressions (${regressions.length}):`);
    for (const t of regressions) {
        console.log(`  [-] ${t.name} (${t.category})`);
    }
    console.log('');
} else {
    console.log('Regressions: None');
    console.log('');
}

if (newTests.length > 0) {
    console.log(`New tests (only in fixed): ${newTests.length}`);
}

// Write comparison JSON
const comparison = {
    baseline: { label: baseline.label, gitRef: baseline.gitRef, ...baseline.summary },
    fixed: { label: fixed.label, gitRef: fixed.gitRef, ...fixed.summary },
    delta: totalDelta,
    categories: {},
    newlyPassing,
    regressions
};

for (const catName of cats) {
    const bCat = baseline.categories[catName] || { passed: 0, total: 0 };
    const fCat = fixed.categories[catName] || { passed: 0, total: 0 };
    comparison.categories[catName] = {
        baseline: `${bCat.passed}/${bCat.total}`,
        fixed: `${fCat.passed}/${fCat.total}`,
        delta: fCat.passed - bCat.passed
    };
}

const outFile = path.join(path.dirname(fixedPath), 'comparison.json');
fs.writeFileSync(outFile, JSON.stringify(comparison, null, 2));
console.log(`Comparison saved to: ${outFile}`);
