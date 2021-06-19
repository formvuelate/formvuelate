---
sidebarDepth: 3
---
# Getting Started

![FormVueLate logo](/formvuelate-logo.jpg)

FormVueLate is a zero dependency library that allows you to generate schema-driven forms with extreme ease.

The schema that you use for your form can be as flexible as you need it to be, it can be modified at run-time with an expected reactive result, and can even be fetched directly from you back-end’s API.

:::warning Important
FormVueLate is a bring-your-own-components library!

We do **not** provide any base components for you to build your forms. There are numerous component libraries out there that do a great job of providing carefully constructed components for you to use, and FormVueLate does a great job at allowing you to bring those external components to your forms, or even crafting your own.
:::

## Installation

To add FormVueLate to your project, start by installing the package through your favorite package manager.

```bash
yarn add formvuelate
// OR
npm install formvuelate
```

Now that you have the package in your project, `import` it to the component that will hold your form.

You can pick and choose which of the FormVueLate's components you will need. The following example imports all of them, plus the required composable `useSchemaForm`.

```javascript
import { SchemaForm, SchemaWizard, SchemaFormFactory, useSchemaForm } from 'formvuelate'
```

## Playground

Modify the Schema on the left to see FormVueLate's `SchemaForm` in action on the right. You can use the following demo input components:

- FormText
- FormSelect
- FormCheckbox

<iframe src="https://codesandbox.io/embed/fvl-playground-3x-ojbt9?autoresize=1&fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="FVL Playground"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
