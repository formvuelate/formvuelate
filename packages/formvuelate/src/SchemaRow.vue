<template>
  <template v-if="rowHasVisibleElements">
    <template v-if="unwrappedRows">
      <SchemaField
        v-for="field in row"
        :key="field.model"
        :field="field"
        v-bind="$attrs"
        class="schema-col"
      />
    </template>

    <div
      v-else
      :class="['schema-row', schemaRowClasses]"
    >
      <SchemaField
        v-for="field in row"
        :key="field.model"
        :field="field"
        v-bind="$attrs"
        class="schema-col"
      />
    </div>
  </template>
</template>

<script>
import SchemaField from './SchemaField.vue'

import { computed, inject } from 'vue'
import { FORM_MODEL } from './utils/constants'

export default {
  name: 'SchemaRow',
  components: { SchemaField },

  props: {
    row: {
      type: Array,
      required: true
    },
    schemaRowClasses: {
      type: [String, Object, Array],
      default: null
    },
    unwrappedRows: {
      type: Boolean,
      default: false
    }
  },

  setup (props) {
    const formModel = inject(FORM_MODEL, {})

    // Suppress the row's wrapper element when every field in the row is
    // hidden by a `condition`. Without this guard, schemas that use
    // conditions to hide fields would still emit empty <div class="schema-row">
    // elements (regression of #208 / fixed in #218).
    //
    // Important: this is a render-only optimization. Cleanup of formModel
    // values for fields whose conditions flip to false happens in
    // useFormModel — it watches the formModel directly so it works regardless
    // of whether the SchemaField is mounted or v-if'd out.
    const rowHasVisibleElements = computed(() => {
      for (const field of props.row) {
        if (!field.condition) return true
        if (typeof field.condition !== 'function') return true
        if (field.condition(formModel.value) === true) return true
      }

      return false
    })

    return {
      rowHasVisibleElements
    }
  }
}
</script>
