# FormVueLatte 2.x

## Getting Started

`FormVueLatte` is a zero dependency library that allows you to generate schema-driven forms with extreme ease.

The schema that you use for your form can be as flexible as you need it to be, it can be modified at run-time with an expected reactive result, and can even be fetched directly from you backend’s API.

**Important**

`FormVueLatte` is a bring-your-own-components (BYOC) library!

We do _not_ provide any base components for your to build your forms. There are numerous component libraries out there that do a great job of providing carefully constructed components for you to use, and `FormVueLatte` does a great job at allowing you to bring those external components to your forms, or even crafting your own.

## Playground

Modify the Schema on the left to see FormVueLatte's `SchemaForm` in action on the right. You can use the following demo input components:

- FormText
- FormSelect
- FormCheckbox

<SchemaPlayground/>

## Installation

To add FormVueLatte to your project, start by installing the package through your favorite package manager.

```bash
yarn add formvuelatte
// OR
npm install formvuelatte
```

Now that you have the package in your project, `import` it to your component.

You can pick and choose which of the `FormVueLatte` components you will need. The following example imports all of them.

```javascript
import { SchemaForm, SchemaWizard, SchemaFormFactory } from 'formvuelatte'
```

## SchemaForm

The `SchemaForm` requires two `props`. The first is the `schema`, which is the meta-data of your form. The second one is `value`, which will hold the state of the form.

```html
<SchemaForm :schema="mySchema" :value="formData" />
```

The `SchemaForm` will `$emit` **update:modelValue** events when your components update. This means that you are able to either:

- use `v-model` on it
- or, manually capture the `@update:modelValue` event with a method of your own while injecting the `:value` property.

Example with `v-model`:

```html
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
}
</script>
```

Example with manual bindings:

```html
<template>
  <SchemaForm
    :schema="mySchema"
    :data="formData"
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

Keep in mind when using v-model with `<SchemaForm>`, the value that we pass will be replaced with a new value. This also means we should always use `ref` to create that state object as it will track the changes as you would expect.

### Prop: Schema

The `SchemaForm` component requires you to pass it a `schema` property. This `schema` can be both an `object` or an `array`, although under the hood it will be transformed to an `array`.

In its simplest form, the `schema` requires you to provide a `name: value` pair for each of the form components you want to add to your form. Let’s assume for this example that you have a component in your project called `FormText` which exposes an `<input>` tag with some CSS.

```html
<template>
  <SchemaForm :schema="schema" v-model="formData" />
</template>

<script>
  import { SchemaForm } from 'formvuelatte'
  import FormText from 'path/to/FormText'
  import { reactive } from 'vue'

  export default {
    components: { SchemaForm },
    setup() {
      const schema = reactive({
        name: {
          component: FormText // Note that is NOT a string
        },
        lastName: {
          component: FormText // We pass the component that we imported directly
        }
      })
      const formData = reactive({})

      return {
        schema,
        formData
      }
    }
  }
</script>
```

### Prop: preventModelCleanupOnSchemaChange

By default `SchemaForm` cleans up the value output of properties that are no longer present inside `schema` every time `schema` changes.

Pretend that you have a form that is built with the following schema.

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

If at this point your schema changes, and deletes the `lastName` property, `SchemaForm` is smart enough to remove that from the output and emit a new `update:modelValue` since that field is effectively _gone_.

```js
{
  name: 'Bobba'
}
```

If you want to disable this behavior, pass the `preventModelCleanupOnSchemaChange` to your `SchemaForm` component.

```html
<SchemaForm
  preventModelCleanupOnSchemaChange
  :schema="mySchema"
/>
```

### Handling submit

`SchemaForm` will automatically create a `<form>` wrapper for you on the top level `SchemaForm` in the case of single and multi dimensional schemas, and fire a `submit` event when the form is submitted.

This `submit` will `preventDefault` so you can handle the submit on your end.

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

Note that any sub `SchemaForm`s in nested schemas will not have `form` tags themselves, and will be rendered inside wrapping `div` tags.

### Slots

`SchemaForm` provides two slots for you to add additional elements to your form.

A `beforeForm` slot will be provided before the rendered `SchemaForm`.

Use this for scenarios where you want to provide some element to your form _after_ the `<form>` tag, but _before_ the `SchemaForm`.

An `afterForm` slot will be provided after the rendered `SchemaForm`.

Use this to add elements _after_ the `SchemaForm` and _before_ the wrapping `</form>` tag. A good example would be a submit button.

### Component Requirements

Now that you have your schema bound into the `schema` prop, you need to make sure that your components are understood by `SchemaForm`.

First, make sure that your component accepts a `modelValue` property. `SchemaForm` will bind into this property to pass down the current value of the input.

Next, make sure that your component `$emit`s an `update:modelValue` event with the payload of the new input's value whenever it changes. This will allow `SchemaForm` to update the data internally and emit the update event to the parent.

Example of a simple input component:

```html
<template>
  <input type="text" :value="modelValue" @input="update" />
</template>

