<template>
  <component
    :is="!hasParentSchema ? 'form' : 'div'"
    v-bind="formBinds"
  >
    <slot
      v-if="!hasParentSchema"
      name="beforeForm"
    />

    <div
      :class="['schema-row', schemaRowClasses]"
      v-for="(fields, index) in parsedSchema"
      :key="index"
    >
      <component
        v-for="field in fields"
        v-bind="binds(field)"
        :key="field.model"
        :is="field.component"
        :modelValue="val(field)"
        @update:modelValue="update(field.model, $event)"
        @update-batch="updateBatch(field.model, $event)"
        class="schema-col"
      />
    </div>

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

        return schema.filter(field => !Array.isArray(field) && (!field.model && !field.schema)).length === 0
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
    },
    schemaRowClasses: {
      type: [String, Object, Array],
      default: null
    }
  },
  emits: ['submit', 'update:modelValue'],
  setup (props, { emit }) {
    const hasParentSchema = inject('parentSchemaExists', false)
    if (!hasParentSchema) {
      provide('parentSchemaExists', true)
    }

    const { parsedSchema } = useParsedSchema(props)

    const cleanupModelChanges = (schema, oldSchema) => {
      if (props.preventModelCleanupOnSchemaChange) return

      const reducer = (acc, val) => {
        return acc.concat(val.map(i => i.model))
      }

      const newKeys = schema.reduce(reducer, [])
      const oldKeys = oldSchema.reduce(reducer, [])

      const diff = oldKeys.filter(i => !newKeys.includes(i))
      if (!diff.length) return

      const val = { ...props.modelValue }

      for (const key of diff) {
        delete val[key]
      }

      emit('update:modelValue', val)
    }

    watch(parsedSchema, cleanupModelChanges)

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

<style>
.schema-row {
  display: flex;
}
</style>
