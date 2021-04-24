# FormVueLate Contributing Guide

Hi! We are really excited that you are interested in contributing to Vuelidate. Before submitting your contribution, please make sure to take a moment and read through the following guidelines:

- [Code of Conduct](https://github.com/formvuelate/formvuelate/blob/main/.github/CODE_OF_CONDUCT.md)
- [Issue Reporting Guidelines](#issue-reporting-guidelines)
- [Pull Request Guidelines](#pull-request-guidelines)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)

## Issue Reporting Guidelines

- Make sure that you are familiar with documentation before submitting an issue. [https://formvuelate.js.org/](https://formvuelate.js.org/)
- Try to provide an example to your issue. Issues without a working fiddle are generally much harder to solve and usually take much more time to actually do it.

## Pull Request Guidelines

- The `main` branch is just a snapshot of the latest stable release. All development should be done in dedicated branches. **Do not submit PRs against the `main` branch.**

- Checkout a topic branch from the relevant branch, e.g. `dev`, and merge back against that branch.

- Work in the `src` folder of packages and **DO NOT** check-in `dist` in the commits.

- It's OK to have multiple small commits as you work on the PR - GitHub will automatically squash it before merging.

- Make sure `yarn test` passes. (see [development setup](#development-setup))

- If adding a new feature:
  - Add accompanying test case.
  - Provide a convincing reason to add this feature. Ideally, you should open a suggestion issue first and have it approved before working on it.

- If fixing bug:
  - If you are resolving a special issue, add `(fix #xxxx[,#xxxx])` (#xxxx is the issue id) in your PR title for a better release log, e.g. `update entities encoding/decoding (fix #3899)`.
  - Provide a detailed description of the bug in the PR. Live demo preferred.
  - Add appropriate test coverage if applicable.

## Development Setup

You will need [Node.js](http://nodejs.org) **version 14.x** and [yarn](https://yarnpkg.com/en/docs/install).

After cloning the repo, run:

``` bash
yarn install
```

### Commonly used NPM scripts

``` bash
# build the package
$ yarn build

# watch and auto re-run unit tests of a package
$ yarn test:unit:watch

# run the full test suite, including linting
$ yarn test
```

The `docs` folder includes versions 2.x and 3.x, each with their own NPM scripts.

``` bash
# serve and watch for changes on the docs
yarn dev

# build the docs
yarn build
```
