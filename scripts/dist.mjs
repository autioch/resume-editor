// Shared by the build (astro.config.mjs) and the checks in scripts/: the site's origin, walking a
// directory and a built file's URL path.
import { readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';

export const DIST = 'dist';
/** The site's one origin: astro.config.mjs `site`, the checks' Origin and default target. */
export const ORIGIN = 'https://cv.jakub.page';

/** Every file under `dir` ending in `ext`, recursively. */
export function files(dir, ext) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => {
    if (e.isDirectory()) {
      return files(join(dir, e.name), ext);
    }
    return e.name.endsWith(ext) ? [join(dir, e.name)] : [];
  });
}

/** `dist/about/index.html` → `/about/`. */
export function pageOf(file) {
  return `/${relative(DIST, file).split(sep).join('/')}`.replace(/index\.html$/, '');
}
