/* eslint-env node */

import { readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

const DIST_ASSETS_DIR = join(process.cwd(), 'dist', 'assets');

const BUDGETS = {
  maxJsKb: 175,
  maxCssKb: 105,
  maxTotalJsKb: 360,
};

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

function main() {
  const { jsStats, cssStats } = getAssetStats();

  const largestJs = jsStats.reduce((largest, current) =>
    current.bytes > largest.bytes ? current : largest,
  { file: '', bytes: 0 });

  const largestCss = cssStats.reduce((largest, current) =>
    current.bytes > largest.bytes ? current : largest,
  { file: '', bytes: 0 });

  const totalJsBytes = jsStats.reduce((sum, file) => sum + file.bytes, 0);

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

  if (formatKb(totalJsBytes) > BUDGETS.maxTotalJsKb) {
    failures.push(
      `Total JS bundle exceeded budget: ${formatKb(totalJsBytes)}KB (limit ${BUDGETS.maxTotalJsKb}KB)`
    );
  }

  console.log('Bundle budget summary');
  console.log(`- Largest JS: ${largestJs.file} (${formatKb(largestJs.bytes)}KB)`);
  console.log(`- Largest CSS: ${largestCss.file} (${formatKb(largestCss.bytes)}KB)`);
  console.log(`- Total JS: ${formatKb(totalJsBytes)}KB`);

  if (failures.length > 0) {
    console.error('\nBundle budget check failed:');
    failures.forEach((failure) => console.error(`- ${failure}`));
    process.exit(1);
  }

  console.log('Bundle budget check passed.');
}

main();
