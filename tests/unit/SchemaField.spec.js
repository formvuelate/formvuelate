import useSchemaForm from '../../src/features/useSchemaForm'
import SchemaField from '../../src/SchemaField'
import { UPDATE_FORM_MODEL, SCHEMA_MODEL_PATH } from '../../src/utils/constants'

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
  { mockUpdate = false, path = '' } = {}
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
    const wrapper = mount(
      SchemaFieldWrapper({
        field: {
          model: 'firstName',
          component: FormText
        }
      }, null, { mockUpdate: true })
    )

    wrapper.findComponent(FormText).vm.$emit('update:modelValue', 'test')

    expect(updateFormModel).toHaveBeenCalledTimes(1)
    expect(updateFormModel).toHaveBeenCalledWith(
      'firstName',
      'test',
      null
    )
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
})
