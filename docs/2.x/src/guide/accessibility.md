# Accessibility

Due to the bring-you-own-components nature of FormVueLate, the library itself does not handle accessibility internally for input elements. However, we realize how important it is to provide accessible forms to our users.

We provide some tools for you to build your components in an accessible way.

## Unique ID

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
