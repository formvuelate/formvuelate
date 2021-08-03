import { inject, provide, toRefs } from 'vue'
import { INJECTED_SCHEMA, SCHEMA_MODEL_PATH } from '../utils/constants'

export default function useInjectedSchema (props, behaveLikeParentSchema) {
  const { schema } = toRefs(props)

  let injectedSchema = inject(INJECTED_SCHEMA, false)
  if (behaveLikeParentSchema) {
    // Only the top level schema form should inject the schema
    // That way we dont have to worry about injecting the prop down into
    // sub schemas
    provide(INJECTED_SCHEMA, schema)
    injectedSchema = schema
  }

  if (props.nestedSchemaModel) {
    // If the nestedSchemaModel prop is set it means this
    // component is a subschema, and we need to inform descendants
    // of the "path" for the model. ex. "info.family.parents"
    const path = inject(SCHEMA_MODEL_PATH, '')
    const currentPath = path ? `${path}.${props.nestedSchemaModel}` : props.nestedSchemaModel

    provide(SCHEMA_MODEL_PATH, currentPath)
  }

  return {
    schema: injectedSchema
  }
}
