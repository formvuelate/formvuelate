<template>
  <div>
    <component
      v-bind="binds"
      :key="field.model"
      :is="field.component"
      :modelValue="fieldValue"
      @update:modelValue="update"
      class="schema-col"
    />
  </div>
</template>

<script>
import { inject, computed } from 'vue'

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

    const formModel = inject('formModel', {})
    const path = inject('schemaModelPath', null)
    const findNestedFormModelProp = inject('findNestedFormModelProp')

    const fieldValue = computed(() => {
      if (path) {
        return findNestedFormModelProp(path)[props.field.model]
      }

      return formModel.value[props.field.model]
    })

    const updateFormModel = inject('updateFormModel')

    const update = (value) => {
      updateFormModel(props.field.model, value, path)
    }

    return {
      binds,
      fieldValue,
      update
    }
  }
}
</script>
