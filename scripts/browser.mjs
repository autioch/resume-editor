// The browser checks' shared part (a11y, perf, lighthouse): dist/ over HTTP, and a headless Chrome or
// Edge driven over the DevTools protocol — no test framework. BROWSER=<path> picks the browser.
import { spawn } from 'node:child_process';
import { existsSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { createServer } from 'node:http';
import { tmpdir } from 'node:os';
import { extname, join } from 'node:path';
import process from 'node:process';
import { DIST } from './dist.mjs';

const BROWSERS = [
  process.env['BROWSER'],
  'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  'C:/Program Files/Google/Chrome/Application/chrome.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
];

const TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};

/** dist/ the way Netlify maps paths — without its headers, CSP or compression. */
export async function serveDist() {
  const server = createServer((req, res) => {
    let path = join(DIST, decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname));
    if (path.endsWith('/') || path.endsWith('\\')) {
      path = join(path, 'index.html');
    }
    if (!existsSync(path)) {
      return res.writeHead(404).end();
    }
    res.writeHead(200, { 'content-type': TYPES[extname(path)] ?? 'application/octet-stream' });
    res.end(readFileSync(path));
  });
  await new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(undefined)));
  const address = server.address();
  return {
    origin: `http://127.0.0.1:${typeof address === 'object' && address ? address.port : 0}`,
    close: () => server.close(),
  };
}

/** A headless browser and one DevTools connection to it; each tab is a session on it. */
export async function launchBrowser() {
  const browserPath = BROWSERS.find((p) => p && existsSync(p));
  if (!browserPath) {
    console.error('No Chrome or Edge found — set BROWSER to its executable.');
    process.exit(1);
  }
  const profile = mkdtempSync(join(tmpdir(), 'resume-editor-'));
  const browser = spawn(
    browserPath,
    [
      '--headless=new',
      '--remote-debugging-port=0',
      `--user-data-dir=${profile}`,
      '--no-first-run',
      // GitHub's Ubuntu runners forbid the sandbox's user namespaces (the runner is thrown away, the
      // pages are our own) and have a small /dev/shm.
      ...(process.env['CI'] ? ['--no-sandbox', '--disable-dev-shm-usage'] : []),
      'about:blank',
    ],
    { stdio: ['ignore', 'ignore', 'pipe'] },
  );
  let browserLog = '';
  browser.stderr.on('data', (chunk) => (browserLog += chunk));
  // The browser writes its port and path to the profile (on Windows its stderr isn't ours to read,
  // and the launcher exits while the browser runs on). A cold start on a CI runner has taken over
  // 20 s, so it gets a minute.
  const portFile = join(profile, 'DevToolsActivePort');
  for (let i = 0; i < 600 && !existsSync(portFile); i++) {
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  if (!existsSync(portFile)) {
    console.error(`${browserPath} didn't open a DevTools port.\n${browserLog}`);
    process.exit(1);
  }
  const [port = '', path] = readFileSync(portFile, 'utf8').split('\n');
  const ws = new WebSocket(`ws://127.0.0.1:${port}${path}`);
  await new Promise((resolve) => ws.addEventListener('open', resolve, { once: true }));

  let lastId = 0;
  const pending = new Map();
  const listeners = new Set();
  ws.addEventListener('message', ({ data }) => {
    const msg = JSON.parse(String(data));
    if (msg.id) {
      const { resolve, reject } = pending.get(msg.id);
      pending.delete(msg.id);
      if (msg.error) {
        reject(new Error(msg.error.message));
      } else {
        resolve(msg.result);
      }
    } else {
      listeners.forEach((listener) => listener(msg));
    }
  });
  function send(method, params = {}, sessionId = undefined) {
    return new Promise((resolve, reject) => {
      const id = ++lastId;
      pending.set(id, { resolve, reject });
      ws.send(JSON.stringify({ id, method, params, sessionId }));
    });
  }
  async function evaluate(session, expression) {
    const { result, exceptionDetails } = await send(
      'Runtime.evaluate',
      { expression, awaitPromise: true, returnByValue: true },
      session,
    );
    if (exceptionDetails) {
      throw new Error(exceptionDetails.exception?.description ?? 'evaluate');
    }
    return result.value;
  }
  async function openTab() {
    const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
    const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
    await send('Page.enable', {}, sessionId);
    return sessionId;
  }
  /** Navigates a tab and resolves on its load event. */
  async function navigate(session, url) {
    const loaded = new Promise((resolve) => {
      function onLoad(msg) {
        if (msg.method === 'Page.loadEventFired' && msg.sessionId === session) {
          listeners.delete(onLoad);
          resolve(undefined);
        }
      }
      listeners.add(onLoad);
    });
    await send('Page.navigate', { url }, session);
    await loaded;
  }
  async function close() {
    await send('Browser.close').catch(() => undefined);
    ws.close();
    browser.kill();
    // The browser lets go of its profile a moment after closing; a leftover in the temp dir is
    // harmless.
    try {
      rmSync(profile, { recursive: true, force: true, maxRetries: 20, retryDelay: 250 });
    } catch {
      // left for the OS to clear
    }
  }
  return { port: Number(port), send, evaluate, openTab, navigate, listeners, close };
}
