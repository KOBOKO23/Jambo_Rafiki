/* eslint-env node */

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST_ASSETS_DIR = join(process.cwd(), 'dist', 'assets');

const BUDGETS = {
  maxJsKb: 175,
  maxCssKb: 105,
  maxTotalJsKb: 360,
};

// These chunks are intentionally lazy-loaded and should not gate public-page budgets.
const EXEMPT_JS_CHUNK_PATTERNS = [
  /^charts-/i,
  /^Dashboard-/i,
];

function formatKb(bytes) {
  return Number((bytes / 1024).toFixed(2));
}

function getAssetStats() {
  const files = readdirSync(DIST_ASSETS_DIR);

  const jsFiles = files.filter((file) => file.endsWith('.js'));
  const cssFiles = files.filter((file) => file.endsWith('.css'));

  const jsStats = jsFiles.map((file) => ({
    file,
    bytes: statSync(join(DIST_ASSETS_DIR, file)).size,
  }));

  const cssStats = cssFiles.map((file) => ({
    file,
    bytes: statSync(join(DIST_ASSETS_DIR, file)).size,
  }));

  return { jsStats, cssStats };
}

function isExemptJsChunk(fileName) {
  return EXEMPT_JS_CHUNK_PATTERNS.some((pattern) => pattern.test(fileName));
}

function main() {
  const { jsStats, cssStats } = getAssetStats();

  const exemptJsStats = jsStats.filter((file) => isExemptJsChunk(file.file));
  const budgetedJsStats = jsStats.filter((file) => !isExemptJsChunk(file.file));

  const largestJs = budgetedJsStats.reduce((largest, current) =>
    current.bytes > largest.bytes ? current : largest,
  { file: '', bytes: 0 });

  const largestCss = cssStats.reduce((largest, current) =>
    current.bytes > largest.bytes ? current : largest,
  { file: '', bytes: 0 });

  const totalJsBytes = jsStats.reduce((sum, file) => sum + file.bytes, 0);
  const totalBudgetedJsBytes = budgetedJsStats.reduce((sum, file) => sum + file.bytes, 0);
  const totalExemptJsBytes = exemptJsStats.reduce((sum, file) => sum + file.bytes, 0);

  const failures = [];

  if (formatKb(largestJs.bytes) > BUDGETS.maxJsKb) {
    failures.push(
      `Largest JS chunk exceeded budget: ${largestJs.file} is ${formatKb(largestJs.bytes)}KB (limit ${BUDGETS.maxJsKb}KB)`
    );
  }

  if (largestCss.file && formatKb(largestCss.bytes) > BUDGETS.maxCssKb) {
    failures.push(
      `Largest CSS chunk exceeded budget: ${largestCss.file} is ${formatKb(largestCss.bytes)}KB (limit ${BUDGETS.maxCssKb}KB)`
    );
  }

  if (formatKb(totalBudgetedJsBytes) > BUDGETS.maxTotalJsKb) {
    failures.push(
      `Total budgeted JS exceeded budget: ${formatKb(totalBudgetedJsBytes)}KB (limit ${BUDGETS.maxTotalJsKb}KB)`
    );
  }

  console.log('Bundle budget summary');
  console.log(`- Largest budgeted JS: ${largestJs.file || 'n/a'} (${formatKb(largestJs.bytes)}KB)`);
  console.log(`- Largest CSS: ${largestCss.file} (${formatKb(largestCss.bytes)}KB)`);
  console.log(`- Total JS (all chunks): ${formatKb(totalJsBytes)}KB`);
  console.log(`- Total JS (budgeted chunks): ${formatKb(totalBudgetedJsBytes)}KB`);
  console.log(`- Total JS (exempt lazy chunks): ${formatKb(totalExemptJsBytes)}KB`);
  if (exemptJsStats.length > 0) {
    console.log(`- Exempt chunks: ${exemptJsStats.map((file) => file.file).join(', ')}`);
  }

  if (failures.length > 0) {
    console.error('\nBundle budget check failed:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log('Bundle budget check passed.');
}

main();
