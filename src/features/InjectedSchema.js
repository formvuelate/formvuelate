import { inject, provide, toRefs } from 'vue'
import { INJECTED_SCHEMA, SCHEMA_MODEL_PATH } from '../utils/constants'

export default function useInjectedSchema (props) {
  const { schema } = toRefs(props)

  let injectedSchema = inject(INJECTED_SCHEMA, false)

  if (!injectedSchema) {
    provide(INJECTED_SCHEMA, schema)
    injectedSchema = schema
  }

  if (props.nestedSchemaModel) {
    const path = inject(SCHEMA_MODEL_PATH, '')
    const currentPath = path ? `${path}.${props.nestedSchemaModel}` : props.nestedSchemaModel

    provide(SCHEMA_MODEL_PATH, currentPath)
  }

  return {
    schema: injectedSchema
  }
}
