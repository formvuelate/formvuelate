---
"formvuelate": major
"@formvuelate/plugin-lookup": major
"@formvuelate/plugin-vee-validate": major
---

FormVueLate 4.0 — a full revival and modernization of the library after its archival.

The public API (`SchemaForm`, `useSchemaForm`, `SchemaFormFactory`, `definePlugin`) is unchanged. For most consumers, upgrading is just a matter of bumping peer dependencies — see the [3.x → 4.x migration guide](https://formvuelate.js.org/migration/3-to-4).

### Breaking changes

- **Vue `^3.4.0` required** (was `^3.0.0`).
- **UMD bundles dropped.** Packages ship ES + CJS + types with a modern `exports` map. Use a bundler instead of script tags.
- **`@formvuelate/plugin-vuelidate` removed.** It was never published; a Regle-based plugin may replace it in a later 4.x.
- **`@formvuelate/plugin-vee-validate` requires `vee-validate@^4.13`.**
- **Deep imports unsupported.** Import from the package root (`import { SchemaForm } from 'formvuelate'`), not `formvuelate/dist/*`.
- **Node `>=20.18` for development** (runtime consumers unaffected).
- 2.x and 3.x are no longer maintained.

### Bug fixes

- Conditional fields are now cleaned out of `formModel` when their `condition` flips to false, including inside nested schemas.
- Nested `SchemaFormFactory` + vee-validate no longer double-registers fields with vee-validate (which previously suppressed validation errors on nested fields).

### Internal / tooling

- Jest → Vitest, custom Rollup scripts → per-package Vite lib mode, VuePress 1 → VitePress, Lerna → Changesets, yarn 1 → pnpm 9. Cypress upgraded to v15.
