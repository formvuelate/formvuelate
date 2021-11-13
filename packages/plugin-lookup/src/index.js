import { computed, provide, unref } from 'vue'
import { constants } from 'formvuelate'

let extendedSchemaForm
/**
 * Signal ParsedSchema to replace all instances of subschema `SchemaForm` components
 * with the SchemaFormWithPlugins component
 * @param {Object} SchemaFormWithPlugins
 */
export const lookupSubSchemas = (SchemaFormWithPlugins) => {
  provide(constants.LOOKUP_PARSE_SUB_SCHEMA_FORMS, { SchemaFormWithPlugins, remapSubSchemaForms })
  extendedSchemaForm = SchemaFormWithPlugins
}

const remapSubSchemaForms = (refSchema, extendedSchemaForm) => {
  const schema = unref(refSchema)

  return mapElementsInSchema(schema, field => {
    if (extendedSchemaForm && field.component &&
      (field.component === 'SchemaForm' || field.component.name === 'SchemaForm')
    ) {
      field.component = extendedSchemaForm
    }

    return field
  })
}

/**
 * LookupPlugin
 * @param {Object} configuration
 * @param {Object|Function} configuration.mapComponents - Key value pair of component mapping or a function that returns it
 * @param {Object|Function} configuration.mapProps - Key value pair of prop mapping or a function that returns it
 * @param {Boolean} configuration.preserveMappedProps
 *
 * @returns {Function}
 */
export default function LookupPlugin ({
  mapComponents = {},
  mapProps = null,
  preserveMappedProps = false
} = {}) {
  return function (baseReturns) {
    const { parsedSchema } = baseReturns

    const replacedSchema = computed(() => {
      const schemaWithRemappedProps = mapProperties(parsedSchema.value, mapProps, { preserveMappedProps })

      const schemaWithMappedComps = mapComps(schemaWithRemappedProps, mapComponents)
      if (!extendedSchemaForm) return schemaWithMappedComps

      return remapSubSchemaForms(schemaWithMappedComps, extendedSchemaForm)
    })

    return {
      ...baseReturns,
      parsedSchema: replacedSchema
    }
  }
}

/**
 * For a Schema, find the elements in each of the rows and remap the element with the given function
 * @param {Array} schema
 * @param {Function} fn
 *
 * @returns {Array}
 */
export const mapElementsInSchema = (schema, fn) => schema.map(row => row.map(el => fn(el)))

/**
 * Remap components in a schema
 * @param {Array} schema - The schema
 * @param {Object|Function} mapComponents
 *
* @returns {Array}
 */
const mapComps = (schema, mapComponents) => {
  function mapSchemaElement (el) {
    const newKey = mapComponents[el.component]

    // recursively exhaust all sub schemas
    if (el.schema) {
      const schemaArray = Array.isArray(el.schema)
        ? el.schema
        : Object.keys(el.schema).map(model => {
          return {
            model,
            ...el.schema[model]
          }
        })

      return {
        ...el,
        component: mapComponents[el.component] || el.component,
        schema: schemaArray.map(mapSchemaElement)
      }
    }

    if (!newKey) return { ...el }

    return {
      ...el,
      component: mapComponents[el.component]
    }
  }

  return mapElementsInSchema(schema, mapSchemaElement)
}

/**
 * Remap properties in a schema
 * @param {Array} schema - The schema
 * @param {Function|Object} mapProps - A key pair value object or function that returns it
 *
 * @returns {Array}
 */
const mapProperties = (schema, mapProps, config = {}) => {
  if (!mapProps || !['object', 'function'].includes(typeof mapProps)) return schema

  if (typeof mapProps === 'function') {
    return mapPropertiesWithUserFunction(schema, mapProps, config)
  }

  let schemaCopy
  for (const prop in mapProps) {
    schemaCopy = mapElementsInSchema(schema, el => {
      return replacePropInElement(el, prop, mapProps[prop], config)
    })
  }

  return schemaCopy
}

/**
 * Remap properties using a user defined function
 * @param {Array} schema
 * @param {Function} fn
 *
 * @returns {Array} - Parsed schema
 */
const mapPropertiesWithUserFunction = (schema, fn, config = {}) => {
  const mapPropsForElement = (el, fn) => {
    const map = fn(el)
    for (const prop in map) {
      el = replacePropInElement(
        el,
        prop,
        map[prop],
        config
      )
    }

    return el
  }

  return mapElementsInSchema(schema, el => {
    return mapPropsForElement(el, fn)
  })
}

/**
 *
 * @param {Object} el - The element to replace props in
 * @param {String} prop - The prop to replace or fn to pick the prop
 * @param {String|Function|Boolean} replacement - The replacement for the prop, a function that returns it or the boolean "false" to delete it
 * @param {Object} [config={}]
 * @param {Boolean} [config.preserveMappedProps=false]
 *
 * @returns {Object} - The replaced element
 */
const replacePropInElement = (el, prop, replacement, { preserveMappedProps = false } = {}) => {
  let propReplacement = replacement
  if (typeof replacement === 'function') {
    // If replacement is a function, call it to get
    // the prop to be replaced. If its falsey, then return
    // the element as is
    propReplacement = replacement(el)

    if (!propReplacement) return el
  }

  if (!(prop in el)) {
    if (process.env && process.env.NODE_ENV !== 'production') {
      console.warn(`LookupPlugin: property "${prop}" not found in`, el)
    }

    // Return the el without replacing
    return el
  }

  const originalValue = el[prop]
  const elementCopy = { ...el }

  if (propReplacement === false || !preserveMappedProps) {
    delete elementCopy[prop]
  }

  if (propReplacement === false) {
    return elementCopy
  }

  elementCopy[propReplacement] = originalValue

  return elementCopy
}
