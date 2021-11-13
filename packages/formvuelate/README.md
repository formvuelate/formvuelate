# FormVueLate

![FormVueLate Logo](https://raw.githubusercontent.com/formvuelate/formvuelate/main/docs/3.x/src/.vuepress/public/formvuelate-logo.jpg)

[![FormVueLate NPM](https://img.shields.io/npm/v/formvuelate?color=42b883)](https://www.npmjs.com/package/formvuelate)
[![codecov](https://codecov.io/gh/formvuelate/formvuelate/branch/main/graph/badge.svg?token=iWOPoK4CRg)](https://codecov.io/gh/formvuelate/formvuelate)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/formvuelate/formvuelate)

Visit [FormVueLate 3.0's full documentation](https://formvuelate.js.org/#getting-started) for more detailed information and examples.

## Getting Started

FormVueLate is a zero dependency library that allows you to generate schema-driven forms with extreme ease.

The schema that you use for your form can be as flexible as you need it to be, it can be modified at run-time with an expected reactive result, and can even be fetched directly from you backend’s API.

**Important**

FormVueLate is a bring-your-own-components library!

We do _not_ provide any base components for your to build your forms. There are numerous component libraries out there that do a great job of providing carefully constructed components for you to use, and FormVueLate does a great job at allowing you to bring those external components to your forms, or even crafting your own.

## Installation

To add FormVueLate to your project, start by installing the package through your favorite package manager.

```bash
yarn add formvuelate
// OR
npm install formvuelate
```

## Using the SchemaForm component

Now that you have the package in your project, `import` it to your component.

```javascript
import { SchemaForm, useSchemaForm } from 'formvuelate'
```

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

## Official plugins
#### Lookup Plugin
A mapping and replacement plugin to parse complex schemas into FormVueLate ready structure.

#### Vee-Validate Plugin
Easily incporate Vee-Validate powered validations into your forms.
#### Vuelidate Plugin WIP
Easily incorporate Vuelidate powered validations into your forms.

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
      <a href="https://github.com/logaretm">
        <img src="https://avatars.githubusercontent.com/u/6261322?v=4" width="120px;" alt="Abdelrahman Awad"/>
        <br />
        <sub><b>Abdelrahman Awad</b></sub>
      </a>
    </td>
  </tr>
</table>

## Emeriti

Special thanks to these folks which have provided invaluable contributions to the project.
<ul>
  <li><a href="https://github.com/shentao">Damian Dulisz</a></li>
</ul>

## Licence

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/formvuelate/formvuelate) to thank us for our work. By contributing to the Treeware forest you’ll be creating employment for local families and restoring wildlife habitats.
