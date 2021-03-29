---
home: true
heroImage: /formvuelate-icon.jpg
tagline: Vue Schema-Driven Form Generation
actionText: Get Started →
actionLink: /guide/
---

# Quick Start

## Installation

:::tip FormVueLate 2.x
The docs for FormVueLate 2.x can be found [here](https://formvuelate-2x.netlify.app/)
:::

To add FormVueLate to your project, start by installing the package through your favorite package manager.

```bash
yarn add formvuelate
// OR
npm install formvuelate
```

## Using the SchemaForm component

Now that you have the package in your project, `import` it to your component.

```javascript
import { SchemaForm, useSchemaForm } from 'formvuelate'
```

The `SchemaForm` requires one `prop`, `schema`, which is the meta-data of your form. You must also import the `useSchemaForm` composable which we will use in our setup function to initialize the form's `model` where the user's data is kept.

```html
<template>
  <SchemaForm :schema="mySchema" />
</template>

<script>
import { ref } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'

export default {
  components: { SchemaForm },
  setup () {
    const formModel = ref({})
    useSchemaForm(formModel)

    const mySchema = ref({
      // Schema here
    })

    return {
      mySchema
    }
  }
}
</script>
```

`SchemaForm` will automatically update the state within your `formModel` when your components update.
### v-model <Badge text="2.x" type="warning" vertical="middle" />
Earlier versions of FormVueLate used `v-model` as the default way of keeping the two way binding with the form's state. This forced the whole form to re-render whenever any of the child inputs emitted a new value.

`v-model` is no longer supported, and will not update your form's model. Please use `useSchemaForm` instead.
