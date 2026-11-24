// Gate step, two checks on every stylesheet in src/ (src/shared/styles.css and the components' own). Every
// class a stylesheet selects has markup — in a built page, in a component's template (markup
// that renders only with some content) or set by a page script (`className =`, `classList.add`): knip can't see CSS, so a rule
// whose markup is gone stays behind silently. And no colour literal outside the token stylesheet — a rule
// takes its colours from the tokens (development.md). Run after the build.
//   node scripts/check-css.mjs
import { readFileSync } from 'node:fs';
import { basename } from 'node:path';
import process from 'node:process';
import { DIST, files } from './dist.mjs';

const TOKENS = 'styles.css';
// A hex colour or a colour function; keywords (currentcolor, transparent) are fine.
const COLOUR = /#[\da-f]{3,8}\b|\b(?:rgba?|hsla?|hwb|lab|lch|oklab|oklch|color)\(/gi;

const used = new Set();
function add(list = '') {
  list.split(/\s+/).forEach((name) => name && used.add(name));
}
for (const file of files(DIST, '.html')) {
  for (const [, list] of readFileSync(file, 'utf8').matchAll(/\sclass="([^"]*)"/g)) {
    add(list);
  }
}
for (const file of files('src', '.astro')) {
  const source = readFileSync(file, 'utf8');
  for (const [, list] of source.matchAll(/\sclass="([^"{]*)"/g)) {
    add(list);
  }
  for (const [, items = ''] of source.matchAll(/class:list=\{\[([^\]]*)\]\}/g)) {
    for (const [, name] of items.matchAll(/'([\w-]+)'/g)) {
      add(name);
    }
  }
}

for (const file of files('src', '.ts')) {
  const source = readFileSync(file, 'utf8');
  for (const [, list] of source.matchAll(/className = '([^']*)'/g)) {
    add(list);
  }
  for (const [, name] of source.matchAll(/classList\.(?:add|toggle)\('([\w-]+)'/g)) {
    add(name);
  }
}

// The selector text of each rule: what stands before a "{", comments and @-rules left out.
const unused = [];
const literals = [];
for (const file of files('src', '.css')) {
  const css = readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, (c) =>
    c.replace(/[^\n]/g, ' '),
  );
  if (basename(file) !== TOKENS) {
    for (const match of css.matchAll(COLOUR)) {
      const line = css.slice(0, match.index).split('\n').length;
      literals.push(`${file}:${line}  ${match[0]}`);
    }
  }
  for (const match of css.matchAll(/([^{};]+)\{/g)) {
    const selector = match[1] ?? '';
    if (selector.trim().startsWith('@')) {
      continue;
    }
    const line = css.slice(0, match.index).split('\n').length + selector.split('\n').length - 1;
    for (const [, name = ''] of selector.matchAll(/\.(-?[_a-zA-Z][\w-]*)/g)) {
      if (!used.has(name)) {
        unused.push(`${file}:${line}  .${name}`);
      }
    }
  }
}

if (unused.length) {
  console.error(
    `Classes in CSS with no markup in a page or template (${unused.length}):\n${unused.join('\n')}`,
  );
}
if (literals.length) {
  console.error(`Colour literals outside ${TOKENS} (${literals.length}):\n${literals.join('\n')}`);
}
if (unused.length || literals.length) {
  process.exit(1);
}
console.log(
  `CSS: every class has markup (${used.size} in pages and templates); colours only in ${TOKENS}.`,
);
