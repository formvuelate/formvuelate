import { inject, watch, computed } from 'vue'
import { FORM_MODEL, PARENT_SCHEMA_EXISTS } from '../utils/constants'
import { forEachSchemaElement, updateFormModel, forEachPropInModel, deleteFormModelProperty } from '../utils/Helpers'

export default function useFormModel (props, parsedSchema) {
  const formModel = inject(FORM_MODEL, {})
  const hasParentSchema = inject(PARENT_SCHEMA_EXISTS, false)

  const cleanupModelChanges = (schema) => {
    if (props.preventModelCleanupOnSchemaChange) return

    forEachPropInModel(formModel, (model, value, path) => {
      let existsInSchema = false
      forEachSchemaElement(schema, (el) => {
        if (el.model === model) { existsInSchema = true }
      }, path)

      if (existsInSchema) return
      deleteFormModelProperty(formModel, model, path)
    })
  }

  /**
   * The list of `{ el, path }` for every field in the schema tree that
   * declares a `condition` function. Recomputed only when the schema itself
   * changes, so the per-keystroke cleanup watcher below stays cheap — it
   * iterates this (usually small or empty) list instead of re-walking the
   * whole schema on every model mutation.
   */
  const conditionalElements = computed(() => {
    const elements = []
    forEachSchemaElement(parsedSchema, (el, path) => {
      if (typeof el.condition === 'function') {
        elements.push({ el, path })
      }
    })
    return elements
  })

  /**
   * Clean up fields whose `condition(model)` returns false. Runs at the
   * top-level SchemaForm and sees the whole schema tree (nested included)
   * via conditionalElements. Done from here (and not inside SchemaField) so
   * the SchemaField can be safely v-if'd out by SchemaRow when an entire
   * row's fields are hidden — without that, the SchemaField unmounts before
   * its condition watcher can fire and the field's value stays orphaned.
   */
  const cleanupConditionalFields = () => {
    if (props.preventModelCleanupOnSchemaChange) return

    for (const { el, path } of conditionalElements.value) {
      if (el.condition(formModel.value) === true) continue

      deleteFormModelProperty(formModel, el.model, path)
    }
  }

  /**
   * Loop the schema and check for `default`. If found, pre-populate the formModel
   * This should only execute on top level SchemaForm, as it will recurse the schema itself
   */
  if (!hasParentSchema) {
    forEachSchemaElement(parsedSchema, (el, path) => {
      // Read-only elements never contribute a value to the form output, so a
      // `default` on one is ignored rather than seeded into the model.
      if (el.readonly) return
      if (!('default' in el)) return

      updateFormModel(formModel, el.model, el.default, path)
    })

    watch(parsedSchema, cleanupModelChanges)
    watch(formModel, cleanupConditionalFields, { deep: true })
  }
}
