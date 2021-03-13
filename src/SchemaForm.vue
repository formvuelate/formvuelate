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
      <SchemaField
        v-for="field in fields"
        :key="field.model"
        :field="field"
        :sharedConfig="sharedConfig"
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
import SchemaField from './SchemaField.vue'

import { computed, watch, provide, inject, toRefs } from 'vue'

export default {
  name: 'SchemaForm',
  components: { SchemaField },
  props: {
    schema: {
      type: [Object, Array],
      required: true,
      validator (schema) {
        if (!Array.isArray(schema)) return true

        return schema.filter(field => !Array.isArray(field) && (!field.model && !field.schema)).length === 0
      }
    },
    sharedConfig: {
      type: Object,
      default: () => ({})
    },
    preventModelCleanupOnSchemaChange: {
      type: Boolean,
      default: false
    },
    nestedSchemaModel: {
      type: String,
      default: ''
    },
    schemaRowClasses: {
      type: [String, Object, Array],
      default: null
    }
  },
  emits: ['submit', 'update:modelValue'],
  setup (props, { emit, attrs }) {
    const hasParentSchema = inject('parentSchemaExists', false)
    if (!hasParentSchema) {
      provide('parentSchemaExists', true)
    }

    const { schema } = toRefs(props)
    let injectedSchema = inject('injectedSchema', false)

    if (!injectedSchema) {
      provide('injectedSchema', schema)
      injectedSchema = schema
    }

    if (props.nestedSchemaModel) {
      const path = inject('schemaModelPath', '')
      const currentPath = path ? `${path}.${props.nestedSchemaModel}` : props.nestedSchemaModel

      provide('schemaModelPath', currentPath)
    }

    const { parsedSchema } = useParsedSchema(injectedSchema, attrs.model)
    const formModel = inject('formModel', {})

    const cleanupModelChanges = (schema, oldSchema) => {
      if (props.preventModelCleanupOnSchemaChange) return

      const reducer = (acc, val) => {
        return acc.concat(val.map(i => i.model))
      }

      const newKeys = schema.reduce(reducer, [])
      const oldKeys = oldSchema.reduce(reducer, [])

      const diff = oldKeys.filter(i => !newKeys.includes(i))
      if (!diff.length) return

      for (const key of diff) {
        delete formModel.value[key]
      }
    }

    watch(parsedSchema, cleanupModelChanges)

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
