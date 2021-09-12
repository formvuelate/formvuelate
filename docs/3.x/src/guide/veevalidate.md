---
sidebarDepth: 3
---

# Vee-Validate Plugin

The vee-validate plugin lets you validate your generated fields using [vee-validate](https://github.com/logaretm/vee-validate).

## Installation

To install the plugin, simply add it to your `package.json` via terminal, you also need to add `vee-validate`.

```bash
yarn add vee-validate@next @formvuelate/plugin-vee-validate

# OR

npm i vee-validate@next @formvuelate/plugin-vee-validate
```

## Usage

To use the plugin, import and pass it to the `SchemaFormFactory`. This creates a `SchemaForm` component with validation capabilities.

```js
import { SchemaFormFactory } from 'formvuelate'
import VeeValidatePlugin from '@formvuelate/plugin-vee-validate'

const SchemaFormWithValidation = SchemaFormFactory([
  VeeValidatePlugin({
    // plugin configuration here
  })
])
```

Now that the component is created, you can register it and use it in your template:

```html
<template>
  <div id="app">
    <SchemaFormWithValidation :schema="mySchema" />
  </div>
</template>

<script>
export default {
  components: {
    SchemaFormWithValidation
  },
  setup () {
    [...]
  }
}
</script>
```

## Component Requirements

Your components will receive the validation state via `validation` prop which contains the error messages and the `meta` information exposed by vee-validate, the validation prop contains the following properties/methods:

```js
{
  errorMessage, // The first error message for that field
  errors, // All error messages for that field
  meta, // A field meta object
  setTouched, // Sets the meta `touched` flag
}
```

You can opt-in to any of these properties or to the entire `validation` object. Here is an example `FormText` component that accepts the `validation` object as a prop:

```html
<template>
  <div>
    <input :value="modelValue" @input="update($event.target.value)" />
    <span>{{ validation.errorMessage }}</span>
  </div>
</template>

<script>
export default {
  props: {
    // other props
    modelValue: {
      required: true
    },
    validation: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    update (value) {
      this.$emit('update:modelValue', value)
    }
  }
}
</script>
```

Whenever the `modelValue` is updated the field will be validated immediately.

If we want the validations not to be immediate, or lazy, we can show the error message when the field is `touched`. A field is considered `touched` after the field loses focus.

In this case, we set it using the validation object's `setTouched` method as shown in the following example.

```html
<template>
  <div>
    <input
      :value="modelValue"
      @input="update($event.target.value)"
      @blur="onBlur"
    />
    <span v-if="validation.meta.touched">{{ validation.errorMessage }}</span>
  </div>
</template>

<script>
export default {
  props: {
    // ...
  },
  methods: {
    update (value) {
      this.$emit('update:modelValue', value)
    },
    onBlur () {
      this.validation.setTouched(true)
    }
  }
}
</script>
```

Note that when the form is submitted, all fields will be automatically "touched". [Read here](https://vee-validate.logaretm.com/v4/guide/components/handling-forms#submission-behavior) for information about form submission behavior in vee-validate.

## Configuration

The `VeeValidatePlugin` accepts one parameter, a configuration object. Let's look at the properties that we can use.

### mapProps

::: warning Important
This refers to Vee-validate's `mapProps`, and not to the `mapProps` property exposed by `LookupPlugin`.
:::

If you are using 3rd party components and cannot modify their definition to accept the `validation` object, you can use the `mapProps` configuration to map the `validation` object to another property or multiple properties that are accepted by your component.

In the following example, the `errorMessage` is extracted to it's own prop.

```js
const SchemaFormWithValidation = SchemaFormFactory([
  VeeValidatePlugin({
    mapProps (validation) {
      return {
        errorMessage: validation.errorMessage
      }
    }
  })
])
```

Now your component definition can accept the `errorMessage` prop instead of the entire `validation` object.

You can also map the `validation` prop based on your schema input type, so if you are using multiple 3rd party components you can provide each with the suitable validation props.

```js
const SchemaFormWithValidation = SchemaFormFactory([
  VeeValidatePlugin({
    mapProps(validation, el) {
      // If the field is the `FormText` component, send the entire validation object
      if (el.component.name === 'FormText') {
        return {
          validation
        }
      }
      // Otherwise send the error message only
      return {
        errorMessage: validation.errorMessage
      }
    }
  })
])
```

## Defining Validation Rules

Now that your component is configured to receive validation state, let's take a look on how to actually validate them.

There are two approaches to specify validation rules to your schema fields, which are "field-level" and "form-level".

### Field Level Validation

The "field-level" approach allows to you add a `validations` property to your fields schema, the `validation` property can be any type of validators that is [accepted by vee-validate](https://vee-validate.logaretm.com/v4/guide/validation)

Here is an example of a schema that uses all the possible `validations` value types:

```js
import * as yup from 'yup'

const schema = {
  email: {
    component: FormText,
    label: 'Email',
    // Globally defined rules
    validations: 'required|email'
  },
  password: {
    component: FormText,
    label: 'Password',
    // Validation functions
    validations: value => value && value.length > 6
  },
  fullName: {
    component: FormText,
    label: 'Full Name',
    // yup validations
    validations: yup.string().required()
  }
}
```

Then you can use the schema in your template

```html
<div id="app">
  <SchemaFormWithPlugin :schema="schema" />
</div>
```

### Form Level Validation

You can specify validations on the form level by passing a `validation-schema` prop to the component created by `SchemaFormFactory`, the `validation-schema` prop value should be one that accepted by [vee-validate's form level validation](https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation).

This example uses `yup` to define validation schemas for your forms.

```html
<template>
  <div id="app">
    <SchemaFormWithValidation
      :schema="schema"
      :validation-schema="validationSchema"
    />
  </div>
</template>

<script>
import * as yup from 'yup'

export default {
  components: {
    SchemaFormWithValidation
  },
  setup() {
    const schema = ref([
      // Fields without the `validation` prop
    ])

    const formData = ref({})
    useSchemaForm(formData)

    // The validation schema
    const validationSchema = yup.object().shape({
      email: yup
        .string()
        .email()
        .required(),
      password: yup
        .string()
        .min(5)
        .required(),
      fullName: yup.string().required()
    })

    return {
      schema,
      validationSchema
    }
  }
}
</script>
```

## Validation Messages Labels <Badge text="2.4.0" type="warning" vertical="middle" />

::: warning Important
This section doesn't apply to validation schemas created with `yup`. You can use `yup`'s own [`.label` method](https://github.com/jquense/yup#mixedlabellabel-string-schema) to provide friendly display names for your fields.
:::

By default the vee-validate plugin will use the field's model name in the generated messages for [global string validators](https://vee-validate.logaretm.com/v4/guide/global-validators), this may produce unfriendly messages for your users.

In the following snippet, *'firstName'* will be used as the field validation message.

```js
const arraySchema = ref([
  {
    model: 'firstName',
    // ...
  }
])

const objectSchema = ref({
  firstName: {
    // ...
  }
})
```

For the `required` rule, it will produce this message:

```
The firstName field is required
```

To override this behavior and give your users better error messages you can include a `label` prop in each field's schema.

In the following snippet, *'First name'* will be used as the field validation message.

```js
const arraySchema = ref([
  {
    model: 'firstName',
    label: 'First name',
  }
])

const objectSchema = ref({
  firstName: {
    label: 'First name',
  }
})
```

For the `required` rule, it will produce this message:

```
The First name field is required
```

## Handling Submit

The `VeeValidatePlugin` automatically handles `SchemaForm` submits, and triggers validation before the form is submitted. You don't have to do anything special to trigger validations before submitting.

```html
<template>
  <SchemaForm @submit="onSubmit" :schema="schema">
    <template #afterForm>
      <button>Submit</button>
    </template>
  </SchemaForm>
</template>
```

Note that the `submit` handler will be only executed if the form is valid.

#### Initial Form State

You can provide initial validation state to the `SchemaForm`, to set initial errors you can use the `initial-errors` prop:

##### Initial Errors

```html
<template>
  <SchemaForm :schema="schema" :initial-errors="initialErrors">
    <template #afterForm>
      <button>Submit</button>
    </template>
  </SchemaForm>
</template>

<script>
export default {
  setup() {
    const schema = ref([
      // schema...
    ])

    const formData = ref({})
    useSchemaForm(formData)

    const initialErrors = {
      email: 'This email is already taken',
      password: 'Password must be at least 8 characters long'
    }

    return {
      schema,
      initialErrors
    }
  }
}
</script>
```

### Initial Meta

You can provide `initial-touched` prop to set the initial `touched` meta flags for your schema fields:

```html
<template>
  <SchemaForm :schema="schema" :initial-touched="initialTouched">
    <template #afterForm>
      <button>Submit</button>
    </template>
  </SchemaForm>
</template>

<script>
export default {
  setup() {
    const schema = ref([
      // schema...
    ])

    const formData = ref({})
    useSchemaForm(formData)

    const initialTouched = {
      email: true,
      password: false
    }

    return {
      formData,
      schema,
      initialErrors,
      initialTouched
    }
  }
}
</script>
```

## SchemaForm slot props

::: warning Important
This feature is available starting on FormVuelate <Badge text="3.2" type="warning" vertical="middle" /> and @formvuelate/plugin-vee-validate <Badge text="2.3" type="warning" vertical="middle" />
:::

You can access the form-level validation state by using either `afterForm` or `beforeForm` slot prop named `validation` on the `SchemaForm` component. Read more about [available slots](/guide/schema-form.md#slots).

The form-level `validation` object contains the following properties:

- `isSubmitting`: Indicates if the form is being submitted
- `submitCount`: Indicates the number of submission attempts
- `values`: A record object containing fields/values pairs
- `errors`: A record object containing field/error pairs
- `meta`: The [form meta](https://vee-validate.logaretm.com/v4/guide/components/validation#form-level-meta) object.

```html
<template>
  <SchemaForm @submit="onSubmit" :schema="schema">
    <template #afterForm="{ validation }">
      <span>Form is submitting: {{ validation.isSubmitting }}</span>
      <span>Attempted submits: {{ validation.submitCount }}</span>
      <span>Values: {{ validation.values }}</span>
      <span>Errors: {{ validation.errors }}</span>
      <span>Metadata: {{ validation.meta }}</span>
    </template>
  </SchemaForm>
</template>
```

The following are a few common examples for behaviors implemented with the form-level validation state.

**Disable buttons until all fields are valid**

```html
<SchemaForm :schema="schema">
  <template #afterForm="{ validation }">
    <button :aria-disabled="!validation.meta.valid">Submit</button>
  </template>
</SchemaForm>
```

Learn more about [accessible disabling of form buttons](https://css-tricks.com/making-disabled-buttons-more-inclusive/)

**Display spinner or loading state when the form is submitting**

```html
<SchemaForm :schema="schema">
  <template #afterForm="{ validation }">
    <button :class="{ 'is-submitting': validation.isSubmitting }">Submit</button>
  </template>
</SchemaForm>
```

**Display all errors as a summary before the form fields**

```html
<SchemaForm :schema="schema">
  <template #beforeForm="{ validation }">
    <p>Please correct these errors</p>
    <ul v-if="validation.errors">
      <li v-for="error in validation.errors">{{ error }}</li>
    </ul>
  </template>
</SchemaForm>
```
