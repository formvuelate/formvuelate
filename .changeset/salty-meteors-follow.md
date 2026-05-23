---
'formvuelate': patch
---

Dev-only guard in useSchemaForm that emits a clear, actionable FormVueLate warning (pointing at the docs) when called without an active component instance. Matches the existing process.env/FormVueLate: convention in SchemaFormFactory.js.

Refs #302
