vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, provide: vi.fn() }
})

import useSchemaForm from '../../src/features/useSchemaForm'
import { FORM_MODEL } from '../../src/utils/constants'
import * as Helpers from '../../src/utils/Helpers'

import * as Vue from 'vue'
const { isRef, ref } = Vue

describe('useSchemaForm', () => {
  beforeEach(() => {
    Vue.provide.mockClear()
  })

  it('makes the form model a ref if it isnt', () => {
    const model = {}
    const { formModel } = useSchemaForm(model)

    expect(isRef(formModel)).toEqual(true)
  })

  it('defaults to an empty object for the initial value and returns the empty ref', () => {
    const { formModel } = useSchemaForm()

    expect(isRef(formModel)).toEqual(true)
    expect(formModel.value).toEqual({})
  })

  it('provides the form model to its children', () => {
    const model = ref({ model: true })
    useSchemaForm(model)

    expect(Vue.provide).toHaveBeenCalledWith(
      FORM_MODEL,
      model
    )
  })

  it('exposes a wrapped version of the updateFormModel helper', () => {
    const spy = vi.spyOn(Helpers, 'updateFormModel')

    const model = ref({
      nested: {
        path: {
          name: ''
        }
      }
    })
    const { updateFormModel } = useSchemaForm(model)

    updateFormModel('nested.path.name', 'Marina')

    expect(spy).toHaveBeenCalledWith(
      model,
      'name',
      'Marina',
      'nested.path'
    )
  })
})
