---
sidebarDepth: 3
---
# SchemaArray

Sometimes a form isn't just a flat list of fields. You need a list of _things_, like a handful of team members, a few phone numbers, or the line items on an invoice, and you don't know up front how many there will be. The person filling it out might add five, or none at all.

That's exactly what `SchemaArray` is for. It's a core FormVueLate component that lets you declare a **repeatable** piece of your form right inside your schema, and it keeps the value in your model as a real array.

And like the rest of FormVueLate, `SchemaArray` doesn't care how anything looks. It ships no buttons, no wrappers, not a single pixel of markup of its own. You bring the components, you bring the layout, and `SchemaArray` quietly handles the bookkeeping: adding rows, removing them, and keeping every row wired to the right slice of your model.

## The idea

You declare `SchemaArray` like any other field. Give it a `component` of `SchemaArray`, and describe a single row with `items`:

```js
import { SchemaArray } from 'formvuelate'

const schema = {
  friends: {
    component: SchemaArray,
    items: {
      name: { component: TextInput, label: 'Name' },
      age: { component: NumberInput, label: 'Age' }
    }
  }
}
```

Because it lives in your schema, you can put it wherever you need it (at the top, in the middle, or tucked inside another section), and it works with dynamic, computed schemas too. There's no special template wiring to remember.

::: warning
The input components in these examples (`TextInput`, `NumberInput`, etc.) are only here to illustrate the idea. They are **not** part of FormVueLate. Bring your own.
:::

## Two kinds of rows

`items` describes one row, and its shape decides what kind of array you get.

### A group (array of objects)

When `items` is an object of fields, each row is a little form of its own, and every entry in your array is an object:

```js
friends: {
  component: SchemaArray,
  items: {
    name: { component: TextInput, label: 'Name' },
    age: { component: NumberInput, label: 'Age' }
  }
}
```

```js
// formModel
{ friends: [{ name: 'Ada', age: 36 }, { name: 'Grace', age: 45 }] }
```

### A scalar (array of primitives)

When `items` is a single field, meaning it has its own `component`, each row is one input, and your array holds plain values:

```js
tags: {
  component: SchemaArray,
  items: { component: TextInput, label: 'Tag' }
}
```

```js
// formModel
{ tags: ['vue', 'forms'] }
```

## Adding and removing rows

Here's the part that makes `SchemaArray` a little different from what you might expect: it will not render an "Add" button for you. It has no opinion about what your buttons should look like, and it's not going to guess.

Instead, you hand it your own control components, and they tell `SchemaArray` what to do by **emitting** an event. You get two props for this:

- `after`: rendered after each row. This is where your "Remove" button goes (and reorder controls, if you want them). It emits `remove` and `move`.
- `append`: rendered once, after the whole list. This is where your "Add" button goes. It emits `add`.

Your components are just plain components. They emit, `SchemaArray` listens and does the actual work:

```vue
<!-- RemoveButton.vue -->
<template>
  <button type="button" :disabled="canRemove === false" @click="$emit('remove')">
    Remove
  </button>
</template>

<script setup>
defineProps(['index', 'count', 'canRemove'])
defineEmits(['remove', 'move'])
</script>
```

```vue
<!-- AddButton.vue -->
<template>
  <button type="button" :disabled="canAdd === false" @click="$emit('add')">
    Add another
  </button>
</template>

<script setup>
defineProps(['count', 'canAdd'])
defineEmits(['add'])
</script>
```

Then you wire them up in the schema:

```js
import { SchemaArray } from 'formvuelate'
import RemoveButton from './RemoveButton.vue'
import AddButton from './AddButton.vue'

const schema = {
  friends: {
    component: SchemaArray,
    items: {
      name: { component: TextInput, label: 'Name' },
      age: { component: NumberInput, label: 'Age' }
    },
    after: RemoveButton,
    append: AddButton
  }
}
```

