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
import { inject } from 'vue'

export default {
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
        schema: props.field.schema,
        nestedSchemaModel: props.field.model
      }
      : { ...props.sharedConfig, ...props.field }

    const formModel = inject('formModel', {})
    const fieldValue = formModel.value[props.field.model]

    const updateFormModel = inject('updateFormModel', () => { })

    const path = inject('schemaModelPath', null)

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
