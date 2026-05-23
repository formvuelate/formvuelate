# Change Log

## 4.0.1

### Patch Changes

- Version bump to keep the @formvuelate/* packages in lockstep with formvuelate@4.0.1. No functional changes.

## 4.0.0

### Major Changes

- a38fcae: FormVueLate 4.0 — a full revival and modernization of the library after its archival.

  The public API (`SchemaForm`, `useSchemaForm`, `SchemaFormFactory`, `definePlugin`) is unchanged. For most consumers, upgrading is just a matter of bumping peer dependencies — see the [3.x → 4.x migration guide](https://formvuelate.js.org/migration/3-to-4).

  ### Breaking changes
  - **Vue `^3.4.0` required** (was `^3.0.0`).
  - **UMD bundles dropped.** Packages ship ES + CJS + types with a modern `exports` map. Use a bundler instead of script tags.
  - **`@formvuelate/plugin-vuelidate` removed.** It was never published; a Regle-based plugin may replace it in a later 4.x.
  - **`@formvuelate/plugin-vee-validate` requires `vee-validate@^4.13`.**
  - **Deep imports unsupported.** Import from the package root (`import { SchemaForm } from 'formvuelate'`), not `formvuelate/dist/*`.
  - **Node `>=20.19` required for development and package installation.** Node 24 LTS is pinned in `.nvmrc`, and the published package now declares `engines.node >=20.19.0`, which may warn or block installs on older Node versions when engine checks are enforced.
  - 2.x and 3.x are no longer maintained.

  ### Bug fixes
  - Conditional fields are now cleaned out of `formModel` when their `condition` flips to false, including inside nested schemas.
  - Nested `SchemaFormFactory` + vee-validate no longer double-registers fields with vee-validate (which previously suppressed validation errors on nested fields).

  ### Internal / tooling
  - Jest → Vitest, custom Rollup scripts → per-package Vite lib mode, VuePress 1 → VitePress, Lerna → Changesets, yarn 1 → pnpm 9. Cypress upgraded to v15.

### Patch Changes

- Updated dependencies [a38fcae]
  - formvuelate@4.0.0

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.9.1](https://github.com/formvuelate/formvuelate/compare/v3.9.0...v3.9.1) (2022-05-20)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

# [3.9.0](https://github.com/formvuelate/formvuelate/compare/v3.8.1...v3.9.0) (2022-05-20)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

## [3.8.1](https://github.com/formvuelate/formvuelate/compare/v3.8.0...v3.8.1) (2021-11-19)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

# [3.8.0](https://github.com/formvuelate/formvuelate/compare/v3.7.3...v3.8.0) (2021-11-16)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

## [3.7.3](https://github.com/formvuelate/formvuelate/compare/v3.7.2...v3.7.3) (2021-11-15)

### Bug Fixes

- **vee-validate:** use injected local components fix [#253](https://github.com/formvuelate/formvuelate/issues/253) ([#257](https://github.com/formvuelate/formvuelate/issues/257)) ([75eb409](https://github.com/formvuelate/formvuelate/commit/75eb4091cfffc611f5cd5eaed70334939571e66f))

## [3.7.2](https://github.com/formvuelate/formvuelate/compare/v3.7.1...v3.7.2) (2021-11-13)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

## [3.7.1](https://github.com/formvuelate/formvuelate/compare/v3.7.0...v3.7.1) (2021-10-27)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

# [3.7.0](https://github.com/formvuelate/formvuelate/compare/v3.6.5...v3.7.0) (2021-10-23)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

## [3.6.5](https://github.com/formvuelate/formvuelate/compare/v3.6.4...v3.6.5) (2021-10-19)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

## [3.6.4](https://github.com/formvuelate/formvuelate/compare/v3.6.3...v3.6.4) (2021-10-05)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

## [3.6.3](https://github.com/formvuelate/formvuelate/compare/v3.6.2...v3.6.3) (2021-10-02)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

## [3.6.2](https://github.com/formvuelate/formvuelate/compare/v3.6.1...v3.6.2) (2021-09-26)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

## [3.6.1](https://github.com/formvuelate/formvuelate/compare/v3.6.0...v3.6.1) (2021-09-14)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

# [3.6.0](https://github.com/formvuelate/formvuelate/compare/v3.5.3...v3.6.0) (2021-09-12)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

## [3.5.3](https://github.com/formvuelate/formvuelate/compare/v3.5.2...v3.5.3) (2021-09-08)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

## [3.5.2](https://github.com/formvuelate/formvuelate/compare/v3.5.1...v3.5.2) (2021-09-05)

**Note:** Version bump only for package @formvuelate/plugin-vee-validate

## [3.5.1](https://github.com/formvuelate/formvuelate/compare/v3.5.0...v3.5.1) (2021-09-05)

### Bug Fixes

- pass the label prop to vee-validate useField options closes [#225](https://github.com/formvuelate/formvuelate/issues/225) ([#226](https://github.com/formvuelate/formvuelate/issues/226)) ([e896abb](https://github.com/formvuelate/formvuelate/commit/e896abbbd3feaebe758b0c96a899808a6f29af51))

### Features

- add validation schema to form props ([7b54fca](https://github.com/formvuelate/formvuelate/commit/7b54fca71cc5e87eb79e3169f70a110121eb9631))

# [3.4.0](https://github.com/formvuelate/formvuelate/compare/v3.3.2...v3.4.0) (2021-08-08)

### Bug Fixes

- mapField does not handle array in schema array properly ([7daaf12](https://github.com/formvuelate/formvuelate/commit/7daaf12acf00d0b0ef85588403e6bb6cbd662289))
