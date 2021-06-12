<template>
  <component
    :is="behaveLikeParentSchema ? 'form' : 'div'"
    v-bind="formBinds"
  >
    <slot
      v-if="behaveLikeParentSchema"
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
      v-if="behaveLikeParentSchema"
      name="afterForm"
    />
  </component>
</template>

<script>
import useParsedSchema from './features/ParsedSchema'
import SchemaField from './SchemaField.vue'

import { computed } from 'vue'

import useParentSchema from './features/ParentSchema'
import useInjectedSchema from './features/InjectedSchema'
import useFormModel from './features/FormModel'

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
    const { behaveLikeParentSchema, hasParentSchema } = useParentSchema()

    const { schema } = useInjectedSchema(props, behaveLikeParentSchema)
    const { parsedSchema } = useParsedSchema(schema, attrs.model)

    useFormModel(props, parsedSchema)

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
      behaveLikeParentSchema,
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
