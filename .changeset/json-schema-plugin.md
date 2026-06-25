---
"@formvuelate/plugin-json-schema": minor
---

Add `@formvuelate/plugin-json-schema`, a plugin that converts a JSON Schema (draft-07 / 2020-12) into a FormVueLate schema. It supports objects (nested forms), primitives, string formats, enums (`enum`/`enumNames`/`oneOf` const), and repeatable array fields via a shipped `ArrayField` repeater (add/remove entries for primitives and objects) — closing #132. Constraints (`required`, `minLength`/`maxLength`, `minimum`/`maximum`, `pattern`, `format`, `enum`, `minItems`/`maxItems`) are translated into per-field `validations` consumed by the vee-validate plugin. The schema is passed via a reactive `jsonSchema` prop and component mapping is configurable and composes with the lookup plugin.
