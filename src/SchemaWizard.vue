<template>
  <form @submit.prevent="$emit('submit', $event)">
    <slot name="beforeForm" />

    <SchemaForm
      :schema="currentSchema"
    />

    <slot name="afterForm" />
  </form>
</template>

<script>
import { computed, provide } from 'vue'
import SchemaForm from './SchemaForm'

export default {
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
    provide('isSchemaWizard', true)

    const currentSchema = computed(() => {
      return props.schema[props.step]
    })

    return { currentSchema }
  }
}
</script>
