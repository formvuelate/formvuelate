<template>
  <div>
    <slot name="beforeForm"></slot>
    <form class="schema-form">
      <component
        v-for="field in parsedSchema"
        :key="field.model"
        :is="field.component"
        v-bind="binds(field)"
        :modelValue="val(field)"
        @update:modelValue="update(field.model, $event)"
        @update-batch="updateBatch(field.model, $event)"
      />
      <slot/>
    </form>
    <slot name="afterForm"></slot>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  props: {
    schema: {
      type: [Object, Array],
      required: true,
      validator (schema) {
        if (!Array.isArray(schema)) return true

        return schema.filter(field => !field.model && !field.schema).length === 0
      }
    },
    modelValue: {
      type: Object,
      required: true
    },
    sharedConfig: {
      type: Object,
      default: () => ({})
    }
  },
  setup (props, { emit }) {
    const parsedSchema = computed(() => {
      if (Array.isArray(props.schema)) return props.schema

      const arraySchema = []
      for (const model in props.schema) {
        arraySchema.push({
          ...props.schema[model],
          model
        })
      }

      return arraySchema
    })

    const update = (property, value) => {
      emit('update:modelValue', {
        ...props.modelValue,
        [property]: value
      })
    }

    const updateBatch = (property, values) => {
      emit('update:modelValue', {
        ...props.modelValue,
        ...values
      })
    }

    const binds = (field) => {
      return field.schema
        ? { schema: field.schema }
        : { ...props.sharedConfig, ...field }
    }

    const val = (field) => {
      if (field.schema && !props.modelValue[field.model]) {
        return {}
      }

      return props.modelValue[field.model]
    }

    return {
      parsedSchema,
      val,
      binds,
      update,
      updateBatch
    }
  }
}
</script>
