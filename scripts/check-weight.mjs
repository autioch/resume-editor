// Gate step: what a visit costs. Per page, the HTML plus everything it loads from dist/
// (stylesheets, the script, preloaded fonts, icons and images it links), gzipped; the five heaviest pages (every
// page with --all, for a cleanup); a line for each budget broken. Exits 1 over budget.
//   node scripts/check-weight.mjs [--all | --json]
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { gzipSync } from 'node:zlib';
import { DIST, files, pageOf } from './dist.mjs';

// Gzipped KB, the setup's ceiling: a page, one stylesheet, a small script
// and room for a self-hosted Polish font (~75 KB for two subsets, already compressed). A notable
// growth fails the gate and is a decision, not a drift. Raise one on purpose.
const BUDGET = { html: 15, css: 8, js: 10, font: 80, total: 110 };

function gz(file) {
  return gzipSync(readFileSync(file)).length;
}
function kb(n) {
  return `${(n / 1024).toFixed(1)} KB`;
}

const rows = [];
for (const file of files(DIST, '.html')) {
  const html = readFileSync(file, 'utf8');
  const page = pageOf(file);
  const assets = [
    ...html.matchAll(
      /<link [^>]*rel="(?:stylesheet|icon|apple-touch-icon|preload)"[^>]*href="(\/[^"]+)"/g,
    ),
    ...html.matchAll(/<(?:script|img)[^>]*src="(\/[^"]+)"/g),
  ]
    .map((m) => join(DIST, m[1] ?? ''))
    .filter((f, i, all) => all.indexOf(f) === i && existsSync(f) && statSync(f).isFile());
  function sum(ext) {
    return assets.filter((f) => f.endsWith(ext)).reduce((n, f) => n + gz(f), 0);
  }
  const htmlGz = gz(file);
  const css = sum('.css');
  const js = sum('.js');
  const font = sum('.woff2');
  const total = htmlGz + assets.reduce((n, f) => n + gz(f), 0);
  rows.push({ page, html: htmlGz, css, js, font, total });
}

rows.sort((a, b) => b.total - a.total);
// For the audit (scripts/audit.mjs): the figures alone, in bytes.
if (process.argv.includes('--json')) {
  console.log(JSON.stringify(rows));
  process.exit(0);
}
const shown = process.argv.includes('--all') ? rows : rows.slice(0, 5);
console.log('gzipped     HTML      CSS       JS     font    total  page');
for (const r of shown) {
  console.log(
    `         ${[r.html, r.css, r.js, r.font, r.total].map((n) => kb(n).padStart(8)).join(' ')}  ${r.page}`,
  );
}

const over = rows.flatMap((r) =>
  Object.entries(BUDGET)
    .filter(([key, max]) => r[key] > max * 1024)
    .map(([key, max]) => `${r.page}: ${key} ${kb(r[key])} > ${max} KB`),
);
if (over.length) {
  console.error(`\nOver budget:\n${over.join('\n')}`);
  process.exit(1);
}
console.log(
  `\nAll ${rows.length} pages within budget (${Object.entries(BUDGET)
    .map(([k, v]) => `${k} ${v} KB`)
    .join(', ')}).`,
);
