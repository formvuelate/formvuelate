vi.mock('vue', async (importOriginal) => {
  const actual = await importOriginal()
  return { ...actual, provide: vi.fn() }
})

import useSchemaForm from '../../src/features/useSchemaForm'
import { FORM_MODEL } from '../../src/utils/constants'
import * as Helpers from '../../src/utils/Helpers'

import { mount } from '@vue/test-utils'
import * as Vue from 'vue'
const { isRef, ref } = Vue

describe('useSchemaForm', () => {
  let warnSpy

  beforeEach(() => {
    Vue.provide.mockClear()
    // Most tests here call useSchemaForm() outside of a component setup, which
    // legitimately trips the #302 dev warning. Silence it by default and assert
    // on it explicitly in the dedicated tests below.
    warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
  })

  afterEach(() => {
    warnSpy.mockRestore()
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

  it('throws if updateFormModel is given a non-string path', () => {
    const { updateFormModel } = useSchemaForm(ref({}))

    expect(() => updateFormModel(123, 'value')).toThrow(
      'path for updateFormModel should be a string separated by dots (.)'
    )
  })

  it('updates a top-level model prop when the path has no dots', () => {
    const spy = vi.spyOn(Helpers, 'updateFormModel')

    const model = ref({ name: '' })
    const { updateFormModel } = useSchemaForm(model)

    updateFormModel('name', 'Marina')

    expect(spy).toHaveBeenCalledWith(model, 'name', 'Marina', '')
  })

  // #302: provide() only works inside setup(), so calling useSchemaForm() from
  // an event handler or async callback silently breaks the form. Surface a
  // clear dev-only warning instead of Vue's cryptic one.
  it('warns when called outside of a component setup', () => {
    useSchemaForm({})

    expect(warnSpy).toHaveBeenCalledWith(
      expect.stringContaining('useSchemaForm() must be called synchronously inside setup()')
    )
  })

  it('does not warn when called inside a component setup', () => {
    mount({
      setup () {
        useSchemaForm({})
        return () => null
      }
    })

    expect(warnSpy).not.toHaveBeenCalledWith(
      expect.stringContaining('useSchemaForm() must be called synchronously inside setup()')
    )
  })
})
