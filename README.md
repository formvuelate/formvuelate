# FormVueLatte

For the full guide with examples, visit [https://formvuelatte.netlify.com](https://formvuelatte.netlify.com)

## ⚠️ WORK IN PROGRESS. DO NOT USE ⚠

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