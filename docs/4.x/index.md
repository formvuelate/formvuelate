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

## Older versions

FormVueLate **2.x and 3.x are no longer maintained**. The project was archived between 2022 and the 4.x revival, and the code from those releases is significantly out of date with the current Vue 3 ecosystem.

If you have a 3.x project and you're trying to come over, see [Migrating from 3.x](/migration/3-to-4). If you need to reference the old code, the `v3.9.1` git tag and the `v2.x` series of tags preserve it. New users should ignore those entirely and go straight to 4.x.
