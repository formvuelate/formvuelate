<template>
  <div>
    <SchemaForm
      :schema="currentSchema"
      :value="modelValue[step] || {}"
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
    modelValue: {
      type: Array,
      required: true
    }
  },
  setup (props, context) {
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
