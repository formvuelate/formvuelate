---
sidebarDepth: 3
---
# Lookup Plugin

Whenever you find yourself working with a `schema` that has already been generated or created with a specific structure that does not comply to the requirements of `SchemaForm`, it becomes a necessary step to parse it to modify the structure.

In order to make this task easier, FormVueLate provides a core plugin called `@formvuelate/plugin-lookup`.

## Installation

To install the plugin, simply add it to your `package.json` via terminal.

```bash
yarn add @formvuelate/plugin-lookup

// OR

npm i @formvuelate/plugin-lookup
```

## Usage

To use the plugin, first import both the plugin itself, and the `SchemaFormFactory` to your application.

```js
import { SchemaFormFactory } from 'formvuelate'
import LookupPlugin from '@formvuelate/plugin-lookup'
```

Now that we have both imported, we can create our plugin-enabled `SchemaForm` component by using the `SchemaFormFactory`

```js
const SchemaFormWithPlugin = SchemaFormFactory([
  LookupPlugin({
    // plugin configuration here
  })
])
```

Now that we have created our new component, we can pass it to our instance's `components` object, and use it as we normally would in our template.

```html
<template>
  <div id="app">
    <SchemaFormWithPlugin
      :schema="mySchema"
    />
  </div>
</template>

<script>
export default {
  components: {
    SchemaFormWithPlugin
  },
  setup () {
    [...]
  }
}
</script>
```

## Configuration

`LookupPlugin` takes one parameter, an object, as it's source of configuration.
Let's look at the properties that we can use in this object.

### mapComponents

If your schema does not provide component names as your Vue application needs them, `mapComponents` is a property of the configuration object that can allow you to rename or remap these values with ease.

Consider the following example schema.

```json
{
  "firstName": {
    "component": "string",
    "label": "First name"
  },
   "favoriteThingAboutVue": {
    "component": "array",
    "label": "Favorite thing about Vue",
    "required": true,
    "options": [
      "Ease of use",
      "Documentation",
      "Community"
    ]
  },
}
```

In this case, the `component` definition is not `FormText`, or `FormSelect`, or whichever other components we may be using in our application. So we need to map them.

Let's add this mapping into our configuration object.

```js
LookupPlugin({
  mapComponents: {
    string: 'FormText',
    array: 'FormSelect'
  }
})
```

`LookupPlugin` will now look inside your schema and parse all the `component` definitions into their respective components. So `string` will become `FormText` and `array` will become a `FormSelect` component.

### mapProps

If your schema needs to parse additional props for your own component's needs, `mapProps` provides an easy way of parsing any property in your component's object definition to something else.

For example, in some cases the schema might define your `component` property with something else, let's use `type` in the following example:

```json
{
  "firstName": {
    "type": "FormText",
    "info": "First name"
  }
}
```

