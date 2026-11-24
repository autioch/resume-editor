# resume-editor

**A CV editor in the browser** — an A4 sheet you edit in place, one stylish template, projects
saved on your device with autosave, import and export as JSON Resume, tips beside the page. No
account, no server. Proposed at **https://cv.jakub.page**.

| What                     | Where                                                                                 |
| ------------------------ | ------------------------------------------------------------------------------------- |
| Product vision           | [`docs/vision.md`](docs/vision.md)                                                    |
| Agent instructions       | [`CLAUDE.md`](CLAUDE.md) → [`docs/`](docs/)                                           |
| Netlify site, DNS, HTTPS | [`docs/standards/architecture.md` § Hosting](docs/standards/architecture.md#hosting)  |
| What's next              | [`docs/backlog.md`](docs/backlog.md) — the agreed queue and the owner's steps         |
| Research                 | [`docs/research/`](docs/research/) — other editors and data formats compared          |
| How work is done         | [`docs/workflow.md`](docs/workflow.md); rules in [`docs/standards/`](docs/standards/) |

**Status:** setup and the starting vision; the editor isn't built yet.

## Developer setup

Needs **git** and **Node.js 24** (see [`.nvmrc`](.nvmrc)); npm comes with it.

```bash
git clone https://github.com/autioch/resume-editor.git
```

```bash
npm ci
```

```bash
npm run dev
```

```bash
npm run ci
```

`npm ci` installs exactly what the lockfile pins; `npm run dev` serves the site at
http://localhost:4321/ (no Netlify headers locally); `npm run ci` is the gate — green before every
commit, and CI re-runs it. Every command: [CLAUDE.md § Commands](CLAUDE.md#commands).

## Agent setup (Claude Code)

The agent reads [`CLAUDE.md`](CLAUDE.md) on its own. Its MCP servers need tokens in environment
variables — which, and where to set them:
[development.md § MCP servers](docs/standards/development.md#mcp-servers).

Code: MIT.
