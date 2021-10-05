import { inject, watch } from 'vue'
import { FORM_MODEL, PARENT_SCHEMA_EXISTS } from '../utils/constants'
import { forEachSchemaElement, updateFormModel } from '../utils/Helpers'

export default function useFormModel (props, parsedSchema) {
  const formModel = inject(FORM_MODEL, {})
  const hasParentSchema = inject(PARENT_SCHEMA_EXISTS, false)

  /**
   * Loop the schema and check for `default`. If found, pre-populate the formModel
   * This should only execute on top level SchemaForm, as it will recurse the schema itself
   */
  if (!hasParentSchema) {
    const formModel = inject(FORM_MODEL, {})

    forEachSchemaElement(parsedSchema, (el, path) => {
      if (!('default' in el)) return

      updateFormModel(formModel, el.model, el.default, path)
    })
  }

  const cleanupModelChanges = (schema, oldSchema) => {
    if (props.preventModelCleanupOnSchemaChange) return

    const reducer = (acc, val) => {
      return acc.concat(val.map(i => i.model))
    }

    const newKeys = schema.reduce(reducer, [])
    const oldKeys = oldSchema.reduce(reducer, [])

    const diff = oldKeys.filter(i => !newKeys.includes(i))
    if (!diff.length) return

    for (const key of diff) {
      delete formModel.value[key]
    }
  }

  watch(parsedSchema, cleanupModelChanges)
}
