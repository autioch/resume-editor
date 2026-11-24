// Weekly: the headers the live site sends match netlify.toml — a header dropped by a Netlify
// setting, a domain move or a config typo shows nowhere else (the local preview has none).
// Every [[headers]] block is fetched once: "/*" as /, "/_astro/*" as a bundle the page loads (its
// stylesheet or script), an
// exact path as itself. On *.netlify.app Netlify sends its own HSTS, so that one is skipped there.
// Netlify drops the spaces after commas in a list value (Cache-Control), so those don't count.
//   node scripts/live-headers.mjs [base URL, default the production site]
import { readFileSync } from 'node:fs';
import process from 'node:process';
import { ORIGIN } from './dist.mjs';

const base = new URL(process.argv[2] ?? `${ORIGIN}/`);
const netlifyHost = base.hostname.endsWith('.netlify.app');

/** netlify.toml's [[headers]] blocks: `for` and its `[headers.values]`, one `Key = "value"` a line. */
function headerRules(toml) {
  return toml
    .split(/^\[\[headers\]\]$/m)
    .slice(1)
    .map((block) => ({
      path: block.match(/^\s*for\s*=\s*"([^"]+)"/m)?.[1] ?? '',
      values: [...block.matchAll(/^\s*([A-Za-z-]+)\s*=\s*"([^"]*)"/gm)].map(
        ([, name = '', value = '']) => ({
          name,
          value,
        }),
      ),
    }));
}

function normalized(value) {
  return value.replace(/\s*,\s*/g, ',');
}

async function get(path) {
  const response = await fetch(new URL(path, base), {
    redirect: 'manual',
    signal: AbortSignal.timeout(20_000),
  });
  if (response.status !== 200) {
    throw new Error(`${path}: HTTP ${response.status}`);
  }
  return response;
}

const problems = [];
const page = await get('/');
const bundle = (await page.clone().text()).match(
  /(?:src|href)="(\/_astro\/[^"]+\.(?:js|css))"/,
)?.[1];
// A page's Markdown copy, for the `/*.md` rule: the first one llms.txt links.
const markdown = (await (await get('/llms.txt')).text()).match(
  /https?:\/\/[^/\s)]+(\/[^\s)]*\/index\.md)/,
)?.[1];

for (const { path, values } of headerRules(readFileSync('netlify.toml', 'utf8'))) {
  const target =
    path === '/*' ? '/' : path === '/_astro/*' ? bundle : path === '/*.md' ? markdown : path;
  if (!target || target.includes('*')) {
    problems.push(`netlify.toml  for = "${path}": no page to fetch for it`);
    continue;
  }
  const response = target === '/' ? page : await get(target);
  for (const { name, value } of values) {
    if (name === 'for' || (netlifyHost && name === 'Strict-Transport-Security')) {
      continue;
    }
    const sent = response.headers.get(name);
    if (sent === null || normalized(sent) !== normalized(value)) {
      problems.push(
        `${target}  ${name}: expected "${value}", got ${sent === null ? 'none' : `"${sent}"`}`,
      );
    }
  }
}

if (problems.length) {
  console.error(`Headers on ${base.origin} differ from netlify.toml:\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(`Headers on ${base.origin} match netlify.toml.`);
