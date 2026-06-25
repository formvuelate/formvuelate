import { computed } from 'vue'
import { definePlugin, SchemaForm } from 'formvuelate'
import { convertJsonSchema } from './converter'
import { buildValidations } from './validations'
import ArrayField from './ArrayField.vue'

let uid = 0
const nextUuid = () => `fvl-json-${uid++}`

/**
 * Turn a FormVueLate object/array schema into the exact 2D-with-uuid shape that
 * SchemaForm / SchemaRow / SchemaField / FormModel consume. This mirrors what
 * core's `useParsedSchema` does — necessary because a plugin that *builds* the
 * schema from scratch (rather than transforming an already-parsed one, like
 * LookupPlugin) must return the parsed shape itself. Only the top level needs
 * this; nested object fields keep their `schema` key and core re-normalizes
 * them when each nested SchemaForm mounts.
 * @param {Object|Array} objectOrArraySchema
 * @returns {Array} 2D schema
 */
const normalizeAndId = objectOrArraySchema => {
  const arraySchema = Array.isArray(objectOrArraySchema)
    ? objectOrArraySchema
    : Object.keys(objectOrArraySchema).map(model => ({ ...objectOrArraySchema[model], model }))

  return arraySchema.map(field => {
    const row = Array.isArray(field) ? field : [field]
    return row.map(el => ({ ...el, uuid: nextUuid() }))
  })
}

/**
 * Merge user config with the runtime component defaults. The pure converter
 * defaults `object`/`array` to string names so it stays Vue-free and testable;
 * here we inject the real `SchemaForm` (string 'SchemaForm' would not resolve
 * without LookupPlugin) and the shipped `ArrayField`, while still letting the
 * user override either.
 */
const normalizeConfig = (config = {}) => ({
  ...config,
  components: { object: SchemaForm, array: ArrayField, ...(config.components || {}) }
})

/**
 * JsonSchemaPlugin
 * @param {Object} [config]
 * @param {Object|Function} [config.components] - logical-key/type -> component map
 * @param {Function} [config.mapComponent] - (node, ctx) => component, takes precedence
 * @param {Object} [config.formatComponents] - format -> component map
 * @param {Object} [config.propNames] - remap emitted prop keys (label/hint/inputType/options)
 * @param {Boolean} [config.includeValidations] - attach `validations` per field (default true)
 * @param {Object} [config.messages] - custom validation messages
 * @returns {Function}
 */
export default function JsonSchemaPlugin (config = {}) {
  const options = normalizeConfig(config)

  const setup = (baseReturns, props) => {
    const parsedSchema = computed(() => {
      const jsonSchema = props.jsonSchema
      // Without a JSON Schema, defer to the regular `schema` prop pipeline.
      if (!jsonSchema || typeof jsonSchema !== 'object') return baseReturns.parsedSchema.value

      return normalizeAndId(convertJsonSchema(jsonSchema, options))
    })

    return { ...baseReturns, parsedSchema }
  }

  // Add a reactive `jsonSchema` prop and relax the otherwise-required `schema`
  // prop (mirrors how plugin-vee-validate adds `validationSchema`).
  const extend = ({ extendSchemaFormProps }) => {
    extendSchemaFormProps({
      jsonSchema: { type: Object, default: undefined },
      schema: { type: [Object, Array], required: false, default: () => [] }
    })
  }

  return definePlugin({ setup, extend })
}

export { convertJsonSchema, buildValidations, ArrayField }
