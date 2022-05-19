<template>
  <component
    :is="behaveLikeParentSchema && !useCustomFormWrapper ? 'form' : 'div'"
    v-bind="formBinds"
  >
    <slot
      v-if="behaveLikeParentSchema"
      name="beforeForm"
      v-bind="slotBinds"
    />

    <SchemaRow
      v-for="(row, index) in parsedSchema"
      :key="index"
      :row="row"
      :schemaRowClasses="schemaRowClasses"
      :unwrappedRows="unwrappedRows"
      :sharedConfig="sharedConfig"
      :preventModelCleanupOnSchemaChange="preventModelCleanupOnSchemaChange"
    />

    <pre v-if="debug">{{ parsedSchema }}</pre>

    <slot
      v-if="behaveLikeParentSchema"
      name="afterForm"
      v-bind="slotBinds"
    />
  </component>
</template>

<script>
import useParsedSchema from './features/ParsedSchema'
import SchemaRow from './SchemaRow.vue'

import { computed } from 'vue'

import useParentSchema from './features/ParentSchema'
import useInjectedSchema from './features/InjectedSchema'
import useFormModel from './features/FormModel'

export default {
  name: 'SchemaForm',
  components: { SchemaRow },
  props: {
    schema: {
      type: [Object, Array],
      required: true,
      validator (schema) {
        if (!Array.isArray(schema)) return true
        if (schema.length === 0) return true

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
    },
    useCustomFormWrapper: {
      type: Boolean,
      default: false
    },
    debug: { type: Boolean, default: false },
    unwrappedRows: { type: Boolean, default: false }
  },
  emits: ['submit', 'update:modelValue'],
  setup (props, { emit, attrs }) {
    const { behaveLikeParentSchema, hasParentSchema } = useParentSchema()

    const { schema } = useInjectedSchema(props, behaveLikeParentSchema)
    const { parsedSchema } = useParsedSchema(schema, attrs.model)

    useFormModel(props, parsedSchema)

    const formBinds = computed(() => {
      if (hasParentSchema && !props.useCustomFormWrapper) return {}

      return {
        onSubmit: event => {
          event.preventDefault()
          emit('submit', event)
        }
      }
    })

    const slotBinds = computed(() => {
      return {}
    })

    return {
      behaveLikeParentSchema,
      parsedSchema,
      hasParentSchema,
      formBinds,
      slotBinds
    }
  }
}
</script>

<style>
.schema-row {
  display: flex;
}
</style>
