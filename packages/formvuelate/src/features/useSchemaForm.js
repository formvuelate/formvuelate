import { ref, isRef, provide } from 'vue'
import { findNestedFormModelProp, updateFormModel, deleteFormModelProperty } from '../utils/Helpers'
import { UPDATE_FORM_MODEL, FIND_NESTED_FORM_MODEL_PROP, FORM_MODEL, DELETE_FORM_MODEL_PROP } from '../utils/constants'

export default function useSchemaForm (initialFormValue = {}) {
  const formModel = isRef(initialFormValue) ? initialFormValue : ref(initialFormValue)

  provide(UPDATE_FORM_MODEL, updateFormModel)
  provide(DELETE_FORM_MODEL_PROP, deleteFormModelProperty)
  provide(FIND_NESTED_FORM_MODEL_PROP, findNestedFormModelProp)
  provide(FORM_MODEL, formModel)

  return {
    formModel
  }
}
