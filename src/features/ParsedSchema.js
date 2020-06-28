import { computed, markRaw } from 'vue'
import SchemaForm from '../SchemaForm.vue'
import useUniqueID from './UniqueID'

export default function useParsedSchema (props) {
  let { getID, UUID } = useUniqueID()

  const parsedSchema = computed(() => {
    const arraySchema = Array.isArray(props.schema)
      ? props.schema
      : Object.keys(props.schema).map(model => ({
        ...props.schema[model],
        model
      }))

    for (const index in arraySchema) {
      const field = arraySchema[index]
      if (!Array.isArray(field)) continue

      UUID++

      const replacement = {
        component: markRaw(SchemaForm),
        model: UUID,
        schema: field,
        style: 'display: flex'
      }

      arraySchema[index] = replacement
    }

    return arraySchema.map(field => ({
      ...field,
      uuid: getID(field.model)
    }))
  })

  return {
    parsedSchema
  }
}
