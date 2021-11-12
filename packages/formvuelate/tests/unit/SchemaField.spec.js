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

const updateFormModel = jest.fn()

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
    jest.clearAllMocks()
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

    it('clears out the model of a schema property that becomes false', async () => {
      const model = ref({
        myModel: 'this should disappear',
        type: 'A'
      })

      const wrapper = mount(SchemaFieldWrapper({
        field: {
          model: 'myModel',
          component: FormText,
          condition: model => model.type === 'A'
        }
      }, model))

      expect(model.value.myModel).toBe('this should disappear')

      model.value.type = 'B'
      await wrapper.vm.$nextTick()

      expect(model.value.myModel).toBeUndefined()
    })

    it('does not clear out the model if the prop preventModelCleanupOnSchemaChange is set to true', async () => {
      const model = ref({
        myModel: 'this should not disappear',
        type: 'A'
      })

      const wrapper = mount(SchemaFieldWrapper({
        field: {
          model: 'myModel',
          component: FormText,
          condition: model => model.type === 'A'
        },
        preventModelCleanupOnSchemaChange: true
      }, model))

      expect(model.value.myModel).toBe('this should not disappear')

      model.value.type = 'B'
      await wrapper.vm.$nextTick()

      expect(model.value.myModel).toBe('this should not disappear')
    })
  })
})
