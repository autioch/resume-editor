// Gate step: every internal link in the built site resolves — href and src starting with "/", and
// absolute URLs on the site's own origin (canonical, hreflang, og:url). A "#id" must exist on the
// target page. A renamed slug or section then fails the gate instead of shipping a dead link.
// A link glued to the word before or after it ("opisuje<a>przepis</a>") fails too: a template line
// that ends in text and a next line that starts with <a> loses the space between them.
//   node scripts/check-links.mjs
import { existsSync, readFileSync, statSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';
import { DIST, ORIGIN, files, pageOf } from './dist.mjs';

// A URL path → the file Netlify serves for it, or undefined.
function target(path) {
  const file = join(DIST, decodeURIComponent(path));
  if (path.endsWith('/')) {
    return existsSync(join(file, 'index.html')) ? join(file, 'index.html') : undefined;
  }
  if (existsSync(file) && statSync(file).isFile()) {
    return file;
  }
  return existsSync(join(file, 'index.html')) ? join(file, 'index.html') : undefined;
}

const ids = new Map();
function idsOf(file) {
  if (!ids.has(file)) {
    ids.set(
      file,
      new Set([...readFileSync(file, 'utf8').matchAll(/\sid="([^"]+)"/g)].map((m) => m[1])),
    );
  }
  return ids.get(file);
}

const broken = [];
let checked = 0;
for (const file of files(DIST, '.html')) {
  const page = pageOf(file);
  const html = readFileSync(file, 'utf8');
  for (const [, attr, url = ''] of html.matchAll(/\s(href|src|content)="([^"]*)"/g)) {
    // A meta's content is a link only when it's on the site's origin (og:url, og:image).
    if (attr === 'content' && !url.startsWith(ORIGIN)) {
      continue;
    }
    let link = url.startsWith(ORIGIN) ? url.slice(ORIGIN.length) || '/' : url;
    if (link.startsWith('#')) {
      link = page + link;
    }
    if (!link.startsWith('/') || link.startsWith('//')) {
      continue;
    }
    checked++;
    const [beforeHash = '', hash] = link.split('#');
    const path = beforeHash.split('?')[0] || '/';
    const found = target(path);
    if (!found) {
      broken.push(`${page}  →  ${url}  (no such page or file)`);
    } else if (hash && found.endsWith('.html') && !idsOf(found).has(hash)) {
      broken.push(`${page}  →  ${url}  (no id="${hash}" there)`);
    }
  }
  for (const [glued] of html.matchAll(/[\p{L}\p{N}]<a\s[^>]*>[^<]*<\/a>|<\/a>[\p{L}\p{N}]/gu)) {
    broken.push(`${page}  →  ${glued}  (no space between the link and the text beside it)`);
  }
}

if (broken.length) {
  console.error(`Broken internal links (${broken.length}):\n${broken.join('\n')}`);
  process.exit(1);
}
console.log(`Internal links: all ${checked} resolve.`);
