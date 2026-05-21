import { inject, watch } from 'vue'
import { FORM_MODEL, PARENT_SCHEMA_EXISTS } from '../utils/constants'
import { forEachSchemaElement, updateFormModel, forEachPropInModel, deleteFormModelProperty } from '../utils/Helpers'

export default function useFormModel (props, parsedSchema) {
  const formModel = inject(FORM_MODEL, {})
  const hasParentSchema = inject(PARENT_SCHEMA_EXISTS, false)

  const cleanupModelChanges = (schema, oldSchema) => {
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
   * Walk the schema and run any conditional cleanup for fields whose
   * `condition(model)` returns false. Runs at the top-level SchemaForm and
   * sees the whole schema tree via forEachSchemaElement recursion, so nested
   * conditional fields get cleaned up too. Done from here (and not inside
   * SchemaField) so the SchemaField can be safely v-if'd out by SchemaRow
   * when an entire row's fields are hidden — without that, the SchemaField
   * unmounts before its condition watcher can fire and the conditional
   * field's value stays orphaned in the model.
   */
  const cleanupConditionalFields = () => {
    if (props.preventModelCleanupOnSchemaChange) return

    forEachSchemaElement(parsedSchema, (el, path) => {
      if (!el.condition || typeof el.condition !== 'function') return
      if (el.condition(formModel.value) === true) return

      deleteFormModelProperty(formModel, el.model, path)
    })
  }

  /**
   * Loop the schema and check for `default`. If found, pre-populate the formModel
   * This should only execute on top level SchemaForm, as it will recurse the schema itself
   */
  if (!hasParentSchema) {
    forEachSchemaElement(parsedSchema, (el, path) => {
      if (!('default' in el)) return

      updateFormModel(formModel, el.model, el.default, path)
    })

    watch(parsedSchema, cleanupModelChanges)
    watch(formModel, cleanupConditionalFields, { deep: true })
  }
}
