// Every crawler is welcome, AI ones included: the point is to be found and cited. Content
// Signals (contentsignals.org) say the same as data: search, AI answers and training are all yes
// (owner).
import type { APIContext } from 'astro';

export function GET({ site }: APIContext): Response {
  return new Response(
    [
      'User-agent: *',
      'Content-Signal: search=yes, ai-input=yes, ai-train=yes',
      'Allow: /',
      '',
      `Sitemap: ${new URL('/sitemap.xml', site).href}`,
      '',
    ].join('\n'),
  );
}
