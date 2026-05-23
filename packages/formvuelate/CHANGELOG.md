# Change Log

## 4.0.1

### Patch Changes

- bdabdea: Dev-only guard in useSchemaForm that emits a clear, actionable FormVueLate warning (pointing at the docs) when called without an active component instance. Matches the existing process.env/FormVueLate: convention in SchemaFormFactory.js.

  Refs #302

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
  - **Node `>=20.19` required by the published packages' `engines` metadata.** This can warn or block installs on older Node versions when engine checks are enforced; Node 24 LTS is pinned in `.nvmrc` for development.
  - 2.x and 3.x are no longer maintained.

  ### Bug fixes
  - Conditional fields are now cleaned out of `formModel` when their `condition` flips to false, including inside nested schemas.
  - Nested `SchemaFormFactory` + vee-validate no longer double-registers fields with vee-validate (which previously suppressed validation errors on nested fields).

  ### Internal / tooling
  - Jest → Vitest, custom Rollup scripts → per-package Vite lib mode, VuePress 1 → VitePress, Lerna → Changesets, yarn 1 → pnpm 9. Cypress upgraded to v15.

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.9.1](https://github.com/formvuelate/formvuelate/compare/v3.9.0...v3.9.1) (2022-05-20)

**Note:** Version bump only for package formvuelate

# [3.9.0](https://github.com/formvuelate/formvuelate/compare/v3.8.1...v3.9.0) (2022-05-20)

### Features

- add props schemaRowSlim for show elements without a wrapper ([#293](https://github.com/formvuelate/formvuelate/issues/293)) ([04e0e53](https://github.com/formvuelate/formvuelate/commit/04e0e532c9f9e65d3b2f8480a70d3f591572b049))

## [3.8.1](https://github.com/formvuelate/formvuelate/compare/v3.8.0...v3.8.1) (2021-11-19)

### Bug Fixes

- nested schemas not cleared on schema change ([#259](https://github.com/formvuelate/formvuelate/issues/259)) ([9271b79](https://github.com/formvuelate/formvuelate/commit/9271b7935d43080c211d0a6e149b8f2ee6f95580))

# [3.8.0](https://github.com/formvuelate/formvuelate/compare/v3.7.3...v3.8.0) (2021-11-16)

### Features

- expose updateformmodel ([#258](https://github.com/formvuelate/formvuelate/issues/258)) ([7a36f7f](https://github.com/formvuelate/formvuelate/commit/7a36f7f5b7c69bbcaa89efb0c1c2a685f0788c55))

## [3.7.3](https://github.com/formvuelate/formvuelate/compare/v3.7.2...v3.7.3) (2021-11-15)

### Bug Fixes

- **vee-validate:** use injected local components fix [#253](https://github.com/formvuelate/formvuelate/issues/253) ([#257](https://github.com/formvuelate/formvuelate/issues/257)) ([75eb409](https://github.com/formvuelate/formvuelate/commit/75eb4091cfffc611f5cd5eaed70334939571e66f))

## [3.7.2](https://github.com/formvuelate/formvuelate/compare/v3.7.1...v3.7.2) (2021-11-13)

### Bug Fixes

- **lookup, formvuelate:** remapped nested ([#254](https://github.com/formvuelate/formvuelate/issues/254)) ([bb1595e](https://github.com/formvuelate/formvuelate/commit/bb1595e1e6d5bc18bd1c10cdff13daae6da14d5e)), closes [#252](https://github.com/formvuelate/formvuelate/issues/252)
- no warnings on empty array schemas ([#251](https://github.com/formvuelate/formvuelate/issues/251)) ([c351359](https://github.com/formvuelate/formvuelate/commit/c351359a47f2681c9cff202a83d84e0e410d7f67))

## [3.7.1](https://github.com/formvuelate/formvuelate/compare/v3.7.0...v3.7.1) (2021-10-27)

**Note:** Version bump only for package formvuelate

# [3.7.0](https://github.com/formvuelate/formvuelate/compare/v3.6.5...v3.7.0) (2021-10-23)

### Features

- add a useCustomFormWrapper prop to remove default form tag (closes [#243](https://github.com/formvuelate/formvuelate/issues/243)) ([#247](https://github.com/formvuelate/formvuelate/issues/247)) ([c966ebd](https://github.com/formvuelate/formvuelate/commit/c966ebd9c6050e88eb224e003faa66e24f4fe218))

## [3.6.5](https://github.com/formvuelate/formvuelate/compare/v3.6.4...v3.6.5) (2021-10-19)

### Bug Fixes

- default value parallel schemas ([#246](https://github.com/formvuelate/formvuelate/issues/246)) ([7f96fff](https://github.com/formvuelate/formvuelate/commit/7f96fff4bceb557047ed64f086f6e0499676ac4c))

## [3.6.4](https://github.com/formvuelate/formvuelate/compare/v3.6.3...v3.6.4) (2021-10-05)

### Bug Fixes

- default boolean false is not accepted ([#241](https://github.com/formvuelate/formvuelate/issues/241)) ([2d52bd4](https://github.com/formvuelate/formvuelate/commit/2d52bd4f3fb3810f8e4f05f460c0591afc1490a7))

## [3.6.3](https://github.com/formvuelate/formvuelate/compare/v3.6.2...v3.6.3) (2021-10-02)

### Bug Fixes

- local component injection refactor fixes [#238](https://github.com/formvuelate/formvuelate/issues/238) ([#239](https://github.com/formvuelate/formvuelate/issues/239)) ([34fad96](https://github.com/formvuelate/formvuelate/commit/34fad96569a99e109680828934ce8d51624dd6ec))

## [3.6.2](https://github.com/formvuelate/formvuelate/compare/v3.6.1...v3.6.2) (2021-09-26)

### Bug Fixes

- deep map schema fields against lookup components fixes [#224](https://github.com/formvuelate/formvuelate/issues/224) ([#234](https://github.com/formvuelate/formvuelate/issues/234)) ([77c1a0f](https://github.com/formvuelate/formvuelate/commit/77c1a0f0e86b2b0ce48886cef4ce5f920dd34ba2))

## [3.6.1](https://github.com/formvuelate/formvuelate/compare/v3.6.0...v3.6.1) (2021-09-14)

**Note:** Version bump only for package formvuelate

# [3.6.0](https://github.com/formvuelate/formvuelate/compare/v3.5.3...v3.6.0) (2021-09-12)

### Features

- lookup plugin replace SchemaForm with plugin version in sub schemas closes [#224](https://github.com/formvuelate/formvuelate/issues/224) ([#229](https://github.com/formvuelate/formvuelate/issues/229)) ([90577e7](https://github.com/formvuelate/formvuelate/commit/90577e7662f211d69cc6c3126142f154c3d9be12))

## [3.5.3](https://github.com/formvuelate/formvuelate/compare/v3.5.2...v3.5.3) (2021-09-08)

### Bug Fixes

- model cleanup not working with nested schemas (fix [#227](https://github.com/formvuelate/formvuelate/issues/227)) ([#228](https://github.com/formvuelate/formvuelate/issues/228)) ([24be6e0](https://github.com/formvuelate/formvuelate/commit/24be6e0bd09b3a946f02f4e69a5cb3679342832d))

## [3.5.2](https://github.com/formvuelate/formvuelate/compare/v3.5.1...v3.5.2) (2021-09-05)

**Note:** Version bump only for package formvuelate

## [3.5.1](https://github.com/formvuelate/formvuelate/compare/v3.5.0...v3.5.1) (2021-09-05)

### Features

- allow plugins to extend form props ([10610eb](https://github.com/formvuelate/formvuelate/commit/10610ebcfc2806df2e310c048ea503424a343985))

# [3.5.0](https://github.com/formvuelate/formvuelate/compare/v3.4.0...v3.5.0) (2021-08-17)

**Note:** Version bump only for package formvuelate

# [3.4.0](https://github.com/formvuelate/formvuelate/compare/v3.3.2...v3.4.0) (2021-08-08)

### Features

- hide row when no visible elements ([#218](https://github.com/formvuelate/formvuelate/issues/218)) ([253842d](https://github.com/formvuelate/formvuelate/commit/253842d70ab236d7bff59cc4b8c9c70847825afd)), closes [#208](https://github.com/formvuelate/formvuelate/issues/208)
