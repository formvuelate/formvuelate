import { computed, unref } from 'vue'
import useUniqueID from './UniqueID'

const findSchemaElementsInRow = (row) => {
  return row.filter(el => el.schema)
}

const findSchemaElements = (normalizedSchema) => {
  for (const row of normalizedSchema) {
    const elements = findSchemaElementsInRow(row)
    if (elements.length) return elements
  }

  return []
}

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
