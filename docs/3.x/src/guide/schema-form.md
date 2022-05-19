---
sidebarDepth: 3
---
# SchemaForm

The `SchemaForm` requires one `prop`, `schema`, which is the meta-data of your form. You must also import the `useSchemaForm` composable which we will use in our setup function to initialize the form's `model` where the user's data is kept.


```html
<template>
  <SchemaForm :schema="mySchema" />
</template>

<script>
import { ref } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'

export default {
  components: { SchemaForm },
  setup () {
    const formModel = ref({})
    useSchemaForm(formModel)

    const mySchema = ref({
      // Schema here
    })

    return {
      mySchema
    }
  }
}
</script>
```

`SchemaForm` will automatically update the state within your `formModel` when your components update.

### v-model <Badge text="2.x" type="warning" vertical="middle" />
Earlier versions of FormVueLate used `v-model` as the default way of keeping the two way binding with the form's state. This forced the whole form to re-render whenever any of the child inputs emitted a new value.

`v-model` is no longer supported, and will not update your form's model. Please use `useSchemaForm` instead.

## Props

### schema

The `SchemaForm` component requires you to pass it a `schema` property. This `schema` can be either an `object` or an `array`.

In its simplest form, the `schema` requires you to provide an object with a `modelName: value` pair for each of the form components you want to add to your form.

Let’s assume for this example that you have a component in your project called `FormText` which exposes an `<input>` tag with some CSS.

```html
<template>
  <SchemaForm :schema="schema" />
</template>

<script>
  import { SchemaForm, useSchemaForm } from 'formvuelate'
  import FormText from 'path/to/FormText'
  import { ref, markRaw } from 'vue'

  markRaw(FormText)

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
      useSchemaForm(formData)

      return {
        schema
      }
    }
  }
</script>
```

:::tip
In the above example, we use the component `FormText` that we imported as the value of the `component` property of each element.

You can use the name of the component as a `String` instead, for example `'FormText'`, but be aware that the component needs to either be imported globally.

If you need to declare your components locally, you can leverage the second parameter of the `SchemaFormFactory` component. Please refer to the [plugins](plugins/#using-locally-imported-components) documentation for more information on how to accomplish this.
:::

#### Array Schemas

For `array` based schemas, we need to provide an object for each element of the form, but instead of providing a `modelName: value` structure, we declare a `model` property inside of each object.

Here's the above example again using `array` format.

```html
<template>
  <SchemaForm :schema="schema" />
</template>

<script>
  import { SchemaForm, useSchemaForm } from 'formvuelate'
  import FormText from 'path/to/FormText'
  import { ref, markRaw } from 'vue'

  markRaw(FormText)

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
      useSchemaForm(formData)

      return {
        schema
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

<iframe src="https://codesandbox.io/embed/fvl-horizontal-form-3x-ldt0i?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="FVL Horizontal Form"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

### schemaRowClasses

If you ever require to add additional classes to each structural row in the generated form, you can use the `schemaRowClasses` property of the `SchemaForm` component to inject them.

These classes will be appended, and will _not_ substitute the `schema-row` class that FormVueLate already provides.

The `schemaRowClasses` prop accepts `[String, Object, Array]` as valid types, conforming to Vue's [class and style binding syntax](https://v3.vuejs.org/guide/class-and-style.html#binding-html-classes)

```html
<SchemaForm
  schemaRowClasses="my-custom-class-a my-custom-class-b"
  :schema="mySchema"
/>
```

Example output:

```html

<form>
  <div class="schema-row custom-class-a custom-class-b">
    [...]
  </div>
</form>

```
### unwrappedRows

For cases where you need your components to be rendered without FormVueLate's default `.schema-row` wrapping div, add the `unwrappedRow` boolean property to `SchemaForm`. This can be explicitly set to `true`, or with Vue's boolean shorthand as in the following example.

```html
<SchemaForm
  unwrappedRows
  :schema="mySchema"
/>
```

### preventModelCleanupOnSchemaChange

By default `SchemaForm` cleans up the value output of properties that are no longer present inside the schema every time the schema changes.

That means that if at runtime the schema deletes one of the elements inside of it, the output of the form's model bound by `useSchemaForm` will no longer contain the user's data if it was already present.

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

If at this point your schema changes, and deletes the `lastName` property, `SchemaForm` is smart enough to remove that from the output and update the form's model since that field is effectively _gone_.

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

### useCustomFormWrapper <Badge text="3.7.0" type="tip" vertical="middle" />

In some cases, specially when using component libraries, you may need to set a custom `form` tag for your form as a wrapper.

In these scenarios you can use the prop `useCustomFormWrapper` of SchemaForm to disable the automatic generation of a wrapping `form` tag. Be warned that this will also **remove** the `submit` event listener that FormVueLate usually adds. So you will have to make sure that either you, or the library are listening and reacting to it.

An basic example using `QForm` with Quasar would look like this:

```html
<q-form>
  <SchemaForm
    :schema="schema"
    useCustomFormWrapper
  />
</q-form>
```

## Handling submit

`SchemaForm` will automatically create a `<form>` wrapper for you on the top level `SchemaForm` in the case of single and multi dimensional schemas, and fire a `submit` event when the form is submitted.

This `submit` event will `preventDefault` so you can handle the submit on your end.

In order to react and listen to the `submit` events, simply add a `@submit` listener to the `SchemaForm` component in your template.

```html
<template>
  <SchemaForm
    @submit="onSubmit"
    :schema="mySchema"
  />
</template>
```

## Slots

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

## Component Requirements

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
