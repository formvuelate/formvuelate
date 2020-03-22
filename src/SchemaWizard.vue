<template>
  <div>
    <SchemaForm
      :schema="currentSchema"
      :value="value[step] || {}"
      @input="update"
    />

    <slot></slot>
  </div>
</template>

<script>
import { computed } from 'vue'
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
    value: {
      type: Array,
      required: true
    }
  },
  setup (props, context) {
    const currentSchema = computed(() => {
      return props.schema[props.step]
    })

    const update = data => {
      const value = [...props.value]
      value[props.step] = data

      context.emit('input', value)
    }

    return { currentSchema, update }
  }
}
</script>
