# FormVueLatte 2.x

Visit [FormVueLatte 2.0's full documentation](https://formvuelatte-next.netlify.app/#getting-started) for more detailed information and examples.

## Getting Started

FormVueLatte is a zero dependency library that allows you to generate schema-driven forms with extreme ease.

The schema that you use for your form can be as flexible as you need it to be, it can be modified at run-time with an expected reactive result, and can even be fetched directly from you backend’s API.

**Important**

`FormVueLatte` is a bring-your-own-components (BYOC) library!

We do _not_ provide any base components for your to build your forms. There are numerous component libraries out there that do a great job of providing carefully constructed components for you to use, and `FormVueLatte` does a great job at allowing you to bring those external components to your forms, or even crafting your own.

### Installation

To add FormVueLatte to your project, start by installing the package through your favorite package manager.

```bash
yarn add formvuelatte
// OR
npm install formvuelatte
```

Now that you have the package in your project, `import` it to your component.

```javascript
import { SchemaForm } from 'formvuelatte'
```

The `SchemaForm` requires two `props`. The first is the `schema`, which is the meta-data of your form. The second one is `value`, which will hold the state of the form.

```html
<SchemaForm :schema="mySchema" :value="formData" />
```

The `SchemaForm` will `$emit` **update:modelValue** events when your components update. This means that you are able to either:

- use `v-model` on it
- or, manually capture the `@update:modelValue` event with a method of your own while injecting the `:value` property.

Example with `v-model`:

```javascript
<template>
  <SchemaForm :schema="mySchema" v-model="formData" />
</template>

<script>
import { reactive } from 'vue'
export default {
  setup() {
    const formData = reactive({})
    const mySchema = reactive({
      // some schema here
    })

    return {
      formData,
      mySchema
    }
  }
}}
</script>
```

Example with manual bindings:

```javascript
<template>
  <SchemaForm
    :schema="mySchema"
    :data="formData"
    @update:modelValue="updateForm"
  />
</template>

<script>
import { reactive } from 'vue'
export default {
  setup() {
    const formData = reactive({})
    const mySchema = reactive({
      // some schema here
    })

    const updateForm = form => {
      formData = form
    }

    return {
      formData,
      mySchema,
      updateForm
    }
  }
}}
</script>
```

## Official plugins

#### [Vuelidate Plugin](https://github.com/vuelidate/formvuelatte-plugin-vuelidate)
Easily incorporate Vuelidate powered validations into your forms.

#### [Lookup Plugin](https://github.com/vuelidate/formvuelatte-plugin-lookup)
A mapping and replacement plugin to parse complex schemas into FormVueLatte ready structure.


## Core team

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/marina-mosti">
        <img src="https://avatars2.githubusercontent.com/u/14843771?s=460&u=1d11d62c22d38c01d73e6c92587bd567f4e51d27&v=4" width="120px;" alt="Marina Mosti"/>
        <br />
        <sub><b>Marina Mosti</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/shentao">
        <img src="https://avatars3.githubusercontent.com/u/3737591?s=460&u=6ef86c71bbbb74efae3c6224390ce9a8cba82272&v=4" width="120px;" alt="Damian Dulisz"/>
        <br />
        <sub><b>Damian Dulisz</b></sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/tzhelyazkova">
        <img src="https://avatars0.githubusercontent.com/u/24877689?s=460&u=3800bb7ec37a732fa56d47f097f8d2eaf2518f57&v=4" width="120px;" alt="Tonina Zhelyazkova"/>
        <br />
        <sub><b>Tonina Zhelyazkova</b></sub>
      </a>
    </td>
  </tr>
</table>
