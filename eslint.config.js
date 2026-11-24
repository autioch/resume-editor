// @ts-check
import css from '@eslint/css';
import js from '@eslint/js';
import json from '@eslint/json';
import markdown from '@eslint/markdown';
import astro from 'eslint-plugin-astro';
import { defineConfig, globalIgnores } from 'eslint/config';
import tseslint from 'typescript-eslint';

export default defineConfig([
  globalIgnores(['dist/', '.astro/', 'package-lock.json']),
  {
    files: ['**/*.{js,mjs,ts}'],
    extends: [js.configs.recommended, tseslint.configs.strict],
    // development.md § Conventions: named functions are declarations, arrows only inline; every
    // if/else and loop body in braces.
    rules: { 'func-style': ['error', 'declaration'], curly: ['error', 'all'] },
  },
  {
    // security.md § Trust model: the page writes text, never markup, and never runs strings as code.
    files: ['src/**/*.ts'],
    rules: {
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      'no-script-url': 'error',
      'no-restricted-syntax': [
        'error',
        {
          selector: 'AssignmentExpression[left.property.name=/^(innerHTML|outerHTML)$/]',
          message: 'Write text (textContent) or build nodes; never markup from data.',
        },
        {
          selector:
            'CallExpression[callee.property.name=/^(insertAdjacentHTML|write|writeln|setHTMLUnsafe|parseHTMLUnsafe|createContextualFragment)$/]',
          message: 'Write text (textContent) or build nodes; never markup from data.',
        },
      ],
    },
  },
  {
    // The checks in scripts/ run in Node and report to the console; some use the network.
    files: ['scripts/**/*.mjs'],
    languageOptions: {
      globals: {
        console: 'readonly',
        fetch: 'readonly',
        AbortSignal: 'readonly',
        WebSocket: 'readonly',
        setTimeout: 'readonly',
        URL: 'readonly',
      },
    },
  },
  ...astro.configs.recommended,
  {
    files: ['**/*.css'],
    language: 'css/css',
    plugins: { css },
    extends: ['css/recommended'],
    // architecture.md § Browsers: in every current major browser — Baseline "newly available".
    rules: {
      'css/use-baseline': ['error', { available: 'newly' }],
      // One way to say a size or a side: logical (inline/block).
      'css/prefer-logical-properties': 'error',
      // Custom properties are defined in src/shared/styles.css; the rule sees one file at a time.
      'css/no-invalid-properties': ['error', { allowUnknownVariables: true }],
    },
  },
  {
    files: ['**/*.md'],
    language: 'markdown/gfm',
    // Content files (src/content/) open with YAML frontmatter.
    languageOptions: { frontmatter: 'yaml' },
    plugins: { markdown },
    extends: ['markdown/recommended'],
  },
  {
    files: ['**/*.json'],
    ignores: ['tsconfig.json', '.vscode/**'],
    language: 'json/json',
    plugins: { json },
    extends: ['json/recommended'],
  },
  {
    files: ['tsconfig.json', '.vscode/**/*.json'],
    language: 'json/jsonc',
    plugins: { json },
    extends: ['json/recommended'],
  },
]);
