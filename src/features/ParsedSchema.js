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

    for (const index in arraySchema) {
      if (!Array.isArray(arraySchema[index])) {
        arraySchema[index] = [
          arraySchema[index]
        ]
      }
    }

    return arraySchema.map(fieldGroup => {
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
