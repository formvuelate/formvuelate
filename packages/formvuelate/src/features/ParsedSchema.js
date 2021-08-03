import { computed, unref } from 'vue'
import useUniqueID from './UniqueID'

/**
 * Find the elements in the row that have a schema property
 * @param {Array} row
 * @returns
 */
const findSchemaElementsInRow = (row) => {
  return row.filter(el => el.schema)
}

/**
 * Find the elements in the top level row of a schema
 * that are considered "schema" elements, aka. they have a schema prop
 * @param {Array} normalizedSchema
 * @returns
 */
const findSchemaElements = (normalizedSchema) => {
  for (const row of normalizedSchema) {
    const elements = findSchemaElementsInRow(row)
    if (elements.length) return elements
  }

  return []
}

/**
 * Traverse a schema recursively and find the schema element
 * that matches the given model
 * @param {String} model
 * @param {Array} normalizedSchema
 * @returns
 */
const findElementInSchema = (model, normalizedSchema) => {
  const schemaElements = findSchemaElements(normalizedSchema)
  const isCorrectElement = el => el?.model === model

  if (!schemaElements.length) {
    return null
  }

  for (const el of schemaElements) {
    if (isCorrectElement(el)) return el

    // Check the subschemas recursively
    const subElement = findElementInSchema(model, normalizeSchema(el.schema))
    if (isCorrectElement(subElement)) return subElement
  }

  return null
}

/**
 * Parse a user given schema into FVL internal format
 * @param {Array|Object} schema
 * @returns
 */
const normalizeSchema = (schema) => {
  const arraySchema = Array.isArray(schema)
    ? schema
    : Object.keys(schema).map(model => ({
      ...schema[model],
      model
    }))

  return arraySchema.map(
    field => Array.isArray(field) ? field : [field]
  )
}

export default function useParsedSchema (refSchema, model) {
  const { getID } = useUniqueID()

  const parsedSchema = computed(() => {
    const schema = unref(refSchema)
    let normalizedSchema = normalizeSchema(schema)

    if (model) {
      /**
       * If the model is provided, it means a SchemaForm is trying to find
       * a subschema in the main schema that corresponds to its "model" in the
       * use provided schema. We dig into the sub schemas to find it and normalize it
       * before setting it as the returned parsed schema
       */
      const element = findElementInSchema(model, normalizedSchema)
      if (element) {
        normalizedSchema = normalizeSchema(element.schema)
      }
    }

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
