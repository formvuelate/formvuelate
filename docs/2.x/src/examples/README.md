# Examples

Here you will find a few examples on how you can set up your `schema` and the output it would produce.

:::warning Important
We are using a few different example custom components to showcase, but you should use your own!
These components are **only** for demonstration purposes, and are **not** included with the library.
:::

## SchemaForm with v-model

This example showcases the simplest way to use `SchemaForm`.
It provides the component with a `schema` in the form of a JavaScript object, and binds the output of the form to the local data `userData` through `v-model`.

<iframe src="https://codesandbox.io/embed/fvl-v-model-ykmk1?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="FVL V-Model"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Nested schemas

`SchemaForm` is able to parse and display forms that are based on nested schemas. In the example below, you can see how the `work` property is an object that uses `SchemaForm` itself as a component, and provides a `schema` property of its own.

Further down the tree inside `details`, yet another level of nested data can be found.

<iframe src="https://codesandbox.io/embed/fvl-nested-schema-85r20?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="FVL Nested Schema"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Using an array based schema

`SchemaForm` allows you to construct the schema also as an array. The name of each field is declared as a `model` property in each element, instead of it being the `key` for each property of the object-type schema.

Additionally, notice that in this example `v-model` is not being used. We bind `modelValue` directly to the `userData`, and listen to the `update:modelValue` event to merge the changes from `SchemaForm` into our `userData` object.

Don't forget to check out the [documentation for Array schemas](/guide/schema-form.html#array-schemas)

<iframe src="https://codesandbox.io/embed/fvl-array-schema-bcsed?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="FVL Array Schema"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>

## Conditional computed schemas

In the following example we showcase how a computed property can be used to dynamically generate a schema. When switching the value from the select element from A to B, the related `input` also changes to reflect the current status of the schema and the form.

<iframe src="https://codesandbox.io/embed/fvl-conditional-schema-971tk?fontsize=14&hidenavigation=1&module=%2Fsrc%2FApp.vue&theme=dark"
     style="width:100%; height:500px; border:0; border-radius: 4px; overflow:hidden;"
     title="FVL Conditional Schema"
     allow="accelerometer; ambient-light-sensor; camera; encrypted-media; geolocation; gyroscope; hid; microphone; midi; payment; usb; vr; xr-spatial-tracking"
     sandbox="allow-forms allow-modals allow-popups allow-presentation allow-same-origin allow-scripts"
   ></iframe>
