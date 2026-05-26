<script setup>
// SchemaArray demo: a SCALAR array (each row is a single value). Self-contained,
// with its own model and a single SchemaForm over the one array.
import { ref } from 'vue'
import { useSchemaForm } from 'formvuelate'

const formData = ref({
  tags: ['vue', 'forms']
})
useSchemaForm(formData)

const schema = {
  tags: {
    component: 'SchemaArray',
    items: { component: 'FormText', label: 'Tag' },
    after: 'ArrayRemoveButton',
    append: 'ArrayAddButton'
  }
}
</script>

<template>
  <div class="fvl-demo">
    <SchemaForm :schema="schema" />
    <pre class="fvl-demo__model">{{ formData }}</pre>
  </div>
</template>
