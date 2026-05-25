---
"formvuelate": minor
---

Add `SchemaArray`, a core field for repeatable/variable-length lists. Declare it directly in your schema (`{ friends: { component: SchemaArray, items } }`) anywhere in the schema, including dynamic schemas; `items` can be a group of fields (array of objects) or a single field (array of scalars), and arrays can nest. It owns the array as a real array in the model and stays strictly UI-agnostic, shipping no markup. Add/remove/reorder controls are your own components declared via `after` (per row) and `append` (once), which emit their intent (`add`/`remove`/`move`) for `SchemaArray` to perform. `min`/`max` are exposed as `canAdd`/`canRemove` to those controls.

Also fixes a `process is not defined` crash when FormVueLate runs in the browser (the dev-only warnings now guard `typeof process`).
