---
sidebar: auto
---

## Getting Started

FormVueLatte is a zero dependency library that allows you to generate schema-driven forms with extreme ease.

The schema that you use for your form can be as flexible as you need it to be, it can be modified at run-time with an expected reactive result, and can even be fetched directly from you backend's API.

### Installation

To add FormVueLatte to your project, start by installing the package through your favorite package manager.

```bash
yarn add formvuelatte

// OR

npm install formvuelatte
```

Now that you have the package in your project, `import` it to your component.

```js
import { SchemaForm } from 'formvuelatte'
```

The `SchemaForm` requires two `props`. The first is the `schema`, which is the configuration of your form. The second one is `value`, which will hold the state of the form.

```html
<SchemaForm :schema="mySchema" :value="formData" />
```

The `SchemaForm` will `$emit` **input** events when your components update. This means that you are able to either use `v-model` on it, or manually capture the `@input` event with a method of your own, as well as inject the `:value` property. Either or.

Below you will find an example of the previous concepts.

```html
<template>
  <SchemaForm :schema="mySchema" v-model="formData" />
</template>

<script>
export default {
  data() {
    return {
      formData: {},
      mySchema: { 
        //some schema here
      }
    }
  }
}
</script>
```

## The schema prop
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
                        component: FormText // Note that is NOT a string
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

## Component Requirements and the FormMixin
Now that you have your schema bound into the `schema` prop, you need to make sure that your components are understood by `SchemaForm`.

In order for `SchemaForm` to understand **your components**, they need to use the `FormMixin` mixin that FormVueLatte provides. 

```js
// FormText.vue
import { FormMixin } from 'formvuelatte'
export default {
  [...]
  mixins: [ FormMixin ],
  [...]
}
```

In its simplest form, make sure that when your `form element` wants to make a change to the `value`, it calls the `update` method with the new value.

Here's an example using the `<input>` tag.

```html
<input
    :value="value"
    @input="update($event.target.value)"
/>
```

The `FormMixin` adds a required `value` property to your component (for it to comply with v-model capabilities).

Once you've imported the mixin to your components, make sure your component makes use of the `update` method provided by the mixin.

The `update` method `$emit`s the `input` event with whatever value you pass to it.

## Examples
Here you will find a few examples on how you can set up your `schema` and the output it would produce. 

Please note: We are using a few different custom components to showcase, but you should use your own! 😉

### Basic Usage
In this example you can see `SchemaForm` being used in its simplest form. 

A local SCHEMA is created, and passed into the `schema` property, which in return renders the function.

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

<SplitTab>
  <ExampleVModel slot="example"/>
  <<< @/docs/.vuepress/components/ExampleVModel.vue
</splitTab>

<hr/>

### With Array Schema
Your schema can be built in two ways, the first way as showcased by other examples is to set up a wrapper object, in which each `property` of this object is the definition of each of the form's components.

```js
let schema = {
  nameOfMyComponent: { component: MyCoolComp, label: 'My label' },
  firstName: { component: FormText, label: 'First name' }
}
```

`SchemaForm` also allows you a second way of constructing your schema by setting it as an array of objects. The key difference to observe, other than the actual schema being an `array`, is that each of the elements inside the array must contain a `model` property that defines the name of the element, and also the name of the `key` of the data that is returned.

```js
let schema = [
  { model: 'nameOfMyComponent', component: MyCoolComp, label: 'My label' },
  { model: 'firstName', component: FormText, label: 'First name' }
]
```

<SplitTab>
  <ArrayExample slot="example" />
  <<< @/docs/.vuepress/components/ArrayExample.vue
</SplitTab>

<hr/>

### V-Model Example
`SchemaForm` can be used in conjunction with `v-model` to bind the results of the form with your state.

<SplitTab>
  <ExampleVModel slot="example" />
  <<< @/docs/.vuepress/components/ExampleVModel.vue
</SplitTab>

<hr/>

### Modal Example
This example showcases the `SchemaForm`s ability to handle a complex component in the schema. We add an `EmailModal` component to the schema, which displays a `<button>` in the form, when clicked, this button opens a modal with two input fields. 

As long as the component can handle the `value` injection from the `SchemaForm`, and fires an `input` event when the internal data changes, `SchemaForm` will be able to handle the change and append it to the form's data.

