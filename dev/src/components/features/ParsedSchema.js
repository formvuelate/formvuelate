import { computed, h, markRaw } from 'vue'
import SchemaForm from '../SchemaForm'
import useUniqueID from './UniqueID'

const LineComponent = {
  props: {
    schema: { type: Array, required: true },
    modelValue: { type: [Array, Object], required: true }
  },
  render () {
    return h(SchemaForm, {
      style: 'display: flex;',
      class: 'schema-line',
      schema: this.schema,
      modelValue: this.modelValue,
      'onUpdate:modelValue': (val) => val
    })
  }
}

markRaw(LineComponent)

export default function useParsedSchema (props) {
  let { getID, UUID } = useUniqueID()

  const parsedSchema = computed(() => {
    const arraySchema = Array.isArray(props.schema)
      ? props.schema
      : Object.keys(props.schema).map(model => ({
        ...props.schema[model],
        model
      }))

    for (let index in arraySchema) {
      const field = arraySchema[index]
      if (!Array.isArray(field)) continue

      UUID++
      const replacement = {
        component: LineComponent,
        model: UUID,
        schema: field
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
