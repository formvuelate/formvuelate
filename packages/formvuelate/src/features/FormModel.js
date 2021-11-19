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
   * Loop the schema and check for `default`. If found, pre-populate the formModel
   * This should only execute on top level SchemaForm, as it will recurse the schema itself
   */
  if (!hasParentSchema) {
    forEachSchemaElement(parsedSchema, (el, path) => {
      if (!('default' in el)) return

      updateFormModel(formModel, el.model, el.default, path)
    })

    watch(parsedSchema, cleanupModelChanges)
  }
}
