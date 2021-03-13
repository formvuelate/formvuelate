import { ref, unref, provide } from 'vue'

export default function useSchemaForm (initialFormValue = {}) {
  const formModel = ref(unref(initialFormValue))

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

  provide('updateFormModel', updateFormModel)
  provide('findNestedFormModelProp', findNestedFormModelProp)
  provide('formModel', formModel)

  return {
    formModel
  }
}
