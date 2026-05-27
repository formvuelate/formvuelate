---
"formvuelate": minor
"@formvuelate/plugin-vee-validate": minor
---

Expose the form-level validation state outside `SchemaForm`. The vee-validate plugin now emits an `update:validation` event (usable as `v-model:validation`) carrying the same `errors`, `values`, `isSubmitting`, `submitCount` and `meta` object that the `#beforeForm` / `#afterForm` slot prop already provides. The state is seeded on mount and refreshed on every change, and only the root schema form emits it so nested schemas stay quiet.

To support this, plugins can now extend the generated component's declared events through a new `extendEmits` helper passed alongside `extendSchemaFormProps` to a plugin's `extend` hook.
