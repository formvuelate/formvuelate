import { inject, watch } from 'vue'
import { FORM_MODEL } from '../utils/constants'

export default function useFormModel (props, parsedSchema) {
  const formModel = inject(FORM_MODEL, {})

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
