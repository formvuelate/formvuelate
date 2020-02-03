<template>
  <div>
    <slot name="beforeForm"></slot>
    <form class="schema-form">
      <component
        v-for="field in parsedSchema"
        :key="field.model"
        :is="field.component"
        v-bind="binds(field)"
        :value="val(field)"
        @input="update(field.model, $event)"
        @update-batch="updateBatch(field.model, $event)"
      />
      {{ $v.$errors }}
      <slot/>
    </form>
    <slot name="afterForm"></slot>
  </div>
</template>

<script>
import { computed } from '@vue/composition-api'

export default {
  setup (props, context) {
    const parsedSchema = computed(() => {
      if (Array.isArray(props.schema)) return props.schema

      const arraySchema = []
      for (let model in props.schema) {
        arraySchema.push({
          ...props.schema[model],
          model
        })
      }

      return arraySchema
    })

    const update = (property, value) => {
      context.emit('input', {
        ...props.value,
        [property]: value
      })
    }

    const updateBatch = (property, values) => {
      context.emit('input', {
        ...props.value,
        ...values
      })
    }

    const binds = (field) => {
      return field.schema
        ? { schema: field.schema }
        : { ...props.sharedConfig, ...field }
    }

    const val = (field) => {
      if (field.schema && !props.value[field.model]) {
        return {}
      }

      return props.value[field.model]
    }

    return { parsedSchema, val, binds, update, updateBatch }
  },
  props: {
    schema: {
      type: [Object, Array],
      required: true,
      validator (schema) {
        if (!Array.isArray(schema)) return true

        return schema.filter(field => !field.model && !field.schema).length === 0
      }
    },
    value: {
      type: Object,
      required: true
    },
    sharedConfig: {
      type: Object,
      required: false
    }
  }
}
</script>
