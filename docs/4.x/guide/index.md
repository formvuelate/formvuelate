---
sidebarDepth: 3
---
# Getting Started

![FormVueLate logo](/formvuelate-logo.jpg)

FormVueLate is a zero dependency library that allows you to generate schema-driven forms with extreme ease.

The schema that you use for your form can be as flexible as you need it to be, it can be modified at run-time with an expected reactive result, and can even be fetched directly from you back-end’s API.

:::warning Important
FormVueLate is a bring-your-own-components library!

We do **not** provide any base components for you to build your forms. There are numerous component libraries out there that do a great job of providing carefully constructed components for you to use, and FormVueLate does a great job at allowing you to bring those external components to your forms, or even crafting your own.
:::

## Installation

To add FormVueLate to your project, start by installing the package through your favorite package manager.

```bash
yarn add formvuelate
// OR
npm install formvuelate
```

Now that you have the package in your project, `import` it to the component that will hold your form.

You can pick and choose which of the FormVueLate's components you will need. The following example imports all of them, plus the required composable `useSchemaForm`.

```javascript
import { SchemaForm, SchemaWizard, SchemaFormFactory, useSchemaForm } from 'formvuelate'
```

## Playground

Modify the Schema on the left to see FormVueLate's `SchemaForm` in action on the right. You can use the following demo input components:

- FormText
- FormSelect
- FormCheckbox

<DemoContainer>
<template #demo>
<ClientOnly>
<MainPlayground />
</ClientOnly>
</template>
<template #code>

```vue
<script setup>
import { ref, reactive, watchEffect } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'
import { objSchema, arraySchema } from './schemas.js'

// The editor holds the schema as text; parsedSchema is what SchemaForm renders.
const schema = ref(JSON.stringify(objSchema, null, 2))
const parsedSchema = ref(JSON.parse(schema.value))
const currentSchemaType = ref('object')

// useSchemaForm binds the generated form's output to your reactive model.
const value = ref({})
useSchemaForm(value)

const schemaError = ref('')
const hasParseErrors = ref(false)
const disabledParsing = ref(false)
const options = reactive({ preventModelCleanupOnSchemaChange: false })

// Don't reparse mid-token while the user is typing whitespace/structure.
const toggleValidation = (event) => {
  disabledParsing.value = [' ', 'Enter', 'Tab'].includes(event.key)
}

watchEffect(() => {
  try {
    const parsingResult = JSON.parse(schema.value)
    if (!disabledParsing.value) parsedSchema.value = parsingResult
    hasParseErrors.value = false
  } catch (e) {
    schemaError.value = e.message
    hasParseErrors.value = true
  }
})

const onSubmit = () => window.alert('Form submitted')

// Flip the editor between the object-style and array-style schemas.
const switchSchema = (event) => {
  const val = event.target.value
  currentSchemaType.value = val
  if (val === 'array') schema.value = JSON.stringify(arraySchema, null, 2)
  else if (val === 'object') schema.value = JSON.stringify(objSchema, null, 2)
}
</script>

<template>
  <div>
    <FormCheckbox
      v-model="options.preventModelCleanupOnSchemaChange"
      label="preventModelCleanupOnSchemaChange"
    />
    <FormSelect
      :modelValue="currentSchemaType"
      :options="['object', 'array']"
      disableNoSelection
      label="Schema type"
      @change="switchSchema"
    />

    <textarea
      v-model="schema"
      :class="{ 'editor-error': hasParseErrors }"
      @keyup="toggleValidation"
    />
    <p v-if="hasParseErrors">Invalid JSON — {{ schemaError }}</p>

    <SchemaForm
      :schema="parsedSchema"
      :preventModelCleanupOnSchemaChange="options.preventModelCleanupOnSchemaChange"
      @submit="onSubmit"
    >
      <template #afterForm>
        <BaseButton type="submit">Submit</BaseButton>
      </template>
    </SchemaForm>

    <pre>{{ value }}</pre>
  </div>
</template>
```

```js
// schemas.js
export const objSchema = {
  firstName: { component: 'FormText', label: 'First Name' },
  lastName: { component: 'FormText', label: 'Last Name' },
  email: {
    component: 'FormText',
    label: 'Your email',
    required: true,
    type: 'email',
    config: {}
  },
  favoriteThingAboutVue: {
    component: 'FormSelect',
    label: 'Favorite thing about Vue',
    required: true,
    options: ['Ease of use', 'Documentation', 'Community']
  },
  isVueFan: { component: 'FormCheckbox', label: 'Are you a Vue fan?' },
  work: {
    component: 'SchemaForm',
    schema: {
      address: { component: 'FormText', label: 'Work address' },
      phone: { component: 'FormText', label: 'Work phone' },
      details: {
        component: 'SchemaForm',
        schema: {
          position: { component: 'FormText', label: 'Work position' },
          employees: {
            component: 'FormSelect',
            label: 'Number of employees',
            options: ['1', '2', '3', '4+']
          }
        }
      }
    }
  }
}

export const arraySchema = [
  [
    {
      component: 'FormText',
      label: 'First Name',
      model: 'firstName',
      style: 'margin-right: 10px;'
    },
    { component: 'FormText', label: 'Last Name', model: 'lastName' }
  ],
  {
    component: 'FormText',
    label: 'Your email',
    required: true,
    model: 'email',
    config: { type: 'email' }
  },
  {
    component: 'FormSelect',
    label: 'Favorite thing about Vue',
    required: true,
    model: 'favoriteThingAboutVue',
    options: ['Ease of use', 'Documentation', 'Community']
  },
  { component: 'FormCheckbox', label: 'Are you a Vue fan?', model: 'isVueFan' },
  {
    component: 'SchemaForm',
    model: 'work',
    schema: [
      { component: 'FormText', label: 'Work address', model: 'address' },
      { component: 'FormText', label: 'Work phone', model: 'phone' },
      {
        component: 'SchemaForm',
        model: 'details',
        schema: [
          { component: 'FormText', label: 'Work position', model: 'position' },
          {
            component: 'FormSelect',
            label: 'Number of employees',
            model: 'employees',
            options: ['1', '2', '3', '4+']
          }
        ]
      }
    ]
  }
]
```

</template>
</DemoContainer>
