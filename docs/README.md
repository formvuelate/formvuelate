---
home: true
actionText: Get Started →
actionLink: /guide/
features:
- title: Your Components
  details: Supports your own form-input components
- title: Validations!
  details: Use Vuelidate-compatible schema for your validation rules (WIP)
- title: Zero Dependencies
  details: dependencies <= 0
footer: MIT Licensed | Copyright © 2019-present Damian Dulisz
---

## Getting Started

FormVueLatte is a zero dependency library that allows you to generate schema-driven forms with extreme ease.

The schema that you use for your form can be as flexible as you need it to be, it can be modified at run-time with an expected reactive result, and can even be fetched directly from you backend's API.

### Installation

NOTE: This whole section is WIP.

To add FormVueLatte to your project, start by installing the package through your favorite package manager.

```bash
yarn add formvuelatte
```

```bash
npm install formvuelatte
```

Now that you have the package in your project, `import` it to your component.

```js
import { SchemaForm } from 'formvuelatte'
```

Finally, add it to your component and pass it your **schema** through the `:schema` property.

```js
<template>
    <SchemaForm :schema="mySchema" />
</template>
```

The `SchemaForm` will `$emit` **input** events when your components update. This means that you are able to either use `v-model` on it, or manually capture the `@input` event with a method of your own, as well as inject the `:value` property. Either or.

## Component Requirements and the FormMixin
In order for FormVueLatte's `SchemaForm` to understand your components, they need to implement the `FormMixin.js` that FormVueLatte provides. In its simplest form, make sure that when your `form element` wants to make a change to the `value`, it calls the `update` method with the new value.

Here's an example using the `<input>` tag.

```js
<input
    :value="value"
    @input="update($event.target.value)"
/>
```

The `FormMixin` also adds a required `value` property to your component (for it to comply with v-model capabilities), which is `required`.

**Instructions on how to actually import it here :D**

Once you've imported the mixin to your components, make sure your component makes use of the `update` method provided by the mixin.

## Schema composition
The `SchemaForm` component requires you to pass it a `schema` property. This `schema` can be both an `object` or an `array`, although under the hood it will be transformed to an `array`.

In its simplest form, the `schema` requires you to provide a `name: value` pair for each of the form components you want to add to your form. Let's assume for this example that you have a component in your project called `FormText` which exposes an `<input>` tag with some CSS.

```html
<template>
    <SchemaForm :schema="schema" />
</template>

<script>
    import { SchemaForm } from 'formvuelatte'
    import FormText from 'path/to/FormText';

    export default {
        components: { SchemaForm },
        data() {
            return {
                schema: {
                    name: {
                        component: FormText // Note that this is NOT a string
                    },
                    lastName: {
                        component: FormText // We pass the component that we imported directly
                    }
                }
            }
        }
    }
</script>
```

## Examples
Here you will find a few examples on how you can set up your `schema` and the output it would produce. We are using three different custom components to showcase, but you should use your own! 😉

### Basic Usage

#### Schema

```js
const SCHEMA = {
  firstName: {
    component: FormText,
    label: 'First Name',
  },
  lastName: {
    component: FormText,
    label: 'Last Name',
  },
  email: {
    component: FormText,
    label: 'Your email',
    required: true,
    config: {
      type: 'email'
    }
  },
  isVueFan: {
    component: FormCheckbox,
    label: 'Are you a Vue fan?'
  }
}
```

#### Template
```js
<SchemaForm
    :schema="schema"
    v-model="userData"
/>
```

#### Result 

<ExampleVModel></ExampleVModel>

### With Array Schema
<ArrayExample></ArrayExample>

### V-Model Example

<ExampleVModel></ExampleVModel>

### Formception

<Formception></Formception>

### Schema Wizard

<WizardExample></WizardExample>

### MultiElement

The SchemaForm can handle custom components that wrap two or more child inputs.
They must emit the `update-batch` event with an object payload that has the values for each of the inputs.

<MultiElementExample></MultiElementExample>