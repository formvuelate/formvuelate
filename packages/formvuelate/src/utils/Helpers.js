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

  delete findNestedFormModelProp(path)[prop]
}
