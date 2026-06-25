# @formvuelate/plugin-json-schema

A [FormVueLate](https://formvuelate.js.org) plugin that converts a **JSON Schema**
(draft-07 / 2020-12) into a FormVueLate schema, including repeatable **array** fields.

## Install

```bash
npm install @formvuelate/plugin-json-schema
# or
pnpm add @formvuelate/plugin-json-schema
```

## Usage

Pass your input components to `SchemaFormFactory` and the JSON Schema via the
`json-schema` prop:

```js
import { SchemaFormFactory } from 'formvuelate'
import JsonSchemaPlugin from '@formvuelate/plugin-json-schema'

const SchemaForm = SchemaFormFactory([JsonSchemaPlugin()], {
  FvlString,
  FvlNumber,
  FvlBoolean,
  FvlEnum
})
```

```vue
<template>
  <SchemaForm :json-schema="jsonSchema" />
</template>

<script setup>
import { ref } from 'vue'
import { useSchemaForm } from 'formvuelate'

const model = ref({})
useSchemaForm(model)

const jsonSchema = {
  type: 'object',
  required: ['name'],
  properties: {
    name: { type: 'string', title: 'Name' },
    age: { type: 'integer', minimum: 0 },
    newsletter: { type: 'boolean', title: 'Subscribe' },
    role: { type: 'string', enum: ['admin', 'user'] },
    address: {
      type: 'object',
      properties: { street: { type: 'string' }, city: { type: 'string' } }
    },
    tags: { type: 'array', items: { type: 'string' }, minItems: 1 }
  }
}
</script>
```

## Type mapping

| JSON Schema | Default component | Notes |
| --- | --- | --- |
| `object` | nested `SchemaForm` | recursively converted |
| `string` | `FvlString` | `format` adds a native input `type` (email, date, …) |
| `number` / `integer` | `FvlNumber` | `integer` adds `step: 1`; `minimum`/`maximum` → `min`/`max` |
| `boolean` | `FvlBoolean` | |
| `enum` / `oneOf` const | `FvlEnum` | `options: [{ value, label }]` (uses `enumNames`/`title`) |
| `array` | `ArrayField` (shipped) | repeatable entries of primitives or objects |

## Options

```js
JsonSchemaPlugin({
  components: { string: 'MyInput' },            // override per type / 'object' / 'array'
  mapComponent: (node, ctx) => 'X',             // takes precedence; falsy = fall back
  formatComponents: { email: 'MyEmailInput' },  // pick a component by `format`
  propNames: { hint: 'description' },           // rename emitted prop keys
  includeValidations: true,                      // attach `validations` (default true)
  messages: { required: '{label} is required' } // override validation messages
})
```

## Validation

Constraints (`required`, `minLength`/`maxLength`, `minimum`/`maximum`, `pattern`,
`format`, `enum`, `minItems`/`maxItems`) are translated into a per-field
`validations` function. Add the [vee-validate plugin](https://www.npmjs.com/package/@formvuelate/plugin-vee-validate)
**after** this one to consume them:

```js
SchemaFormFactory([JsonSchemaPlugin(), VeeValidatePlugin()], components)
```

## Composition with the lookup plugin

Default component names are abstract strings, so they also compose with
`@formvuelate/plugin-lookup`:

```js
SchemaFormFactory([
  JsonSchemaPlugin(),
  LookupPlugin({ mapComponents: { FvlString: 'BaseInput' } })
])
```

## Limitations

- `$ref`, `allOf` / `anyOf` / non-const `oneOf`, and multi-type `type` arrays are
  not resolved in this version (they warn and fall back to a string field).
- Per-entry vee-validate validation inside the array repeater is array-level only.

## License

MIT
