
[Vuelidate Plugin's Repo](https://github.com/vuelidate/formvuelatte-plugin-vuelidate)

In order to seamlessly validate `FormVueLatte` by using `Vuelidate`, we provide a `VuelidatePlugin` that will allow you to easily accomplish this.

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

Next, create your new `SchemaForm` by using the `SchemaFormFactory` to inject the `VuelidatePlugin`.

```javascript
import { SchemaFormFactory } from 'formvuelatte'
import useVuelidate from '@vuelidate'
import VuelidatePlugin from '@formvuelatte/plugin-vuelidate'

const SchemaFormWithPlugins = SchemaFormFactory([
  VuelidatePlugin(useVuelidate)
])
```

Now that we have the component ready, we can jump into the `setup` function, where we need to get our `v-model` data ready, as well as a function to handle the `update:validations` event that our Vuelidate-powered `SchemaFormWithPlugins` will `emit`.

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

Finally, we can go to our template and set up both the `userData` binding and the listener for our `update:validations` event.

```html
<template>
  <SchemaFormWithValidations
    :schema="schema"
    v-model="userData"
    @update:validations="updateValidations"
  />
</template>
```