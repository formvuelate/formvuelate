import { ref, watch, provide, h, defineComponent } from 'vue'
import { SchemaForm, useSchemaForm, constants } from 'formvuelate'

/**
 * Renders a single object array-entry as a self-contained SchemaForm over its
 * own model. It can't reuse FormVueLate's dot-path-into-array model (core has
 * no array support), so each entry owns a plain-object model and the parent
 * ArrayField reassembles the array from the entries.
 */
export default defineComponent({
  name: 'FvlArrayItem',
  props: {
    schema: { type: [Object, Array], default: () => ({}) },
    modelValue: { type: Object, default: () => ({}) }
  },
  emits: ['update:modelValue'],
  setup (props, { emit }) {
    const model = ref({ ...(props.modelValue || {}) })
    useSchemaForm(model)

    // Behave as an isolated root form over the entry's own object: run default
    // pre-population and write fields at the model root (not a nested path).
    provide(constants.PARENT_SCHEMA_EXISTS, false)
    provide(constants.SCHEMA_MODEL_PATH, '')
    provide(constants.IS_SCHEMA_WIZARD, false)

    let internal = false

    watch(
      model,
      value => {
        internal = true
        emit('update:modelValue', { ...value })
      },
      { deep: true }
    )

    watch(
      () => props.modelValue,
      value => {
        if (internal) {
          internal = false
          return
        }
        model.value = { ...(value || {}) }
      },
      { deep: true }
    )

    return () => h(SchemaForm, { schema: props.schema, useCustomFormWrapper: true })
  }
})
