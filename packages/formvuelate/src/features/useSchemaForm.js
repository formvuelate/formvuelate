import { ref, isRef, provide, getCurrentInstance } from 'vue'
import { findNestedFormModelProp, updateFormModel, deleteFormModelProperty } from '../utils/Helpers'
import { UPDATE_FORM_MODEL, FIND_NESTED_FORM_MODEL_PROP, FORM_MODEL, DELETE_FORM_MODEL_PROP } from '../utils/constants'

export default function useSchemaForm (initialFormValue = {}) {
  // useSchemaForm relies on provide(), which Vue only allows synchronously
  // inside setup(). Calling it from an event handler or async callback (e.g.
  // to swap the model when switching tabs) fails with a cryptic Vue warning.
  // Surface a clearer, actionable message before that happens. See #302.
  if (process.env && process.env.NODE_ENV !== 'production' && !getCurrentInstance()) {
    console.warn(
      'FormVueLate: useSchemaForm() must be called synchronously inside setup(). ' +
      'Calling it from an event handler or async callback fails because it relies on provide(). ' +
      'For dynamic or multi-step forms, create the model once and update it with updateFormModel(). ' +
      'See https://formvuelate.js.org/guide/advanced-schema.html#dynamic-and-multi-step-models'
    )
  }

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
