---
sidebarDepth: 3
---
# SchemaWizard

FormVueLate also ships with a component called `SchemaWizard`, that allows you to easily build stepped, wizard-like, forms.

The `SchemaWizard` component exposes and **requires** three props: `schema`, `step`, and `modelValue`.

## v-model

The `SchemaWizard` component has a prop `modelValue` and emits `update:modelValue` events.

This means that you can `v-model` the results of the form into your parent component's state, or manually bind the property and listen to the event for more control.

```html
<template>
  <SchemaWizard :schema="wizardSchema" :step="step" v-model="userData">
</template>

<script>
import { ref } from 'vue'
export default {
  setup () {
    const step = ref(0)
    const userData = ref({})
    const wizardSchema = ref({
      // schema
    })
    return {
      step,
      userData,
      wizardSchema
    }
  }
}
</script>
```

## Props

### schema

The schema that the `SchemaWizard` will use to render the form. This is a required property.

The schema that the `SchemaWizard` uses varies from the one used in `SchemaForm` in one major difference — it is strictly an array, in which each of the array elements is a `SchemaForm` ready schema.

::: warning
Note that the components used are only for purposes of the example and are not part of FormVueLate
:::

Example schema for a form wizard/stepped form:

```javascript
const wizardSchema = [
  // Step 1 - user's name
  {
    firstName: { component: FormText },
    lastName: { component: FormText }
  },

  // Step 2 - user's email and agree to terms
  {
    email: { component: FormEmail },
    terms: { component: FormCheckbox }
  }
]
```

In the above example we have two different form steps, the first will display two inputs — one for the `firstName`, and one for the `lastName`.

In the second step, the elements in step one will not be displayed, and the `email` and `terms` checkbox will.

### step

This property is required, 0 based, and of the type `Number`.

The `step` is the index of the currently displayed part of the stepped schema. In the previous schema example, step `0` will indicate that the `SchemaWizard` should display the index `0` of the form — the user's first and last name.

Step `1` will indicate that the `SchemaWizard` should display index `1` of the form — the email and terms checkbox.

```html
<template>
  <SchemaWizard :schema="wizardSchema" :step="step">
</template>

<script>
import { ref } from 'vue'
export default {
  setup () {
    const step = ref(0)
    const wizardSchema = ref({
      // schema
    })
    return {
      step,
      wizardSchema
    }
  }
}
</script>
```

### modelValue

This property is required, and of type `Array`.

This is the property that the `SchemaWizard` component will use for `v-model` binding and to inject form values into subcomponents.

This is an example output from the example schema above after the user fills out the fields.

```javascript
[
  {
    firstName: 'Jane',
    lastName: 'Doe'
  },
  {
    email: 'jane@gmail.com',
    terms: true
  }
]
```

Example injecting `userData` as the `modelValue`:

```html
<template>
  <SchemaWizard
    :schema="wizardSchema"
    :step="step"
    :modelValue="userData"
    @update:modelValue="updateData"
/>
</template>

<script>
import { ref } from 'vue'
export default {
  setup () {
    const step = ref(0)
    const userData = ref({})
    const wizardSchema = ref({
      // schema
    })
    const updateData = data => {
      userData.value = data
    }
    return {
      step,
      userData,
      updateData,
      wizardSchema
    }
  }
}
</script>
```

## Handling submit

`SchemaWizard` will automatically create a `<form>` wrapper for you on the top level regardless of how many sub-forms you provide, and fire a `submit` event when the form is submitted.

This `submit` event uses `preventDefault` so you can handle the submit on your end.

In order to react and listen to the `submit` events, simply add a `@submit` listener to the `SchemaWizard` component in your template.

```html
<template>
  <SchemaWizard
    @submit="onSubmit"
    v-model="myData"
    :schema="mySchema"
    :step="step"
  />
</template>
```

## Slots

`SchemaWizard` provides two slots for you to add additional elements to your form.

A `beforeForm` slot will be provided before the child `SchemaForm`s.

Use this for scenarios where you want to provide some element to your form _after_ the `<form>` tag, but _before_ the internal `SchemaForm`s.

```html
<form>
  <!-- beforeForm slot content goes here -->
  <SchemaForm />
</form>
```

An `afterForm` slot will be provided after the rendered `SchemaForm`s.

Use this to add elements _after_ the rendered `SchemaForm`s and _before_ the wrapping `</form>` tag. A good example would be a submit button.

```html
<form>
  <SchemaForm />
  <!-- afterForm slot content goes here -->
</form>
```

:::tip
Always use the `afterForm` slot to add your `type="submit"` button, that way it will be rendered inside the `form` tags.

You don't have to listen to this `submit` button's click events, as `SchemaWizard` will take care of emitting a `submit` event whenever it is clicked, or the form is submitted in any other way.
:::
