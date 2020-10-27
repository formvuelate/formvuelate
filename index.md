---
sidebar: auto
title: FormVueLate 2.x
---

## Getting Started

![FormVueLate logo](./assets/formvuelate-logo.jpg)

FormVueLate is a zero dependency library that allows you to generate schema-driven forms with extreme ease.

The schema that you use for your form can be as flexible as you need it to be, it can be modified at run-time with an expected reactive result, and can even be fetched directly from you backend’s API.

::: warning Important
FormVueLate is a bring-your-own-components library!

We do **not** provide any base components for your to build your forms. There are numerous component libraries out there that do a great job of providing carefully constructed components for you to use, and FormVueLate does a great job at allowing you to bring those external components to your forms, or even crafting your own.
:::

## Playground

Modify the Schema on the left to see FormVueLate's `SchemaForm` in action on the right. You can use the following demo input components:

- FormText
- FormSelect
- FormCheckbox

<SchemaPlayground/>

## Installation

To add FormVueLate to your project, start by installing the package through your favorite package manager.

```bash
yarn add formvuelate
// OR
npm install formvuelate
```

Now that you have the package in your project, `import` it to the component that will hold your form.

You can pick and choose which of the FormVueLate's components you will need. The following example imports all of them.

```javascript
import { SchemaForm, SchemaWizard, SchemaFormFactory } from 'formvuelate'
```

## SchemaForm

The `SchemaForm` requires two `props`. The first is the `schema`, which is the meta-data of your form. The second one is `modelValue`, which will hold the state of the form.

```html
<SchemaForm :schema="mySchema" :modelValue="formData" />
```

The `SchemaForm` will `$emit` **update:modelValue** events when your components update. This means that you are able to either:

- use `v-model` on it
- or, manually capture the `@update:modelValue` event with a method of your own while injecting the `:modelValue` property.

Example with `v-model`:

```html
<template>
  <SchemaForm :schema="mySchema" v-model="formData" />
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const formData = ref({})
    const mySchema = ref({
      // some schema here
    })

    return {
      formData,
      mySchema
    }
  }
}
</script>
```

Example with manual bindings:

```html
<template>
  <SchemaForm
    :schema="mySchema"
    :modelValue="formData"
    @update:modelValue="updateForm"
  />
</template>

<script>
import { ref } from 'vue'
export default {
  setup() {
    const formData = ref({})
    const mySchema = ref({
      // some schema here
    })

    const updateForm = form => {
      formData.value = form
    }

    return {
      formData,
      mySchema,
      updateForm
    }
  }
}
</script>
```
### Prop: schema

The `SchemaForm` component requires you to pass it a `schema` property. This `schema` can be either an `object` or an `array`.

In its simplest form, the `schema` requires you to provide an object with a `modelName: value` pair for each of the form components you want to add to your form.

Let’s assume for this example that you have a component in your project called `FormText` which exposes an `<input>` tag with some CSS.

```html
<template>
  <SchemaForm :schema="schema" v-model="formData" />
</template>

<script>
  import { SchemaForm } from 'formvuelate'
  import FormText from 'path/to/FormText'
  import { ref } from 'vue'

  export default {
    components: { SchemaForm },
    setup() {
      const schema = ref({
        name: {
          component: FormText
        },
        lastName: {
          component: FormText
        }
      })
      const formData = ref({})

      return {
        schema,
        formData
      }
    }
  }
</script>
```

:::tip
In the above example, we use the component `FormText` that we imported as the value of the `component` property of each element.

You can use the name of the component as a `String` instead, for example `'FormText'`, but be aware that the component needs to either be imported globally, or in your file first.
:::

#### Array Schemas

For `array` based schemas, we need to provide an object for each element of the form, but instead of providing a `modelName: value` structure, we declare a `model` property inside of each object.

Here's the above example again using `array` format.

