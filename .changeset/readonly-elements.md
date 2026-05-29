---
"formvuelate": minor
"@formvuelate/plugin-vee-validate": minor
---

Add read-only schema elements. Set `readonly: true` on any element and FormVueLate will render its component and hand it the whole form model to read, but it will never wire `v-model`, so the element can't write a value back or show up in your form output. It's a clean way to drop group labels, headings, or live summaries into a schema without treating them as fields. Read-only elements are also skipped by the vee-validate plugin, so they're never registered for validation.
