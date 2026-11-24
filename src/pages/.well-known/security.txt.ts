// RFC 9116 security contact. Expires must stay under a year ahead: bump it once check:csp fails on it.
import type { APIContext } from 'astro';
import { AUTHOR } from '../../shared/consts.ts';

const EXPIRES = '2027-11-01T00:00:00.000Z';

export function GET({ site }: APIContext): Response {
  return new Response(
    [
      `Contact: ${AUTHOR.url}`,
      `Expires: ${EXPIRES}`,
      'Preferred-Languages: pl, en',
      `Canonical: ${new URL('/.well-known/security.txt', site).href}`,
      '',
    ].join('\n'),
  );
}
