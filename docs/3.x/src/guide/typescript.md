---
sidebarDepth: 3
---

# TypeScript Support <Badge text="3.3" type="warning" vertical="middle" />

FormVueLate has typescript support for its public API. This page is an overview of the level of TypeScript support.

## Component Types

Both `SchemaForm` and `SchemaWizard` have their properties and slots typed, to benefit from this you should use [volar](https://github.com/johnsoncodehk/volar) to enable template TypeScript support for components.

Furthermore the returned component created by `SchemaFormFactory` is also typed and will provide feedback if you pass incorrect type to any of its props.

In addition to component types, FormVueLate also exposes other types you can use in your project to provide type safety.

For example, to create typed compatible schemas we can use `FormArraySchema` and `FormObjectSchema` as follows:

```ts
import { SchemaForm, SchemaFormFactory, FormArraySchema } from "formvuelate";

export default defineComponent({
  name: "App",
  components: {
    SchemaForm
  },
  setup() {
    const arraySchema = ref<FormArraySchema>([
      {
        component: FormText,
        model: 'firstName'
      },
      {
        model: 'lastName',
        component: FormText
      }
    ])

    const objectSchema = ref<FormObjectSchema>({
      firstName: {
        component: FormText
      },
      lastName: {
        component: FormText
      },
    })

    return {
      schema
    }
  }
})
```

## Plugin API Types

FormVueLate also exposes the `PluginFunction` type to make it easier for you to create compatible plugins:

```ts
import { SchemaFormFactory, PluginFunction } from 'formvuelate';

const pluginThatAddsSomethingCool: PluginFunction = function(baseReturns) {
  return {
    ...baseReturns,
    somethingCool: true
  }
}

const cumulativeExample = SchemaFormFactory([
  pluginThatAddsSomethingCool
])
```
