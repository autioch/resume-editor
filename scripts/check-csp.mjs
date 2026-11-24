// Gate step: the built site keeps to the CSP in netlify.toml (default-src 'none'; script, style
// and img from 'self' only). A break there passes the build and shows only in a real browser on a
// deploy preview — here it fails the gate instead. In dist/: script files only where Astro bundles
// ours, _astro/; in a page, every script an external module from there, no inline style or script
// (JSON-LD is data, and fine), no inline handler or javascript: URL, nothing the page loads from
// another origin. Plus Trusted Types in the CSP, and security.txt's Expires, valid and at most a
// year ahead.
//   node scripts/check-csp.mjs
import { readFileSync } from 'node:fs';
import { join, sep } from 'node:path';
import process from 'node:process';
import { DIST, files, pageOf } from './dist.mjs';

const BUNDLES = join(DIST, '_astro') + sep;
const BUNDLE_TAG = /^<script type="module" src="\/_astro\/[\w.-]+\.js"><\/script>$/;
const DATA_TAG = '<script type="application/ld+json">';

const problems = files(DIST, '.js')
  .filter((file) => !file.startsWith(BUNDLES))
  .map((file) => `${file}  (a script outside _astro/)`);

const policy = readFileSync('netlify.toml', 'utf8').match(
  /Content-Security-Policy\s*=\s*"([^"]+)"/,
)?.[1];
// The site fetches nothing (security.md § Trust model): connect-src falls back to default-src 'none'.
// A directive here would be a new origin the page talks to — a trust-model change, decided first.
if (!policy || /(?:^|;)\s*connect-src\b/.test(policy)) {
  problems.push(
    'netlify.toml  the CSP must exist and carry no connect-src (the site fetches nothing)',
  );
}

for (const file of files(DIST, '.html')) {
  const html = readFileSync(file, 'utf8');
  const page = pageOf(file);
  function flag(what) {
    problems.push(`${page}  ${what}`);
  }
  if (/<style[\s>]/.test(html)) {
    flag('<style> element');
  }
  if (/<[^>]+\sstyle="/.test(html)) {
    flag('style attribute');
  }
  if (/<[^>]+\son[a-z]+="/.test(html)) {
    flag('inline event handler');
  }
  if (/="javascript:/i.test(html)) {
    flag('javascript: URL');
  }
  // A bundle tag is empty; anything else with a body is an inline script.
  for (const [tag] of html.matchAll(/<script\b[^>]*>(?:<\/script>)?/g)) {
    if (tag !== DATA_TAG && !BUNDLE_TAG.test(tag)) {
      flag(`script ${tag}`);
    }
  }
  // What the page loads itself: src on any element, href on stylesheet, icon and manifest links.
  const loads = [
    ...html.matchAll(/\ssrc="([^"]+)"/g),
    ...html.matchAll(
      /<link [^>]*rel="(?:stylesheet|icon|apple-touch-icon|manifest|preload|modulepreload)"[^>]*href="([^"]+)"/g,
    ),
  ];
  for (const [, url = ''] of loads) {
    if (/^(?:https?:)?\/\//.test(url)) {
      flag(`loads ${url} from another origin`);
    }
  }
}

// Trusted Types: the browser refuses every markup and script sink, and no policy may unlock one
// (security.md § Transport & headers). Dropping either directive would silently undo it.
for (const directive of ["require-trusted-types-for 'script'", "trusted-types 'none'"]) {
  if (!policy?.split(/\s*;\s*/).includes(directive)) {
    problems.push(`netlify.toml  the CSP lacks ${directive}`);
  }
}

// RFC 9116: security.txt must expire, and at most a year ahead — an expired one tells reporters the
// contact is dead. Failing here is the reminder to move EXPIRES in security.txt.ts on.
const securityTxt = readFileSync(join(DIST, '.well-known', 'security.txt'), 'utf8');
const expires = Date.parse(securityTxt.match(/^Expires: (.+)$/m)?.[1] ?? '');
const YEAR = 366 * 24 * 60 * 60 * 1000;
if (!(expires > Date.now() && expires - Date.now() <= YEAR)) {
  problems.push('.well-known/security.txt  Expires must be in the future and at most a year ahead');
}

if (problems.length) {
  console.error(`Output the CSP would block (${problems.length}):\n${problems.join('\n')}`);
  process.exit(1);
}
console.log('Output: scripts only as bundles in _astro/, nothing inline, no external loads.');
console.log('CSP: no connect-src, Trusted Types on; security.txt is current.');