We need to map `type` into `component`, since that is the property that `SchemaForm` expects to find for the component to render into the form. [Read more about component requirements](#component-requirements)

```js
const SchemaFormWithPlugin = SchemaFormFactory([
  LookupPlugin({
    mapProps: {
      type: 'component'
    }
  })
])
```

If we also needed to map `info` to `label` because our component is expecting a `label` property and our schema defines it as `info`, by using `mapProps` in our configuration we can ask the plugin to do both at the same time.

```js
const SchemaFormWithPlugin = SchemaFormFactory([
  LookupPlugin({
    mapProps: {
      type: 'component',
      info: 'label'
    }
  })
])
```

Now our schema will correctly pass the `label` property into our `FormText` example component. The schema will also correctly reflect a `component` property with the value of `FormText`.

The `mapProps` property can also receive a function to handle advanced property parsing logic.

If a function is provided, the plugin will run the function before parsing each element to retrieve the mapping of properties. The function will inject the current element as the first parameter.

Consider the following schema and example.

```json
{
  "firstName": {
    "type": "FormText",
    "label": "First name",
    "important": true
  },
  "lastName": {
    "field": "FormText",
    "label": "Last name",
    "important": true
  }
}
```

The first field declares a `type` property that holds the component that it should render.

The second field declares a `field` property that holds the component that it should render.

In this case, we need more per-field control in how the properties are mapped.

```js
const SchemaFormWithPlugin = SchemaFormFactory([
  LookupPlugin({
    mapProps: (el) => {
      // This function will be called for each element in the schema
      // "el" is the current element being parsed

      // Map important to required only for the field with label 'First name'
      if (el.label === 'First name') {
        return {
          type: 'component',
          important: 'required'
        }
      }

      // For any other element
      return {
        field: 'component'
      }
    }
  })
])
```

#### Deleting specific properties

If you ever find yourself needing to delete a certain property from your schema, the `LookupPlugin`'s `mapProps` allows you to do it as well.

Consider the following schema:

```json
{
  "firstName": {
    "type": "FormText",
    "label": "First name",
    "important": true
  },
  "lastName": {
    "field": "FormText",
    "label": "Last name",
    "important": true
  }
}
```

If we needed to delete the `important` property from ALL components, we can use the object syntax by setting the property to the boolean `false`.

```js
LookupPlugin({
  mapProps: {
    important: false
  }
})
```

If we need more control, to only delete on certain conditions, the function syntax can also be used.

```js
LookupPlugin({
  mapProps: (el) => {
    if (el.label === 'First name') {
      // Delete the important prop from the elements with label 'First name'
      return {
        important: false
      }
    }

    // Ignore any other components
    return {}
  }
})
```

#### Preserving the original property <Badge text="2.1.0" type="tip" />

There may be some cases where you want to preserve the original property that is being mapped by `LookupPlugin`, since by default this original property is deleted from the object.

In these cases, you can set the `preserveMappedProps` property of the configuration object and `LookupPlugin` will no longer delete it from your schema.

:::warning
Properties that are being deleted by setting the property value to `false` will STILL be deleted.
:::

Consider the following example schema:

```js
{
  "firstName": {
    "type": "FormText",
    "label": "First name",
    "important": true
  },
  "lastName": {
    "field": "FormText",
    "label": "Last name",
    "important": true
  }
}
```

We now can apply our `preserveMappedProps` to keep the `type` property intact.

```js
LookupPlugin({
  mapProps: {
    type: 'component'
  },
  preserveMappedProps: true
})
```

The schema will now include both the mapped `component` property, plus the original `type`:

```js
{
  "firstName": {
    "type": "FormText",
    "component": "FormText",
    "label": "First name",
    "important": true
  },
  "lastName": {
    "field": "FormText",
    "component": "FormText",
    "label": "Last name",
    "important": true
  }
}
```

## Nested Schema Caveats

### lookupSubSchemas <Badge text="3.6.0" type="warning" vertical="middle" />
When dealing with schemas that have sub-schemas like the following:

```json
{
  "firstName": {
    "component": "string",
    "info": "First Name"
  },
  "work": {
    "component": "SchemaForm",
    "schema": {
      "address": {
        "type": "string",
        "label": "Work address"
      },
      "details": {
        "component": "SchemaForm",
        "schema": {
          "position": {
            "type": "string",
            "label": "Work email"
          }
        }
      }
    }
  }
}
```

We have to do a little extra work to allow the lookup plugin to remap the sub-schema `SchemaForm` components.

First, import the `lookupSubSchemas` composition function from the `plugin-lookup` package.

```js
import LookupPlugin, { lookupSubSchemas } from '@formvuelate/plugin-lookup'
```

Next, create your schema form with plugins as you normally would.

```js
const SchemaFormWithPlugins = SchemaFormFactory([
  LookupPlugin({
    mapComponents: {
      Text: BaseInput
    }
  })
])
```

Finally, in your setup function and _before_ the `useSchemaForm` call, call the `lookupSubSchemas` function that we just imported and pass in as a parameter the plugin-enhanced `SchemaForm` component returned by `SchemaFormFactory`.

```js
setup () {
  const model = ref({})

  lookupSubSchemas(SchemaFormWithPlugins)
  useSchemaForm(model)

  const schema = shallowRef(MY_SCHEMA)

  return {
    schema
  }
}
```