```html
<!-- EmailModal.vue  -->
<template>
  <div>
    <BaseButton class="baseButton" type="button" @click="modalShown = !modalShown">Email</BaseButton>

    <Modal v-if="modalShown">
      <p>Configure your email:</p>
      <FormText label="Title" v-model="values.title" />
      <FormText label="Content" v-model="values.content" />

      <BaseButton @click="save">Save</BaseButton>
      <BaseButton @click="modalShown = false">Cancel</BaseButton>
    </Modal>
  </div>
</template>

<script>
import FormText from './FormText';
import BaseButton from './BaseButton';
import Modal from './Modal';

export default {
  components: { Modal, BaseButton, FormText },
  props: {
    value: { required: true }
  },
  data() {
    return {
      modalShown: false,
      values: {...this.value}
    }
  },
  methods: {
    save() {
      this.$emit('input', {
        ...this.value,
        ...this.values
      });

      this.modalShown = false
    }
  }
}
</script>
```

<SplitTab>
  <ModalExample slot="example" />
  <<< @/docs/.vuepress/components/ModalExample.vue
</SplitTab>

<hr/>

### Nested SchemaForms
Similarly to the Nested Schema Modal example, you can also pass in a `SchemaForm` component directly to your schema, with a schema property of itself. 

Be aware that the data provided by the nested `SchemaForm` will also be nested in the output data.

<SplitTab>
  <Formception slot="example" />
  <<< @/docs/.vuepress/components/Formception.vue
</SplitTab>

<hr/>

### Schema Modal with Nested Example
`SchemaForm` can even be used in conjunction inside components as a sub-renderer. 

In this example, we have added a property `schema` to the `EmailModal`, if this property is set with a schema of itself, it will render additional input fields on our modal by making use of a nested `SchemaForm` component.

Notice in the `EmailModal.vue` example that we now render a sub instance of `<SchemaForm>` when the `schema` property is set. 

The actual schema in the example now includes a `schema` property for `EmailModal` that nests a schema of its own.

```html
<!-- EmailModal.vue -->
<template>
  <div>
    <BaseButton class="baseButton" type="button" @click="modalShown = !modalShown">Email</BaseButton>

    <Modal v-if="modalShown">
      <template v-if="!schema">
        <p>Configure your email:</p>
        <FormText label="Title" v-model="values.title" />
        <FormText label="Content" v-model="values.content" />
      </template>

      <template v-if="schema">
        <SchemaForm :schema="schema" v-model="values" />
      </template>

      <BaseButton @click="save">Save</BaseButton>
      <BaseButton @click="modalShown = false">Cancel</BaseButton>
    </Modal>
  </div>
</template>

<script>
import FormText from './FormText';
import BaseButton from './BaseButton';
import Modal from './Modal';

export default {
  components: { Modal, BaseButton, FormText },
  props: {
    value: { required: true },
    schema: { type: Object, required: false }
  },
  data() {
    return {
      modalShown: false,
      values: {...this.value}
    }
  },
  methods: {
    save() {
      this.$emit('input', {
        ...this.value,
        ...this.values
      });

      this.modalShown = false
    }
  }
}
</script>
```

<SplitTab>
  <SchemaModalExample slot="example" />
  <<< @/docs/.vuepress/components/SchemaModalExample.vue
</SplitTab>

<hr/>

### MultiElement

The `SchemaForm` can handle custom components that wrap two or more child inputs.
They must emit the `update-batch` event with an object payload that has the values for each of the inputs.

<SplitTab>
  <MultiElementExample slot="example" />
  <<< @/docs/.vuepress/components/MultiElementExample.vue
</SplitTab>

<hr/>

### Shared Config

The `SchemaForm` includes a prop `sharedConfig` that applies a configuration object to all the elements in the form. 

In the following example, the prop `readOnly` is being globally applied to all the child components in the form, the `FormText` component disables and changes the color of the background when `readOnly` is set to true internally.

<SplitTab>
  <SharedConfigExample slot="example" />
  <<< @/docs/.vuepress/components/SharedConfigExample.vue
</SplitTab>

<hr/>

### Schema Wizard
**FormVueLatte** ships also with a `SchemaWizard` object, which takes an `array` of schema objects, and a `step` property which is 0 based.

It will render the correct `SchemaForm` based on the current `step`, and is fully `v-model` ready.

It exposes a `default` slot that can be used to add control buttons for next and back, if necessary.

<SplitTab>
  <WizardExample slot="example" />
  <<< @/docs/.vuepress/components/WizardExample.vue
</SplitTab>