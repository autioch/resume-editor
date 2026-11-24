// On demand (the cleanup pass, docs/workflow.md): axe-core over every built page, in a headless
// Chrome or Edge driven over the DevTools protocol — no test framework. Each page four times:
// 320 and 1280 px wide, light and dark. At 320 px it also checks reflow (WCAG 1.4.10) and text
// spacing (1.4.12): no sideways scroll, before and after the 1.4.12 spacing is forced. Exits 1 on
// a violation. What axe can't decide ("needs review") is listed, not failed.
//   npm run build && node scripts/a11y.mjs        (BROWSER=<path> to pick the browser)
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { launchBrowser, serveDist } from './browser.mjs';
import { DIST, files, pageOf } from './dist.mjs';

const AXE = readFileSync(new URL(import.meta.resolve('axe-core/axe.min.js')), 'utf8');
const pkg = readFileSync(new URL(import.meta.resolve('axe-core/package.json')), 'utf8');
const { version } = JSON.parse(pkg);
const TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa', 'best-practice'];
const RUNS = [320, 1280].flatMap((width) =>
  ['light', 'dark'].map((scheme) => ({ width, scheme, name: `${width} ${scheme}` })),
);
const PARALLEL = 4;
// WCAG 1.4.12's minimums, forced on everything.
const SPACING = `* { line-height: 1.5 !important; letter-spacing: 0.12em !important;
  word-spacing: 0.16em !important; } p { margin-block-end: 2em !important; }`;

const { origin, close: stopServer } = await serveDist();
const { send, evaluate, openTab: newTab, navigate, close } = await launchBrowser();

async function openTab() {
  const sessionId = await newTab();
  // axe goes in as a script the page didn't ship; the site's CSP would block it.
  await send('Page.setBypassCSP', { enabled: true }, sessionId);
  return sessionId;
}

async function lookup(session, page, run) {
  await send(
    'Emulation.setDeviceMetricsOverride',
    { width: run.width, height: 800, deviceScaleFactor: 1, mobile: run.width < 768 },
    session,
  );
  await send(
    'Emulation.setEmulatedMedia',
    { features: [{ name: 'prefers-color-scheme', value: run.scheme }] },
    session,
  );
  await navigate(session, origin + page);
  await evaluate(session, AXE);
  const result = await evaluate(
    session,
    `axe.run(document, { runOnly: { type: 'tag', values: ${JSON.stringify(TAGS)} } })
      .then((r) => ({
        violations: r.violations.map((v) => ({ id: v.id, impact: v.impact, help: v.help,
          targets: v.nodes.map((n) => n.target.join(' ')) })),
        incomplete: r.incomplete.map((v) => ({ id: v.id, help: v.help,
          targets: v.nodes.map((n) => n.target.join(' ')) })),
      }))`,
  );
  if (run.width === 320) {
    // Against the emulated width: on a phone the browser zooms out to fit, so innerWidth grows too.
    const scrolls = `document.documentElement.scrollWidth > ${run.width}`;
    result.reflow = await evaluate(session, scrolls);
    result.spacing = await evaluate(
      session,
      `(() => { const s = document.createElement('style');
        s.textContent = ${JSON.stringify(SPACING)}; document.head.append(s);
        return ${scrolls}; })()`,
    );
  }
  return result;
}

const jobs = files(DIST, '.html').flatMap((file) =>
  RUNS.map((run) => ({ page: pageOf(file), run })),
);
const queue = [...jobs];
const results = [];
await Promise.all(
  Array.from({ length: PARALLEL }, async () => {
    const session = await openTab();
    for (let job = queue.shift(); job; job = queue.shift()) {
      results.push({ ...job, ...(await lookup(session, job.page, job.run)) });
    }
  }),
);

await close();
stopServer();

function group(key) {
  const byRule = new Map();
  for (const r of results) {
    for (const v of r[key]) {
      const rule = byRule.get(v.id) ?? { ...v, at: new Map() };
      for (const target of v.targets) {
        const at = rule.at.get(target) ?? { pages: new Set(), runs: new Set() };
        at.pages.add(r.page);
        at.runs.add(r.run.name);
        rule.at.set(target, at);
      }
      byRule.set(v.id, rule);
    }
  }
  return [...byRule.values()];
}
function where({ pages, runs }) {
  const p = pages.size > 3 ? `${pages.size} pages` : [...pages].join(', ');
  return runs.size === RUNS.length ? p : `${p} (${[...runs].join(', ')})`;
}
const violations = group('violations');
const review = group('incomplete');
const reflow = results.filter((r) => r.reflow).map((r) => `${r.page} (${r.run.name})`);
const spacing = results.filter((r) => r.spacing).map((r) => `${r.page} (${r.run.name})`);

console.log(
  `a11y: ${jobs.length / RUNS.length} pages × ${RUNS.length} runs (${RUNS.map((r) => r.name).join(', ')}), axe-core ${version}.`,
);
for (const v of violations) {
  console.error(`\n✗ ${v.id} (${v.impact}) — ${v.help}`);
  for (const [target, at] of v.at) {
    console.error(`    ${target}\n      on ${where(at)}`);
  }
}
if (reflow.length) {
  console.error(`\n✗ Sideways scroll at 320 px (1.4.10):\n  ${reflow.join('\n  ')}`);
}
if (spacing.length) {
  console.error(`\n✗ Sideways scroll with text spacing (1.4.12):\n  ${spacing.join('\n  ')}`);
}
if (review.length) {
  console.log('\nNeeds review (axe could not decide — check by hand):');
  for (const v of review) {
    console.log(`  ${v.id} — ${v.help}`);
    for (const [target, at] of v.at) {
      console.log(`    ${target}\n      on ${where(at)}`);
    }
  }
}
if (violations.length || reflow.length || spacing.length) {
  process.exit(1);
}
console.log('\nNo violations; reflow and text spacing hold at 320 px.');
