# FormVueLate

![FormVueLate Logo](https://raw.githubusercontent.com/formvuelate/formvuelate/main/docs/4.x/public/formvuelate-logo.jpg)

[![FormVueLate NPM](https://img.shields.io/npm/v/formvuelate?color=42b883)](https://www.npmjs.com/package/formvuelate)
[![codecov](https://codecov.io/gh/formvuelate/formvuelate/branch/main/graph/badge.svg?token=iWOPoK4CRg)](https://codecov.io/gh/formvuelate/formvuelate)
[![Buy us a tree](https://img.shields.io/badge/Treeware-%F0%9F%8C%B3-lightgreen)](https://plant.treeware.earth/formvuelate/formvuelate)

Visit the [FormVueLate documentation](https://formvuelate.js.org/) for the full guide, examples, and plugin docs.

## Getting Started

FormVueLate is a zero-dependency library that generates schema-driven forms for Vue 3.

The schema can be as flexible as you need — modify it at runtime with an expected reactive result, or even fetch it from your backend's API.

**Important — bring your own components.** FormVueLate is not a UI component library. There are plenty of great component libraries out there; FormVueLate's job is to drive *which* components render and how their state flows. Bring your own, your team's, or any third-party library you like.

## Installation

```bash
pnpm add formvuelate
# or
npm install formvuelate
# or
yarn add formvuelate
```

Requires Vue `^3.4.0`.

## Using SchemaForm

```vue
<template>
  <SchemaForm :schema="mySchema" />
</template>

<script setup>
import { SchemaForm, useSchemaForm } from 'formvuelate'

const { formModel } = useSchemaForm({})

const mySchema = {
  // your schema
}
</script>
```

`SchemaForm` writes user input into `formModel.value` reactively — no `v-model` required.

## Official plugins

- **`@formvuelate/plugin-lookup`** — mapping and replacement plugin to parse complex schemas into FormVueLate-ready structure.
- **`@formvuelate/plugin-vee-validate`** — vee-validate (v4) integration for declarative form validation.

## Older versions (2.x and 3.x)

FormVueLate 2.x and 3.x are **no longer maintained**. The project was archived between 2022 and the 4.x revival, and the code that powered those releases is significantly out of date with the current Vue 3 ecosystem.

If you need access to the old code:

- 3.x history lives behind the `v3.9.1` git tag
- 2.x history lives behind the `v2.x` series of git tags

Everyone else should use **4.x**.

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
  </tr>
</table>

## Emeriti

Special thanks to these folks which have provided invaluable contributions to the project.
<ul>
  <li><a href="https://github.com/logaretm">Abdelrahman Awad</a></li>
  <li><a href="https://github.com/shentao">Damian Dulisz</a></li>
</ul>

## License and Support

This package is [Treeware](https://treeware.earth). If you use it in production, then we ask that you [**buy the world a tree**](https://plant.treeware.earth/formvuelate/formvuelate) to thank us for our work. By contributing to the Treeware forest you'll be creating employment for local families and restoring wildlife habitats.

If you want to use paypal, you can make any donations to [Marina's Paypal account](https://www.paypal.com/paypalme/mostimarina). All donations received here will go directly into buying more trees as well!