<script>
export default {
  props: {
    modelValue: {
      required: true,
      type: [String, Number]
    }
  },
  setup(props, context) {
    const update = event => {
      context.emit('update:modelValue', event.target.value)
    }
  }
}
</script>
```

## SchemaWizard

FormVueLatte also ships with a component called `SchemaWizard`, that allows you to easily build stepped, wizard-like, forms.

The `SchemaWizard` component exposes and requires three props.

### Prop: Schema

The schema that the `SchemaWizard` will use to render the form. This is a required property.

The schema that the `SchemaWizard` uses varies from the one used in `SchemaForm` in one major difference — it is strictly an array, in which each of the array elements is a `SchemaForm` ready schema.

Example wizard schema:

( Note that the components used are only for purposes of the example and are not part of FormVueLatte )

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

In the previous example we have two different form steps, the first will display two inputs — one for the firstName, and one for the lastName. In the second step, the first two elements for the user's name will not be displayed, and the email and terms checkbox will.

### Prop: Step

This property is required, and numeric.

The step is the index of the currently displayed part of the stepped schema. In the previous schema example, step `0` will indicate that the `SchemaWizard` should display the index `0` of the form — the user's name.

Step `1` will indicate that the `SchemaWizard` should display index `1` of the form — the email and terms checkbox.

### Props: modelValue

This property is required, and an array.

This is the property that the `SchemaWizard` component will use for `v-model` binding and to inject form values into subcomponents.

Example output from the example schema above:

```javascript
[
  {
    fistName: 'Jane',
    lastName: 'Doe'
  },
  {
    email: 'jane@gmail.com',
    terms: true
  }
]
```

### Handling submit

`SchemaWizard` will automatically create a `<form>` wrapper for you on the top level regardless of how many sub-forms you provide, and fire a `submit` event when the form is submitted.

This `submit` uses `preventDefault` so you can handle the submit on your end.

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

An `afterForm` slot will be provided after the rendered `SchemaForm`s.

Use this to add elements _after_ the rendered `SchemaForm`s and _before_ the wrapping `</form>` tag. A good example would be a submit button.

Note that any sub `SchemaForm`s rendered inside the `SchemaWizard` will **not** have `<form>` tags on themselves, and will be rendered inside `div` elements.

## Plugins

FormVueLatte ships with the ability to import and use plugins to extend it's capabilities.

In order to use a plugin with `SchemaForm`, you have to use the provided `SchemaFormFactory` higher order function.

First, import the `SchemaFormFactory` into your application.

```javascript
import SchemaFormFactory from 'formvuelatte/SchemaFormFactory'
```

`SchemaFormFactory` accepts an array of plugins that will be used to generate the `SchemaForm`.

The order in which you pass the plugins is *important*, as they will be applied in the order they are received.

```javascript
import useVuelidate from '@vuelidate'
import VuelidatePlugin from 'formvuelatte/useVuelidatePlugin'

const SchemaFormWithPlugins = SchemaFormFactory([
  VuelidatePlugin(useVuelidate)
])
```

Now that we have defined a new component called `SchemaFormWithPlugins`, you can use it as you normally use any other component in your application.

```html
<template>
  [...]
  <SchemaFormWithValidations />
  [...]
</template>

export default {
  components: { SchemaFormWithValidations },
  [...]
}
```

### Vuelidate Plugin

In order to seamlessly validate FormVueLatte by using Vuelidate, we provide a `VuelidatePlugin` that will allow you to easily accomplish this.

Your schema will need some changes in order to work with the `VuelidatePlugin`. Each element in your schema will need to contain a `validations` property which is an object, with each of the validations that you want to apply to it.

```javascript
import { required, email } from '@vuelidate/validators/withMessages'

const SCHEMA = {
  firstName: {
    component: FormText,
    label: 'First Name',
    validations: {
      required
    }
  },
  lastName: {
    component: FormText,
    label: 'Last Name',
    validations: {
      required
    }
  },
  email: {
    component: FormText,
    label: 'Your email',
    validations: {
      email,
      required
    }
  }
}
```

Next, create your new `SchemaForm` by using the factory to inject the `VuelidatePlugin`.

```javascript
import useVuelidate from '@vuelidate'
import VuelidatePlugin from 'formvuelatte/useVuelidatePlugin'

const SchemaFormWithPlugins = SchemaFormFactory([
  VuelidatePlugin(useVuelidate)
])
```

Now that we have the component ready, we can jump into the `setup` function, where we need to get our `v-model` data ready, as well as a function to handle the `update:validations` event that our Vuelidate-powered form will `emit`.

```javascript
setup (props, context) {
  const userData = ref({
    firstName: 'John',
    lastName: '',
    email: ''
  })

  const validations = ref({})
  const updateValidations = v => {
    validations.value = v.value
  }

  return {
    schema: SCHEMA,
    userData,
    validations,
    updateValidations
  }
}
```

Finally, we can go to our template and pass down both the `userData` and the listener for our `update:validations` event.

```html
<template>
  <SchemaFormWithValidations
    :schema="schema"
    v-model="userData"
    @update:validations="updateValidations"
  />
