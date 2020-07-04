import { computed } from 'vue'
import useUniqueID from './UniqueID'

export default function useParsedSchema (props) {
  const { getID } = useUniqueID()

  const parsedSchema = computed(() => {
    const arraySchema = Array.isArray(props.schema)
      ? props.schema
      : Object.keys(props.schema).map(model => ({
        ...props.schema[model],
        model
      }))

    const normalizedSchema = arraySchema.map(
      field => Array.isArray(field) ? field : [field]
    )

    return normalizedSchema.map(fieldGroup => {
      return fieldGroup.map(field => ({
        ...field,
        uuid: getID(field.model)
      }))
    })
  })

  return {
    parsedSchema
  }
}
