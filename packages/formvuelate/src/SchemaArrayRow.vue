<template>
  <SchemaForm
    v-if="!isScalar"
    :schema="items"
    useCustomFormWrapper
  />
  <component
    :is="resolvedComponent"
    v-else
    v-bind="scalarProps"
    :modelValue="modelValue"
    @update:modelValue="value => $emit('update:modelValue', value)"
  />
</template>

<script>
import { ref, computed, watch, inject, provide } from 'vue'
import SchemaForm from './SchemaForm.vue'
import useSchemaForm from './features/useSchemaForm'
import {
  PARENT_SCHEMA_EXISTS,
  SCHEMA_MODEL_PATH,
  IS_SCHEMA_WIZARD,
  INJECTED_LOCAL_COMPONENTS
} from './utils/constants'

const isObjectValue = value => value !== null && typeof value === 'object' && !Array.isArray(value)

/**
 * Renders a single array entry. When `items` describes a group (a map of
 * fields), the entry is its own isolated root SchemaForm over a per-row
 * model. Core has no array-path model, so each row owns a plain object and reports
 * changes upward. When `items` is a single field (has `component`), the entry
 * is that one component bound to the scalar element.
 */
export default {
  name: 'SchemaArrayRow',
  components: { SchemaForm },
  props: {
    items: {
      type: Object,
      default: () => ({})
    },
    modelValue: {
      type: [Object, String, Number, Boolean, Array],
      default: undefined
    }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const isScalar = computed(() => Boolean(props.items && props.items.component))

    // --- scalar row ---
    const locals = inject(INJECTED_LOCAL_COMPONENTS, {})
    const resolvedComponent = computed(() => {
      const component = props.items && props.items.component
      return typeof component === 'string' ? locals[component] || component : component
    })
    const scalarProps = computed(() => {
      const { component, model, ...rest } = props.items || {}
      void component
      void model
      return rest
    })

    // --- group row ---
    // Set up the isolated model only for group rows. provide()/useSchemaForm()
    // must run synchronously in setup, and `items` never changes shape for a
    // given row, so a one-time branch is safe.
    if (!isScalar.value) {
      const model = ref(isObjectValue(props.modelValue) ? { ...props.modelValue } : {})
      useSchemaForm(model)
      provide(PARENT_SCHEMA_EXISTS, false)
      provide(SCHEMA_MODEL_PATH, '')
      provide(IS_SCHEMA_WIZARD, false)

      // The row's own model is the source of truth for its entry, so we emit
      // upward on every change. There's no inbound sync to do: an external
      // change to the array remounts the row (SchemaArray reseeds with fresh
      // keys), which rebuilds this model from the new modelValue on setup.
      watch(
        model,
        value => emit('update:modelValue', { ...value }),
        { deep: true }
      )
    }

    return { isScalar, resolvedComponent, scalarProps }
  }
}
</script>
