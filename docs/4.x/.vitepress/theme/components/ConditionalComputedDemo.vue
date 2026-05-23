<script setup>
// Conditional schema via a computed property: the schema is recomputed from the
// form model, so changing the select swaps which field is shown. Not editable
// (the logic is JS), so it's a live demo with a Code tab alongside it.
import { ref, computed } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'

const userData = ref({ choice: 'A' })
useSchemaForm(userData)

const schema = computed(() => ({
  choice: {
    component: 'FormSelect',
    label: 'Pick a path',
    options: ['A', 'B']
  },
  ...(userData.value.choice === 'A'
    ? { fieldA: { component: 'FormText', label: 'Field for choice A' } }
    : { fieldB: { component: 'FormText', label: 'Field for choice B' } })
}))
</script>

<template>
  <div class="fvl-demo">
    <SchemaForm :schema="schema" />
    <pre class="fvl-demo__model">{{ userData }}</pre>
  </div>
</template>
