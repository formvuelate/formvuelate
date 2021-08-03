<template>
  <form @submit.prevent="$emit('submit', $event)">
    <slot name="beforeForm" />

    <SchemaForm
      :schema="currentSchema"
      preventModelCleanupOnSchemaChange
    />

    <slot name="afterForm" />
  </form>
</template>

<script>
import SchemaForm from './SchemaForm.vue'

import { computed, provide } from 'vue'
import { IS_SCHEMA_WIZARD } from './utils/constants'

export default {
  name: 'SchemaWizard',
  components: { SchemaForm },
  props: {
    schema: {
      type: Array,
      required: true
    },
    step: {
      type: Number,
      required: true,
      default: 0
    }
  },
  emits: ['submit'],
  setup (props) {
    provide(IS_SCHEMA_WIZARD, true)

    const currentSchema = computed(() => {
      return props.schema[props.step]
    })

    return { currentSchema }
  }
}
</script>
