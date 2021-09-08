import { normalizeSchema } from '../features/ParsedSchema'
import { unref } from 'vue'

/**
 * Find a key inside an object, or create it if it doesn't exist
 * @param {Object} model
 * @param {String} key
 * @returns
 */
export const findOrCreateProp = (model, key) => {
  if (!model[key]) {
    model[key] = {}
  }

  return model[key]
}

export const findNestedFormModelProp = (formModel, path) => {
  const keys = path.split('.')

  let nestedProp = findOrCreateProp(formModel.value, keys[0])
  for (let i = 1; i < keys.length; i++) {
    nestedProp = findOrCreateProp(nestedProp, keys[i])
  }

  return nestedProp
}

export const updateFormModel = (formModel, prop, value, path) => {
  if (!path) {
    formModel.value[prop] = value
    return
  }

  findNestedFormModelProp(formModel, path)[prop] = value
}

export const deleteFormModelProperty = (formModel, prop, path) => {
  if (!path) {
    delete formModel.value[prop]
    return
  }

  delete findNestedFormModelProp(formModel, path)[prop]
}

/**
 * Execute a function on each of the non-schema elements in a schema
 * @param {Ref|Object} schema
 * @param {Function} fn - Function to execute with each element
 * @param {String} path - Dot notation path of the formModel tree
 */
export const forEachSchemaElement = (schema, fn, path = '') => {
  // Normalization is necessary here because FVL only normalizes
  // the top level of each nested SchemaForm component and we need to traverse
  // the whole tree
  const normalizedSchema = normalizeSchema(unref(schema))

  for (const row of normalizedSchema) {
    for (const el of row) {
      if (el.schema) {
        path = path === '' ? el.model : `${path}.${el.model}`

        forEachSchemaElement(el.schema, fn, path)
        return
      }

      fn(el, path)
    }
  }
}
