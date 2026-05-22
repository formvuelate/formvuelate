---
'@formvuelate/plugin-vee-validate': patch
'@formvuelate/plugin-lookup': patch
'formvuelate': patch
---

4.0 is a modernization release. The public API (`SchemaForm`,
  `useSchemaForm`, `SchemaFormFactory`, `definePlugin`) is unchanged —
  most consumers just bump their peer dependencies.

  **Breaking changes**:

- Vue peer dependency bumped to `^3.4.0`
- UMD bundles dropped; ship ES + CJS + types only
- `@formvuelate/plugin-vuelidate` removed (was never published; a Regle plugin may replace it in a later 4.x)
- `@formvuelate/plugin-vee-validate` requires `vee-validate@^4.13`
- Deep imports beyond the `exports` map are unsupported
- Node 20.18+ required for development (runtime consumers unaffected)

  **Bug fixes**:

- Conditional fields are now cleaned up from `formModel` when their `condition` flips to false, including inside nested
  schemas (#TBD)
- Nested SchemaFormFactory + vee-validate no longer double-registers fields with vee-validate (#TBD)

  **Internal**:

- Switched from Jest to Vitest
- Switched from Rollup (custom scripts) to per-package Vite lib mode
- Switched from VuePress 1 to VitePress for docs
- Lerna → Changesets for release management
- pnpm 9 workspace
