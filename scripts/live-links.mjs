// On demand (the cleanup pass, docs/workflow.md): every external link in the built site, fetched
// once. Not in the gate — other people's servers fail for a moment, and some refuse scripts (403,
// 429): those are listed to check by hand, not as broken. Exits 1 only on a link that is gone.
//   node scripts/live-links.mjs [--json]
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { DIST, ORIGIN, files, pageOf } from './dist.mjs';

const TIMEOUT = 15_000;
const PARALLEL = 4;

const links = new Map();
for (const file of files(DIST, '.html')) {
  const page = pageOf(file);
  for (const [, url = ''] of readFileSync(file, 'utf8').matchAll(/\shref="(https?:\/\/[^"]+)"/g)) {
    if (url.startsWith(ORIGIN)) {
      continue;
    }
    links.set(url, [...(links.get(url) ?? []), page]);
  }
}

// HEAD first; servers that don't answer HEAD properly get a GET.
async function probe(url) {
  for (const method of ['HEAD', 'GET']) {
    try {
      const res = await fetch(url, {
        method,
        redirect: 'follow',
        signal: AbortSignal.timeout(TIMEOUT),
        headers: { 'user-agent': `Mozilla/5.0 (link check for ${new URL(ORIGIN).host})` },
      });
      if (res.ok || method === 'GET') {
        return String(res.status);
      }
    } catch (error) {
      if (method === 'GET') {
        return error instanceof Error ? error.name : 'error';
      }
    }
  }
  return 'error';
}

const queue = [...links.keys()];
const results = [];
await Promise.all(
  Array.from({ length: PARALLEL }, async () => {
    for (let url = queue.shift(); url; url = queue.shift()) {
      results.push([url, await probe(url)]);
    }
  }),
);

// Gone: 404/410, or no such host (fetch's TypeError). Anything else not 2xx/3xx: check by hand.
function isGone(status) {
  return status === '404' || status === '410' || status === 'TypeError';
}
const gone = results.filter(([, s]) => isGone(s));
const byHand = results.filter(([, s]) => !isGone(s) && !/^[23]\d\d$/.test(s));
// --json (the audit, scripts/audit.mjs): the two lists, no report.
if (process.argv.includes('--json')) {
  console.log(
    JSON.stringify({ gone: gone.map(([url]) => url), byHand: byHand.map(([url]) => url) }),
  );
  process.exit(0);
}
function line([url, status]) {
  const pages = [...new Set(links.get(url))];
  const where = pages.length > 3 ? `${pages.length} pages` : pages.join(', ');
  return `${status.padEnd(12)} ${url}\n             on ${where}`;
}
console.log(`External links: ${results.length} checked.`);
if (byHand.length) {
  console.log(`\nCheck by hand (refused or timed out):\n${byHand.map(line).join('\n')}`);
}
if (gone.length) {
  console.error(`\nGone:\n${gone.map(line).join('\n')}`);
  process.exit(1);
}
