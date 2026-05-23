<script setup>
// 100 recursively nested SchemaForms, built with a loop. Updating a deeply
// nested input doesn't re-render the rest of the tree, thanks to useSchemaForm's
// injected state. Generated in JS, so it's a live (scrollable) demo + Code tab.
import { ref } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'

const userData = ref({})
useSchemaForm(userData)

const buildNested = (depth) => {
  const level = {
    [`level${depth}`]: { component: 'FormText', label: `Level ${depth}` }
  }
  if (depth > 1) {
    level.nested = { component: 'SchemaForm', schema: buildNested(depth - 1) }
  }
  return level
}

const schema = buildNested(100)
</script>

<template>
  <div class="fvl-demo fvl-demo--scroll">
    <SchemaForm :schema="schema" />
  </div>
</template>
