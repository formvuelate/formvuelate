# Writing your own plugins

Not all schemas are created equal, and every project has unique needs - FormVueLate provides an excellent way of addressing niche needs and any project's uniqueness through its plugin system.

Writing plugins is very straightforward, `SchemaFormFactory` expects an array of functions - so each plugin added to `SchemaFormFactory` is a function that will be executed in the order it was received by it.

```js
const myPlugin = function () {
  // Plugin code goes here
}

const SchemaFormWithCustomPlugin = SchemaFormFactory([
  myPlugin
])
```

Every function, or plugin, that `SchemaFormFactory` received will get injected, as the first parameter, the __returned object__ from the `setup()` function from `SchemaForm` plus any other previous plugins.

It's important to keep in mind this last bit, plugins are cumulative! So every plugin will receive the returned object from the last called plugin, or the base one from `SchemaForm` if its the first.

Having said that, every plugin must also return this same object, with whatever modifications it is making to the setup returns.

```js
const pluginThatAddsSomethingCool = function(baseReturns) {
  return {
    ...baseReturns,
    somethingCool: true
  }
}

const cumulativeExample = SchemaFormFactory([
  pluginThatAddsSomethingCool
])
```

A notable property that you may want to keep in mind that `SchemaForm` will provide to the factory is the `parsedSchema`. This `parsedSchema` is an already parsed (redundant, but necessary to clarify) schema in the format that FormVueLate understands it.

Plugins will _usually_ want to modify these `baseReturns` in some way or another.

Make sure that you preserve reactivity on the parsed schema, usually by returning a newly created `computed` property with your modified schema wrapped in it.

```js
import { computed } from 'Vue'

const someOtherPlugin = function(baseReturns) {
  const { parsedSchema } = baseReturns
  const modifiedSchema = doSomethingToParsedSchema(parsedSchema.value)

  return {
    ...baseReturns,
    parsedSchema: computed(() => modifiedSchema)
  }
}

const cumulativeExample = SchemaFormFactory([
  pluginThatAddsSomethingCool
])
```
