// Every indexable page. Grows with the pages.
import type { APIContext } from 'astro';

const PATHS = ['/'];

export function GET({ site }: APIContext): Response {
  return new Response(
    [
      '<?xml version="1.0" encoding="UTF-8"?>',
      '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
      ...PATHS.map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`),
      '</urlset>',
      '',
    ].join('\n'),
    { headers: { 'Content-Type': 'application/xml' } },
  );
}