</template>
```

### Lookup Plugin

[Repository for Lookup Plugin](https://github.com/vuelidate/formvuelatte-plugin-lookup).

Whenever you find yourself working with a `schema` that has already been generated or created with a specific structure that does not comply to the requirements of `SchemaForm`, it becomes a necessary step to parse it to modify the structure.

In order to make this task easier, `FormVueLatte` provides a core plugin called `@formvuelatte/plugin-lookup`.

#### Installation

To install the plugin, simply add it to your `package.json` via terminal.

```bash
yarn add @formvuelatte/plugin-lookup

// OR

npm i @formvuelatte/plugin-lookup
```

#### Usage

To use the plugin, first import both the plugin itself, and the `SchemaFormFactory` to your application.

```js
import { SchemaFormFactory } from 'formvuelatte'
import LookupPlugin from '@formvuelatte/plugin-lookup'
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

```js
export default {
  name: 'App',
  components: {
    SchemaFormWithPlugin
  },
  setup () {
    [...]
  }
}
```

```html
<template>
  <div id="app">
    <SchemaFormWithPlugin
      :schema="mySchema"
      v-model="myData"
    />
  </div>
</template>
```

**Important: ** Remember that `SchemaFormFactory` returns an extended version of `SchemaForm`, so all the props required by `SchemaForm` like `schema` and `modelValue`/`v-model` are still required.

#### Configuration

`LookupPlugin` takes one parameter, an object, as it's source of configuration.
Let's look at the properties that we can use in this object.

**componentProp**

`SchemaForm` schemas expect each component inside of them to be defined with a `component` property, like in the following example.

```json
{
  "firstName": {
    "component": "FormText",
    "label": "First name"
  }
}
```

In some cases the schema might define your `component` property with something else, like `type` like in the following example:

```json
{
  "firstName": {
    "type": "FormText",
    "label": "First name"
  }
}
```

If this is the case, you can pass into the configuration the `componentProp` property with the name of what YOUR schema uses to define the component for each node.

```js
LookupPlugin({
  componentProp: 'type'
})
```

The plugin will handle parsing the schema from `type` into `component` for you now.

The `componentProp` property can also accept a `function` instead of a `string`. If a function is received, we will inject the `element` that is currently being parsed as a parameter.

The function should return either a `string` which tells the plugin to replace the returned prop for `component`, or `false` to tell the plugin to _skip_ this element.

Consider the following schema.

```json
{
  "firstName": {
    "type": "FormText",
    "label": "First name"
  },
  "lastName": {
    "field": "FormText",
    "label": "Last name"
  }
}
```

Since we have two different props to replace, we can now use a complex function to get the job done.

```js
LookupPlugin({
  componentProp: (el) => {
    if (el.type) return 'type'
    if (el.field) return 'field'

    return false
  }
})
```

**mapComponents**

If your schema does not provide component names as your Vue application needs them, `mapComponents` is another property of the configuration object that can allow you to rename or remap these values with ease.

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

**mapProps**

If your schema needs to parse additional props for your own component's needs, `mapProps` provides an easy way of parsing any property in your component's object definition to something else.

Consider the following schema.

```json
{
  "firstName": {
    "component": "FormText",
    "info": "First name"
  }
}
```

If we needed to map `info` to `label` because of what our component is expecting, by using `mapProps` in our configuration we can easily ask the plugin to do it for us.

```js
const SchemaFormWithPlugin = SchemaFormFactory([
  LookupPlugin({
    mapProps: {
      info: 'label'
    }
  })
])
```

Now our schema will correctly pass the `label` property into our `FormText` component.

Just like `componentProp`, `mapProps` can also receive a function to handle advanced property parsing logic.

If a function is provided, the plugin will run the function before parsing each element to retrieve the mapping of properties. The function will inject the current element as the first parameter of the function.

**Important:** The mapping of props is done **after** the replacement of the `component` base property. Make sure to take this into consideration if you are also replacing a property for `component` using `componentProp`.

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

```js
const SchemaFormWithPlugin = SchemaFormFactory([
  LookupPlugin({
    mapProps: (el) => {
      // Map important to required only for 'First name'
      if (el.label === 'First name') {
        return {
          important: 'required'
        }
      }

      // Don't map anything on other elements
      return {}
    }
  })
])
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

Make sure that you `mapComponents` and change `SchemaForm` for whatever you named the output of your `SchemaFormFactory` function call.

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

## Accessibility

Due to the bring-you-own-components nature of `FormVueLatte`, the library itself does not handle a11y related topics internally. However, we realize how important it is to provide accessible forms to our users.

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

Please note: We are using a few different custom components to showcase, but you should use your own!

These components are **only** for demonstration purposes, and are **not** included with the library. 😉

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

`SchemaForm` allows to construct the schema also as an array. The name of each field is declared as a `model` property in each element, instead of it being the `key` for each property of the object-type schema.

Additionally, notice that in this example `v-model` is not being used. We bind `modelValue` directly to the `userData`, and listen to the `update:modelValue` event to merge the changes from `SchemaForm` into out `userData` object.

<SplitTab>
  <template v-slot:example>
    <ArrayExample />
  </template>

  <<< .vitepress/docs/components/ArrayExample.vue
</SplitTab>