```html
<template>
  <SchemaForm :schema="schema" v-model="formData" />
</template>

<script>
  import { SchemaForm } from 'formvuelate'
  import FormText from 'path/to/FormText'
  import { ref } from 'vue'

  export default {
    components: { SchemaForm },
    setup() {
      const schema = ref([
        {
          component: FormText,
          model: 'name'
        },
        {
          component: FormText,
          model: 'lastName'
        }
      ])
      const formData = ref({})

      return {
        schema,
        formData
      }
    }
  }
</script>
```

An important feature about array schemas is that they allow us the flexibility to create not only vertical forms, but horizontally aligned inputs.

Consider the following meta schema.

```js
const SCHEMA = [
  [ {}, {}, {} ], // 3 inputs in a row
  {}, // 1 input in a row
  [ {}, {} ] // 2 inputs in a row
]
```

The first and second elements of the schema array are sub-arrays. These sub arrays will be displayed by `SchemaForm` horizontally by applying a display of `flex` to their containing `div` element.

:::tip
The `div` will have a class named `schema-row` to apply the layout. You can target this class to modify the behavior, or even add `style` or `css` classes to your inputs by passing them through the schema.

The example below applies a `margin-right` style to the first input.
:::

<SplitTab>
  <template v-slot:example>
    <HorizontalForm />
  </template>

  <<< .vitepress/docs/components/HorizontalForm.vue
</SplitTab>

### Prop: preventModelCleanupOnSchemaChange

By default `SchemaForm` cleans up the value output of properties that are no longer present inside the schema every time the schema changes.

That means that if at runtime the schema deletes one of the elements inside of it, the output of the `modelValue` of `SchemaForm` will no longer contain the user's data if it was already present.

Let's pretend that you have a form that is built with the following schema.

```js
name: {
  label: 'Name',
  component: FormText
},
lastName: {
  label: 'Last name',
  component: FormText
}
```

If the user fills out both of the inputs, you can expect an output like the following.

```js
{
  name: 'Bobba',
  lastName: 'Fett'
}
```

If at this point your schema changes, and deletes the `lastName` property, `SchemaForm` is smart enough to remove that from the output and emit a new `update:modelValue` event since that field is effectively _gone_.

```js
{
  name: 'Bobba'
}
```

If you want to disable this behavior, set the `preventModelCleanupOnSchemaChange` to `true` in your `SchemaForm` component.

```html
<SchemaForm
  :preventModelCleanupOnSchemaChange="true"
  :schema="mySchema"
/>
```

Now `SchemaForm` will not automatically delete the `lastName` property, even if `schema` removes the property, and you will preserve the value of the input if it was already present.

### Handling submit

`SchemaForm` will automatically create a `<form>` wrapper for you on the top level `SchemaForm` in the case of single and multi dimensional schemas, and fire a `submit` event when the form is submitted.

This `submit` event will `preventDefault` so you can handle the submit on your end.

In order to react and listen to the `submit` events, simply add a `@submit` listener to the `SchemaForm` component in your template.

```html
<template>
  <SchemaForm
    @submit="onSubmit"
    v-model="myData"
    :schema="mySchema"
  />
</template>
```

### Slots

`SchemaForm` provides two slots for you to add additional elements to your form.

A `beforeForm` slot will be provided before the top-most rendered `SchemaForm`.

Use this for scenarios where you want to provide some element to your form _after_ the `<form>` tag, but _before_ the `SchemaForm`.

```html
<form>
  <!-- beforeForm slot content goes here -->
  <SchemaForm />
</form>
```

An `afterForm` slot will be provided after the rendered `SchemaForm`.

Use this to add elements _after_ the `SchemaForm` and _before_ the wrapping `</form>` tag. A good example would be a submit button.

```html
<form>
  <SchemaForm />
  <!-- afterForm slot content goes here -->
</form>
```

:::tip
Always use the `afterForm` slot to add your `type="submit"` button, that way it will be rendered inside the `form` tags.

