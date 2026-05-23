<script setup>
// Same behaviour as the computed example, expressed with the `condition`
// keyword: each field declares a function of the form model that decides when it
// renders. Functions can't live in a JSON editor, so this is a live demo + Code.
import { ref } from 'vue'
import { SchemaForm, useSchemaForm } from 'formvuelate'

const userData = ref({ choice: 'A' })
useSchemaForm(userData)

const schema = {
  choice: {
    component: 'FormSelect',
    label: 'Pick a path',
    options: ['A', 'B']
  },
  fieldA: {
    component: 'FormText',
    label: 'Field for choice A',
    condition: (model) => model.choice === 'A'
  },
  fieldB: {
    component: 'FormText',
    label: 'Field for choice B',
    condition: (model) => model.choice === 'B'
  }
}
</script>

<template>
  <div class="fvl-demo">
    <SchemaForm :schema="schema" />
    <pre class="fvl-demo__model">{{ userData }}</pre>
  </div>
</template>
