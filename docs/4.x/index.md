---
layout: home

hero:
  name: FormVueLate
  text: Schema-driven forms for Vue 3
  tagline: A zero-dependency library for generating dynamic forms from a schema.
  image:
    src: /formvuelate-icon.jpg
    alt: FormVueLate
  actions:
    - theme: brand
      text: Get Started
      link: /guide/
    - theme: alt
      text: View on GitHub
      link: https://github.com/formvuelate/formvuelate

features:
  - title: Schema-driven
    details: Describe your form once with a plain object or array. FormVueLate handles rendering, state, and updates.
  - title: Bring your own components
    details: Not a UI library. Use your own inputs, your own design system, or any component library you like.
  - title: Pluggable
    details: Extend the form lifecycle with first-party plugins for component lookup and vee-validate, or build your own.
---

## Quick start

Install FormVueLate alongside Vue 3.4+:

```bash
pnpm add formvuelate
# or
npm install formvuelate
```

Import `SchemaForm` and `useSchemaForm` in your component:

```vue
<template>
  <SchemaForm :schema="mySchema" />
</template>

<script setup>
import { SchemaForm, useSchemaForm } from 'formvuelate'

const { formModel } = useSchemaForm({})

const mySchema = {
  // your schema
}
</script>
```

`SchemaForm` writes user input into `formModel.value` reactively — no `v-model` required.
