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

export const updateFormModel = (formModel, prop, value, path = null) => {
  if (!path) {
    formModel.value[prop] = value
    return
  }

  findNestedFormModelProp(formModel, path)[prop] = value
}

/**
 * Delete a property in the form's model
 * @param {Ref} formModel
 * @param {String} prop
 * @param {String} path
 */
export const deleteFormModelProperty = (formModel, prop, path) => {
  if (!path) {
    delete formModel.value[prop]
    return
  }

  const nested = findNestedFormModelProp(formModel, path)
  delete nested[prop]

  // Check the parent to ensure that we dont leave empty objects behind
  const pathArray = path.split('.')
  const parentProp = pathArray.pop()
  const nestedParent = findPropertyForPath(pathArray.join('.'), formModel.value)

  if (
    nestedParent &&
    !Object.keys(nestedParent[parentProp]).length
  ) delete nestedParent[parentProp]
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
    let rowPath = path

    for (const el of row) {
      if (el.schema) {
        rowPath = rowPath === '' ? el.model : `${rowPath}.${el.model}`
        forEachSchemaElement(el.schema, fn, rowPath)
      }

      fn(el, rowPath)
    }
  }
}

/**
 * https://stackoverflow.com/questions/6393943/convert-a-javascript-string-in-dot-notation-into-an-object-reference
 * @param {String} path - The path plus the property ex. "nested.firstName" NOT "nested" by itself
 * @param {Object} object
 * @returns {*} property value
 */
export const findPropertyForPath = (path, object) => {
  return path.split('.').reduce((step, index) => step[index], object)
}

/**
 * Execute a user defined function for each element in a form model object
 * @param {Object|Ref} formModel
 * @param {Function} fn
 * @param {String} path
 */
export const forEachPropInModel = (formModel, fn, path = '') => {
  const rawModel = unref(formModel)

  for (const prop in rawModel) {
    const value = rawModel[prop]

    if (typeof value === 'object' && value !== null) {
      path = path === '' ? prop : `${path}.${prop}`
      return forEachPropInModel(value, fn, path)
    }
    fn(prop, value, path)
  }
}
