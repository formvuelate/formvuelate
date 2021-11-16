import { ref, isRef, provide } from 'vue'
import { findNestedFormModelProp, updateFormModel, deleteFormModelProperty } from '../utils/Helpers'
import { UPDATE_FORM_MODEL, FIND_NESTED_FORM_MODEL_PROP, FORM_MODEL, DELETE_FORM_MODEL_PROP } from '../utils/constants'

export default function useSchemaForm (initialFormValue = {}) {
  const formModel = isRef(initialFormValue) ? initialFormValue : ref(initialFormValue)

  provide(UPDATE_FORM_MODEL, updateFormModel)
  provide(DELETE_FORM_MODEL_PROP, deleteFormModelProperty)
  provide(FIND_NESTED_FORM_MODEL_PROP, findNestedFormModelProp)
  provide(FORM_MODEL, formModel)

  /**
   * Update the form model manually providing a path to the model
   * @param {String} modelPath
   * @param {*} value
   */
  const _updateFormModel = (modelPath, value) => {
    if (typeof modelPath !== 'string') throw new Error('path for updateFormModel should be a string separated by dots (.)')

    const prop = modelPath.includes('.')
      ? modelPath.split('.').pop()
      : modelPath

    updateFormModel(
      formModel,
      prop,
      value,
      modelPath.split('.').slice(0, -1).join('.')
    )
  }

  return {
    formModel,
    updateFormModel: _updateFormModel
  }
}
