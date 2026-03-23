#!/usr/bin/env node
/**
 * aggregate-results.js
 *
 * Parses JUnit XML files produced by all three test layers and merges them
 * into a single results/summary.json file consumed by the QA dashboard.
 *
 * Usage:
 *   node scripts/aggregate-results.js
 *
 * Input files (must exist first — run tests before aggregating):
 *   results/junit/pytest-results.xml
 *   results/junit/vitest-results.xml
 *   results/junit/e2e-results.xml
 *
 * Output:
 *   results/summary.json
 */

const fs   = require('fs');
const path = require('path');

const ROOT        = path.resolve(__dirname, '..');
const JUNIT_DIR   = path.join(ROOT, 'results', 'junit');
const OUTPUT_FILE = path.join(ROOT, 'results', 'summary.json');

// ── JUnit XML parser (no external deps) ──────────────────────────────────────

function parseJunit(filePath) {
  if (!fs.existsSync(filePath)) {
    console.warn(`[aggregate] Missing: ${filePath} — skipping`);
    return { passed: 0, failed: 0, skipped: 0, total: 0, duration_ms: 0, failures: [] };
  }

  const xml     = fs.readFileSync(filePath, 'utf-8');
  const tests   = parseInt(xml.match(/tests="(\d+)"/)?.[1]   ?? '0', 10);
  const failures = parseInt(xml.match(/failures="(\d+)"/)?.[1] ?? '0', 10);
  const errors   = parseInt(xml.match(/errors="(\d+)"/)?.[1]   ?? '0', 10);
  const skipped  = parseInt(xml.match(/skipped="(\d+)"/)?.[1]  ?? '0', 10);
  const timeRaw  = parseFloat(xml.match(/time="([\d.]+)"/)?.[1] ?? '0');

  const totalFailed = failures + errors;
  const passed      = tests - totalFailed - skipped;

  // Extract failure details
  const failureMatches = [...xml.matchAll(/<testcase[^>]*name="([^"]*)"[^>]*>[\s\S]*?<failure[^>]*message="([^"]*)"[^>]*>/g)];
  const failDetails = failureMatches.map(([, name, msg]) => ({ name: name.trim(), error: msg.trim() }));

  return {
    passed: Math.max(0, passed),
    failed: totalFailed,
    skipped,
    total: tests,
    duration_ms: Math.round(timeRaw * 1000),
    failures: failDetails,
  };
}

// ── Main ─────────────────────────────────────────────────────────────────────

const suiteMap = {
  'Backend API (pytest)':          path.join(JUNIT_DIR, 'pytest-results.xml'),
  'Frontend Components (Vitest)':  path.join(JUNIT_DIR, 'vitest-results.xml'),
  'E2E Tests (Playwright)':        path.join(JUNIT_DIR, 'e2e-results.xml'),
};

const suites = [];
const failedTests = [];
let totalPassed = 0, totalFailed = 0, totalSkipped = 0, totalTests = 0;

for (const [name, filePath] of Object.entries(suiteMap)) {
  const result = parseJunit(filePath);
  suites.push({ name, passed: result.passed, failed: result.failed, total: result.total, duration_ms: result.duration_ms });
  result.failures.forEach((f) => failedTests.push({ suite: name, name: f.name, error: f.error }));
  totalPassed  += result.passed;
  totalFailed  += result.failed;
  totalSkipped += result.skipped;
  totalTests   += result.total;
}

// Read git info
function git(cmd) {
  try { return require('child_process').execSync(cmd, { encoding: 'utf-8' }).trim(); }
  catch { return 'unknown'; }
}

const summary = {
  generated_at: new Date().toISOString(),
  run_id:      `ci-run-${Date.now()}`,
  git_sha:     git('git rev-parse --short HEAD'),
  git_branch:  git('git rev-parse --abbrev-ref HEAD'),
  overall: { passed: totalPassed, failed: totalFailed, skipped: totalSkipped, total: totalTests },
  suites,
  failed_tests: failedTests,
  endpoint_health: [], // populated by upload-summary.js or CI health-check step
};

fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(summary, null, 2));

console.log(`[aggregate] ✓ summary.json written → ${OUTPUT_FILE}`);
console.log(`  Passed: ${totalPassed}  Failed: ${totalFailed}  Skipped: ${totalSkipped}  Total: ${totalTests}`);
if (totalFailed > 0) process.exit(1);
