<template>
  <component
    :is="!hasParentSchema ? 'form' : 'div'"
    v-bind="formBinds"
  >
    <slot
      v-if="!hasParentSchema"
      name="beforeForm"
    />
    <component
      v-for="field in parsedSchema"
      :key="field.model"
      :is="field.component"
      v-bind="binds(field)"
      :modelValue="val(field)"
      @update:modelValue="update(field.model, $event)"
      @update-batch="updateBatch(field.model, $event)"
    />
    <slot
      v-if="!hasParentSchema"
      name="afterForm"
    />
  </component>
</template>

<script>
import useParsedSchema from './features/ParsedSchema'
import { computed, watch, provide, inject } from 'vue'

export default {
  props: {
    schema: {
      type: [Object, Array],
      required: true,
      validator (schema) {
        if (!Array.isArray(schema)) return true

        return schema.filter(field => {
          return !Array.isArray(field) && (!field.model && !field.schema)
        }).length === 0
      }
    },
    modelValue: {
      type: Object,
      required: true
    },
    sharedConfig: {
      type: Object,
      default: () => ({})
    },
    preventModelCleanupOnSchemaChange: {
      type: Boolean,
      default: false
    }
  },
  emits: ['submit', 'update:modelValue'],
  setup (props, { emit, attrs }) {
    console.log(attrs)
    const hasParentSchema = inject('parentSchemaExists', false)
    if (!hasParentSchema) {
      provide('parentSchemaExists', true)
    }

    const { parsedSchema } = useParsedSchema(props)

    watch(parsedSchema,
      (schema, oldSchema) => {
        if (props.preventModelCleanupOnSchemaChange) return

        const newKeys = schema.map(i => i.model)

        const diff = oldSchema.map(i => i.model).filter(i => !newKeys.includes(i))
        if (!diff.length) return

        const val = { ...props.modelValue }

        for (const key of diff) {
          delete val[key]
        }

        emit('update:modelValue', val)
      }
    )

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
        ? { schema: field.schema, ...field }
        : { ...props.sharedConfig, ...field }
    }

    const val = (field) => {
      if (field.schema && !props.modelValue[field.model]) {
        return {}
      }

      return props.modelValue[field.model]
    }

    const formBinds = computed(() => {
      if (hasParentSchema) return {}

      return {
        onSubmit: event => {
          event.preventDefault()
          emit('submit', event)
        }
      }
    })

    return {
      parsedSchema,
      val,
      binds,
      update,
      updateBatch,
      hasParentSchema,
      formBinds
    }
  }
}
</script>
