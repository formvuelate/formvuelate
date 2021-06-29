import { ref, isRef, provide } from 'vue'
import { UPDATE_FORM_MODEL, FIND_NESTED_FORM_MODEL_PROP, FORM_MODEL, DELETE_FORM_MODEL_PROP } from '../utils/constants'

/**
 * Find a key inside an object, or create it if it doesn't exist
 * @param {Object} model
 * @param {String} key
 * @returns
 */
const findOrCreateProp = (model, key) => {
  if (!model[key]) {
    model[key] = {}
  }

  return model[key]
}

export default function useSchemaForm (initialFormValue = {}) {
  const formModel = isRef(initialFormValue) ? initialFormValue : ref(initialFormValue)

  const findNestedFormModelProp = (path) => {
    const keys = path.split('.')

    let nestedProp = findOrCreateProp(formModel.value, keys[0])
    for (let i = 1; i < keys.length; i++) {
      nestedProp = findOrCreateProp(nestedProp, keys[i])
    }

    return nestedProp
  }

  const updateFormModel = (prop, value, path) => {
    if (!path) {
      formModel.value[prop] = value
      return
    }

    findNestedFormModelProp(path)[prop] = value
  }

  const deleteFormModelProperty = (prop, path) => {
    if (!path) {
      delete formModel.value[prop]
      return
    }

    delete findNestedFormModelProp(path)[prop]
  }

  provide(UPDATE_FORM_MODEL, updateFormModel)
  provide(DELETE_FORM_MODEL_PROP, deleteFormModelProperty)
  provide(FIND_NESTED_FORM_MODEL_PROP, findNestedFormModelProp)
  provide(FORM_MODEL, formModel)

  return {
    formModel
  }
}
