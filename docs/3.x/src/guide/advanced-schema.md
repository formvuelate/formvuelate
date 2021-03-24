# Advanced Schema Concepts

## Conditionally displaying an element within the schema <Badge type="tip" text="3.1.0" vertical="middle" />

If you have a complex schema that requires displaying or hiding a particular element based on a condition dictated by your model, you can always create a `computed` schema which handles the logic for you.

Additionally, FormVueLate allows you to set a condition directly on the schema element like in the following example.

```js
const form = ref({
  type: "A"
});

useSchemaForm(form)

const schema = ref({
  type: {
    component: FormSelect,
    label: "Schema A or B?",
    options: ["A", "B"],
  },
  aField: {
    component: FormText,
    label: "A field",
    condition: model => model.type === 'A'
  },
  bField: {
    component: FormText,
    label: 'B field',
    condition(model) {
      return model.type === 'B'
    }
  }
})
```

Notice that the `condition` property of the `aField` and `bField` holds a function - showcased in both arrow and function keyword syntax.

This function will receive an unwrapped (no need to use `.value`) reference to your form's model, and should return a `Boolean` value.

If the condition returns `true`, the field will appear in the form, if the condition returns `false`, it will not.

## markRaw

You will notice that on our examples we use `markRaw(MyImportedComponent)
` whenever we import a component that is going to be used directly in a reactive schema.

When making a `schema` reactive by either using `ref` or `computed` and setting the components inside directly as the import as in the following example, we are technically also making the component itself reactive.

```js
import MyComponent from 'components/MyComponent.vue'

[...]
const schema = ref({
  name: {
    component: MyComponent
  }
})
[...]
```

Vue will throw a warning in these cases letting you know that making a component reactive is not something you want to do. It will also hint that you can use either `shallowRef` or `markRaw` to address the problem.

We will not go into detail of what these do, because the [Vue 3 documentation](https://v3.vuejs.org/api/basic-reactivity.html#markraw) already covers it in more detail - but we have opted to show the `markRaw` solution because when creating a `computed` schema, which can not also be a `shallowRef`, marking your components with `markRaw` gets the job done without much further thought.

The previous example then, should be enhanced like so.

```js
import { ref, markRaw } from 'vue'
import MyComponent from 'components/MyComponent.vue'

markRaw(MyComponent)

[...]
const schema = ref({
  name: {
    component: MyComponent
  }
})
[...]
```

:::tip
`markRaw` is not needed when working with `String` format for component names in the schema, since FormVueLate leverages `:is` from Vue's component behind the scenes. Read more about [using locally imported components](/guide/plugins.html#using-locally-imported-components)
:::