You don't have to listen to this `submit` button's click events, as `SchemaForm` will take care of emitting a `submit` event whenever it is clicked, or the form is submitted in any other way. [Read more about handling form submits](#handling-submit)
:::

### Component Requirements

Now that you have your schema bound into the `schema` prop, you need to make sure that your components are understood by `SchemaForm`.

First, make sure that your component accepts a `modelValue` property. `SchemaForm` will bind into this property to pass down the current value of the input.

Next, make sure that your component emits an `update:modelValue` event with the payload of the new input's value whenever it changes. This will allow `SchemaForm` to update the data internally and emit the update event to the parent.

Example of a simple input component:

```html
<template>
  <input
    type="text"
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>

<script>
export default {
  props: {
    modelValue: {
      required: true,
      type: [String, Number]
    }
  }
}
</script>
```

## SchemaWizard

FormVueLate also ships with a component called `SchemaWizard`, that allows you to easily build stepped, wizard-like, forms.

The `SchemaWizard` component exposes and **requires** three props: `schema`, `step`, and `modelValue`.

### v-model

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

### Prop: schema

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

### Prop: step

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

### Props: modelValue

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

### Handling submit

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

### Slots

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

## Plugins

FormVueLate ships with the ability to import and use plugins to extend it's capabilities.

In order to use a plugin with `SchemaForm`, you have to use the provided `SchemaFormFactory` function.

First, import the `SchemaFormFactory` into your application.

```javascript
import { SchemaFormFactory } from 'formvuelate'
```

`SchemaFormFactory` accepts an array of plugins that will be used to generate the `SchemaForm`.

:::warning Important
`SchemaFormFactory` returns an extended version of `SchemaForm`, so all the props required by `SchemaForm` like `schema` and `modelValue`/`v-model` are still required.
:::

The order in which you pass the plugins is *important*, as they will be applied in the order they are received.

Each plugin will modify the `setup` function of `SchemaForm` and change the way the `schema` is parsed. The next plugin in line will receive the modified `setup` function that the previous one changed.

```html
<template>
  <SchemaFormWithPlugins :schema="mySchema" v-model="myData"/>
</template>

<script>
import useVuelidate from '@vuelidate'
import VuelidatePlugin from '@formvuelate/plugin-vuelidate'
import LookupPlugin from '@formvuelate/plugin-lookup'
import VeeValidatePlugin from '@formvuelate/plugin-vee-validate'

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
  }
}
</script>
```

Now that we have defined a new component called `SchemaFormWithPlugins`, you can use it as you normally use any other component in your application.

### Vuelidate Plugin

:::warning
The Vuelidate plugin is **WIP** and should not yet be used! We will update this section as soon as it's ready.
:::


### Lookup Plugin

[Lookup Plugin's Repo](https://github.com/vuelidate/formvuelate-plugin-lookup).

Whenever you find yourself working with a `schema` that has already been generated or created with a specific structure that does not comply to the requirements of `SchemaForm`, it becomes a necessary step to parse it to modify the structure.

In order to make this task easier, FormVueLate provides a core plugin called `@formvuelate/plugin-lookup`.

#### Installation

To install the plugin, simply add it to your `package.json` via terminal.

```bash
yarn add @formvuelate/plugin-lookup

// OR

npm i @formvuelate/plugin-lookup
```

#### Usage

To use the plugin, first import both the plugin itself, and the `SchemaFormFactory` to your application.

```js
import { SchemaFormFactory } from 'formvuelate'
import LookupPlugin from '@formvuelate/plugin-lookup'
```

Now that we have both imported, we can create our plugin-enabled `SchemaForm` component by using the `SchemaFormFactory`

```js
const SchemaFormWithPlugin = SchemaFormFactory([
  LookupPlugin({
    // plugin configuration here
  })
])
```

Now that we have created our new component, we can pass it to our instance's `components` object, and use it as we normally would in our template.

```html
<template>
  <div id="app">
    <SchemaFormWithPlugin
      :schema="mySchema"
      v-model="myData"
    />
  </div>
</template>

<script>
export default {
  components: {
    SchemaFormWithPlugin
  },
  setup () {
    [...]
  }
}
</script>
```

#### Configuration

`LookupPlugin` takes one parameter, an object, as it's source of configuration.
Let's look at the properties that we can use in this object.

##### mapComponents

If your schema does not provide component names as your Vue application needs them, `mapComponents` is a property of the configuration object that can allow you to rename or remap these values with ease.

Consider the following example schema.

```json
{
  "firstName": {
    "component": "string",
    "label": "First name"
  },
   "favoriteThingAboutVue": {
    "component": "array",
    "label": "Favorite thing about Vue",
    "required": true,
    "options": [
      "Ease of use",
      "Documentation",
      "Community"
    ]
  },
}
```

In this case, the `component` definition is not `FormText`, or `FormSelect`, or whichever other components we may be using in our application. So we need to map them.

Let's add this mapping into our configuration object.

```js
LookupPlugin({
  mapComponents: {
    string: 'FormText',
    array: 'FormSelect'
  }
})
```

`LookupPlugin` will now look inside your schema and parse all the `component` definitions into their respective components. So `string` will become `FormText` and `array` will become a `FormSelect` component.

##### mapProps

If your schema needs to parse additional props for your own component's needs, `mapProps` provides an easy way of parsing any property in your component's object definition to something else.

For example, in some cases the schema might define your `component` property with something else, let's use `type` in the following example:

```json
{
  "firstName": {
    "type": "FormText",
    "info": "First name"
  }
}
```

We need to map `type` into `component`, since that is the property that `SchemaForm` expects to find for the component to render into the form. [Read more about component requirements](#component-requirements)

```js
const SchemaFormWithPlugin = SchemaFormFactory([
  LookupPlugin({
    mapProps: {
      type: 'component'
    }
  })
])
```

If we also needed to map `info` to `label` because our component is expecting a `label` property and our schema defines it as `info`, by using `mapProps` in our configuration we can ask the plugin to do both at the same time.

```js
const SchemaFormWithPlugin = SchemaFormFactory([
  LookupPlugin({
    mapProps: {
      type: 'component',
      info: 'label'
    }
  })
])
```

Now our schema will correctly pass the `label` property into our `FormText` example component. The schema will also correctly reflect a `component` property with the value of `FormText`.

The `mapProps` property can also receive a function to handle advanced property parsing logic.

If a function is provided, the plugin will run the function before parsing each element to retrieve the mapping of properties. The function will inject the current element as the first parameter.

Consider the following schema and example.

```json
{
  "firstName": {
    "type": "FormText",
    "label": "First name",
    "important": true
  },
  "lastName": {
    "field": "FormText",
    "label": "Last name",
    "important": true
  }
}
```

The first field declares a `type` property that holds the component that it should render.

The second field declares a `field` property that holds the component that it should render.

In this case, we need more per-field control in how the properties are mapped.

```js
const SchemaFormWithPlugin = SchemaFormFactory([
  LookupPlugin({
    mapProps: (el) => {
      // This function will be called for each element in the schema
      // "el" is the current element being parsed

      // Map important to required only for the field with label 'First name'
      if (el.label === 'First name') {
        return {
          type: 'component',
          important: 'required'
        }
      }

      // For any other element
      return {
        field: 'component'
      }
    }
  })
])
```

If you ever find yourself needing to delete a certain property from your schema, the `LookupPlugin`'s `mapProps` allows you to do it as well.

Consider the following schema:

```json
{
  "firstName": {
    "type": "FormText",
    "label": "First name",
    "important": true
  },
  "lastName": {
    "field": "FormText",
    "label": "Last name",
    "important": true
  }
}
```

If we needed to delete the `important` property from ALL components, we can use the object syntax by setting the property to the boolean `false`.

```js
LookupPlugin({
  mapProps: {
    important: false
  }
})
```

If we need more control, to only delete on certain conditions, the function syntax can also be used.

```js
LookupPlugin({
  mapProps: (el) => {
    if (el.label === 'First name') {
      // Delete the important prop from the elements with label 'First name'
      return {
        important: false
      }
    }

    // Ignore any other components
    return {}
  }
})
```

#### Nested Schema Caveats

When dealing with schemas that have sub-schemas like the following:

```json
{
  "firstName": {
    "component": "string",
    "info": "First Name"
  },
  "work": {
    "component": "SchemaForm",
    "schema": {
      "address": {
        "type": "FormText",
        "label": "Work address"
      },
      "details": {
        "component": "SchemaForm",
        "schema": {
          "position": {
            "type": "FormText",
            "label": "Work position"
          }
        }
      }
    }
  }
}
```

Make sure that you use `mapComponents` to change `SchemaForm` for whatever you named the output of your `SchemaFormFactory` function call.

```js
// Note "SchemaFormWithPlugin" getting remapped

const SchemaFormWithPlugin = SchemaFormFactory([
  LookupPlugin({
      SchemaForm: 'SchemaFormWithPlugin',
      [...]
    }
  })
])
```

### Vee-Validate Plugin

[Vee-Validate Plugin's Repo](https://github.com/vuelidate/formvuelate-plugin-vee-validate).

The vee-validate plugin lets you validate your generated fields using [vee-validate](https://github.com/logaretm/vee-validate).

#### Installation

To install the plugin, simply add it to your `package.json` via terminal.

```bash
yarn add @formvuelate/plugin-vee-validate

# OR

npm i @formvuelate/plugin-vee-validate
```

#### Usage

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
    <SchemaFormWithValidation
      :schema="mySchema"
      v-model="myData"
    />
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

#### Component Requirements

Your components will receive the validation state via `validation` prop which contains the error messages and the `meta` information exposed by vee-validate, the validation prop contains the following properties/methods:

```js
{
  errorMessage, // The first error message for that field
  errors, // All error messages for that field
  meta, // A field meta object
  setDirty, // Sets the meta `dirty` flag
  setTouched, // Sets the meta `touched` flag
}
```

You can opt-in to any of these properties or to the entire `validation` object. Here is an example `FormText` component that accepts the `validation` object as a prop:

```html
<template>
  <div>
    <input
      :value="modelValue"
      @input="update($event.target.value)"
    >
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

Whenever the `modelValue` is updated the field will be validated immediately. If you don't want that and want your validations to be less aggressive, then you can show the error message when the field is `touched` which is set after the field is blurred and you can set it using `setTouched` on the validation object.

```html
<template>
  <div>
    <input
      :value="modelValue"
      @input="update($event.target.value)"
      @blur="onBlur"
    >
    <span v-if="validation.touched">{{ validation.errorMessage }}</span>
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
    onBlur() {
      this.validation.setTouched(true);
    }
  }
}
</script>
```

#### Configuration

The `VeeValidatePlugin` takes one parameter which is a configuration object, here are the properties that you can use.

##### mapProps

If you are using 3rd party components and cannot modify their definition to accept the `validation` object, you can use the `mapProps` configuration to map the `validation` object to another property or multiple properties that are accepted by your component.

In the following example, the `errorMessage` is extracted to it's own prop.

```js
const SchemaFormWithValidation = SchemaFormFactory([
  VeeValidatePlugin({
    mapProps(validation) {
      return {
        errorMessage: validation.errorMessage,
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

#### Defining Validation Rules

Now that your component is configured to recieve validation state, let's take a look on how to actually validate them.

There are two approaches to specify validation rules to your schema fields, which are "field-level" and "form-level".

##### Field Level Validation

The "field-level" approach allows to you add a `validations` property to your fields schema, the `validation` property can be any type of validators that is [accepted by vee-validate](https://vee-validate.logaretm.com/v4/guide/validation)

Here is an example of a schema that uses all the possible `validations` value types:

```js
import * as yup from 'yup';

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
    validations: (value) => value && value.length > 6
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
  <SchemaFormWithPlugin
    :schema="schema"
    v-model="myData"
  />
</div>
```

##### Form Level Validation

You can specify validations on the form level by passing a `validation-schema` prop to the component created by `SchemaFormFactory`, the `validation-schema` prop value should be one that accepted by [vee-validate's form level validation](https://vee-validate.logaretm.com/v4/guide/validation#form-level-validation).

This example uses `yup` to define validation schemas for your forms.

```html
<template>
  <div id="app">
    <SchemaFormWithValidation
      :schema="schema"
      :validation-schema="validationSchema"
      v-model="formData"
    />
  </div>
</template>

<script>
import * as yup from 'yup';

export default {
  components: {
    SchemaFormWithValidation
  },
  setup () {
    const schema = ref([
      // Fields without the `validation` prop
    ])

    const formData = ref({})

    // The validation schema
    const validationSchema = yup.object().shape({
      email: yup.string().email().required(),
      password: yup.string().min(5).required(),
      fullName: yup.string().required(),
    })

    return {
      schema,
      formData,
      validationSchema
    }
  }
}
</script>
```

#### Handling Submit

The `VeeValidatePlugin` automatically handles `SchemaForm` submits, and triggers validation before the form is submitted. You don't have to do anything special to trigger validations before submitting.

```html
<template>
  <SchemaForm
    @submit="onSubmit"
    v-model="formData"
    :schema="schema"
  >
    <template #afterForm>
      <button>Submit</button>
    </template>
  </SchemaForm>
</template>
```

Note that the `submit` handler will be only executed if the form is valid.

#### Demo

Here is a demo of Formvuelate generated form with vee-validate validation

<!-- TODO: Insert DEMO iframe -->

## Accessibility

Due to the bring-you-own-components nature of FormVueLate, the library itself does not handle accessibility internally for input elements. However, we realize how important it is to provide accessible forms to our users.

We provide some tools for you to build your components in an accessible way.

### Unique ID

`SchemaForm` will generate and inject a property called `uuid` to each one of your components. This property is a randomly generated consecutive number that you can use to construct a11y compatible components.

Here is a simple example of a `FormInput` component that uses the `uuid` property to correctly bind the `label` to the `input`.

```html
<template>
  <div>
    <label :for="uuid">
      {{ label }}
    </label>
    <input
      :value="modelValue"
      :id="uuid"
      @input="$emit('update:modelValue', $event.target.value)"
    >
  </div>
</template>

<script>
export default {
  props: {
    modelValue: { required: true },
    label: {
      type: String,
      required: true
    },
    uuid: {
      type: Number,
      default: 0
    }
  }
}
</script>
```

## Examples

Here you will find a few examples on how you can set up your `schema` and the output it would produce.

:::warning Important
We are using a few different example custom components to showcase, but you should use your own!
These components are **only** for demonstration purposes, and are **not** included with the library.
:::

### SchemaForm with v-model

This example showcases the simplest way to use `SchemaForm`.
It provides the component with a `schema` in the form of a JavaScript object, and binds the output of the form to the local data `userData` through `v-model`.

<SplitTab>
  <template v-slot:example>
    <ExampleVModel />
  </template>

  <<< .vitepress/docs/components/ExampleVModel.vue
</SplitTab>

### Nested schemas

`SchemaForm` is able to parse and display forms that are based on nested schemas. In the example below, you can see how the `work` property is an object that uses `SchemaForm` itself as a component, and provides a `schema` property of its own.

Further down the tree inside `details`, yet another level of nested data can be found.

<SplitTab>
  <template v-slot:example>
    <Formception />
  </template>

  <<< .vitepress/docs/components/Formception.vue
</SplitTab>

### Using an array based schema

`SchemaForm` allows you to construct the schema also as an array. The name of each field is declared as a `model` property in each element, instead of it being the `key` for each property of the object-type schema.

Additionally, notice that in this example `v-model` is not being used. We bind `modelValue` directly to the `userData`, and listen to the `update:modelValue` event to merge the changes from `SchemaForm` into our `userData` object.

<SplitTab>
  <template v-slot:example>
    <ArrayExample />
  </template>

  <<< .vitepress/docs/components/ArrayExample.vue
</SplitTab>
