<template>
  <form @submit.prevent="$emit('submit', $event)">
    <slot name="beforeForm" />

    <SchemaForm
      :schema="currentSchema"
      :modelValue="modelValue[step] || {}"
      @update:modelValue="update"
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
    },
    modelValue: {
      type: Array,
      required: true
    }
  },
  emits: ['submit', 'update:modelValue'],
  setup (props, context) {
    provide('parentSchemaExists', true)

    const currentSchema = computed(() => {
      return props.schema[props.step]
    })

    const update = data => {
      const value = [...props.modelValue]
      value[props.step] = data

      context.emit('update:modelValue', value)
    }

    return { currentSchema, update }
  }
}
</script>