And that's the whole dance. Click your Add button and a fresh row appears. Click a Remove button and that row disappears, while every other row keeps its own value.

:::tip Why is "Add" a separate prop?
You might wonder why the Add button lives in `append` instead of next to each row. It comes down to the empty case: when your array has zero rows, there are no rows to render an Add button _after_. `append` always renders, so there's always a way to add that first entry.
:::

If you leave both props off, `SchemaArray` simply renders the rows with no controls at all, which is a perfectly good read-only list.

### What your control components receive

So you can build smarter controls, `SchemaArray` passes a bit of context down as props:

- `after` gets `index` (the row's position), `count` (how many rows there are), and `canRemove`. Emit `remove` to remove that row, or `move` with a direction (`-1` to move up, `1` to move down) to reorder it.
- `append` gets `count` and `canAdd`. Emit `add` to append a new row.

`canAdd` and `canRemove` come straight from the `min` and `max` you set, so you can disable a button instead of letting someone break the rules.

## Limiting how many rows

Set `min` and/or `max` to keep the list within bounds:

```js
friends: {
  component: SchemaArray,
  items: { /* ... */ },
  after: RemoveButton,
  append: AddButton,
  min: 1,
  max: 5
}
```

`SchemaArray` won't add past `max` or remove below `min`, and it surfaces that state as `canAdd` / `canRemove` on your control components. And if the model starts out with fewer rows than `min`, `SchemaArray` seeds blank ones for you, so the form is valid from the very first render.

## Nesting arrays

An array row can contain another array. It's schema all the way down. Here's a list of teams, each with its own list of members:

```js
const schema = {
  teams: {
    component: SchemaArray,
    items: {
      name: { component: TextInput, label: 'Team name' },
      members: {
        component: SchemaArray,
        items: { component: TextInput, label: 'Member' },
        after: RemoveButton,
        append: AddButton
      }
    },
    after: RemoveButton,
    append: AddButton
  }
}
```

```js
// formModel
{ teams: [{ name: 'Core', members: ['Ada', 'Grace'] }] }
```

## Putting it all together

Here's an array sitting comfortably in the middle of an otherwise ordinary form:

```vue
<template>
  <SchemaForm :schema="schema" />
</template>

<script setup>
import { SchemaForm, SchemaArray, useSchemaForm } from 'formvuelate'
import TextInput from './TextInput.vue'
import AddButton from './AddButton.vue'
import RemoveButton from './RemoveButton.vue'

const { formModel } = useSchemaForm({
  title: '',
  friends: [{ name: 'Ada', role: 'Engineer' }],
  tags: ['vue']
})

const schema = {
  title: { component: TextInput, label: 'Title' },

  // a group array, where each row is an object
  friends: {
    component: SchemaArray,
    items: {
      name: { component: TextInput, label: 'Name' },
      role: { component: TextInput, label: 'Role' }
    },
    after: RemoveButton,
    append: AddButton,
    min: 1
  },

  // a scalar array, where each row is a single value
  tags: {
    component: SchemaArray,
    items: { component: TextInput, label: 'Tag' },
    after: RemoveButton,
    append: AddButton
  }
}
</script>
```

And `formModel` stays exactly the shape you'd expect:

```js
{
  title: 'My team',
  friends: [{ name: 'Ada', role: 'Engineer' }],
  tags: ['vue']
}
```

## Props reference

### `items`

**Required.** The schema for a single row. An object of fields gives you a group (array of objects). A single field descriptor gives you a scalar list (array of primitives).

### `after`

Optional. A component rendered after each row. Receives `index`, `count`, and `canRemove`. Emit `remove` to drop that row, or `move` (with `-1` / `1`) to reorder it.

### `append`

Optional. A component rendered once, after the list. Receives `count` and `canAdd`. Emit `add` to append a new row.

### `min` / `max`

Optional numbers that bound the list length. They surface as `canRemove` / `canAdd` on your control components, and `min` seeds blank rows when the model starts out short.
