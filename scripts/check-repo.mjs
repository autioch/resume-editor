// Supply chain and secrets, from the repo itself (security.md § Enforced): every workflow action
// pinned to a commit, every dependency an exact version from the npm registry with an integrity
// hash, and no token in a tracked file. Offline; exits 1 with a line per problem.
//   node scripts/check-repo.mjs
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';
import process from 'node:process';

const problems = [];

// A tag can be moved to other code; a 40-hex commit can't. The comment keeps the version readable.
const WORKFLOWS = '.github/workflows';
for (const file of readdirSync(WORKFLOWS).filter((name) => /\.ya?ml$/.test(name))) {
  readFileSync(join(WORKFLOWS, file), 'utf8')
    .split('\n')
    .forEach((line, index) => {
      const uses = line.match(/^\s*-?\s*uses:\s*(\S+)(.*)$/);
      if (uses && !/^[^@\s]+@[0-9a-f]{40}$/.test(uses[1] ?? '')) {
        problems.push(
          `${WORKFLOWS}/${file}:${index + 1}  ${uses[1]} is not pinned to a commit SHA`,
        );
      } else if (uses && !/#\s*v\d/.test(uses[2] ?? '')) {
        problems.push(
          `${WORKFLOWS}/${file}:${index + 1}  name the version in a "# vX.Y.Z" comment`,
        );
      }
    });
}

// development.md § Conventions: versions exact. A range lets a release we never saw in.
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
for (const field of ['dependencies', 'devDependencies', 'overrides']) {
  for (const [name, version] of Object.entries(pkg[field] ?? {})) {
    if (typeof version !== 'string' || !/^\d+\.\d+\.\d+(-[\w.]+)?$/.test(version)) {
      problems.push(`package.json  ${field}.${name} "${version}" is not an exact version`);
    }
  }
}

// npm ci installs exactly the lockfile; every entry must come from the registry, hash-checked.
const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
for (const [path, entry] of Object.entries(lock.packages ?? {})) {
  if (!path || entry.link) {
    continue;
  }
  if (!entry.resolved?.startsWith('https://registry.npmjs.org/')) {
    problems.push(
      `package-lock.json  ${path} resolves outside the npm registry: ${entry.resolved}`,
    );
  }
  if (!entry.integrity?.startsWith('sha512-')) {
    problems.push(`package-lock.json  ${path} has no sha512 integrity hash`);
  }
}

// GitHub's secret scanning needs a paid plan on a private repo; this catches the usual shapes.
const SECRETS = [
  ['GitHub token', /\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{36}\b|\bgithub_pat_[A-Za-z0-9_]{60,}/],
  ['Netlify token', /\bnfp_[A-Za-z0-9]{36,}/],
  ['npm token', /\bnpm_[A-Za-z0-9]{36}\b/],
  ['AWS key', /\bAKIA[0-9A-Z]{16}\b/],
  ['private key', /-----BEGIN [A-Z ]*PRIVATE KEY-----/],
  ['Slack token', /\bxox[abprs]-[A-Za-z0-9-]{10,}/],
  ['Google API key', /\bAIza[0-9A-Za-z_-]{35}\b/],
  ['Anthropic or OpenAI key', /\bsk-(?:ant-)?[A-Za-z0-9_-]{32,}/],
];
const tracked = execFileSync('git', ['ls-files', '-z'], { encoding: 'utf8' })
  .split('\0')
  .filter(
    (file) => file && file !== 'package-lock.json' && !/\.(png|ico|jpe?g|webp|woff2?)$/.test(file),
  );
for (const file of tracked) {
  const text = readFileSync(file, 'utf8');
  for (const [kind, pattern] of SECRETS) {
    if (pattern.test(text)) {
      problems.push(`${file}  looks like it holds a ${kind}: remove it and rotate the secret`);
    }
  }
}

if (problems.length) {
  console.error(`Repo checks:\n${problems.join('\n')}`);
  process.exit(1);
}
console.log(
  `Repo: actions pinned to commits, dependencies exact and hash-checked, no secrets in ${tracked.length} tracked files.`,
);
