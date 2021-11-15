<template>
  <component
    v-if="schemaCondition"
    v-bind="binds"
    :is="component"
    :modelValue="fieldValue"
    @update:modelValue="update"
    class="schema-col"
  />
</template>

<script>
import { inject, computed, watch } from 'vue'
import { FIND_NESTED_FORM_MODEL_PROP, SCHEMA_MODEL_PATH, FORM_MODEL, UPDATE_FORM_MODEL, DELETE_FORM_MODEL_PROP, INJECTED_LOCAL_COMPONENTS } from './utils/constants'

export default {
  name: 'SchemaField',
  props: {
    field: {
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
  setup (props) {
    const binds = computed(() => {
      return props.field.schema
        ? {
          // For sub SchemaForm elements
          ...props.field,
          nestedSchemaModel: props.field.model
        }
        : { ...props.sharedConfig, ...props.field }
    })

    const formModel = inject(FORM_MODEL, {})
    const path = inject(SCHEMA_MODEL_PATH, null)
    const findNestedFormModelProp = inject(FIND_NESTED_FORM_MODEL_PROP)

    const fieldValue = computed(() => {
      if (path) {
        return findNestedFormModelProp(formModel, path)[props.field.model]
      }

      return formModel.value[props.field.model]
    })

    const updateFormModel = inject(UPDATE_FORM_MODEL)
    const deleteFormModelProperty = inject(DELETE_FORM_MODEL_PROP)

    const update = (value) => {
      updateFormModel(formModel, props.field.model, value, path)
    }

    const schemaCondition = computed(() => {
      const condition = props.field.condition
      if (!condition || typeof condition !== 'function') return true

      return condition(formModel.value)
    })

    // Possible local components injected by user from SchemaFormFactory
    const locals = inject(INJECTED_LOCAL_COMPONENTS, {})
    const component = computed(() => {
      return locals[props.field.component] || props.field.component
    })

    watch(schemaCondition, shouldDisplay => {
      if (shouldDisplay) return
      if (props.preventModelCleanupOnSchemaChange) return

      deleteFormModelProperty(formModel, props.field.model, path)
    })

    return {
      binds,
      fieldValue,
      update,
      schemaCondition,
      component
    }
  }
}
</script>
