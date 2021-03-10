---
sidebarDepth: 3
---
# SchemaFormFactory

FormVueLate ships with the ability to import and use plugins to extend it's capabilities.

In order to use a plugin with `SchemaForm`, you have to use the provided `SchemaFormFactory` function.

First, import the `SchemaFormFactory` into your application.

```javascript
import { SchemaFormFactory } from 'formvuelate'
```

`SchemaFormFactory` accepts an array of plugins that will be used to generate the `SchemaForm`.

:::warning Important
`SchemaFormFactory` returns an extended version of `SchemaForm`, so the props required by `SchemaForm` like `schema` are still required - as well as the use of `useSchemaForm` to define the form model.
:::

The order in which you pass the plugins is *important*, as they will be applied in the order they are received.

Each plugin will modify the `setup` function of `SchemaForm` and change the way the `schema` is parsed. The next plugin in line will receive the modified `setup` function that the previous one changed.

```html
<template>
  <SchemaFormWithPlugins :schema="mySchema" />
</template>

<script>
import useVuelidate from '@vuelidate'
import VuelidatePlugin from '@formvuelate/plugin-vuelidate'
import LookupPlugin from '@formvuelate/plugin-lookup'
import VeeValidatePlugin from '@formvuelate/plugin-vee-validate'

import { SchemaFormFactory, useSchemaForm } from 'formvuelate'
import { ref } from 'vue'

const SchemaFormWithPlugins = SchemaFormFactory([
  LookupPlugin({
      mapComponents: {
      string: 'FormText',
      array: 'FormSelect'
    }
  }),
  VuelidatePlugin(useVuelidate),
  VeeValidatePlugin(),
])

export default {
  components: {
    SchemaFormWithPlugins
  },
  setup () {
    const formData = ref({})
    useSchemaForm(formData)

    const mySchema = ref({
      // Schema
    })

    return {
      mySchema
    }
  }
}
</script>
```

Now that we have defined a new component called `SchemaFormWithPlugins`, you can use it as you normally use any other component in your application.

### Using locally imported components

The second parameter accepted by the `SchemaFormFactory` function is an `Object` with a key-value pair for component registration. This object will get merged into the `components: {}` declaration for generated `SchemaForm` component.

This option will come in useful in cases where you do not want to import your form components globally, and need to declare them locally in the component that is instantiating your form.

In the following example, two components `FormSelect` and `FormText` are imported locally into the file. They are injected into the `SchemaFormFactory` as the second parameter (the plugin array remains empty since no plugins are being used).

```html
<template>
  <div id="app">
    <SchemaForm :schema="schema" />
  </div>
</template>

<script>
import { ref, markRaw } from "vue"
import { SchemaFormFactory, useSchemaForm } from "formvuelate"
import FormText from "@/components/FormText"
import FormSelect from "@/components/FormSelect"

markRaw(FormSelect)
markRaw(FormText)

// Declare FormText and FormSelect as local components
const factory = SchemaFormFactory([], { FormText, FormSelect })

export default {
  name: "App",
  components: { SchemaForm: factory },
  setup () {
    const form = ref({
      name: '',
      pet: 'cat'
    })
    useSchemaForm(form)

    // We can now declare our `component` property as a string, since
    // the component will be registered locally within the SchemaForm component
    const schema = ref({
      name: {
        component: 'FormText',
        label: 'Your name'
      },
      pet: {
        component: 'FormSelect',
        label: 'Your pet',
        options: ['cat', 'dog']
      }
    })

    return {
      schema,
    }
  },
}
</script>
```

Notice that the `schema` declares the `component` property as a `String`. This is because the generated `SchemaForm` can now register both the injected components locally.

The reasoning behind this is that locally registered components are _not_ available in sub-components, as [explained by the Vue 3 documentation](https://v3.vuejs.org/guide/component-registration.html#local-registration).
