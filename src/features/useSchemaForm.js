import { ref, isRef, provide } from 'vue'
import { UPDATE_FORM_MODEL, FIND_NESTED_FORM_MODEL_PROP, FORM_MODEL } from '../utils/constants'

export default function useSchemaForm (initialFormValue = {}) {
  const formModel = isRef(initialFormValue) ? initialFormValue : ref(initialFormValue)

  const findNestedFormModelProp = (path) => {
    if (!path) return null

    const keys = path.split('.')

    if (!formModel.value[keys[0]]) {
      formModel.value[keys[0]] = {}
    }
    let nestedProp = formModel.value[keys[0]]

    for (let i = 1; i < keys.length; i++) {
      if (!nestedProp[keys[i]]) {
        nestedProp[keys[i]] = {}
      }

      nestedProp = nestedProp[keys[i]]
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

  provide(UPDATE_FORM_MODEL, updateFormModel)
  provide(FIND_NESTED_FORM_MODEL_PROP, findNestedFormModelProp)
  provide(FORM_MODEL, formModel)

  return {
    formModel
  }
}
