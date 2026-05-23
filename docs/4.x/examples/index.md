<script setup>
import { basicSchema, nestedSchema, arrayExampleSchema } from '../.vitepress/theme/demoSchemas.js'
</script>

# Examples

Here you will find a few examples on how you can set up your `schema` and the output it would produce.

:::warning Important
We are using a few different example custom components to showcase, but you should use your own!
These components are **only** for demonstration purposes, and are **not** included with the library.
:::

## SchemaForm with useSchemaForm

This example showcases the simplest way to use `SchemaForm`.
It provides the component with a `schema` in the form of a JavaScript object, and binds the output of the form to the local data `userData` through `useSchemaForm`.

<DemoContainer>
<template #demo>
<ClientOnly>
<SchemaPlayground :initial-schema="basicSchema" />
</ClientOnly>
</template>
<template #code>

```vue
<script setup>
import { ref } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'

const schema = ref({
  firstName: { component: 'FormText', label: 'First Name' },
  lastName: { component: 'FormText', label: 'Last Name' },
  email: { component: 'FormText', label: 'Email', config: { type: 'email' } },
  favoriteThingAboutVue: {
    component: 'FormSelect',
    label: 'Favorite thing about Vue',
    options: ['Ease of use', 'Documentation', 'Community']
  }
})

// useSchemaForm binds the generated form's output to your reactive model.
const userData = ref({})
useSchemaForm(userData)
</script>

<template>
  <SchemaForm :schema="schema" />
</template>
```

</template>
</DemoContainer>

## Nested schemas

`SchemaForm` is able to parse and display forms that are based on nested schemas. In the example below, you can see how the `work` property is an object that uses `SchemaForm` itself as a component, and provides a `schema` property of its own.

Further down the tree inside `details`, yet another level of nested data can be found.

<DemoContainer>
<template #demo>
<ClientOnly>
<SchemaPlayground :initial-schema="nestedSchema" />
</ClientOnly>
</template>
<template #code>

```vue
<script setup>
import { ref } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'

const schema = ref({
  firstName: { component: 'FormText', label: 'First Name' },
  lastName: { component: 'FormText', label: 'Last Name' },
  // `work` nests a SchemaForm with its own schema...
  work: {
    component: 'SchemaForm',
    schema: {
      address: { component: 'FormText', label: 'Work address' },
      // ...and `details` nests one level deeper.
      details: {
        component: 'SchemaForm',
        schema: {
          position: { component: 'FormText', label: 'Position' },
          employees: {
            component: 'FormSelect',
            label: 'Number of employees',
            options: ['1', '2', '3', '4+']
          }
        }
      }
    }
  }
})

const userData = ref({})
useSchemaForm(userData)
</script>

<template>
  <SchemaForm :schema="schema" />
</template>
```

</template>
</DemoContainer>

## Using an array based schema

`SchemaForm` allows you to construct the schema also as an array. The name of each field is declared as a `model` property in each element, instead of it being the `key` for each property of the object-type schema.

Don't forget to check out the [documentation for Array schemas](/guide/schema-form.html#array-schemas)

<DemoContainer>
<template #demo>
<ClientOnly>
<SchemaPlayground :initial-schema="arrayExampleSchema" />
</ClientOnly>
</template>
<template #code>

```vue
<script setup>
import { ref } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'

// Array schema: each field names itself via `model` instead of an object key.
const schema = ref([
  { component: 'FormText', label: 'First Name', model: 'firstName' },
  { component: 'FormText', label: 'Last Name', model: 'lastName' },
  {
    component: 'FormSelect',
    label: 'Favorite thing about Vue',
    model: 'favoriteThingAboutVue',
    options: ['Ease of use', 'Documentation', 'Community']
  }
])

const userData = ref({})
useSchemaForm(userData)
</script>

<template>
  <SchemaForm :schema="schema" />
</template>
```

</template>
</DemoContainer>

## Conditional computed schemas

In the following example we showcase how a computed property can be used to dynamically generate a schema. When switching the value from the select element from A to B, the related `input` also changes to reflect the current status of the schema and the form.

<DemoContainer>
<template #demo>
<ClientOnly>
<ConditionalComputedDemo />
</ClientOnly>
</template>
<template #code>

```vue
<script setup>
import { ref, computed } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'

const userData = ref({ choice: 'A' })
useSchemaForm(userData)

// The schema is computed from the model, so changing `choice` swaps the field.
const schema = computed(() => ({
  choice: {
    component: 'FormSelect',
    label: 'Pick a path',
    options: ['A', 'B']
  },
  ...(userData.value.choice === 'A'
    ? { fieldA: { component: 'FormText', label: 'Field for choice A' } }
    : { fieldB: { component: 'FormText', label: 'Field for choice B' } })
}))
</script>

<template>
  <SchemaForm :schema="schema" />
</template>
```

</template>
</DemoContainer>

## Conditional fields with schema

The above example can also be written using the `condition` schema keyword introduced in 3.1.0.

<DemoContainer>
<template #demo>
<ClientOnly>
<ConditionalConditionDemo />
</ClientOnly>
</template>
<template #code>

```vue
<script setup>
import { ref } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'

const userData = ref({ choice: 'A' })
useSchemaForm(userData)

// Each field decides when it renders via a `condition` function of the model.
const schema = {
  choice: {
    component: 'FormSelect',
    label: 'Pick a path',
    options: ['A', 'B']
  },
  fieldA: {
    component: 'FormText',
    label: 'Field for choice A',
    condition: (model) => model.choice === 'A'
  },
  fieldB: {
    component: 'FormText',
    label: 'Field for choice B',
    condition: (model) => model.choice === 'B'
  }
}
</script>

<template>
  <SchemaForm :schema="schema" />
</template>
```

</template>
</DemoContainer>

## 100 nested inputs

The following example showcases the power of `useSchemaForm`, and why we decided to drop v-model in favor of an injected state. We recursively nest 100 schemas with input elements inside of them. Updating the v-model binding on the `FormText` component does not re-trigger a re-render of any part of the generated schema, and neither does updating the schema by adding or removing levels.

<DemoContainer>
<template #demo>
<ClientOnly>
<HundredNestedDemo />
</ClientOnly>
</template>
<template #code>

```vue
<script setup>
import { ref } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'

const userData = ref({})
useSchemaForm(userData)

// Recursively nest a SchemaForm inside itself `depth` times.
const buildNested = (depth) => {
  const level = {
    [`level${depth}`]: { component: 'FormText', label: `Level ${depth}` }
  }
  if (depth > 1) {
    level.nested = { component: 'SchemaForm', schema: buildNested(depth - 1) }
  }
  return level
}

const schema = buildNested(100)
</script>

<template>
  <SchemaForm :schema="schema" />
</template>
```

</template>
</DemoContainer>
