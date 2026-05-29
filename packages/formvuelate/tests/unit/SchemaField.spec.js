import useSchemaForm from '../../src/features/useSchemaForm'
import SchemaField from '../../src/SchemaField.vue'
import { UPDATE_FORM_MODEL, SCHEMA_MODEL_PATH, INJECTED_LOCAL_COMPONENTS } from '../../src/utils/constants'

import { mount } from '@vue/test-utils'
import { ref, provide } from 'vue'

const FormText = {
  template: '<input/>',
  props: ['label', 'modelValue'],
  emits: ['update:modelValue']
}

const DisplaySummary = {
  template: '<div class="summary" />',
  props: ['label', 'formModel'],
  emits: ['update:modelValue']
}

const updateFormModel = vi.fn()

const SchemaFieldWrapper = (
  binds,
  formModel = null,
  {
    mockUpdate = false,
    path = '',
    injectedLocalComponents = null
  } = {}
) => {
  return {
    components: { SchemaField },
    template: `
    <SchemaField
      v-bind="binds"
    />
  `,
    setup () {
      const form = ref({})
      useSchemaForm(formModel || form)

      if (mockUpdate) {
        provide(UPDATE_FORM_MODEL, updateFormModel)
      }

      if (path) {
        // Usually provided by SchemaForm
        provide(SCHEMA_MODEL_PATH, path)
      }

      if (injectedLocalComponents) {
        // Usually provided by SchemaFormFactory
        provide(INJECTED_LOCAL_COMPONENTS, injectedLocalComponents)
      }

      return {
        binds
      }
    }
  }
}

describe('SchemaField', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders a dynamic component', () => {
    const wrapper = mount(
      SchemaFieldWrapper({
        field: {
          model: 'firstName',
          component: FormText
        }
      })
    )

    expect(wrapper.findComponent(FormText).exists()).toBe(true)
  })

  it('calls the injected updateFormModel to update the value of the input', () => {
    const formModel = ref({})

    const wrapper = mount(
      SchemaFieldWrapper({
        field: {
          model: 'firstName',
          component: FormText
        }
      }, formModel, { mockUpdate: true })
    )

    wrapper.findComponent(FormText).vm.$emit('update:modelValue', 'test')

    expect(updateFormModel).toHaveBeenCalledTimes(1)
    expect(updateFormModel).toHaveBeenCalledWith(
      formModel,
      'firstName',
      'test',
      null
    )
  })

  it('uses the injected local components if available', () => {
    const FormText = { name: 'LocalFormText', template: '<input />' }

    const wrapper = mount(
      SchemaFieldWrapper(
        {
          field: {
            model: 'firstName',
            component: 'FormText'
          }
        }, null,
        { injectedLocalComponents: { FormText } }
      )
    )

    expect(wrapper.findComponent({ name: 'LocalFormText' }).exists()).toBe(true)
  })

  describe('binding v-model', () => {
    it('binds the correct value from the provided form model', () => {
      const model = ref({
        firstName: 'Marina'
      })

      const wrapper = mount(
        SchemaFieldWrapper({
          field: {
            model: 'firstName',
            component: FormText
          }
        }, model)
      )

      const formText = wrapper.findComponent(FormText)
      expect(formText.props().modelValue).toEqual('Marina')
    })

    it('updates the modelValue if the model changes', async () => {
      const model = ref({
        firstName: 'Marina'
      })

      const wrapper = mount(
        SchemaFieldWrapper({
          field: {
            model: 'firstName',
            component: FormText
          }
        }, model)
      )

      model.value.firstName = 'Damian'
      await wrapper.vm.$nextTick()

      const formText = wrapper.findComponent(FormText)
      expect(formText.props().modelValue).toEqual('Damian')
    })

    it('binds correctly on a nested model', () => {
      const model = ref({
        nested: {
          firstName: 'Marina'
        }
      })

      const wrapper = mount(
        SchemaFieldWrapper({
          field: {
            model: 'firstName',
            component: FormText
          }
        }, model, { path: 'nested' }
        )
      )

      const formText = wrapper.findComponent(FormText)
      expect(formText.props().modelValue).toEqual('Marina')
    })
  })

  describe('conditional schema', () => {
    it('does not display if the field condition evaluates to false', () => {
      const model = ref({
        type: 'A'
      })

      const wrapper = mount(SchemaFieldWrapper({
        field: {
          model: 'myModel',
          component: FormText,
          condition: model => model.type === 'B'
        }
      }, model))

      expect(wrapper.findComponent(FormText).exists()).toBe(false)
    })

    // Cleanup of conditional-fields when their condition flips to false is
    // now owned by useFormModel (so it works even when a row's wrapper is
    // v-if'd out by SchemaRow). The integration tests live in
    // SchemaForm.spec.js — see 'cleans up the model' and
    // 'prevents model clean up if the preventModelCleanupOnSchemaChange prop
    // is true'.
  })

  describe('read-only elements', () => {
    it('renders the component and passes the whole form model for reading', () => {
      const model = ref({
        firstName: 'Marina',
        lastName: 'Mosti'
      })

      const wrapper = mount(
        SchemaFieldWrapper({
          field: {
            model: 'summary',
            component: DisplaySummary,
            readonly: true
          }
        }, model)
      )

      const summary = wrapper.findComponent(DisplaySummary)
      expect(summary.exists()).toBe(true)
      expect(summary.props().formModel).toEqual({
        firstName: 'Marina',
        lastName: 'Mosti'
      })
    })

    it('does not wire v-model, so it can never write to the form model', () => {
      const formModel = ref({})

      const wrapper = mount(
        SchemaFieldWrapper({
          field: {
            model: 'summary',
            component: DisplaySummary,
            readonly: true
          }
        }, formModel, { mockUpdate: true })
      )

      wrapper.findComponent(DisplaySummary).vm.$emit('update:modelValue', 'nope')

      expect(updateFormModel).not.toHaveBeenCalled()
    })

    it('still respects the condition function', () => {
      const model = ref({ type: 'A' })

      const wrapper = mount(
        SchemaFieldWrapper({
          field: {
            model: 'summary',
            component: DisplaySummary,
            readonly: true,
            condition: model => model.type === 'B'
          }
        }, model)
      )

      expect(wrapper.findComponent(DisplaySummary).exists()).toBe(false)
    })
  })
})
