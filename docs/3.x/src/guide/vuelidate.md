---
sidebarDepth: 3
---
# Vuelidate Plugin

:::warning
Vuelidate is still in testing in pre-release state.
:::

In order to seamlessly validate `FormVueLatte` by using `Vuelidate`, we provide a `VuelidatePlugin` that will allow you to easily accomplish this.

## Installation

Add the plugin and Vuelidate to your project's package.

```bash
npm i @vuelidate/core @vuelidate/validators @formvuelate/plugin-vuelidate

OR

yarn add @vuelidate/core @vuelidate/validators @formvuelate/plugin-vuelidate
```

## Setting up the validations in the schema

Your schema will need some changes in order to work with the `VuelidatePlugin`. Each element in your schema will need to contain a `validations` property which is an object, with each of the validations that you want to apply to it.

```javascript
import { required, email } from '@vuelidate/validators'
import useVuelidate from '@vuelidate/core'
import { ref } from 'vue'

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

Now that we have the component ready, we can jump into the `setup` function, where we need to get our `v-model` data ready, as well as setting up Vuelidate on our component.

```javascript
setup (props, context) {
  const userData = ref({
    firstName: 'John',
    lastName: '',
    email: ''
  })

  const $v = useVuelidate()

  return {
    schema: ref(SCHEMA),
    userData,
    updateValidations
  }
}
```

Finally, we can go to our template and set up both the `userData` and the `schema` bindings.

```html
<template>
  <SchemaFormWithValidations
    :schema="schema"
    v-model="userData"
  />
</template>
```
