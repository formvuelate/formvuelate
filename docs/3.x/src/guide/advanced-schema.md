# Advanced Schema Concepts

## Setting default values at Schema level <Badge type="tip" text="3.5.0" vertical="middle" />

Sometimes we want our schema to be the one responsible for setting a default value to a field instead of setting it ourselves through `useSchemaForm`. A good example would be if the schema is getting pre-populated with values on our backend, and we don't want to manually loop it to generate the form model.

FormVueLate will look for a property called `default` in our schema, and use the value inside of it to populate the form's model whenever the top level SchemaForm component is rendered. An example schema would be:

```js
const form = ref({});
useSchemaForm(form)

const schema = ref({
  firstName: {
    component: FormText,
    label: 'First Name',
    default: 'Darth'
  },
  lastName: {
    component: FormText,
    label: 'Last Name',
    default: 'Vader'
  },
  contact: {
    component: SchemaForm,
    schema: {
      email: {
        component: FormText,
        label: 'Email',
        default: 'darth@deathstarmail.com'
      },
      address: {
        FormText,
        label: 'Address'
      }
    }
  }
})
```

We can expect our `formModel` to initially be populated with the exception of the `address` field, which doesn't set a `default` as follows.

```js
{
  firstName: 'Darth',
  lastName: 'Vader',
  contact: {
    email: 'darth@deathstarmail.com'
  }
}
```

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

Please note that the `model` received in the condition function is a current copy of the model provided by you by the `useSchemaForm` composable function. When using `condition` on deeply nested schemas the whole tree may not be readily available when created unless specifically pre-defined by you on the `useSchemaForm` model.

If you need to check a deeply nested model property, such as a model that looks like the following:

```json
{
  first: {
    second: {
      third: {
        myField: ''
      }
    }
  }
}
```

You can either predefine your model to contain these nested properties/objects, or use conditional checking to avoid an error.

```js
condition: model => model.first?.second?.third?.myField === 'something'
```

Alternatively, use an external library solution like [Lodash's get](https://lodash.com/docs/4.17.15#get) to make sure the model path is defined. The second value provided here as `false` will be the default in case it isn't.

```js
condition: model => _.get(model, 'first.second.third.myField', false) === 'something'
```

If the condition returns `true`, the field will appear in the form, if the condition returns `false`, it will not.

**Important:**

The `condition` property will _remove_ the related property from the model when the condition becomes invalid, even if there was a previous value entered into it.

This mimics the behavior that FormVueLate already applies to schema changes, where when a schema change removes a field the value and property is also removed from the model.

For example, in our previous example schema:

```js
const form = ref({
  type: "A",
  aField: 'default a',
  bField: 'default b'
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

The form model includes two default values as starting values for `aField` and `bField`. When FormVueLate triggers the `condition` for `bField` where `model.type === 'B'` it will be `false`, so the the model will be updated with the removal of the `bField` property.

```js
{
  type: "A",
  aField: 'default a'
}
```

To remove this behavior and allow the form model to remain intact even when a conditional schema field is invalid, use the [`preventModelCleanupOnSchemaChange` property](#preventmodelcleanuponschemachange) on the parent `SchemaForm` component.

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

## Updating the form's model directly <Badge type="tip" text="3.8.0" vertical="middle" />

There are some rare cases in which you will need a component to update the form's model directly, for example, a complex component that handles several v-model bindings and outputs.

A simple approach would be to make use of Vue's provide/inject mechanism to give access to the component to the form's model, however exposing the whole model may leave it open to bugs and hard to track problems.

For these cases FormVueLate exposes an `updateFormModel` function directly from the `useSchemaForm` composable.

```js
const { model, updateFormModel } = useSchemaForm({
  name: '',
  email: '',
  nested: {
    phone: ''
  }
})
```

The model returned by `useSchemaForm`, or provided by you as a ref on the first argument for this same composable, can be directly modified as it is a Vue ref under the hood.

```js
model.value.name = 'My name'
```

For better control and future proofing, we recommend using the exposed `updateFormModel` function instead.

```js
// The first param is the name of the model to update, in this case "name"
updateFormModel('name', 'My name')
console.log(model.value.name) // outputs My name

// We can also use . notation for nested values
updateFormModel('nested.phone', '555-555-555')
console.log(model.value.nested.phone) // outputs 555-555-555
```

