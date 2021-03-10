---
home: true
heroImage: /formvuelate-icon.jpg
tagline: Vue Schema-Driven Form Generation
actionText: Get Started →
actionLink: /guide/
---

# Quick Start

## Installation

To add FormVueLate to your project, start by installing the package through your favorite package manager.

```bash
yarn add formvuelate
// OR
npm install formvuelate
```

## Using the SchemaForm component

Now that you have the package in your project, `import` it to your component.

```javascript
import { SchemaForm } from 'formvuelate'
```

The `SchemaForm` requires two `props`. The first is the `schema`, which is the meta-data of your form. The second one is `modelValue`, which will hold the state of the form.

```html
<SchemaForm :schema="mySchema" :modelValue="formData" />
```

The `SchemaForm` will `$emit` **update:modelValue** events when your components update. This means that you are able to either:

- use `v-model` on it
- or, manually capture the `@update:modelValue` event with a method of your own while injecting the `:modelValue` property.

Example with `v-model`:

```javascript
<template>
  <SchemaForm :schema="mySchema" v-model="formData" />
</template>

<script>
import { reactive } from 'vue'
export default {
  setup() {
    const formData = reactive({})
    const mySchema = reactive({
      // some schema here
    })

    return {
      formData,
      mySchema
    }
  }
}}
</script>
```

Example with manual bindings:

```javascript
<template>
  <SchemaForm
    :schema="mySchema"
    :modelValue="formData"
    @update:modelValue="updateForm"
  />
</template>

<script>
import { reactive } from 'vue'
export default {
  setup() {
    const formData = reactive({})
    const mySchema = reactive({
      // some schema here
    })

    const updateForm = form => {
      formData = form
    }

    return {
      formData,
      mySchema,
      updateForm
    }
  }
}}
</script>
```
