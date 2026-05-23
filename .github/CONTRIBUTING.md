# FormVueLate Contributing Guide

Hi! We are really excited that you are interested in contributing to FormVueLate. Before submitting your contribution, please take a moment to read through the following guidelines:

- [Code of Conduct](https://github.com/formvuelate/formvuelate/blob/main/.github/CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)

## Issue Reporting Guidelines

- Make sure you're familiar with the documentation before submitting an issue: [https://formvuelate.js.org/](https://formvuelate.js.org/)
- Try to provide a minimal reproduction. Issues without a runnable repro are much harder to triage.

## Pull Request Guidelines

- Branch from `main`. Open PRs against `main`.
- Work in `src/` of each package and **do not** check in `dist/`.
- Multiple small commits during review are fine — GitHub will squash on merge.
- Make sure `pnpm test` passes (see [Development Setup](#development-setup)).
- Add a [changeset](../.changeset/README.md) for any user-visible change: `pnpm changeset`. The changeset bot will block PRs that need one.
- Bug fixes: reference the issue number in the PR title, e.g. `fix: handle nested cleanup (fix #123)`.
- New features: open a suggestion issue first to align before implementing.

## Development Setup

You'll need [Node.js](http://nodejs.org) **20.19+** and [pnpm 9](https://pnpm.io). The Node version is pinned in `.nvmrc` (**Node 24 LTS**); the pnpm version is pinned via `packageManager` in `package.json` (so [Corepack](https://nodejs.org/api/corepack.html) will use the right one automatically).

```bash
pnpm install
```

### Common scripts

```bash
# Build all packages
pnpm build

# Run unit tests (vitest)
pnpm test:unit

# Watch mode unit tests
pnpm test:unit:watch

# Run component tests (Cypress)
pnpm test:e2e:ci

# Lint everything
pnpm lint
```

### Docs

The active documentation lives at `docs/4.x` and is built with VitePress.

```bash
# Serve docs locally with HMR
pnpm docs:dev

# Build the static docs site
pnpm docs:build
```

## Project Structure

```
packages/
  formvuelate/                 # core library
  plugin-lookup/               # @formvuelate/plugin-lookup
  plugin-vee-validate/         # @formvuelate/plugin-vee-validate
docs/
  4.x/                         # VitePress docs (the active docs site)
.changeset/                    # release notes drive npm publishing
```
