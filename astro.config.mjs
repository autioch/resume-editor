// @ts-check
import { defineConfig } from 'astro/config';
import { ORIGIN } from './scripts/dist.mjs';

export default defineConfig({
  site: ORIGIN,
  // Every page is a folder (/porady/), the same URL Netlify serves without a redirect.
  trailingSlash: 'always',
  build: {
    // The CSP allows stylesheets from 'self' only — never inline <style>.
    inlineStylesheets: 'never',
  },
  vite: {
    build: {
      // One stylesheet: split per page it'd come as several small files in no fixed order.
      cssCodeSplit: false,
      // Never inline an asset as a data: URL or a script into the page — the CSP blocks both.
      assetsInlineLimit: 0,
    },
  },
});
