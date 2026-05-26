<script setup>
// SchemaArray demo: a GROUP array (each row is an object). Self-contained, with
// its own model and a single SchemaForm over the one array. Components are
// referenced by string name and resolved against the globally registered demo
// components (FormText, SchemaArray, ArrayAddButton, ArrayRemoveButton).
import { ref } from 'vue'
import { useSchemaForm } from 'formvuelate'

const formData = ref({
  friends: [
    { name: 'Ada', role: 'Engineer' },
    { name: 'Grace', role: 'Designer' }
  ]
})
useSchemaForm(formData)

const schema = {
  friends: {
    component: 'SchemaArray',
    items: {
      name: { component: 'FormText', label: 'Name' },
      role: { component: 'FormText', label: 'Role' }
    },
    after: 'ArrayRemoveButton',
    append: 'ArrayAddButton',
    min: 1
  }
}
</script>

<template>
  <div class="fvl-demo">
    <SchemaForm :schema="schema" />
    <pre class="fvl-demo__model">{{ formData }}</pre>
  </div>
</template>
