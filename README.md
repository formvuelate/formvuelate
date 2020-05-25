# FormVueLatte

Full guide with examples is WIP for V2.0

## Getting Started

FormVueLatte is a zero dependency library that allows you to generate schema-driven forms with extreme ease.

The schema that you use for your form can be as flexible as you need it to be, it can be modified at run-time with an expected reactive result, and can even be fetched directly from you backend’s API.

### Installation

To add FormVueLatte to your project, start by installing the package through your favorite package manager.

```bash
yarn add formvuelatte
// OR
npm install formvuelatte
```

Now that you have the package in your project, `import` it to your component.

```javascript
import { SchemaForm } from 'formvuelatte'
```

The `SchemaForm` requires two `props`. The first is the `schema`, which is the meta-data of your form. The second one is `value`, which will hold the state of the form.

```html
<SchemaForm :schema="mySchema" :value="formData" />
```

The `SchemaForm` will `$emit` **update:modelValue** events when your components update. This means that you are able to either:

- use `v-model` on it
- or, manually capture the `@update:modelValue` event with a method of your own while injecting the `:value` property.

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

## The schema prop

The `SchemaForm` component requires you to pass it a `schema` property. This `schema` can be both an `object` or an `array`, although under the hood it will be transformed to an `array`.

In its simplest form, the `schema` requires you to provide a `name: value` pair for each of the form components you want to add to your form. Let’s assume for this example that you have a component in your project called `FormText` which exposes an `<input>` tag with some CSS.

```javascript
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

## Component Requirements

Now that you have your schema bound into the `schema` prop, you need to make sure that your components are understood by `SchemaForm`.

First, make sure that your component accepts a `modelValue` property. `SchemaForm` will bind into this property to pass down the current value of the input.

Next, make sure that your component `$emit`s an `update:modelValue` event with the payload of the new input's value whenever it changes. This will allow `SchemaForm` to update the data internally and emit the update event to the parent.

Example of a simple input component:

```javascript
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

```javascript
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

## Contributors
- [Marina Mosti](https://twitter.com/MarinaMosti)
- [Damian Dulisz](https://twitter.com/DamianDulisz)
- [Tonina Zhelyazkova](https://twitter.com/tonina_zh)
