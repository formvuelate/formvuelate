# Migrating from FormVueLate 2.x

FormVueLate 3.x redefined the way that two key parts of the library behaved. The system that allowed the component tree to notify the parent component of a change in the model (previously `v-model`), and the way that FormVueLate internally managed the injection of schemas for nested schemas.

Thankfully the latter, the internal management of nested schemas and the injected schema did not cause any breaking changes, and should be transparent to you as the user.

## Goodbye `v-model`

One of the biggest issues with using `v-model` in previous version of FormVueLate was that updating either the schema or the `v-model` binding for any of the components in the form caused a silent re-render of all the components in the form.

While this was not very noticeable in smaller forms like logins and registrations, it was definitely not performing well in larger more complex dynamic forms such as form builders, or deeply nested schemas.

The new model system leverages internally the power of Vue 3's provide/inject of reactive objects, which allows us to directly target and update specifically a part of the model without having to break the model's pointer and trigger a full re-render.

## How to update? (TLDR)

Once you update your package.json with formvuelate 3.0, follow these steps:

1. Remove the `v-model` binding from your `SchemaForm` or `SchemaWizard` component.

```html
<SchemaForm :schema="mySchema" v-model="myForm" />

// Becomes

<SchemaForm :schema="mySchema" />
```

2. Import `useSchemaForm` from the FormVueLate package into your file

```javascript
import { SchemaForm, useSchemaForm } from 'formvuelate'
```

3. Add a `setup` function to your component if you don't already have it, and wrap your form's model (the object that store's your user's information when they're filling out the form) into the `useSchemaForm` function.

```javascript
import { SchemaForm, useSchemaForm } from 'formvuelate'
import { ref } form 'vue'

export default {
  setup () {
    const userData = ref({
      firstName: '',
      lastName: ''
    })

    useSchemaForm(userData)

    return {
      userData
    }
  }
}
```

You're done! 🎉
