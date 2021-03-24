<template>
  <component
    v-if="schemaCondition"
    v-bind="binds"
    :is="field.component"
    :modelValue="fieldValue"
    @update:modelValue="update"
    class="schema-col"
  />
</template>

<script>
import { inject, computed } from 'vue'
import { FIND_NESTED_FORM_MODEL_PROP, SCHEMA_MODEL_PATH, FORM_MODEL, UPDATE_FORM_MODEL } from './utils/constants'

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
    }
  },
  setup (props) {
    const binds = props.field.schema
      ? {
        // For sub SchemaForm elements
        ...props.field,
        nestedSchemaModel: props.field.model
      }
      : { ...props.sharedConfig, ...props.field }

    const formModel = inject(FORM_MODEL, {})
    const path = inject(SCHEMA_MODEL_PATH, null)
    const findNestedFormModelProp = inject(FIND_NESTED_FORM_MODEL_PROP)

    const fieldValue = computed(() => {
      if (path) {
        return findNestedFormModelProp(path)[props.field.model]
      }

      return formModel.value[props.field.model]
    })

    const updateFormModel = inject(UPDATE_FORM_MODEL)

    const update = (value) => {
      updateFormModel(props.field.model, value, path)
    }

    const schemaCondition = computed(() => {
      const condition = props.field.condition
      if (!condition || typeof condition !== 'function') return true

      return condition(formModel.value)
    })

    return {
      binds,
      fieldValue,
      update,
      schemaCondition
    }
  }
}
</script>
